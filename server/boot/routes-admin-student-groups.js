'use strict';

module.exports = (app) => {
  app.get('/admin/studentgroups', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    let perPage = parseInt(req.query.perPage) || 20;
    let page = parseInt(req.query.page) || 1;

    Promise.all([user.studentGroups.count(), user.studentGroups.find({
      limit: perPage,
      skip: perPage * (page - 1),
      order: 'date_created DESC'
    })]).then((queries) => {
      let count = queries[0];
      let studentGroups = queries[1];
      let pageCount = Math.max(Math.ceil(count / perPage), 1);
      let paginationLinks = [];
      for (let i = 0; i < pageCount; i++) {
        paginationLinks.push({
          active: i + 1 == page,
          label: i + 1,
          url: `/admin/studentgroups?page=${i + 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`
        })
      }

      res.render('pages/studentgroup/index', {
        title: 'Classes',
        studentGroups: studentGroups,
        count: count,
        allowCreate: true,
        breadcrumb: [
          {
            label: 'Home',
            url: '/admin'
          },
          {
            label: 'Classes'
          }
        ],
        pagination: {
          label: "studentgroup list navigation",
          links: paginationLinks,

          previous: page == 1 ? null : `/admin/studentgroups?page=${page - 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`,
          next: page == pageCount ? null : `/admin/studentgroups?page=${page + 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`
        }
      })
    })
  })
  app.get('/admin/user/:userId/studentgroups', (req, res) => {
    let ctx = req.getCurrentContext();
    if (!ctx.get('currentUserRoles').includes("admin"))
      return res.sendStatus(403);

    let perPage = parseInt(req.query.perPage) || 20;
    let page = parseInt(req.query.page) || 1;

    User.findOne({ where: { id: req.params.userId }}).then((user) => {
      Promise.all([user.studentGroups.count(), user.studentGroups.find({
        limit: perPage,
        skip: perPage * (page - 1),
        order: 'date_created DESC'
      })]).then((queries) => {
        let count = queries[0];
        let studentGroups = queries[1];
        let pageCount = Math.max(Math.ceil(count / perPage), 1)
        let paginationLinks = [];
        for (let i = 0; i < pageCount; i++) {
          paginationLinks.push({
            active: i + 1 == page,
            label: i + 1,
            url: `/admin/user/${req.params.userId}/studentgroups?page=${i + 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`
          })
        }

        res.render('pages/lab/index', {
          title: `Classes: ${user.email}`,
          studentGroups: studentGroups,
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
              label: 'Classes'
            }
          ],
          pagination: {
            label: "lab list navigation",
            links: paginationLinks,

            previous: page == 1 ? null : `/admin/user/${req.params.userId}/studentgroups?page=${page - 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`,
            next: page == pageCount ? null : `/admin/user/${req.params.userId}/studentgroups?page=${page + 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`
          }
        })
      })
    })
  })

  app.get('/admin/studentgroup/create', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    res.render('pages/studentgroup/single', {
      title: 'Create new class',
      studentGroup: {},
      breadcrumb: [
        {
          label: 'Home',
          url: '/admin'
        },
        {
          label: 'Classes',
          url: '/admin/studentgroups'
        },
        {
          label: 'Create'
        }
      ],
      owner: user
    });

  })

  app.post('/admin/studentgroup/create', (req, res) => {

  })
}