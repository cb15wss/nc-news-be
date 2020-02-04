const { selectTopics } = require("../models/topicsModel");

exports.getTopics = (req, resp, next) => {
  // console.log("inside topics controller");
  selectTopics()
    .then(topics => {
      // console.log("topics in topics controller", topics);
      resp.status(200).send({ topics });
    })
    .catch(next);
};
