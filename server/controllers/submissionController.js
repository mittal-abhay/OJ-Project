import Submission from '../models/Submission.js';
import fs from 'fs';

//get Submission by id
export const getSubmissionById = async(req, res) => {
    try{
        const id = req.params.id;
        const submission = await Submission.findById(id);
        return res.status(200).json(submission);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}



export const getCode = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        const codeFilePath = submission.code_ref;

        fs.readFile(codeFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            return res.status(200).json({ code: data });
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
