import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import User from '../models/User';
import {validationResult} from "express-validator";
import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken';
import {IUser} from '../models/User'
import Listing from "../models/Listing";
import crypto from "crypto"
import emailjs from "@emailjs/browser";
import nodemailer from "nodemailer";

const userController = {
    register: async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                error: {
                    code: 422,
                    message: errors.array()[0].msg,
                }
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
            });

            return res.status(201).json({
                success: true,
                data: {
                    newUser,
                    message: "Registered successfully"
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                }
            });
        }
    },
    login: async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if(!user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 401,
                        message: 'Invalid email or password',
                    },
                });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 401,
                        message: 'Invalid email or password',
                    },
                });
            }

            const token = generateJWTToken(user);
            user.password = ''
            user.resetToken = null
            user.resetTokenExpiration = null
            return res.status(200).json({
                success: true,
                data: {
                    token,
                    user,
                    message: "Logged in successfully"
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                },
            });
        }
    },
    getLoggedInUser: async (req: Request, res: Response) => {
        try {
            // Używamy informacji z req.user, które zostały dodane przez middleware autentykacji
            const user = await User.findById((req as any).user._id).select('-password -resetToken -resetTokenExpiration'); // Nie zwracamy hasła i tokenów

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
                        message: 'User not found',
                    }
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    user
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                }
            });
        }
    },
    getUserFavouriteListings: async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user._id; // Pobranie ID użytkownika z zapytania (zakładając, że jest już uwierzytelniony)

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'User not found',
                    },
                });
            }

            const listings = await Listing.find({ "_id": { $in: user.likedListings}})
                .populate('car.brand', 'name')  // Zastąpienie ID marki samochodu nazwą marki
                .populate('seller', 'username') // Zastąpienie ID sprzedawcy jego nazwą użytkownika
                .populate('likedByUsers', 'username') // Zastąpienie ID użytkowników, którzy polubili, ich nazwami użytkowników

            return res.status(200).json({
                success: true,
                data: {
                    listings: listings
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                },
            });
        }
    },
    getUserListings: async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user._id;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
                        message: 'User not found',
                    },
                });
            }

            const userListings = await Listing.find({ "_id": { $in: user.listings}})
                .populate('car.brand', 'name')  // Zastąpienie ID marki samochodu nazwą marki
                .populate('seller', 'username') // Zastąpienie ID sprzedawcy jego nazwą użytkownika
                .populate('likedByUsers', 'username') // Zastąpienie ID użytkowników, którzy polubili, ich nazwami użytkowników

            return res.status(200).json({
                success: true,
                data: {
                    listings: userListings
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                },
            });
        }
    },
    postGenerateResetToken: async  (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                error: {
                    code: 422,
                    message: errors.array()[0].msg,
                }
            });
        }

        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                console.error("Error has appeared when trying to generate Token", err);
                return res.status(500).json({
                    success: false,
                    error: {
                        code: 500,
                        message: 'Error has appeared when trying to generate Token',
                    },
                });
            }

            try {
                const token = buffer.toString("hex");
                const user = await User.findOne({email: email});
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        error: {
                            code: 404,
                            message: 'User not found',
                        },
                    });
                }
                user.resetToken = token;
                user.resetTokenExpiration = new Date(Date.now() + (10 * 60 * 1000));
                await user.save();

                const transporter = nodemailer.createTransport({
                    service: 'gmail.com',
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.MY_EMAIL,
                        pass: process.env.APP_PASSWORD,
                    }
                });

                const resetUrl = `http://localhost:3000/reset-password/${token}`
                const mailOptions = {
                    from: 'motootoweb@example.com',
                    to: user.email,
                    subject: 'Reset Password',
                    html: `
                        <h1>RESETOWANIE HASŁA</h1>
                        <h3>Żeby zresetować hasło, kliknij z poniższy link</h3>
                        <a href="${resetUrl}">${resetUrl}</a>
                    `,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });

                return res.status(200).json({
                    success: true,
                    data: {
                        message: "Password Reset email successfully sent"
                    },
                })

            } catch (error) {
                console.error("Error has appeared when trying to save new Token", err);
            }
        })
    },
    getUserIdByResetToken: async  (req: Request, res: Response, next: NextFunction) => {
        const resetToken = req.params.token;
        try {
            const user = await User.findOne({
                    resetToken: resetToken,
                    resetTokenExpiration: { $gt: Date.now() }
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'User not found for this reset token',
                    },
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    userId: user._id,
                },
            });
        } catch (error) {
            console.error('Error finding user by reset token:', error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                },
            });
        }
    },
    resetPassword: async  (req: Request, res: Response, next: NextFunction) => {
        const { newPassword, userId, resetToken } = req.body;
        const user = await User.findOne({
            resetToken: resetToken,
            resetTokenExpiration: { $gt: Date.now() },
            _id: userId
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 404,
                    message: 'User not found for this data',
                },
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetToken = null;
            user.resetTokenExpiration = null;
            user.save();


        } catch (error) {
            console.error("Error has appeared when trying to save new password", error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Error has appeared when trying to save new password'
                },
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                message: "Password changed successfully"
            },
        })
    },
     editUser: async  (req: Request, res: Response, next: NextFunction) => {
        const { username, phoneNumber } = req.body;
        const userId = (req as any).user._id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                error: {
                    code: 422,
                    message: errors.array()[0].msg,
                }
            });
        }

        try {
            let user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
                        message: 'User not found',
                    },
                });
            }

            user.username = username ? username : user.username;
            user.phoneNumber = phoneNumber ? phoneNumber : user.phoneNumber;
            user = await user.save();
            user.password = ''
            user.resetToken = null
            user.resetTokenExpiration = null
            return res.status(200).json({
                success: true,
                data: {
                    user,
                    message: "Username changed successfully"
                }
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Error has appeared when trying to set new username'
                },
            });
        }
    }
}

const generateJWTToken = (user: IUser) => {
    const secretKey = String(process.env['JWTSecretKey']);
    const expiresIn = '5h';

    return jwt.sign({ user: {
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
            themeMode: user.themeMode,
            }},
        secretKey,
        { expiresIn });
};

export default userController;