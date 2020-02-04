const articlesRouter = require("express").Router();

const {
  getAllArticles
  //getUserByUsername
} = require("../controllers/articlesController");
const { badMethod } = require("../errors/errors");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(badMethod);

module.exports = articlesRouter;
