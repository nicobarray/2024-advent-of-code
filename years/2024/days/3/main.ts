import * as path from "jsr:@std/path@1";

const input = await Deno.readTextFile(
  path.join(import.meta.dirname, "input.txt"),
);

const mult = (a: number, b: number) => a * b;
const sum = (a: number, b: number) => a + b;

// TODO: solve aoc
export async function step1() {
  console.log(
    [...input.matchAll(/mul\(\d{1,3},\d{1,3}\)/gm)]
      .map(([match]) =>
        match
          .replaceAll(/mul\(|\)/g, "")
          .split(",")
          .map(Number)
          .reduce(mult, 1)
      ).reduce(sum, 0),
  );
}

export async function step2() {
  let enabled = true
  console.log(
    [...input.matchAll(/mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/gm)]
      .map(([match]) => {
        if (match === "do()") {
          enabled = true
          return 0
        }

        if (match === "don't()") {
          enabled = false
          return 0
        }

        if (!enabled) {
          return 0
        }

        return match
          .replaceAll(/mul\(|\)/g, "")
          .split(",")
          .map(Number)
          .reduce(mult, 1)
      }
      ).reduce(sum, 0),
  );
}

if (import.meta.main) {
  await step1();
  await step2();
}
