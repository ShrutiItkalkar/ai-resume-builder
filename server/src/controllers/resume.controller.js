const prisma = require('../prisma');
const { generateResumeContent } = require('../services/aiService');

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

// PUT /api/resumes/:id/experiences/:experienceId
async function updateExperience(req, res) {
    try {
        const resume = await prisma.resume.findUnique({ where: { id: req.params.id } });
        if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
        if (resume.userId !== req.user.id) return res.status(403).json({ success: false, error: 'Not authorized' });

        const existingExp = await prisma.experience.findUnique({ where: { id: req.params.experienceId } });
        if (!existingExp || existingExp.resumeId !== req.params.id) {
            return res.status(404).json({ success: false, error: 'Experience entry not found' });
        }

        const updated = await prisma.experience.update({
            where: { id: req.params.experienceId },
            data: req.validatedData,
        });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to update experience' });
    }
}

// DELETE /api/resumes/:id/experiences/:experienceId
async function deleteExperience(req, res) {
    try {
        const resume = await prisma.resume.findUnique({ where: { id: req.params.id } });
        if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
        if (resume.userId !== req.user.id) return res.status(403).json({ success: false, error: 'Not authorized' });

        const existingExp = await prisma.experience.findUnique({ where: { id: req.params.experienceId } });
        if (!existingExp || existingExp.resumeId !== req.params.id) {
            return res.status(404).json({ success: false, error: 'Experience entry not found' });
        }

        await prisma.experience.delete({ where: { id: req.params.experienceId } });
        res.status(200).json({ success: true, data: { message: 'Experience deleted' } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to delete experience' });
    }
}

// PUT /api/resumes/:id/education/:educationId
async function updateEducation(req, res) {
    try {
        const resume = await prisma.resume.findUnique({ where: { id: req.params.id } });
        if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
        if (resume.userId !== req.user.id) return res.status(403).json({ success: false, error: 'Not authorized' });

        const existingEdu = await prisma.education.findUnique({ where: { id: req.params.educationId } });
        if (!existingEdu || existingEdu.resumeId !== req.params.id) {
            return res.status(404).json({ success: false, error: 'Education entry not found' });
        }

        const updated = await prisma.education.update({
            where: { id: req.params.educationId },
            data: req.validatedData,
        });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to update education' });
    }
}

// DELETE /api/resumes/:id/education/:educationId
async function deleteEducation(req, res) {
    try {
        const resume = await prisma.resume.findUnique({ where: { id: req.params.id } });
        if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
        if (resume.userId !== req.user.id) return res.status(403).json({ success: false, error: 'Not authorized' });

        const existingEdu = await prisma.education.findUnique({ where: { id: req.params.educationId } });
        if (!existingEdu || existingEdu.resumeId !== req.params.id) {
            return res.status(404).json({ success: false, error: 'Education entry not found' });
        }

        await prisma.education.delete({ where: { id: req.params.educationId } });
        res.status(200).json({ success: true, data: { message: 'Education deleted' } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to delete education' });
    }
}

// POST /api/resumes/:id/generate
async function generateAiContent(req, res) {
    try {
        const resume = await prisma.resume.findUnique({
            where: { id: req.params.id },
            include: { experiences: true, education: true },
        });

        if (!resume) {
            return res.status(404).json({ success: false, error: 'Resume not found' });
        }
        if (resume.userId !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized to generate content for this resume' });
        }

        const jobDesc = req.body.jobDescription || resume.jobDescription;
        if (jobDesc && jobDesc.length > 5000) {
            return res.status(400).json({ success: false, error: 'Job description exceeds maximum limit of 5000 characters' });
        }

        const aiResult = await generateResumeContent({
            resume,
            jobDescription: jobDesc,
        });

        const generatedRecord = await prisma.generatedContent.create({
            data: {
                resumeId: resume.id,
                bulletPoints: aiResult,
                coverLetter: aiResult.summary || '',
            },
        });

        res.status(200).json({
            success: true,
            data: {
                generatedContent: generatedRecord,
                result: aiResult,
            },
        });
    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(502).json({ success: false, error: 'AI generation service failed or timed out. Please try again.' });
    }
}

module.exports = {
    getResumes, createResume, getResumeById, updateResume, deleteResume,
    addExperience, updateExperience, deleteExperience,
    addEducation, updateEducation, deleteEducation,
    generateAiContent,
};