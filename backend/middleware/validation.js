const Joi = require('joi');

// Wspólny wzorzec ID: dopuszcza dotychczasowe stringi (prefiksy opcjonalne),
// długość do 50 znaków, znaki a-z0-9-_.
const ID_PATTERN = /^(?:quiz-|module-|topic-|content-|subject-)?[a-z0-9][a-z0-9-_]{0,49}$/i;

const resourceId = Joi.string().pattern(ID_PATTERN);

// Validation schemas
const schemas = {
  enrollModule: Joi.object({
    moduleId: resourceId.required(),
    startDate: Joi.date().optional()
  }),

  updateProgress: Joi.object({
    moduleId: resourceId.required(),
    topicId: resourceId.optional(),
    contentId: resourceId.optional(),
    progress: Joi.number().min(0).max(100).required(),
    timeStudied: Joi.number().min(0).optional(),
    completed: Joi.boolean().optional()
  }),

  markContentViewed: Joi.object({
    timeSpent: Joi.number().min(0).optional(),
    completed: Joi.boolean().default(false)
  }),

  quizSubmission: Joi.object({
    answers: Joi.array().items(
      Joi.object({
        questionId: Joi.string().max(50).required(),
        answer: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string()), Joi.number()).required(),
        timeSpent: Joi.number().min(0).optional()
      })
    ).required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required()
  }),

  userNote: Joi.object({
    contentId: Joi.string().uuid().required(),
    note: Joi.string().max(5000).required(),
    highlight: Joi.string().max(1000).optional(),
    tags: Joi.array().items(Joi.string().max(50)).max(10).optional()
  })
};

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    req.validatedData = value;
    next();
  };
};

// Parameter validation
const validateParams = (paramSchema) => {
  return (req, res, next) => {
    const { error } = paramSchema.validate(req.params);
    
    if (error) {
      return res.status(400).json({
        error: 'Invalid parameters',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Common parameter schemas
const paramSchemas = {
  uuid: Joi.object({
    id: Joi.string().uuid().required()
  }),
  
  userId: Joi.object({
    userId: Joi.string().uuid().required()
  }),

  subjectCategory: Joi.object({
    category: Joi.string().valid('preclinical', 'clinical', 'specialized').required()
  })
};

module.exports = {
  validate,
  validateParams,
  schemas,
  paramSchemas,
  resourceId,
};