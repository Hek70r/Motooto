import { Request, Response, NextFunction } from "express"
const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log((req as any).user)

    if (!(req as any).user.isAdmin) {
        return res
            .status(403)
            .json({ success: false, error: {
                    code: 401,
                    message: "No access to this resources",
                }});
    }

    next();
};
export default adminAuthMiddleware;