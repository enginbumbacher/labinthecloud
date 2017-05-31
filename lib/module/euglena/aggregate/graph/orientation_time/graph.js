define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager')
  
  const AggregateTimeGraph = require('euglena/aggregate/graph/time/graph'),
    Model = require('./model');

  class OrientationTimeGraph extends AggregateTimeGraph {
    constructor(settings) {
      settings.modelClass = settings.modelClass || Model;
      super(settings);
    }
  }

  OrientationTimeGraph.create = (data) => {
    return new OrientationTimeGraph({ modelData: data })
  }

  return OrientationTimeGraph;
})