import * as path from "jsr:@std/path@1";

const input = await Deno.readTextFile(
  path.join(import.meta.dirname, "input.txt"),
);

// TODO: solve aoc
export async function step1() {
  let answer = 0;

  for (const line of input.split("\n").filter(Boolean)) {
    const levels = line.split(" ").map(Number);

    const dir0 = levels[1] - levels[0] > 0 ? "inc" : "desc";

    try {
      for (let i = 1; i < levels.length; i++) {
        const dir = levels[i] - levels[i - 1] > 0 ? "inc" : "desc";
        if (dir !== dir0) {
          throw new Error("Unsafe: ordering changed");
        }

        if (levels[i - 1] === levels[i]) {
          throw new Error("Unsafe: equal adjacent levels");
        }

        const diff = Math.abs(levels[i - 1] - levels[i]);

        if (diff === 0 || diff > 3) {
          throw new Error(
            "Unsafe: too much difference between adjacent levels",
          );
        }
      }

      answer++;
    } catch (_err) {
      // Invalid report.
    }
  }

  console.log(answer);
}

export async function step2() {
  let answer = 0;

  const validateReport = (report: number[]) => {
    const dir0 = report[1] - report[0] > 0 ? "inc" : "desc";

    for (let i = 1; i < report.length; i++) {
      const dir = report[i] - report[i - 1] > 0 ? "inc" : "desc";
      if (dir !== dir0) {
        return false;
      }

      if (report[i - 1] === report[i]) {
        return false;
      }

      const diff = Math.abs(report[i - 1] - report[i]);

      if (diff === 0 || diff > 3) {
        return false;
      }
    }

    return true;
  };

  for (const line of input.split("\n").filter(Boolean)) {
    const levels = line.split(" ").map(Number);

    if (validateReport(levels)) {
      answer++;
      continue;
    }

    for (let i = 0; i < line.length - 1; i++) {
      if (validateReport(levels.slice(0, i).concat(levels.slice(i + 1)))) {
        answer++;
        break;
      }
    }
  }

  console.log(answer);
}

if (import.meta.main) {
  await step1();
  await step2();
}
