import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function FitText({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parent = el.parentElement!;
    if (!parent) return;

    function measure() {
      // guard: parent might be 0 before image loads
      const ph = parent.clientHeight;
      const pw = parent.clientWidth;
      if (!ph || !pw) return;

      // grow by binary-ish search (faster, safer)
      let lo = 8,
        hi = 600; // tweak max as needed
      el.style.fontSize = lo + "px";

      // ensure content is measurable (no absolute child)
      // the text itself should be direct child of `el`
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        el.style.fontSize = mid + "px";

        const fitsH = el.scrollHeight <= ph * 0.9;
        const fitsW = el.scrollWidth <= pw * 0.9;

        if (fitsH && fitsW) lo = mid;
        else hi = mid - 1;
      }
      el.style.fontSize = lo + "px";
    }

    // observe parent size changes (image load, layout)
    const ro = new ResizeObserver(measure);
    ro.observe(parent);

    // initial + on next frame (after layout)
    requestAnimationFrame(measure);

    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
