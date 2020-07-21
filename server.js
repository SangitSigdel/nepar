const app = require("./app");
const dotenv = require("dotenv");
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
dotenv.config({ path: "./config.env" });

const db = require("./utils/database");

const PORT = process.env.PORT;

db.connect(function (err) {
  if (err) throw err;
  console.log("database connected successfully");
});

server.listen(PORT, () => {
  console.log(`server is starting in the port ${PORT}`);
});
module.exports = io;
