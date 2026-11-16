# YuQ 导播台

面向 MiniMax H3 短剧制作的 ComfyUI 导播台，包含网页插件、YuQ 工作流和分镜提示词 Skill。

> [!IMPORTANT]
> ### 💬 加入 YuQ 导播台交流群
> **QQ 群号：1072830954**
>
> 欢迎交流导播台使用、工作流配置与 MiniMax H3 分镜制作。

## 项目亮点

- **配置独立，画布自由**：项目、画幅、接力与全局提示词集中在独立配置页；模型、LoRA、采样器直接在画布修改。
- **生图链直接看、直接改**：主工作流包含独立的生图分组，可增加 LoRA、更换模型、采样器与后处理；网页自动生图与批量生图读取当前画布连接。
- **围绕分镜完成制作**：在同一界面编排镜头、编辑提示词、逐段生成、对照说明审片和选择候选结果，支持单段重生及后续接力段联动重生。
- **系列素材可复用**：图片、视频和音频统一管理，支持文件夹批量导入、别名引用，以及系列素材库与单集分镜分别导入导出。
- **贴合 H3 多模态生成**：自动把素材别名转换为 H3 引用标签，预检素材数量、时长和引用可用性，并支持连续长镜头的音视频 latent 接力。
- **先审片，再做高清处理**：一采与后处理分开，审片通过后再选择超分二采、Latent 放大二采或只超分；后处理可单独执行，结果另存，最后按选定镜头合并成片。
- **配套 Skill 可直接衔接导播台**：围绕剧情因果、镜头调度、素材、声音与连续性组织分镜，导出可导入网页的系列素材库和单集分镜计划，减少手工整理配置。

## 项目来源与许可

本项目改编自 [northern-penguin/ComfyUI_Theodore_Director](https://github.com/northern-penguin/ComfyUI_Theodore_Director)，感谢原作者及贡献者。原工作流由抖音博主 Theodore（抖音号 q1503623946）及 B 站 UP 主南极来の企鹅制作。YuQ 版本对导播台界面、工作流、网页配置、结果处理和文档做了修改，并加入 H3 分镜 Skill。

本仓库采用 [Apache License 2.0](LICENSE)，原版权信息见 [NOTICE](NOTICE)。第三方节点和模型分别适用各自的许可，见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 安装插件

将本仓库克隆到 `ComfyUI/custom_nodes`：

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/YuuQii-2026/ComfyUI-YuQ-Director.git
```

安装 Python 依赖后重启 ComfyUI：

```bash
cd ComfyUI-YuQ-Director
python -m pip install -r requirements.txt
```

整合包用户请使用 ComfyUI 自带的 Python。网页扩展已预构建，正常使用无需安装 Node.js。

## 工作流

在 ComfyUI 中导入 [YuQ导播台.json](workflows/YuQ导播台.json)，然后打开导播台。发布版包含空白项目；在网页中导入素材和分镜计划，或自行新建镜头。更新插件后需重启 ComfyUI 并刷新页面，再载入新版工作流。已有项目可先导出计划，再导入新版工作流；只更新插件时旧分镜节点仍保留兼容。

视频一采沿用基础工作流的模型、LoRA、Euler 与采样设置，使用原生 AV 保护区处理接力；分镜索引、种子、画幅、输出路径和尾帧保存由内置节点处理。画布保留可选风格、武打、动作修复及速度 LoRA，另有 18 个生图相关节点（含可选提示词增强与网页控制），主工作流共 94 个节点。默认视频一采画幅为 16:9、0.4×（416 × 224），接力开关在每个分镜中设置。独立配置页只保存项目与内置功能参数，不复制整张画布的生成参数。

当前发布的工作流基于「连续源二采测试」版本：一采使用原生 AV 保护区；二采使用连续解码画面及上一段二采 latent 保护区。latent 放大使用 fp32 且关闭时间分块，显存占用可能增加；实际效果需在生成环境测试。

二采超分后的画幅会自动对齐到 32 像素的倍数，再进入 VAE 编码；原有未对齐的二采接力链需要重新生成。二采沿用分镜的接力开关：在「审片与生成」中先选片并通过整条连续链，再执行整体二采。后续段读取上一段二采的高清画面与 AV 状态，补入上下文后采样，再裁去重复画面；原始对白音轨和片段帧数保留。高清 latent 独立写入当前 Run 的 `second_pass_context/`，与一采状态分开。选片、seed、画布参数、模式、重绘强度或上游结果改变后，旧状态不能作为有效断点；中断后勾选「复用有效二采」继续。新版二采保留历史视频和接力状态。

更新远程机器的整个插件目录并重启 ComfyUI、刷新网页；推荐载入新版工作流后导入已有计划。旧版标准后处理支流也会在网页提交时接入接力节点。H3 接力要求 24 FPS，源视频补回上下文后须满足 17n+5 帧；安装的 H3 Motion Context 接口和窗口范围会在执行时校验。具体接缝效果需在生成机器上用两段连续镜头验证。

### 自由修改生图工作流

关闭导播台，在画布的 **「07 · Qwen Image 2.1 Turbo · 自由生图链」** 分组调整模型、LoRA、采样器和后处理。保留 `YuQ · 生图输入` 与当前项目的 PLAN 连线，将正负提示词、宽高、数量和种子输出接入新链路；其 `filename_prefix` 输出须连接到唯一的 `SaveImage.filename_prefix`。图像链本身也需使用该生图输入节点的输出。支持 ComfyUI 原生序列化能够处理的自定义节点，不要求固定节点编号或单一 KSampler。

生图输出节点平时为静音状态。网页提交时临时启用以读取当前连线，随后恢复状态，只提交该保存出口的依赖，不执行视频一采或二采。网页只改生图输入，模型、采样步数、CFG、LoRA 和后处理以画布设置为准。工作流更改需在 ComfyUI 中保存；网页「保存项目」保存项目计划。

当前生图链已替换为 `image_qwen_image_2_1_turbo_t2i.json` 中的 Qwen Image 2.1 Turbo：保留原模型文件名、Qwen 文本编码、KV Cache、Euler、CFG 1 与原始 8 步 ManualSigmas。提示词增强默认关闭；在画布打开开关后可使用原工作流的增强模型和系统提示词。关闭时提交任务会裁去该分支，无需加载增强模型。默认生图尺寸为 1024 × 1024；网页仍控制正负提示词、宽高、数量、种子及结果绑定。原子图已展开，可直接编辑各节点，保存统一接入 `SaveImage`。

旧版工作流未连接生图输入节点时，使用同样的 Qwen Turbo `image-generation.json` 内置兼容路径。新版主工作流默认使用画布生图链。模型文件和第三方节点需另行安装，工作流中的模型名按本机实际文件调整。

一采使用基础工作流的 `minimax_h3_dmad_full_dareties_v4_step600_comfy_fro.safetensors` LoRA。画布中的模型文件名应按本机实际文件调整；可选 LoRA 使用前需安装相应模型并确认节点是否启用。

主要工作流依赖：ComfyUI Impact Pack、ComfyUI H3 Motion Context、ComfyUI-KJNodes、ComfyUI-Easy-Use；超分或 latent 放大模式另需 NVIDIA RTX Video Nodes、Comfyui Minimax H3 Latent Upscaler 和 H3 Latent Upscaler。合并视频需要 FFmpeg。各依赖的作用见 [第三方说明](THIRD_PARTY_NOTICES.md)。

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
