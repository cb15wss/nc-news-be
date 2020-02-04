process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const api = require("../api");
const connection = require("../connection");
const chai = require("chai");
const chaiSorted = require("chai-sorted");

chai.use(require("sams-chai-sorted"));

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    it("GET: Status 200 and return an object", () => {
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
    it("GET: 200 return array of topics objects", () => {
      return request(api)
        .get("/api/topics")
        .expect(200)
        .then(topics => {
          //console.log("spec file topics are ", topics.body);
          expect(topics.body.topics).to.be.an("array");
          expect(topics.body.topics[0]).to.have.keys(["slug", "description"]);
          //expect(topics.body).to.have.keys(["slug", "description"]);
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
  /*describe.only("/users", () => {
    describe("/:username", () => {
      it("GET: 200 responds with user object", () => {
        return request(api)
          .get("/api/users/tickle122")
          .expect(200)
          .then(user => {
            console.log("user is ", user);
          });
      });
    });
  });
  */
  describe("/users", () => {
    it("GET 200: responds with users object", () => {
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

  /*describe.only("/api/articles", () => {
    it("GET: 200 - will respond with articles array", () => {
      return request(api)
        .get("/api/articles")
        .expect(200)
        .then(articles_response => {
          expect(articles_response.body.articles).to.be.an("array");
          /*expect(articles_response.body.articles[0]).to.have.keys([
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
  });*/
  describe("/api/articles/:article_id", () => {
    it("GET: 200 - Responds with status 200 and an article object", () => {
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
          expect(response.body.msg).to.equal("Invalid Article Id");
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
    /* it.only("POST: 201 responds with posted comment object", () => {});
    return request(api)
    .post("/api/articles/1/comments")
    .send({ inc_votes: 1 })
    .expect(200)
    .then(article => {
      console.log(article.body.article.votes);
      expect(article.body.article.votes).to.equal(101);
    });
    */
  });
});
