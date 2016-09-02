define((require) => {
  const DomView = require('core/view/dom_view'),
    Utils = require('core/util/utils'),
    d3 = require('d3'),
    Template = require('text!./timeseriesgraph.html')
  ;
  require('link!./timeseriesgraph.css');

  return class TimeSeriesView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onModelChange']);

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
        let svg = d3.select(this.$el.find('.time-series__graph').get(0)).append('svg');
        svg.classed(`time-series__graph__${key}`, true);
        svg.attr('width', model.get('width') + model.get('margins.left') + model.get('margins.right'));
        svg.attr('height', model.get('height') + model.get('margins.top') + model.get('margins.bottom'));
        this.svgs[key] = svg.append('g')
          .attr('transform', `translate(${model.get('margins.left')}, ${model.get('margins.top')})`);
      }
      this.scales = {};
      this.scales.x = d3.scaleLinear().range([0, model.get('width')]);
      this.scales.y = d3.scaleLinear().range([model.get('height'), 0]);
    }

    _onModelChange(evt) {
      switch (evt.data.path) {
        case "data":
          this.setup(evt.currentTarget);
          break;
      }
    }

    setup(model) {
      this.scales.x.domain([0, model.get('data.runTime')]);

      this.scales.y.domain([model.get('mode') == 'component' ? -model.get('data.maxValue') : 0, model.get('data.maxValue')]);
      this.axes = {
        x: d3.axisBottom().scale(this.scales.x),
        y: d3.axisLeft().scale(this.scales.y)
      };
      this.bgs = {};
      for (let key in this.svgs) {
        this.svgs[key].select('.time-series__graph__axis').remove();
        this.svgs[key].append('g')
          .attr('class', 'time-series__graph__axis time-series__graph__axis-x')
          .attr('transform', `translate(0, ${model.get('height')})`)
          .call(this.axes.x);
        this.svgs[key].append('g')
          .attr('class', 'time-series__graph__axis time-series__graph__axis-y')
          .call(this.axes.y);

        this.bgs[key] = this.svgs[key].append('g')
          .attr('class', 'time-series__graph__background');

        let graphdata = model.get(`data.graphs.${key}`).filter((item) => item.mean);

        if (model.get('stdBand')) {
          let std = d3.area()
            .x((d) => this.scales.x(d.time))
            .y0((d) => this.scales.y(d.mean - d.s))
            .y1((d) => this.scales.y(d.mean + d.s));
          this.svgs[key].append('path')
            .datum(graphdata)
            .attr('class', 'time-series__graph__std')
            .attr('d', std);
        }

        let line = d3.line()
          .x((d) => this.scales.x(d.time))
          .y((d) => this.scales.y(d.mean))
        this.svgs[key].append('path')
          .datum(graphdata)
          .attr('class', 'time-series__graph__line')
          .attr('d', line);
      }
    }

    update(timestamp, model) {
      for (let key in this.svgs) {
        let timeband = this.bgs[key].selectAll('.time-series__graph__time-band')
          .data([timestamp])
        timeband.enter().append('rect')
          .attr('class', 'time-series__graph__time-band')
          .attr('y', 0)
          .attr('height', model.get('height'))
          .merge(timeband)
          .transition()
            .duration(0)
            .attr('x', (d) => this.scales.x(Math.min(model.get('data.runTime'), Math.max(0, d - model.get('dT') / 2))))
            .attr('width', (d) => this.scales.x(model.get('dT') + Math.min(0, d - model.get('dT') / 2) + Math.min(0, model.get('data.runTime') - d - model.get('dT') / 2)))
        timeband.exit().remove();
      }
    }
  }
})