import { Request, Response } from "express";
import * as userService from "../../services/user.service";

export const addUser = async (req:any, res:any) => {
  const { uid, userData } = req.body;

  try {
    const newUser = await userService.addUser(uid, userData);
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for getting a user by UID
export const getUserById = async (req:any, res:any) => {
  const uid = req.params.uid;

  try {
    const user = await userService.getUserByUID(uid);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

