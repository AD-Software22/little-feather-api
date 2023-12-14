import express from 'express'
import userRouter from './users/user.router'
import postRouter from './posts/post.router'
import babyRouter from './baby/baby.router'
import { authenticateFirebaseToken } from '../middlewares'

const crudRouter = express.Router()

crudRouter.use(
  '/user',
  authenticateFirebaseToken,
  //logMiddleware
  userRouter
)
crudRouter.use('/baby', authenticateFirebaseToken, babyRouter)
crudRouter.use('/post', authenticateFirebaseToken, postRouter)

export default crudRouter
