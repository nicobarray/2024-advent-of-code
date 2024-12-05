import * as path from "jsr:@std/path@1";
import { sumOf } from "jsr:@std/collections";
import { pipe } from 'jsr:@noidet/pipe'

const input = await Deno.readTextFile(
  path.join(import.meta.dirname, "input.txt"),
);

const _example = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

// TODO: solve aoc
export function step1() {
  const input_ = input; // example

  const lines = input_.split("\n");
  const width = lines[0].length;
  const height = lines.length;
  const paper = input_.replaceAll("\n", "").split("");

  function getLetter(x: number, y: number) {
    if (x >= 0 && y >= 0 && x < width && y < height) {
      return paper[x + y * width];
    } else {
      return ".";
    }
  }

  function getWord(...positions: [number, number][]) {
    return positions.map((pos) => getLetter(...pos)).join("");
  }

  let count = 0;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const words = [
        // ➡️
        getWord([x, y], [x + 1, y], [x + 2, y], [x + 3, y]),
        // ⬅️
        getWord([x, y], [x - 1, y], [x - 2, y], [x - 3, y]),
        // ⬆️
        getWord([x, y], [x, y + 1], [x, y + 2], [x, y + 3]),
        // ⬇️
        getWord([x, y], [x, y - 1], [x, y - 2], [x, y - 3]),
        // ↗️
        getWord([x, y], [x + 1, y + 1], [x + 2, y + 2], [x + 3, y + 3]),
        // ↘️
        getWord([x, y], [x + 1, y - 1], [x + 2, y - 2], [x + 3, y - 3]),
        // ↖️
        getWord([x, y], [x - 1, y + 1], [x - 2, y + 2], [x - 3, y + 3]),
        // ↙️
        getWord([x, y], [x - 1, y - 1], [x - 2, y - 2], [x - 3, y - 3]),
      ];

      const thisCount = sumOf(words, (word) => word === "XMAS" ? 1 : 0);

      count += thisCount;
    }
  }

  console.log(count);
}

export function step2() {
  const input_ = input; // example

  const lines = input_.split("\n");
  const width = lines[0].length;
  const height = lines.length;
  const paper = input_.replaceAll("\n", "").split("");

  function getLetter(x: number, y: number) {
    if (x >= 0 && y >= 0 && x < width && y < height) {
      return paper[x + y * width];
    } else {
      return ".";
    }
  }

  function getWord(...positions: [number, number][]) {
    return positions.map((pos) => getLetter(...pos)).join("");
  }

  let count = 0;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const a = getLetter(x, y);

      if (a === "A") {
        const cross = [
          getWord([x - 1, y - 1], [x, y], [x + 1, y + 1]),
          getWord([x - 1, y + 1], [x, y], [x + 1, y - 1]),
        ];

        if (cross.every((word) => word === "MAS" || word === "SAM")) {
          count++;
        }
      }
    }
  }

  console.log(count);
}

if (import.meta.main) {
  step1();
  step2();
}
