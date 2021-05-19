/// <reference types="node" />

declare global {
  interface Window {
    __SSR_DATA__:any
  }
}

export {};
