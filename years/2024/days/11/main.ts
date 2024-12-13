import * as path from "jsr:@std/path@1";
import { sumOf } from "jsr:@std/collections";

async function solve(input: string, times: number) {
  const blink = (n: number) => {
    if (n === 0) {
      return [1];
    }

    const s = String(n);
    if (s.length % 2 === 0) {
      return [s.slice(0, s.length / 2), s.slice(s.length / 2)].map(Number);
    }

    return [n * 2024];
  };

  const cache = new Map<number, { count: number; into: number[] }>();
  for (const rock of input.split(" ").map(Number)) {
    if (cache.has(rock)) {
      cache.get(rock)!.count++;
    } else {
      cache.set(rock, { count: 1, into: blink(rock) });
    }
  }

  for (let t = 0; t < times; t++) {
    const rocks = [
      ...cache.entries().filter(([_, { count }]) => count > 0),
    ].map(([key, value]) => [key, {...value}] as const);
    for (
      const [rock, { count, into }] of rocks
    ) {
      cache.get(rock)!.count -= count;
      for (const next of into) {
        if (cache.has(next)) {
          cache.get(next)!.count += count;
        } else {
          cache.set(next, { count, into: blink(next) });
        }
      }
    }
  }
  return sumOf(cache.values(), ({ count }) => count);
}

export async function step1(input: string) {
  console.log(await solve(input, 25));
}

export async function step2(input: string) {
  console.log(await solve(input, 75));
}

if (import.meta.main) {
  const file = await Deno.readTextFile(
    path.join(import.meta.dirname, "input.txt"),
  );

  await step1(file);
  await step2(file);
}
