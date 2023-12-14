import * as Joi from 'joi'

const PostSchemas = {
  onCreate: Joi.object().keys({
    baby_id: Joi.string().required(),
    file_references: Joi.array().items(Joi.string()).required(),
    created_at: Joi.number().default(Math.floor(new Date().getTime() / 1000)),
    is_feed_post: Joi.boolean().default(true),
  }),
}

export default PostSchemas
