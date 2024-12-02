import * as path from "jsr:@std/path@1";
  import {zip} from 'jsr:@std/collections'

  const input = await Deno.readTextFile(path.join(import.meta.dirname, "input.txt"))

  // TODO: solve aoc
  export async function step1() {
    const left = []
    const right = []
    
    for (const line of input.split('\n')) {
      const [l, r] = line.split('   ')

      const ll = parseInt(l)
      const rr = parseInt(r)

      if (Number.isInteger(ll) && Number.isInteger(rr)) {
        left.push(ll)
        right.push(rr)
      }
    }

    left.sort()
    right.sort()

    const result = zip(left, right).reduce((acc, [l, r]) => acc + Math.abs(l - r), 0)

    console.log(result)
  }

  export async function step2() {
    const left = []
    const right = []
    
    for (const line of input.split('\n')) {
      const [l, r] = line.split('   ')

      const ll = parseInt(l)
      const rr = parseInt(r)

      if (Number.isInteger(ll) && Number.isInteger(rr)) {
        left.push(ll)
        right.push(rr)
      }
    }

    left.sort()
    right.sort()

    const result = left.reduce((acc, l) => acc + l * right.filter(r => r === l).length, 0)

    console.log(result)
  }

  if (import.meta.main) {
    await step1()
    await step2()
  }
  