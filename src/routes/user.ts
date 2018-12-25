import { Router } from "express";
import passport from "passport";
// import axios from "axios";
import User, { UserType } from "../models/User";
import { protectedRoute } from "../util/express";

const router = Router();

const htmlString: string =
    "<html>\n" +
    "  <form action='/user/login' method='post'>\n" +
    '    <label for="username">Username:</label>\n' +
    '    <input type="text" id="username" name="username" /><br />\n' +
    '    <label for="password">Password:</label>\n' +
    '    <input type="password" name="password" id="password" /><br />\n' +
    '    <input type="submit" value="Submit" />\n' +
    "  </form>\n" +
    "</html>\n";

router.get("/login", (req, res) => {
    res.send(htmlString);
});

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

router.get("/info", protectedRoute(), (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ status: "success", data: req.user });
    }
});

router.get("/admin_test", protectedRoute("Admin"), (req, res) => {
    res.json({ status: "success", message: "Yer' an admin, Harry" });
});

router.get("/coach_test", protectedRoute("Coach"), (req, res) => {
    res.json({ status: "success", message: "Yer' a coach, Harry" });
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
        if (password.length < 8) {
            return res.json({
                status: "failure",
                message: "Password too short"
            });
        }
        return res.json({
            status: "failure",
            message: "Required field(s) not included"
        });
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
});
export default router;
