import { exec } from "child_process";
const cmdExe = (exeString) => {
  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    exec(exeString, (err, stdout, stderr) => {
      const end = process.hrtime(start);
      const executionTime = end[0] * 1000 + end[1] / 1e6;
      
      if (stderr) reject(new Error(stderr));
      if (err) reject(err);
      resolve({ stdout, executionTime });
    });
  });
};

export default cmdExe;