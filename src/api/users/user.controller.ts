import { Request, Response } from 'express'
import * as userService from '../../services/user.service'

export const addUser = async (req: any, res: Response) => {
  try {
    const existingUser = await userService.getUserByFirebaseId(
      req.firebaseUserId
    )
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' })
    }
    const newUser = await userService.addUser(req.firebaseUserId, req.body)
    res.status(201).json({ message: 'User added successfully', user: newUser })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getUserById = async (req: any, res: any) => {
  try {
    const user = await userService.findOneById(req.params.id)

    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const authenticateUser = async (req: any, res: any) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUserId)
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(401).json({ message: 'User not found' })
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteUser = async (req: any, res: any) => {
  await userService
    .deleteUserAndRelatedData(req.firebaseUserId)
    .then((user: any) => {
      res.status(200).json({ message: 'User deleted successfully' })
    })
    .catch((error: any) => {
      res.status(500).json({ error: error.message })
    })
}
