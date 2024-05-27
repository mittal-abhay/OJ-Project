import express from 'express';
import { getUserById, updateUserProblems, getUserProblems, getUserSubmissions} from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', getUserById);
router.put('/:id/:problem_id', updateUserProblems);
router.get('/:id/problems', getUserProblems);
router.get('/:id/submissions', getUserSubmissions);


export default router;