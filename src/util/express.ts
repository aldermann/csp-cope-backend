import { NextFunction, Request, Response } from "express";

export function protectedRoute(requiredPrivilege = "Student") {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.isAuthenticated()) {
            return res
                .status(401)
                .json({ status: "failure", message: "Authenticate first" });
        }
        const userPrivilege: string = req.user.privilege;
        const privilegeList = ["Student", "Coach", "Admin"];
        if (privilegeList.indexOf(requiredPrivilege) === -1) {
            throw new Error("Invalid privilege provided");
        }

        if (
            privilegeList.indexOf(userPrivilege) >=
            privilegeList.indexOf(requiredPrivilege)
        ) {
            return next();
        } else {
            res.status(403).json({
                status: "failure",
                message: "Insufficient privilege"
            });
        }
    };
}

interface IValidationError {
    location: string;
    msg: string;
    param: string;
    value: string;
}

export function validationErrorFormatter({
    location,
    msg,
    param,
    value
}: IValidationError) {
    return `$req.${location}.${param}=${value}: ${msg}`;
}
