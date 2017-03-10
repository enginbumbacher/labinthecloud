module.exports = {
  up: function(app, next) {
    app.dataSources.mysql.connector.query('CREATE TABLE `Student` ( \
        `id` int(11) NOT NULL AUTO_INCREMENT, \
        `source` varchar(512) COLLATE utf8_unicode_ci NOT NULL, \
        `source_id` varchar(512) COLLATE utf8_unicode_ci NOT NULL, \
        PRIMARY KEY (`id`) \
      ) CHARSET=utf8 COLLATE=utf8_unicode_ci;', next);
  },
  down: function(app, next) {
    app.dataSources.mysql.connector.query('DROP TABLE `Student`;', next);
  }
}