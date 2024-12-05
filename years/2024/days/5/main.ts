import * as path from "jsr:@std/path@1";
import { assertEquals } from 'jsr:@std/assert'

const input = await Deno.readTextFile(
  path.join(import.meta.dirname, "input.txt"),
);

const _example = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

export function step1() {
  const [ordering, updates] = input.split("\n\n");
  const rules = ordering.split("\n").map((order) => order.split("|"));
  let result = 0;

  for (const update of updates.split("\n").filter(Boolean)) {
    const pages = update.split(",");

    let isRightOrder = true;
    const prevPages: string[] = [];
    for (const page of pages) {
      if (
        rules.some(([before, after]) =>
          before === page && prevPages.includes(after)
        )
      ) {
        isRightOrder = false;
        break;
      }
      prevPages.push(page);
    }

    if (isRightOrder) {
      result += Number(pages[Math.floor(pages.length / 2)]);
    }
  }

  console.log(result);
}

export function step2() {
  const input_ = input; // example

  const [ordering, updates] = input_.split("\n\n");
  const rules = ordering.split("\n").map((order) => order.split("|"));
  let result = 0;

  function swap<T>(array: T[], i: number, j: number) {
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }

  for (const update of updates.split("\n").filter(Boolean)) {
    const pages = update.split(",");
    let prevPages: string[] = [];
    let wasWrong = false;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];

      const failedRule = rules.find(([before, after]) =>
        before === page && prevPages.includes(after)
      );

      if (!failedRule) {
        prevPages.push(page);
        continue;
      }

      wasWrong = true;

      console.log(
        "📕 " +
          "%c" + failedRule[0] + "%c" + failedRule[1],
        "background-color: red; color: white",
        "background-color: blue; color: black",
      );
      console.log(
        "🔧 " +
          "%c" + pages.map((p) => {
            return p === failedRule[0]
              ? "%c" + p + "%c"
              : p === failedRule[1]
              ? "%c" + p + "%c"
              : p;
          }).join(" "),
        "background-color: orange; color: black",
        "background-color: blue; color: black",
        "background-color: orange; color: black",
        "background-color: red; color: white",
        "background-color: black; color: grey",
      );

      swap(pages, i, pages.findIndex((p) => p === failedRule[1]));

      i = -1; // at the end of the for-loop, it inc by 1.
      prevPages = [];
    }

    if (wasWrong) {
      console.log(
        "\n🎉 " +
          "%c" + pages.map((p, i) => {
            if (i === Math.floor(pages.length / 2)) {
              return "%c" + p + "%c";
            }
            return p;
          }).join(", "),
        "background-color: green; color: white",
        "background-color: violet; color: white",
        "background-color: green; color: white",
      );
      console.log();

      console.log(prevPages.join(':'))
      console.log(pages.join('.'))
      assertEquals(prevPages, pages) 

      result += Number(pages[Math.floor(pages.length / 2)]);
    }
  }

  console.log(result);
}

if (import.meta.main) {
  step1();
  step2();
}
