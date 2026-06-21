import { Router } from 'express';
import { requireAuthentication, attachUser, requireRole } from '../middleware/auth';
import {
  listJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController';

const router = Router();

// Public: list and view jobs
router.get('/', listJobs);
router.get('/:id', getJobById);

// Protected: create, update, delete jobs (recruiters / admins only)
router.post('/', requireAuthentication, attachUser, requireRole('RECRUITER', 'ADMIN'), createJob);
router.put('/:id', requireAuthentication, attachUser, requireRole('RECRUITER', 'ADMIN'), updateJob);
router.delete('/:id', requireAuthentication, attachUser, requireRole('RECRUITER', 'ADMIN'), deleteJob);

export default router;
