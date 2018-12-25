import dotenv from "dotenv";
if (process.env.NODE_ENV === "testing") {
    dotenv.config({ path: ".env.testing" });
} else {
    dotenv.config({path: ".env.default"});
    console.log (process.env.MONGO_URL);
}
dotenv.config({ path: ".env.secret" });
