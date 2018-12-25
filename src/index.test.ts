import "./config/dotenv";
import "./config/passport";
import mongoose from "./config/mongoose";
import newRequester from "./config/mocha";
import { expect } from "chai";

describe("Integration Testing", async function() {
    let requester: ChaiHttp.Agent;
    before(async function() {
        requester = await newRequester();
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
