import json
from pathlib import Path

from theodore_director.schema import load_plan


COPYRIGHT_NOTICE = "### 本工作流由抖音博主Theodore（抖音号:q1503623946）以及 b站up主 南极来の企鹅制作。"
WORKFLOW_NAME = "YuQ导播台.json"
REQUIRED_DIRECTOR_NODES = {
    "TheodoreDirector_Project",
    "TheodoreDirector_ShotControl",
    "TheodoreDirector_SaveTail",
    "TheodoreDirector_ImageControls",
    "TheodoreDirector_H3Adapter",
    "TheodoreDirector_CommitResult",
    "TheodoreDirector_PostprocessSecondPassSource",
    "TheodoreDirector_SaveSecondPass",
}


def load_distributed_workflow():
    path = Path(__file__).parents[1] / "workflows" / WORKFLOW_NAME
    return json.loads(path.read_text(encoding="utf-8"))


def test_distributed_workflow_is_structurally_valid():
    data = load_distributed_workflow()
    nodes = data["nodes"]
    nodes_by_id = {item["id"]: item for item in nodes}
    node_ids = set(nodes_by_id)
    assert len(node_ids) == len(nodes)
    # ComfyUI 链接格式为：link id、源节点、源槽位、目标节点、目标槽位、类型。
    assert all(link[1] in node_ids and link[3] in node_ids for link in data["links"])
    for link_id, origin, origin_slot, destination, destination_slot, _kind in data["links"]:
        # 除端点外也校验 LiteGraph 在节点槽位中缓存的链接，避免 JSON 能解析但画布断线。
        assert link_id in (nodes_by_id[origin]["outputs"][origin_slot].get("links") or [])
        assert nodes_by_id[destination]["inputs"][destination_slot].get("link") == link_id
    assert REQUIRED_DIRECTOR_NODES <= {item["type"] for item in nodes}

    project = next(item for item in nodes if item["type"] == "TheodoreDirector_Project")
    plan = load_plan(project["widgets_values"][0])
    assert len(plan.active_shots) >= 1
    assert plan.schema_version == 5
    assert data["extra"]["theodoreDirector"]["workflowVersion"] == "YuQ-2.1"
    assert data["extra"]["theodoreDirector"]["variant"] == "yuq_h3_first_review_second"


def test_yuq_first_pass_and_shared_postprocess_topology():
    data = load_distributed_workflow()
    types = [item["type"] for item in data["nodes"]]
    # 一采只保留一个采样器，高清处理复用网页的独立后处理链。
    assert len(data["nodes"]) == 93  # 包含二采画幅对齐。
    assert types.count("SamplerCustomAdvanced") == 3
    assert types.count("SelfLiftH3Sampler") == 1
    assert types.count("RTXVideoSuperResolution") == 1
    assert types.count("MinimaxH3LatentUpscaler3D") == 1
    assert types.count("MiniMaxH3ConditioningUpscale") == 1
    assert types.count("MiniMaxH3AddNoise") == 2
    assert types.count("ImpactConditionalBranch") == 4

    links_by_id = {item[0]: item for item in data["links"]}
    nodes_by_id = {item["id"]: item for item in data["nodes"]}
    # 当前分镜不再直接选择高清分支；高清模式由网页后处理请求提供。
    assert not {115, 202, 314, 329, 397, 399, 328, 271, 272, 321, 394} & nodes_by_id.keys()

    first_sampler = next(item for item in data["nodes"] if item["id"] == 125)
    latent_saver = next(item for item in data["nodes"] if item["type"] == "MiniMaxH3MotionContextSaveLatent")
    latent_link = links_by_id[latent_saver["inputs"][0]["link"]]
    assert (latent_link[1], latent_link[2]) == (first_sampler["id"], 0)
    trim = nodes_by_id[392]
    image_link = links_by_id[trim["inputs"][0]["link"]]
    assert (image_link[1], image_link[2]) == (122, 0)
    assert nodes_by_id[400]["widgets_values"] == [True, True]
    assert not {370, 371, 373, 374, 380, 381, 382, 383, 384, 401, *range(417, 430)} & nodes_by_id.keys()


def test_v7_contains_isolated_postprocess_second_pass_branch():
    data = load_distributed_workflow()
    nodes = {item["id"]: item for item in data["nodes"]}
    source = next(item for item in data["nodes"] if item["type"] == "TheodoreDirector_PostprocessSecondPassSource")
    target = next(item for item in data["nodes"] if item["type"] == "TheodoreDirector_SaveSecondPass")
    assert source["mode"] == 4
    assert target["mode"] == 4

    incoming = {}
    for _link_id, origin, _origin_slot, destination, _destination_slot, _kind in data["links"]:
        incoming.setdefault(destination, set()).add(origin)
    ancestors = set()
    pending = [target["id"]]
    while pending:
        current = pending.pop()
        for origin in incoming.get(current, set()):
            if origin not in ancestors:
                ancestors.add(origin)
                pending.append(origin)

    ancestor_types = {nodes[node_id]["type"] for node_id in ancestors}
    assert source["id"] in ancestors
    assert "RTXVideoSuperResolution" in ancestor_types
    assert "MinimaxH3LatentUpscaler3D" in ancestor_types
    assert "MiniMaxH3AddNoise" in ancestor_types
    assert "VAEEncodeAudio" in ancestor_types
    assert "SamplerCustomAdvanced" in ancestor_types
    # 局部二采只读取落盘成片，不得重新进入一采、Impact 或连续性支流。
    assert "TheodoreDirector_CommitResult" not in ancestor_types
    assert "ImpactQueueTrigger" not in ancestor_types
    assert "MiniMaxH3MotionContext" not in ancestor_types
    assert "MiniMaxH3MotionContextTrim" not in ancestor_types


def test_distributed_workflow_contains_copyright_notice():
    """确保更新示例工作流时不会丢失作者署名。"""
    data = load_distributed_workflow()
    notes = [item for item in data["nodes"] if item.get("type") == "MarkdownNote"]
    assert any(COPYRIGHT_NOTICE in item["widgets_values"][0] for item in notes) or any(
        COPYRIGHT_NOTICE in credit for credit in data["extra"].get("yuqCredits", [])
    )



def test_public_workflow_contains_blank_project():
    data = load_distributed_workflow()
    project = next(item for item in data["nodes"] if item["type"] == "TheodoreDirector_Project")
    plan = json.loads(project["widgets_values"][0])
    assert plan["assets"] == []
    assert len(plan["shots"]) == 1
    assert plan["shots"][0]["prompt"] == ""
    assert plan["project"]["notes"] == ""


def test_integrated_controls_and_tail_save_dependencies():
    data = load_distributed_workflow()
    nodes = {n['id']: n for n in data['nodes']}
    links = {l[0]: l for l in data['links']}
    def origin(target, field):
        port = next(i for i in nodes[target]['inputs'] if i['name'] == field)
        return tuple(links[port['link']][1:3])
    assert origin(136, 'width') == (450, 3)
    assert origin(136, 'height') == (450, 4)
    assert origin(130, 'fps') == (450, 5)
    assert origin(392, 'fps') == (450, 5)
    assert origin(389, 'context_length') == (450, 13)
    assert origin(389, 'audio_context_length') == (450, 14)
    assert origin(451, 'video') == (92, 0)
    assert origin(451, 'images') == (392, 0)
    assert origin(400, 'tail_path') == (451, 0)
    assert origin(400, 'latent_path') == (393, 0)
    assert origin(415, 'width') == (402, 11)
    assert origin(415, 'height') == (402, 12)
    assert origin(415, 'length') == (402, 13)
    assert origin(413, 'audio') == (402, 14)
    assert origin(624, 'images') == (404, 0)
    assert origin(405, 'pixels') == (624, 0)
    assert origin(408, 'conditioning') == (620, 0)
    assert origin(438, 'conditioning') == (622, 0)
    assert origin(620, 'latent') == (407, 0)
    assert origin(622, 'latent') == (437, 0)
    assert origin(621, 'latent') == (411, 0)
    assert origin(623, 'latent') == (439, 0)
    assert origin(441, 'tt_value') == (621, 0)
    assert origin(442, 'tt_value') == (623, 0)
    saver = next(n for n in data['nodes'] if n['type'] == 'SaveImage')
    assert saver['mode'] == 2
    assert origin(saver['id'], 'filename_prefix') == (480, 6)
    for n in data['nodes']:
        for port in n.get('inputs', []):
            if port.get('link') is not None:
                link = links[port['link']]
                assert nodes[link[1]]['order'] < n['order']


def test_selflift_first_pass_uses_director_inputs_and_preserves_relay():
    data = load_distributed_workflow()
    nodes = {n["id"]: n for n in data["nodes"]}
    links = {link[0]: link for link in data["links"]}
    def origin(node_id, name):
        port = next(p for p in nodes[node_id]["inputs"] if p["name"] == name)
        return tuple(links[port["link"]][1:3])
    assert nodes[125]["type"] == "SelfLiftH3Sampler"
    assert nodes[123]["type"] == "KSamplerSelect"
    assert nodes[123]["widgets_values"] == ["euler"]
    assert origin(125, "seed") == (450, 2)
    assert origin(125, "positive") == (390, 0)
    assert origin(481, "conditioning") == (390, 0)
    assert origin(125, "negative") == (481, 0)
    assert origin(125, "latent_image") == (136, 1)
    assert origin(125, "vae") == (119, 0)
    assert origin(125, "sigmas") == (124, 0)
    assert origin(393, "latent") == (125, 0)
    assert origin(122, "samples") == (125, 0)
    assert origin(121, "samples") == (125, 0)
    assert all(nodes[i]["mode"] == 4 for i in (483, 484, 485, 486, 487))
    assert nodes[125]["widgets_values"][8] == "h3_upscaler_lms_v0.1.safetensors"
