const Joi = require("joi");

const nameRegx = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,20}$/;
// Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length

const numberPatern = /^(^62|^08)(\d{3,4}-?){2}\d{3,4}$/;

const schemas = {
  userAddSchema: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(255)
      .custom((value, helpers) => {
        if (nameRegx.test(value)) {
          return true;
        } else {
          return helpers.message("Name must contain only letters");
        }
      })
      .required(),

    password: Joi.string()
      .min(8)
      .max(255)
      .custom((value, helpers) => {
        if (passwordPattern.test(value)) {
          return true;
        } else {
          return helpers.message(
            "Min 8 letter password, with at least a symbol, upper and lower case letters and a number"
          );
        }
      })
      .required(),
    conf_password: Joi.string()
      .min(8)
      .max(255)
      .custom((value, helpers) => {
        if (passwordPattern.test(value)) {
          return true;
        } else {
          return helpers.message(
            "Min 8 letter password, with at least a symbol, upper and lower case letters and a number"
          );
        }
      })
      .required(),

    email: Joi.string().email({ minDomainSegments: 2 }).min(5).required(),
  }),

  userEditSchema: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(255)
      .custom((value, helpers) => {
        if (nameRegx.test(value)) {
          return true;
        } else {
          return helpers.message("Name must contain only letters");
        }
      }),
    email: Joi.string().email({ minDomainSegments: 2 }).min(5),
  }),

  validateLoginParams: Joi.object().keys({
    email: Joi.string().min(10).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  }),
};

module.exports = schemas;
