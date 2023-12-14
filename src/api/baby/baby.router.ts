import { getLatestAddedBaby } from './../../services/baby.service'
import express from 'express'
import { createValidator } from 'express-joi-validation'
import BabySchemas from './baby.schema'
import * as babyController from './baby.controller'

const babyRouter = express.Router()
const validator = createValidator()

babyRouter.post(
  '/',
  validator.body(BabySchemas.onCreate, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  babyController.addBaby
)
babyRouter.patch(
  '/:baby_id',
  validator.body(BabySchemas.onUpdate, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  babyController.updateBaby
)
babyRouter.get('/', babyController.listAllBabies)

babyRouter.get('/latest', babyController.findLatestAddedBaby)

babyRouter.get('/:baby_id', babyController.findOneBabyById)

babyRouter.delete('/:baby_id', babyController.deleteBaby)

//Measurements
babyRouter.post(
  '/:baby_id/Measurement',
  validator.body(BabySchemas.onCreateMeasurement, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  babyController.addBabyMeasurement
)

export default babyRouter
