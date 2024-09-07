import express from 'express';
import { getUserById, getUserProblems, getUserSubmissions, getUsersByProblems} from '../controllers/userController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/leaderboard', getUsersByProblems);

router.get('/:id', authenticateToken, getUserById);
router.get('/:id/problems', authenticateToken, getUserProblems);
router.get('/:id/submissions', authenticateToken, getUserSubmissions);


export default router;