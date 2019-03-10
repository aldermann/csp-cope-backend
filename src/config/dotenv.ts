import dotenv from "dotenv";
if (process.env.NODE_ENV === "testing") {
    dotenv.config({ path: ".env.testing" });
} else if (process.env.NODE_ENV === "development") {
    dotenv.config({path: ".env.development"});
} else {
    dotenv.config({ path: ".env.production" });
}
dotenv.config({ path: ".env.secret" });
console.log(process.env.MONGO_URL);
console.log(process.env.SESSION_SECRET);
