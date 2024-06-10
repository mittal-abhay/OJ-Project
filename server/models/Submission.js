import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problem_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    code_ref: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    verdict: {
        type: String,
        required: true
    },
    execution_time: {
        type: Number,
    },
    comment: {
        type: String,
    },
    casespassed: {
        type: Number,
    },
});

const Submission = mongoose.model('Submission', SubmissionSchema);
export default Submission;