module.exports = (app) => {
  const LabUser = app.models.LabUser;

  app.get('/admin/account', (req, res) => {
    if (!req.accessToken.userId) {
      res.redirect('/admin/login');
    }
    
    res.render('pages/account/index', {});
  })

  app.get('/admin/account/change-password', (req, res) => {
    if (!req.accessToken.userId) {
      res.redirect('/admin/login');
    }
    res.render('pages/account/change-password', {});
  })

  app.post('/admin/account/change-password', (req, res) => {
    if (!req.accessToken.userId) res.sendStatus(401);

    if (req.body.password != req.body.confirm_password) {
      req.session.messages.push({
        type: 'danger',
        text: 'Password and confirmation do not match'
      })
      res.redirect('/admin/account/change-password');
      return;
    }

    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    let options = {
      accessToken: req.accessToken
    }
    user.changePassword(req.body.old_password, req.body.password, options, (err) => {
      if (err) {
        req.session.messages.push({
          type: 'danger',
          text: err.toString()
        })
        res.redirect('/admin/account/change-password')
        return;
      }

      req.session.messages.push({
        type: 'success',
        text: 'New password saved'
      });
      res.redirect('/admin/account');
    })
    // LabUser.setPassword(req.accessToken.userId, req.body.password, (err) => {
    //   if (err) throw err;

    //   req.session.messages.push({
    //     type: 'success',
    //     text: 'New password saved'
    //   });
    //   res.redirect('/admin/account');
    // })
  })
}