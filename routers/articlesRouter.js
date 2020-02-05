const articlesRouter = require("express").Router();

const {
  getAllArticles,
  getArticleById,
  updateArticleById,
  postComment,
  getAllComments
} = require("../controllers/articlesController");
const { badMethod } = require("../errors/errors");

articlesRouter
  .route("/:article_id/comments")
  .get(getAllComments)
  .post(postComment)
  .all(badMethod);

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
