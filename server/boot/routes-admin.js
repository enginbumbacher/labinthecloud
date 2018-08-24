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
    if (req.body.password == req.body.confirm_password) {
      
      res.redirect('/admin/register');
      return;
    }

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

  app.get('/admin/session_test', (req, res) => {
    req.session.views = req.session.views ? req.session.views + 1 : 1;
    res.render('pages/session_test', {
      views: req.session.views
    });
  })
}