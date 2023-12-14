import express from 'express'
import * as postController from './post.controller'
import { createValidator } from 'express-joi-validation'
import PostSchemas from './post.schema'

const validator = createValidator()

const postRouter = express.Router()

postRouter.get('/:baby_id', postController.getAll)

postRouter.post(
  '/',
  validator.body(PostSchemas.onCreate, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  postController.addPost
)

export default postRouter
