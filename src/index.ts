import bodyParser from "body-parser";
import compression from "compression"; // compresses requests
import connectMongo from "connect-mongo";
import dotenv from "dotenv";
import express from "express";
import expressSession from "express-session";
import passport from "passport";
import userRoute from "./routes/user";

const MongoStore = connectMongo(expressSession);

dotenv.config({ path: ".env.default" });
dotenv.config({ path: ".env.system" });

import mongoose from "./config/mongoose";
import "./config/passport";
const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    expressSession({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/user", userRoute);
app.listen(3000, (err: Error) => {
    if (err) {
        console.error(err);
    }
    console.log("Started at port 3000");
});
