import express from 'express';

import { getSubmissionById} from '../controllers/submissionController.js';

const router = express.Router();


router.get('/:id', getSubmissionById);

export default router;

