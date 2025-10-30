import Joi from "joi";

export const listingJoiSchema = Joi.object({
    title: Joi.string().required().messages({
        'any.required': 'Title is required',
        'string.empty': 'Title cannot be empty' 
    }),
    description: Joi.string().required().messages({
        'any.required': 'Description is required',
        'string.empty': 'Description cannot be empty'
    }),
    image:Joi.object({
        url:Joi.string().uri().allow('').optional()
    }).optional(),
    price:Joi.number().required().min(0).messages({
        'any.required': 'Price is required',
        'number.base': 'Price must be a number',
        'number.min': 'Price cannot be negative',
    }),
    location: Joi.string().required().messages({
    'any.required': 'Location is required',
    'string.empty': 'Location cannot be empty',
  }),
  country: Joi.string().required().messages({
    'any.required': 'Country is required',
    'string.empty': 'Country cannot be empty',
  }),
}).unknown(false)



export const reviewJoiSchema = Joi.object({
        rating: Joi.number().min(1).max(5).required().messages({
            'any.required': 'Rating is required',
            'number.base' : 'Rating must be a number',
            'number.min': 'Rating cannot be lower than 1',
            'number.max': 'Rating cannot be greater than 5'
        }),
        comment: Joi.string()
})