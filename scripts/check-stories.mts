import { selfCheck } from "../src/lib/story-engine.ts";

const problems = selfCheck();
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("ok: story engine");
