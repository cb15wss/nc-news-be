const express = require("express");
const api = express();
const apiRouter = require("./routers/apiRouter");
const { notRoute, customErrors } = require("./errors/errors");
const usersRouter = require("./routers/usersRouter");
const articlesRouter = require("./routers/topicsRouter");

api.use(express.json());

//api.get("/", () => {
// console.log("In the api home page");
//});

api.use("/api", apiRouter);

api.use("/users", usersRouter);

api.use("/articles", articlesRouter);

api.get("/*", notRoute);

api.use(customErrors);

module.exports = api;
