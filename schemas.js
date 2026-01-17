const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// Define the extension
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

// Extend Joi with the new extension
const Joi = BaseJoi.extend(extension);


module.exports.reservationSchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required().messages({
        'string.pattern.base': 'Phone number must contain only digits.'
    }),
    date: Joi.string().required(),
    time: Joi.string().required(),
    guests: Joi.number().min(1).max(20).required()
}).required();


module.exports.orderSchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    phone: Joi.string().required().escapeHTML(),
    address: Joi.string().required().escapeHTML(),
    items: Joi.array().items(Joi.object({
        name: Joi.string().required().escapeHTML(),
        price: Joi.number().min(0).required(),
    })).min(1).required(),
    subtotal: Joi.number().min(0).required(),
    deliveryFee: Joi.number().min(0).required(),
    gstAmount: Joi.number().min(0).required(),
    totalPrice: Joi.number().min(0).required()
}).required();


module.exports.userSignupSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().escapeHTML(),
    email: Joi.string().email().required().escapeHTML(),
    password: Joi.string().min(6).required()
}).required();