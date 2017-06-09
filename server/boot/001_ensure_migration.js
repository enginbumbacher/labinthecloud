module.exports = function(app, cb) {
  app.dataSources.mysql.autoupdate(['Student', 'Experiment', 'Result', 'EuglenaModel', 'Log'], () => {
    process.nextTick(cb);
  });
}