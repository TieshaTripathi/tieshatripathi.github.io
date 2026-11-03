import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import sharp from "sharp";
import { projectData, leadershipData, experienceRoles } from "../src/data.js";
const baseline = JSON.parse(
  readFileSync(new URL("./content-baseline.json", import.meta.url), "utf8"),
);
for (const name of baseline.assets) {
  const file = new URL("../public/" + name, import.meta.url);
  assert(existsSync(file), `Missing original asset ${name}`);
  const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
  assert.equal(
    hash(readFileSync(file)),
    baseline.assetHashes[name],
    `Original asset changed: ${name}`,
  );
}
assert.equal(
  projectData.length,
  3,
  "Preserve the original archived third project data",
);
for (const title of [
  "General Secretary",
  "Co-Organizer",
  "Management & Outreach Coordinator",
])
  assert(leadershipData.some((role) => role.title === title));
assert.equal(leadershipData.length, 3);
assert(
  leadershipData.some(
    (role) =>
      role.title === "Management & Outreach Coordinator" &&
      role.image === "/gdg-community.jpg",
  ),
);
assert.equal(experienceRoles.length, 2);
const code = readFileSync(
  new URL("../src/Content.jsx", import.meta.url),
  "utf8",
);
for (const phrase of [
  "TECH लेख",
  "tieshatripathiwork14@gmail.com",
  "https://www.linkedin.com/in/tieshatripathi14",
  "https://x.com/Tieshaaaah",
  "formsubmit.co",
  "_honey",
])
  assert(code.includes(phrase), `Missing original content: ${phrase}`);
const cutout = new URL(
  "../public/professional-portrait-cutout.png",
  import.meta.url,
);
const metadata = await sharp(readFileSync(cutout)).metadata();
const stats = await sharp(readFileSync(cutout)).stats();
assert(
  metadata.hasAlpha && !stats.isOpaque,
  "The replacement portrait must retain genuine transparency",
);
console.log(
  "Original asset hashes, project records, roles, links, recognition and contact functionality verified.",
);
