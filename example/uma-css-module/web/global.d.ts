/// <reference types="node" />
declare global {
  interface Window {
    __SSR_DATA__:any
  }
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'react-dom'
export {};
