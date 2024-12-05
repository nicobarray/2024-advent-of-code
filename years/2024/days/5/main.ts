import * as path from "jsr:@std/path@1";

const input = await Deno.readTextFile(
  path.join(import.meta.dirname, "input.txt"),
);

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

      swap(pages, i, pages.findIndex((p) => p === failedRule[1]));

      i = -1; // at the end of the for-loop, it inc by 1.
      prevPages = [];
    }

    if (wasWrong) {
      result += Number(pages[Math.floor(pages.length / 2)]);
    }
  }

  console.log(result);
}

if (import.meta.main) {
  step1();
  step2();
}
