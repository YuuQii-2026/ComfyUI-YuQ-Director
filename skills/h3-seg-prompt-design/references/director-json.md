# 导播台导出

同系列一份 `.assets.json` 保存别名、生成提示词和ComfyUI input相对路径，每集一份 `.episode.json` 保存分镜；媒体文件不嵌入JSON。`素材映射.md` 配置 `系列名称`、`系列素材库`（相对本集路径）、`集号`，后续集共用同一库。

从skill目录执行，Node18+：

```powershell
node scripts/director.mjs "<本集目录>"
node scripts/director.mjs assets "<本集目录>"
node scripts/director.mjs episode "<本集目录>"
node scripts/director.mjs validate "<本集目录>"
node scripts/director.mjs plan "<本集目录>"
```

默认导出/合并共用库与本集分镜；assets可在尚无分镜时单独导出；plan额外导出兼容完整计划。支持 `--library`、`--series`、`--episode` 覆盖配置。有ERROR不写文件；WARNING需判断，不等于成片合格。

Markdown保留脚本可识别的结构即可，无需预制文档：素材映射一级标题包含项目名，单项三级标题为序号及反引号别名，条目用中文全角冒号；生图提示词用同别名三级标题及prompt代码块。一致性圣经的稳定事实使用带lock名称的代码块。分镜设计的详细分镜用三级标题，H3提示词用同名二级标题，名称后以全角竖线连接MM:SS起止时间（起止之间用—），提示词标题后紧随text代码块。分镜条目保留长镜头跨段、场景、起始站位、结束站位、逐镜场景锚点、节拍、对白或旁白、接缝设计、审片要点；连续镜头、时间线、时间跳跃按实际声明。状态时间线标题保持二级，表头按分镜顺序，每行元素含Subject编号。

生图校验优先核对 `lock:image-style` 和本资产的 `lock:image:别名`，缺省兼容原视频风格与Subject锁。图像锁只约束生图，不替换分镜中的视频锁；素材阶段单独导出时也执行已有图像锁检查。

## 字段映射

| 输出 | 来源/约定 |
|---|---|
| 素材alias/kind/path/group/note | `### N. 别名`条目中的类型、本地路径、分组、说明；别名须反引号包裹 |
| 素材genPrompt | `参考素材生成提示词.md` 的同别名 `###` 标题及prompt代码块 |
| 素材durationSeconds/includeVideoAudio | 时长、启用视频伴音；实际上传后保存实测值 |
| shots.title/prompt | H3提示词二级时间标题与紧随的text代码块 |
| shots.durationSeconds | 标题起止时间之差，5–15秒 |
| shots.latentRelay | 分镜 `长镜头跨段：是（接续上一个分镜）`；提示词标题也带接续后缀；首段false |
| shots.note | 审片要点、起止站位/状态、对白及发音替换 |
| shots.negativePrompt | lock:negative，当前BasicGuider不使用此输入 |
| schemaVersion/defaults | 5；24fps、基础seed123456790 |
| continuity | h3_av_latent、视频22帧、音频24帧、final_output |
| pipeline | first_pass；二采模式super_resolution_second_pass；有接力denoise0.25否则0.3 |
| shots其他默认 | secondSamplingMode off，seed null，enabled true，disabledAssetIds空 |

系列库格式 `theodore-assets` v1；本集格式 `theodore-episode` v1，带project/defaults/continuity/pipeline/shots/assetLibrary/requiredAssets。分镜只按id、alias、kind关联素材及使用设置，不带素材路径或生图提示词。别名大小写不敏感且唯一、不含空白花括号、不以.audio结尾。已有共用库合并保留其他集素材、ID、上传路径和实测时长，同名不同类报错。

## 导入与修订

导入素材库，生成或上传缺失媒体，以别名对齐；导出带服务器路径的库留作后续集共用。再导入本集分镜，核对接力链并保存ComfyUI工作流。先导入分镜也可，库稍后补齐空缺。Ctrl+S写回Project节点后仍须保存工作流。

同集修订保留已确认素材/声线/种子，检查受影响接力链。各集用不同集号或项目名区分输出。运行 `node --test scripts/director.test.mjs`；外置回归素材通过 `H3_DIRECTOR_TEST_FIXTURE` 指定，测试素材不安装进skill。
