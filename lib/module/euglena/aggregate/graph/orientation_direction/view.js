define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager')
  
  const DomView = require('core/view/dom_view'),
    Template = require('text!./graph.html'),
    d3 = require('d3');

  require('link!./style.css');

  return class OrientationIntensityGraphView extends DomView {
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
      this.scales.x = d3.scaleLinear().range([0, model.get('width')]).domain([-180, 180]);
      this.scales.y = d3.scaleLinear().range([model.get('height'), 0]).domain([-180, 180]);
      this.axes = {
        x: d3.axisBottom().scale(this.scales.x),
        y: d3.axisLeft().scale(this.scales.y)
      };
      this.svg.append('g')
        .attr('class', `ordir__axis ordir__axis-x`)
        .attr('transform', `translate(0, ${model.get('height')})`)
        .call(this.axes.x)
        .append('text')
          .attr('class', `ordir__axis-label`)
          .text('Light Direction')
          .attr('x', model.get('width') / 2)
          .attr('y', 30);
      this.svg.append('g')
        .attr('class', `ordir__axis ordir__axis-y`)
        .call(this.axes.y)
        .append('text')
          .attr('class', `ordir__axis-label`)
          .text('Avg. Orientation WRT Light Direction')
          .attr('transform', 'rotate(-90)')
          .attr('y', -30)
          .attr('x', -model.get('height') / 2);

      model.addEventListener('Model.Change', this._onModelChange);
    }

    _onModelChange(evt) {
      if (evt.data.path == "graph") {
        this.reset();
        this.render(evt.currentTarget);
      }
    }

    reset() {
      this.svg.selectAll('.ordir__pt').remove();
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

      let circle = d3.symbol()
        .size(20)

      histograms.forEach((hist) => {
        Object.values(hist.data).forEach((hd) => {
          this.svg.append('path')
            .attr('d', circle)
            .attr('class', `ordir__pt ordir__pt__${hist.id}`)
            .attr('fill', hist.color)
            .attr('transform', `translate(${this.scales.x(hd.angle * 180 / Math.PI)}, ${this.scales.y(hd.value)})`)
            .style('opacity', 0.95)
        })
      })
    }

    toggleResult(resId, shown) {
      this.svg.selectAll(`.ordir__pt__${resId}`).style("opacity", shown ? 0.75 : 0)
    }
  }
});