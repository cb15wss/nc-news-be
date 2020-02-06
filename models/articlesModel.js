const knex = require("../connection");
const { checkIfExists } = require("../models/dbUtilModel");

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

exports.insertComment = (article_id, comment) => {
  if (comment.body === "" || !comment.body) {
    return Promise.reject({ status: 400, msg: "Invalid post request" });
  }
  const articleToInsert = {
    author: comment.username,
    article_id: article_id,
    body: comment.body
  };
  return knex
    .returning("*")
    .insert(articleToInsert)
    .into("comments")
    .then(([comment]) => {
      return comment;
    });
};

exports.selectCommentsById = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return knex
    .select("*")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by, order)
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comments does not exist"
        });
      } else {
        return comments;
      }
    });
};

exports.selectAllArticles = ({
  sort_by = "created_at",
  author,
  topic,
  order = "desc"
}) => {
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
    .orderBy(sort_by, order)
    .modify(query => {
      if (author) {
        query.where("articles.author", author);
      }
      if (topic) {
        query.where("articles.topic", topic);
      }
    })
    .then(articles => {
      //console.log("results in article model ", results);
      if (articles.length) return [articles];
      else {
        let table, column, value;
        if (author) {
          table = "users";
          column = "username";
          value = author;
        } else if (topic) {
          table = "topics";
          column = "slug";
          value = topic;
        }

        return Promise.all([articles, checkIfExists(table, column, value)]);
      }
    })
    .then(([articles]) => {
      //console.log("articles are ", articles);
      if (articles) return articles;
      return Promise.reject({ status: 404, msg: "No articles in database" });
    });
};
