import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AttemptedProblemSchema = new mongoose.Schema({
    problem_id: { type: Schema.Types.ObjectId, ref: 'Problem' },
    solved: Boolean,
    submission_id: { type: Schema.Types.ObjectId, ref: 'Submission' },
    verdict: String
});

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default: null
    },
    lastname: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "user"
    },
    problemsSolved: {
        type: Number,
        default: 0
    },
    attemptedProblems: [AttemptedProblemSchema]
});


const User = mongoose.model("User", UserSchema);
export default User;