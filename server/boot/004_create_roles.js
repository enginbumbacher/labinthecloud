module.exports = (app, cb) => {
  const Role = app.models.Role;

  const defaultRoles = ["admin", "instructor"];

  Promise.all(defaultRoles.map((role) => {
    return new Promise((resolve, reject) => {
      Role.findOrCreate({
        where: {
          name: role
        }
      }, {
        name: role
      }, (err, roleInst, created) => {
        if (err) reject(err);
        resolve(true);
      })
    });
  })).then(() => {
    cb();
  })
}