import * as path from "jsr:@std/path@1";
import { Edge, Grid, Vec } from "../../../../util.ts";

const solve = (input: string) => {
  const grid = new Grid(input, (c) => c);
  const processed = new Set<number>();

  const makeField = (i: number) => {
    processed.add(i);

    const field = new Set<number>();
    const queue: number[] = [i];

    let area = 0;
    let perimeter = 0;
    const edges = new Set<string>();

    const touchEdge = (from: Vec, to: Vec) => {
      const facing = grid.getEdge(from, to);
      const [z, axis] = (facing === Edge.Top || facing === Edge.Bottom)
        ? [from[0], from[1]]
        : [from[1], from[0]];

      let newEdge = true;
      for (const edge of [...edges.keys()]) {
        const [range, facing_] = edge.split(" facing ");
        if (Edge[facing] !== facing_) {
          continue;
        }

        const [z0, z1, a] = range.split(/->|on/).map(Number);

        if (z === z0 - 1 && axis === a) {
          edges.delete(edge);
          edges.add(z + "->" + z1 + " on " + a + " facing " + Edge[facing]);
          newEdge = false;
          return;
        } else if (z === z1 + 1 && axis === a) {
          edges.delete(edge);
          edges.add(z0 + "->" + z + " on " + a + " facing " + Edge[facing]);
          newEdge = false;
          return;
        }
      }

      if (newEdge) {
        edges.add(z + "->" + z + " on " + axis + " facing " + Edge[facing]);
      }
    };

    while (queue.length > 0) {
      const index = queue.shift()!;
      const pos = grid.xy(index);
      const cell = grid.get(index);

      processed.add(index);
      field.add(index);

      area++;

      const neighbours = grid.adj(pos);
      const outsides = 4 - neighbours.length;
      perimeter += outsides;

      const allNeighbours = grid.adj(pos, true);
      const outsideOnly = allNeighbours.filter((p) =>
        !neighbours.some((n) => n.join("") === p.join(""))
      );
      for (const outside of outsideOnly) {
        touchEdge(pos, outside);
      }

      for (const nPos of neighbours) {
        const nIndex = grid.x(nPos);
        const nCell = grid.get(nIndex);

        if (nCell !== cell) {
          perimeter++;
          touchEdge(pos, nPos);
          continue;
        }

        if (field.has(nIndex)) {
          continue;
        }

        field.add(nIndex);
        queue.push(nIndex);
      }
    }

    return [area, perimeter, edges, field] as const;
  };

  let part1 = 0;
  let part2 = 0;

  grid.walk((i) => {
    if (processed.has(i)) {
      return;
    }

    const [area, perimeter, fences] = makeField(i);

    part1 += area * perimeter;
    part2 += area * fences.size;
  });

  return [part1, part2];
};

if (import.meta.main) {
  const file = await Deno.readTextFile(
    path.join(import.meta.dirname, "input.txt"),
  );
//   const example = `AAAA
// BBCD
// BBCC
// EEEC`;
//   const example1 = `OOOOO
// OXOXO
// OOOOO
// OXOXO
// OOOOO`;
//   const example2 = `EEEEE
// EXXXX
// EEEEE
// EXXXX
// EEEEE`;
//   const example3 = `AAAAAA
// AAABBA
// AAABBA
// ABBAAA
// ABBAAA
// AAAAAA`;
// const example4 = `RRRRIICCFF
// RRRRIICCCF
// VVRRRCCFFF
// VVRCCCJFFF
// VVVVCJJCFE
// VVIVCCJJEE
// VVIIICJJEE
// MIIIIIJJEE
// MIIISIJEEE
// MMMISSJEEE`

  const [part1, part2] = solve(file);

  console.log(part1);
  console.log(part2);
}
