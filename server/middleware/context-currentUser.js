// adapted from http://blog.digitopia.com/tokens-sessions-users/

const loopback = require('loopback');

module.exports = () => {
  return (req, res, next) => {
    if (!req.accessToken) {
      return next();
    }

    const RoleMapping = req.app.models.RoleMapping;
    const Role = req.app.models.Role;
    const User = req.app.models.LabUser;

    User.findById(req.accessToken.userId, (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next();
      }

      Role.getRoles({
        principalType: RoleMapping.USER,
        principalId: user.id
      }, (err, roles) => {
        Role.find({
          where: {
            or: roles.map((r) => { return { id: r }; })
          }
        }, (err, fullRoles) => {
          let reqContext = req.getCurrentContext();
          reqContext.set('currentUser', user);
          reqContext.set('currentUserRoles', fullRoles.map((fr) => { return fr.name; }));
          next();
        })
      })
    })
  }
}