import { Router } from 'express';
import { requireAuthentication, attachUser } from '../middleware/auth';
import {
  listCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from '../controllers/candidateController';

const router = Router();

// All candidate routes require authentication
router.use(requireAuthentication, attachUser);

router.get('/', listCandidates);
router.get('/:id', getCandidateById);
router.post('/', createCandidate);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

export default router;
