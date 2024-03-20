import { Response } from 'express'
import { firstBirthdayCollection } from '../api/config/firebase/models'
import * as babyService from './baby.service'

export const create = async (
  sourceId: string,
  firstBirthdayData: any,
  res: Response
) => {
  try {
    const existingInMotionType = await findOneByBabyId(
      sourceId,
      firstBirthdayData.baby_id,
      firstBirthdayData.text
    )
    if (existingInMotionType) {
      return res.status(400).json({
        error: `Milestone for this baby already exists. Try update.`,
      })
    }
    const addedInMotion = await firstBirthdayCollection.add(firstBirthdayData)
    return addedInMotion.id
  } catch (error) {
    throw error
  }
}

export const findOneByBabyId = async (
  sourceId: string,
  babyId: string,
  text = null
) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, babyId)

    let query = firstBirthdayCollection.where('baby_id', '==', babyId)

    if (text) {
      query = query.where('text', '==', text)
    }
    const querySnapshot = await query.get()

    if (querySnapshot.size > 0) {
      const result: any[] = []
      querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() })
      })
      return result
    } else {
      return null
    }
  } catch (error) {
    console.error('Error getting records:', error)
    throw error
  }
}
