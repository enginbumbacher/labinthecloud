define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager')
  
  const AggregateTimeGraph = require('euglena/aggregate/graph/time/graph'),
    Model = require('./model');

  class VelocityTimeGraph extends AggregateTimeGraph {
    constructor(settings) {
      settings.modelClass = settings.modelClass || Model;
      super(settings);
    }
  }

  VelocityTimeGraph.create = (data) => {
    return new VelocityTimeGraph({ modelData: data })
  }

  return VelocityTimeGraph;
})