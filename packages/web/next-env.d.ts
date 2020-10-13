/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.svg";

declare namespace JSX {
  interface IntrinsicElements {
    "ion-icon": { name: string; css?: any };
  }
}
