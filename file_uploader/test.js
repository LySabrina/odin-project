import fsPromise from "node:fs/promises";
import FileHanlder from "node:fs";
import { cwd } from "node:process";
import { Buffer } from "node:buffer";
console.log(`${cwd()}/Data/test/Cattsu.jpg`);
const readStream = FileHanlder.createReadStream(
  `${cwd()}/Data/test/Cattsu.jpg`,
  { encoding: "hex" }
);
let buffer = "";
try {
  for await (const chunk of readStream) {
    buffer += chunk;
  }
} catch (error) {
  console.error(error);
}

const buf = Buffer.from(buffer);

console.log(buf.toString("base64"));
