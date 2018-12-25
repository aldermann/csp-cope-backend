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
            console.log ("hello");
            return next();
        } else {
            res.status(403).json({
                status: "failure",
                message: "Insufficient privilege"
            });
        }
    };
}
