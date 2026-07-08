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
      const ph = parent.clientHeight;
      const pw = parent.clientWidth;
      if (!ph || !pw) return;
      let lo = 8,
        hi = 600; 
      el!.style.fontSize = lo + "px";

      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        el!.style.fontSize = mid + "px";

        const fitsH = el!.scrollHeight <= ph * 0.9;
        const fitsW = el!.scrollWidth <= pw * 0.9;

        if (fitsH && fitsW) lo = mid;
        else hi = mid - 1;
      }
      el!.style.fontSize = lo + "px";
    }
    const ro = new ResizeObserver(measure);
    ro.observe(parent);

    requestAnimationFrame(measure);

    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
