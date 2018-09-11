module.exports = function(app, cb) {
  app.dataSources.mysql.autoupdate([
    'Student',
    'Experiment',
    'Result',
    'EuglenaModel',
    'Log',
    'User',
    'LabUser',
    'AccessToken',
    'ACL',
    'RoleMapping',
    'Role',
    'Lab'
  ], () => {
    process.nextTick(cb);
  });
}