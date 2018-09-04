'use strict';

module.exports = (app) => {
  const User = app.models.LabUser;
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;

  // lists all users; admin role only
  app.get('/admin/users', (req, res) => {
    let ctx = req.getCurrentContext();
    if (!ctx.get('currentUserRoles').includes("admin"))
      return res.sendStatus(403);

    let perPage = parseInt(req.query.perPage) || 20;

    let page = parseInt(req.query.page) || 1;

    let p_users = User.find({
      limit: perPage,
      order: 'id DESC',
      skip: perPage * (page - 1)
    })
    let p_count = User.count();
    Promise.all([p_users, p_count]).then((qs) => {
      let users = qs[0],
        count = qs[1];
      let pageCount = Math.ceil(count / perPage)
      let paginationLinks = [];
      for (let i = 0; i < pageCount; i++) {
        paginationLinks.push({
          active: i + 1 == page,
          label: i + 1,
          url: `/admin/users?page=${i + 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`
        })
      }
      res.render('pages/user/index', {
        users: users,
        count: count,
        pagination: {
          label: "user list navigation",
          links: paginationLinks,

          previous: page == 1 ? null : `/admin/users?page=${page - 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`,
          next: page == pageCount ? null : `/admin/users?page=${page + 1}${perPage == 20 ? '' : `&perPage=${perPage}`}`
        }
      })
    })
  })

  //display a single user
  app.get('/admin/user/:userId', (req, res) => {
    let ctx = req.getCurrentContext();
    if (!ctx.get('currentUserRoles').includes("admin"))
      return res.sendStatus(403);

    Promise.all([]);
    User.findOne({
      where: {
        id: req.params.userId
      },
      include: {
        relation: "roles"
      }
    }).then((user) => {
      return Role.find().then((roles) => {
        let userObj = user.toJSON();
        res.render('pages/user/single', {
          user: user,
          userRoles: userObj.roles.map((r) => {
            return r.id;
          }),
          roles: roles
        });
      })
    }, (err) => {
      res.sendStatus(404);
    })
  })

  // updates a single user
  app.post('/admin/user/:userId', (req, res) => {
    let ctx = req.getCurrentContext();
    if (!ctx.get('currentUserRoles').includes("admin"))
      return res.sendStatus(403);

    User.findOne({
      where: {
        id: req.params.userId
      },
      include: {
        relation: "roles"
      }
    }).then((user) => {
      return Promise.all([user.roles.find(), Role.find()]).then((resources) => {
        let roles = resources[1];

        let oldUserRoles = resources[0].map(r => r.id);
        let newUserRoles = req.body.role ? req.body.role.map(r => parseInt(r)) : [];
        let tasks = [];
        roles.forEach((role) => {
          if (oldUserRoles.includes(role.id) && !newUserRoles.includes(role.id)) {
            tasks.push(RoleMapping.findOne({
              where: {
                principalType: RoleMapping.USER,
                principalId: user.id,
                roleId: role.id
              }
            }).then((mapping) => {
              // console.log(mapping);
              return RoleMapping.destroyById(mapping.id)
            }));
          }
          if (!oldUserRoles.includes(role.id) && newUserRoles.includes(role.id)) {
            tasks.push(role.principals.create({
              principalType: RoleMapping.USER,
              principalId: user.id
            }));
          }
        })
        return Promise.all(tasks).then(() => {
          req.session.messages.push({
            type: 'success',
            text: 'Changes have been saved'
          });
          res.redirect(`/admin/user/${req.params.userId}`);
        })
      })
    }).catch((err) => {
      console.log(err);
      res.sendStatus(404);
    })
  })

  app.get('/admin/user/:userId/delete', (req, res) => {
    let ctx = req.getCurrentContext();
    if (!ctx.get('currentUserRoles').includes("admin"))
      return res.sendStatus(403);
    User.findOne({
      where: {
        id: req.params.userId
      }
    }).then((user) => {
      res.render('pages/user/delete', {
        user: user
      })
    }, (err) => {
      res.sendStatus(404);
    })
  })
  // deletes a single user
  app.post('/admin/user/:userId/delete', (req, res) => {
    let ctx = req.getCurrentContext();
    if (!ctx.get('currentUserRoles').includes("admin"))
      return res.sendStatus(403);

    User.findOne({
      where: {
        id: req.params.userId
      }
    }).then((user) => {
      if (req.body.deleteConfirmation) {
        User.destroyById(req.params.userId).then(() => {
          req.session.messages.push({
            type: 'success',
            text: 'User has been deleted'
          })
          res.redirect('/admin/users');
        })
      } else {
        req.session.messages.push({
          type: 'danger',
          text: 'You must press the button to confirm deletion'
        });
        res.redirect(`/admin/user/${ req.params.userId }/delete`);
      }
    }, (err) => {
      res.sendStatus(404);
    })
  })
}
