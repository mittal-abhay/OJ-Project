import mongoose from "mongoose";


const ProblemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    statement: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    difficulty_level: { 
        type: String, enum: ['easy', 'medium', 'hard'], 
        required: true 
    },
    score: { 
        type: Number, 
        required: true 
    },
    sample_testcases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Testcase' }],
    constraints: {
        type: String,
        required: true
    },
    input_format: {
        type: String,
        required: true
    },
    output_format: {
        type: String,
        required: true
    },
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
    testcases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Testcase' }],
    execution_time_limit: { 
        type: Number, 
        default: 2 
    },  
});

const Problem = mongoose.model('Problem', ProblemSchema);

export default Problem;