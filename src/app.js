const express = require("express");

const authRoute = require("./routes/auth");
const chatRoute = require("./routes/chat");

const app = express();
app.use(express.json());
app.use("/api", authRoute);
app.use("/api", chatRoute);

module.exports = app;
