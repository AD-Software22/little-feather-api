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
      firstBirthdayData.baby_id
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

export const findOneByBabyId = async (sourceId: string, babyId: string) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, babyId)

    let query = firstBirthdayCollection.where('baby_id', '==', babyId)

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

export const update = async (
  sourceId: string,
  firstBirthdayMilestoneData: any
) => {
  try {
    await babyService.checkUserBabyAccess(
      sourceId,
      firstBirthdayMilestoneData.baby_id
    )

    const findMilestoneQuery = await firstBirthdayCollection
      .where('baby_id', '==', firstBirthdayMilestoneData.baby_id)
      .get()

    const resultList: any[] = []
    if (findMilestoneQuery.size > 0) {
      const result: any[] = []
      findMilestoneQuery.forEach((doc) => {
        resultList.push({ id: doc.id, ...doc.data() })
      })
    } else {
      return null
    }
    const inMotionMilestone = resultList[0]

    const monthByMonthRef = firstBirthdayCollection.doc(inMotionMilestone.id)
    await monthByMonthRef.update(firstBirthdayMilestoneData)

    return inMotionMilestone.id
  } catch (error) {
    throw error
  }
}
