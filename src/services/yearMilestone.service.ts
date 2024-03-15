import { Response } from 'express'

import * as babyService from './baby.service'
import { yearMilestoneCollection } from '../api/config/firebase/models'

export const create = async (
  sourceId: string,
  yearMilestoneData: any,
  res: Response
) => {
  try {
    //check if exist
    const existingMilestone = await findOneByBabyId(
      sourceId,
      yearMilestoneData.baby_id,
      yearMilestoneData.year,
      yearMilestoneData.month
    )
    if (existingMilestone) {
      return res.status(400).json({
        error:
          'Milestone for this month, year and baby_id already exist. Try update.',
      })
    }
    const addedMilestone = await yearMilestoneCollection.add(yearMilestoneData)
    return addedMilestone.id
  } catch (error) {
    throw error
  }
}

export const findOneByBabyId = async (
  sourceId: string,
  babyId: string,
  year: any,
  month = null
) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, babyId)
    let query = yearMilestoneCollection.where('baby_id', '==', babyId)

    if (year) {
      query = query.where('year', '==', parseInt(year))
    }
    if (month) {
      query = query.where('month', '==', month)
    }

    const querySnapshot = await query.get()
    if (querySnapshot.size > 0) {
      const result: any[] = []
      querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() })
      })
      result.sort((a, b) => a.month - b.month)
      return result
    } else {
      return null
    }
  } catch (error) {
    console.error('Error getting records:', error)
    throw error
  }
}

export const update = async (sourceId: string, yearMilestoneData: any) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, yearMilestoneData.baby_id)

    const findMilestoneQuery = await yearMilestoneCollection
      .where('baby_id', '==', yearMilestoneData.baby_id)
      .where('year', '==', yearMilestoneData.year)
      .where('month', '==', yearMilestoneData.month)
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
    const yearMilestone = resultList[0]

    const monthByMonthRef = yearMilestoneCollection.doc(yearMilestone.id)
    await monthByMonthRef.update(yearMilestoneData)

    return yearMilestone.id
  } catch (error) {
    throw error
  }
}
