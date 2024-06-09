import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/*Create if the directory not exists*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirTempinput = path.join(__dirname, "tempInput");
export const dirOutputs = path.join(__dirname, "outputs");

export const genDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const writeInputToFile = async (input, i) => { 
  const fileTempinput = path.join(dirTempinput, `temp${i}.txt`);
  await fs.promises.writeFile(fileTempinput, input);
  return fileTempinput;
};


