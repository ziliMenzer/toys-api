const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const {routeInit} = require("./routes/config_routes");

require("./db/mongoconnect");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")))

routeInit(app);

const server = http.createServer(app);

let port = process.env.PORT || 3000
server.listen(port);