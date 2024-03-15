import express from 'express'
import userRouter from './users/user.router'
import postRouter from './posts/post.router'
import babyRouter from './baby/baby.router'
import { authenticateFirebaseToken } from '../middlewares'
import milestoneRouter from './milestone/milestone.router'

const crudRouter = express.Router()

crudRouter.use(
  '/user',
  authenticateFirebaseToken,
  //logMiddleware
  userRouter
)
crudRouter.use('/baby', authenticateFirebaseToken, babyRouter)
crudRouter.use('/post', authenticateFirebaseToken, postRouter)
crudRouter.use('/milestone', authenticateFirebaseToken, milestoneRouter)

export default crudRouter
