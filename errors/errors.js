exports.badMethod = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.psqlErrors = (err, req, res, next) => {
  //console.log("psql error handler errors status", err.code);
  //console.log("psql error handler errors status", err.msg);

  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Article Id" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Does not exist" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Information missing" });
  } else {
    next(err);
  }
};
//};

exports.customErrors = (err, req, res, next) => {
  //console.log("custom error handler", err.msg);
  if (err.msg) {
    // res.status(400).send({ msg: "Invalid Article Id" });

    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.notRoute = (req, res, next) => {
  res.status(404).send({ msg: "Route not Found" });
};
