import { useEffect, useState } from 'react';

/**
 * Devuelve `true` cuando el sistema pide reducir movimiento.
 * Se resuelve en el cliente para no romper el render en servidor.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}
