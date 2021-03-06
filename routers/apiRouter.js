const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const allEndPoints = require("../endpoints.json");
const { badMethod } = require("../errors/errors");

apiRouter
  .route("/")
  .get(function(req, resp) {
    resp.status(200).send({ allEndPoints });
  })
  .all(badMethod);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
