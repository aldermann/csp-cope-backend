import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User, { UserType } from "../models/User";

passport.serializeUser((user: UserType, done) => {
    done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
    User.findById(id, (err, user: UserType) => {
        done(err, user);
    });
});
passport.use(
    "localStrategy",
    new LocalStrategy(
        { passReqToCallback: true },
        async (req, username, password, done) => {
            if (!username || !password) {
                return done(null, false);
            }
            const user: UserType = (await User.findOne({
                username
            })) as UserType;
            // console.log ("in passport config", user)
            if (!user) {
                done(null, false);
            } else if (user.comparePassword(password)) {
                done(null, user);
            } else {
                done(null, false);
            }
        }
    )
);
