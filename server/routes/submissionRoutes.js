import express from 'express';

import { getSubmissionById, getCode} from '../controllers/submissionController.js';

const router = express.Router();


router.get('/:id', getSubmissionById);
router.get('/code/:id', getCode)

export default router;

