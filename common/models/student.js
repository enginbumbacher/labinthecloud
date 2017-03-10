'use strict';

module.exports = function(Student) {
  Student.login = function(source_id, source, cb) {
    Student.findOne({
      where: {
        source_id: source_id,
        source: source
      }
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        Student.create({
          source_id: source_id,
          source: source
        }, function(err, user) {
          cb(null, user.id, user.source_id)
        })
      } else {
        cb(null, user.id, user.source_id)
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
    }],
    returns: [{
      'arg': 'user_id',
      'type': 'number'
    }, {
      'arg': 'source_id',
      'type': 'string'
    }]
  })
};
