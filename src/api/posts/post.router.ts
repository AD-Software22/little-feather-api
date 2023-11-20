import express from 'express'
import * as postController from './post.controller'

const postRouter = express.Router()

postRouter.get('/', postController.getAll)
postRouter.post('/', postController.addPost)

export default postRouter
