module.exports = function(app, cb) {
  app.dataSources.mysql.autoupdate(['Student', 'Experiment', 'Result', 'EuglenaModel'], () => {
    process.nextTick(cb);
  });
}