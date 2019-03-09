import "./config/dotenv";
import "./config/passport";
import mongoose, {connectToDB} from "./config/mongoose";
import newRequester from "./config/mocha";
import { expect } from "chai";
import ChaiHttp from "chai-http"

describe("Integration Testing", async function() {
    let requester: ChaiHttp.Agent;
    before(async function() {
        requester = await newRequester();
        await connectToDB();
        console.log (mongoose.connection.db.databaseName)
    });

    it("should startup nicely", async function() {
        const response = await requester.get("/");
        expect(response).to.have.status(200);
        expect(response.text).to.equal("Hello");
    });

    await import("./routes/user.test");

    after(async function() {
        await mongoose.connection.db.dropDatabase();
        requester.close();
    });
});
