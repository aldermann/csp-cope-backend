import mongoose from "mongoose";

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useCreateIndex: true
        });
    } catch (err) {
        console.error("Mongo Connection Error: " + err);
        return;
    }
    console.log("Connect to DB successfully");
}

export default mongoose;
export { connectToDB };
