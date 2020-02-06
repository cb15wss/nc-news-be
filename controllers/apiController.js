const sendEndpointsJSON = require("../endpoints.json");
//console.log(sendEndpointsJSON);
const sendApiJson = (req, res, next) => {
  res.status(200).send(sendEndpointsJSON);
};

module.exports = sendApiJson;
