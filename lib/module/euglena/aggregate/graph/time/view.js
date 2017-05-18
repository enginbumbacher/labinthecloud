define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager')
  
  const DomView = require('core/view/dom_view'),
    Template = require('text!./graph.html'),
    LightGrid = require('euglena/aggregate/graph/lightgrid/grid'),
    d3 = require('d3');

  require('link!./style.css');

  return class AggregateTimeGraphView extends DomView {
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
      this.scales.x = d3.scaleLinear().range([0, model.get('width')]);
      this.scales.y = d3.scaleLinear().range([model.get('height'), 0]);

      this.grid = LightGrid.create();
      this.addChild(this.grid.view(), '.timegraph__lightgrid')

      model.addEventListener('Model.Change', this._onModelChange)
    }

    _onModelChange(evt) {
      if (evt.data.path == 'graph') {
        this.reset(evt.currentTarget)
        if (evt.data.value) {
          this.render(evt.currentTarget)
        }
      }
    }

    reset(model) {
      this.svg.selectAll(`.aggregate_time__line`).remove()
      this.grid.reset();
    }

    render(model) {
      this.grid.update(model.get('graph.lights'));

      this.scales.x.domain([0, model.get('graph.runTime')]);

      const maxValue = Math.max(Math.abs(model.get('graph.minValue')), Math.abs(model.get('graph.maxValue')))
      this.scales.y.domain([model.get('graph.minValue') < 0 ? -maxValue : 0, maxValue]);
      this.axes = {
        x: d3.axisBottom().scale(this.scales.x),
        y: d3.axisLeft().scale(this.scales.y)
      };

      this.svg.selectAll(`.aggregate_time__axis`).remove();
      this.svg.append('g')
        .attr('class', `aggregate_time__axis aggregate_time__axis-x`)
        .attr('transform', `translate(0, ${model.get('height')})`)
        .call(this.axes.x)
        .append('text')
          .attr('class', `aggregate_time__axis-label`)
          .text('Time')
          .attr('x', model.get('width') / 2)
          .attr('y', 30);
      this.svg.append('g')
        .attr('class', `aggregate_time__axis aggregate_time__axis-y`)
        .call(this.axes.y)
        .append('text')
          .attr('class', `aggregate_time__axis-label`)
          .text(model.get('axis_label'))
          .attr('transform', 'rotate(-90)')
          .attr('y', -30)
          .attr('x', -model.get('height') / 2);

      for (let lineId in model.get('graph.lines')) {
        let ldata = model.get(`graph.lines.${lineId}.data`)
        let line = d3.line()
          .x((d) => this.scales.x(d.time))
          .y((d) => this.scales.y(d.value))
        this.svg.append('path')
          .datum(ldata)
          .attr('class', `aggregate_time__line aggregate_time__line__${lineId}`)
          .attr('d', line)
          .style('stroke', model.get(`graph.lines.${lineId}.color`));
      }
    }

    toggleResult(resId, shown) {
      this.svg.selectAll(`.aggregate_time__line__${resId}`).style("opacity", shown ? 1 : 0)
    }
  }
})