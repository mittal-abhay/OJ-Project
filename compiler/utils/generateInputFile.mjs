import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
/*Create if the directory not exists*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const dirCodes = path.join(__dirname, "../codes");
export const dirOutputs = path.join(__dirname, "../outputs");
export const dirTempinput = path.join(__dirname, "../tempInput");

[dirCodes, dirOutputs, dirTempinput].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
export const genDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
/**Write Input to temp file */
export const writeInputToFile = async (input, i) => {
  const fileTempinput = path.join(dirTempinput, `temp${i}.txt`);
  await fs.promises.writeFile(fileTempinput, input);
  return fileTempinput;
};
