"""Run with ComfyUI available to validate the V3/legacy enum boundary."""
import copy

import pytest

api = pytest.importorskip("comfy_api.v0_0_2", reason="ComfyUI schema runtime is required")
from comfy_execution.validation import validate_node_input

from theodore_director.comfy_compat import H3VideoContextOutput
from theodore_director.schema import DEFAULT_PLAN, load_plan
from theodore_director.studio import prepare_shot


@pytest.mark.parametrize("frames", [5, 22, 39, 56])
def test_plan_context_values_match_legacy_and_modern_inputs(frames):
    plan = copy.deepcopy(DEFAULT_PLAN)
    plan["continuity"]["videoContextFrames"] = frames
    port = H3VideoContextOutput("video_context")
    assert prepare_shot(load_plan(plan), 0).video_context == str(frames)
    assert str(frames) in port.io_type
    assert validate_node_input(port.io_type, ["22", "5", "39", "56"])
    assert validate_node_input(port.io_type, "COMBO")
    assert not validate_node_input(port.io_type, "IMAGE")


def test_enum_survives_v3_object_info_and_return_type_serialization():
    class ContextSource(api.io.ComfyNode):
        @classmethod
        def define_schema(cls):
            return api.io.Schema(node_id="ContextSource", outputs=[H3VideoContextOutput("video_context")])

        @classmethod
        def execute(cls):
            return api.io.NodeOutput("22")

    assert ContextSource.GET_NODE_INFO_V1()["output"][0] == ["22", "5", "39", "56"]
    assert ContextSource.RETURN_TYPES[0] == ["22", "5", "39", "56"]
    assert ContextSource.execute().result == ("22",)
