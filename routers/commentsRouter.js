const commentsRouter = require("express").Router();

const {
  getAllComments,
  updateCommentById,
  removeCommentById
} = require("../controllers/commentsController");
const { badMethod } = require("../errors/errors");

commentsRouter
  .route("/")
  .get(getAllComments)
  .all(badMethod);

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentById)
  .delete(removeCommentById)
  .all(badMethod);

module.exports = commentsRouter;
