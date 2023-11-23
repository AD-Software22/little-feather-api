import * as Joi from 'joi'

const BabyMeasurementSchema = Joi.object({
  weight: Joi.number().allow(null),
  height: Joi.number().allow(null),
  created_at: Joi.number().default(Math.floor(new Date().getTime() / 1000)),
})

const BabySchemas = {
  onCreate: Joi.object().keys({
    name: Joi.string().required(),
    gender: Joi.string().required(),
    profile_picture: Joi.string().allow(null),
    place_of_birth: Joi.string().allow(null),
    measurements: Joi.array().items(BabyMeasurementSchema),
    created_at: Joi.number().default(Math.floor(new Date().getTime() / 1000)),
  }),
  onUpdate: Joi.object().keys({
    name: Joi.string().required(),
    gender: Joi.string().required(),
    profile_picture: Joi.string().allow(null),
    place_of_birth: Joi.string().allow(null),
    updated_at: Joi.number().default(Math.floor(new Date().getTime() / 1000)),
  }),
  onCreateMeasurement: Joi.object().keys({
    weight: Joi.number().allow(null),
    height: Joi.number().allow(null),
    timestamp: Joi.date(),
  }),
}

export default BabySchemas
