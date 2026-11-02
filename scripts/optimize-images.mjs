import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const directory = new URL("../public/", import.meta.url);
for (const name of await readdir(directory)) {
  if (!/\.(png|jpg)$/.test(name)) continue;
  const file = new URL(name, directory),
    base = name.replace(/\.(png|jpg)$/, "");
  for (const width of [640, 1280]) {
    const output = new URL(`${base}-${width}.webp`, directory);
    const image = sharp(fileURLToPath(file));
    if (name === "leadership-event.jpg") image.rotate(-90);
    else image.rotate();
    await image
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(fileURLToPath(output));
    console.log(
      `${name} → ${base}-${width}.webp (${Math.round((await stat(output)).size / 1024)} KB)`,
    );
  }
}
