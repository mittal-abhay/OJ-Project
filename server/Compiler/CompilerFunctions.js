import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { cmdExe } from "../cmdExe.js";
import { parseErrors, parseErrorsPy } from "../errorParser.js";
import {
  dirCodes,
  dirOutputs,
  genDir,
  writeInputToFile,
} from "../generateInputFile.mjs";

/*Generate Code File of the respective language */
export const generateFile = (language, code) => {
  const jobId = uuid();
  let filename;
  let filepath;
  let dir;
  switch (language) {
    case "c++":
    case "cpp":
      {
        filename = `${jobId}.cpp`;
        dir = path.join(dirCodes, "cpp");
      }
      break;
    case "c":
      {
        filename = `${jobId}.c`;
        dir = path.join(dirCodes, "c");
      }
      break;
    case "py":
    case "python":
      {
        filename = `${jobId}.py`;
        dir = path.join(dirCodes, "py");
      }
      break;
    case "java":
      {
        filename = `${jobId}.java`;
        dir = path.join(dirCodes, "java");
      }
      break;
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
  genDir(dir);
  filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, code);
  return filepath;
};
/////////////////////////////////////////////

export const execute = async (filepathcode, language, inputValue) => {

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
      if (language == "c" || language == "cpp" || language == "c++")
        throw parseErrors(err, jobId); //E0
      throw err;
    }

  /*Execution*/
  try {

    const outputPromises = inputValue.map(async (input, i) => { 
      const inputFile = await writeInputToFile(input, i);
      console.log(inputFile);
      const { stdout } = await cmdExe(exeString(inputFile), true);
      console.log(stdout);

      return stdout;
    });
    const outputValue = await Promise.all(outputPromises);
    return outputValue;
  } catch (err) {
    if (err.killed || err.code == "ERR_CHILD_PROCESS_STDIO_MAXBUFFER")
      throw { status: 0, error: String(err) }; //E0
    if (language == "java") throw parseErrors(err, jobId); //E1
    if (language == "python" || language == "py")
      throw parseErrorsPy(err, jobId); //E1
    throw { status: 2, error: String(err) }; //E2
  }
};