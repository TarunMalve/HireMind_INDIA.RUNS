import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /api/jobs — List jobs with pagination and filters.
 */
export async function listJobs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const location = req.query.location as string | undefined;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { skills: { hasSome: [search] } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        include: {
          recruiter: {
            select: { id: true, company: true, user: { select: { firstName: true, lastName: true } } },
          },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.job.count({ where }),
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/jobs/:id — Get job by ID.
 */
export async function getJobById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        recruiter: {
          select: {
            id: true,
            company: true,
            title: true,
            user: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/jobs — Create a new job listing.
 */
export async function createJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError('Not authenticated', 401);
    }

    // Find the recruiter profile for this user
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId },
    });

    if (!recruiter) {
      throw new AppError('Recruiter profile not found. Please create one first.', 400);
    }

    const {
      title,
      company,
      description,
      requirements,
      niceToHave,
      skills,
      location,
      locationType,
      salaryMin,
      salaryMax,
      currency,
      status,
    } = req.body;

    const job = await prisma.job.create({
      data: {
        recruiterId: recruiter.id,
        title,
        company: company || recruiter.company,
        description,
        requirements: requirements || [],
        niceToHave: niceToHave || [],
        skills: skills || [],
        location,
        locationType: locationType || 'REMOTE',
        salaryMin,
        salaryMax,
        currency: currency || 'USD',
        status: status || 'ACTIVE',
        embedding: [], // Will be populated by AI service
      },
      include: {
        recruiter: {
          select: { id: true, company: true },
        },
      },
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/jobs/:id — Update a job listing.
 */
export async function updateJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.job.findUnique({
      where: { id },
      include: { recruiter: { select: { userId: true } } },
    });

    if (!existing) {
      throw new AppError('Job not found', 404);
    }

    if (existing.recruiter.userId !== req.userId && req.userRole !== 'ADMIN') {
      throw new AppError('Not authorized to update this job', 403);
    }

    const {
      title,
      description,
      requirements,
      niceToHave,
      skills,
      location,
      locationType,
      salaryMin,
      salaryMax,
      currency,
      status,
    } = req.body;

    const job = await prisma.job.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(requirements !== undefined && { requirements }),
        ...(niceToHave !== undefined && { niceToHave }),
        ...(skills !== undefined && { skills }),
        ...(location !== undefined && { location }),
        ...(locationType !== undefined && { locationType }),
        ...(salaryMin !== undefined && { salaryMin }),
        ...(salaryMax !== undefined && { salaryMax }),
        ...(currency !== undefined && { currency }),
        ...(status !== undefined && { status }),
      },
    });

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/jobs/:id — Delete a job listing.
 */
export async function deleteJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.job.findUnique({
      where: { id },
      include: { recruiter: { select: { userId: true } } },
    });

    if (!existing) {
      throw new AppError('Job not found', 404);
    }

    if (existing.recruiter.userId !== req.userId && req.userRole !== 'ADMIN') {
      throw new AppError('Not authorized to delete this job', 403);
    }

    await prisma.job.delete({ where: { id } });

    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
}
