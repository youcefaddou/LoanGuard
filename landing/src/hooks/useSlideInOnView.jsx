import { useRef, useEffect, useState } from 'react';

// Hook d'animation slide-in au scroll (et au mount)
export default function useSlideInOnView({ direction = 'up', delay = 0 } = {}) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let timeout;
    const handle = (entries) => {
      if (entries[0].isIntersecting) {
        timeout = setTimeout(() => setVisible(true), delay);
      }
    };
    const observer = new window.IntersectionObserver(handle, { threshold: 0.15 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [delay]);

  let base = 'opacity-0';
  let anim = 'opacity-100 translate-y-0';
  if (direction === 'up') {
    base += ' translate-y-8';
    anim += ' duration-700';
  } else if (direction === 'down') {
    base += ' -translate-y-8';
    anim += ' duration-700';
  } else if (direction === 'left') {
    base += ' -translate-x-8';
    anim = 'opacity-100 translate-x-0 duration-700';
  } else if (direction === 'right') {
    base += ' translate-x-8';
    anim = 'opacity-100 translate-x-0 duration-700';
  }

  return [
    ref,
    visible
      ? `transition-all ease-out ${anim}`
      : `transition-all ease-out ${base}`,
  ];
}
