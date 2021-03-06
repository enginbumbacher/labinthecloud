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
    // let port = req.app.settings.port;
    // req.baseContext.set('baseUrl', `${req.protocol}://${ req.hostname }${(req.get('host').indexOf(':') != -1 || (port == 80 || port == 443) ? '' : `:${port}`)}`);
    req.baseContext.set('baseUrl', `${req.protocol}://${ req.hostname }`);
    req.getCurrentContext = function () {
      return req.baseContext;
    };

    req.session.messages = req.session.messages || [];

    let render = res.render;
    res.render = (view, locals, cb) => {
      locals = locals || {};
      locals.styles = locals.styles || [];
      locals.scripts = locals.scripts || [];
      locals.messages = req.session.messages;
      locals.context = req.getCurrentContext();
      locals.currentUser = locals.context.get('currentUser');
      locals.breadcrumb = locals.breadcrumb || null;
      delete req.session.messages;

      render.call(res, view, locals, cb);
    }
    next();
  };
};