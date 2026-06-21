import { Router } from 'express';
import { requireAuthentication, attachUser } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimiter';
import {
  aiChat,
  analyzeResume,
  generateDNA,
  findHiddenGems,
  analyzeIntent,
  generateChallenge,
  submitChallenge,
  getFutureMatches,
  rankCandidate,
} from '../controllers/aiController';

const router = Router();

// All AI routes require authentication and have stricter rate limits
router.use(requireAuthentication, attachUser, aiLimiter);

router.post('/chat', aiChat);
router.post('/analyze-resume', analyzeResume);
router.post('/generate-dna', generateDNA);
router.post('/rank', rankCandidate);
router.post('/hidden-gems/:jobId', findHiddenGems);
router.post('/intent/:applicationId', analyzeIntent);
router.post('/authenticity/generate', generateChallenge);
router.post('/authenticity/submit', submitChallenge);
router.get('/future-matches/:candidateId', getFutureMatches);

export default router;
