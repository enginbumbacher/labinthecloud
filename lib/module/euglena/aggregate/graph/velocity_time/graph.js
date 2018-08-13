import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import AggregateTimeGraph from 'euglena/aggregate/graph/time/graph';
import Model from './model';

class VelocityTimeGraph extends AggregateTimeGraph {
  constructor(settings) {
    settings.modelClass = settings.modelClass || Model;
    super(settings);
  }
}

VelocityTimeGraph.create = (data) => {
  return new VelocityTimeGraph({ modelData: data })
}

export default VelocityTimeGraph;
