import { useEffect, useRef, useState } from 'react';
import { mountLogo3D } from '../lib/logo3d';

/** three.js hero logo; falls back to the flat PNG if the image or WebGL fails. */
export function Logo3D({ src }: { src: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!hostRef.current || failed) return;
    return mountLogo3D(hostRef.current, src, () => setFailed(true));
  }, [src, failed]);

  return (
    <div className="hero__logo" ref={hostRef}>
      {failed && <img src={src} alt="Risen eSports" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
    </div>
  );
}
