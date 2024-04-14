import { Request, Response, NextFunction } from "express";
import {validationResult} from "express-validator";
import {IListing} from '../models/Listing'
import Listing from "../models/Listing";
import Brand from '../models/Brand';
import User from "../models/User";
import mongoose from "mongoose";
import cloudinary from '../utlis/cloudinary';

const listingController = {
    addListing: async (req: Request, res: Response, next: NextFunction) => {

        const {
            title,
            description,
            carModel,
            carYear,
            carMileage,
            carEngineType,
            carEngineSize,
            carPrice,
            brandId,
        } = req.body;

        const sellerId = (req as any).user._id;

        try {
            const brand = await Brand.findById(brandId);
            if (!brand) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
                        message: 'Brand not found',
                    },
                });
            }

            console.log(req.files)
            let imageUrls: string[] = [];
            if (req.files) {
                // imagePaths = (req as any).files.map((file:any) => file.filename);
                const files: Express.Multer.File[] = (req.files as Express.Multer.File[]);
                for (const file of files) {
                    const imageBuffer = file.buffer;
                    const encodedImage = imageBuffer.toString('base64');
                    const dataUri = `data:${file.mimetype};base64,${encodedImage}`;
                    const result = await cloudinary.uploader.upload(dataUri); // Przesyłanie zdjęcia do Cloudinary jako Data URI
                    imageUrls.push(result.url); // Zbieranie URL zwróconych przez Cloudinary
                }
            }

            const newListing: IListing = new Listing({
                title,
                description,
                car: {
                    brand: brandId,
                    carModel,
                    year: carYear,
                    mileage: carMileage,
                    engineType: carEngineType,
                    engineSize: carEngineSize,
                    price: carPrice,
                },
                images: imageUrls,
                seller: sellerId,
                likedByUsers: [],
            });

            await newListing.save();
            await User.findByIdAndUpdate(sellerId, {
                $push: { listings: newListing._id }
            });

            res.status(201).json({
                success: true,
                data: {
                    newListing,
                    message: "Listing uploaded successfully"
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                },
            });
        }
    },

    deleteListing: async (req: Request, res: Response, next: NextFunction) => {
        const listingId = req.params.id;

        try {
            const listingToDelete = await Listing.findById(listingId);

            if (!listingToDelete) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
                        message: 'Listing not found',
                    },
                });
            }

            await listingToDelete.deleteOne();

            res.status(200).json({
                success: true,
                data: {
                    message: 'Listing deleted successfully'
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                }
            });
        }
    },

    //
    getAllListings: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let filters: any = {};

            if (req.query.yearFrom) {
                filters['car.year'] = {$gte: parseInt(req.query.yearFrom as string)};
            }

            if (req.query.yearTo) {
                filters['car.year'] = {...filters['car.year'], $lte: parseInt(req.query.yearTo as string)}
            }

            if (req.query.brandId) {
                filters['car.brand'] = req.query.brandId as string;
            }

            if (req.query.priceFrom) {
                filters['car.price'] = {$gte: parseInt(req.query.priceFrom as string)};
            }

            if (req.query.priceTo) {
                filters['car.price'] = {...filters['car.price'], $lte: parseInt(req.query.priceTo as string)}
            }

            if (req.query.carModel) {
                filters['car.carModel'] = {$regex: new RegExp(req.query.carModel as string, 'i')};
            }

            if(req.query.engineType) {
                filters['car.engineType'] = req.query.engineType as string;
            }

            const listings = await Listing.find(filters)
                .populate('car.brand', 'name')  // Zastąpienie ID marki samochodu nazwą marki
                .populate('seller', 'username') // Zastąpienie ID sprzedawcy jego nazwą użytkownika
                .populate('likedByUsers', 'username') // Zastąpienie ID użytkowników, którzy polubili, ich nazwami użytkowników
                .sort({ 'car.brand.name': 1 }) // Sortowanie alfabetyczne po nazwie marki
                .lean(); // Konwersja na obiekt JavaScript, aby można było wykonywać dalsze operacje


            res.status(200).json({
                success: true,
                data: {
                    listings
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                }
            });
        }
    },

    toggleFavorite: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listingId = req.params.id;
            const userId = (req as any).user._id;

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

            const listingIndex = user.likedListings.indexOf(new mongoose.Types.ObjectId(listingId));
            const listing = await Listing.findById(listingId);
            if (!listing) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'Listing not found',
                    },
                });
            }

            if (listingIndex !== -1) {
                // Removing from favourites
                user.likedListings.splice(listingIndex, 1);
                const userIndex = listing.likedByUsers.indexOf(userId);
                if (userIndex !== -1) {
                    listing.likedByUsers.splice(userIndex, 1);
                }
            } else {
                // Adding to favourites
                user.likedListings.push(new mongoose.Types.ObjectId(listingId));
                listing.likedByUsers.push(new mongoose.Types.ObjectId(userId));
            }

            await Promise.all([user.save(), listing.save()]);

            return res.status(200).json({
                success: true,
                data: {
                    message: listingIndex !== -1 ? 'Listing removed from favorites' : 'Listing added to favorites',
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

    getListing: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listingId = req.params.id;
            const listing = await Listing.findById(listingId).populate('car.brand', 'name')
                .populate('seller', 'username email phoneNumber')
                .populate('likedByUsers', 'username');

            if (!listing) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
                        message: 'Listing not found',
                    },
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    listing: listing
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: "Internal server error",
                },
            });
        }
    },
    removeListing: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = (req as any).user._id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                error: {
                    code: 422,
                    message: errors.array()[0]?.msg,
                },
            });
        }

        if(!id) {
            return;
        }

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: "There is no such user"
                    }
                })
            }

            const listing = await Listing.findById(id);
            if (!listing) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: "There is no such listing"
                    }
                })
            }

            if (!user.listings.includes(new mongoose.Types.ObjectId(id.toString()))) {
                return res.status(403).json({
                    success: false,
                    error: {
                        code: 404,
                        message: "Attempt to modify other user's listings"
                    }
                })
            }

            for (const imageUrl of listing.images) {
                const publicId = imageUrl.substring(imageUrl.lastIndexOf('/') + 1, imageUrl.lastIndexOf('.'));
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (error) {
                    console.log("Error trying to remove photo from Cloudinary", error);
                }
            }

            await Listing.deleteOne({_id: listing._id});

            user.likedListings = user.likedListings.filter(listingId => listingId !== new mongoose.Types.ObjectId(id.toString()));
            user.listings = user.listings.filter(listingId => listingId !== new mongoose.Types.ObjectId(id.toString()));
            await user.save();

            return res.status(200).json({
                success: true,
                data: {
                    message:  "Listing removed successfully"
                }
            });
        } catch (error) {
            console.error("Error while removing listing:", error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: "Internal Server Error"
                }
            });
        }

    },
}

    export default listingController;