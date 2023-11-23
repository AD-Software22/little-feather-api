import admin = require('firebase-admin')
import { Baby, BabyMeasurement } from '../api/baby/baby.interface'
import { babyCollection } from '../api/config/firebase/models'

export const create = async (baby: Baby) => {
  try {
    const addedBaby = await babyCollection.add(baby)

    return addedBaby.id
  } catch (error) {
    throw error
  }
}

export const update = async (babyId: string, baby: any) => {
  try {
    const babyRef = babyCollection.doc(babyId)
    await babyRef.update(baby)

    return babyId
  } catch (error) {
    throw error
  }
}
export const deleteBaby = async (babyId: string) => {
  try {
    const babyRef = babyCollection.doc(babyId)
    await babyRef.delete()
    return babyId
  } catch (error) {
    throw error
  }
}
export const listAll = async () => {
  try {
    const querySnapshot = await babyCollection.get()

    const babies: any[] = []
    querySnapshot.forEach((doc) => {
      babies.push({ id: doc.id, ...doc.data() })
    })

    return babies
  } catch (error) {
    throw error
  }
}

export const findOne = async (babyId: string) => {
  try {
    const babyRef = babyCollection.doc(babyId)
    const existingBaby = await babyRef.get()

    if (existingBaby.exists) {
      return { id: existingBaby.id, ...existingBaby.data() }
    } else {
      return null
    }
  } catch (error) {
    throw error
  }
}

export const addBabyMeasurementData = async (
  babyId: string,
  babyMeasurementData: BabyMeasurement
) => {
  try {
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
    throw error
  }
}
