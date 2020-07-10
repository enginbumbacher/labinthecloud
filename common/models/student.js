'use strict';

module.exports = function(Student) {
  Student.login = function(source_id, source, lab, studentGroup, cb) {
    let StudentGroup = Student.app.models.StudentGroup;
    let Lab = Student.app.models.Lab;

    let prom = null;
    if (studentGroup == '_editor') {
      prom = Promise.resolve(source_id);
    } else {
      prom = Promise.all([
        StudentGroup.find({
          where: {
            uuid: studentGroup
          },
          include: {
            relation: 'labs',
            scope: {
              fields: ['id']
            }
          }
        }),
        Lab.findOne({ where: { uuid: lab }})
      ]).then((meta) => {
        if (meta[0].length == 0) {
          throw new Error('Project not found');
          return;
        }
        let group = meta[0][0];
        let labObj = meta[1];
        let groupLabs = group.toJSON().labs.map((l) => l.id);

        if (!groupLabs.includes(labObj.id)) {
          throw new Error('This lab is not assigned to this Project');
          return;
        }

        let allowed = true;
        if (group.access && group.access.length) {
          allowed = group.access.includes(source_id);
        }
        if (!allowed) {
          throw new Error('Access denied');
          return;
        }

        let login = source_id
        if (source == 'webapp' && source_id.indexOf('@') < 0) {
          login = `${ source_id }@${ studentGroup }`;
        }
        return login;
      })
    }
    prom.then((login) => {
      Student.findOne({
        where: {
          source_id: login,
          source: source
        }
      }, function(err, student) {
        if (err) throw err;

        if (!student) {
          Student.create({
            source_id: login,
            source: source,
            last_login: (new Date()),
            last_login_lab: lab,
            disabled_login: false
          }, function(err, student) {
            cb(null, student.id, student.source_id, student.last_login, student.disabled_login)
          })
        } else {
          student.updateAttribute('last_login', new Date());
          student.updateAttribute('last_login_lab', lab || null);
          cb(null, student.id, student.source_id, student.last_login, student.disabled_login)
        }
      })
    }).catch((err) => {
      return cb(err);
    })
  };

  Student.remoteMethod('login', {
    accepts: [{
      arg: 'source_id',
      type: 'string'
    }, {
      arg: 'source',
      type: 'string'
    }, {
      arg: 'lab',
      type: 'string'
    }, {
      arg: 'studentGroup',
      type: 'string'
    }],
    returns: [{
      'arg': 'student_id',
      'type': 'number'
    }, {
      'arg': 'source_id',
      'type': 'string'
    }, {
      'arg': 'last_login',
      'type': 'date'
    },{
      'arg': 'disabled_login',
      'type': 'string'
    }]
  });

  Student.logout = function(source_id, student_id, disabled_login, cb) {

    Student.findOne({
      where: {
        source_id: source_id,
        id: student_id
      }
    }, function(err, student) {
      if (err) throw err;

      if (student) {

        if (student.disabled_login ? (disabled_login == 'false' ? 0 : 1) : 1) {
          student.updateAttribute('disabled_login', disabled_login);
        }
        cb(null, student.id, student.source_id, student.disabled_login)
      }
    })
  };

  Student.remoteMethod('logout', {
    accepts: [{
      arg: 'source_id',
      type: 'string'
    }, {
      arg: 'student_id',
      type: 'number'
    }, {
      arg: 'disabled_login',
      type: 'string'
    }],
    returns: [{
      'arg': 'student_id',
      'type': 'number'
    }, {
      'arg': 'source_id',
      'type': 'string'
    }, {
      'arg': 'disabled_login',
      'type': 'string'
    }]
  })
};
