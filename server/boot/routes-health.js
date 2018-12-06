'use strict';

module.exports = (app) => {
  app.get('/healthcheck', (req, res) => {
    res.json({ status: "UP" });
  });
}
