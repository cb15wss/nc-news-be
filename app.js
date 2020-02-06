const express = require("express");
const api = express();
const apiRouter = require("./routers/apiRouter");
const { notRoute, customErrors, psqlErrors } = require("./errors/errors");
const usersRouter = require("./routers/usersRouter");
const articlesRouter = require("./routers/topicsRouter");
//const sendApiJson = require("./controllers/apiController");

api.use(express.json());

//api.use("/", apiRouter);

api.use("/api", apiRouter);

api.use("/users", usersRouter);

api.use("/articles", articlesRouter);

api.get("/*", notRoute);

api.use(psqlErrors);
api.use(customErrors);

module.exports = api;
