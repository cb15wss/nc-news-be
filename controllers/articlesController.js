const {
  selectAllArticles,
  selectArticleById,
  patchArticleById,
  insertComment,
  selectCommentsById
} = require("../models/articlesModel");

exports.getAllArticles = (req, resp, next) => {
  console.log("in articles controller");
  selectAllArticles()
    .then(articles => {
      console.log("articles in articles controller", articles);
      resp.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, resp, next) => {
  const { article_id } = req.params;
  //console.log("inside article controller", article_id);
  selectArticleById(article_id)
    .then(article => {
      //console.log("controller article", article);
      resp.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleById = (req, resp, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  // console.log(article_id);
  // console.log(inc_votes);
  patchArticleById(article_id, inc_votes)
    .then(article => {
      //console.log("article controller response", article);
      resp.status(200).send({ article });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { body } = req;
  console.log(body, "body is");
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
  console.log("controller", article_id);
  console.log("query", req.query);
  const { sort_by, order } = req.query;

  selectCommentsById(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => {
      next(err);
    });
};
