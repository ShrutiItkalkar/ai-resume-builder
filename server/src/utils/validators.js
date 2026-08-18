const { z } = require('zod');

const resumeSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    jobDescription: z.string().max(5000).optional(),
    skills: z.array(z.string()).optional(),
});

const experienceSchema = z.object({
    company: z.string().min(1, 'Company is required').max(100),
    role: z.string().min(1, 'Role is required').max(100),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    description: z.string().max(1000).optional(),
});

const educationSchema = z.object({
    institution: z.string().min(1, 'Institution is required').max(150),
    degree: z.string().min(1, 'Degree is required').max(100),
    graduationYear: z.number().int().min(1950).max(2100),
});

module.exports = { resumeSchema, experienceSchema, educationSchema };