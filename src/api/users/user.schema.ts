import * as Joi from 'joi'

const UserSchemas = {
  onCreate: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    accessToken: Joi.string().allow(null),
    address: Joi.string().allow(null),
    profile_picture: Joi.string().allow(null),
    date_of_birth: Joi.number().allow(null),
    created_at: Joi.date().default(Math.floor(new Date().getTime() / 1000)),
  }),
}

export default UserSchemas
