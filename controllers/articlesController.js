const {
  getAllArticles
  // selectUserByUsername
} = require("../models/articlesModel");

exports.getAllArticles = (req, resp, next) => {
  console.log("in articles controller");
  getAllArticles().then(articles => {
    console.log("articles in articles controller", articles);
    resp.status(200).send({ articles });
  });
};
