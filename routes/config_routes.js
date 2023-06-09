const indexR = require("./index");
const toysR = require("./toys");
const usersR = require("./users");

exports.routeInit = (app) => {
    app.use("/", indexR);
    app.use("/toys", toysR);
    app.use("/users", usersR);
}