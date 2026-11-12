import { useEffect, useRef, useState } from "preact/hooks";

interface LazyVideoThumbnailProps {
  src: string;
  alt: string;
}

function useNearViewport<T extends HTMLElement>(margin: string) {
  const hostRef = useRef<T>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!("IntersectionObserver" in window)) {
      setActive(true);
      return;
    }
    // 只为可视区域附近的结果保留媒体元素；滚远后卸载 src 和解码上下文。
    const observer = new IntersectionObserver((entries) => {
      setActive(entries.some((entry) => entry.isIntersecting));
    }, { rootMargin: margin });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);
  return { hostRef, active };
}

/** 审片网格中的播放器：滚动到附近才创建 video 元素，避免几十段同时加载。 */
export function LazyVideoPlayer({ src, className }: { src: string; className?: string }) {
  const { hostRef, active } = useNearViewport<HTMLDivElement>("320px");
  return <div class={`td-lazy-player ${className ?? ""}`} ref={hostRef}>
    {active ? <video key={src} src={src} controls preload="metadata" playsInline/> : <span>…</span>}
  </div>;
}

export function LazyVideoThumbnail({ src, alt }: LazyVideoThumbnailProps) {
  const { hostRef, active } = useNearViewport<HTMLDivElement>("160px");

  return <div class="td-result-thumb" ref={hostRef}>
    {active ? <video src={src} aria-label={alt} muted playsInline preload="metadata" onLoadedMetadata={(event) => { const video = event.currentTarget; if (Number.isFinite(video.duration) && video.duration > 0.02) video.currentTime = Math.min(0.25, Math.max(0, video.duration - 0.05)); }}/> : <span>…</span>}
  </div>;
}
