"""ComfyUI V3 输出与旧版选项输入的兼容接口。"""

from comfy_api.v0_0_2 import io


class H3VideoContextOutput(io.Combo.Output):
    """保留旧节点的枚举类型，兼容旧版列表和新版 COMBO 输入。"""

    def __init__(self, id: str):
        super().__init__(id, options=["22", "5", "39", "56"])

    @property
    def io_type(self) -> list[str]:
        return list(self.options)
