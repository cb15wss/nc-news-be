const express = require("express");
const api = express();
const apiRouter = require("./routers/apiRouter");
const { notRoute, customErrors, psqlErrors } = require("./errors/errors");
const usersRouter = require("./routers/usersRouter");
const articlesRouter = require("./routers/topicsRouter");
const commentsRouter = require("./routers/commentsRouter");
const cors = require("cors");

api.use(cors());

api.use(express.json());

api.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();

})



api.use("/api", apiRouter);

api.use("/users", usersRouter);

api.use("/articles", articlesRouter);

api.use("/comments", commentsRouter);

api.get("/*", notRoute);

api.use(psqlErrors);
api.use(customErrors);

module.exports = api;
