exports.badMethod = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.status) {
    next(err);
  } else {
    const psqlErrors = {
      "22P02": [400, "Invalid Id"],
      "23502": [400, "Information missing"],
      "23503": [404, "Does not exist"],
      "42703": [400, "Column does not exist"]
    };
    const { code } = err;
    res.status(psqlErrors[code][0]).send({ msg: psqlErrors[code][1] });
  }
};

exports.customErrors = (err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Unhandled error", err });
  }
  next(err);
};

exports.notRoute = (req, res, next) => {
  res.status(404).send({ msg: "Route not Found" });
};
