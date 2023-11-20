import { Request, Response } from "express";
import * as postService from "../../services/post.service";

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const postsWithCommentsAndFiles =
      await postService.getPostsCommentsAndFiles();
    res.json(postsWithCommentsAndFiles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addPost(req: Request, res: Response): Promise<void> {
  try {
    const { caption, imageFiles } = req.body;

    await postService.addPostToDatabase(caption, imageFiles);

    res.status(201).json({ message: "Post added successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
