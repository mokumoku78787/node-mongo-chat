const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const callChatGPT = require("../callChatGPT");

const Chat = require("../models/chat");

const extractMessages = (chat) => {
  return chat.messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
};

router.get("/ping", async (req, res) => {
  res.json({ message: "ok" });
});

router.get("/ping-with-token", verifyToken, async (req, res) => {
  res.json({ message: "ok" });
});

router.post("/chats", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { content } = req.body;
    const messages = [{ role: "user", content }];
    const assistantMessage = await callChatGPT(messages);
    messages.push(assistantMessage);
    const newChat = new Chat({
      userId,
      messages,
    });
    const savedChat = await newChat.save();
    res.json(savedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/chats/:chatId", verifyToken, async (req, res) => {
  const { chatId } = req.params;
  try {
    const { userId } = req.user;
    const { content } = req.body;

    // Check if the provided chatId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.userId.equals(userId)) {
      res.status(404).json({ message: "Chat not found" });
    }
    const messages = extractMessages(chat);
    messages.push({ role: "user", content });
    const assistantMessage = await callChatGPT(messages);
    messages.push(assistantMessage);
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { messages, updatedAt: Date.now() },
      { new: true },
    );
    res.json(extractMessages(updatedChat));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/chats", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const chats = await Chat.find({ userId });

    const chatSummaries = chats.map((chat) => ({
      chatId: chat._id,
      firstContent: chat.messages.length > 0 ? chat.messages[0].content : "",
    }));

    res.json(chatSummaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/chats/:chatId", verifyToken, async (req, res) => {
  const { chatId } = req.params;
  try {
    const { userId } = req.user;

    // Check if the provided chatId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.userId.equals(userId)) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    res.json(extractMessages(chat));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/chats/:chatId", verifyToken, async (req, res) => {
  const { chatId } = req.params;
  try {
    const { userId } = req.user;

    // Check if the provided chatId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.userId.equals(userId)) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    await Chat.findByIdAndDelete(chatId);
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/chats", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    await Chat.deleteMany({ userId });
    res.json({ message: "All chats deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
