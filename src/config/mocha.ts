import chai from "chai";
import chaiHttp from "chai-http";

import { app } from "../server";

chai.use(chaiHttp);

async function newRequester() {
    return await chai.request.agent(app).keepOpen();
}

export default newRequester;
