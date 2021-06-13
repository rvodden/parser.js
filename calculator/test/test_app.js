const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../app");

chai.use(chaiHttp);

describe("Calculator REST API:", function () {
  it("Should return a 200 when I hit /api", function () {
    chai
      .request(app)
      .post("/api")
      .end((err, res) => {
        expect(res).to.have.status(200);
      });
  });
});
