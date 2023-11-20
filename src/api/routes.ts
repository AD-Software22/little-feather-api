import express from 'express'
import userRouter from './users/user.router'
import postRouter from './posts/post.router'

const crudRouter = express.Router()

crudRouter.use(
  '/users',
  // auth middleware
  //logMiddleware
  userRouter
)

crudRouter.use(
  '/posts',
  // AuthMiddleware.isAuthenticated,
  // LoggerMiddleware.log,
  postRouter
)

export default crudRouter
