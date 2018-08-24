module.exports = (app) => {
  app.models.LabUser.findOrCreate({
    where: {
      and: [
        { email: process.env.ADMIN_EMAIL }
      ]
    }
  }, {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  }, (err, inst, created) => {
    if (err) throw err;

    if (created) {
      console.log("User created: ", inst);
    } else {
      console.log("User already found: ", inst);
    }
  })
}