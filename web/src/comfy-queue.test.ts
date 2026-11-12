import { describe, expect, it, vi } from "vitest";
import { runQueuedJob, type ComfyQueueApi } from "./comfy-queue";

class FakeApi implements ComfyQueueApi {
  listeners = new Map<string, Set<EventListener>>();
  interrupt = vi.fn(async (_id?: string | null) => undefined);
  deleteItem = vi.fn(async (_type: string, _id: string) => undefined);
  addEventListener(name: string, listener: EventListener) { (this.listeners.get(name) ?? this.listeners.set(name, new Set()).get(name)!).add(listener); }
  removeEventListener(name: string, listener: EventListener) { this.listeners.get(name)?.delete(listener); }
  emit(name: string, detail: Record<string, unknown>) { this.listeners.get(name)?.forEach((listener) => listener(new CustomEvent(name, { detail }))); }
  get listenerCount() { return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0); }
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("runQueuedJob", () => {
  it("在 /prompt 响应前到达的开始与成功事件也能被归属", async () => {
    const api = new FakeApi();
    const reply = deferred<{ prompt_id: string }>();
    const job = runQueuedJob(api, () => reply.promise, undefined, "failed");
    api.emit("execution_start", { prompt_id: "p1" });
    api.emit("execution_success", { prompt_id: "p1" });
    reply.resolve({ prompt_id: "p1" });
    await expect(job).resolves.toBeUndefined();
    expect(api.listenerCount).toBe(0);
  });

  it("提前到达的执行错误会让任务失败而不是挂起", async () => {
    const api = new FakeApi();
    const reply = deferred<{ prompt_id: string }>();
    const job = runQueuedJob(api, () => reply.promise, undefined, "failed");
    api.emit("execution_error", { prompt_id: "p1", exception_message: "素材缺失" });
    reply.resolve({ prompt_id: "p1" });
    await expect(job).rejects.toThrow("素材缺失");
  });

  it("忽略其他任务的事件，只转发本任务进度", async () => {
    const api = new FakeApi();
    const progress = vi.fn();
    const job = runQueuedJob(api, async () => ({ prompt_id: "mine" }), progress, "failed");
    await flush();
    api.emit("execution_success", { prompt_id: "other" });
    api.emit("execution_start", { prompt_id: "mine" });
    api.emit("progress", { prompt_id: "mine", value: 2, max: 8 });
    api.emit("progress", { prompt_id: "other", value: 5, max: 8 });
    api.emit("execution_success", { prompt_id: "mine" });
    await expect(job).resolves.toBeUndefined();
    expect(progress).toHaveBeenCalledTimes(1);
    expect(progress).toHaveBeenCalledWith({ value: 2, max: 8, node: "" });
  });

  it("任务已开始时停止会定向中断，而不是只删除队列项", async () => {
    const api = new FakeApi();
    const controller = new AbortController();
    const job = runQueuedJob(api, async () => ({ prompt_id: "p1" }), undefined, "failed", controller.signal, 10);
    await flush();
    api.emit("execution_start", { prompt_id: "p1" });
    controller.abort();
    await expect(job).rejects.toMatchObject({ name: "AbortError" });
    expect(api.interrupt).toHaveBeenCalledWith("p1");
    expect(api.deleteItem).not.toHaveBeenCalled();
  });

  it("在 /prompt 返回前停止：开始事件已缓冲则中断，否则移出队列", async () => {
    const started = new FakeApi();
    const startedController = new AbortController();
    const startedReply = deferred<{ prompt_id: string }>();
    const startedJob = runQueuedJob(started, () => startedReply.promise, undefined, "failed", startedController.signal, 10);
    started.emit("execution_start", { prompt_id: "p1" });
    startedController.abort();
    startedReply.resolve({ prompt_id: "p1" });
    await expect(startedJob).rejects.toMatchObject({ name: "AbortError" });
    await flush();
    expect(started.interrupt).toHaveBeenCalledWith("p1");

    const queued = new FakeApi();
    const queuedController = new AbortController();
    const queuedReply = deferred<{ prompt_id: string }>();
    const queuedJob = runQueuedJob(queued, () => queuedReply.promise, undefined, "failed", queuedController.signal, 10);
    queuedController.abort();
    queuedReply.resolve({ prompt_id: "p2" });
    await expect(queuedJob).rejects.toMatchObject({ name: "AbortError" });
    await flush();
    expect(queued.deleteItem).toHaveBeenCalledWith("queue", "p2");
    expect(queued.interrupt).not.toHaveBeenCalled();
    // 删除与开始执行发生竞态时，稍后到达的开始事件仍会触发定向中断。
    queued.emit("execution_start", { prompt_id: "p2" });
    expect(queued.interrupt).toHaveBeenCalledWith("p2");
  });

  it("停止后的监听会在等待期后解除", async () => {
    const api = new FakeApi();
    const controller = new AbortController();
    const job = runQueuedJob(api, async () => ({ prompt_id: "p1" }), undefined, "failed", controller.signal, 5);
    await flush();
    controller.abort();
    await expect(job).rejects.toMatchObject({ name: "AbortError" });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(api.listenerCount).toBe(0);
  });

  it("执行事件断开时使用历史状态完成任务并清理监听", async () => {
    const api = new FakeApi();
    const probe = vi.fn(async () => "success" as const);
    await expect(runQueuedJob(api, async () => ({ prompt_id: "history-job" }), undefined, "failed", undefined, 60_000, { probe, pollMs: 1 })).resolves.toBeUndefined();
    expect(probe).toHaveBeenCalledWith("history-job");
    expect(api.listenerCount).toBe(0);
  });
});
