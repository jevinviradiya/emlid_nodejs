const errorResponse = (res, msg) => {
  res.status(400).send({
    status: false,
    message: msg,
  });
};

const sendResponse = (res, msg, data) => {
  res.status(200).send({
    status: true,
    message: msg,
    data: data,
  });
};

module.exports = {errorResponse, sendResponse};
