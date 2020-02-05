const {
  patchCommentById,
  deleteCommentById
} = require("../models/commentsModel");

exports.updateCommentById = (req, resp, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  // console.log(article_id);
  // console.log(inc_votes);
  patchCommentById(comment_id, inc_votes)
    .then(comment => {
      //console.log("article controller response", article);
      resp.status(200).send({ comment });
    })
    .catch(next);
};

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
};
