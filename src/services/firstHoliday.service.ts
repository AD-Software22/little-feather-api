import { Response } from 'express'
import { firstHolidayCollection } from '../api/config/firebase/models'
import * as babyService from './baby.service'
import { getResizedImageUrls } from './image.service'
import { deleteMediaFromStorage } from './base.service'

export const create = async (
  sourceId: string,
  firstBirthdayData: any,
  res: Response
) => {
  try {
    const existingFirstHoliday = await findOneByBabyId(
      sourceId,
      firstBirthdayData.baby_id
    )
    if (existingFirstHoliday) {
      return res.status(400).json({
        error: `Milestone for this baby already exists. Try update.`,
      })
    }
    const addedFirstHoliday = await firstHolidayCollection.add(
      firstBirthdayData
    )
    return addedFirstHoliday.id
  } catch (error) {
    throw error
  }
}

export const findOneByBabyId = async (sourceId: string, babyId: string) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, babyId)

    let query = firstHolidayCollection.where('baby_id', '==', babyId)

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
  firstHolidayMilestoneData: any
) => {
  try {
    await babyService.checkUserBabyAccess(
      sourceId,
      firstHolidayMilestoneData.baby_id
    )

    const findMilestoneQuery = await firstHolidayCollection
      .where('baby_id', '==', firstHolidayMilestoneData.baby_id)
      .get()

    const resultList: any[] = []
    if (findMilestoneQuery.size > 0) {
      findMilestoneQuery.forEach((doc) => {
        resultList.push({ id: doc.id, ...doc.data() })
      })
    } else {
      return null
    }
    const firstHolidayMilestoneResult = resultList[0]

    const oldImageIndex = firstHolidayMilestoneResult.images.findIndex(
      (newImage: any) =>
        !firstHolidayMilestoneData.images.some(
          (oldImage: any) => oldImage.url === newImage.url
        )
    )

    if (oldImageIndex !== -1) {
      const oldImageUrl =
        firstHolidayMilestoneResult.images[oldImageIndex].url
      const filesToDelete = getResizedImageUrls(oldImageUrl)
      deleteMediaFromStorage(filesToDelete)
    }

    const firstHolidayRef = firstHolidayCollection.doc(
      firstHolidayMilestoneResult.id
    )
    await firstHolidayRef.update(firstHolidayMilestoneData)

    return firstHolidayMilestoneResult.id
  } catch (error) {
    throw error
  }
}
