import DomView from 'core/view/dom_view';
import Utils from 'core/util/utils';
import * as d3 from 'd3';
import Template from './circlegraph.html';
import LightDisplay from 'euglena/component/lightdisplay/lightdisplay';
import './circlegraph.scss';

export default class CircleHistogramView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, ['_onModelChange'])
    this._lightDisplay = LightDisplay.create({
      width: model.get('width') + model.get('margins.left') + model.get('margins.right'),
      height: model.get('height') + model.get('margins.top') + model.get('margins.bottom')
    });
    this._lightDisplay.render({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    });
    this.addChild(this._lightDisplay.view(), ".circle-graph__lights");

    model.addEventListener('Model.Change', this._onModelChange);
    let svg = d3.select(this.$el.find('.circle-graph__graph').get(0)).append('svg');
    svg.attr('width', model.get('width') + model.get('margins.left') + model.get('margins.right'));
    svg.attr('height', model.get('height') + model.get('margins.top') + model.get('margins.bottom'));
    this.svg = svg.append('g');
    this.svg.attr('transform', `translate(${model.get('margins.left') + model.get('width') / 2},${model.get('margins.top') + model.get('height') / 2})`);
  }

  _onModelChange(evt) {
    if (evt.data.path.match(/^histogram/)) {
      this.render(evt.currentTarget);
    } else if (evt.data.path == "lights") {
      this._lightDisplay.render(evt.data.value);
    } else if (evt.data.path.match(/^data/)) {
      if (evt.currentTarget.get('data') == {}) {
        this.reset();
      } else {
        this.reset();
        this.setup(evt.currentTarget);
      }
    }
  }

  setup(model) {
    let w = model.get('width');
    this.arcs = this.arcs || {};
    for (let layer in model.get('data')) {
      let mbv = model.get(`data.${layer}.maxBinValue`)
      this.arcs[layer] = d3.arc()
        .outerRadius((d) => {
          return Math.max(0.1, w * d.data.frequency / (2 * mbv))
        })
        .innerRadius(0);
    }
    this.pie = d3.pie()
      .value((d) => 1)
      .sort((a, b) => b.thetaStart - a.thetaStart);

  }

  render(model) {
    for (let layer in model.get('histogram')) {
      if (!model.get(`data.${layer}.showLayer`)) {continue}
      let bins = model.get(`histogram.${layer}`);
      let data = this.svg.selectAll(`.circle-graph__slice__${layer}`)
        .data(this.pie(bins));
      let color = model.get(`data.${layer}.color`)
      data.enter()
        .append('path')
        .attr('style', color ? `fill: #${color.toString(16)}` : null)
        .attr('class', `circle-graph__slice circle-graph__slice__${layer}`)
        .attr('transform', 'rotate(90)')
        .merge(data)
        .transition()
          .ease((t) => t)
          .duration(model.get('tStep') * 500)
          .attr('d', this.arcs[layer])
      data.exit().remove();

     let measureCount = bins.reduce((v, c) => v + c.frequency, 0)
      //this.$el.find(`.circle-graph__meta__${layer}`).html(`${measureCount} samples`);
      this.$el.find(`.circle-graph__meta`).html('The size of each slice shows the proportion of all Euglena moving in the corresponding direction.');

    }
  }

  reset() {
    this.svg.selectAll('.circle-graph__slice').remove()
    this.$el.find(".circle-graph__meta span").html('');
    this._lightDisplay.render({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    })
  }
}
