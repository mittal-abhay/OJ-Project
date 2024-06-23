import express from 'express';
import { getUserById, getUserProblems, getUserSubmissions, getUsersByProblems} from '../controllers/userController.js';

const router = express.Router();

router.get('/leaderboard', getUsersByProblems);

router.get('/:id', getUserById);
router.get('/:id/problems', getUserProblems);
router.get('/:id/submissions', getUserSubmissions);



export default router;