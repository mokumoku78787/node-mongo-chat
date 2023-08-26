const mongoose = require("mongoose");
const chai = require("chai");
const { expect } = chai;
const User = require("../src/models/user");
const Chat = require("../src/models/chat");

describe("Chat Model Test", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/testChatModelDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("Message validation", () => {
    it("should be invalid if role is not in enum", async () => {
      let chat = new Chat({
        userId: new mongoose.Types.ObjectId(),
        messages: [{ role: "alien", content: "Hello" }],
      });

      try {
        await chat.validate();
      } catch (error) {
        expect(error.errors["messages.0.role"].message).to.equal(
          "`alien` is not a valid enum value for path `role`.",
        );
      }
    });

    it("should be invalid if content is missing", async () => {
      let chat = new Chat({
        userId: new mongoose.Types.ObjectId(),
        messages: [{ role: "user" }],
      });

      try {
        await chat.validate();
      } catch (error) {
        expect(error.errors["messages.0.content"].message).to.equal(
          "Path `content` is required.",
        );
      }
    });
  });

  describe("Chat validation", () => {
    it("should have a default createdAt date", async () => {
      let chat = new Chat({
        userId: new mongoose.Types.ObjectId(),
        messages: [{ role: "user", content: "Hello world" }],
      });

      expect(chat.createdAt).to.not.be.null;
      expect(chat.createdAt).to.not.be.undefined;
    });

    it("should have a default updatedAt date", async () => {
      let chat = new Chat({
        userId: new mongoose.Types.ObjectId(),
        messages: [{ role: "user", content: "Hello world" }],
      });

      expect(chat.updatedAt).to.not.be.null;
      expect(chat.updatedAt).to.not.be.undefined;
    });
  });
});
