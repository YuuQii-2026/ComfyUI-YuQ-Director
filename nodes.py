"""ComfyUI V3 节点定义。"""

from __future__ import annotations

import hashlib
import json
from dataclasses import replace
from pathlib import Path
from typing import Any

from comfy_api.v0_0_2 import ComfyExtension, InputImpl, Types, io, ui

from .theodore_director.comfy_compat import H3VideoContextOutput
from .theodore_director.duration import calculate_h3_frames
from .theodore_director.legacy import import_legacy_script
from .theodore_director.manifest import commit_shot_result
from .theodore_director.media import load_audio, load_image, load_video
from .theodore_director.paths import OutputPaths, build_output_paths, resolve_output_file, shot_result_candidates
from .theodore_director.prompt_timing import compile_relay_prompt
from .theodore_director.references import resolve_references
from .theodore_director.schema import DEFAULT_PLAN_JSON, Plan, SecondSamplingMode, load_plan
from .theodore_director.selection import ShotSelection, select_shot
from .theodore_director.studio import prepare_shot, save_tail_frame
from .theodore_director.second_pass_relay import align_second_pass_images, apply_context, finalize_images, fingerprint, match_second_pass, source_media, state_path
from .theodore_director.video_results import (
    SecondPassRequest,
    generation_result_stage,
    parse_second_pass_request,
    write_video_result_metadata,
)

PlanType = io.Custom("THEODORE_DIRECTOR_PLAN")
ShotType = io.Custom("THEODORE_DIRECTOR_SHOT")
PathsType = io.Custom("THEODORE_DIRECTOR_PATHS")
SecondPassRequestType = io.Custom("THEODORE_DIRECTOR_SECOND_PASS_REQUEST")
FirstPassContextType = io.Custom("YUQ_FIRST_PASS_CONTEXT")

CATEGORY = "YuQ Director"


class TheodoreDirectorProject(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_Project",
            display_name="YuQ Director Project",
            category=CATEGORY,
            description="Open the full storyboard editor and emit an immutable project plan.",
            inputs=[
                io.String.Input(
                    "plan_json",
                    display_name="Project Data",
                    multiline=True,
                    default=DEFAULT_PLAN_JSON,
                    extra_dict={"theodoreDirectorProject": True},
                )
            ],
            outputs=[
                PlanType.Output("plan", display_name="PLAN"),
                io.String.Output("plan_hash", display_name="plan hash"),
                io.String.Output("project_name", display_name="project name"),
                io.Int.Output("active_shot_count", display_name="active shots"),
            ],
        )

    @classmethod
    def execute(cls, plan_json: str):
        plan = load_plan(plan_json)
        return io.NodeOutput(plan, plan.plan_hash, plan.project_name, len(plan.active_shots))

    @classmethod
    def fingerprint_inputs(cls, plan_json: str):
        return hashlib.sha256(plan_json.encode("utf-8")).hexdigest()


class TheodoreDirectorSelectShot(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_SelectShot",
            display_name="YuQ Director - Current Shot",
            category=CATEGORY,
            inputs=[
                PlanType.Input("plan"),
                io.Int.Input("queue_index", default=0, min=0, max=100000),
                io.Int.Input("base_seed", default=123456790, min=0, max=0xFFFFFFFFFFFFFFFF),
                io.Combo.Input(
                    "resume_mode",
                    options=["fresh", "resume", "retry_failed", "overwrite_current"],
                    default="fresh",
                ),
            ],
            outputs=[
                ShotType.Output("shot", display_name="SHOT"),
                io.String.Output("prompt"),
                io.String.Output("negative_prompt"),
                io.Float.Output("duration_seconds"),
                io.Int.Output("seed"),
                io.String.Output("shot_id"),
                io.Int.Output("active_index"),
                io.Int.Output("source_index"),
                io.Int.Output("active_count"),
                io.Boolean.Output("is_first"),
                io.Boolean.Output("is_last"),
                io.Int.Output("next_index"),
                io.Boolean.Output("has_next"),
                io.String.Output("shot_hash"),
                io.Boolean.Output("latent_relay", display_name="latent relay"),
                io.Boolean.Output("second_sampling", display_name="second sampling"),
                io.String.Output("second_sampling_mode", display_name="processing mode"),
                io.Boolean.Output("super_resolution_second_pass", display_name="super-res 2nd pass"),
                io.Boolean.Output("latent_upscale_second_pass", display_name="latent upscale 2nd pass"),
                io.Boolean.Output("super_resolution_only", display_name="super-res only"),
            ],
        )

    @classmethod
    def execute(cls, plan: Plan, queue_index: int, base_seed: int, resume_mode: str):
        resolved_index = queue_index
        if resume_mode in ("resume", "retry_failed"):
            import folder_paths

            from .theodore_director.manifest import is_shot_complete
            from .theodore_director.selection import shot_hash

            root = Path(folder_paths.get_output_directory()).resolve()
            while resolved_index < len(plan.active_shots):
                candidate = plan.active_shots[resolved_index]
                candidate_paths = build_output_paths(plan, candidate, resolved_index)
                # 新目录优先，旧的根层结果文件仅作为续跑兼容回退。
                complete = any(
                    is_shot_complete(
                        result_path,
                        shot_hash=shot_hash(plan, candidate),
                        plan_hash=plan.plan_hash,
                        latent_required=plan.continuity.mode == "h3_av_latent",
                    )
                    for result_path in shot_result_candidates(root, candidate_paths)
                )
                if not complete:
                    break
                resolved_index += 1
            if resolved_index >= len(plan.active_shots):
                raise ValueError("当前计划的所有启用镜头均已完成")
        selected = select_shot(plan, resolved_index, base_seed)
        shot = selected.shot
        return io.NodeOutput(
            selected,
            shot.prompt,
            shot.negative_prompt,
            shot.duration_seconds,
            selected.seed,
            shot.id,
            selected.active_index,
            selected.source_index,
            selected.active_count,
            selected.is_first,
            selected.is_last,
            selected.next_index,
            selected.has_next,
            selected.shot_hash,
            selected.latent_relay,
            selected.second_sampling,
            selected.second_sampling_mode,
            selected.super_resolution_second_pass,
            selected.latent_upscale_second_pass,
            selected.super_resolution_only,
        )


class TheodoreDirectorShotControl(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_ShotControl",
            display_name="YuQ Director - Built-in Shot Controls",
            category=CATEGORY,
            description="Read the current shot, seed, framing, continuity and output paths from the director plan.",
            inputs=[PlanType.Input("plan"), io.Int.Input("queue_index", default=0, min=0, max=100000)],
            outputs=[
                ShotType.Output("shot", display_name="SHOT"),
                PathsType.Output("paths", display_name="PATHS"),
                io.Int.Output("seed"), io.Int.Output("width"), io.Int.Output("height"),
                io.Float.Output("fps"), io.Boolean.Output("latent_relay"),
                io.Int.Output("active_index"), io.Int.Output("next_index"),
                io.String.Output("video_prefix"), io.String.Output("latent_directory"),
                io.String.Output("latent_save_prefix"), io.String.Output("tail_prefix"),
                H3VideoContextOutput("video_context"), io.Int.Output("audio_context"),
                io.Int.Output("zero_trim"),
            ],
        )

    @classmethod
    def execute(cls, plan: Plan, queue_index: int):
        control = prepare_shot(plan, queue_index)
        shot, paths = control.shot, control.paths
        return io.NodeOutput(
            shot, paths, shot.seed, control.width, control.height, float(control.fps),
            shot.latent_relay, shot.active_index, shot.next_index,
            paths.video_prefix, paths.latent_prefix, paths.latent_save_prefix, paths.tail_prefix,
            control.video_context, control.audio_context, 0,
        )


class TheodoreDirectorImageControls(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_ImageControls",
            display_name="YuQ Director - Image Controls",
            category=CATEGORY,
            description="Connect these outputs to any compatible image generation chain. Models and sampling remain on the canvas.",
            inputs=[
                PlanType.Input("plan"),
                io.String.Input("positive_prompt", default="", multiline=True),
                io.String.Input("negative_prompt", default="", multiline=True),
                io.Int.Input("width", default=1080, min=256, max=2048, step=8),
                io.Int.Input("height", default=720, min=256, max=2048, step=8),
                io.Int.Input("batch_size", default=1, min=1, max=4),
                io.Int.Input("seed", default=0, min=0, max=9007199254740991),
                io.String.Input("filename_prefix", default="TheodoreDirector/ImageGen/manual/image"),
            ],
            outputs=[io.String.Output("positive_prompt"), io.String.Output("negative_prompt"),
                     io.Int.Output("width"), io.Int.Output("height"), io.Int.Output("batch_size"),
                     io.Int.Output("seed"), io.String.Output("filename_prefix")],
        )

    @classmethod
    def execute(cls, plan, positive_prompt, negative_prompt, width, height, batch_size, seed, filename_prefix):
        return io.NodeOutput(positive_prompt, negative_prompt, width, height, batch_size, seed, filename_prefix)


class TheodoreDirectorSaveTail(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_SaveTail",
            display_name="YuQ Director - Save Last Frame",
            category=CATEGORY,
            inputs=[io.Image.Input("images"), PathsType.Input("paths"), io.Video.Input("video")],
            outputs=[io.String.Output("path")],
            is_output_node=True,
        )

    @classmethod
    def execute(cls, images, paths: OutputPaths, video):
        import folder_paths

        root = Path(folder_paths.get_output_directory()).resolve()
        height, width = images.shape[1:3]
        folder, filename, counter, _subfolder, _prefix = folder_paths.get_save_image_path(
            paths.tail_prefix, str(root), width, height,
        )
        output = (Path(folder) / f"{filename}_{counter:05}_.png").resolve(strict=False)
        output.relative_to(root)
        save_tail_frame(images, output)
        return io.NodeOutput(str(output))


class TheodoreDirectorH3Adapter(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        outputs: list[Any] = [
            io.String.Output("compiled_prompt", display_name="H3 prompt"),
            io.Int.Output("length", display_name="H3 frames"),
            io.Int.Output("expected_output_frames", display_name="delivery frames"),
            io.String.Output("reference_map", display_name="reference map"),
        ]
        outputs.extend(io.Image.Output(f"ref_image_{index}") for index in range(9))
        outputs.extend(io.Image.Output(f"ref_video_{index}") for index in range(3))
        outputs.extend(io.Audio.Output(f"ref_video_audio_{index}") for index in range(3))
        outputs.extend(io.Audio.Output(f"ref_audio_{index}") for index in range(3))
        return io.Schema(
            node_id="TheodoreDirector_H3Adapter",
            display_name="YuQ Director - MiniMax H3 Adapter",
            category=f"{CATEGORY}/Adapters",
            description="Resolve aliases, enforce official H3 limits, and load only the current shot media.",
            inputs=[PlanType.Input("plan"), ShotType.Input("shot")],
            outputs=outputs,
        )

    @classmethod
    def execute(cls, plan: Plan, shot: ShotSelection):
        reference_map = resolve_references(plan, shot.shot)
        if shot.latent_relay and plan.continuity.duration_mode == "final_output":
            reference_map = replace(reference_map, compiled_prompt=compile_relay_prompt(
                reference_map.compiled_prompt,
                context_frames=plan.continuity.video_context_frames,
                fps=plan.fps,
            ))
        generated, expected = calculate_h3_frames(
            shot.shot.duration_seconds,
            fps=plan.fps,
            # 未开启接力的镜头不会裁掉 Motion Context 帧，时长按独立镜头计算。
            is_first=not shot.latent_relay,
            context_frames=plan.continuity.video_context_frames,
            duration_mode=plan.continuity.duration_mode,
        )

        images = [load_image(asset.path) for asset in reference_map.pictures]
        videos: list[Any] = []
        paired_audio_by_id: dict[str, Any] = {}
        for asset in reference_map.videos:
            frames, audio = load_video(asset.path)
            videos.append(frames)
            if asset.include_video_audio:
                if audio is None:
                    raise ValueError(f"视频 {asset.alias} 已启用同步音轨，但文件中没有可用音轨")
                paired_audio_by_id[asset.id] = audio
        paired_audio = [paired_audio_by_id[asset.id] for asset in reference_map.paired_audio]
        standalone_audio = [load_audio(asset.path) for asset in reference_map.standalone_audio]

        values: list[Any] = [reference_map.compiled_prompt, generated, expected, reference_map.to_json()]
        values.extend(images + [None] * (9 - len(images)))
        values.extend(videos + [None] * (3 - len(videos)))

        # H3 的 ref_video_audio_N 必须与 ref_video_N 使用相同 N；没有伴音的视频保留 None。
        video_audio_slots = [paired_audio_by_id.get(asset.id) for asset in reference_map.videos]
        values.extend(video_audio_slots + [None] * (3 - len(video_audio_slots)))
        values.extend(standalone_audio + [None] * (3 - len(standalone_audio)))
        return io.NodeOutput(*values)


class TheodoreDirectorOutputPaths(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_OutputPaths",
            display_name="YuQ Director - Output Paths",
            category=CATEGORY,
            inputs=[PlanType.Input("plan"), ShotType.Input("shot")],
            outputs=[
                PathsType.Output("paths", display_name="PATHS"),
                io.String.Output("video_prefix"),
                io.String.Output("latent_prefix", display_name="latent load directory"),
                io.String.Output("latent_save_prefix"),
                io.String.Output("tail_prefix"),
                io.String.Output("manifest_path"),
                io.String.Output("shot_result_path"),
            ],
        )

    @classmethod
    def execute(cls, plan: Plan, shot: ShotSelection):
        paths = build_output_paths(plan, shot.shot, shot.active_index)
        return io.NodeOutput(
            paths,
            paths.video_prefix,
            paths.latent_prefix,
            paths.latent_save_prefix,
            paths.tail_prefix,
            paths.manifest_path,
            paths.shot_result_path,
        )


class TheodoreDirectorCommitResult(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_CommitResult",
            display_name="YuQ Director - Commit Result",
            category=CATEGORY,
            description="Commit a completed shot before Impact advances the queue.",
            is_output_node=True,
            inputs=[
                PlanType.Input("plan"),
                ShotType.Input("shot"),
                PathsType.Input("paths"),
                io.AnyType.Input("completion_signal"),
                io.String.Input("tail_path", force_input=True),
                io.String.Input("latent_path", optional=True, force_input=True),
                io.Boolean.Input("latent_required", default=True),
                io.Boolean.Input("first_pass_only", default=False, optional=True),
                FirstPassContextType.Input("first_pass_context", optional=True),
            ],
            outputs=[
                io.AnyType.Output("signal"),
                io.Int.Output("next_index"),
                io.Boolean.Output("has_next"),
                io.String.Output("result_json"),
            ],
        )

    @classmethod
    def execute(
        cls,
        plan: Plan,
        shot: ShotSelection,
        paths: OutputPaths,
        completion_signal: Any,
        tail_path: str,
        latent_required: bool,
        latent_path: str = "",
        first_pass_only: bool = False,
        first_pass_context=None,
    ):
        import folder_paths

        root = Path(folder_paths.get_output_directory()).resolve()
        video = resolve_output_file(
            root,
            paths.video_prefix,
            (".mp4", ".webm", ".mov", ".mkv"),
            expected_prefix=paths.video_prefix,
        )
        tail = resolve_output_file(
            root,
            tail_path,
            (".png", ".jpg", ".jpeg", ".webp"),
            expected_prefix=paths.tail_prefix,
        )
        latent = (
            resolve_output_file(
                root,
                latent_path,
                (".safetensors",),
                expected_prefix=paths.latent_save_prefix,
            )
            if latent_required
            else None
        )
        # 为每个新结果记录一采/二采阶段；没有该伴随文件的旧视频仍按 legacy_unknown 兼容。
        stage, processing_mode = generation_result_stage(shot.shot.second_sampling_mode, first_pass_only=first_pass_only)
        relay = None
        if first_pass_context is not None:
            from .theodore_director.first_pass_continuity import commit_metadata

            if stage != "first_pass":
                raise ValueError("原生一采接力必须连接独立一采保存链")
            relay = commit_metadata(root, plan, shot, paths, video, first_pass_context)
        write_video_result_metadata(
            video,
            stage=stage,
            shot_id=shot.shot.id,
            plan_hash=plan.plan_hash,
            processing_mode=processing_mode,
            relay=relay,
        )
        result = commit_shot_result(
            result_path=root / paths.shot_result_path,
            manifest_path=root / paths.manifest_path,
            shot_id=shot.shot.id,
            shot_hash=shot.shot_hash,
            plan_hash=plan.plan_hash,
            video_path=video,
            tail_path=tail,
            latent_path=latent,
            latent_required=latent_required,
        )
        from .theodore_director.resource_cleanup import cleanup_replaced_shot

        cleanup_replaced_shot(
            root,
            plan.project_name,
            plan.run_id,
            shot.shot.id,
            video,
            tail,
            latent,
        )
        return io.NodeOutput(completion_signal, shot.next_index, shot.has_next, json.dumps(result.__dict__, ensure_ascii=False))


class TheodoreDirectorPostprocessSecondPassSource(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_PostprocessSecondPassSource",
            display_name="YuQ Director - Postprocess Second Pass Source",
            category=f"{CATEGORY}/Postprocess",
            description="Validate and load one saved first-pass result for the standalone second-pass branch.",
            inputs=[
                io.String.Input(
                    "request_json",
                    display_name="Second-pass request",
                    multiline=True,
                    default="{}",
                    extra_dict={"theodoreDirectorSecondPassRequest": True},
                ),
                io.Boolean.Input("native_continuity", default=False, optional=True,
                                 tooltip="原生二采测试：保护上一段高清 latent，并在合并时使用连续上下文解码"),
                io.Boolean.Input("diagnose_latent", default=False, optional=True,
                                 tooltip="latent 二采额外保存原片、编码往返、放大直解码、采样结果及逐帧亮度"),
                io.Boolean.Input("latent_full_sequence", default=False, optional=True,
                                 tooltip="测试：3D 放大器关闭时间分块并用 fp32 推理，显存占用增加"),
            ],
            outputs=[
                PlanType.Output("plan", display_name="PLAN"),
                ShotType.Output("shot", display_name="SHOT"),
                SecondPassRequestType.Output("request", display_name="REQUEST"),
                io.Image.Output("images"),
                io.Audio.Output("audio"),
                io.Float.Output("fps"),
                io.Int.Output("seed"),
                io.String.Output("processing_mode", display_name="processing mode"),
                io.Boolean.Output("super_resolution_second_pass", display_name="super-res 2nd pass"),
                io.Boolean.Output("latent_upscale_second_pass", display_name="latent upscale 2nd pass"),
                io.Boolean.Output("super_resolution_only", display_name="super-res only"),
                io.Int.Output("source_width"),
                io.Int.Output("source_height"),
                io.Int.Output("frame_count"),
                io.Audio.Output("original_audio"),
            ],
        )

    @classmethod
    def execute(cls, request_json: str, native_continuity: bool = False,
                diagnose_latent: bool = False, latent_full_sequence: bool = False):
        import folder_paths

        root = Path(folder_paths.get_output_directory()).resolve()
        data = json.loads(request_json)
        if native_continuity:
            from .theodore_director.native_continuity import POLICY

            data["continuityMode"] = POLICY
        request = parse_second_pass_request(root, data)
        if native_continuity and request.relay:
            from dataclasses import replace

            request = replace(request, output_prefix=request.output_prefix + "_native_v1")
        from .theodore_director.render_source import path_for

        components = InputImpl.VideoFromFile(str(path_for(root, request))).get_components()
        if components.audio is None:
            raise ValueError("单独二采要求源视频包含音轨，当前结果没有可用音频")
        images, audio = source_media(request, components, root, InputImpl.VideoFromFile)
        if diagnose_latent and request.processing_mode == "latent_upscale_second_pass":
            request.media.update(diagnose_latent=True, diagnostic_source=images)
        return io.NodeOutput(
            request.plan,
            request.shot,
            request,
            images,
            audio,
            float(components.frame_rate),
            request.shot.seed,
            request.processing_mode,
            request.processing_mode == SecondSamplingMode.SUPER_RESOLUTION_SECOND_PASS.value,
            request.processing_mode == SecondSamplingMode.LATENT_UPSCALE_SECOND_PASS.value,
            request.processing_mode == SecondSamplingMode.SUPER_RESOLUTION_ONLY.value,
            int(components.images.shape[2]),
            int(components.images.shape[1]),
            int(images.shape[0]),
            components.audio,
        )

    @classmethod
    def fingerprint_inputs(cls, request_json: str, native_continuity: bool = False,
                           diagnose_latent: bool = False, latent_full_sequence: bool = False):
        # requestId 每次点击都会变化，确保相同源视频也能按用户请求重新排队。
        return hashlib.sha256(f"{native_continuity}:{diagnose_latent}:{latent_full_sequence}:{request_json}".encode("utf-8")).hexdigest()


class TheodoreDirectorLoadTimeline(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(node_id="TheodoreDirector_LoadTimeline", display_name="YuQ 整片超分 · 读取一采合并视频",
                         category=f"{CATEGORY}/Postprocess",
                         inputs=[io.String.Input("output_video", default="", tooltip="导播台合并结果的 output 相对路径")],
                         outputs=[io.Image.Output("images"), io.Audio.Output("audio"), io.Float.Output("fps")])

    @classmethod
    def execute(cls, output_video):
        import folder_paths
        from .theodore_director.timeline_source import load

        return io.NodeOutput(*load(Path(folder_paths.get_output_directory()).resolve(), output_video, InputImpl.VideoFromFile))

    @classmethod
    def fingerprint_inputs(cls, output_video):
        import folder_paths
        from .theodore_director.second_pass_relay import checked_file

        try:
            return fingerprint(checked_file(Path(folder_paths.get_output_directory()).resolve(), output_video))
        except (OSError, ValueError):
            return float("nan")


class TheodoreDirectorLatentProbe(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(node_id="TheodoreDirector_LatentProbe", display_name="YuQ latent · 记录诊断阶段",
                         category=f"{CATEGORY}/Postprocess",
                         inputs=[io.Latent.Input("latent"), SecondPassRequestType.Input("request"),
                                 io.Combo.Input("stage", options=["encoded", "upscaled"])],
                         outputs=[io.Latent.Output("latent")])

    @classmethod
    def execute(cls, latent, request, stage):
        from .theodore_director.latent_diagnostics import capture

        return io.NodeOutput(capture(latent, request, stage))


class TheodoreDirectorSecondPassAlign(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(node_id="TheodoreDirector_SecondPassAlign",
                         display_name="YuQ Director - Align Second Pass Images",
                         category=f"{CATEGORY}/Postprocess",
                         inputs=[io.Image.Input("images")], outputs=[io.Image.Output("images")])

    @classmethod
    def execute(cls, images):
        return io.NodeOutput(align_second_pass_images(images))


class TheodoreDirectorSecondPassRelay(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_SecondPassRelay",
            display_name="YuQ Director - Second Pass Motion Context",
            category=f"{CATEGORY}/Postprocess",
            inputs=[io.Conditioning.Input("conditioning"), io.Latent.Input("latent"),
                    io.Vae.Input("vae"), SecondPassRequestType.Input("request"),
                    io.Latent.Input("audio_latent", optional=True,
                                    tooltip="原生测试：连接 VAEEncodeAudio 的原音频输出")],
            outputs=[io.Conditioning.Output("conditioning"), io.Latent.Output("latent")],
        )

    @classmethod
    def execute(cls, conditioning, latent, vae, request, audio_latent=None):
        from .theodore_director.native_continuity import enabled, prepare_target

        if enabled(request):
            import folder_paths

            return io.NodeOutput(*prepare_target(conditioning, latent, request,
                                                 Path(folder_paths.get_output_directory()).resolve(),
                                                 audio_latent=audio_latent))
        if not request.relay.get("parent"):
            return io.NodeOutput(conditioning, latent)
        import folder_paths
        import nodes as comfy_nodes

        context_class = comfy_nodes.NODE_CLASS_MAPPINGS.get("MiniMaxH3MotionContext")
        if context_class is None:
            raise ValueError("二采接力需要安装 H3 Motion Context，请安装后重启 ComfyUI")
        return io.NodeOutput(apply_context(conditioning, latent, vae, request,
                                         Path(folder_paths.get_output_directory()).resolve(), context_class), latent)


class TheodoreDirectorSecondPassJoinMatch(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_SecondPassJoinMatch",
            display_name="YuQ Director - Second Pass Join Match",
            category=f"{CATEGORY}/Postprocess",
            inputs=[io.Latent.Input("samples"), SecondPassRequestType.Input("request"),
                    io.Float.Input("strength", default=1.0, min=0.0, max=1.5, step=0.05)],
            outputs=[io.Latent.Output("samples")],
        )

    @classmethod
    def execute(cls, samples, request, strength=1.0):
        from .theodore_director.native_continuity import accept_sample, enabled

        if enabled(request):
            import folder_paths

            return io.NodeOutput(accept_sample(samples, request, Path(folder_paths.get_output_directory()).resolve()))
        if not request.relay.get("parent") or strength == 0:
            return io.NodeOutput(samples)
        import folder_paths
        import nodes as comfy_nodes

        match_class = comfy_nodes.NODE_CLASS_MAPPINGS.get("MiniMaxH3JoinMatch")
        if match_class is None:
            raise ValueError("二采接缝匹配需要 H3 Join Match，请更新 H3 Motion Context 并重启 ComfyUI")
        return io.NodeOutput(match_second_pass(samples, request,
                            Path(folder_paths.get_output_directory()).resolve(), match_class, strength))


class TheodoreDirectorFirstPassTarget(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_FirstPassTarget",
            display_name="YuQ 一采 · 原生 AV 保护区（测试）",
            category=f"{CATEGORY}/Continuity",
            inputs=[PlanType.Input("plan"), ShotType.Input("shot"),
                    io.Conditioning.Input("conditioning"), io.Latent.Input("latent")],
            outputs=[io.Conditioning.Output("conditioning"), io.Latent.Output("latent"),
                     FirstPassContextType.Output("context"), io.Int.Output("trim_frames")],
        )

    @classmethod
    def execute(cls, plan, shot, conditioning, latent):
        import folder_paths
        from .theodore_director.first_pass_continuity import prepare_target

        return io.NodeOutput(*prepare_target(plan, shot, conditioning, latent,
                             Path(folder_paths.get_output_directory()).resolve()))

    @classmethod
    def fingerprint_inputs(cls, plan, shot, conditioning, latent):
        import folder_paths
        from .theodore_director.first_pass_continuity import cache_fingerprint

        return cache_fingerprint(plan, shot, Path(folder_paths.get_output_directory()).resolve())


class TheodoreDirectorFirstPassFinalize(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_FirstPassFinalize",
            display_name="YuQ 一采 · 校验保护区与连续解码（测试）",
            category=f"{CATEGORY}/Continuity",
            inputs=[io.Latent.Input("latent"), FirstPassContextType.Input("context"), io.Vae.Input("vae")],
            outputs=[io.Latent.Output("latent"), FirstPassContextType.Output("context")],
        )

    @classmethod
    def execute(cls, latent, context, vae):
        import folder_paths
        from fractions import Fraction
        from .theodore_director.first_pass_continuity import finalize

        def save_video(frames, audio, path):
            video = InputImpl.VideoFromComponents(
                Types.VideoComponents(images=frames, audio=audio, frame_rate=Fraction(24)),
                bit_depth=8, color_space="sRGB")
            video.save_to(str(path), format=Types.VideoContainer("mp4"), codec="auto")

        return io.NodeOutput(*finalize(latent, vae, context, Path(folder_paths.get_output_directory()).resolve(),
                             InputImpl.VideoFromFile, save_video))


class TheodoreDirectorSecondPassFinalize(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_SecondPassFinalize",
            display_name="YuQ Director - Second Pass Trim & Save Context",
            category=f"{CATEGORY}/Postprocess",
            inputs=[io.Image.Input("images"), io.Latent.Input("latent"),
                    io.Latent.Input("audio_latent"), SecondPassRequestType.Input("request"),
                    io.Vae.Input("vae", optional=True)],
            outputs=[io.Image.Output("images")],
        )

    @classmethod
    def execute(cls, images, latent, audio_latent, request, vae=None):
        import folder_paths
        from .theodore_director.native_continuity import enabled, save_parent_context, validate_sample

        root = Path(folder_paths.get_output_directory()).resolve()
        if enabled(request):
            if vae is None:
                raise ValueError("原生二采测试需要把视频 VAE 连接到接力保存节点")
            validate_sample(latent, audio_latent, request, root)
            from fractions import Fraction

            def save_video(frames, audio, path):
                video = InputImpl.VideoFromComponents(
                    Types.VideoComponents(images=frames, audio=audio, frame_rate=Fraction(24)),
                    bit_depth=8, color_space="sRGB")
                video.save_to(str(path), format=Types.VideoContainer("mp4"), codec="auto")

            save_parent_context(latent, vae, request, root, InputImpl.VideoFromFile, save_video)
        if request.media.get("diagnose_latent"):
            from fractions import Fraction
            from .theodore_director.latent_diagnostics import export

            def save_probe(frames, audio, path):
                video = InputImpl.VideoFromComponents(Types.VideoComponents(
                    images=frames, audio=audio, frame_rate=Fraction(str(request.media["fps"]))),
                    bit_depth=8, color_space="sRGB")
                video.save_to(str(path), format=Types.VideoContainer("mp4"), codec="auto")

            export(request, images, vae, root, save_probe)
        return io.NodeOutput(finalize_images(images, latent, audio_latent, request, root))


class TheodoreDirectorSaveSecondPass(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_SaveSecondPass",
            display_name="YuQ Director - Save Standalone Second Pass",
            category=f"{CATEGORY}/Postprocess",
            description="Save a standalone second-pass video without overwriting the selected first pass.",
            inputs=[
                io.Video.Input("video"),
                SecondPassRequestType.Input("request"),
            ],
            outputs=[
                io.Video.Output("video"),
                io.String.Output("path"),
            ],
            is_output_node=True,
        )

    @classmethod
    def execute(cls, video, request: SecondPassRequest):
        import folder_paths

        root = Path(folder_paths.get_output_directory()).resolve()
        width, height = video.get_dimensions()
        full_folder, filename, counter, subfolder, _prefix = folder_paths.get_save_image_path(
            request.output_prefix,
            str(root),
            width,
            height,
        )
        file_name = f"{filename}_{counter:05}_.mp4"
        output_path = (Path(full_folder) / file_name).resolve(strict=False)
        try:
            output_path.relative_to(root)
        except ValueError as error:
            raise ValueError(f"拒绝把二采结果写入 ComfyUI output 之外: {output_path}") from error

        video.save_to(str(output_path), format=Types.VideoContainer("mp4"), codec="auto")
        from .theodore_director.render_source import check

        check(root, request.source_context)
        stage = "upscaled" if request.processing_mode == SecondSamplingMode.SUPER_RESOLUTION_ONLY.value else "second_pass"
        relay = dict(request.relay)
        if relay:
            state = state_path(root, request)
            if not state.is_file():
                raise ValueError("二采接力状态未保存，请使用带接力处理节点的新版工作流")
            relay.update(state=state.relative_to(root).as_posix(), stateFingerprint=fingerprint(state),
                         videoFingerprint=fingerprint(output_path))
        write_video_result_metadata(
            output_path,
            stage=stage,
            shot_id=request.shot.shot.id,
            plan_hash=request.plan.plan_hash,
            source_path=request.source_relative,
            processing_mode=request.processing_mode,
            relay=relay,
            source_context=request.source_context,
        )
        from .theodore_director.resource_cleanup import cleanup_replaced_shot

        if not request.relay:
            cleanup_replaced_shot(root, request.plan.project_name, request.plan.run_id,
                                  request.shot.shot.id, output_path)
        relative = output_path.relative_to(root).as_posix()
        return io.NodeOutput(
            video,
            relative,
            ui=ui.PreviewVideo([ui.SavedResult(file_name, subfolder, io.FolderType.output)]),
        )


class TheodoreDirectorLegacyImport(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="TheodoreDirector_LegacyImport",
            display_name="YuQ Director - Import Legacy Script",
            category=f"{CATEGORY}/Migration",
            inputs=[
                io.String.Input("script", multiline=True, default="## Shot 1\n& 5 &\nWrite the prompt here."),
                io.String.Input("project_name", default="Imported Project"),
                io.Int.Input("base_seed", default=123456790, min=0, max=0xFFFFFFFFFFFFFFFF),
            ],
            outputs=[
                io.String.Output("plan_json", display_name="imported plan JSON"),
                PlanType.Output("plan", display_name="PLAN"),
            ],
        )

    @classmethod
    def execute(cls, script: str, project_name: str, base_seed: int):
        plan_json = import_legacy_script(script, project_name=project_name, base_seed=base_seed)
        return io.NodeOutput(plan_json, load_plan(plan_json))


class TheodoreDirectorExtension(ComfyExtension):
    async def on_load(self):
        # 路由延迟注册，保证纯 Python 测试不依赖正在运行的 PromptServer。
        from .server import register_routes

        register_routes()

    async def get_node_list(self):
        return [
            TheodoreDirectorProject,
            TheodoreDirectorSelectShot,
            TheodoreDirectorShotControl,
            TheodoreDirectorSaveTail,
            TheodoreDirectorImageControls,
            TheodoreDirectorH3Adapter,
            TheodoreDirectorOutputPaths,
            TheodoreDirectorCommitResult,
            TheodoreDirectorFirstPassTarget,
            TheodoreDirectorFirstPassFinalize,
            TheodoreDirectorPostprocessSecondPassSource,
            TheodoreDirectorLoadTimeline,
            TheodoreDirectorLatentProbe,
            TheodoreDirectorSecondPassAlign,
            TheodoreDirectorSecondPassRelay,
            TheodoreDirectorSecondPassJoinMatch,
            TheodoreDirectorSecondPassFinalize,
            TheodoreDirectorSaveSecondPass,
            TheodoreDirectorLegacyImport,
        ]
