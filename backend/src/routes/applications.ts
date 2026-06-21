import { Router } from 'express';
import { requireAuthentication, attachUser } from '../middleware/auth';
import {
  applyForJob,
  listApplications,
  getApplicationById,
  updateApplicationStatus,
  getMatchesForJob,
} from '../controllers/applicationController';

const router = Router();

// All application routes require authentication
router.use(requireAuthentication, attachUser);

router.post('/', applyForJob);
router.get('/', listApplications);
router.get('/:id', getApplicationById);
router.put('/:id/status', updateApplicationStatus);
router.get('/matches/:jobId', getMatchesForJob);

export default router;
