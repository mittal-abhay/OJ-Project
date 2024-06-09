import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import  cmdExe  from "./cmdExe.js";
import { parseErrors, parseErrorsPy } from "./errorParser.js";
import {writeInputToFile} from "./generateInputFile.mjs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirOutputs = path.join(__dirname, "outputs");


const genDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const execute = async (filepathcode, language, inputValue) => {
  
  const jobId = path.basename(filepathcode).split(".")[0];
  let filename;
  let filepath;
  let exeString;
  let compileString = "";


  switch (language) {
    case "c++":
    case "c":
    case "cpp":
      {
        filename = `${jobId}.out`;
        const dir = path.join(dirOutputs, language == "c" ? "c" : "cpp");
        genDir(dir);
        filepath = path.join(dir, filename);
        compileString = `${
          language == "c" ? "gcc" : "g++"
        } \"${filepathcode}\" -o \"${filepath}\"`;
        exeString = (input) => `\"${filepath}\" < \"${input}\"`;
      }
      break;
    case "py":
    case "python":
      {
        exeString = (input) => `python  -u \"${filepathcode}\" < \"${input}\"`;
      }
      break;
    case "java":
      {
        exeString = (input) => `java \"${filepathcode}\" < \"${input}\"`;
      }
      break;
  }

  /*Compilation*/
  if (compileString)
    try {
      await cmdExe(compileString);
    } catch (err) {
      console.log(err);
      if (language == "c" || language == "cpp" || language == "c++")
        throw parseErrors(err, jobId);
      throw err;
    }

  /*Execution*/
  try {
    const outputPromises = inputValue.map(async (input,i) => {
      const inputFile = await writeInputToFile(input,i);
      const { stdout } = await cmdExe(exeString(inputFile));
      return stdout;
    });
    const outputValue = await Promise.all(outputPromises);
    return outputValue;
  } catch (err) {
    console.log(err);
    if (language == "java") throw parseErrors(err, jobId);
    if (language == "python" || language == "py")
      throw parseErrorsPy(err, jobId);
    throw { status: 2, error: String(err) };
  }
};

export default execute;