import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';

export const getUserById = async(req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findById(id);

        if(user == null){
            return res.status(404).json({message: "Cannot find User"});
        }
        
        return res.status(200).json(user)
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}


//update problems solved
export const updateUserProblems = async(req, res) => {
    try {
        const id = req.params.id;
        const problemId = req.params.problem_id;
        const { submission } = req.body;
    
        const user = await User.findById(id);
        const problem = await Problem.findById(problemId);
    
        if (!problem) {
          return res.status(404).json({ message: "Cannot find Problem" });
        }
        if (!user) {
          return res.status(404).json({ message: "Cannot find User" });
        }
    
        if (user.attemptedProblems.some(p => p.problem_id.toString() === problemId)) {
          return res.status(400).json({ message: "Problem already attempted" });
        }
    
        const newSubmission = new Submission(
            {
                user_id: id,
                problem_id: problemId,
                code: submission.code,
                language: submission.language,
                verdict: submission.verdict,
                memory: submission.memory
            }
            );

        await newSubmission.save();
    
        problem.submissions.push(newSubmission._id);
        await problem.save();
    
        user.attemptedProblems.push({
          problem_id: problemId,
          solved: submission.verdict === 'Accepted',
          submission_id: newSubmission._id,
          verdict: submission.verdict
        });
        await user.save();
    
        return res.status(200).json(user);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
}


//get all problems solved by user
export const getUserProblems = async(req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findById(id);

        if(user == null){
            return res.status(404).json({message: "Cannot find User"});
        }

        return res.status(200).json(user.attemptedProblems);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}


//get Submissions of a user
export const getUserSubmissions = async(req, res) => {
    try{
        const id = req.params.id;
        const submissions = await Submission.find({user_id: id});
        return res.status(200).json(submissions);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}


