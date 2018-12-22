import mongoose from "mongoose";

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connect to DB successfully"))
    .catch(err => console.error("Mongo Connection Error: " + err));
export default mongoose