import { getLatestAddedBaby } from './../../services/baby.service'
import express from 'express'
import { createValidator } from 'express-joi-validation'
import MilestoneSchemas from './milestone.schema'
import * as milestoneController from './milestone.controller'
const milestoneRouter = express.Router()
const validator = createValidator()

milestoneRouter.post(
  '/family-tree',
  validator.body(MilestoneSchemas.onCreateFamilyTree, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.addFamilyTree
)
milestoneRouter.patch(
  '/:baby_id/family-tree',
  validator.body(MilestoneSchemas.onUpdateFamilyTree, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.updateFamilyTreeMember
)

milestoneRouter.get(
  '/:baby_id/family-tree',
  milestoneController.findOneFamilyTreeByBabyId
)

//month by month

milestoneRouter.post(
  '/month-by-month',
  validator.body(MilestoneSchemas.onCreateMonthlyDiary, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.addMonthByMonth
)
milestoneRouter.get(
  '/:baby_id/month-by-month',
  milestoneController.findOneMonthByMonthByBabyId
)
milestoneRouter.patch(
  '/:baby_id/month-by-month',
  validator.body(MilestoneSchemas.onCreateMonthlyDiary, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.updateMonthByMonth
)

//year milestone
milestoneRouter.post(
  '/year-milestone',
  validator.body(MilestoneSchemas.onCreateYearDiary, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.addYearMilestone
)
milestoneRouter.get(
  '/:baby_id/year-milestone',
  milestoneController.findOneYearMilestoneByBabyId
)

milestoneRouter.patch(
  '/:baby_id/year-milestone',
  validator.body(MilestoneSchemas.onCreateYearDiary, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.updateYearMilestone
)

//we are in motion

milestoneRouter.post(
  '/in-motion',
  validator.body(MilestoneSchemas.onCreateInMotion, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.addInMotion
)
milestoneRouter.get(
  '/:baby_id/in-motion',
  milestoneController.findOneInMotionMilestoneByBabyId
)
milestoneRouter.patch(
  '/:baby_id/in-motion',
  validator.body(MilestoneSchemas.onCreateInMotion, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.updateInMotionMilestone
)

// my first birthday
milestoneRouter.post(
  '/first-birthday',
  validator.body(MilestoneSchemas.onCreateFirstBirthday, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.addFirstBirthday
)
milestoneRouter.get(
  '/:baby_id/first-birthday',
  milestoneController.findOneFirstBirthdayMilestoneByBabyId
)
milestoneRouter.patch(
  '/:baby_id/first-birthday',
  validator.body(MilestoneSchemas.onCreateFirstBirthday, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.updateFirstBirthdayMilestone
)

// my first holiday

milestoneRouter.post(
  '/first-holiday',
  validator.body(MilestoneSchemas.onCreateHoliday, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.addFirstHoliday
)
milestoneRouter.get(
  '/:baby_id/:type/first-holiday',
  milestoneController.findOneFirstHolidayMilestoneByBabyId
)
milestoneRouter.patch(
  '/:baby_id/first-holiday',
  validator.body(MilestoneSchemas.onCreateHoliday, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.updateFirstHolidayMilestone
)

// teeth chart

milestoneRouter.post(
  '/teeth-chart',
  validator.body(MilestoneSchemas.onCreateTeethChart, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  milestoneController.addTeethChart
)
milestoneRouter.get(
  '/:baby_id/teeth-chart',
  milestoneController.findOneTeethChartMilestoneByBabyId
)
// milestoneRouter.patch(
//   '/:baby_id/teeth-chart',
//   validator.body(MilestoneSchemas.onCreateHoliday, {
//     joi: { convert: true, allowUnknown: false, abortEarly: true },
//   }),
//   milestoneController.updateFirstHolidayMilestone
// )

export default milestoneRouter
