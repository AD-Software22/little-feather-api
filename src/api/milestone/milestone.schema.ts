import * as Joi from 'joi'

const MilestoneSchemas = {
  onCreateFamilyTree: Joi.object().keys({
    baby_id: Joi.string().required(),
    label: Joi.string().required(),
    image: Joi.string().required(),
    position: Joi.number().required(),
    created_at: Joi.date().default(Math.floor(new Date().getTime() / 1000)),
  }),
  onUpdateFamilyTree: Joi.object().keys({
    baby_id: Joi.string().required(),
    label: Joi.string().required(),
    image: Joi.string().required(),
    position: Joi.number().required(),
    created_at: Joi.date().default(Math.floor(new Date().getTime() / 1000)),
  }),
  //monthly diary
  onCreateMonthlyDiary: Joi.object().keys({
    baby_id: Joi.string().required(),
    text: Joi.string().required(),
    image: Joi.string().required(),
    month: Joi.number().required().min(1).max(12),
    year: Joi.number().required().min(2020).max(new Date().getFullYear()),
    created_at: Joi.date().default(Math.floor(new Date().getTime() / 1000)),
  }),
  //year
  onCreateYearDiary: Joi.object().keys({
    baby_id: Joi.string().required(),
    image: Joi.string().required(),
    month: Joi.number().required().min(1).max(12),
    year: Joi.number().required().min(2020).max(new Date().getFullYear()),
    created_at: Joi.date().default(Math.floor(new Date().getTime() / 1000)),
  }),

  // in motion
  onCreateInMotion: Joi.object().keys({
    baby_id: Joi.string().required(),
    image: Joi.string().required(),
    type: Joi.string()
      .valid('canRollOver', 'canCrouch', 'canSit', 'canWalk')
      .required(),
    created_at: Joi.date().default(Math.floor(new Date().getTime() / 1000)),
  }),

  // my first birthday
  onCreateFirstBirthday: Joi.object().keys({
    baby_id: Joi.string().required(),
    text: Joi.string().required(),
    images: Joi.array()
      .items(
        Joi.object({
          position: Joi.number().required(),
          url: Joi.string().required(),
        })
      )
      .required(),
  }),
}

export default MilestoneSchemas
