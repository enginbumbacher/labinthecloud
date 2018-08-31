// adapted from http://blog.digitopia.com/tokens-sessions-users/

const loopback = require('loopback');

module.exports = () => {
  return (req, res, next) => {
    if (!req.accessToken) {
      return next();
    }

    req.app.models.LabUser.findById(req.accessToken.userId, (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next();
      }

      req.app.models.Role.getRoles({
        principalType: req.app.models.RoleMapping.USER,
        principalId: user.id
      }, (err, roles) => {
        let reqContext = req.getCurrentContext();
        reqContext.set('currentUser', user);
        reqContext.set('currentUserRoles', roles);
        next();
      })
    })
  }
}