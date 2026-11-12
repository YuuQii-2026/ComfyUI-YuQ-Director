export type Language = "zh" | "en";

const messages = {
  zh: { title: "YuQ 导播台", save: "保存", close: "关闭", shots: "分镜", assets: "素材库", settings: "项目设置", postprocess: "后处理", addShot: "添加分镜", addAsset: "添加素材", preview: "H3 编译预览", noErrors: "当前分镜通过预检" },
  en: { title: "YuQ Director", save: "Save", close: "Close", shots: "Shots", assets: "Media", settings: "Project", postprocess: "Post-process", addShot: "Add shot", addAsset: "Add asset", preview: "H3 compile preview", noErrors: "Current shot passes validation" },
};

const LANGUAGE_KEY = "theodore-director-language";

export function t(language: Language, key: keyof typeof messages.zh): string {
  return messages[language][key];
}

/** 默认中文；用户切换过语言后记住选择，不再跟随浏览器语言。 */
export function loadLanguage(): Language {
  try {
    return window.localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

export function saveLanguage(language: Language): void {
  try {
    window.localStorage.setItem(LANGUAGE_KEY, language);
  } catch {
    // 隐私模式等环境禁止写入时只影响记忆，不影响当前切换。
  }
}
