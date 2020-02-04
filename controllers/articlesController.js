const {
  getAllArticles,
  selectArticleById,
  patchArticleById
} = require("../models/articlesModel");

exports.getAllArticles = (req, resp, next) => {
  //console.log("in articles controller");
  getAllArticles()
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
