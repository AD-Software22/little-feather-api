import { userBabyRelationEnum } from '../common/constants'
import admin = require('firebase-admin')
import { Baby, BabyMeasurement } from '../api/baby/baby.interface'
import {
  babyCollection,
  userBabyCollection,
} from '../api/config/firebase/models'
import { getUserByFirebaseId } from './user.service'

export const create = async (userFirebaseId: string, baby: Baby) => {
  try {
    const addedBaby = await babyCollection.add(baby)
    const user: any = await getUserByFirebaseId(userFirebaseId)
    await userBabyCollection.add({
      user_id: user.id,
      baby_id: addedBaby.id,
      relation: userBabyRelationEnum.admin,
    })
    return addedBaby.id
  } catch (error) {
    throw error
  }
}

export const update = async (sourceId: string, babyId: string, baby: any) => {
  try {
    await checkUserBabyAccess(sourceId, babyId)
    const babyRef = babyCollection.doc(babyId)
    await babyRef.update(baby)

    return babyId
  } catch (error) {
    throw error
  }
}
export const deleteBaby = async (sourceId: string, babyId: string) => {
  try {
    await checkUserBabyAccess(sourceId, babyId)
    const babyRef = babyCollection.doc(babyId)
    await babyRef.delete()
    return babyId
  } catch (error) {
    throw error
  }
}
export const listAll = async (sourceId: string) => {
  try {
    const userBabies = await getUserBabies(sourceId)
    if (userBabies?.length === 0) {
      return null
    }
    const babyIds = userBabies.map((u: any) => u.baby_id)
    const querySnapshot = await babyCollection
      .where(admin.firestore.FieldPath.documentId(), 'in', babyIds)
      .get()

    const babies: any[] = []
    querySnapshot.forEach((doc) => {
      babies.push({ id: doc.id, ...doc.data() })
    })

    return babies
  } catch (error) {
    console.error('Error getting records:', error)
    throw error
  }
}
export const listAllByIds = async (babyIds: any) => {
  try {
    const querySnapshot = await babyCollection
      .where(admin.firestore.FieldPath.documentId(), 'in', babyIds)
      .get()

    const babies: any[] = []
    querySnapshot.forEach((doc) => {
      babies.push({ id: doc.id, ...doc.data() })
    })

    return babies
  } catch (error) {
    console.error('Error getting records:', error)
    throw error
  }
}
export const getLatestAddedBaby = async (sourceId: string) => {
  try {
    const babies = await listAll(sourceId)
    if (!babies) {
      return null
    }
    const latestBaby = babies?.reduce((prev: any, current: any) => {
      return prev.created_at > current.created_at ? prev : current
    })
    return latestBaby
  } catch (error) {
    console.error('Error getting latest added baby:', error)
    throw error
  }
}

export const findOne = async (sourceId: string, babyId: string) => {
  try {
    await checkUserBabyAccess(sourceId, babyId)

    const babyRef = babyCollection.doc(babyId)
    const existingBaby = await babyRef.get()

    if (existingBaby.exists) {
      return {
        id: existingBaby.id,
        ...existingBaby.data(),
        measurements: existingBaby
          ?.data()
          ?.measurements?.sort((a: any, b: any) => b.timestamp - a.timestamp),
      }
    } else {
      return null
    }
  } catch (error) {
    console.error('Error getting records:', error)
    throw error
  }
}

export const addBabyMeasurementData = async (
  sourceId: string,
  babyId: string,
  babyMeasurementData: BabyMeasurement
) => {
  try {
    await checkUserBabyAccess(sourceId, babyId)

    const babyRef = babyCollection.doc(babyId)
    if (!babyRef) {
      return null
    }
    babyMeasurementData.timestamp = Math.floor(new Date().getTime() / 1000)

    await babyRef.update({
      measurements: admin.firestore.FieldValue.arrayUnion(babyMeasurementData),
    })

    return babyId
  } catch (error) {
    console.error('Error getting records:', error)
    throw error
  }
}

export const getUserBabies = async (
  firebaseUserId: any,
  babyId?: any,
  userId?: any
) => {
  try {
    if (!userId) {
      const user = await getUserByFirebaseId(firebaseUserId)
      userId = user?.id || null
    }

    let query = userBabyCollection.where('user_id', '==', userId)

    if (babyId) {
      query = query.where('baby_id', '==', babyId)
    }
    const querySnapshot = await query.get()

    const records: any = []
    querySnapshot.forEach((doc) => {
      records.push(doc.data())
    })

    return records
  } catch (error) {
    console.error('Error getting records:', error)
    throw error
  }
}
// Function to delete a baby document by ID
const deleteBabyById = async (babyId: string) => {
  try {
    const babyRef = babyCollection.doc(babyId)
    await babyRef.delete()
    console.log(`Baby with ID ${babyId} deleted successfully`)
  } catch (error) {
    console.error(`Error deleting baby with ID ${babyId}:`, error)
  }
}

// Function to delete babies based on a list of IDs
export const deleteBabiesByIdList = async (babyIds: []) => {
  try {
    // Use Promise.all to concurrently delete babies
    await Promise.all(babyIds.map(deleteBabyById))
    console.log('All babies deleted successfully')
  } catch (error) {
    console.error('Error deleting babies:', error)
  }
}

export async function checkUserBabyAccess(sourceId: string, babyId: string) {
  const userBabyIds = await getUserBabies(sourceId, babyId)
  if (userBabyIds?.length === 0) {
    throw new Error('No Access')
  }
}
