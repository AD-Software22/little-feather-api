import { getUserByFirebaseId } from './user.service'
import {
  fileReferenceCollection,
  postCollection,
} from '../api/config/firebase/models'
import { fileReferenceTypeEnum } from '../common/constants'
import * as babyService from './baby.service'
import * as userService from './user.service'

export const getPostsByBabyId = async (sourceId: string, babyId: string) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, babyId)
    const postsQuerySnapshot = await postCollection
      .where('baby_id', '==', babyId)
      .orderBy('created_at', 'desc')
      .get()

    const posts: any = []
    postsQuerySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() })
    })
    if (!posts.length) {
      return []
    }
    const postIds = posts.map((p: any) => p.id)
    const fileReferences = await getAllPostFiles(postIds)
    const users: any = await userService.getAllByIds(
      posts.map((p: any) => p.creator_id)
    )

    const postsWithFiles = posts.map((p: any) => {
      const fileReferencesForPost = fileReferences.docs
        .filter((f: any) => f.data().post_id === p.id)
        .map((f: any) => f.data())
      const user = users.find((u: any) => u.id === p.creator_id)
      return {
        ...p,
        file_references: fileReferencesForPost,
        creator_user: user ?? null,
      }
    })

    return postsWithFiles
  } catch (error) {
    console.error('Error fetching posts from Firestore:', error)
    throw new Error('Internal server error')
  }
}
const getAllPostFiles = async (postIds: string[]) => {
  return await fileReferenceCollection.where('post_id', 'in', postIds).get()
}

export async function create(sourceId: string, post: any) {
  try {
    // Create the post data
    const user: any = await getUserByFirebaseId(sourceId)

    const addedPost = await postCollection.add({
      baby_id: post.baby_id,
      creator_id: user.id,
      is_feed_post: post.is_feed_post,
      created_at: post.created_at,
    })

    await uploadImageFiles(post.file_references, addedPost.id)
  } catch (error) {
    console.error('Error adding post: ', error)
    throw error
  }
}

const uploadImageFiles = async (fileReferences: any, addedPostId: string) => {
  const uploadFilePromises = fileReferences.map(
    async (imageFileReference: any) => {
      const image = {
        post_id: addedPostId,
        type: fileReferenceTypeEnum.post,
        url: imageFileReference,
      }
      await fileReferenceCollection.add(image)
    }
  )

  await Promise.all(uploadFilePromises)
}
