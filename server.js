const express = require("express");
const app = express();
const routes = require("./router/routes.js");
const http = require("http");
const port = process.env.PORT || 8000;
const bodyparser = require("body-parser");
const debug = require("debug");

const db = require("./models/index");
db.sequelize.sync();

const server = http.createServer(app);

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use("/eazy-api", routes);


app.use((req, res, next) => {
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("X-Frame-Options", "deny");
  res.header("X-Content-Type-Options", "nosniff");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE , HEAD , OPTIONS"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization, X-Token"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

server.listen(port);
server.on("error", (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);

    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);

    default:
      throw error;
  }
});
server.on("listening", () => {
  const addr = server.address();
  console.info(`The server has started on port: ${process.env.PORT}`);
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
});
