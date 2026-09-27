/// <reference types="vite/client" />
import 'react';

// Allow CSS custom properties (e.g. { '--d': '.7s' }) in style props.
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
