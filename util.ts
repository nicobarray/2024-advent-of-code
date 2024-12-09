export type Vec = [number, number];
export const vec = (pos: Vec) => pos;
export const add =
  (vec: Vec) => (dir: Vec): Vec => [vec[0] + dir[0], vec[1] + dir[1]];
export const sub =
  (vec: Vec) => (dir: Vec): Vec => [vec[0] - dir[0], vec[1] - dir[1]];
export const mult =
  (factor: number) => (vec: Vec): Vec => [vec[0] * factor, vec[1] * factor];
export const is = <T>(a: T) => (b: T) => a === b;
export const not = <T>(fn: (a: T) => boolean) => (a: T) => !fn(a);
export const patmatch =
  <T, U>(obj: [T, U][], defaultValue: U) => (value: T) => {
    return obj.find(([k]) => k === value)?.[1] ?? defaultValue;
  };
export const div = (a: number) => (b: number) => Math.floor(a / b);
export const sum = (a: number, b: number) => a + b
export const sumAll = (ns: number[]) => ns.reduce(sum, 0)
