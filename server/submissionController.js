import Submission from "./models/Submission.js";
import Testcase from "./models/Testcase.js";
import generateFile from "./generateFile.mjs";
import { executeCheck } from "./SubmissionFunctions.js";

export const submission = async (req, res) => {
  const { user_id, prob_id, lang = "cpp", code } = req.body;
  if (!code) {
    return res.status(400).send({ success: false, message: "[Code is Missing]" });
  }

  const filepath = await generateFile(lang, code);
  const testcases = await Testcase.find({ problem_id: prob_id });

  
  let exeTime = null;
  try {
     exeTime = await executeCheck(filepath, lang, testcases);
    const submission = await Submission.create({
      problem_id: prob_id,
      code_ref: filepath,
      language: lang,
      verdict: true,
      comment: "ALL PASSED",
      user_id: user_id,
      execution_time: exeTime,
    });

    return res.status(200).json({
      success: true,
      message: "Successful",
      submission,
    });
  } catch (err) {
    let comment;
    if (err.status == 1) {
      comment = "Compilation Failed";
    } else if (err.status == 2) {
      comment = err.error;
    } else {
      comment = "Internal Server Error";
    }

    const submission = await Submission.create({
      problem_id: prob_id,
      code_ref: filepath,
      language: lang,
      verdict: false,
      comment: comment,
      user_id: user_id,
      execution_time: exeTime,
    });

    return res.status(err.status == 1 ? 400 : (err.status == 2 ? 401 : 500)).send({
      success: false,
      message: `${comment}`,
      error: err,
      submission,
    });
  }
};
