import * as path from "jsr:@std/path@1";
import { add, sub, mult, Vec } from "../../../../util.ts";

const file = await Deno.readTextFile(
  path.join(import.meta.dirname, "input.txt"),
);

const example = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`

// TODO: solve aoc
export async function step1(input: string) {
  const map = input.split("\n").map((row) => row.split(""));

  const antennas: Record<string, [number, number][]> = {};
  const antinodes = new Set<string>()

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const cell = map[y][x];
      if (cell === ".") {
        continue;
      }

      antennas[cell] ??= []
      antennas[cell].push([x, y])
    }
  }

  const isBound = (pos: Vec) => {
    return pos[0] >= 0 && pos[1] >= 0 && pos[0] < map[0].length && pos[1] < map.length
  }
  
  const allPos = []

  for (const [_antenna, positions] of Object.entries(antennas)) {
    for (const a of positions) {
      for (const b of positions) {
        if (a.join() === b.join()) {
          console.log('skip same', a,b)
          continue
        }

        const vec = sub(a)(b)
        const antiA = add(a)(vec)
        const antiB = sub(b)(vec)

        allPos.push(antiA.join('_'))
        allPos.push(antiB.join('_'))

        if (isBound(antiA)) {
          antinodes.add(antiA.join('_'))
        }
        if (isBound(antiB)) {
          antinodes.add(antiB.join('_'))
        }
      }
    }
  }

  let row = ''
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const cell = map[y][x];
      if (allPos.includes(x + '_' + y)) {
        row += '#'
      } else {
        row += cell
      }
    }
    row += '\n'
  }
  console.log(row);
  console.log(row.split('').filter(r => r === '#').length)
}

export async function step2(input: string) {
  const map = input.split("\n").map((row) => row.split(""));

  const antennas: Record<string, [number, number][]> = {};
  const antinodes = new Set<string>()

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const cell = map[y][x];
      if (cell === ".") {
        continue;
      }

      antennas[cell] ??= []
      antennas[cell].push([x, y])
    }
  }

  const isBound = (pos: Vec) => {
    return pos[0] >= 0 && pos[1] >= 0 && pos[0] < map[0].length && pos[1] < map.length
  }
  
  const allPos = []

  for (const [_antenna, positions] of Object.entries(antennas)) {
    for (const a of positions) {
      for (const b of positions) {
        if (a.join() === b.join()) {
          continue
        }

        const dirA = sub(a)(b)
        const dirB = sub(b)(a)
        let antiA: Vec = a
        let antiB: Vec = b

        do {
          antiA = add(antiA)(dirA)
          antiB = add(antiB)(dirB)

          allPos.push(antiA.join('_'))
          allPos.push(antiB.join('_'))
  
          if (isBound(antiA)) {
            antinodes.add(antiA.join('_'))
          }
          if (isBound(antiB)) {
            antinodes.add(antiB.join('_'))
          }
        } while(isBound(antiA) || isBound(antiB))
      }
    }
  }

  let row = ''
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const cell = map[y][x];
      if (allPos.includes(x + '_' + y)) {
        row += '#'
      } else {
        row += cell
      }
    }
    row += '\n'
  }
  console.log(row);
  console.log(row.split('').filter(r => r !== '.' && r !== '\n').length)
}

if (import.meta.main) {
  await step1(file);
  await step2(file);
}
