
import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

const userRouter = express.Router();

const userController = new UserController();    //instance of class

userRouter.post('/signup', (req,res,next)=>{
    userController.signUp(req,res, next);
})
userRouter.post('/signin', (req,res,next) => {
    userController.signIn(req,res,next);
})
userRouter.put('/resetPassword', jwtAuth, (req,res) => {
    userController.resetPassword(req,res);
})

export default userRouter;