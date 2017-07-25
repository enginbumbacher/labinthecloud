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
          last_login_lab: lab
        }, function(err, student) {
          cb(null, student.id, student.source_id)
        })
      } else {
        student.updateAttribute('last_login', new Date());
        student.updateAttribute('last_login_lab', lab || null);
        cb(null, student.id, student.source_id)
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
    }]
  })
};
