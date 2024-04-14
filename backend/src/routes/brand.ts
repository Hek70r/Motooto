import express from 'express';
import {body, param } from 'express-validator';
import brandController from "../controllers/brand";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware";
import authMiddleware from "../middleware/authMiddleware";
import checkValidationErrors from "../middleware/checkValidationErrors";
import {isValidId} from "../utlis/customValidators";

const brandRouter = express.Router();

brandRouter.get('', brandController.getBrands);

brandRouter.get('/:id', [ param("id").custom(isValidId) ], checkValidationErrors, brandController.getBrand);

brandRouter.post('',
    [
        body('name').notEmpty().withMessage("name is mandatory")
            .isString().withMessage("name has to be string")
    ],
    authMiddleware,
    adminAuthMiddleware,
    checkValidationErrors,
    brandController.addBrand
);

brandRouter.delete('/:id',
    authMiddleware,
    adminAuthMiddleware,
    brandController.deleteBrand);

brandRouter.put('/:id',
    authMiddleware,
    adminAuthMiddleware,
    brandController.updateBrand);

brandRouter.post('/:id/carModels',
    [
        body('carModel').not().isEmpty().withMessage("carModel is mandatory")
            .isString().withMessage("carModel has to be string")
    ],
    authMiddleware,
    adminAuthMiddleware,
    checkValidationErrors,
    brandController.addCarModel);

brandRouter.delete('/:id/carModels', [
        body('carModel').not().isEmpty().withMessage("carModel is mandatory")
            .isString().withMessage("carModel has to be string")
    ],
    authMiddleware,
    adminAuthMiddleware,
    checkValidationErrors,
    brandController.deleteCarModel);


export default brandRouter;