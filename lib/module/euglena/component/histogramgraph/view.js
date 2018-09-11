import DomView from 'core/view/dom_view';
import Utils from 'core/util/utils';
import * as d3 from 'd3';
import Template from './histogramgraph.html';
import './histogramgraph.scss';

export default class HistogramView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, ['_onModelChange'])

    model.addEventListener('Model.Change', this._onModelChange);

    if (model.get('mode') == "component") {
      this.svgs = {
        x: null,
        y: null
      }
    } else {
      this.svgs = {
        total: null
      }
    }
    for (let key in this.svgs) {
      let svg = d3.select(this.$el.find('.histogram__graph').get(0)).append('svg');
      svg.classed(`histogram__graph__${key}`, true);
      svg.attr('width', model.get('width') + model.get('margins.left') + model.get('margins.right'));
      svg.attr('height', model.get('height') + model.get('margins.top') + model.get('margins.bottom'));
      this.svgs[key] = svg.append('g')
        .attr('transform', `translate(${model.get('margins.left')}, ${model.get('margins.top')})`);
    }
    this.scales = {};
    this.scales.x = d3.scaleBand().range([0, model.get('width')]).padding(0.1);
    this.scales.y = d3.scaleLinear().range([model.get('height'), 0]);
  }

  _onModelChange(evt) {
    if (evt.data.path == 'data') {
      this.setup(evt.currentTarget);
    } else if (evt.data.path.match(/^histogram/)) {
      this.render(evt.currentTarget);
    }
  }

  setup(model) {
    if (Object.values(model.get('data')).length) {
      this.reset();
      let binSample = Object.values(model.get('data'))[0].intervals[0].bins;
      if (model.get('mode') == 'component') {
        binSample = binSample.x;
      } else {
        binSample = binSample.total;
      }
      this.scales.x.domain(binSample.map((d) => Math.round((d.vStart + d.vEnd) / 2)));
      // this.scales.y.domain([0, Object.values(model.get('data')).reduce((acc, val) => Math.max(acc, val.maxBinValue), 0)]);
      this.scales.y.domain([0,100]);
      this.axes = {
        x: d3.axisBottom().scale(this.scales.x),
        y: d3.axisLeft().scale(this.scales.y).ticks(5)
      };
      for (let key in this.svgs) {
        this.svgs[key].select('.histogram__graph__axis').remove();
        this.svgs[key].append('g')
          .attr('class', 'histogram__graph__axis histogram__graph__axis-x')
          .attr('transform', `translate(0, ${model.get('height')})`)
          .call(this.axes.x)
          .append('text')
            .attr('class', 'histogram__graph__axis-label')
            .text(`Speed (${key})`)
            .attr('x', model.get('width') / 2)
            .attr('y', 30);
        this.svgs[key].append('g')
          .attr('class', 'histogram__graph__axis histogram__graph__axis-y')
          .call(this.axes.y)
          .append('text')
            .attr('class', 'histogram__graph__axis-label')
            .text('Frequency (% total)')
            .attr('y', -30)
            .attr('x', -model.get('height') / 2)
            .attr('transform', 'rotate(-90)');
      }
    } else {
      this.reset()
    }
  }

  render(model) {
    let measureCount = 0;
    for (let layer in model.get('histogram')) {
      if (!model.get(`data.${layer}.showLayer`)) {continue}
      for (let key in model.get(`histogram.${layer}`)) {
        let bins = model.get(`histogram.${layer}.${key}`);
        let data = this.svgs[key].selectAll(`.histogram__bar__${layer}`)
          .data(bins);
        let color = model.get(`data.${layer}.color`)
        data.enter()
          .append('rect')
          .attr('class', `histogram__bar histogram__bar__${layer}`)
          .attr('x', (d, i) => this.scales.x(Math.round((d.vStart + d.vEnd) / 2)))
          .attr('width', this.scales.x.bandwidth())
          .attr('y', this.scales.y(0))
          .attr('style', color ? `fill: #${color.toString(16)}` : null)
          .merge(data)
          .transition()
            .ease(d3.easeLinear)
            .attr('y', (d) => this.scales.y(d.value * 100))
            .attr('height', (d) => model.get('height') - this.scales.y(d.value * 100));
        data.exit().remove();
        measureCount = bins.reduce((v, c) => v + c.frequency, 0);
      }
      this.$el.find(`.histogram__meta__${layer}`).html(`${measureCount} samples`);
    }
  }

  reset() {
    for (let key in this.svgs) {
      this.svgs[key].selectAll('.histogram__graph__axis').remove();
      this.svgs[key].selectAll('.histogram__bar').remove();
    }
    this.$el.find(".histogram__meta span").html('');
  }
}
