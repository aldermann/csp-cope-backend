import { Router } from "express";
// import axios from "axios";
import { check, validationResult } from "express-validator/check";
import passport from "passport";
import User, { UserType } from "../models/User";
import { protectedRoute, validationErrorFormatter } from "../util/express";

const router = Router();

router.post("/login", (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.json({ status: "failure", message: "Already logged in" });
    }
    passport.authenticate("localStrategy", (err: Error, user: UserType) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res
                .status(401)
                .json({ status: "failure", message: "Wrong credential" });
        }
        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            res.json({ status: "success", message: "Logged in" });
        });
    })(req, res, next);
});

router.get("/logout", (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.json({ status: "success", message: "Already logged out" });
    }
    req.logOut();
    req.session.destroy(err => {
        if (err) {
            next(err);
        }
        res.json({ status: "success" });
    });
});

router.get("/profile", protectedRoute(), (req, res) => {
    res.json({ status: "success", data: req.user });
});

router.post(
    "/profile/update",
    protectedRoute(),
    check("email").isEmail(),
    async (req, res) => {
        const user: UserType = req.user;
        const data = req.body;
        // Avatar validation logic goes here
        user.profile.avatar = data.avatar || user.profile.avatar;
        user.profile.email = data.email || user.profile.email;
        user.profile.gender = data.gender || user.profile.gender;
        user.profile.name = data.name || user.profile.name;
        res.json({ status: "success", message: "Profile updated" });
    }
);

router.get("/admin_test", protectedRoute("Admin"), (req, res) => {
    res.json({ status: "success", message: "Yer' an admin, Harry" });
});

router.get("/coach_test", protectedRoute("Coach"), (req, res) => {
    res.json({ status: "success", message: "Yer' a coach, Harry" });
});

router.post(
    "/signup",
    check("username")
        .not()
        .isEmpty()
        .withMessage("Empty username"),
    check("email")
        .isEmail()
        .withMessage("Invalid email provided"),
    check("password")
        .not()
        .isEmpty()
        .isLength({ min: 8 })
        .withMessage("Password is too short"),
    check("privilege")
        .isIn(["Admin", "Coach", "Student"])
        .withMessage("Invalid privilege"),
    async (req, res, next) => {
        const { username, password, name, email, privilege } = req.body;
        const validationErrors = validationResult(req).formatWith(
            validationErrorFormatter
        );
        if (!validationErrors.isEmpty()) {
            res.json({
                status: "failure",
                message: "There are validation errors",
                errors: validationErrors.array()
            });
            return next();
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
            await user.hashPassword();
            await user.save();
            req.session.destroy(() =>
                res.send({ status: "success", message: "User created" })
            );
        } catch (err) {
            return next(err);
        }
    }
);

export default router;
