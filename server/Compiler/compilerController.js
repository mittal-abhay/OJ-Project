import { execute, generateFile } from "./CompilerFunctions.js";
export const compiler = async (req, res) => {
  try {
    const { lang = "cpp", code, inputValue } = req.body;
    console.log( req.body)
    if (!code) {
      return res.status(400).send({
        success: false,
        message: "Code is Missing",
        error: { status: 4 }, //E4
      });
    }
    const filepath = generateFile(lang, code);
    const output = await execute(filepath, lang, inputValue);
   
    return res.status(200).json({
      success: true,
      message: "[Successful]",
      filepath,
      output,
    });
  } catch (err) {
    if (err.status == 0) {
      return res.status(400).send({
        success: false,
        message: "Time Limit Exceeded",
        error: err,
      });
    }
    if (err.status == 1) {
      return res.status(400).send({
        success: false,
        message: "Compilation Failed",
        error: err,
      });
    }
    if (err.status == 2) {
      return res.status(400).send({
        success: false,
        message: "Execution Failed",
        error: err,
      });
    }
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};