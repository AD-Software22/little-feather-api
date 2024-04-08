import { Response } from 'express'
import { teethChartCollection } from '../api/config/firebase/models'
import * as babyService from './baby.service'

export const create = async (
  sourceId: string,
  teethChartData: any,
  res: Response
) => {
  try {
    const existingTeethChartPosition = await findOneByBabyId(
      sourceId,
      teethChartData.baby_id,
      teethChartData.position
    )
    if (existingTeethChartPosition) {
      return res.status(400).json({
        error: `Milestone for this position ${teethChartData.position} exist for selected baby. Try update.`,
      })
    }
    const addedTeethChart = await teethChartCollection.add(teethChartData)
    return addedTeethChart.id
  } catch (error) {
    throw error
  }
}

export const findOneByBabyId = async (
  sourceId: string,
  babyId: string,
  position: number
) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, babyId)

    let query = teethChartCollection.where('baby_id', '==', babyId)

    if (position) {
      query = query.where('position', '==', position)
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

// export const update = async (sourceId: string, inMotionMilestoneData: any) => {
//   try {
//     await babyService.checkUserBabyAccess(
//       sourceId,
//       inMotionMilestoneData.baby_id
//     )

//     const findMilestoneQuery = await teethChartCollection
//       .where('baby_id', '==', inMotionMilestoneData.baby_id)
//       .where('type', '==', inMotionMilestoneData.type)
//       .get()

//     const resultList: any[] = []
//     if (findMilestoneQuery.size > 0) {
//       const result: any[] = []
//       findMilestoneQuery.forEach((doc) => {
//         resultList.push({ id: doc.id, ...doc.data() })
//       })
//     } else {
//       return null
//     }
//     const inMotionMilestone = resultList[0]

//     const monthByMonthRef = teethChartCollection.doc(inMotionMilestone.id)
//     await monthByMonthRef.update(inMotionMilestoneData)

//     return inMotionMilestone.id
//   } catch (error) {
//     throw error
//   }
// }
