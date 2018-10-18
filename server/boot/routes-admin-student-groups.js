'use strict';

module.exports = (app) => {
  let StudentGroup = app.models.StudentGroup;
  let LabUser = app.models.LabUser;

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
        title: 'Projects',
        studentGroups: studentGroups,
        count: count,
        allowCreate: true,
        breadcrumb: [
          {
            label: 'Home',
            url: '/admin'
          },
          {
            label: 'Projects'
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
          title: `Projects: ${user.email}`,
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
              label: 'Projects'
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

    user.labs.find({}).then((labs) => {
      return res.render('pages/studentgroup/edit', {
        title: 'Create new project',
        form: {
          action: '/admin/studentgroup/create'
        },
        urlBase: `${ctx.get('baseUrl')}/${user.domain}/`,
        studentGroup: {},
        labs: labs,
        breadcrumb: [
          {
            label: 'Home',
            url: '/admin'
          },
          {
            label: 'Projects',
            url: '/admin/studentgroups'
          },
          {
            label: 'Create'
          }
        ],
        owner: user
      });
    }, (err) => {
      console.log(err);
      return res.sendStatus(404);
    })

  })

  app.post('/admin/studentgroup/create', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    let d = req.body;
    d.labs = (d.labs || []).map((labId) => parseInt(labId));
    d.access = d.access.split('\n').map((username) => username.trim()).filter((username) => username !== '');

    // check for duplicate base url

    StudentGroup.find({
      where: {
        and: [
          { labUserId: user.id },
          { path: req.body.path }
        ]
      }
    }).then((extant) => {
      if (extant.length) {
        req.session.messages.push({
          type: 'danger',
          text: `You are already using the base URL: ${req.body.path}`
        });
        user.labs.find({}).then((labs) => {
          return res.render('pages/studentgroup/edit', {
            title: 'Create new project',
            form: {
              action: '/admin/studentgroup/create'
            },
            urlBase: `${ctx.get('baseUrl')}/${user.domain}/`,
            studentGroup: d,
            labs: labs,
            breadcrumb: [
              {
                label: 'Home',
                url: '/admin'
              },
              {
                label: 'Projects',
                url: '/admin/studentgroups'
              },
              {
                label: 'Create'
              }
            ],
            owner: user
          });
        })
      } else {
        user.studentGroups.create(d).then((group) => {
          return Promise.all(d.labs.map((labId) => {
            return group.labs.add(labId);
          })).then(() => {
            req.session.messages.push({
              type: 'success',
              text: `Project "${group.name}" has been created`
            })
            return res.redirect('/admin/studentgroups');
          }, (err) => {
            console.log(err);
            return res.sendStatus(500);
          });
        }, (err) => {
          console.log(err);
          return res.sendStatus(500);
        })
      }
    })
  })

  app.get('/admin/studentgroup/:studentGroupId', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    StudentGroup.findOne({
      where: {
        id: req.params.studentGroupId
      },
      include: [
        {
          relation: 'labs'
        }
      ]
    }).then((group) => {
      if (user.id != group.labUserId && !ctx.get('currentUserRoles').includes('admin')) return res.sendStatus(403);

      LabUser.findOne({ where: { id: group.labUserId }}).then((owner) => {
        return res.render('pages/studentgroup/single', {
          title: `Project: ${ group.name }`,
          studentGroup: group.toJSON(),
          userPath: owner.domain,
          breadcrumb: [
            {
              label: 'Home',
              url: '/admin'
            },
            {
              label: 'Projects',
              url: '/admin/studentgroups'
            },
            {
              label: group.name
            }
          ]
        })
      })
    }, (err) => {
      return res.sendStatus(404);
    });
  })

  app.get('/admin/studentgroup/:studentGroupId/edit', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    StudentGroup.findOne({
      where: {
        id: req.params.studentGroupId
      },
      include: [
        {
          relation: 'labs',
          scope: {
            fields: ['id']
          }
        }
      ]
    }).then((group) => {
      if (user.id != group.labUserId && !ctx.get('currentUserRoles').includes('admin')) return res.sendStatus(403);

      LabUser.findOne({
        where: {
          id: group.labUserId
        }
      }).then((owner) => {
        owner.labs.find({}).then((labs) => {
          return res.render('pages/studentgroup/edit', {
            title: `Edit Project: ${group.name}`,
            form: {
              action: `/admin/studentgroup/${req.params.studentGroupId}/edit`
            },
            urlBase: `${ctx.get('baseUrl')}/${owner.domain}/`,
            studentGroup: group.toJSON(),
            labs: labs,
            breadcrumb: [
              {
                label: 'Home',
                url: '/admin'
              },
              {
                label: 'Projects',
                url: '/admin/studentgroups'
              },
              {
                label: group.name,
                url: `/admin/studentgroup/${group.id}`
              },
              {
                label: 'Edit'
              }
            ],
            owner: owner
          });
        }, (err) => {
          console.log(err);
          return res.sendStatus(404);
        })
      })
    }, (err) => {
      return res.sendStatus(404);
    })
  })

  app.post('/admin/studentgroup/:studentGroupId/edit', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    let d = req.body;
    d.labs = (d.labs || []).map((labId) => parseInt(labId));
    d.access = d.access.split('\n').map((username) => username.trim()).filter((username) => username !== '');

    StudentGroup.findOne({
      where: {
        id: req.params.studentGroupId
      },
      include: [
        {
          relation: "labs",
          scope: {
            fields: ['id']
          }
        }
      ]
    }).then((group) => {
      if (user.id != group.labUserId && !ctx.get('currentUserRoles').includes('admin')) return res.sendStatus(403);

      LabUser.findOne({
        where: { id: group.labUserId}
      }).then((owner) => {
        StudentGroup.find({
          where: {
            and: [
              { labUserId: group.labUserId },
              { path: req.body.path},
              { id: { neq: group.id }}
            ]
          }
        }).then((extantPaths) => {
          if (extantPaths.length) {
            req.session.messages.push({
              type: 'danger',
              text: `You are already using the base URL: ${req.body.path}`
            });
            d.labs = d.labs.map((labId) => { return { id: labId } });
            owner.labs.find({}).then((labs) => {
              return res.render('pages/studentgroup/edit', {
                title: `Edit Project: ${ group.name }`,
                form: {
                  action: `/admin/studentgroup/${req.params.studentGroupId}/edit`
                },
                urlBase: `${ctx.get('baseUrl')}/${owner.domain}/`,
                studentGroup: d,
                labs: labs,
                breadcrumb: [
                  {
                    label: 'Home',
                    url: '/admin'
                  },
                  {
                    label: 'Projects',
                    url: '/admin/studentgroups'
                  },
                  {
                    label: group.name,
                    url: `/admin/studentgroup/${group.id}`
                  },
                  {
                    label: 'Edit'
                  }
                ],
                owner: owner
              });
            }, (err) => {
              console.log(err);
              return res.sendStatus(404);
            })
          } else {
            let currentLabs = group.toJSON().labs.map((lab) => lab.id);
            let labManagement = [];
            if (req.body.labs) {
              currentLabs.forEach((labId) => {
                if (!req.body.labs.includes(labId)) {
                  labManagement.push(group.labs.remove(labId))
                }
              })
              req.body.labs.forEach((labId) => {
                if (!currentLabs.includes(labId)) {
                  labManagement.push(group.labs.add(labId));
                }
              })
            }

            return Promise.all(labManagement.concat(group.updateAttributes(d))).then((results) => {
              let g = results[results.length - 1];
              req.session.messages.push({
                type: 'success',
                text: `Project "${g.name}" has been saved`
              })
              return res.redirect(`/admin/studentgroup/${req.params.studentGroupId}/edit`)
            }, (err) => {
              console.log(err);
              return res.sendStatus(500);
            })
          }
        })
      })
    }, (err) => {
      return res.sendStatus(404);
    });
  });

  //delete existing group confirmation
  app.get('/admin/studentgroup/:studentGroupId/delete', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    StudentGroup.findOne({ where: { id: req.params.studentGroupId }}).then((group) => {
      if (!group) res.sendStatus(404);
      if (user.id != group.labUserId && !ctx.get('currentUserRoles').includes('admin')) return res.sendStatus(403);

      res.render('pages/studentgroup/delete', {
        studentGroup: group
      })
    })
  })

  // delete existing group callback
  app.post('/admin/studentgroup/:studentGroupId/delete', (req, res) => {
    let ctx = req.getCurrentContext();
    let user = ctx.get('currentUser');
    if (!user) return res.sendStatus(403);

    StudentGroup.findOne({ where: { id: req.params.studentGroupId }}).then((group) => {
      if (!group) res.sendStatus(404);
      if (user.id != group.labUserId && !ctx.get('currentUserRoles').includes('admin')) return res.sendStatus(403);

      if (req.body.deleteConfirmation) {
        StudentGroup.destroyById(req.params.studentGroupId).then(() => {
          req.session.messages.push({
            type: 'success',
            text: `Project "${group.name}" has been deleted`
          })
          res.redirect('/admin/studentgroups');
        })
      } else {
        req.session.messages.push({
          type: 'danger',
          text: 'You must press the button to confirm deletion'
        });
        res.redirect(`/admin/studentgroup/${ req.params.studentGroupId }/delete`);
      }
    }, (err) => {
      res.sendStatus(404);
    });
  })
}