const articlesRouter = require("express").Router();

const {
  getAllArticles,
  getArticleById,
  updateArticleById
} = require("../controllers/articlesController");
const { badMethod } = require("../errors/errors");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(badMethod);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById)
  .all(badMethod);

module.exports = articlesRouter;
