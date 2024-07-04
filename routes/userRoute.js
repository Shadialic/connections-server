import { Router } from 'express';
import {postUser,LoadUser, getAllUsers, otpVerification, searchUsers, googleRegistration} from '../controller/auth.js'; 
import multer from 'multer';
const userRouter = Router();
const upload = multer({ dest: 'uploads/' });

//GET
userRouter.get('/searchUsers',searchUsers)
userRouter.get('/getAllUsers',getAllUsers)
// POST
userRouter.post('/login',LoadUser);
userRouter.post('/otp',otpVerification);
userRouter.post('/userSigninWithGoole',googleRegistration);
userRouter.post('/Signup',upload.single('image'),postUser)

export default userRouter;
