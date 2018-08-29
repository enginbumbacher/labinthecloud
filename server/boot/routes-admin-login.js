'use strict';

const AWS = require('aws-sdk'),
  fs = require('fs'),
  path = require('path'),
  dsConfig = require('../datasources.json');

module.exports = (app) => {
  let LabUser = app.models.LabUser;
  let User = app.models.User;
  let Role = app.models.Role;
  let RoleMapping = app.models.RoleMapping;

  app.get('/admin', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (user) {
      res.render('pages/home', {})
    } else {
      res.redirect('/admin/login');
    }
  });

  app.get('/admin/login', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');

    if (user) {
      res.redirect('/admin');
      return;
    }
    res.render('pages/login', {});
  });

  app.post('/admin/login', (req, res) => {
    LabUser.login({
      email: req.body.email,
      password: req.body.password
    }, 'user', (err, token) => {
      if (err) {
        req.session.messages.push({
          type: "danger",
          text: "Login failed: " + err
        });
        req.session.save(() => {
          res.redirect('/admin/login');
        })
        return;
      }

      res.cookie('access_token', token.id, {
        signed: req.signedCookies ? true : false,
        maxAge: 1000 * token.ttl
      });

      res.redirect('/admin');
    })
  });

  app.get('/admin/register', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');

    if (user) {
      res.redirect('/admin');
      return;
    }
    res.render('pages/register', {});
  });

  app.post('/admin/register', (req, res) => {
    if (req.body.password !== req.body.confirm_password) {
      req.session.messages.push({
        type: "danger",
        text: "Password does not match confirmation"
      });
      res.redirect('/admin/register');
      return;
    }
    //check email
    LabUser.findOrCreate({
      where: {
        email: req.body.email
      }
    }, {
      email: req.body.email,
      password: req.body.password
    }, (err, user, created) => {
      if (!created) {
        req.session.messages.push({
          type: "danger",
          text: "Email address is already registered"
        });
        res.redirect('/admin/register');
        return;
      }

      Role.find({
        name: "instructor"
      }, (err, instructorRole) => {
        instructorRole.principals.create({
          princpalType: RoleMapping.USER,
          principalId: user.id
        });
      })
      user.verify({
        type: "email",
        to: user.email,
        from: process.env.SCRIPT_EMAIL_ADDRESS,
        subject: "Complete your Lab in the Cloud registration",
        template: path.resolve(__dirname, '../views/emails/verify.ejs'),
        redirect: '/admin/verified',
        user: user,
        host: req.hostname,
        port: req.protocol == "https" ? 443 : 80,
        protocol: req.protocol
      }, (err, response, next) => {
        if (err) return next(err);
        console.log("Verification email sent: " + response);
        req.session.messages.push({
          type: "success",
          text: "Your account has been created! Please check your email and click on the verificaiton link before logging in."
        });
        res.redirect('/admin/register');
      });
    });
  });

  app.get('/admin/verified', (req, res) => {
    res.render('pages/verified', {});
  })

  app.get('/admin/logout', (req, res) => {
    if (req.accessToken) {
      LabUser.logout(req.accessToken.id);
      req.session.messages.push({
        type: 'success',
        text: 'You have logged out'
      });
      req.session.save(() => {
        res.redirect('/admin/login')
      });
    } else {
      res.redirect('/admin/login');
    }
  })

  app.get('/admin/request-password-reset', (req, res) => {
    res.render('pages/request-password-reset', {});
  })
  app.post('/admin/request-password-reset', (req, res) => {
    LabUser.resetPassword({
      email: req.body.email,
      baseUrl: req.hostname == "localhost" ? app.get('url') : `${req.protocol}://${req.hostname}/`
    }, (err) => {
      if (err) return res.status(401).send(err);
      req.session.messages.push({
        type: 'success',
        text: 'Check your email for instructions to complete your password reset.'
      });
      res.redirect('/admin/login');
    })
  })

  app.get('/admin/reset-password', (req, res) => {
    if (!req.accessToken) return res.sendStatus(401);

    res.render('pages/reset-password', {
      postUrl: `/admin/reset-password?access_token=${req.accessToken.id}`
    })
  })
  app.post('/admin/reset-password', (req, res) => {
    if (!req.accessToken) return res.sendStatus(401);

    if (req.body.password != req.body.confirm_password) {
      req.session.messages.push({
        type: 'danger',
        text: 'Password and confirmation do not match'
      });
      res.redirect(`/admin/reset-password?access_token=${req.accessToken.id}`);
      return;
    }

    LabUser.setPassword(req.accessToken.userId, req.body.password, () => {
      req.session.messages.push({
        type: 'success',
        text: 'You have successfully changed your password. Please log in.'
      });
      res.redirect('/admin/login');
    });
  })
}