process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const api = require("../api");
const connection = require("../connection");
const chai = require("chai");
const chaiSorted = require("chai-sorted");

chai.use(require("sams-chai-sorted"));

describe("API", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api/topics", () => {
    describe("GET:200", () => {
      it("200: Returns a topics object", () => {
        return request(api)
          .get("/api/topics")
          .expect(200)
          .then(topics => {
            // console.log("spec file topics are ", topics.body);
            expect(topics.body).to.be.an("object");
            expect(topics.body).to.have.keys(["topics"]);
            //expect(topics.body).to.have.keys(["slug", "description"]);
          });
      });
      it("200 return array of topic objects", () => {
        return request(api)
          .get("/api/topics")
          .expect(200)
          .then(topics => {
            //console.log("spec file topics are ", topics.body);
            expect(topics.body.topics).to.be.an("array");
            //expect(topics.body.topics[0]).to.have.keys(["slug", "description"]);
            //expect(topics.body).to.have.keys(["slug", "description"]);
            topics.body.topics.forEach(topic => {
              expect(topic).to.have.keys(["slug", "description"]);
            });
          });
      });
      it("GET: /notARoute responds with status 404, route not found", () => {
        return request(api)
          .get("/api/topcs")
          .expect(404)
          .then(({ body }) => {
            //  console.log(body.msg);
            expect(body.msg).to.equal("Route not Found");
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
              //console.log("spec users", response.body);
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
            //console.log("user is ", response.body.user);
            expect(response.body.user).to.be.an("array");
            expect(response.body.user[0].name).to.equal("jonny");
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
            //console.log("spec article response", article.body);

            expect(article.body.article).to.be.an("array");
            expect(article.body.article[0]).to.be.an("object");
            expect(article.body.article[0]).to.have.keys([
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
          //  console.log("not article model response", response.body);
          expect(response.body.msg).to.equal("Article does not exist");
        });
    });
    it("GET: 400 - Invalid Article Id", () => {
      return request(api)
        .get("/api/articles/notAnId")
        .expect(400)
        .then(response => {
          //console.log("not article id model response", response.body);
          expect(response.body.msg).to.equal("Invalid Id");
        });
    });
    it("PATCH: 200 return an updated article", () => {
      return request(api)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(article => {
          //console.log(article.body.article.votes);
          expect(article.body.article.votes).to.equal(101);
        });
    });
    it("400 - patch request has no body and no votes cast", () => {
      return request(api)
        .patch("/api/articles/3")
        .send()
        .expect(400)
        .then(article => {
          //console.log(article.body);
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
          // console.log(comment, "comment");
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
        .send({ username: "butter_bridge", body: "" })
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

  describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
      it("200 - responds with comment array of corresponding articles", () => {
        return request(api)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(response => {
            console.log("comments in spec", response);
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
      it("404 - when article_id does not exist", () => {
        return request(api)
          .get("/api/articles/999/comments")
          .expect(404)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal("Comments does not exist");
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
            //console.log("spec comments", comments);
            expect(comments).to.be.descendingBy("created_at");
          });
      });
      it("200 sort_by=votes ", () => {
        return request(api)
          .get("/api/articles/1/comments?sort_by=votes")
          .expect(200)
          .then(response => {
            const { comments } = response.body;
            //console.log("model comments are ", comments);
            expect(comments).to.be.descendingBy("votes");
          });
      });
    });
    //});
    describe("/api/articles", () => {
      it("GET: 200 - will respond with articles array", () => {
        return request(api)
          .get("/api/articles")
          .expect(200)
          .then(articles_response => {
            console.log(
              "spec article 1 is",
              articles_response.body.articles[0]
            );

            expect(articles_response.body.articles).to.be.an("array");
            expect(articles_response.body.articles[0]).to.eql({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 100,
              topic: "mitch",
              body: "I find this existence challenging",
              comment_count: "13"
            });
            expect(articles_response.body.articles[0]).to.have.keys([
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
      describe("Queries", () => {
        it("defaults to ?sort_by:created_at&order=desc", () => {
          return request(api)
            .get("/api/articles")
            .expect(200)
            .then(response => {
              const { articles } = response.body;
              //console.log("spec comments", comments);
              expect(articles).to.be.descendingBy("created_at");
            });
        });
        it("200 sort_by=author ", () => {
          return request(api)
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then(response => {
              const { articles } = response.body;
              //console.log("spec articles are ", articles);
              expect(articles).to.be.descendingBy("author");
            });
        });
        it("404: /api/articles?author=not-an-author", () => {
          return request(api)
            .get("/api/articles?sort_by=not-an-author")
            .expect(404)
            .then(response => {
              // const { articles } = response.body;
              //console.log("spec articles are ", articles);
              //expect(articles).to.be.descendingBy("author");
              const { msg } = response.body;
              expect(msg).to.equal("Column does not exist");
            });
        });
        it("200 sort_by=topic", () => {
          return request(api)
            .get("/api/articles?sort_by=topic")
            .expect(200)
            .then(response => {
              const { articles } = response.body;
              //console.log("spec articles are ", articles);
              expect(articles).to.be.descendingBy("topic");
            });
        });

        it("GET: 200 - Return articles by topic", () => {
          return request(api)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(result => {
              //console.log("spec result", result.body);
              expect(result.body.articles.length).to.be.equal(1);
            });
        });
        xit('"404: /api/articles?topic=not-a-topic"', () => {
          return request(api)
            .get("/api/articles?topic=not-a-topic")
            .expect(404)
            .then(response => {
              const { articles } = response.body;
              console.log("spec articles are ", articles);
              //expect(articles).to.be.descendingBy("author");
              const { msg } = response.body;
              expect(msg).to.equal("Column does not exist");
            });
        });
        it("GET: 200 - Return articles by author", () => {
          return request(api)
            .get("/api/articles?author=butter_bridge")
            .expect(200)
            .then(result => {
              console.log("spec result", result.body.articles.length);
              expect(result.body.articles.length).to.be.equal(3);
            });
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
    //describe("", () => {
    it("PATCH: 200 return an updated Comment", () => {
      return request(api)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(comment => {
          console.log(comment.body.comment.votes);
          expect(comment.body.comment.votes).to.equal(17);
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
        .send({ inc_votes: 56 })
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Invalid Id");
        });
    });
    it("400 -no inc_votes on request body", () => {
      return request(api)
        .patch("/api/comments/1")
        .send({ increaseVotes: 70 })
        .expect(400)
        .then(err => {
          expect(err.body.msg).to.equal("Patch request invalid");
        });
    });

    it("404 - responds comment not found error", () => {
      return request(api)
        .patch("/api/comments/987654")
        .send({ inc_votes: 22 })
        .expect(404)
        .then(err => {
          expect(err.body.msg).to.equal("Comment not found");
        });
    });
  });
});
