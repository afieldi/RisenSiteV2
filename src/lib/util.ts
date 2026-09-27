export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const pad = (n: number) => String(n).padStart(2, '0');
export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');
