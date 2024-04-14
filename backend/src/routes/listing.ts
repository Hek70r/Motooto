import express from 'express';
import {body, param, query} from 'express-validator';
import upload from "../middleware/multerConfig";
import listingController from "../controllers/listing";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware";
import { isValidId } from "../utlis/customValidators";
import checkValidationErrors from "../middleware/checkValidationErrors";

const listingRouter = express.Router();

listingRouter.get('', listingController.getAllListings);

listingRouter.post('',
    upload.array('images', 10),
    [
        body('title', 'Title is invalid').notEmpty().isString(),
        body('description', 'Description is invalid').notEmpty().isString(),
        body('carModel', 'Car Model is invalid').notEmpty().isString(),
        body('carYear', 'Car Year is invalid').notEmpty().isNumeric(),
        body('carMileage', 'Car Mileage is invalid').notEmpty().isNumeric(),
        body('carEngineType', 'Car Engine Type is invalid').notEmpty().custom(value => {
            const allowedTypes = ['diesel', 'gasoline', 'electric', 'hybrid'];
            if (!allowedTypes.includes(value)) {
                throw new Error('Invalid Car Engine Type');
            }
            return true;
        }),
        body('carEngineSize', 'Car Engine Size is invalid').notEmpty().isFloat({ min: 0 }),
        body('carPrice', 'Car Price is invalid').notEmpty().isFloat({ min: 0 }),
        body('brandId', 'Brand ID is invalid').notEmpty().isString().custom(isValidId),
    ],
    authMiddleware,
    checkValidationErrors,
    listingController.addListing);

listingRouter.get('/:id',[ param("id").custom(isValidId) ], checkValidationErrors, listingController.getListing);

listingRouter.put("/toggle-favourite/:id",[ param("id").custom(isValidId) ], authMiddleware, checkValidationErrors, listingController.toggleFavorite);

listingRouter.delete('/:id', authMiddleware,
    param("id", "Listing id is invalid").notEmpty().isString().custom(isValidId),
    checkValidationErrors,
    listingController.removeListing)
export default listingRouter;