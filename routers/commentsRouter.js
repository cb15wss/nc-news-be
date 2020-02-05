const commentsRouter = require("express").Router();

const {
  updateCommentById,
  removeCommentById
} = require("../controllers/commentsController");
const { badMethod } = require("../errors/errors");

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentById)
  .delete(removeCommentById)
  .all(badMethod);

module.exports = commentsRouter;
