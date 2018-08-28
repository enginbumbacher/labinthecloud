'use strict';

const AWS = require('aws-sdk'),
  fs = require('fs'),
  path = require('path'),
  dsConfig = require('../datasources.json');

module.exports = (app) => {
  let LabUser = app.models.LabUser;
  let User = app.models.User;

  app.get('/admin', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (user) {
      let msgs = req.session.messages;
      delete req.session.messages;
      res.render('pages/home', {
        context: ctx,
        messages: msgs
      })
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
    let msgs = req.session.messages;
    delete req.session.messages;
    res.render('pages/login', {
      context: ctx,
      messages: msgs
    });
  });

  app.post('/admin/login', (req, res) => {
    LabUser.login({
      email: req.body.email,
      password: req.body.password
    }, 'user', (err, token) => {
      if (err) {
        req.session.messages = req.session.messages || [];
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
    let msgs = req.session.messages;
    delete req.session.messages;
    res.render('pages/register', {
      context: ctx,
      messages: msgs
    });
  });

  app.post('/admin/register', (req, res) => {
    if (req.body.password !== req.body.confirm_password) {
      req.session.messages = req.session.messages || [];
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
        req.session.messages = req.session.messages || [];
        req.session.messages.push({
          type: "danger",
          text: "Email address is already registered"
        });
        res.redirect('/admin/register');
        return;
      }
      user.verify({
        type: "email",
        to: user.email,
        from: process.env.SCRIPT_EMAIL_ADDRESS,
        subject: "Complete your Lab in the Cloud registration",
        template: path.resolve(__dirname, '../views/emails/verify.ejs'),
        redirect: '/admin/verified',
        user: user
      }, (err, response, next) => {
        if (err) return next(err);
        console.log("Verification email sent: " + response);
        req.session.messages = req.session.messages || [];
        req.session.messages.push({
          type: "success",
          text: "Your account has been created! Please check your email and click on the verificaiton link before logging in."
        });
        res.redirect('/admin/register');
      });
      // LabUser.login({
      //   email: req.body.email,
      //   password: req.body.password
      // }, 'user', (err, token) => {
      //   if (err) {
      //     req.session.messages = req.session.messages || [];
      //     req.session.messages.push({
      //       type: "danger",
      //       text: "Account created, but login failed somehow?: " + err
      //     });
      //     req.session.save(() => {
      //       res.redirect('/admin/login');
      //     })
      //     return;
      //   }
      //   req.session.messages = req.session.messages || [];
      //   req.session.messages.push({
      //     type: "success",
      //     text: "Welcome to Lab in the Cloud, " + req.body.email + "!"
      //   });

      //   res.cookie('access_token', token.id, {
      //     signed: req.signedCookies ? true : false,
      //     maxAge: 1000 * token.ttl
      //   });

      //   res.redirect('/admin');
      // });
    });
  });

  app.get('/admin/verified', (req, res) => {
    let ctx = req.getCurrentContext();
    res.render('pages/verified', {
      context: ctx,
      messages: req.session.messages
    })
  })

  app.get('/admin/logout', (req, res) => {
    if (req.accessToken) {
      LabUser.logout(req.accessToken.id);
      req.session.messages = req.session.messages || [];
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
}