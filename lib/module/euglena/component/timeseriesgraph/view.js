import DomView from 'core/view/dom_view';
import Utils from 'core/util/utils';
import * as d3 from 'd3';
import Template from './timeseriesgraph.html';
import './timeseriesgraph.scss';

export default class TimeSeriesView extends DomView {
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
      this.svgs[key].selectAll('*').remove();

      this.svgs[key].select('.time-series__graph__axis').remove();
      this.svgs[key].append('g')
        .attr('class', 'time-series__graph__axis time-series__graph__axis-x')
        .attr('transform', `translate(0, ${model.get('height')})`)
        .call(this.axes.x)
        .append('text')
          .attr('class', 'time-series__graph__axis-label')
          .text('Time [seconds]')
          .attr('x', model.get('width') / 2)
          .attr('y', 30);
      this.svgs[key].append('g')
        .attr('class', 'time-series__graph__axis time-series__graph__axis-y')
        .call(this.axes.y)
        .append('text')
          .attr('class', 'time-series__graph__axis-label')
          .text(`Avg Speed [micrometers / second]`)
          .attr('transform', 'rotate(-90)')
          .attr('y', -30)
          .attr('x', -model.get('height') / 2);

      this.svgs[key].append('g')
        .append('text')
          .attr('class', 'component-speed__graph__title')
          .text('Average forward speed (distance covered per second)')
          .attr('y', -10)
          .attr('x', model.get('width') / 2);

      this.bgs[key] = this.svgs[key].append('g')
        .attr('class', 'time-series__graph__background');

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
            .attr('class', `time-series__graph__std time-series__graph__std__${layer}`)
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
          .attr('class', `time-series__graph__line time-series__graph__line__${layer}`)
          .attr('style', color ? `stroke: #${color.toString(16)}` : null)
          .attr('d', line);
      }

      // Draw the lines at the different time intervals.
      if (model.get('lightConfig') && Object.keys(model.get('data')).length) {

        this.svgs[key].append("svg:defs")
         	.append("svg:marker")
         	.attr("id", `arrow__light`)
         	.attr("refX", 0)
         	.attr("refY", 2)
         	.attr("markerWidth", 4)
         	.attr("markerHeight", 4)
         	.attr("orient", "auto")
         	.append("svg:path")
         	.attr("d", "M0,0 L0,4 L4,2 z")
           .style('fill','rgb(235,160,17)');

        var expDuration = model.get('lightConfig').reduce((acc,curr) => Math.max(acc,curr.timeEnd),0);

        for (let config of model.get('lightConfig')) {
          if (config.timeStart != 0) {
            this.svgs[key].append("line")
              .attr('class', 'component-speed__graph__light-time')
              .attr("x1", config.timeStart * model.get('width') / expDuration)
              .attr("y1", model.get('height'))
              .attr("x2", config.timeStart * model.get('width') / expDuration)
              .attr("y2",0)
              .attr("stroke-width",2)
          }
          if (config.lightDir[0] != 0 || config.lightDir[1] != 0) {
            this.svgs[key].append("line")
                .attr('class', 'component-speed__graph__light-arrow')
                .attr("x1",(config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration + 20)
                .attr("y1", 10)
                .attr("x2",(config.timeEnd + config.timeStart) / 2  * model.get('width') / expDuration + 10 * config.lightDir[0] + 20)
                .attr("y2", 10 + 10 * config.lightDir[1])
                .attr("stroke-width",2)
                .attr("marker-end",`url(#arrow__light)`)
            //var lightValue = config.left!=0? config.left: (config.right!=0? config.right : (config.top!=0? : config.top : (config.bottom!=0? config.bottom : 0)));
            var lightValue = Math.sqrt(Math.pow(config.left,2) + Math.pow(config.right,2) + Math.pow(config.top,2) + Math.pow(config.bottom,2));
            lightValue = Math.round(lightValue);
            this.svgs[key].append('g')
              .append('text')
              .attr('class', 'component-speed__graph__light-label')
              .text(`${lightValue}% in `)
              .attr('y', 15)
              .attr('x', (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration - 20);

          } else if (config.left != 0 && config.right != 0 && config.top != 0 && config.bottom != 0){
            this.svgs[key].append('g')
              .append('text')
              .attr('class', 'component-speed__graph__light-label')
              .text(`${config.left}% from all dir.`)
              .attr('y', 15)
              .attr('x', (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration);
          } else if (config.left != 0 && config.right != 0 && config.top == 0 && config.bottom == 0){
            this.svgs[key].append('g')
              .append('text')
              .attr('class', 'component-speed__graph__light-label')
              .text(`${config.left}% from left-right`)
              .attr('y', 15)
              .attr('x', (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration);
          } else if (config.left == 0 && config.right == 0 && config.top != 0 && config.bottom != 0){
            this.svgs[key].append('g')
              .append('text')
              .attr('class', 'component-speed__graph__light-label')
              .text(`${config.top}% from top-bottom`)
              .attr('y', 15)
              .attr('x', (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration);
          } else {
            this.svgs[key].append('g')
              .append('text')
              .attr('class', 'component-speed__graph__light-label')
              .text("no light")
              .attr('y', 15)
              .attr('x', (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration);
          }
        }
      }

    }
  }

  update(timestamp, model) {
    let runtime = Object.values(model.get('data')).reduce((acc, val) => Math.max(acc, val.runTime), 0);
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
          .attr('x', (d) => this.scales.x(Math.min(runtime, Math.max(0, d - model.get('dT') / 2))))
          .attr('width', (d) => this.scales.x(model.get('dT') + Math.min(0, d - model.get('dT') / 2) + Math.min(0, runtime - d - model.get('dT') / 2)))
      timeband.exit().remove();
    }
  }

  reset() {
    for (let key in this.svgs) {
      this.svgs[key].selectAll('.time-series__graph__axis').remove();
      this.svgs[key].selectAll('.time-series__graph__time-band').remove();
      this.svgs[key].selectAll('.time-series__graph__std').remove();
      this.svgs[key].selectAll('.time-series__graph__line').remove();
    }
  }
}
