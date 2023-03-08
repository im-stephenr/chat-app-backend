const express = require("express");
const app = express();
const https = require("https");
const cors = require("cors");
const { Server } = require("socket.io");
const HttpError = require("./model/http-error");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// Allows us to communicate between different domain
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // * means allow any domain to access
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

/** BACKEND SERVER */

// routes
const userRoutes = require("./routes/users");
const conversationRoutes = require("./routes/conversations");
const chatMessagesRoutes = require("./routes/chat-messages");

// routes to controller
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/chat-messages", chatMessagesRoutes);

app.get("/", (req, res, next) => {
  res.send("HELLO WORLD");
});

// Redirect error if url does not exist
app.use((req, res, next) => {
  const error = new HttpError("Could not find route", 404);
  throw error;
});

/** SOCKET IO */

app.use(cors());

const server = https.createServer(app);
let activeUsers = [];

const io = new Server(server, {
  cors: {
    origin: "*", // which client server are we calling, using * meaning everyone can access this backend which is not advisable
    methods: ["GET", "POST"],
    allowedHeaders:
      "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept",
  },
});

// SOCKET listening events
io.on("connection", (socket) => {
  console.log("User Connected: ", socket.id);
  // socket.on user-add, add the userId and socketId inside activeUsers IF NOT EXIST
  socket.on("new_user_add", (userId) => {
    if (!activeUsers.some((user) => user.userId === userId)) {
      activeUsers.push({
        userId: userId,
        socketId: socket.id,
      });
    }
    console.log("Current Active Users", activeUsers);
    io.emit("get_active_users", activeUsers);
  });

  //   user join room / specific user
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`USER with ID: ${socket.id} JOINED the ROOM ${room}`);
  });

  //   on user send message
  socket.on("send_message", (data) => {
    const { receiver_id } = data;
    // check if receiver id exist in activeUsers before sending data
    const user = activeUsers.find((user) => user.userId === receiver_id);
    console.log("CHECK USER ", user);
    console.log("DATA FROM CLIENT", data);
    // if user exist in active list then get the socket id of that user and emit
    if (user) {
      io.to(user.socketId).emit("receive_message", data); // send data to client side also sends to SPECIFIC ACTIVE USER
    }
    // socket.to(data.room).emit("receive_message", data); // send data to client side
  });

  //   on user disconnect
  socket.on("disconnect", () => {
    // update the activeUsers, remove the disconnected socketId from the activeUsers
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", socket.id);
    console.log("Active Users left", activeUsers);
  });
});

// socket io server
server.listen(process.env.SOCKET_PORT, () => {
  console.log("SOCKET SERVER RUNNING ", process.env.SOCKET_PORT);
});

// mongoose / server
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gudqyrg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.SERVER_PORT, () => {
      console.log("Connected to server ", process.env.SERVER_PORT);
    });
  })
  .catch((err) => {
    console.log("DB ERROR", err);
  });
