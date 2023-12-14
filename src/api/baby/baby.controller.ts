import { Request, Response } from 'express'
import * as babyService from '../../services/baby.service'

export const listAllBabies = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const babies = await babyService.listAll(sourceId)
    res.status(200).json(babies)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
export const addBaby = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const addedBaby = await babyService.create(sourceId, req.body)
    res
      .status(201)
      .json({ message: 'Baby added successfully', baby_id: addedBaby })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateBaby = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const addedBaby = await babyService.update(
      sourceId,
      req.params.baby_id,
      req.body
    )
    res
      .status(200)
      .json({ message: 'Baby updated successfully', baby_id: addedBaby })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
export const findOneBabyById = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const baby = await babyService.findOne(sourceId, req.params.baby_id)
    if (!baby) {
      return res.status(404).json()
    }
    res.status(200).json(baby)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const findLatestAddedBaby = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const baby = await babyService.getLatestAddedBaby(sourceId)
    if (!baby) {
      return res.status(200).json(null)
    }
    res.status(200).json(baby)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteBaby = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    await babyService.deleteBaby(sourceId, req.params.baby_id)
    res.status(200).json({ message: 'Baby deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const addBabyMeasurement = async (req: any, res: Response) => {
  try {
    const sourceId = req.firebaseUserId
    const addedMeasurementData = await babyService.addBabyMeasurementData(
      sourceId,
      req.params.baby_id,
      req.body
    )
    res.status(201).json({
      message: 'Baby data added successfully',
      baby_id: addedMeasurementData,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
