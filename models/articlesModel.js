const knex = require("../connection");

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
      //console.log("results are", results);
      // console.log("article model length", results.length);
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

exports.insertComment = (article_id, comment) => {
  //console.log(comment, "comment is");
  //console.log(article_id, "article id is");
  if (comment.body === "" || !comment.body) {
    return Promise.reject({ status: 400, msg: "Invalid post request" });
  }
  const articleToInsert = {
    author: comment.username,
    article_id: article_id,
    body: comment.body
  };
  // console.log("article to insert is ", articleToInsert);
  return knex
    .returning("*")
    .insert(articleToInsert)
    .into("comments")
    .then(([comment]) => {
      //  console.log(comment);
      return comment;
    });
};

exports.selectCommentsById = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  //console.log("article id is", article_id);
  return knex
    .select("*")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by, order)
    .then(comments => {
      //console.log("comments are", comments);
      //console.log("comments model length", comments.length);
      // console.log("articles model comments", comments);
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comments does not exist"
        });
      } else {
        // console.log("model article by id is", article);
        return comments;
      }
    });
};

exports.selectAllArticles = ({
  sort_by = "created_at",
  author,
  topic,
  order = "desc",
  limit = 10
}) => {
  console.log("in articles model topic is ", topic);

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
      } else if (topic) {
        query.where("articles.topic", topic);
      } else {
        return Promise.reject({ status: 404, msg: "Column does not exist" });
      }
    })
    .then(results => {
      //console.log("results in article model ", results);
      return results;
    });
};
