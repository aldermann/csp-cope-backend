import { Router } from "express";
import passport from "passport";
// import axios from "axios";
import User, { UserType } from "../models/User";

const router = Router();
router.post("/login", (req, res, next) => {
    passport.authenticate("localStrategy", (err: Error) => {
        if (err) {
            return next(err);
        }
        res.send({ status: "success" });
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logOut();
    res.json({ status: "success" });
});

router.post("/signup", async (req, res, next) => {
    const { username, password, name, email, privilege } = req.body;

    if (
        !username ||
        !password ||
        password.length < 8 ||
        !name ||
        !email ||
        ["Admin", "Coach", "Student"].indexOf(privilege) === -1
    ) {
        return res.json({ status: "failure", message: "Invalid field exists" });
    }
    try {
        if (await User.findOne({ username })) {
            return res.json({
                status: "failure",
                message: "Username already existed"
            });
        }

        const user: UserType = new User({
            username,
            password,
            privilege,
            profile: {
                name,
                email
            }
        }) as UserType;

        await user.save();
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            res.send({ status: "success" });
        });
    } catch (err) {
        return next(err);
    }
});
export default router;
