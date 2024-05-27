import Submission from '../models/Submission.js';


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



