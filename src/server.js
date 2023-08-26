const mongoose = require("mongoose");
const app = require("./app");

const MONGO_URI = "mongodb://localhost:27017/chatApp";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});

app.listen(3000, () => console.log("listening on 3000"));
