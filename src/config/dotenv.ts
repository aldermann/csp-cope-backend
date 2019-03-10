import dotenv from "dotenv";
if (process.env.NODE_ENV === "testing") {
    dotenv.config({ path: ".env.testing" });
    // console.log(process.env.MONGO_URL);
} else if (process.env.NODE_ENV === "development") {
    dotenv.config({path: ".env.development"});
    // console.log (process.env.MONGO_URL);
} else {
    dotenv.config({ path: ".env.production" });
}
