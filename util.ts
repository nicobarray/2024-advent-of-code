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
export const sum = (a: number, b: number) => a + b;
export const sumAll = (ns: number[]) => ns.reduce(sum, 0);
export const range = (n: number) => [...new Array(n).keys()];

export class Map<T> {
  width: number;
  map: T[]; // 1d array of a 2d map, every "width" indexes, it is a new row.
  size: number;
  constructor(raw: string, mapper: (cell: string) => T) {
    this.width = raw.indexOf("\n");
    this.map = raw.split("\n")
      .filter((row) => row.length) // remove last empty line in the file
      .flatMap((row) => row.split(""))
      .map(mapper);
    this.size = this.map.length;
  }

  get(index: number) {
    return this.map[index];
  }

  #inbound(index: number) {
    return index >= 0 && index < this.size;
  }

  top(index: number) {
    const p = index - this.width;
    if (!this.#inbound(p)) {
      return -1;
    }
    return p;
  }

  bottom(index: number) {
    const p = index + this.width;
    if (!this.#inbound(p)) {
      return -1;
    }
    return p;
  }

  right(index: number) {
    const p = index + 1;
    if (!this.#inbound(p)) {
      return -1;
    }
    if ((p % this.width) < (index % this.width)) {
      return -1;
    }
    return p;
  }

  left(index: number) {
    const p = index - 1;
    if (!this.#inbound(p)) {
      return -1;
    }
    if ((p % this.width) > (index % this.width)) {
      return -1;
    }
    return p;
  }

  adj(index: number) {
    return [
      this.top(index),
      this.right(index),
      this.bottom(index),
      this.left(index),
    ].filter((x_) => x_ !== -1);
  }

  set(index: number, value: T) {
    this.map[index] = value;
  }

  findFirstIndex(cell: T) {
    return this.map.indexOf(cell);
  }

  toString() {
    let row = "";
    for (let i = 0; i < this.size; i++) {
      if (i !== 0 && (i % this.width) === 0) {
        row += "\n";
      }
      row += this.map[i];
    }
    return row;
  }
}
