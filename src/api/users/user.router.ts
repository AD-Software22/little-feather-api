import express from 'express'
import * as userController from './user.controller'
import { createValidator } from 'express-joi-validation'
import UserSchemas from './user.schema'

const userRouter = express.Router()
const validator = createValidator()

userRouter.post(
  '/',
  validator.body(UserSchemas.onCreate, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  userController.addUser
)
userRouter.get('/:uid', userController.getUserById)

export default userRouter
