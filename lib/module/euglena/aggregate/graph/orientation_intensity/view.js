import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import DomView from 'core/view/dom_view';
import Template from './graph.html';
import * as d3 from 'd3';

import './style.scss';

export default class OrientationIntensityGraphView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, ['_onModelChange'])

    let svg = d3.select(this.$el.find('.graph').get(0)).append('svg');
    svg.classed(model.get('graph_class'), true);
    svg.attr('width', '100%')
      // .attr('height', '100%')
      .attr('viewBox', `0 0 ${model.get('width') + model.get('margins.left') + model.get('margins.right')} ${model.get('height') + model.get('margins.top') + model.get('margins.bottom')}`)
      .attr('preserveAspectRatio', 'xMinYMin')
    this.svg = svg.append('g')
      .attr('transform', `translate(${model.get('margins.left')}, ${model.get('margins.top')})`);
    this.scales = {};
    this.scales.x = d3.scalePoint().range([0, model.get('width')]).padding(0.5);
    this.scales.y = d3.scaleLinear().range([model.get('height'), 0]);

    model.addEventListener('Model.Change', this._onModelChange);
  }

  _onModelChange(evt) {
    if (evt.data.path == "graph") {
      this.reset();
      this.render(evt.currentTarget);
    }
  }

  reset() {
    this.svg.selectAll('.orin__axis').remove();
    this.svg.selectAll('.orin__pt').remove();
  }

  render(model) {
    const histograms = model.get('graph.histograms')
    const columns = [];
    Object.values(histograms).forEach((hist) => {
      Object.keys(hist.data).forEach((key) => {
        if (!columns.includes(key)) columns.push(key)
      })
    })
    columns.sort((a,b) => (+a) - (+b));
    this.scales.x.domain(columns)
    this.scales.y.domain([-180, 180])
    this.axes = {
      x: d3.axisBottom().scale(this.scales.x),
      y: d3.axisLeft().scale(this.scales.y).tickValues([-180,-135,-90,-45,0,45,90,135,180])
    };
    this.svg.selectAll(`.orin__axis`).remove();
    this.svg.append('g')
      .attr('class', `orin__axis orin__axis-x`)
      .attr('transform', `translate(0, ${model.get('height')})`)
      .call(this.axes.x)
      .append('text')
        .attr('class', `orin__axis-label`)
        .text('Light Intensity')
        .attr('x', model.get('width') / 2)
        .attr('y', 30);
    this.svg.append('g')
      .attr('class', `orin__axis orin__axis-y`)
      .call(this.axes.y)
      .append('text')
        .attr('class', `orin__axis-label`)
        .text('Avg. Orientation WRT Light Direction')
        .attr('transform', 'rotate(-90)')
        .attr('y', -30)
        .attr('x', -model.get('height') / 2);

    let circle = d3.symbol()
      .size(20)

    Object.values(histograms).forEach((hist) => {
      for (let key in hist.data) {
        this.svg.append('path')
          .attr('d', circle)
          .attr('class', `orin__pt orin__pt__${hist.id}`)
          .attr('fill', hist.color)
          .attr('transform', `translate(${this.scales.x(key)}, ${this.scales.y(hist.data[key].value)})`)
          .style('opacity', 0.95)
      }
    })
  }

  toggleResult(resId, shown) {
    this.svg.selectAll(`.orin__pt__${resId}`).style("opacity", shown ? 0.75 : 0)
  }
}
