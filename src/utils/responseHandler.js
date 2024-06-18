const responseHandler = (res, statusCode, data = null, error = null) => {
    if (error) {
      console.error(error); 
      res.status(statusCode).json({ message: error.message || 'An error occurred, please try again.' });
    } else {
      res.status(statusCode).json(data);
    }
  };
  
  module.exports = responseHandler;
  