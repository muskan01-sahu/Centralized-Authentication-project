// All API responses follow: { success, message, data }

const sendSuccess = (res, statusCode = 200, message = "Successful", data = null) => {
  const handle = { success: true, message };
  if (data !== null) handle.data = data;
  return res.status(statusCode).json(handle);
};

const sendError = (res, statusCode = 500, message = "Internal Server Error", errors = null) => {
  const handle = { success: false, message };
  if (errors !== null) handle.errors = errors;
  return res.status(statusCode).json(handle);
};

module.exports = { sendSuccess, sendError };