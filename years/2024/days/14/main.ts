import * as path from "jsr:@std/path@1";
  
  const input = await Deno.readTextFile(path.join(import.meta.dirname, "input.txt"))

  // TODO: solve aoc
  export async function step1() {
    for (const line of input.split('\n')) {
    }

    console.log(1)
  }

  export async function step2() {
    for (const line of input.split('\n')) {
    }

    console.log(2)
  }

  if (import.meta.main) {
    await step1()
    await step2()
  }
  