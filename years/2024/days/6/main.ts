import * as path from "jsr:@std/path@1";
import { sleep } from "https://deno.land/x/sleep/mod.ts";
import { patmatch } from "../../../../util.ts";

const file = await Deno.readTextFile(
  path.join(import.meta.dirname, "input.txt"),
);

const example = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

const _example1 = `....
#...
.^#.
.#..`;

class Map {
  width: number;
  map: string[]; // 1d array of a 2d map, every "width" indexes, it is a new row.
  size: number;
  constructor(raw: string) {
    this.width = raw.indexOf("\n");
    this.map = raw.split("\n")
      .filter((row) => row.length) // remove last empty line in the file
      .flatMap((row) => row.split(""));
    this.size = this.map.length;
  }

  get(index: number) {
    return this.map[index];
  }

  set(index: number, value: string) {
    this.map[index] = value;
  }

  findFirstIndex(cell: string) {
    return this.map.indexOf(cell);
  }

  toString(fakeObstaclePos?: number, obstacles?: Set<number>) {
    let row = "";
    for (let i = 0; i < this.size; i++) {
      if (i !== 0 && (i % this.width) === 0) {
        row += "\n";
      }
      if (obstacles?.has(i)) {
        row += 'o'
      } else if (i === fakeObstaclePos) {
        row += 'O'
      } else {
        row += this.map[i]
      }
    }
    return row;
  }
}

export async function step1(input: string) {
  const walk = async (agent: number, map: Map, interactive = false) => {
    let state: "walking" | "looping" | "left-the-map" = "walking";
    const path: number[] = [];

    do {
      const agentCell = map.get(agent);
      const dir = {
        "^": -map.width,
        ">": 1,
        "v": map.width,
        "<": -1,
      }[agentCell];

      const nextPos = agent + dir!;

      if (nextPos < 0 || nextPos >= map.size) {
        path.push(agent);
        state = "left-the-map";
        break;
      }

      if (Math.abs((agent % map.width) - (nextPos % map.width)) > 1) {
        path.push(agent);
        state = "left-the-map";
        break;
      }

      const nextCell = map.get(nextPos);

      if (nextCell === "#") {
        const rotateRight = patmatch(
          [
            ["^", ">"],
            [">", "v"],
            ["v", "<"],
            ["<", "^"],
          ],
          "$",
        )(agentCell);
        map.set(agent, rotateRight!);
      } else {
        map.set(agent, "X");
        map.set(nextPos, agentCell);

        path.push(agent);
        agent = nextPos;
      }

      if (interactive) {
        console.clear();
        console.log(map.toString());
        await sleep(1 / 10);
      }
    } while (state === "walking");

    return new Set(path).size;
  };

  const map = new Map(input);
  const agent = map.findFirstIndex("^");
  console.log(await walk(agent, map, true));
}

export async function step2(input: string, interactive = false) {
  const obstacles = new Set<number>();

  const walk = async (
    agent: number,
    map: Map,
    options: {
      fakeObstacle?: number;
      path?: number[];
      pathDir?: string[];
      interactive?: boolean;
    } = {},
  ) => {
    let state: "walking" | "looping" | "left-the-map" = "walking";
    const path: number[] = options.path ?? [];
    const pathDir: string[] = options.pathDir ?? [];

    const moveAgent = (from: number, to: number, map_: Map) => {
      const dir = map_.get(from)
      path.push(from);
      pathDir.push(dir);

      map_.set(from, "X");
      map_.set(to, dir);
      
      return to;
    };

    do {
      const agentCell = map.get(agent);
      const dir = {
        "^": -map.width,
        ">": 1,
        "v": map.width,
        "<": -1,
      }[agentCell];


      const nextPos = agent + dir!;

      if (nextPos < 0 || nextPos >= map.size) {
        path.push(agent);
        state = "left-the-map";
        break;
      }

      if (Math.abs((agent % map.width) - (nextPos % map.width)) > 1) {
        path.push(agent);
        state = "left-the-map";
        break;
      }

      const nextCell = map.get(nextPos);

      if (nextCell === "#") {
        const rotateRight = patmatch(
          [
            ["^", ">"],
            [">", "v"],
            ["v", "<"],
            ["<", "^"],
          ],
          "$",
        )(agentCell);
        map.set(agent, rotateRight!);
      } else {
        // Check possible right run that gets the agent into a loop.
        if (typeof options.fakeObstacle === "undefined" && nextCell !== 'X') {
          const tmpMap = new Map(map.toString());
          const turnRight = patmatch(
            [
              ["^", ">"],
              [">", "v"],
              ["v", "<"],
              ["<", "^"],
            ],
            "$",
          )(agentCell)!;
          tmpMap.set(agent, turnRight);

          const walkState = await walk(agent, tmpMap, {
            fakeObstacle: nextPos,
            path: [...path],
            pathDir: [...pathDir],
            interactive: options.interactive,
          });

          if (walkState === "looping") {
            obstacles.add(nextPos);
          }
        } else if(typeof options.fakeObstacle !== "undefined") {
          const prevEqual = path.lastIndexOf(agent);
          if (prevEqual !== -1) {
            const prevDir = pathDir[prevEqual];
            if (prevDir === agentCell) {
              // loop detected !
              state = "looping";
              break;
            }
          }
        }

        agent = moveAgent(agent, nextPos, map);
      }

      if (options.interactive) {
        console.clear();
        console.log('+------------------------+')
        console.log(options.fakeObstacle ? 'sub-walk' : 'main walk')
        console.log('+------------------------+')
        console.log(map.toString(options.fakeObstacle, obstacles));
        console.log('+------------------------+')
        console.log('paths', path.length);
        console.log(pathDir.length);
        console.log('+------------------------+')
        await sleep(2);
      }
    } while (state === "walking");

    return state;
  };

  const map = new Map(input);
  const agent = map.findFirstIndex("^");
  await walk(agent, map, { interactive });

  console.log(obstacles.size);
}

if (import.meta.main) {
  // await step1(example);
  await step2(example, true);
}
