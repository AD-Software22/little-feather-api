import { Response } from 'express'
import { inMotionCollection } from '../api/config/firebase/models'
import * as babyService from './baby.service'

export const create = async (
  sourceId: string,
  inMotionData: any,
  res: Response
) => {
  try {
    const existingInMotionType = await findOneByBabyId(
      sourceId,
      inMotionData.baby_id,
      inMotionData.type
    )
    if (existingInMotionType) {
      return res.status(400).json({
        error: `Milestone for this type ${inMotionData.type} exist for selected baby. Try update.`,
      })
    }
    const addedInMotion = await inMotionCollection.add(inMotionData)
    return addedInMotion.id
  } catch (error) {
    throw error
  }
}

export const findOneByBabyId = async (
  sourceId: string,
  babyId: string,
  type = null
) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, babyId)

    let query = inMotionCollection.where('baby_id', '==', babyId)

    if (type) {
      query = query.where('type', '==', type)
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

export const update = async (sourceId: string, inMotionMilestoneData: any) => {
  try {
    await babyService.checkUserBabyAccess(
      sourceId,
      inMotionMilestoneData.baby_id
    )

    const findMilestoneQuery = await inMotionCollection
      .where('baby_id', '==', inMotionMilestoneData.baby_id)
      .where('type', '==', inMotionMilestoneData.type)
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

    const monthByMonthRef = inMotionCollection.doc(inMotionMilestone.id)
    await monthByMonthRef.update(inMotionMilestoneData)

    return inMotionMilestone.id
  } catch (error) {
    throw error
  }
}
