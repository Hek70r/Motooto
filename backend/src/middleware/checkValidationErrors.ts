import {NextFunction, Response, Request} from "express";
import {validationResult} from "express-validator";

const checkValidationErrors = (req: Request, res: Response, next: NextFunction) => {
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

    next();
}

export default checkValidationErrors;