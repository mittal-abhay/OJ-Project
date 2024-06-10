import path from "path";
import { cmdExe } from "../cmdExe.js";
import { parseErrors, parseErrorsPy } from "../errorParser.js";
import { dirOutputs, genDir, writeInputToFile } from "../generateInputFile.mjs";

export const executeCheck = async (filepathcode, language, testcases) => {
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
    case "java": {
      exeString = (input) => `java \"${filepathcode}\" < \"${input}\"`;
    }
  }
  if (compileString)
    try {
      await cmdExe(compileString);
    } catch (err) {
      if (language == "c" || language == "cpp" || language == "c++")
        throw parseErrors(err, jobId); //E1
      throw err;
    }

  try {
    const inputFile = await writeInputToFile(testcases[0].input, 0);
    await cmdExe(exeString(inputFile, true));
  } catch (err) {
    if (err.killed || err.code == "ERR_CHILD_PROCESS_STDIO_MAXBUFFER")
      throw {
        status: 0,
        error: {
          message: `failed at testcase 1`,
          casespassed: 0,
          err: String(err),
        },  
      }; //E0
    if (language == "java") throw parseErrors(err, jobId); //E1
    else if (language == "py" || language == "python")
      throw parseErrorsPy(err, jobId); //E1
    throw err;
  }

  let maxExecutionTime = 0;
  for (const [i, testcase] of testcases.entries()) {
    const inputFile = await writeInputToFile(testcase.input, i);
    try {
      const { stdout, executionTime } = await cmdExe(
        exeString(inputFile),
        true
      );
      maxExecutionTime = Math.max(maxExecutionTime, executionTime);
      const cmpOut = JSON.stringify(
        stdout.replaceAll("\r\n", "\n").replace(/^\n|\n$/g, "")
      );
      const cmpexpected_output = JSON.stringify(
        testcase.expected_output.replace(/^\n|\n$/g, "")
      );
      if (cmpOut === cmpexpected_output) {
        continue;
      }
      throw {
        status: 2,
        error: { message: `failed at testcase ${i + 1}`, casespassed: i },
      };
    } catch (err) {
      if (err.killed || err.code == "ERR_CHILD_PROCESS_STDIO_MAXBUFFER")
        throw {
          status: 0,
          error: {
            message: `failed at testcase ${i + 1} TLE`,
            casespassed: i,
            err: String(err),
          },
        }; //E0
      throw err;
    }
  }
  return { casespassed: testcases.length, exeTime: maxExecutionTime };
};
