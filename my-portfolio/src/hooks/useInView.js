import { useEffect, useRef, useState } from "react";

/* Returns [ref, inView]. Flips to true the first time the element enters
   the viewport and then stops observing — for one-shot entrance effects. */
export default function useInView({ threshold = 0 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, inView]);

  return [ref, inView];
}
