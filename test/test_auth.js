const app = require("../src/app");
const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const mongoose = require("mongoose");

describe("Authentication Routes", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/testAuthDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("POST /api/signup", () => {
    it("should create a new user", async () => {
      const response = await request(app)
        .post("/api/signup")
        .send({ name: "testuser", password: "testpassword" });

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("User created");
    });

    it("should return 409 if user already exists", async () => {
      const response = await request(app)
        .post("/api/signup")
        .send({ name: "testuser", password: "testpassword" });

      expect(response.status).to.equal(409);
      expect(response.body.message).to.equal("User already exists");
    });
  });

  describe("POST /api/signin", () => {
    it("should authenticate user with correct credentials", async () => {
      const response = await request(app)
        .post("/api/signin")
        .send({ name: "testuser", password: "testpassword" });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Authentication successful");
      expect(response.body).to.have.property("token");
    });

    it("should return 401 if user does not exist", async () => {
      const response = await request(app)
        .post("/api/signin")
        .send({ name: "nonexistentuser", password: "testpassword" });

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal("Authentication failed");
    });

    it("should return 401 if password is incorrect", async () => {
      const response = await request(app)
        .post("/api/signin")
        .send({ name: "testuser", password: "wrongpassword" });

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal("Authentication failed");
    });
  });
});
