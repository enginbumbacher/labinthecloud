define((require) => {
  const DomView = require('core/view/dom_view'),
    Utils = require('core/util/utils'),
    d3 = require('d3'),
    Template = require('text!./circlegraph.html')
  ;
  require('link!./circlegraph.css');

  return class CircleHistogramView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onModelChange'])

      model.addEventListener('Model.Change', this._onModelChange);
      let svg = d3.select(this.$el.find('.circle-graph__graph').get(0)).append('svg');
      svg.attr('width', model.get('width') + model.get('margins.left') + model.get('margins.right'));
      svg.attr('height', model.get('height') + model.get('margins.top') + model.get('margins.bottom'));
      this.svg = svg.append('g');
      this.svg.attr('transform', `translate(${model.get('margins.left') + model.get('width') / 2},${model.get('margins.top') + model.get('height') / 2})`);
    }

    _onModelChange(evt) {
      switch (evt.data.path) {
        case "histogram":
          this.render(evt.currentTarget);
          break;
        case "data":
          this.setup(evt.currentTarget);
          break
      }
    }

    setup(model) {
      this.arc = d3.arc()
        .outerRadius((d) => (model.get('width') / 2) * (d.data.frequency / model.get('data.maxBinValue')))
        .innerRadius(0);
      this.pie = d3.pie()
        .value((d) => 1)
        .sort((a, b) => a.thetaStart - b.thetaStart);
    }

    render(model) {
      let bins = model.get('histogram');
      let data = this.svg.selectAll('.circle-graph__slice')
        .data(this.pie(bins));
      data.enter()
        .append('path')
        .attr('class', 'circle-graph__slice')
        .merge(data)
        .transition()
          .ease(d3.easeLinear)
          .attr('d', this.arc)
      data.exit().remove();

      let measureCount = bins.reduce((v, c) => v + c.frequency, 0)
      this.$el.find('.circle-graph__meta').html(`${measureCount} samples`);
    }
  }
})