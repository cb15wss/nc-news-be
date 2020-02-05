const commentsRouter = require("express").Router();

const { updateCommentById } = require("../controllers/commentsController");
const { badMethod } = require("../errors/errors");

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentById)
  .all(badMethod);

module.exports = commentsRouter;
