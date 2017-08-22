'use strict';

module.exports = function(Student) {
  Student.login = function(source_id, source, lab, cb) {
    Student.findOne({
      where: {
        source_id: source_id,
        source: source
      }
    }, function(err, student) {
      if (err) throw err;

      if (!student) {
        Student.create({
          source_id: source_id,
          source: source,
          last_login: (new Date()),
          last_login_lab: lab,
          disabled_login: false
        }, function(err, student) {
          cb(null, student.id, student.source_id, student.disabled_login)
        })
      } else {
        student.updateAttribute('last_login', new Date());
        student.updateAttribute('last_login_lab', lab || null);
        cb(null, student.id, student.source_id, student.disabled_login)
      }
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
    }],
    returns: [{
      'arg': 'student_id',
      'type': 'number'
    }, {
      'arg': 'source_id',
      'type': 'string'
    }, {
      'arg': 'disabled_login',
      'type': 'boolean'
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

      if (!student) {
        console.log('we have a problem');
      } else {
        console.log(student);
        student.updateAttribute('disabled_login', disabled_login);
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
      'type': 'boolean'
    }]
  })
};
