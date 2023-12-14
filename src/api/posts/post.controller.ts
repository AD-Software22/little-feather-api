import { Request, Response } from 'express'
import * as postService from '../../services/post.service'

export async function getAll(req: any, res: Response): Promise<void> {
  try {
    const postsWithCommentsAndFiles = await postService.getPostsByBabyId(
      req.firebaseUserId,
      req.params.baby_id
    )

    res.json(postsWithCommentsAndFiles)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export async function addPost(req: any, res: Response): Promise<void> {
  try {
    await postService.create(req.firebaseUserId, req.body)

    res.status(201).json({ message: 'Post added successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
