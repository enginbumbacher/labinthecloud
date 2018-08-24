// adapted from http://blog.digitopia.com/tokens-sessions-users/

module.exports = () => {

  function ReqContext() {
    this.data = {};

    this.get = function (key) {
      return this.data[key];
    };

    this.set = function (key, value) {
      this.data[key] = value;
    };

    this.cleanup = function () {
      this.data = {};
    };
  }

  return (req, res, next) => {
    res.once('finish', function () {
      req.baseContext.cleanup();
    });
    req.baseContext = new ReqContext();
    req.baseContext.set('originalUrl', req.originalUrl);
    req.baseContext.set('ip', req.ip);
    req.getCurrentContext = function () {
      return req.baseContext;
    };
    next();
  };
};