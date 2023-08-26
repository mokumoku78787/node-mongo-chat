const mongoose = require("mongoose");
const chai = require("chai");
const { expect } = chai;
const User = require("../src/models/user");

describe("User Model Test", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/testUserModelDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("Name validation", () => {
    it("should be invalid if name is shorter than 4 characters", async () => {
      let user = new User({ name: "abc", password: "password123" });

      try {
        await user.validate();
      } catch (error) {
        expect(error.errors.name.message).to.equal(
          "Path `name` (`abc`) is shorter than the minimum allowed length (4).",
        );
      }
    });

    it("should be invalid if name contains non-ASCII characters", async () => {
      let user = new User({ name: "Jøhn", password: "password123" });

      try {
        await user.validate();
      } catch (error) {
        expect(error.errors.name.message).to.equal(
          "Name should only contain ASCII characters",
        );
      }
    });
  });

  describe("Password validation", () => {
    it("should be invalid if password is shorter than 8 characters", async () => {
      let user = new User({ name: "JohnDoe", password: "pass12" });

      try {
        await user.validate();
      } catch (error) {
        expect(error.errors.password.message).to.equal(
          "Path `password` (`pass12`) is shorter than the minimum allowed length (8).",
        );
      }
    });

    it("should be invalid if password contains non-ASCII characters", async () => {
      let user = new User({ name: "JohnDoe", password: "påssword" });

      try {
        await user.validate();
      } catch (error) {
        expect(error.errors.password.message).to.equal(
          "Password should only contain ASCII characters",
        );
      }
    });
  });
});
