const { selectTopics } = require("../models/topicsModel");

exports.getTopics = (req, resp, next) => {
  selectTopics()
    .then(topics => {
      resp.status(200).send({ topics });
    })
    .catch(next);
};
