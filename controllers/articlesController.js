const {
  selectArticleById,
  patchArticleById,
  insertComment,
  selectCommentsById,
  selectAllArticles
} = require("../models/articlesModel");

exports.getArticleById = (req, resp, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then(article => {
      resp.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.updateArticleById = (req, resp, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  patchArticleById(article_id, inc_votes)
    .then(article => {
      resp.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { body } = req;
  //console.log(body, "body is");
  const { article_id } = req.params;
  insertComment(article_id, body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.getAllComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  selectCommentsById(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => {
      next(err);
    });
};

exports.getAllArticles = (req, resp, next) => {
  const query = req.query;
  selectAllArticles(query)
    .then(articles => {
      resp.status(200).send({ articles });
    })
    .catch(err => {
      next(err);
    });
};
