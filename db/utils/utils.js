exports.formatDates = list => {
  return list.map(({ created_at, ...all }) => {
    return {
      ...all,
      created_at: new Date(created_at)
    };
  });
};

exports.makeRefObj = list => {
  const objRef = {};
  list.forEach(obj => {
    const objCopy = { ...obj };
    let key = objCopy.title;
    let value = objCopy.article_id;
    objRef[key] = value;
  });
  return objRef;
};

exports.formatComments = (comments, articleRefObj) => {
  return comments.map(({ created_by, belongs_to, created_at, ...all }) => {
    return {
      ...all,
      author: created_by,
      article_id: articleRefObj[belongs_to],
      created_at: new Date(created_at)
    };
  });
};
