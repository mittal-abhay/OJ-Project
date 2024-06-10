import { exec } from "child_process";
export const cmdExe = (exeString, isFileRun = false) => {

  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    exec(
      exeString,
      { timeout: isFileRun ? 2 * 1000 : 100 * 1000 },
      (err, stdout, stderr) => {
        const end = process.hrtime(start);
        const executionTime = end[0] * 1000 + end[1] / 1e6;
        if (err) console.log("ERROR console", err);
        if (stderr) return reject(new Error(stderr));
        if (err) return reject(err);
        resolve({ stdout, executionTime });
      }
    );
  });
};
