import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const page = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf8");
const names = [...page.matchAll(/\/portraits\/([a-z0-9-]+)\.jpg/g)].map((match) => match[1]);
const unique = [...new Set(names)];
const problems = [];

if (unique.length < 9) {
  problems.push(`expected at least 9 portraits in the app, found ${unique.length}`);
}

for (const name of unique) {
  const file = path.join(root, "public/portraits", `${name}.jpg`);
  if (!fs.existsSync(file)) {
    problems.push(`missing public/portraits/${name}.jpg`);
    continue;
  }
  const size = fs.statSync(file).size;
  if (size < 8000) {
    problems.push(`public/portraits/${name}.jpg is too small (${size} bytes)`);
  }
}

const icon = path.join(root, "public/icon.svg");
if (!fs.existsSync(icon)) problems.push("missing public/icon.svg");

if (process.env.CHECK_LIVE === "1") {
  const site = process.env.SITE_URL || "https://velvetmotionai.vercel.app";
  const home = await fetch(site);
  const html = await home.text();
  if (!home.ok) problems.push(`${site} returned ${home.status}`);
  if (!html.includes("Talk")) problems.push("live page is still an older design");
  for (const name of unique) {
    const url = `${site}/portraits/${name}.jpg`;
    const image = await fetch(url, { method: "HEAD" });
    if (!image.ok) problems.push(`${url} returned ${image.status}`);
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(`ok: ${unique.length} portraits match the app${process.env.CHECK_LIVE === "1" ? " and the live site" : ""}`);
