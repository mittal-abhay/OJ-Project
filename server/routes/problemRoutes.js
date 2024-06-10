import express from 'express';
import { getProblemList, createProblem, getProblemById, updateProblem, getTestCases, addTestcase, deleteProblem, deleteTestcase, getSampleTestCases, searchProblems} from '../controllers/problemController.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
const router = express.Router();

//search
router.get('/search', searchProblems);
//getProblemList
router.get('/', getProblemList);
//getProblemById
router.get('/:id', getProblemById);
//updateProblem
//createProblem
router.post('/create', adminMiddleware, createProblem);
router.put('/:id', adminMiddleware, updateProblem);
//deleteProblem
router.delete('/:id', adminMiddleware, deleteProblem);

//get sample test cases of a problem
router.get('/:id/sampletestcase', getSampleTestCases);
//get test cases of a problem
router.get('/:id/testcase', getTestCases);
//add test case to a problem
router.post('/:id/testcase', adminMiddleware, addTestcase);
//delete test case from a problem
router.delete('/:id/testcase/:testcase_id', adminMiddleware, deleteTestcase);


export default router;