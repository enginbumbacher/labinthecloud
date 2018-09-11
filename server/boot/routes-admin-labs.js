'use strict';

module.exports = (app) => {
  const User = app.models.LabUser;
  const Lab = app.models.Lab;

  app.get('/admin/labs', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) res.sendStatus(403);

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
            url: `/admin/labs?page=${i + 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`
          })
        }

        res.render('pages/lab/index', {
          title: `Labs: ${user.email}`,
          labs: labs,
          count: count,
          pagination: {
            label: "lab list navigation",
            links: paginationLinks,

            previous: page == 1 ? null : `/admin/labs?page=${page - 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`,
            next: page == pageCount ? null : `/admin/labs?page=${page + 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`
          }
        })
      })
    })
  })

  // create new lab form
  app.get('/admin/lab/create', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) res.sendStatus(403);

    res.render('pages/lab/single', {
      title: 'Create new lab',
      lab: {}
    });
  })

  app.get('/admin/lab/check-path', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) res.sendStatus(403);

    Lab.find({ where: { path: req.body.path }}).then((lab) => {
      if (lab.length) res.send(`{ "isAvailable": false }`);
      else res.send(`{ "isAvailable": true }`);
    });
  })

  // create new lab callback
  app.post('/admin/lab/create', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) res.sendStatus(403);

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
    if (!user) res.sendStatus(403);

    Lab.findOne({ where: { id: req.params.labId }}).then((lab) => {
      if (user.id != lab.userId && !ctx.get('currentUserRoles').includes('admin')) res.sendStatus(403);
      res.render('pages/lab/single', {
        title: `Edit lab: ${req.params.labId}`,
        lab: lab
      })
    })
  })
  // edit existing lab callback
  app.post('/admin/lab/:labId', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) res.sendStatus(403);

  })

  //delete existing lab confirmation
  app.get('/admin/lab/:labId/delete', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) res.sendStatus(403);

  })

  // delete existing lab callback
  app.post('/admin/lab/:labId/delete', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) res.sendStatus(403);

  })
}