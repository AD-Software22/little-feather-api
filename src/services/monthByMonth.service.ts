import { Response } from 'express'
import { monthByMonthCollection } from '../api/config/firebase/models'
import * as babyService from './baby.service'

export const create = async (
  sourceId: string,
  monthByMonthData: any,
  res: Response
) => {
  try {
    // await babyService.checkUserBabyAccess(sourceId, monthByMonthData.baby_id)
    //check if exist
    const existingMilestone = await findOne(
      sourceId,
      monthByMonthData.baby_id,
      monthByMonthData.year,
      monthByMonthData.month
    )
    if (existingMilestone) {
      return res.status(400).json({
        error:
          'Milestone for this month, year and baby_id already exist. Try update.',
      })
    }
    const addedMilestone = await monthByMonthCollection.add(monthByMonthData)
    return addedMilestone.id
  } catch (error) {
    throw error
  }
}

export const findOne = async (
  sourceId: string,
  babyId: string,
  year: any,
  month = null
) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, babyId)
    let query = monthByMonthCollection.where('baby_id', '==', babyId)

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
      result.sort((a, b) => a.month - b.month);
      return result
    } else {
      return null
    }
  } catch (error) {
    console.error('Error getting records:', error)
    throw error
  }
}

export const update = async (sourceId: string, monthByMonthData: any) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, monthByMonthData.baby_id)

    const findMilestoneQuery = await monthByMonthCollection
      .where('baby_id', '==', monthByMonthData.baby_id)
      .where('year', '==', monthByMonthData.year)
      .where('month', '==', monthByMonthData.month)
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
    const babyMonthByMonth = resultList[0]

    const monthByMonthRef = monthByMonthCollection.doc(babyMonthByMonth.id)
    await monthByMonthRef.update(monthByMonthData)

    return babyMonthByMonth.id
  } catch (error) {
    throw error
  }
}
