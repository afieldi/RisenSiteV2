// 3D Risen logo: the PNG is split by color (red border, navy body, orange peaks, white letters)
// into separate extruded layers, which assemble with an alternating slice slide-in.
import * as THREE from 'three';

type LayerKey = 'navy' | 'red' | 'orange' | 'white';

const PALETTE: { k: LayerKey; c: [number, number, number] }[] = [
  { k: 'navy', c: [2, 18, 46] },
  { k: 'red', c: [204, 45, 45] },
  { k: 'orange', c: [242, 98, 0] },
  { k: 'white', c: [246, 247, 249] },
  { k: 'white', c: [184, 190, 202] },
];
// z = front face, d = extrusion depth, e = entry delay offset (s)
const LAYERS: { k: LayerKey; z: number; d: number; e: number }[] = [
  { k: 'red', z: 0.10, d: 0.16, e: 0.00 },
  { k: 'navy', z: 0.06, d: 0.12, e: 0.05 },
  { k: 'orange', z: 0.20, d: 0.14, e: 0.16 },
  { k: 'white', z: 0.19, d: 0.13, e: 0.12 },
];
const SLICES = 5;
const COPIES = 9;
const MAX_YAW = 0.28;   // radians of cursor-driven rotation
const MAX_PITCH = 0.18;
const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 4);

const LAYER_KEYS: LayerKey[] = ['navy', 'red', 'orange', 'white'];

function colorMasks(img: HTMLImageElement): Record<LayerKey, HTMLCanvasElement> {
  const S = 1024;
  const cv = document.createElement('canvas'); cv.width = cv.height = S;
  const ctx = cv.getContext('2d')!; ctx.drawImage(img, 0, 0, S, S);
  const src = ctx.getImageData(0, 0, S, S).data;
  const out = Object.fromEntries(LAYER_KEYS.map(k => [k, new ImageData(S, S)])) as Record<LayerKey, ImageData>;
  for (let i = 0; i < src.length; i += 4) {
    if (src[i + 3] < 110) continue;
    const r = src[i], g = src[i + 1], b = src[i + 2];
    let best = 0, bd = Infinity;
    for (let p = 0; p < PALETTE.length; p++) {
      const c = PALETTE[p].c;
      const d = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
      if (d < bd) { bd = d; best = p; }
    }
    const o = out[PALETTE[best].k].data;
    o[i] = r; o[i + 1] = g; o[i + 2] = b; o[i + 3] = 255;
  }
  // navy fills beneath everything so the badge body is solid
  const nv = out.navy.data;
  for (let i = 0; i < src.length; i += 4) {
    if (src[i + 3] >= 110 && !nv[i + 3]) { nv[i] = 2; nv[i + 1] = 18; nv[i + 2] = 46; nv[i + 3] = 255; }
  }
  return Object.fromEntries(LAYER_KEYS.map(k => {
    const c = document.createElement('canvas'); c.width = c.height = S;
    c.getContext('2d')!.putImageData(out[k], 0, 0);
    return [k, c];
  })) as Record<LayerKey, HTMLCanvasElement>;
}

/** Mounts the logo into host and returns a teardown. onFail is called if the image or WebGL is unavailable. */
export function mountLogo3D(host: HTMLElement, src: string, onFail: () => void): () => void {
  let mx = 0, my = 0, cx = 0, cy = 0;
  let disposed = false;
  let teardownScene: (() => void) | undefined;
  const onMove = (e: MouseEvent) => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; };
  addEventListener('mousemove', onMove, { passive: true });

  const img = new Image();
  img.onerror = () => { if (!disposed) onFail(); };
  img.onload = () => {
    if (disposed) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return onFail(); }
    const canvases = colorMasks(img);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
    cam.position.set(0, 0, 4.6);
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(-2, 3, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0xF26200, 2.2); rim.position.set(3, -1, -1); scene.add(rim);
    const fill = new THREE.DirectionalLight(0x2F6FE0, 1.4); fill.position.set(-3, -2, 1); scene.add(fill);

    const root = new THREE.Group(); scene.add(root);
    const disposables: { dispose(): void }[] = [];
    const mats = {} as Record<LayerKey, { front: THREE.Material; side: THREE.Material }>;
    LAYERS.forEach(L => {
      const t = new THREE.CanvasTexture(canvases[L.k]);
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
      mats[L.k] = {
        front: new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.5, roughness: 0.45, metalness: 0.15, side: THREE.DoubleSide }),
        side: new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.5, roughness: 0.7, metalness: 0.1, color: 0x6b6f78, side: THREE.DoubleSide }),
      };
      disposables.push(t, mats[L.k].front, mats[L.k].side);
    });

    const W = 2, H = W / SLICES;
    const slices: { g: THREE.Group; layerGroups: { lg: THREE.Group; L: (typeof LAYERS)[number] }[]; dir: number; delay: number }[] = [];
    for (let s = 0; s < SLICES; s++) {
      const geo = new THREE.PlaneGeometry(W, H);
      disposables.push(geo);
      const uv = geo.attributes.uv, v0 = 1 - (s + 1) / SLICES, v1 = 1 - s / SLICES;
      for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) > 0.5 ? v1 : v0);
      const g = new THREE.Group();
      g.position.y = W / 2 - H * (s + 0.5);
      const layerGroups = LAYERS.map(L => {
        const lg = new THREE.Group();
        for (let c = 0; c < COPIES; c++) {
          const m = new THREE.Mesh(geo, c === COPIES - 1 ? mats[L.k].front : mats[L.k].side);
          m.position.z = L.z - L.d + (L.d * c) / (COPIES - 1);
          lg.add(m);
        }
        g.add(lg);
        return { lg, L };
      });
      root.add(g);
      slices.push({ g, layerGroups, dir: s % 2 ? 1 : -1, delay: 0.15 + s * 0.09 });
    }

    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (w < 2 || h < 2) return;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t0 = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const t = reduce ? 99 : (now - t0) / 1000;
      slices.forEach(S => {
        const k = ease((t - S.delay) / 1.1);
        S.g.position.x = S.dir * (1 - k) * 1.6;
        S.g.rotation.y = S.dir * (1 - k) * 0.6;
        S.layerGroups.forEach(({ lg, L }) => {
          lg.position.z = (1 - ease((t - S.delay - L.e) / 1.1)) * (0.6 + L.e * 4);
        });
      });
      const r = host.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
      cx += (mx - cx) * 0.06; cy += (my - cy) * 0.06;
      root.rotation.y = cx * MAX_YAW + Math.sin(t * 0.6) * 0.06;
      root.rotation.x = cy * MAX_PITCH + p * 0.3 + Math.cos(t * 0.5) * 0.03;
      root.position.y = Math.sin(t * 0.9) * 0.03 + p * 0.3;
      renderer.render(scene, cam);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    teardownScene = () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      disposables.forEach(d => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  };
  img.src = src;

  return () => {
    disposed = true;
    removeEventListener('mousemove', onMove);
    teardownScene?.();
  };
}
