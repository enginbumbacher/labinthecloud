module.exports = (app, cb) => {
  const Role = app.models.Role;
  const User = app.models.LabUser;
  const RoleMapping = app.models.RoleMapping;

  Role.findOne({
    where: {
      name: "admin"
    }
  }, (err, adminRole) => {
    if (err) throw err;
    if (!adminRole) {
      console.log("no admin role found");
      return cb();
    }

    User.findOne({
      where: {
        email: process.env.ADMIN_EMAIL
      }
    }, (uerr, admin) => {
      if (uerr) throw uerr;
      if (!admin) {
        console.log("no admin user found");
        return cb();
      }

      // for some reason, relation models don't have findOrCreate...
      adminRole.principals.find({
        where: {
          principalType: RoleMapping.USER,
          principalId: admin.id
        }
      }, (perr, principal) => {
        if (perr) throw perr;
        if (!principal) {
          adminRole.principals.create({
            principalType: RoleMapping.USER,
            principalId: admin.id
          }, (pcerr, princip) => {
            if (pcerr) throw pcerr;
            cb();
          })
        } else {
          cb();
        }
      });
    })
  });
}