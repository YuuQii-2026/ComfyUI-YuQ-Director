import type { QueueProgress } from "./types";

/** ComfyUI 前端 api 对象中本模块用到的部分。 */
export interface ComfyQueueApi {
  addEventListener: (name: string, listener: EventListener) => void;
  removeEventListener: (name: string, listener: EventListener) => void;
  interrupt?: (runningJobId?: string | null) => Promise<void>;
  deleteItem?: (type: string, id: string) => Promise<void>;
}

export function abortError(): Error {
  const error = new Error("已停止");
  error.name = "AbortError";
  return error;
}

function eventDetail(event: Event): Record<string, unknown> {
  return (event as CustomEvent<Record<string, unknown>>).detail ?? {};
}

const EXECUTION_EVENTS = ["execution_start", "executing", "progress", "execution_success", "execution_error", "execution_interrupted"] as const;

/**
 * 提交一个任务并等待它结束。必须在提交之前就开始监听：只提交一个任务时队列为空，
 * execution_start 甚至 execution_error 可能早于 /prompt 的响应到达，先缓冲再按 prompt_id 归属。
 * 停止时：任务已开始就定向中断（服务端只中断这个任务），未开始则移出队列。
 */
export function runQueuedJob(
  api: ComfyQueueApi,
  queue: () => Promise<{ prompt_id?: string }>,
  onProgress: ((progress: QueueProgress) => void) | undefined,
  failureText: string,
  signal?: AbortSignal,
  lingerMs = 60_000,
  history?: { probe: (promptId: string) => Promise<"pending" | "success">; pollMs?: number },
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let promptId = "";
    let started = false;
    let settled = false;
    let aborted = false;
    let detached = false;
    let pollTimer: ReturnType<typeof setTimeout> | undefined;
    const buffered: Array<[string, Record<string, unknown>]> = [];
    const listeners = EXECUTION_EVENTS.map((type) => [type, (event: Event) => handle(type, eventDetail(event))] as const);
    const cleanup = () => {
      if (detached) return;
      detached = true;
      clearTimeout(pollTimer);
      listeners.forEach(([type, listener]) => api.removeEventListener(type, listener));
      signal?.removeEventListener("abort", onAbort);
    };
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      if (!aborted) cleanup();
      if (error) reject(error); else resolve();
    };
    const stopRemote = () => {
      if (!promptId) return;
      const stop = started ? api.interrupt?.(promptId) : api.deleteItem?.("queue", promptId);
      void Promise.resolve(stop).catch(() => undefined);
    };
    const poll = async () => {
      if (!history || settled) return;
      try {
        if (await history.probe(promptId) === "success") { finish(); return; }
      } catch (error) {
        finish(error instanceof Error ? error : new Error(String(error)));
        return;
      }
      if (!settled) pollTimer = setTimeout(() => void poll(), history.pollMs ?? 2500);
    };
    function handle(type: string, detail: Record<string, unknown>) {
      const eventId = String(detail.prompt_id ?? "");
      if (!promptId) {
        if (eventId) buffered.push([type, detail]);
        return;
      }
      if (eventId !== promptId) {
        // 旧版本 progress 事件不带 prompt_id；本任务开始后才把它算作本任务的进度。
        if (type !== "progress" || eventId || !started) return;
      }
      if (type === "execution_start" || type === "executing" || type === "progress") {
        const wasStarted = started;
        started = true;
        // 停止后才开始执行（竞态）：立即定向中断一次。
        if (aborted) { if (!wasStarted) stopRemote(); return; }
      }
      if (type === "progress") {
        const value = Number(detail.value ?? 0);
        const max = Number(detail.max ?? 0);
        if (Number.isFinite(value) && Number.isFinite(max) && max > 0) onProgress?.({ value, max, node: String(detail.node ?? "") });
      } else if (type === "execution_success") {
        if (aborted) cleanup(); else finish();
      } else if (type === "execution_error" || type === "execution_interrupted") {
        if (aborted) cleanup();
        else finish(new Error(String(detail.exception_message ?? detail.error ?? failureText)));
      }
    }
    function onAbort() {
      if (aborted) return;
      aborted = true;
      stopRemote();
      finish(abortError());
      // 继续监听一段时间：任务若在停止之后才开始执行，仍能被中断；之后自动解除监听。
      setTimeout(cleanup, lingerMs);
    }
    listeners.forEach(([type, listener]) => api.addEventListener(type, listener));
    signal?.addEventListener("abort", onAbort);
    if (signal?.aborted) { onAbort(); return; }
    queue().then((queued) => {
      if (!queued.prompt_id) { finish(new Error("ComfyUI 没有返回任务 ID")); return; }
      promptId = queued.prompt_id;
      // 先回放缓冲事件确定任务是否已开始，再决定中断还是移出队列。
      for (const [type, detail] of buffered.splice(0)) handle(type, detail);
      if (aborted && !started) stopRemote();
      if (history && !settled) pollTimer = setTimeout(() => void poll(), history.pollMs ?? 2500);
    }, (error: unknown) => finish(error instanceof Error ? error : new Error(String(error))));
  });
}
