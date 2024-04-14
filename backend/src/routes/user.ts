import express from 'express';
import { body } from 'express-validator';
import User from '../models/User';
import userController from '../controllers/user';
import authMiddleware from "../middleware/authMiddleware";
import checkValidationErrors from "../middleware/checkValidationErrors";


const userRouter = express.Router();

const usernameValidation =  body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
    .custom(async (value, { req: Request}) => {
        let existingUser = await User.findOne({ username: value });
        if(existingUser) {
            throw new Error('There is a user with this username.');
        }
    });
const phoneNumberValidation =  body('phoneNumber').optional().isLength({ min: 9 }).withMessage('Phone number must be at least 9 characters long.')
    .custom(async (value, { req: Request}) => {
        let existingUser = await User.findOne({ phoneNumber: value });
        if(existingUser) {
            throw new Error('There is a user with this phone number.');
        }
    })

userRouter.post('/register',
    [
        body('email').isEmail().withMessage('Email has to be email format.')
            .custom(async (value, { req: Request}) => {
            let existingUser = await User.findOne({ email: value });
            if(existingUser) {
                throw new Error('There is a user with this email address.')
            }
        }),
        usernameValidation,
        checkValidationErrors,
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.'),
    ],
    userController.register
    )

userRouter.post('/login', userController.login);

userRouter.get('/user', authMiddleware, userController.getLoggedInUser);

userRouter.get("/user/favourites", authMiddleware, userController.getUserFavouriteListings);

userRouter.get("/user/listings", authMiddleware, userController.getUserListings);

userRouter.post("/user/generate-token", [body("email").notEmpty().isString().isEmail()], checkValidationErrors, userController.postGenerateResetToken)

userRouter.get("/user/_id/:token", userController.getUserIdByResetToken);

userRouter.post("/user/reset-password", userController.resetPassword);

userRouter.put("/user", authMiddleware, [usernameValidation, phoneNumberValidation], checkValidationErrors, userController.editUser);

export default userRouter;