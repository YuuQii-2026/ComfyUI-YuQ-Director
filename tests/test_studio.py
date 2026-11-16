import copy
import pytest

from theodore_director.schema import DEFAULT_PLAN, PlanValidationError, load_plan
from theodore_director.studio import prepare_shot, save_tail_frame
from theodore_director.selection import shot_hash


def data():
    value = copy.deepcopy(DEFAULT_PLAN)
    value['generation'] = {'width': 608, 'height': 352}
    value['shots'] = [
        {'id': 'one', 'prompt': 'one', 'durationSeconds': 5, 'latentRelay': True},
        {'id': 'two', 'prompt': 'two', 'durationSeconds': 5, 'latentRelay': True, 'seed': 99},
    ]
    return value


def test_built_in_controls_follow_plan_and_shot_override():
    value = data()
    value['defaults'] = {'fps': 30, 'baseSeed': 12}
    value['continuity']['videoContextFrames'] = 39
    value['continuity']['audioContextFrames'] = 16
    plan = load_plan(value)
    first, second = prepare_shot(plan, 0), prepare_shot(plan, 1)
    assert (first.width, first.height, first.fps, first.shot.seed) == (608, 352, 30, 12)
    assert (second.video_context, second.audio_context, second.shot.seed) == ('39', 16, 99)
    assert not first.shot.latent_relay and second.shot.latent_relay
    assert first.shot.next_index == 1 and second.shot.active_index == 1
    assert first.paths.video_prefix != second.paths.video_prefix
    assert 'one' in first.paths.video_prefix and 'two' in second.paths.video_prefix
    assert load_plan(plan.to_dict()).generation == plan.generation


@pytest.mark.parametrize('size', [None, [], {'width': 100}, {'width': True}, {'height': 9000}, {'width': 608.0}])
def test_invalid_dimensions(size):
    value = data()
    value['generation'] = size
    if size is None:
        assert load_plan(value).generation is None
    else:
        with pytest.raises(PlanValidationError): load_plan(value)


def test_legacy_plan_omits_new_field_and_defaults_are_available():
    plan = load_plan(copy.deepcopy(DEFAULT_PLAN))
    assert 'generation' not in plan.to_dict()
    assert (prepare_shot(plan, 0).width, prepare_shot(plan, 0).height) == (416, 224)


def test_dimension_changes_invalidate_shot_result():
    value = data()
    before = load_plan(value)
    value['generation']['width'] = 352
    after = load_plan(value)
    assert shot_hash(before, before.shots[0]) != shot_hash(after, after.shots[0])


def test_save_tail_frame_writes_only_the_last_image(tmp_path):
    import numpy as np
    from PIL import Image
    images = np.zeros((2, 4, 6, 3), dtype=np.float32)
    images[1, :, :, 0] = 1.0
    output = tmp_path / 'tails' / 'last.png'
    save_tail_frame(images, output)
    with Image.open(output) as image:
        assert image.size == (6, 4)
        assert image.getpixel((0, 0)) == (255, 0, 0)
    with pytest.raises(ValueError, match='尾帧'): save_tail_frame(images[:0], output)
