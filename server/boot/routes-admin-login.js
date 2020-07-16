'use strict';

const AWS = require('aws-sdk'),
  fs = require('fs'),
  path = require('path'),
  dsConfig = require('../datasources.json');

const baselineLab = {"system":{"maxLoginTime":0,"experimentModality":"createAndHistory","modelModality":"create","expModelModality":"simultaneous","enableDirectComparison":false},"experiment":{"experimentForm":"narrative","formOptions":"complete","server":"prod","maxDuration":60,"bpuId":[],"euglenaServerMode":"historical"},"model":{"modelName":null,"tabs":[{"modelType":"blockly","color":2237183,"parameters":{"modelRepresentation":"functional","allowedConfigs":["1sensor_backleft","1sensor_backright","1sensor_frontleft","1sensor_frontright","1omnisensor_backleft","1omnisensor_backright","1omnisensor_frontleft","1omnisensor_frontright","1omnisensor_frontcenter","1omnisensor_frontcenter_shield_left","1omnisensor_frontcenter_shield_right","2sensors_back","2sensors_front"],"motion":null,"omega":{"label":"Roll","visible":true,"changeable":true,"initialValue":null,"variation":true},"v":{"label":"Forward Speed","visible":true,"changeable":true,"initialValue":null,"variation":true},"k":{"label":"Reaction Strength","visible":true,"changeable":true,"initialValue":null,"variation":true},"opacity":{"label":null,"visible":false,"changeable":null,"initialValue":{"variation":0,"qualitativeValue":"opacity_0","numericValue":0},"variation":null}}}],"blocks":{"turning":{"turn_at_1sensor":{"allow":true,"maxUse":2},"turn_at_2sensor":{"allow":true,"maxUse":2},"turn_randomly":{"allow":true,"maxUse":2},"turn_change":{"allow":true,"maxUse":2}},"forward":{"move_normal":{"allow":true,"maxUse":2},"move_change":{"allow":true,"maxUse":2}},"rotation":{"roll_normal":{"allow":true,"maxUse":2},"roll_change":{"allow":true,"maxUse":2}},"additional":{"see_light_quantity":{"allow":true,"maxUse":2}}},"euglenaInit":{"options":{"1":"random","2":"all point to right"},"initialValue":"1"},"euglenaCount":{"options":{"1":1,"2":2,"20":20}},"simulationFps":12},"visualization":{"visualizationTypes":[{"id":"circle","label":"Circular Histogram","settings":{"binCount":12,"dT":1,"tStep":0.5,"width":320,"height":320,"margins":{"top":30,"right":30,"bottom":30,"left":30}}},{"id":"timeseries","label":"Average Speed","settings":{"vRange":null,"mode":"total","stdBand":true,"dT":1,"width":400,"height":300,"margins":{"top":40,"right":20,"bottom":40,"left":40}}}]},"aggregate":{"timeWindow":2}};

module.exports = (app) => {
  let LabUser = app.models.LabUser;
  let User = app.models.User;
  let Role = app.models.Role;
  let RoleMapping = app.models.RoleMapping;
  let Lab = app.models.Lab;

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

      Role.findOne({
        where: {
          name: "instructor"
        }
      }, (err, instructorRole) => {
        instructorRole.principals.create({
          principalType: RoleMapping.USER,
          principalId: user.id
        });
      })
      user.labs.create({
        title: 'Example Lab',
        config: baselineLab,
        path: 'baselab'
      })

      let baseUrl = req.hostname == "localhost" ? app.get('url') : `${req.protocol}://${req.hostname}/`;
      user.verify({
        type: "email",
        to: user.email,
        from: process.env.SCRIPT_EMAIL_ADDRESS,
        subject: "Complete your Lab in the Cloud registration",
        template: path.resolve(__dirname, '../views/emails/verify.ejs'),
        redirect: '/admin/verified',
        user: user,
        host: req.hostname,
        port: req.hostname == "localhost" ? app.get('port') : (req.protocol == "https" ? 443 : 80),
        protocol: req.protocol
      }, (err, response, next) => {
        if (err) return next(err);
        console.log("Verification email sent: ");
        console.log(response)
        req.session.messages.push({
          type: "success",
          text: "Your account has been created! Please check your email and click on the verification link before logging in."
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
