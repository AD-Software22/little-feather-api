import { Request, Response } from 'express'
import * as familyTreeService from '../../services/familytree.service'
import * as monthByMonthService from '../../services/monthByMonth.service'
import * as yearMilestoneService from '../../services/yearMilestone.service'

export const addFamilyTree = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const addedFamilyTree = await familyTreeService.create(sourceId, req.body)
    res.status(201).json({
      message: 'Family Tree member added successfully',
      familyTree_id: addedFamilyTree,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateFamilyTreeMember = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const addedFamilyTreeMember = await familyTreeService.update(
      sourceId,
      req.body
    )
    res.status(200).json({
      message: 'Family tree member updated successfully',
      familyTree_id: addedFamilyTreeMember,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const findOneFamilyTreeByBabyId = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const babyFamilyTree = await familyTreeService.findOne(
      sourceId,
      req.params.baby_id
    )
    if (!babyFamilyTree) {
      return res.status(404).json()
    }
    res.status(200).json(babyFamilyTree)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

//month by month
export const addMonthByMonth = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const addedMilestone = await monthByMonthService.create(
      sourceId,
      req.body,
      res
    )
    res.status(201).json({
      message: 'Month by month  added successfully',
      monthByMonth_id: addedMilestone,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateMonthByMonth = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const addedMilestone = await monthByMonthService.update(sourceId, req.body)
    res.status(200).json({
      message: 'Month by month milestone updated successfully',
      familyTree_id: addedMilestone,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
export const findOneMonthByMonthByBabyId = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const milestone = await monthByMonthService.findOne(
      sourceId,
      req.params.baby_id,
      req.query?.year ?? null
    )
    if (!milestone) {
      return res.status(404).json()
    }
    res.status(200).json(milestone)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

//year milestone
export const addYearMilestone = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const addedMilestone = await yearMilestoneService.create(
      sourceId,
      req.body,
      res
    )
    res.status(201).json({
      message: 'Family Tree member added successfully',
      monthByMonth_id: addedMilestone,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateYearMilestone = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const addedMilestone = await yearMilestoneService.update(sourceId, req.body)
    res.status(200).json({
      message: 'Month by month milestone updated successfully',
      familyTree_id: addedMilestone,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
export const findOneYearMilestoneByBabyId = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const milestone = await yearMilestoneService.findOneByBabyId(
      sourceId,
      req.params.baby_id,
      req.query?.year ?? null
    )
    if (!milestone) {
      return res.status(404).json()
    }
    res.status(200).json(milestone)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
