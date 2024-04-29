const Joi = require('joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    id_usuario: Joi.string().required(),
    nombre: Joi.string().min(3).required(),
    contraseña: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    id_usuario: Joi.string().required(),
    contraseña: Joi.string().required()
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation
};
