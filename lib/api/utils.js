module.exports = {
  handleError: error => {
    // Try to parse error object and return inner array of error messages, if available
    if(error && error.errors && error.errors instanceof Array) {
      error = error.errors.map(err => err.message) || error;
    }
    return Promise.reject(error);
  }
};
