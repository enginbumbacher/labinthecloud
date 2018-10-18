'use strict';

module.exports = (app) => {
  const User = app.models.LabUser;
  const Lab = app.models.Lab;
  const uuidv4 = require('uuid/v4');
  const StudentGroup = app.models.StudentGroup;

  app.get('/lab/:userPath/:studentGroupPath/:labPath', (req, res) => {
    User.findOne({ where: { or: [{ uuid: req.params.userPath }, { domain: req.params.userPath }]}}).then((user) => {
      return Promise.all([
        user.labs.findOne({ where: { path: req.params.labPath } }),
        user.studentGroups.findOne({ where: { path: req.params.studentGroupPath }})
      ]);
    }).then((data) => {
      let lab = data[0];
      let group = data[1];

      if (lab && group) {
        let conf = lab.config;
        conf.lab = lab.uuid;
        conf.studentGroup = {
          uuid: group.uuid,
          name: group.path
        };
        res.render('pages/lab/public', {
          lab: conf
        })
      } else {
        res.sendStatus(404);
      }
    })
  })

  app.post('/lab/:userPath/:studentGroupPath/:labPath/access', (req, res) => {
    User.findOne({ where: { or: [{ uuid: req.params.userPath }, { domain: req.params.userPath }]}}).then((user) => {
      return user.studentGroups.findOne({ where: { path: req.params.studentGroupPath }});
    }).then((group) => {
      if (!group) return res.send({ access: false});

      if (group.access && group.access.length) {
        return group.access.includes(req.body.email) ? res.send({ access: true }) : res.send({ access: false});
      } else {
        return req.body.email.indexOf('@') < 0 ? res.send({ access: false}) : res.send({ access: true });
      }
    }).catch((err) => {
      res.sendStatus(500);
    });
  })

  app.get('/admin/labs', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    let perPage = parseInt(req.query.perPage) || 20;
    let page = parseInt(req.query.page) || 1;

    Promise.all([user.labs.count(), user.labs.find({
      limit: perPage,
      skip: perPage * (page - 1),
      order: 'date_created DESC'
    })]).then((queries) => {
      let count = queries[0];
      let labs = queries[1];
      let pageCount = Math.ceil(count / perPage)
      let paginationLinks = [];
      for (let i = 0; i < pageCount; i++) {
        paginationLinks.push({
          active: i + 1 == page,
          label: i + 1,
          url: `/admin/labs?page=${i + 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`
        })
      }

      res.render('pages/lab/index', {
        title: 'Labs',
        labs: labs,
        count: count,
        allowCreate: true,
        breadcrumb: [
          {
            label: 'Home',
            url: '/admin'
          },
          {
            label: 'Labs'
          }
        ],
        pagination: {
          label: "lab list navigation",
          links: paginationLinks,

          previous: page == 1 ? null : `/admin/labs?page=${page - 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`,
          next: page == pageCount ? null : `/admin/labs?page=${page + 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`
        }
      })
    })
  })

  app.get('/admin/user/:userId/labs', (req, res) => {
    let ctx = req.getCurrentContext();
    if (!ctx.get('currentUserRoles').includes("admin"))
      return res.sendStatus(403);

    let perPage = parseInt(req.query.perPage) || 20;
    let page = parseInt(req.query.page) || 1;

    User.findOne({ where: { id: req.params.userId }}).then((user) => {
      Promise.all([user.labs.count(), user.labs.find({
        limit: perPage,
        skip: perPage * (page - 1),
        order: 'date_created DESC'
      })]).then((queries) => {
        let count = queries[0];
        let labs = queries[1];
        let pageCount = Math.ceil(count / perPage)
        let paginationLinks = [];
        for (let i = 0; i < pageCount; i++) {
          paginationLinks.push({
            active: i + 1 == page,
            label: i + 1,
            url: `/admin/user/${req.params.userId}/labs?page=${i + 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`
          })
        }

        res.render('pages/lab/index', {
          title: `Labs: ${user.email}`,
          labs: labs,
          count: count,
          allowCreate: false,
          breadcrumb: [
            {
              label: 'Home',
              url: '/admin'
            },
            {
              label: 'Users',
              url: '/admin/users'
            },
            {
              label: user.email,
              url: `/admin/user/${user.id}`
            },
            {
              label: 'Labs'
            }
          ],
          pagination: {
            label: "lab list navigation",
            links: paginationLinks,

            previous: page == 1 ? null : `/admin/user/${req.params.userId}/labs?page=${page - 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`,
            next: page == pageCount ? null : `/admin/user/${req.params.userId}/labs?page=${page + 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`
          }
        })
      })
    })
  })

  // create new lab form
  app.get('/admin/lab/create', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    let uuid = uuidv4();
    console.log(uuid);

    res.render('pages/lab/single', {
      title: 'Create new lab',
      lab: {
        uuid: uuid
      },
      breadcrumb: [
        {
          label: 'Home',
          url: '/admin'
        },
        {
          label: 'Labs',
          url: '/admin/labs'
        },
        {
          label: 'Create'
        }
      ],
      owner: user
    });
  })

  app.get('/admin/lab/check-path', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    Lab.find({
      where: {
        and: [
          { labUserId: user.id },
          { path: req.query.path }
        ]
      }
    }).then((lab) => {
      if (lab.length) res.send({
        isAvailable: false,
        usedBy: lab[0].id
      });
      else res.send({
        isAvailable: true,
        usedBy: null
      });
    });
  })

  // create new lab callback
  app.post('/admin/lab/create', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    Lab.create(req.body).then((lab) => {
      req.session.messages.push({
        type: 'success',
        text: 'Saved!'
      });
      res.redirect(`/admin/lab/${lab.id}`);
    }, (err) => {
      req.session.messages.push({
        type: "danger",
        text: `There was an error saving your lab:<br/>${err}`
      });
      res.render('pages/lab/single', {
        title: 'Create new lab',
        lab: req.body
      })
    })
  })

  // edit existing lab form
  app.get('/admin/lab/:labId', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    Lab.findOne({ where: { id: req.params.labId }}).then((lab) => {
      if (user.id != lab.labUserId && !ctx.get('currentUserRoles').includes('admin')) return res.sendStatus(403);
      User.findOne({ where: { id: lab.labUserId }}).then((owner) => {
        res.render('pages/lab/single', {
          title: `Edit lab: ${lab.title}`,
          lab: lab,
          breadcrumb: [
            {
              label: 'Home',
              url: '/admin'
            },
            {
              label: 'Labs',
              url: '/admin/labs'
            },
            {
              label: lab.title
            }
          ],
          owner: owner
        })
      })
    })
  })
  // edit existing lab callback
  app.post('/admin/lab/:labId', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

  })

  //delete existing lab confirmation
  app.get('/admin/lab/:labId/delete', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    Lab.findOne({ where: { id: req.params.labId }}).then((lab) => {
      if (!lab) res.sendStatus(404);
      if (user.id != lab.labUserId && !ctx.get('currentUserRoles').includes('admin')) return res.sendStatus(403);

      res.render('pages/lab/delete', {
        lab: lab
      })
    })
  })

  // delete existing lab callback
  app.post('/admin/lab/:labId/delete', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    Lab.findOne({ where: { id: req.params.labId }}).then((lab) => {
      if (!lab) res.sendStatus(404);
      if (user.id != lab.labUserId && !ctx.get('currentUserRoles').includes('admin')) return res.sendStatus(403);

      if (req.body.deleteConfirmation) {
        Lab.destroyById(req.params.labId).then(() => {
          req.session.messages.push({
            type: 'success',
            text: `Lab "${lab.title}" has been deleted`
          })
          res.redirect('/admin/labs');
        })
      } else {
        req.session.messages.push({
          type: 'danger',
          text: 'You must press the button to confirm deletion'
        });
        res.redirect(`/admin/lab/${ req.params.labId }/delete`);
      }
    }, (err) => {
      res.sendStatus(404);
    });
  })
}