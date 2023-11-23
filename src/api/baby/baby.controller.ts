import { Request, Response } from 'express'
import * as babyService from '../../services/baby.service'

export const listAllBabies = async (req: Request, res: Response) => {
  try {
    const babies = await babyService.listAll()
    res.status(200).json(babies)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
export const addBaby = async (req: Request, res: Response) => {
  try {
    const addedBaby = await babyService.create(req.body)
    res
      .status(201)
      .json({ message: 'Baby added successfully', baby_id: addedBaby })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateBaby = async (req: Request, res: Response) => {
  try {
    const addedBaby = await babyService.update(req.params.baby_id, req.body)
    res
      .status(200)
      .json({ message: 'Baby updated successfully', baby_id: addedBaby })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
export const findOneBabyById = async (req: Request, res: Response) => {
  try {
    const baby = await babyService.findOne(req.params.baby_id)
    if (!baby) {
      return res.status(404).json()
    }
    res.status(200).json(baby)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteBaby = async (req: Request, res: Response) => {
  try {
    await babyService.deleteBaby(req.params.baby_id)
    res.status(200).json({ message: 'Baby deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const addBabyMeasurement = async (req: Request, res: Response) => {
  try {
    const addedMeasurementData = await babyService.addBabyMeasurementData(
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
