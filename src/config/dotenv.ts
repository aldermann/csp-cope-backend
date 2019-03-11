import dotenv from "dotenv";
if (process.env.NODE_ENV === "testing") {
    dotenv.config({ path: "env/.env.testing" });
} else if (process.env.NODE_ENV === "development") {
    dotenv.config({path: "env/.env.development"});
} else {
    dotenv.config({ path: "env/.env.production" });
}
dotenv.config({ path: "env/.env.secret" });
