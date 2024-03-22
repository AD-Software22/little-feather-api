import { Response } from 'express'
import { firstBirthdayCollection } from '../api/config/firebase/models'
import * as babyService from './baby.service'
import { deleteMediaFromStorage } from './base.service'

export const create = async (
  sourceId: string,
  firstBirthdayData: any,
  res: Response
) => {
  try {
    const existingFirstBirthdayType = await findOneByBabyId(
      sourceId,
      firstBirthdayData.baby_id
    )
    if (existingFirstBirthdayType) {
      return res.status(400).json({
        error: `Milestone for this baby already exists. Try update.`,
      })
    }
    const addedFirstirthday = await firstBirthdayCollection.add(
      firstBirthdayData
    )
    return addedFirstirthday.id
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
      findMilestoneQuery.forEach((doc) => {
        resultList.push({ id: doc.id, ...doc.data() })
      })
    } else {
      return null
    }
    const firstBirthdayMilestoneDatabase = resultList[0]

    const oldImageIndex = firstBirthdayMilestoneDatabase.images.findIndex(
      (newImage: any) =>
        !firstBirthdayMilestoneData.images.some(
          (oldImage: any) => oldImage.url === newImage.url
        )
    )

    if (oldImageIndex !== -1) {
      const oldImageUrl =
        firstBirthdayMilestoneDatabase.images[oldImageIndex].url
      const filesToDelete = getResizedImageUrls(oldImageUrl)
      deleteMediaFromStorage(filesToDelete)
    }

    const firstbirthdayRef = firstBirthdayCollection.doc(
      firstBirthdayMilestoneDatabase.id
    )
    await firstbirthdayRef.update(firstBirthdayMilestoneData)

    return firstBirthdayMilestoneDatabase.id
  } catch (error) {
    throw error
  }
}

function getResizedImageUrls(originalUrl: string): string[] {
  const allUrls: string[] = [originalUrl]

  const imageSizes = [
    { width: 100, height: 100 },
    { width: 160, height: 90 },
    { width: 350, height: 200 },
  ]

  for (const size of imageSizes) {
    const pathAndRest = originalUrl.split('%2F')
    const idAndRest = pathAndRest.pop()!.split('?')
    const id = idAndRest[0]
    const path = pathAndRest.join('%2F')
    const rest = idAndRest.slice(1).join('?')
    const resizedUrl =
      path +
      '%2Fresized%2F' +
      id +
      '_' +
      size.width +
      'x' +
      size.height +
      '?' +
      rest

    allUrls.push(resizedUrl)
  }

  return allUrls
}
