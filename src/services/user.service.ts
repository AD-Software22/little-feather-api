import { User } from '../api/users/user.interface'
import { userCollection } from '../api/config/firebase/models'
// services/userService.js

// Function to add a user
export const addUser = async (user: User) => {
  try {
    const addedUser = await userCollection.add(user)

    return addedUser.id
  } catch (error) {
    throw error
  }
}

// Function to get a user by UID
export const getUserByUID = async (uid: any) => {
  try {
    const querySnapshot = await userCollection.where('uid', '==', uid).get()

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0].data()
      return userDoc
    } else {
      return null
    }
  } catch (error) {
    throw error
  }
}
