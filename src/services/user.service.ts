import admin = require('firebase-admin')
import { User } from '../api/users/user.interface'
import {
  babyCollection,
  familyTreeCollection,
  fileReferenceCollection,
  monthByMonthCollection,
  postCollection,
  userBabyCollection,
  userCollection,
  yearMilestoneCollection,
} from '../api/config/firebase/models'
import * as babyService from './baby.service'
import * as postService from './post.service'
import {
  deleteDocumentFromCollection,
  deleteDocumentsByFieldAndValue,
  deleteMediaFromStorage,
  deleteUserFromFirebaseAuth,
  getDocumentsByFieldAndValue,
} from './base.service'

// Function to add a user
export const addUser = async (sourceId: string, user: any) => {
  try {
    user.firebase_id = sourceId
    user.access_token = 'no-token'
    const addedUser = await userCollection.add(user)
    return addedUser.id
  } catch (error) {
    throw error
  }
}

export const findOneById = async (id: string) => {
  try {
    const userRef = userCollection.doc(id)
    const existingUser = await userRef.get()

    if (existingUser.exists) {
      return { id: existingUser.id, ...existingUser.data() }
    } else {
      return null
    }
  } catch (error) {
    throw error
  }
}

export const getAllByIds = async (userIds: string[]) => {
  const usersData = await userCollection
    .where(admin.firestore.FieldPath.documentId(), 'in', userIds)
    .get()
  const users: any[] = []
  usersData.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() })
  })
  return users
}

export const getUserByFirebaseId = async (firebaseId: string) => {
  try {
    const userRef = userCollection.where('firebase_id', '==', firebaseId)
    const querySnapshot = await userRef.get()

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      return { id: userDoc.id, ...userDoc.data() }
    } else {
      return null
    }
  } catch (error) {
    throw error
  }
}

export const deleteUserAndRelatedData = async (sourceId: string) => {
  try {
    const user: any = await getUserByFirebaseId(sourceId)

    if (!user) {
      throw new Error('User not found')
    }

    const userBabies = await getDocumentsByFieldAndValue(
      userBabyCollection,
      'user_id',
      [user.id]
    )

    if (userBabies.length === 0) {
      await deleteDocumentFromCollection(
        userCollection,
        'firebase_id',
        sourceId
      )
      await deleteUserFromFirebaseAuth(sourceId)
      throw new Error('User deleted! No babies for this user found')
    }

    const babiesIds = userBabies.map((b: any) => b.baby_id)
    const babies = await babyService.listAllByIds(babiesIds)

    const posts = await getDocumentsByFieldAndValue(
      postCollection,
      'baby_id',
      babiesIds
    )
    const fileReferences = await getDocumentsByFieldAndValue(
      fileReferenceCollection,
      'post_id',
      posts.map((p: any) => p.id)
    )

    const familyTreeMilestone = await getDocumentsByFieldAndValue(
      familyTreeCollection,
      'baby_id',
      babiesIds
    )

    const yearMilestones = await getDocumentsByFieldAndValue(
      yearMilestoneCollection,
      'baby_id',
      babiesIds
    )

    const monthByMonthMilestone = await getDocumentsByFieldAndValue(
      monthByMonthCollection,
      'baby_id',
      babiesIds
    )

    let filesToDelete = [
      ...(babies?.map((b: any) => b.profile_picture) || []),
      ...(fileReferences ? fileReferences.map((f: any) => f.url) : []),
      ...(familyTreeMilestone?.map((f: any) => f.image) || []),
      ...(yearMilestones?.map((f: any) => f.image) || []),
      ...(monthByMonthMilestone?.map((f: any) => f.image) || []),
    ]

    if (user.profile_picture) {
      filesToDelete.push(user.profile_picture)
    }

    await Promise.all([
      deleteDocumentsByFieldAndValue(postCollection, 'baby_id', babiesIds),
      deleteDocumentsByFieldAndValue(
        fileReferenceCollection,
        'post_id',
        posts?.map((p: any) => p.id)
      ),
      deleteDocumentsByFieldAndValue(
        familyTreeCollection,
        'baby_id',
        babiesIds
      ),
      deleteDocumentsByFieldAndValue(
        yearMilestoneCollection,
        'baby_id',
        babiesIds
      ),
      deleteDocumentsByFieldAndValue(
        monthByMonthCollection,
        'baby_id',
        babiesIds
      ),
      deleteMediaFromStorage(filesToDelete),
      deleteDocumentFromCollection(userBabyCollection, 'user_id', user.id),
      deleteDocumentFromCollection(babyCollection, 'id', babiesIds),
      deleteDocumentFromCollection(userCollection, 'firebase_id', sourceId),
      deleteUserFromFirebaseAuth(sourceId),
    ])
  } catch (error) {
    throw error
  }
}
