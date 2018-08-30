module.exports = (app, cb) => {
  app.models.LabUser.findOrCreate({
    where: {
      email: process.env.ADMIN_EMAIL
    }
  }, {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    emailVerified: true
  }, (err, inst, created) => {
    if (err) throw err;

    if (created) {
      console.log("User created: ", inst);
    } else {
      console.log("User already found: ", inst);
    }
    cb();
  })
}