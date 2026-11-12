# YuQ 导播台

面向 MiniMax H3 短剧制作的 ComfyUI 导播台，包含网页插件、V7.3 工作流和分镜提示词 Skill。

## 项目来源与许可

本项目改编自 [northern-penguin/ComfyUI_Theodore_Director](https://github.com/northern-penguin/ComfyUI_Theodore_Director)，感谢原作者及贡献者。原工作流由抖音博主 Theodore（抖音号 q1503623946）及 B 站 UP 主南极来の企鹅制作。YuQ 版本对导播台界面、工作流、网页配置、结果处理和文档做了修改，并加入 H3 分镜 Skill。

本仓库采用 [Apache License 2.0](LICENSE)，原版权信息见 [NOTICE](NOTICE)。第三方节点和模型分别适用各自的许可，见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 安装插件

将本仓库克隆到 `ComfyUI/custom_nodes`：

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/YuQii608/ComfyUI-YuQ-Director.git
```

安装 Python 依赖后重启 ComfyUI：

```bash
cd ComfyUI-YuQ-Director
python -m pip install -r requirements.txt
```

整合包用户请使用 ComfyUI 自带的 Python。网页扩展已预构建，正常使用无需安装 Node.js。

## 工作流

在 ComfyUI 中导入 [V7.3导播台.json](workflows/V7.3导播台.json)，然后打开导播台。发布版包含空白项目；在网页中导入素材和分镜计划，或自行新建镜头。`image-generation.json` 是插件内置生图功能的配套工作流。

导播台支持素材库、镜头编排、逐段生成与审片、独立后处理及工作流参数配置。模型文件和第三方节点需另行安装，工作流中的模型名按本机实际文件调整。

主要工作流依赖：ComfyUI Impact Pack、ComfyUI MiniMax H3 Turbo、ComfyUI H3 Motion Context、ComfyUI-KJNodes、ComfyUI-Easy-Use；超分或 latent 放大模式另需 NVIDIA RTX Video Nodes、Comfyui Minimax H3 Latent Upscaler 和 H3 Latent Upscaler。合并视频需要 FFmpeg。各依赖的作用见 [第三方说明](THIRD_PARTY_NOTICES.md)。

## 安装 Skill

将 [h3-seg-prompt-design](skills/h3-seg-prompt-design) 整个目录复制到 Codex 的 skills 目录：

- Windows：`%USERPROFILE%\.codex\skills\h3-seg-prompt-design`
- macOS / Linux：`~/.codex/skills/h3-seg-prompt-design`

重新加载 Codex 后可通过 `$h3-seg-prompt-design` 使用。Skill 脚本需要 Node.js 18+；`SKILL.md` 中列有导出和校验命令。

## 开发验证

```bash
npm ci
npm run check
npm test
npm run build
python -m pytest
```

生成效果取决于本地模型、节点版本和硬件；发布前应在目标 ComfyUI 环境进行实际生成验证。
