import { cn } from "@/lib/utils";
import type { Bubble } from "@/lib/quant/types";
import { STAGE_Q } from "@/lib/quant/engine";

export function SpeechBubble({
  bubble,
  selected,
  onPointerDown,
}: {
  bubble: Bubble;
  selected?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
}) {
  const w = ((bubble.wQ ?? 28) / STAGE_Q.w) * 100;
  return (
    <div
      data-bubble={bubble.id}
      onPointerDown={onPointerDown}
      className={cn(
        "absolute z-50 select-none rounded-[1.2cqw] bg-cream px-[1.6cqw] py-[1.1cqw] leading-snug text-ink shadow-[2px_3px_0_rgba(28,24,20,0.18)]",
        selected && "outline outline-2 outline-offset-2 outline-cinnabar",
      )}
      style={{
        left: `${(bubble.xQ / STAGE_Q.w) * 100}%`,
        top: `${(bubble.yQ / STAGE_Q.h) * 100}%`,
        width: `${w}%`,
        fontFamily: "var(--font-display)",
        fontSize: "2.4cqw",
      }}
    >
      {bubble.text}
      {bubble.tail !== "none" && (
        <span
          aria-hidden
          className={cn(
            "absolute h-0 w-0 border-transparent",
            bubble.tail === "bl" &&
              "bottom-[-0.7em] left-[1.2em] border-l-[0.7em] border-t-[0.85em] border-t-cream",
            bubble.tail === "br" &&
              "right-[1.2em] bottom-[-0.7em] border-r-[0.7em] border-t-[0.85em] border-t-cream",
            bubble.tail === "tl" &&
              "top-[-0.7em] left-[1.2em] border-l-[0.7em] border-b-[0.85em] border-b-cream",
            bubble.tail === "tr" &&
              "top-[-0.7em] right-[1.2em] border-r-[0.7em] border-b-[0.85em] border-b-cream",
          )}
        />
      )}
    </div>
  );
}
