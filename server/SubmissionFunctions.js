import path from "path";
import  cmdExe  from "./cmdExe.js";
import  { parseErrors, parseErrorsPy } from "./errorParser.js";
import { dirOutputs, genDir, writeInputToFile } from "./generateInputFile.mjs";

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
      if (language == "c" || language == "cpp" || language == "c++") {
        console.log("[submit compiler error]", err);
        throw parseErrors(err, jobId);
      }
      throw err;
    }

  try {
    const inputFile = await writeInputToFile(testcases[0].input, 0);
    await cmdExe(exeString(inputFile));
  } catch (err) {
    if (language == "java") {
      console.log("[submit compiler error]", err);
      throw parseErrors(err, jobId);
    } else if (language == "py" || language == "python") {
      console.log("[submit compiler error]", err);
      throw parseErrorsPy(err, jobId);
    }
    throw err;
  }

  let maxExecutionTime = 0;
  for (const [i, testcase] of testcases.entries()) {
    const inputFile = await writeInputToFile(testcase.input, i);
    const { stdout, executionTime } = await cmdExe(exeString(inputFile));
    maxExecutionTime = Math.max(maxExecutionTime, executionTime);
    
    const cmpOut = JSON.stringify(
      stdout.replaceAll("\r\n", "\n").replace(/^\n|\n$/g, "")
    );
    const cmpTestOut = JSON.stringify(testcase.expected_output.replace(/^\n|\n$/g, ""));
    if (cmpOut === cmpTestOut) {
      continue;
    }
    console.log("CASE:", i, cmpOut === cmpTestOut);
    console.log("Expected:\n", cmpTestOut);
    console.log("Output:\n", cmpOut);
    console.log("Length of Expected:", cmpTestOut.length);
    console.log("Length of Output:", cmpOut.length);
    throw { status: 2, error: `failed at testcase ${i + 1}` };
  }
  return maxExecutionTime;
};