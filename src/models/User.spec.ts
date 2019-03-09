import { expect } from "chai";
import "../config/dotenv";
import mongoose, {connectToDB} from "../config/mongoose";
import User, { UserType } from "./User";

describe("Testing User model", function() {
    before(async function () {
        await connectToDB()
    });
    it("should throw an error if required fields is not assigned", function() {
        User.create({}, (err: any) => {
            expect(err.errors.privilege, "privilege must exist").to.exist;
            expect(err.errors.username, "username must exist").to.exist;
            expect(err.errors.password, "password must exist").to.exist;
        });
    });
    it("should throw an error if assigned invalid privilege", async function() {
        User.create(
            { username: "noob", password: "noob123456", privilege: "assmin" },
            (err: any) => {
                expect(err.errors.privilege).to.exist;
            }
        );
    });

    it("should compare the oldpassword with the hashed one", async function() {
        this.timeout(1000);
        const user: UserType = new User({
            username: "asmin",
            password: "thetestingpassword",
            privilege: "Admin"
        }) as UserType;
        await user.hashPassword();
        expect(user.comparePassword("thetestingpassword")).to.be.true;
    });

    after(async function() {
        await mongoose.connection.db.dropDatabase();
    });
});
