import "./config/dotenv";
import {connectToDB} from "./config/mongoose";
import "./config/passport";
import startServer from "./server";

connectToDB().then (startServer);
