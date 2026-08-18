function validateRequest(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));
            return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
        }

        req.validatedData = result.data;
        next();
    };
}

module.exports = validateRequest;