const httpError = (status, message) => {
  const error = new Error(message);
  console.log(error);
  error.status = status;
  return error;
};

module.exports = httpError;
