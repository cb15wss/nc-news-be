process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const api = require("../app");
const connection = require("../connection");
const chai = require("chai");

chai.use(require("sams-chai-sorted"));

describe("API", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/not-A-Route", () => {
    it("GET: /not-A-Route responds with status 404, route not found", () => {
      return request(api)
        .get("/api/topcs")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route not Found");
        });
    });
  });
  describe("/api", () => {
    it("Responds with JSON describing all the available endpoints on the API", () => {
      return request(api)
        .get("/api")
        .expect(200)
        .then(result => {
          expect(result.body).to.be.an("object");
        });
    });
  });

  describe("/api/topics", () => {
    describe("GET:200", () => {
      it("200: Returns a topics object", () => {
        return request(api)
          .get("/api/topics")
          .expect(200)
          .then(topics => {
            expect(topics.body).to.be.an("object");
            expect(topics.body).to.have.keys(["topics"]);
          });
      });
      it("200 return array of topic objects", () => {
        return request(api)
          .get("/api/topics")
          .expect(200)
          .then(topics => {
            expect(topics.body.topics).to.be.an("array");
            expect(topics.body.topics[0]).to.eql({
              slug: "mitch",
              description: "The man, the Mitch, the legend"
            });
            expect(topics.body.topics[0]).to.have.keys(["slug", "description"]);

            topics.body.topics.forEach(topic => {
              expect(topic).to.have.keys(["slug", "description"]);
            });
          });
      });
    });

    describe("INVALID METHODS", () => {
      it("status:405", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(api)
            [method]("/api/topics")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("/api/users", () => {
      describe("GET: 200 -", () => {
        it("200: responds with users object", () => {
          return request(api)
            .get("/api/users")
            .expect(200)
            .then(response => {
              expect(response.body).to.be.an("object");
              expect(response.body.users).to.be.an("array");
            });
        });
      });
    });
    describe("INVALID METHODS", () => {
      it("status:405", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(api)
            [method]("/api/users")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("/:username", () => {
      it("GET: 200 responds with user object", () => {
        return request(api)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(response => {
            expect(response.body.user).to.be.an("object");
            expect(response.body.user).to.eql({
              username: "butter_bridge",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              name: "jonny"
            });
          });
      });
    });

    describe("GET: 404 Error - /:username", () => {
      it("GET:404 sends an appropriate and error message when given a valid but non-existent username", () => {
        return request(api)
          .get("/api/users/not-a-user")
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal("User does not exist");
          });
      });
    });

    describe("INVALID METHODS", () => {
      it("status:405", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(api)
            [method]("/api/users/:username")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });

  describe("/api/articles/:article_id", () => {
    describe("GET: 200", () => {
      it("Responds with status 200 and an article object", () => {
        return request(api)
          .get("/api/articles/1")
          .expect(200)
          .then(article => {
            expect(article.body).to.be.an("object");
            expect(article.body.article).to.eql({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 100,
              topic: "mitch",
              body: "I find this existence challenging",
              comment_count: "13"
            });

            expect(article.body.article).to.have.keys([
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
          });
      });
    });

    it("GET: 404 - Article does not exist", () => {
      return request(api)
        .get("/api/articles/9178")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Article does not exist");
        });
    });
    it("GET: 400 - Invalid Article Id", () => {
      return request(api)
        .get("/api/articles/notAnId")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid Id");
        });
    });
    it("PATCH: 200 return an updated article", () => {
      return request(api)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(article => {
          expect(article.body.article.votes).to.equal(101);
        });
    });
    it("400 - patch request has no body and no votes cast", () => {
      return request(api)
        .patch("/api/articles/3")
        .send()
        .expect(400)
        .then(article => {
          expect(article.body.msg).to.equal("Patch request invalid");
        });
    });
    it("400 - wrong article id type  ", () => {
      return request(api)
        .patch("/api/articles/christies")
        .send({ inc_votes: 6 })
        .expect(400)
        .then(err => {
          expect(err.body.msg).to.equal("Invalid Id");
        });
    });
    it("400 -no inc_votes on request body", () => {
      return request(api)
        .patch("/api/articles/2")
        .send({ increaseVotes: 7 })
        .expect(400)
        .then(err => {
          expect(err.body.msg).to.equal("Patch request invalid");
        });
    });
  });

  describe("PATCH 404 -article id does not exist", () => {
    it("404 - responds not found error", () => {
      return request(api)
        .patch("/api/articles/34675")
        .send({ inc_votes: 12 })
        .expect(404)
        .then(err => {
          expect(err.body.msg).to.equal("Article not found");
        });
    });
  });

  describe("POST", () => {
    it("201 - post successful", () => {
      return request(api)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "The article you have been waiting for"
        })
        .expect(201)
        .then(response => {
          const { comment } = response.body;

          expect(comment).to.have.keys(
            "body",
            "article_id",
            "author",
            "comment_id",
            "created_at",
            "votes"
          );
        });
    });
    it("400 - when post request has no body", () => {
      return request(api)
        .post("/api/articles/1/comments")
        .send({})
        .expect(400)
        .then(response => {
          const { msg } = response.body;
          expect(msg).to.equal("Invalid post request");
        });
    });
    it("404 - when user does not exist", () => {
      return request(api)
        .post("/api/articles/1/comments")
        .send({
          username: "Tixxy1",
          body: "User does not exist"
        })
        .expect(404)
        .then(response => {
          const { msg } = response.body;
          expect(msg).to.equal("Does not exist");
        });
    });
    it("400 - when post contains no content", () => {
      return request(api)
        .post("/api/articles/2/comments")
        .send({ username: "icellusedkars", body: "" })
        .expect(400)
        .then(response => {
          const { msg } = response.body;
          expect(msg).to.equal("Invalid post request");
        });
    });
    it("400 - when article does not exist in the database", () => {
      return request(api)
        .post("/api/articles/234675890/comments")
        .send({
          username: "icellusedkars",
          body: "Have you seen the article id though?"
        })
        .expect(404)
        .then(response => {
          const { msg } = response.body;
          expect(msg).to.equal("Does not exist");
        });
    });
  });
  describe("INVALID METHODS", () => {
    it("status:405", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(api)
          [method]("/api/articles/1/comments")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/api/comments", () => {
    it("GET: 200 - will respond with comments objects", () => {
      return request(api)
        .get("/api/comments")
        .expect(200)
        .then(result => {
          expect(result.body.comments).to.be.an("array");
          expect(result.body.comments[0]).to.eql({
            comment_id: 1,
            author: "butter_bridge",
            article_id: 9,
            votes: 16,
            created_at: "2017-11-22T12:36:03.389Z",
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
          });
        });
    });
    it("GET - Limit default to 10", () => {
      return request(api)
        .get("/api/comments")
        .expect(200)
        .then(result => {
          expect(result.body.comments).to.be.an("array");
          expect(result.body.comments.length).to.equal(10);
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
      it("200 - responds with comment array of corresponding articles", () => {
        return request(api)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(response => {
            const { comments } = response.body;
            expect(comments).to.have.lengthOf(13);
            expect(comments[0]).to.have.keys(
              "comment_id",
              "votes",
              "created_at",
              "author",
              "body",
              "article_id"
            );
          });
      });
      it.only("GET - Limit default to 10 comments", () => {
        return request(api)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(result => {
            expect(result.body.comments).to.be.an("array");
            expect(result.body.comments.length).to.equal(10);
          });
      });

      it("200 - when article exists but has no comments responds with empty array", () => {
        return request(api)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(response => {
            const { comments } = response.body;
            expect(comments).to.have.lengthOf(0);
          });
      });
      it("404 - when article_id does not exist", () => {
        return request(api)
          .get("/api/articles/999/comments")
          .expect(404)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal('"999" not found');
          });
      });
    });
    describe("Queries", () => {
      it("defaults to ?sort_by:created_at&order=desc", () => {
        return request(api)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(response => {
            const { comments } = response.body;
            expect(comments).to.be.descendingBy("created_at");
          });
      });
      it("200 order=asc)", () => {
        return request(api)
          .get("/api/articles/5/comments?order=asc")
          .expect(200)
          .then(response => {
            const { comments } = response.body;
            expect(comments).to.be.ascendingBy("created_at");
          });
      });
      it("200 sort_by=votes ", () => {
        return request(api)
          .get("/api/articles/1/comments?sort_by=votes")
          .expect(200)
          .then(response => {
            const { comments } = response.body;
            expect(comments).to.be.descendingBy("votes");
          });
      });
      it("400 sort_by=not_a_column", () => {
        return request(api)
          .get("/api/articles/2/comments?sort_by=not_a_column")
          .expect(400)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal("Column does not exist");
          });
      });
    });
    describe("/api/articles", () => {
      it("GET: 200 - will respond with articles array", () => {
        return request(api)
          .get("/api/articles")
          .expect(200)
          .then(articles_response => {
            expect(articles_response.body.articles).to.be.an("array");
            expect(articles_response.body.articles[0]).to.eql({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 100,
              topic: "mitch",
              comment_count: "13"
            });
            expect(articles_response.body.articles[0]).to.have.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
          });
      });
      it("GET - Articles Limit default to 10", () => {
        return request(api)
          .get("/api/articles")
          .expect(200)
          .then(result => {
            expect(result.body.articles).to.be.an("array");
            expect(result.body.articles.length).to.equal(10);
          });
      });
      it("defaults to ?sort_by:created_at&order=desc", () => {
        return request(api)
          .get("/api/articles")
          .expect(200)
          .then(response => {
            const { articles } = response.body;
            expect(articles).to.be.descendingBy("created_at");
          });
      });
      it("200 - ?order=asc by created_at", () => {
        return request(api)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.be.ascendingBy("created_at");
          });
      });

      it("GET: QUERIES - 200 sort_by=author ", () => {
        return request(api)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(response => {
            const { articles } = response.body;
            expect(articles).to.be.descendingBy("author");
          });
      });
      it("404: /api/articles?author=not-an-author", () => {
        return request(api)
          .get("/api/articles?author=not-an-author")
          .expect(404)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal('"not-an-author" not found');
          });
      });
      it("200 sort_by=topic", () => {
        return request(api)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then(response => {
            const { articles } = response.body;
            expect(articles).to.be.descendingBy("topic");
          });
      });

      it("GET: 200 - Return articles by topic", () => {
        return request(api)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(result => {
            expect(result.body.articles.length).to.be.equal(1);
          });
      });
      it('"404: /api/articles?topic=notTopic"', () => {
        return request(api)
          .get("/api/articles?topic=notTopic")
          .expect(404)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal('"notTopic" not found');
          });
      });
      it("200 - ?topic=paper but with no articles)", () => {
        return request(api)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.eql([]);
          });
      });

      it("200 - ?sort_by=title", () => {
        return request(api)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.be.descendingBy("title");
          });
      });
      it("400 - ?sort_by=column_does-not-exist", () => {
        return request(api)
          .get("/api/articles?sort_by=column_does-not-exist")
          .expect(400)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal("Column does not exist");
          });
      });
      it("200 - ?sort_by=topic&order=desc", () => {
        return request(api)
          .get("/api/articles?sort_by=topic&order=asc")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.be.ascendingBy("topic");
          });
      });
      it("GET: 200 - Return articles by author", () => {
        return request(api)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(result => {
            expect(result.body.articles.length).to.be.equal(3);
          });
      });

      it("404 - ?author=doesNotExist)", () => {
        return request(api)
          .get("/api/articles?author=doesNotExist ")
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('"doesNotExist" not found');
          });
      });
      it("200 - ?author=lurker available in the database but has no articles", () => {
        return request(api)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.eql([]);
          });
      });
    });
    describe("INVALID METHODS", () => {
      it("status:405", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(api)
            [method]("/api/articles/1/comments")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe("PATCH - /api/comments/:comment_id", () => {
    it("PATCH: 200 return an updated Comment", () => {
      return request(api)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(comment => {
          expect(comment.body.comment.votes).to.equal(17);
        });
    });
    it("200 - decrements score", () => {
      return request(api)
        .patch("/api/comments/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(response => {
          expect(response.body.comment.votes).to.equal(15);
        });
    });
    it("400 - patch request has no body and no votes cast", () => {
      return request(api)
        .patch("/api/comments/2")
        .send()
        .expect(400)
        .then(comment => {
          expect(comment.body.msg).to.equal("Patch request invalid");
        });
    });
    it("400 - wrong comment id type  ", () => {
      return request(api)
        .patch("/api/comments/not-commentId")
        .send({ inc_votes: "notId" })
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Invalid Id");
        });
    });
    it("400 -no inc_votes on request body", () => {
      return request(api)
        .patch("/api/comments/1")
        .send()
        .expect(400)
        .then(err => {
          expect(err.body.msg).to.equal("Patch request invalid");
        });
    });

    it("404 - responds comment not found in database", () => {
      return request(api)
        .patch("/api/comments/987654")
        .send({ inc_votes: 22 })
        .expect(404)
        .then(err => {
          expect(err.body.msg).to.equal("Comment not found");
        });
    });
    it("400 - wrong article_id data type", () => {
      return request(api)
        .patch("/api/comments/not-an-id")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid Id");
        });
    });
  });
  describe("DELETE - /api/comments/:comment_id", () => {
    it("204 - delete the given comment by comment_id", () => {
      return request(api)
        .delete("/api/comments/6")
        .expect(204)
        .then(() => {
          return request(api)
            .get("/api/articles/1/comments")
            .expect(200);
        })
        .then(response => {
          const { comments } = response.body;
          expect(comments).to.have.lengthOf(12);
        });
    });
  });
  describe("DELETE 400", () => {
    it("400 - comment_id not in the database", () => {
      return request(api)
        .delete("/api/comments/789654")
        .expect(404)
        .then(response => {
          const { msg } = response.body;
          expect(msg).to.equal("Comment not found");
        });
    });
    it("400 - bad type comment_id", () => {
      return request(api)
        .delete("/api/comments/nonId")
        .expect(400)
        .then(response => {
          const { msg } = response.body;
          expect(msg).to.equal("Invalid Id");
        });
    });
  });
});
