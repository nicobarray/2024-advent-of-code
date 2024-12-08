import * as path from "jsr:@std/path@1";

const input = await Deno.readTextFile(
  path.join(import.meta.dirname, "input.txt"),
);

const _example = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

const equations = input.split("\n");

function step1() {
  let solution = 0;
  for (const eq of equations) {
    const [result, numbers] = eq.split(": ");
    const ns = numbers.split(" ").map(Number);
    const left = Number(result);

    let tmp: number[] = [ns[0]];

    for (let i = 1; i < ns.length; i++) {
      const n = ns[i];
      tmp = [
        ...tmp.map((y) => y * n),
        ...tmp.map((y) => y + n),
      ].filter((y) => y <= left);
    }

    if (tmp.includes(left)) {
      solution += left;
    }
  }

  console.log(solution);
}

function step2() {
  let solution = 0;
  for (const eq of equations) {
    const [result, numbers] = eq.split(": ");
    const ns = numbers.split(" ").map(Number);
    const left = Number(result);

    let tmp: number[] = [ns[0]];

    for (let i = 1; i < ns.length; i++) {
      const n = ns[i];
      tmp = [
        ...tmp.map((y) => y * n),
        ...tmp.map((y) => y + n),
        ...tmp.map((y) => Number(y + "" + n)),
      ].filter((y) => y <= left);
    }

    if (tmp.includes(left)) {
      solution += left;
    }
  }

  console.log(solution);
}

if (import.meta.main) {
  step1()
  step2()
}