const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");
const { Socket } = require("dgram");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Starts a new server", {}, startServer)
  .command("init", "Initialise a new Repository", {}, initRepo)
  .command(
    "add <file>",
    "add file to the  Repository",
    (yargs) => {
      yargs.positional("file", {
        description: "File to add to the stagging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    },
  )
  .command(
    "commit <message>",
    "commit the staged file",
    (yargs) => {
      yargs.positional("message", {
        description: "commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    },
  )
  .command("push", "push commit to S3", {}, pushRepo)
  .command("pull", "Pull commit from S3", {}, pullRepo)
  .command(
    "revert <commitId",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitId", {
        description: "Commit id to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitId);
    },
  )
  .demandCommand(1, "you need to enter atleast one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGODB_URI;

  mongoose
    .connect(mongoURI)
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.error("Error in mongodb connection", err));

  app.use(cors({ origin: "*" }));
  app.use("/", mainRouter);

  let user = "test";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("Connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("======");
      console.log(user);
      console.log("======");
      socket.join(userID);
    });
  });

  const db = mongoose.connection;
  db.once("open", async () => {
    console.log("CRUD operations called");
    // CRUD operations
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
