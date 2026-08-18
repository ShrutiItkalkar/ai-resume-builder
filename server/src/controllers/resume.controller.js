const prisma = require('../prisma');

// GET /api/resumes — list all resumes for the logged-in user
async function getResumes(req, res) {
    try {
        const resumes = await prisma.resume.findMany({
            where: { userId: req.user.id },
            orderBy: { updatedAt: 'desc' },
        });
        res.status(200).json({ success: true, data: resumes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch resumes' });
    }
}

// POST /api/resumes — create a new resume
async function createResume(req, res) {
    try {
        const resume = await prisma.resume.create({
            data: {
                ...req.validatedData,
                userId: req.user.id,
            },
        });
        res.status(201).json({ success: true, data: resume });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to create resume' });
    }
}

// GET /api/resumes/:id — get one resume WITH experiences and education (JOIN)
async function getResumeById(req, res) {
    try {
        const resume = await prisma.resume.findUnique({
            where: { id: req.params.id },
            include: {
                experiences: true,
                education: true,
                generatedContent: { orderBy: { generatedAt: 'desc' }, take: 1 },
            },
        });

        if (!resume) {
            return res.status(404).json({ success: false, error: 'Resume not found' });
        }

        // Ownership check — a user should never see someone else's resume
        if (resume.userId !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized to view this resume' });
        }

        res.status(200).json({ success: true, data: resume });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch resume' });
    }
}

// PUT /api/resumes/:id — update a resume
async function updateResume(req, res) {
    try {
        const existing = await prisma.resume.findUnique({ where: { id: req.params.id } });

        if (!existing) {
            return res.status(404).json({ success: false, error: 'Resume not found' });
        }
        if (existing.userId !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized to edit this resume' });
        }

        const updated = await prisma.resume.update({
            where: { id: req.params.id },
            data: req.validatedData,
        });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to update resume' });
    }
}

// DELETE /api/resumes/:id — delete a resume
async function deleteResume(req, res) {
    try {
        const existing = await prisma.resume.findUnique({ where: { id: req.params.id } });

        if (!existing) {
            return res.status(404).json({ success: false, error: 'Resume not found' });
        }
        if (existing.userId !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this resume' });
        }

        await prisma.resume.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, data: { message: 'Resume deleted' } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to delete resume' });
    }
}

// POST /api/resumes/:id/experiences
async function addExperience(req, res) {
    try {
        const resume = await prisma.resume.findUnique({ where: { id: req.params.id } });
        if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
        if (resume.userId !== req.user.id) return res.status(403).json({ success: false, error: 'Not authorized' });

        const experience = await prisma.experience.create({
            data: { ...req.validatedData, resumeId: req.params.id },
        });
        res.status(201).json({ success: true, data: experience });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to add experience' });
    }
}

// POST /api/resumes/:id/education
async function addEducation(req, res) {
    try {
        const resume = await prisma.resume.findUnique({ where: { id: req.params.id } });
        if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
        if (resume.userId !== req.user.id) return res.status(403).json({ success: false, error: 'Not authorized' });

        const education = await prisma.education.create({
            data: { ...req.validatedData, resumeId: req.params.id },
        });
        res.status(201).json({ success: true, data: education });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to add education' });
    }
}

module.exports = {
    getResumes, createResume, getResumeById, updateResume, deleteResume,
    addExperience, addEducation,
};