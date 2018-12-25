import { expect } from "chai";
import newRequester from "../config/mocha";

const mockUsers = ["Admin", "Coach", "Student"].map((value: string) => {
    return {
        username: value.toLowerCase(),
        password: "12345678",
        name: value,
        privilege: value,
        email: `${value.toLowerCase()}@gmail.com`
    };
});

describe("Register/Logout/Login flow", function() {
    let requester: ChaiHttp.Agent;
    before(async function() {
        requester = await newRequester();
    });

    it("should be able to register for a few users", async function() {
        for (let i: number = 0; i < 3; ++i) {
            const response = await requester
                .post("/user/signup")
                .send(mockUsers[i]);
            expect(response).to.have.status(200);
            expect(
                response.body,
                JSON.stringify(response.body)
            ).to.have.property("status", "success");
        }
    });

    it("should not login if provided wrong username", async function() {
        const loginResponse = await requester
            .post("/user/login")
            .send({ username: "assmin", password: "12345678" });
        expect(loginResponse).to.have.status(401);
        expect(loginResponse.body).to.have.property("status", "failure");
    });

    it("should not login if provided wrong password", async function() {
        const loginResponse = await requester
            .post("/user/login")
            .send({ username: "admin", password: "12345679" });
        expect(loginResponse).to.have.status(401);
        expect(loginResponse.body).to.have.property("status", "failure");
    });

    it("should login if provided correct credentials", async function() {
        const loginResponse = await requester
            .post("/user/login")
            .send(mockUsers[0]);
        // console.log (loginResponse.header);
        expect(loginResponse.body).to.have.property("status", "success");
        const infoResponse = await requester.get("/user/info");
        expect(infoResponse).to.have.status(200);
        after(async function() {
            await requester.get("/user/logout");
        });
    });

    it("should logout", async function() {
        const logoutResponse = await requester.get("/user/logout");
        expect(logoutResponse).to.have.status(200);
        expect(logoutResponse.body).to.have.property("status", "success");
        const infoResponse = await requester.get("/user/info");
        expect(infoResponse).to.have.status(401);
    });

    describe("Privilege testing", async function() {
        it("should not allow coach to access /user/admin_test", async function() {
            await requester.post("/user/login").send(mockUsers[1]);
            const accessResponse = await requester.get("/user/admin_test");
            expect(accessResponse).to.have.status(403);
        });

        it("should not allow student to access /user/admin_test", async function() {
            await requester.post("/user/login").send(mockUsers[2]);
            const accessResponse = await requester.get("/user/admin_test");
            expect(accessResponse).to.have.status(403);
        });

        it("should not allow student to access /user/coach_test", async function() {
            await requester.post("/user/login").send(mockUsers[2]);
            const accessResponse = await requester.get("/user/coach_test");
            expect(accessResponse).to.have.status(403);
        });

        it("should allow coach to access /user/coach_test", async function() {
            await requester.post("/user/login").send(mockUsers[1]);
            const accessResponse = await requester.get("/user/coach_test");
            expect(accessResponse).to.have.status(200);
        });

        it("should allow admin to access /user/admin_test and /user/coach_test", async function() {
            await requester.post("/user/login").send(mockUsers[0]);
            let accessResponse = await requester.get("/user/admin_test");
            expect(accessResponse).to.have.status(200);
            accessResponse = await requester.get("/user/coach_test");
            expect(accessResponse).to.have.status(200);
        });

        afterEach(async function() {
            await requester.get("/user/logout");
        });
    });
});
