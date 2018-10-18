'use strict';

const slugify = require('slugify');

module.exports = (app) => {
  const LabUser = app.models.LabUser;

  app.get('/admin/account', (req, res) => {
    if (!req.accessToken.userId) {
      res.redirect('/admin/login');
    }
    
    // res.render('pages/account/index', {});
    res.render('pages/account/change-domain', {
      urlBase: `${req.protocol}://${req.hostname}${req.hostname == "localhost" ? `:${app.get('port')}` : ''}/lab/`
    });
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
  })

  app.get('/admin/account/change-domain', (req, res) => {
    if (!req.accessToken.userId) {
      res.redirect('/admin/login');
    }
    res.render('pages/account/change-domain', {
      urlBase: `${req.protocol}://${req.hostname}${req.hostname == "localhost" ? `:${app.get('port')}` : ''}/lab/`
    });
  })

  app.post('/admin/account/change-domain', (req, res) => {
    if (!req.accessToken.userId) res.sendStatus(401);

    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');

    let usedDomain = slugify(req.body.domain, {
      lower: true,
      remove: /[*+~.()'"!:@]/g
    });

    LabUser.find({ where: { domain: usedDomain }}).then((extant) => {
      let allowed = true;
      if (extant.length) {
        allowed = extant.reduce((acc, curr) => {
          return acc || curr.id == user.id;
        }, false)
      }
      if (!allowed) {
        req.session.messages.push({
          type: 'danger',
          text: `"${usedDomain}" is already taken. Please use another value.`
        })
        res.redirect('/admin/account/change-domain');
      } else {
        user.domain = usedDomain;
        user.save();
        req.session.messages.push({
          type: 'success',
          text: 'Base URL changed'
        })
        res.redirect('/admin/account/change-domain');
      }
    })
  })
}