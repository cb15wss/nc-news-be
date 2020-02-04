exports.badMethod = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.notRoute = (req, res, next) => {
  res.status(404).send({ msg: "Route not Found" });
};

exports.customErrors = (err, req, res, next) => {
  console.log("error handler errors", err);
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.psqlErrors = (err, req, res, next) => {
  console.log(err);
};
