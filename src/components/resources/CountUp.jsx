'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Animation de chiffres "count up" quand la valeur cible change.
 *
 * - Durée par défaut : 400ms (assez court pour ne pas frustrer)
 * - Easing : ease-out (rapide au début, ralentit à la fin)
 * - Si la valeur change rapidement (sliders), on rattrape sans cumul
 */
export default function CountUp({ value, duration = 400, formatter = (n) => Math.round(n) }) {
  const [display, setDisplay] = useState(value);
  const startValueRef = useRef(value);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // Si la valeur cible n'a pas vraiment changé, skip
    if (Math.abs(display - value) < 0.01) return;

    startValueRef.current = display;
    startTimeRef.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValueRef.current + (value - startValueRef.current) * eased;
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(value); // snap final
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{formatter(display)}</>;
}
