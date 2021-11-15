const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const app1 = express();
const server = http.createServer(app1);
const io = require("socket.io")(server);
const socketioJwt = require("socketio-jwt");
const jwt = require("jsonwebtoken");
const cors1 = require("cors");
var compression = require("compression");
var RateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
app1.use(compression());
// app1.use(cors1());

app1.use(
  cors1({
    origin: ["127.0.0.1", "localhost"],

    methods: ["GET", "POST"],
    credentials: true,
  })
);

const Document = require("./Document");

// mongoose.connect("mongodb://localhost/google-docs-clone", {
// useNewUrlParser: true,
// useUnifiedTopology: true,
// useFindAndModify: false,
// useCreateIndex: true,
//})
mongoose
  .connect(process.env.MONGOCONF, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

//*********************************************************** */

//*****************************************DDOs Prevent */
app1.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
var limiter = new RateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 500, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
});
app1.use(limiter);
//***************************************** */
// io.use(
//   socketioJwt.authorize({
//     secret: process.env.JWTOKEN,
//     handshake: true,
//   })
// );
//**************************************************************** */
const defaultValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}

server.listen(port, () => console.log(`Document Server has started.`));
