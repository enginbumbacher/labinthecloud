module.exports = {
  up: function(app, next) {
    app.dataSources.mysql.connector.query('CREATE TABLE `Migration` (\
  `id` int(11) NOT NULL AUTO_INCREMENT,\
  `name` varchar(512) COLLATE utf8_unicode_ci NOT NULL,\
  `runDtTm` datetime NOT NULL,\
  PRIMARY KEY (`id`)\
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;', next);
  },
  down: function(app, next) {
    app.dataSources.mysql.connector.query('DROP TABLE `Migration`;', next);
  }
}

