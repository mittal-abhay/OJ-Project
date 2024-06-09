export function parseErrors(errorLog, filename) {
    const errorLogString = String(errorLog);
    const errorLines = errorLogString
      .split("\n")
      .filter((line) => line.includes("error:"));
    const errorCount = errorLines.length;
  
    const formattedErrors = errorLines.map((line) => {
      console.log(filename);
      return line.split(filename)[1];
    });
  
    return { status: 1, errorCount, formattedErrors };
  }

  
  export function parseErrorsPy(errorLog, filename) {
    const errorLogString = String(errorLog);
    const errLines = errorLogString.split("\n");
    const errorLines = errLines
      .map((line, i) => {
        if (line.includes("line"))
          return errLines[i].concat(" ", errLines[i + 1]);
        return "";
      })
      .filter((line) => line.includes("line"));
    const errorCount = errorLines.length;
  
    const formattedErrors = errorLines.map((line) => {
      return line.split(filename)[1];
    });
  
    return { status: 1, errorCount, formattedErrors };
  }