import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /api/candidates — List all candidates with pagination.
 */
export async function listCandidates(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;
    const search = req.query.search as string | undefined;

    const where = search
      ? {
          OR: [
            { headline: { contains: search, mode: 'insensitive' as const } },
            { skills: { hasSome: [search] } },
            { user: { firstName: { contains: search, mode: 'insensitive' as const } } },
            { user: { lastName: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
          },
          dna: {
            select: { overallScore: true, strengths: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.candidate.count({ where }),
    ]);

    res.json({
      success: true,
      data: candidates,
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
 * GET /api/candidates/:id — Get candidate by ID.
 */
export async function getCandidateById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true, role: true },
        },
        dna: true,
        truePotential: true,
        applications: {
          include: { job: { select: { id: true, title: true, company: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        learningRoadmaps: { orderBy: { createdAt: 'desc' }, take: 5 },
        futureMatches: { orderBy: { matchProbability: 'desc' }, take: 5 },
      },
    });

    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }

    res.json({ success: true, data: candidate });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/candidates — Create a new candidate profile.
 */
export async function createCandidate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError('User not found. Please register first.', 400);
    }

    const {
      headline,
      summary,
      skills,
      experience,
      education,
      certifications,
      portfolioUrls,
      linkedinUrl,
      githubUrl,
    } = req.body;

    const candidate = await prisma.candidate.create({
      data: {
        userId,
        headline,
        summary,
        skills: skills || [],
        experience: experience || [],
        education: education || [],
        certifications: certifications || [],
        portfolioUrls: portfolioUrls || [],
        linkedinUrl,
        githubUrl,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    res.status(201).json({ success: true, data: candidate });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/candidates/:id — Update candidate profile.
 */
export async function updateCandidate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.candidate.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new AppError('Candidate not found', 404);
    }

    if (existing.userId !== req.userId && req.userRole !== 'ADMIN') {
      throw new AppError('Not authorized to update this profile', 403);
    }

    const {
      headline,
      summary,
      skills,
      experience,
      education,
      certifications,
      portfolioUrls,
      linkedinUrl,
      githubUrl,
    } = req.body;

    const candidate = await prisma.candidate.update({
      where: { id },
      data: {
        ...(headline !== undefined && { headline }),
        ...(summary !== undefined && { summary }),
        ...(skills !== undefined && { skills }),
        ...(experience !== undefined && { experience }),
        ...(education !== undefined && { education }),
        ...(certifications !== undefined && { certifications }),
        ...(portfolioUrls !== undefined && { portfolioUrls }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    res.json({ success: true, data: candidate });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/candidates/:id — Delete a candidate profile.
 */
export async function deleteCandidate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.candidate.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new AppError('Candidate not found', 404);
    }

    if (existing.userId !== req.userId && req.userRole !== 'ADMIN') {
      throw new AppError('Not authorized to delete this profile', 403);
    }

    await prisma.candidate.delete({ where: { id } });

    res.json({ success: true, message: 'Candidate profile deleted' });
  } catch (error) {
    next(error);
  }
}
