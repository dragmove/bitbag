/*
 * Typescript interface
 */
export interface IArrayLike<T> {
  length: number;
  [index: number]: T;
}

export interface IDictionary<T = any> {
  [key: string]: T;
}

export interface IAddEventListenerOption {
  capture: boolean;
  once: boolean;
  passive: boolean;
}

export interface IRemoveEventListenerOption {
  capture: boolean;
}

export interface IStorage {
  set: (key: string, obj: object) => void;
  get: (key: string) => object | string | null;
  remove: (key: string) => void;
  clear: () => void;
}

export interface Point {
  x: number;
  y: number;
}

export interface Point3d extends Point {
  z: number;
}
