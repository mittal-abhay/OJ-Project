import Problem from '../models/Problem.js';
import Testcase from '../models/Testcase.js';


// Create a new problem
export const createProblem = async (req, res) => {
    try {
        const { title, statement, tags, difficulty_level, score, testcases, sample_testcases, constraints, input_format, output_format
         } = req.body;
        if (!title || !statement || !tags || !difficulty_level || !score || !testcases || !sample_testcases || !constraints || !input_format || !output_format) {
            return res.status(400).json({ message: "Please fill all fields" });
        }


        if(testcases.length === 0){
            return res.status(400).json({message: "Please add testcases"});
        }else if(sample_testcases.length === 0){
            return res.status(400).json({message: "Please add sample testcases"});
        }

        for(const testcase of testcases){
            if(testcase.input === '' || testcase.expected_output === ''){
                return res.status(400).json({message: "Please fill all fields of testcases"});
            }
        }

        for(const sample_testcase of sample_testcases){
            if(sample_testcase.input === '' || sample_testcase.expected_output === ''){
                return res.status(400).json({message: "Please fill all fields of sample testcases"});
            }
        }


        const problem = new Problem({
            title,
            statement,
            tags,
            difficulty_level,
            score,
            testcases: [], // Initialize with an empty array to populate later
            sample_testcases:[],
            constraints,
            input_format,
            output_format,
        });

        const savedProblem = await problem.save();


        for (const testcase of testcases) {
            const newTestcase = new Testcase({
                input: testcase.input,
                expected_output: testcase.expected_output,
                problem_id: savedProblem._id
            });
            const savedTestcase = await newTestcase.save();
            savedProblem.testcases.push(savedTestcase._id);
        }

        for (const sample_testcase of sample_testcases) {
            const newSampleTestcase = new Testcase({
                input: sample_testcase.input,
                expected_output: sample_testcase.expected_output,
                problem_id: savedProblem._id
            });
            const savedSampleTestcase = await newSampleTestcase.save();
            savedProblem.sample_testcases.push(savedSampleTestcase._id);
        }

        await savedProblem.save();

        return res.status(201).json(savedProblem);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const getProblemList = async (req, res) => {
    try{
        const problems = await Problem.find();
        return res.status(200).json(problems);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const getProblemById = async (req, res) => {
    try{
        const problem = await Problem.findById(req.params.id);
        return res.status(200).json(problem);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const updateProblem = async (req, res) => {
    try{
        const problem = await Problem.findById(req.params.id);
        if(!problem){
            return res.status(404).json({message: "Problem not found"});
        }
        const { title, statement, tags, difficulty_level, score, testcases, sample_testcases, input_format, output_format, constraints} = req.body;
        if(title) problem.title = title;
        if(statement) problem.statement = statement;
        if(tags) problem.tags = tags;
        if(difficulty_level) problem.difficulty_level = difficulty_level;
        if(score) problem.score = score;
        if(input_format) problem.input_format = input_format;
        if(output_format) problem.output_format = output_format;
        if(constraints) problem.constraints = constraints;



        if(sample_testcases) {
            await Testcase.deleteMany({problem_id: problem._id, is_sample: true});
            for (const sample_testcase of sample_testcases) {
                const newSampleTestcase = new Testcase({
                    input: sample_testcase.input,
                    expected_output: sample_testcase.expected_output,
                    problem_id: problem._id,
                    is_sample: true
                });
                const savedSampleTestcase = await newSampleTestcase.save();
                problem.sample_testcases.push(savedSampleTestcase._id);
            }
        }
        
        if(testcases) {
            //delete previous testcases
            await Testcase.deleteMany({problem_id: problem._id, is_sample: false});
            for (const testcase of testcases) {
                const newTestcase = new Testcase({
                    input: testcase.input,
                    expected_output: testcase.expected_output,
                    problem_id: problem._id,
                    is_sample: false
                });
                const savedTestcase = await newTestcase.save();
                problem.testcases.push(savedTestcase._id);
            }
        }
        await problem.save();
        return res.status(200).json(problem);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

//delete problem
export const deleteProblem = async (req, res) => {
    try{
        const problem = await Problem.findById(req.params.id);
        if(!problem){
            return res.status(404).json({message: "Problem not found"});
        }
        await Testcase.deleteMany({problem_id: problem._id});
        await problem.deleteOne();
        return res.status(200).json({message: "Problem deleted successfully"});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

//get sample test cases of a problem
export const getSampleTestCases = async (req, res) => {
    try{
        const problem = await Problem.findById(req.params.id);
        if(!problem){
            return res.status(404).json({message: "Problem not found"});
        }
        const sample_testcases_data = await Testcase.find({problem_id: problem._id, is_sample: true});
        return res.status(200).json(sample_testcases_data);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}
//getTestCases of a problem
export const getTestCases = async (req, res) => {
    try{
        const problem = await Problem.findById(req.params.id);
        if(!problem){
            return res.status(404).json({message: "Problem not found"});
        }
        const testcases = await Testcase.find({problem_id: problem._id});
        return res.status(200).json(testcases);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

//add test cases to a problem
export const addTestcase = async (req, res) => {
    try{
        const problem = await Problem.findById(req.params.id);
    
        if(!problem){
            return res.status(404).json({message: "Problem not found"});
        }
        const { input, expected_output } = req.body;
        if(!input || !expected_output){
            return res.status(400).json({message: "Please fill all fields"});
        }
        const newTestcase = new Testcase({
            input,
            expected_output,
            problem_id: problem._id
        });
        const savedTestcase = await newTestcase.save();
        problem.testcases.push(savedTestcase._id);
        await problem.save();
        return res.status(200).json(problem);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

//delete test case from a problem
export const deleteTestcase = async (req, res) => {
    try{
        const problem = await Problem.findById(req.params.id);
        if(!problem){
            return res.status(404).json({message: "Problem not found"});
        }
        const testcase = await Testcase.findById(req.params.testcase_id);
        if(!testcase){
            return res.status(404).json({message: "Testcase not found"});
        }
        await Testcase.deleteOne({_id: req.params.testcase_id});
        problem.testcases = problem.testcases.filter(testcase_id => testcase_id != req.params.testcase_id);
        await problem.save();
        return res.status(200).json(problem);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}



// search by title, tags, difficulty_level (case insensitive)
export const searchProblems = async (req, res) => {
    try {
        const { title, difficulty_level, tags } = req.query;
        
        // Create a query object
        let query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (difficulty_level) {
            query.difficulty_level = difficulty_level;
        }

        if (tags) {
            query.tags = { $regex: tags.split(',').map(tag => tag.trim()).join('|'), $options: 'i' };
        }

        const problems = await Problem.find(query);
        return res.status(200).json(problems);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};



