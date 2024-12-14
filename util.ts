export type Vec = [number, number];
export const vec = (pos: Vec) => pos;
const isVec = (raw: unknown): raw is Vec =>
  Array.isArray(raw) && raw.length === 2;
export const add =
  (vec: Vec) => (dir: Vec): Vec => [vec[0] + dir[0], vec[1] + dir[1]];
export const sub =
  (vec: Vec) => (dir: Vec): Vec => [vec[0] - dir[0], vec[1] - dir[1]];
export const mult =
  (factor: number) => (vec: Vec): Vec => [vec[0] * factor, vec[1] * factor];
export const len = (vec: Vec) =>
  Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));

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

export enum Edge {
  Top = 0,
  Right = 1,
  Bottom = 2,
  Left = 3,
}

export class Grid<T> {
  width: number;
  height: number;
  map: T[]; // 1d array of a 2d map, every "width" indexes, it is a new row.
  size: number;
  constructor(raw: string, mapper: (cell: string) => T) {
    this.width = raw.indexOf("\n");
    this.map = raw.split("\n")
      .filter((row) => row.length) // remove last empty line in the file
      .flatMap((row) => row.split(""))
      .map(mapper);
    this.size = this.map.length;
    this.height = this.size / this.width;
  }

  get(index: number) {
    return this.map[index];
  }

  set(index: number, value: T) {
    this.map[index] = value;
  }

  walk(fn: (i: number, value: T) => void) {
    for (let i = 0; i < this.size; i++) {
      fn(i, this.map[i]);
    }
  }

  walk2d(fn: (xy: Vec, value: T) => void) {
    for (let i = 0; i < this.size; i++) {
      fn(this.xy(i), this.map[i]);
    }
  }

  // in array only
  xy(i: number): Vec {
    const x = i % this.width;
    const y = div(i)(this.width);
    return [x, y];
  }

  x(vec: Vec): number {
    return vec[0] + vec[1] * this.width;
  }

  getKey(edge: Edge, [x, y]: Vec) {
    if (edge === Edge.Bottom) {
      return x + ":" + Edge[edge] + "⬇️";
    } else if (edge === Edge.Top) {
      return x + ":" + Edge[edge] + "⬆️";
    } else if (edge === Edge.Right) {
      return y + ":" + Edge[edge] + "➡️";
    } else {
      return y + ":" + Edge[edge] + "⬅️";
    }
  }

  // expect i & j to be neighbouring
  getEdge(i: Vec, j: Vec) {
    const ix = i[0];
    const iy = i[1];

    const jx = j[0];
    const jy = j[1];

    if (ix === jx) { // vertical neighbours
      return jy < iy ? Edge.Top : Edge.Bottom;
    }

    if (iy === jy) { // horizontal neighbours
      return jx < ix ? Edge.Left : Edge.Right;
    }

    throw new Error(
      "Not horizontal or vertical: " + i + "_" + i + " " + j + "_" + j,
    );
  }

  #inbound([x, y]: Vec) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  #delta(pos: Vec, delta: Vec) {
    const next = add(pos)(delta);
    if (!this.#inbound(next)) {
      return null;
    }
    return next;
  }

  top(pos: Vec) {
    return this.#delta(pos, [0, -1]);
  }

  bottom(pos: Vec) {
    return this.#delta(pos, [0, 1]);
  }

  right(pos: Vec) {
    return this.#delta(pos, [1, 0]);
  }

  left(pos: Vec) {
    return this.#delta(pos, [-1, 0]);
  }

  adj(pos: Vec, noBoundryCheck = false): Vec[] {
    if (noBoundryCheck) {
      return [
        add(pos)([0, -1]),
        add(pos)([0, 1]),
        add(pos)([1, 0]),
        add(pos)([-1, 0]),
      ];
    }

    return [
      this.top(pos),
      this.right(pos),
      this.bottom(pos),
      this.left(pos),
    ].filter(isVec);
  }

  findFirstIndex(cell: T) {
    return this.map.indexOf(cell);
  }

  toString(map?: (i: number, v: T) => string) {
    let row = "";
    for (let i = 0; i < this.size; i++) {
      if (i !== 0 && (i % this.width) === 0) {
        row += "\n";
      }
      row += map?.(i, this.map[i]) ?? this.map[i];
    }
    return row;
  }
}
