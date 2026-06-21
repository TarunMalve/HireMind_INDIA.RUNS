import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

/**
 * POST /api/applications — Apply for a job.
 */
export async function applyForJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError('Not authenticated', 401);
    }

    const candidate = await prisma.candidate.findUnique({
      where: { userId },
    });

    if (!candidate) {
      throw new AppError('Candidate profile not found. Please create one first.', 400);
    }

    const { jobId } = req.body;

    // Check if job exists and is active
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    if (job.status !== 'ACTIVE') {
      throw new AppError('This job is no longer accepting applications', 400);
    }

    const application = await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId,
        aiExplanation: 'Pending AI analysis...',
      },
      include: {
        job: { select: { id: true, title: true, company: true } },
        candidate: {
          select: { id: true, user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/applications — List applications (filtered by role).
 */
export async function listApplications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;

    const where: any = {};

    // Candidates see their own applications; recruiters see applications for their jobs
    if (req.userRole === 'CANDIDATE') {
      const candidate = await prisma.candidate.findUnique({
        where: { userId: userId! },
        select: { id: true },
      });
      if (candidate) {
        where.candidateId = candidate.id;
      }
    } else if (req.userRole === 'RECRUITER') {
      const recruiter = await prisma.recruiter.findUnique({
        where: { userId: userId! },
        select: { id: true },
      });
      if (recruiter) {
        where.job = { recruiterId: recruiter.id };
      }
    }
    // ADMIN sees all

    if (status) {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        include: {
          job: { select: { id: true, title: true, company: true } },
          candidate: {
            select: {
              id: true,
              headline: true,
              skills: true,
              user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.application.count({ where }),
    ]);

    res.json({
      success: true,
      data: applications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/applications/:id — Get application by ID.
 */
export async function getApplicationById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
        candidate: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } },
            dna: true,
          },
        },
      },
    });

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/applications/:id/status — Update application status.
 */
export async function updateApplicationStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'SECOND_CHANCE'];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const existing = await prisma.application.findUnique({
      where: { id },
      include: { job: { select: { recruiterId: true, recruiter: { select: { userId: true } } } } },
    });

    if (!existing) {
      throw new AppError('Application not found', 404);
    }

    // Only the recruiter who owns the job or an admin can update status
    if (existing.job.recruiter.userId !== req.userId && req.userRole !== 'ADMIN') {
      throw new AppError('Not authorized to update this application', 403);
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        job: { select: { id: true, title: true, company: true } },
        candidate: {
          select: { id: true, user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/applications/matches/:jobId — Get ranked matches for a job.
 */
export async function getMatchesForJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { jobId } = req.params;

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        candidate: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } },
            dna: { select: { overallScore: true, strengths: true } },
          },
        },
      },
      orderBy: [
        { matchScore: 'desc' },
        { overallRank: 'asc' },
      ],
    });

    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
}
