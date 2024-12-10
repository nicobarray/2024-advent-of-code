import * as path from "jsr:@std/path@1";
import { Map } from "../../../../util.ts";

async function solve(input: string, part: 1 | 2) {
  let solution = 0

  const map = new Map(input, Number);

  const trails: number[][] = [];
  const links: number[][] = [];
  const adj = (x: number) =>
    [map.top(x), map.right(x), map.bottom(x), map.left(x)].filter((x_) =>
      x_ !== -1
    );

  for (let i = 0; i < map.size; i++) {
    const height = map.get(i);
    links.push([]);

    if (height === 0) {
      trails.push([i]);
    }

    for (const j of adj(i)) {
      const nextHeight = map.get(j);
      if (nextHeight - height === 1) {
        links[i].push(j);
      }
    }
  }

  for (const trail of trails) {
    const [headtrail] = trail;
    const closedList = [headtrail];

    while (closedList.length > 0) {
      const i = closedList.pop()!;

      if (map.get(i) === 9) {
        solution++;
        continue;
      }

      for (const n of links[i]) {
        // avoid loops
        if (trail.includes(n)) {
          continue;
        }

        closedList.push(n);
        if (part === 1) {
          trail.push(n)
        }
      }
    }
  }

  return solution;
}

export async function step1(input: string) {
  console.log(await solve(input, 1));
}

export async function step2(input: string) {
  console.log(await solve(input, 2));
}

if (import.meta.main) {
  const file = await Deno.readTextFile(
    path.join(import.meta.dirname, "input.txt"),
  );
  const example = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`;

  await step1(file);
  await step2(file);
}
