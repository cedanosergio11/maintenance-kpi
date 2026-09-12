import { cpSync, copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "public");
const dest = join(root, "dist", "client");

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });

const index = join(dest, "index.html");
if (!existsSync(index)) {
  throw new Error("public/index.html missing");
}
copyFileSync(index, join(dest, "404.html"));
console.log("build:pages -> dist/client");
