'use strict';

module.exports = function(Experiment) {
  Experiment.observe('before save', function(ctx, cb) {
    ctx.instance.configuration.forEach(function(cfg) {
      ['top', 'bottom', 'left', 'right', 'duration'].forEach(function(key) {
        cfg[key] = parseFloat(cfg[key]);
      });
    })
    cb();
  })
  Experiment.observe('loaded', function(ctx, cb) {
    let numericCfg;
    let baseType = 'string';
    if (typeof ctx.data.configuration == "string") {
      numericCfg = JSON.parse(ctx.data.configuration);
    } else {
      baseType = 'object';
      numericCfg = ctx.data.configuration;
    }
    numericCfg.forEach(function(cfg) {
      ['top', 'bottom', 'left', 'right', 'duration'].forEach(function(key) {
        cfg[key] = parseFloat(cfg[key]);
      });
    });
    if (baseType == 'string') {
      ctx.data.configuration = JSON.stringify(numericCfg);
    } else {
      ctx.data.configuration = numericCfg;
    }
    cb();
  });
};
