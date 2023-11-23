import express from 'express'
import userRouter from './users/user.router'
import postRouter from './posts/post.router'
import babyRouter from './baby/baby.router'

const crudRouter = express.Router()

crudRouter.use(
  '/users',
  // auth middleware
  //logMiddleware
  userRouter
)
crudRouter.use(
  '/baby',
  // auth middleware
  //logMiddleware
  babyRouter
)
crudRouter.use('/posts', postRouter)

export default crudRouter
