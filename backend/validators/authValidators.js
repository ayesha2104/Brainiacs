import Joi from 'joi';

const studentProfileSchema = Joi.object({
    studentId: Joi.string().required(),
    semester: Joi.string().required(),
    course: Joi.string().required(),
    degree: Joi.string().required(),
}).unknown(true);

const teacherProfileSchema = Joi.object({
    teacherId: Joi.string().required(),
    department: Joi.string().required(),
    specialization: Joi.string().required(),
}).unknown(true);

export const signupSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('student', 'teacher').required(),
    studentProfile: Joi.when('role', {
        is: 'student',
        then: studentProfileSchema.required(),
        otherwise: Joi.forbidden(),
    }),
    teacherProfile: Joi.when('role', {
        is: 'teacher',
        then: teacherProfileSchema.required(),
        otherwise: Joi.forbidden(),
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('student', 'teacher').required(),
});

export const validateBody = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: false });
    if (error) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: error.details.map((d) => d.message),
        });
    }
    req.body = value;
    next();
};
