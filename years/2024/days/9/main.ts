import * as path from "jsr:@std/path@1";
import { div, sumAll } from "../../../../util.ts";
import { Buffer } from 'node:buffer'
import { format } from "jsr:@std/fmt/duration";
import { sortBy } from "jsr:@std/collections";

const file = await Deno.readTextFile(
  path.join(import.meta.dirname, "input.txt"),
);

const bonus = await Deno.readTextFile(
  path.join(import.meta.dirname, "bonus.txt"),
);

const example = "2333133121414131402";

const range = (n: number) => [...new Array(n).keys()];

export async function step1(input: string) {
  const diskMap = input.split("");

  const fragmentedBlocks: (string | number)[] = [];
  for (let i = 0; i < diskMap.length; i++) {
    const size = Number(diskMap[i]);
    if (i % 2 === 0) {
      range(size).forEach(() => fragmentedBlocks.push(i / 2));
    } else {
      range(size).forEach(() => fragmentedBlocks.push("."));
    }
  }

  const defragmentedBlocks = [...fragmentedBlocks];
  let i = 0;
  let j = defragmentedBlocks.length;

  while (i !== j) {
    i = defragmentedBlocks.indexOf(".");
    j = defragmentedBlocks.findLastIndex((cell) => cell !== ".");

    if (i > j) {
      break;
    }

    // swap i and j
    defragmentedBlocks[i] = defragmentedBlocks[j];
    defragmentedBlocks[j] = ".";
  }

  console.log(
    sumAll(
      defragmentedBlocks.filter((file) => file !== ".").map(Number).map((
        n,
        i,
      ) => (n * i)),
    ),
  );
}

export async function step2(input: string) {
  const diskMap = input.split("");

  const disk: (string | number)[] = []; // "." | fileId
  const files: [number, number][] = [] // x, size
  const freeSlots: [number, number][] = [] // x, size

  for (let i = 0; i < diskMap.length; i++) {
    const size = Number(diskMap[i]);
    if (i % 2 === 0) {
      files.push([disk.length, size])
      range(size).forEach(() => disk.push(i / 2));
    } else {
      freeSlots.push([disk.length, size])
      range(size).forEach(() => disk.push("."));
    }
  }

  files.reverse()

  for (const [f0, fsize] of files) {
    // find first free slot that is big enough for the current fileId's file size
    const slotIndex = freeSlots.findIndex(([s0, size]) => size > 0 && fsize <= size && f0 > s0)

    // don't move the file (no free space for it)
    if (slotIndex === -1) {
      continue
    }

    // console.log(disk.join('') + ' <- ' + disk[f0])
    // console.log(slotIndex, freeSlots)
    const [s0, ssize] = freeSlots[slotIndex]

    // write the fileId in the free slot
    for (let i = 0; i < fsize; i++) {
      disk[s0 + i] = disk[f0 + i]
      disk[f0 + i] = "."
    }

    // update the free slot map
    freeSlots[slotIndex] = [s0 + fsize, ssize - fsize]
  }


  console.log(
    sumAll(
      disk.map(Number).map((
        n,
        i,
      ) => isNaN(n) ? 0 : (n * i)),
    ),
  );
}

if (import.meta.main) {
  await step1(file);
  // 8632330985597 too high (1
  // 6476642796832 !!! (3
  // 5341160662740 too low (2

  const reddit = `233313312141413140211`
  await step2(file);
}
