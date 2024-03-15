import { familyTreeCollection } from '../api/config/firebase/models'
import * as babyService from './baby.service'

export const create = async (sourceId: string, familyTreeData: any) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, familyTreeData.baby_id)
    const addedFamilyTree = await familyTreeCollection.add(familyTreeData)
    return addedFamilyTree.id
  } catch (error) {
    throw error
  }
}

export const findOne = async (sourceId: string, babyId: string) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, babyId)
    const querySnapshot = await familyTreeCollection
      .where('baby_id', '==', babyId)
      .get()

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
export const update = async (sourceId: string, familyTreeData: any) => {
  try {
    await babyService.checkUserBabyAccess(sourceId, familyTreeData.baby_id)

    const findMilestoneQuery = await familyTreeCollection
      .where('baby_id', '==', familyTreeData.baby_id)
      .where('position', '==', familyTreeData.position)
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
    const babyFamilyTree = resultList[0]

    const familyTreeRef = familyTreeCollection.doc(babyFamilyTree.id)
    await familyTreeRef.update(familyTreeData)

    return babyFamilyTree.id
  } catch (error) {
    throw error
  }
}
