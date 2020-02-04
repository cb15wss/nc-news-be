const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topicsController");
const { badMethod } = require("../errors/errors");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(badMethod);

module.exports = topicsRouter;
