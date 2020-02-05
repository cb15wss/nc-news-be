const knex = require("../connection");

exports.patchCommentById = (comment_id, inc_votes = 0) => {
  if (inc_votes) {
    return knex
      .increment("votes", inc_votes)
      .from("comments")
      .where("comments.comment_id", comment_id)
      .returning("*")
      .then(([comment]) => {
        if (!comment)
          return Promise.reject({ status: 404, msg: "Comment not found" });
        else return comment;
      });
  } else {
    return Promise.reject({ status: 400, msg: "Patch request invalid" });
  }
};
