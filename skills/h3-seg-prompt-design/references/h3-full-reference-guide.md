# Ref2VA 装配

按既有H3格式保留以下六字段及顺序，直接为当前作品写成品，正文英文，原声对白保留原语言。

| 字段 | 内容 |
|---|---|
| `subject_definitions` | 每个本段可见Subject一行，稳定编号、对应锁与素材别名；音频行绑定声源，不重复定义 |
| `summary` | 本段事件与实际任务类型；不写前后段计划，不复述台词 |
| `retention_analysis` | 逐项说明参考对象的保留范围及出现镜头/声段 |
| `detailed_description` | lock:style → 正向无画面文字句 → 沿时间推进的镜头、状态、动作与原声对白 |
| `overall_soundscape` | 场景环境声锁与同步物理声，不抄台词 |
| `non_diegetic_music` | 无配乐写N/A；有则复用音乐锁 |

## 标签与引用

`<Subject N>` 是人物、场景、道具等内容单元；`{{ref:别名}}` 是素材。仅本段可见对象进入Subject定义。人物图只提供身份/服装，纯白底与合图版式不转入目标场景；场景图提供结构和基础光。声音引用绑定 `<Subject N> (Sx)`，只学声线时明确不复制原词。

图片、视频、音频实际编号由导播台编译，项目提示词不手写 `<Picture N>`、`<Video N>`、`<Audio N>`。视频伴音只有登记启用才写 `{{ref:别名.audio}}`，不自动启用。

summary类型按真实用途选：`reference generation`、`keyframe completion`、`video editing`、`video continuation`、`audio reuse`、`audio reference`；多种用 ` + ` 连接、不重复。只参考视频运动不等于视频编辑，latent接力也不等于引用了源视频。

retention关系：Subject/图/视频用 `fully_preserved`、`partially_preserved`、`attribute_transfer`、`weak_reference`；音频用 `fully_copy`、`partially_copy`、`reference`、`weak_reference`。人物仅定义身份和服装时，改变动作及成片环境不等于丢失身份；必须按定义的实际用途判断。

## 镜头与声音

`[Shot 1]` 无时间戳；只有分镜确有切镜才追加Shot，后续用 `At MM:SS.mmm` 明确切点，严格递增且落在本段。未剪切的观看重点变化不另编号。接力时间偏移见 [consistency-locks.md](consistency-locks.md)。

首镜给当前可见状态、机位、地标、光线；动作写触发、过程和结果，不依赖前段文字。每次切镜保留合理可见的空间证据与同源基础光。以清楚、无冲突为准，不设英文词数目标，不重复服装全表或装饰性运镜。

原声台词只在 `<d>[Language] 原文</d>` 内，演法和停顿在外。发声者用稳定Sx，台词附近保留声线锁与自己的声音引用；闭嘴约束只针对当时的听者。无画面文字要求明确置于正向主描述，不依赖负向字段；手机/屏幕不写可读台词。心声的本地Voiceover约定见 [voice-and-sound.md](voice-and-sound.md)。
