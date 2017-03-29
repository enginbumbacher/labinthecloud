module.exports = function(app) {
  app.dataSources.mysql.autoupdate(['Student', 'Experiment', 'Result']);
}