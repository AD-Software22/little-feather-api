import express from 'express';
import * as userController from './user.controller';

const userRouter = express.Router();


userRouter.post("/", userController.addUser);
userRouter.get("/:uid", userController.getUserById);

export default userRouter;
