---
name: h3-seg-prompt-design
description: 为 YuQ 导播台设计或修订 MiniMax H3 Ref2VA 短剧分镜、参考素材、连续性和声音；输出可直接导入导播台的系列素材库与单集分镜计划。
metadata:
  short-description: YuQ 导播台 × MiniMax H3 分镜与素材计划
---

# YuQ 导播台 × MiniMax H3

先解决剧情因果、观看信息和人物状态，再安排镜头、生成段与 Ref2VA。沿用已确认的剧本、Subject、素材、声线、种子和参数；局部修订只改命中项。所有成品应能从 YuQ 导播台网页导入、审片、重生、二采和回写配置，当前工作流为 `YuQ导播台.json`。

## 执行顺序

1. **因果**：每场写清目标、阻力、可见证据、选择和结果；每镜至少改变观众信息或人物关系。先修剧本与中文分镜，再写英文提示词，不用气氛、反应或机械正反打填时长。
2. **整场镜头**：先确定观看节点、人物调度、空间锚点、动作触发与结果，再划生成段。不按台词逐句换景，不预设镜头数量；移动、切镜和反应都必须带来新信息。
3. **生成段**：自然排对白、动作和必要停顿，按并行时间并集得到 5–15 秒；过短合并，过长重排。动作完成后进入结果或下一事件，不用空等、重复操作、回头、慢放补时。
4. **接力**：同一未剪切镜头、同一时间线、机位和动作连续时，后段设置 `latentRelay: true`；首段为 `false`。换机位、换场或真实跳时独立生成。分镜标记、提示词标题和导出字段必须一致，并复述当前接缝首帧。

## Ref2VA 装配

- 每段只定义当前可见的 `Subject`，稳定编号绑定 `lock:subject:N`、素材别名和声音 `Sx`；六字段顺序固定为 `subject_definitions`、`summary`、`retention_analysis`、`detailed_description`、`overall_soundscape`、`non_diegetic_music`。
- `detailed_description` 以 `lock:style` 开头，随后写首帧、空间、状态、触发、过程、结果、镜头与对白。原声台词只放 `<d>`，不抄进视觉描述；说话者只在自己的发声窗开口，听者闭口。
- 全程把无画面文字作为正向约束：`Dialogue is heard only as speech. The entire image remains free of subtitles, captions, letters, readable text, logos and watermarks.` 不依赖当前 Turbo + BasicGuider 的负向输入。
- `{{ref:别名}}` 由导播台编译成 H3 标签；项目提示词不手写 `<Picture N>`、`<Video N>`、`<Audio N>`。视频伴音仅在素材登记 `includeVideoAudio` 后写 `{{ref:别名.audio}}`。
- 参考素材取当前段的最小集合：人物用纯白底单张三视图加面部合图，场景用无人单幅全景或俯视全景，道具用纯白底单件静物。不要把人物表演、手、持有者、旁置照片、拼贴或故事状态写进静态素材提示词。
- 每段最多 9 张图片、3 个参考视频、3 路有效音频、12 个混合输入文件；视频和每路有效音频均为 2–15 秒，视频总时长和有效音频总时长均不超过 15 秒；音频不能单独作为唯一参考。生图参数沿用用户最近设置，未设置才使用 1080×720。

## YuQ 计划协议

- 以 `DirectorPlan` 为唯一配置源：项目名、Run ID、FPS、基础 seed、连续性、素材库和分镜都写入计划；网页保存后回写工作流 `plan_json`。
- 系列共用 `<系列>.assets.json`，单集使用 `<系列>·<集号>·<标题>.episode.json`。素材用唯一别名关联，不在单集重复路径或生图提示词；媒体文件由导播台素材库管理。
- 分镜至少包含 `id`、`title`、`prompt`、`durationSeconds`、`enabled`、`latentRelay`、`secondSamplingMode`、`seed` 和 `disabledAssetIds`。二采模式只使用 `off`、`super_resolution_second_pass`、`latent_upscale_second_pass`、`super_resolution_only`。
- 连续性默认使用 `h3_av_latent`、视频上下文 22 帧、音频上下文 24 帧、`final_output`；只有实际工作流支持并裁切 AV 上下文时才写接力时间偏移。

## YuQ 工作流

按“导入计划 → 素材库生成提示词/批量导入 → 保存 → 一采 → 逐段审片与重生 → 整体二采 → 合并成片”执行。网页是日常配置入口；高级字段通过导出、编辑、重新导入 JSON 处理。不要再手动点 ComfyUI Queue。

交付文件保持导出器识别的五份 Markdown：`一致性圣经.md`、`素材映射.md`、`参考素材生成提示词.md`、`分镜设计.md`、`H3分镜提示词.md`，另交系列 `.assets.json` 与单集 `.episode.json`。只写当前作品成品，不新增案例、模板、占位内容或重复清单。

## 验收与修订

在 skill 目录执行：

```powershell
node scripts/director.mjs "<本集目录>"
```

修复所有 ERROR；WARNING 必须结合实际成片、音频和素材状态判断。逐段核对对白原文、自然净发声时间、一次性动作、首尾状态、空间轴线、参考预算、`latentRelay` 三处一致性及真实 AV latent 接入。文件校验、导入成功和用户审片分别记录为“文件层已验证”“导入已验证”“用户复测通过/失败”。

按需读取对应 reference：叙事读 `storytelling.md`，镜头读 `camera-movement.md`，连续性读 `consistency-locks.md`，声音读 `voice-and-sound.md` 与 `pronunciation.md`，素材读 `reference-image-prompts.md`，协议读 `director-json.md` 与 `h3-full-reference-guide.md`，修订边界读 `workflow-rules.md` 与 `sources.md`。不要把案例或项目数据写回 skill。
