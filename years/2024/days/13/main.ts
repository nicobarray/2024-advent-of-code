import * as path from "jsr:@std/path@1";
import { sub, sum, Vec, vec } from "../../../../util.ts";

const parseMachines = (input: string) => {
  return input.split(/\n\n/).map((line) =>
    /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/gm
      .exec(line)?.slice(1, 7).map(Number) ?? []
  ).map(([ax, ay, bx, by, px, py]) => ({
    a: vec([ax, ay]),
    b: vec([bx, by]),
    p: vec([px, py]),
  }));
};

const TokenCost = {
  a: 3,
  b: 1,
};

const playWorksWithExample = ({ a, b, p }: { a: Vec; b: Vec; p: Vec }) => {
  console.log("Play", a, b, p);

  const res = (ta: number, tb: number) => {
    const cost = ta * TokenCost.a + tb * TokenCost.b;
    console.log("Arcade won:", {
      ta,
      tb,
      cost,
    });
    return cost;
  };
  const prizeIsValid = (prize: Vec) => prize[0] > 0 && prize[1] > 0;

  let pA = vec(p);
  const tA = { a: 0, b: 0 };

  while (prizeIsValid(pA)) {
    if (pA[0] % b[0] === 0 && pA[1] % b[1] === 0) {
      tA.b += pA[0] / b[0];
      return res(tA.a, tA.b);
    }
    pA = sub(pA)(a);
    tA.a++;
  }

  let pB = vec(p);
  const tB = { a: 0, b: 0 };

  while (prizeIsValid(pB)) {
    if (pB[0] % a[0] === 0 && pB[1] % a[1] === 0) {
      tB.a += pB[0] / a[0];
      return res(tB.a, tB.b);
    }
    pB = sub(pB)(b);
    tB.b++;
  }

  console.log("Game Over");
  console.log();

  return 0;
};

const solve = (input: string) => {
  const machines = parseMachines(input);
  console.log(machines);
  console.log();
  const tokens = machines.map(playWorksWithExample).reduce(sum, 0);
  return [tokens];
};

if (import.meta.main) {
  const file = await Deno.readTextFile(
    path.join(import.meta.dirname, "input.txt"),
  );

  const _example = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

  const [part1, part2] = solve(_example);

  // too low : 31962
  // answer ???
  // too high: 43822
  // too high: 75837
  console.log(part1);
  console.log(part2);
}
