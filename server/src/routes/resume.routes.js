const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { resumeSchema, experienceSchema, educationSchema } = require('../utils/validators');
const {
    getResumes, createResume, getResumeById, updateResume, deleteResume,
    addExperience, updateExperience, deleteExperience,
    addEducation, updateEducation, deleteEducation,
    generateAiContent,
} = require('../controllers/resume.controller');

const router = express.Router();

// every route below requires the user to be logged in
router.use(authMiddleware);

router.get('/', getResumes);
router.post('/', validateRequest(resumeSchema), createResume);
router.get('/:id', getResumeById);
router.put('/:id', validateRequest(resumeSchema), updateResume);
router.delete('/:id', deleteResume);

router.post('/:id/generate', generateAiContent);

router.post('/:id/experiences', validateRequest(experienceSchema), addExperience);
router.put('/:id/experiences/:experienceId', validateRequest(experienceSchema), updateExperience);
router.delete('/:id/experiences/:experienceId', deleteExperience);

router.post('/:id/education', validateRequest(educationSchema), addEducation);
router.put('/:id/education/:educationId', validateRequest(educationSchema), updateEducation);
router.delete('/:id/education/:educationId', deleteEducation);

module.exports = router;