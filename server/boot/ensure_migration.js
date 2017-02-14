module.exports = function(app) {
  // app.dataSources.mysql.autoupdate(['Migration', 'MigrationMap']);
  app.models.Migration.migrate('up').then(function(status) {
    console.log('Migration success');
  }).catch(function(err) {
    console.log('Migration failure');
  })
}