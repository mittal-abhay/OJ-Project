import User from '../models/User.js';
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


export const getUsersByProblems = async (req, res) => {
    try {
        const users = await User.find().sort({ problemsSolvedCount: -1 });
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};




