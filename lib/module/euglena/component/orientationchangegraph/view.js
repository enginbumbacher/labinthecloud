define((require) => {
  const DomView = require('core/view/dom_view'),
    Utils = require('core/util/utils'),
    d3 = require('d3'),
    Template = require('text!./orientationchangegraph.html')
  ;
  require('link!./orientationchangegraph.css');

  return class OrientationChangeView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onModelChange']);

      model.addEventListener('Model.Change', this._onModelChange);

      this.svgs = {
        angleDiff: null
      }
      for (let key in this.svgs) {
        let svg = d3.select(this.$el.find('.orientation-change__graph').get(0)).append('svg');
        svg.classed(`orientation-change__graph__${key}`, true);
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
          if (evt.data.value) {
            this.reset();
            this.setup(evt.currentTarget);
          } else {
            this.reset();
          }
          break;
      }
    }

    setup(model) {
      this.scales.x.domain([0, Object.values(model.get('data')).reduce((acc, val) => Math.max(acc, val.runTime), 0)]);

      let maxValue = Object.values(model.get('data')).reduce((acc, val) => Math.max(acc, val.maxValue), 0);
      this.scales.y.domain([model.get('mode') == 'component' ? -maxValue : 0, maxValue]);
      this.axes = {
        x: d3.axisBottom().scale(this.scales.x),
        y: d3.axisLeft().scale(this.scales.y)
      };
      this.bgs = {};
      for (let key in this.svgs) {
        this.svgs[key].select('.orientation-change__graph__axis').remove();
        this.svgs[key].append('g')
          .attr('class', 'orientation-change__graph__axis orientation-change__graph__axis-x')
          .attr('transform', `translate(0, ${model.get('height')})`)
          .call(this.axes.x)
          .append('text')
            .attr('class', 'orientation-change__graph__axis-label')
            .text('Time [seconds]')
            .attr('x', model.get('width') / 2)
            .attr('y', 30);
        this.svgs[key].append('g')
          .attr('class', 'orientation-change__graph__axis orientation-change__graph__axis-y')
          .call(this.axes.y)
          .append('text')
            .attr('class', 'orientation-change__graph__axis-label')
            .text(`Avg Change in orientation per Second (${key}) [degrees / second]`)
            .attr('transform', 'rotate(-90)')
            .attr('y', -30)
            .attr('x', -model.get('height') / 2);

        this.bgs[key] = this.svgs[key].append('g')
          .attr('class', 'orientation-change__graph__background');

        for (let layer in model.get('data')) {
          if (!model.get(`data.${layer}.showLayer`)) {continue}
          let graphdata = model.get(`data.${layer}.graphs.${key}`).filter((item) => item.mean);
          let color = model.get(`data.${layer}.color`)
          if (model.get('stdBand')) {
            let std = d3.area()
              .x((d) => this.scales.x(d.time))
              .y0((d) => this.scales.y(d.mean - d.s))
              .y1((d) => this.scales.y(d.mean + d.s));
            this.svgs[key].append('path')
              .datum(graphdata)
              .attr('class', `orientation-change__graph__std orientation-change__graph__std__${layer}`)
              .attr('style', color ? `fill: #${color.toString(16)}` : null)
              .attr('d', std);
          }

          // Function to be used for plotting
          // It defines that it takes for each data point the time element and the mean and plots it in x,y.
          // .datum(graphdata): That's the data on which to apply the function.
          // .attr(): Characteristics of the svg.
          // .attr('d',line) is where the datum gets transformed into the line.
          let line = d3.line()
            .x((d) => this.scales.x(d.time))
            .y((d) => this.scales.y(d.mean))
          this.svgs[key].append('path')
            .datum(graphdata)
            .attr('class', `orientation-change__graph__line orientation-change__graph__line__${layer}`)
            .attr('style', color ? `stroke: #${color.toString(16)}` : null)
            .attr('d', line);
        }
      }
    }

    update(timestamp, model) {
      let runtime = Object.values(model.get('data')).reduce((acc, val) => Math.max(acc, val.runTime), 0);
      for (let key in this.svgs) {
        let timeband = this.bgs[key].selectAll('.orientation-change__graph__time-band')
          .data([timestamp])
        timeband.enter().append('rect')
          .attr('class', 'orientation-change__graph__time-band')
          .attr('y', 0)
          .attr('height', model.get('height'))
          .merge(timeband)
          .transition()
            .duration(0)
            .attr('x', (d) => this.scales.x(Math.min(runtime, Math.max(0, d - model.get('dT') / 2))))
            .attr('width', (d) => this.scales.x(model.get('dT') + Math.min(0, d - model.get('dT') / 2) + Math.min(0, runtime - d - model.get('dT') / 2)))
        timeband.exit().remove();
      }
    }

    reset() {
      for (let key in this.svgs) {
        this.svgs[key].selectAll('.orientation-change__graph__axis').remove();
        this.svgs[key].selectAll('.orientation-change__graph__time-band').remove();
        this.svgs[key].selectAll('.orientation-change__graph__std').remove();
        this.svgs[key].selectAll('.orientation-change__graph__line').remove();
      }
    }
  }
})
