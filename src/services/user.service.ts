import admin = require('firebase-admin')
import { User } from '../api/users/user.interface'
import { userCollection } from '../api/config/firebase/models'
// services/userService.js

// Function to add a user
export const addUser = async (sourceId: string, user: User) => {
  try {
    user.firebase_id = sourceId
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
