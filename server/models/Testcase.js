import mongoose from "mongoose";

const TestcaseSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true
    },
    expected_output: {
        type: String,
        required: true
    },
    problem_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    }
});

const Testcase = mongoose.model('Testcase', TestcaseSchema);
export default Testcase;


