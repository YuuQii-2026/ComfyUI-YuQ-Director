export async function writeClipboardText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // 某些嵌入式浏览器虽然暴露 API，却会拒绝权限，继续使用兼容方案。
    }
  }
  // 兼容未开放 Clipboard API 的本机浏览器环境。
  const previousActive = document.activeElement;
  const previousSelection = previousActive instanceof HTMLTextAreaElement || previousActive instanceof HTMLInputElement
    ? { start: previousActive.selectionStart, end: previousActive.selectionEnd, direction: previousActive.selectionDirection }
    : null;
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  // 临时 textarea 会抢走提示词编辑器的焦点，复制后恢复原输入框及其光标/选区。
  if (previousActive instanceof HTMLElement) previousActive.focus({ preventScroll: true });
  if (previousSelection && (previousActive instanceof HTMLTextAreaElement || previousActive instanceof HTMLInputElement)) {
    previousActive.setSelectionRange(previousSelection.start, previousSelection.end, previousSelection.direction ?? undefined);
  }
  if (!copied) throw new Error("浏览器拒绝写入剪贴板");
}
