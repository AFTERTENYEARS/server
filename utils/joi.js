const Joi = require('joi')
const BizError = require('./bizError')
const language = require('./language')

const validate = (data, schema) => {
    const options = {
        language
    }

    const result = Joi.validate(data, schema, options)
    const error = result.error
    if (!error) {
        return result.value
    } else {
        throw new BizError(result.error.details[0].message)
    }
}

module.exports = validate