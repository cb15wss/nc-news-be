const knex = require("../connection");

exports.getAllArticles = () => {
  //console.log("in articles model");
  return knex("articles")
    .select("*")
    .returning("*")
    .then(results => {
      //console.log("results in article model ", results);
      return results;
    });
};

exports.selectArticleById = article_id => {
  return knex
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.created_at",
      "articles.votes",
      "articles.topic",
      "articles.body"
    )
    .count({ comment_count: "comments.article_id" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .then(results => {
      if (results.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist"
        });
      } else {
        // console.log("model article by id is", article);
        return results;
      }
    });
};

exports.patchArticleById = (article_id, inc_votes = 0) => {
  if (inc_votes) {
    return knex
      .increment("votes", inc_votes)
      .from("articles")
      .where("articles.article_id", article_id)
      .returning("*")
      .then(([article]) => {
        if (!article)
          return Promise.reject({ status: 404, msg: "Article not found" });
        else return article;
      });
  } else {
    return Promise.reject({ status: 400, msg: "Patch request invalid" });
  }
};
