define((require) => {
  const DomView = require('core/view/dom_view'),
    Utils = require('core/util/utils'),
    d3 = require('d3'),
    Template = require('text!./componentspeedgraph.html')
  ;
  require('link!./componentspeedgraph.css');

  const componentMap = {
    x: {
      title: 'left/right',
      labels: ['right','left'],
      color: 'rgb(55,152,195)',
      right: {'x1':55, 'x2': 75, 'y1': 35, 'y2': 35, 'xlabel': 75, 'ylabel': 30},
      left: {'x1':45, 'x2': 25, 'y1': 35, 'y2': 35, 'xlabel': 25, 'ylabel': 30}
    },
    y: {
      title: 'up/down',
      labels: ['up','down'],
      color: 'rgb(55,143,48)',
      up: {'x1':50, 'x2': 50, 'y1': 30, 'y2': 10, 'xlabel': 40, 'ylabel': 15},
      down: {'x1':50, 'x2': 50, 'y1': 40, 'y2': 60, 'xlabel': 35, 'ylabel': 55}
    }
  }
  return class ComponentSpeedView extends DomView {
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
        let svg = d3.select(this.$el.find('.component-speed__graph').get(0)).append('svg');
        svg.classed(`component-speed__graph__${key}`, true);
        svg.attr('width', model.get('width') + model.get('margins.left') + model.get('margins.right'));
        svg.attr('height', model.get('height') + model.get('margins.top') + model.get('margins.bottom'));
        this.svgs[key] = svg.append('g')
          .attr('transform', `translate(${model.get('margins.left')}, ${model.get('margins.top')})`);
      }
      this.scales = {};
      this.scales.x = d3.scaleLinear().range([0, model.get('width')]);
      this.scales.y = d3.scaleLinear().range([model.get('height'), 0]);

      let svg = d3.select(this.$el.find('.component-speed__graph__image').get(0)).append('svg');
      svg.attr('width', 100)
      .attr('height', 70)

      // Draw visualization to illustrate the meaning
      svg.append('ellipse')
        .attr("cx",0)
        .attr("cy",0)
        .attr("rx",16)
        .attr("ry",8)
        .attr('transform', 'translate(50,35)rotate(-45)')
        .attr('fill','black')

      for (let key in this.svgs) {
        svg.append("svg:defs")
           .append("svg:marker")
           .attr("id", `arrow__image__${key}`)
           .attr("refX", 0)
        	.attr("refY", 2)
        	.attr("markerWidth", 4)
        	.attr("markerHeight", 4)
        	.attr("orient", "auto")
        	.append("svg:path")
        	.attr("d", "M0,0 L0,4 L4,2 z")
           .style('fill',componentMap[key].color);

       svg.append("line")
         .attr("x1",componentMap[key][componentMap[key].labels[0]].x1)
         .attr("y1",componentMap[key][componentMap[key].labels[0]].y1)
         .attr("x2",componentMap[key][componentMap[key].labels[0]].x2)
         .attr("y2",componentMap[key][componentMap[key].labels[0]].y2)
         .attr("stroke",componentMap[key].color)
         .attr("stroke-width",2)
         .attr("marker-end",`url(#arrow__image__${key}`);

       svg.append("line")
         .attr("x1",componentMap[key][componentMap[key].labels[1]].x1)
         .attr("y1",componentMap[key][componentMap[key].labels[1]].y1)
         .attr("x2",componentMap[key][componentMap[key].labels[1]].x2)
         .attr("y2",componentMap[key][componentMap[key].labels[1]].y2)
         .attr("stroke",componentMap[key].color)
         .attr("stroke-width",2)
         .attr("marker-end",`url(#arrow__image__${key}`);

       svg.append('text')
           .attr('class', 'component-speed__graph__image__label')
           .text(componentMap[key].labels[0])
           .style('fill', componentMap[key].color)
           .attr('y', componentMap[key][componentMap[key].labels[0]].ylabel)
           .attr('x', componentMap[key][componentMap[key].labels[0]].xlabel);


       svg.append('text')
           .attr('class', 'component-speed__graph__image__label')
           .text(componentMap[key].labels[1])
           .style('fill', componentMap[key].color)
           .attr('y', componentMap[key][componentMap[key].labels[1]].ylabel)
           .attr('x', componentMap[key][componentMap[key].labels[1]].xlabel);
      }

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
        y: d3.axisLeft().scale(this.scales.y).tickSize(0,0)
      };
      this.bgs = {};
      for (let key in this.svgs) {
        this.svgs[key].selectAll('*').remove();

        this.svgs[key].select('.component-speed__graph__axis').remove();
        this.svgs[key].append('g')
          .attr('class', 'component-speed__graph__axis component-speed__graph__axis-x')
          .attr('transform', `translate(0, ${model.get('height') / 2})`)
          .call(this.axes.x)
        this.svgs[key].selectAll("text").remove();

        this.svgs[key].append('g')
          .attr('class', 'component-speed__graph__axis component-speed__graph__axis-x')
          .attr('transform', `translate(0, ${model.get('height')})`)
          .call(this.axes.x)
          .append('text')
            .attr('class', 'component-speed__graph__axis-label')
            .text('Time [seconds]')
            .attr('x', model.get('width') / 2)
            .attr('y', 30);

        this.svgs[key].append('g')
          .attr('class', 'component-speed__graph__axis component-speed__graph__axis-y')
          .call(this.axes.y)
        this.svgs[key].selectAll(".component-speed__graph__axis-y .domain").attr("stroke",0)

        // this.svgs[key].append('g')
        //   .append('text')
        //     .attr('class', 'component-speed__graph__axis-label')
        //     .text(`Speed [micrometers / second]`)
        //     .attr('transform', 'rotate(-90)')
        //     .attr('y', -20)
        //     .attr('x', -model.get('height') / 2);

       this.svgs[key].append("svg:defs")
        	.append("svg:marker")
        	.attr("id", `arrow__${key}`)
        	.attr("refX", 0)
        	.attr("refY", 4)
        	.attr("markerWidth", 8)
        	.attr("markerHeight", 8)
        	.attr("orient", "auto")
        	.append("svg:path")
        	.attr("d", "M0,0 L0,8 L8,4 z")
          .style('fill',componentMap[key].color);

        this.svgs[key].append("line")
          .attr('class', `component-speed__graph__arrow-line-${componentMap[key].labels[0]}`)
          .attr("x1",-5)
          .attr("y1",model.get('height') / 2 - 5)
          .attr("x2",-5)
          .attr("y2",5)
          .attr("stroke",componentMap[key].color)
          .attr("stroke-width",2)
          .attr("marker-end",`url(#arrow__${key}`);

        this.svgs[key].append('g')
          .append('text')
            .attr('class', 'component-speed__graph__arrow-label')
            .text(`Speed ${componentMap[key].labels[0]}`)
            .attr('transform', 'rotate(-90)')
            .style('fill', componentMap[key].color)
            .attr('y', -10)
            .attr('x', -model.get('height') / 4);

        this.svgs[key].append("line")
          .attr('class', `component-speed__graph__arrow-line-${componentMap[key].labels[1]}`)
          .attr("x1",-5)
          .attr("y1", model.get('height') / 2 + 5)
          .attr("x2",-5)
          .attr("y2",model.get('height') - 5)
          .attr("stroke",componentMap[key].color)
          .attr("stroke-width",2)
          .attr("marker-end",`url(#arrow__${key})`)

        this.svgs[key].append('g')
          .append('text')
            .attr('class', 'component-speed__graph__arrow-label')
            .text(`Speed ${componentMap[key].labels[1]}`)
            .attr('transform', 'rotate(-90)')
            .style('fill', componentMap[key].color)
            .attr('y', -10)
            .attr('x', -3 * model.get('height') / 4);

        this.svgs[key].append('g')
          .append('text')
            .attr('class', 'component-speed__graph__title')
            .text(`Average speed in ${componentMap[key].title} direction `)
            .attr('y', -10)
            .attr('x', model.get('width') / 2);


        this.bgs[key] = this.svgs[key].append('g')
          .attr('class', 'component-speed__graph__background');

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
              .attr('class', `component-speed__graph__std component-speed__graph__std__${layer}`)
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
            .attr('class', `component-speed__graph__line component-speed__graph__line__${layer}`)
            .attr('style', color ? `stroke: #${color.toString(16)}` : null)
            .attr('d', line);

        }


        // Draw the lines at the different time intervals.
        if (model.get('lightConfig') && Object.keys(model.get('data')).length) {

          this.svgs[key].append("svg:defs")
           	.append("svg:marker")
           	.attr("id", `arrow__component__light`)
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
                  .attr("marker-end",`url(#arrow__component__light)`)
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
                .text(`${config.left}% from left&right`)
                .attr('y', 15)
                .attr('x', (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration);
            } else if (config.left == 0 && config.right == 0 && config.top != 0 && config.bottom != 0){
              this.svgs[key].append('g')
                .append('text')
                .attr('class', 'component-speed__graph__light-label')
                .text(`${config.top}% from top&bottom`)
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
        let timeband = this.bgs[key].selectAll('.component-speed__graph__time-band')
          .data([timestamp])
        timeband.enter().append('rect')
          .attr('class', 'component-speed__graph__time-band')
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
        this.svgs[key].selectAll('.component-speed__graph__axis').remove();
        this.svgs[key].selectAll('.component-speed__graph__time-band').remove();
        this.svgs[key].selectAll('.component-speed__graph__std').remove();
        this.svgs[key].selectAll('.component-speed__graph__line').remove();
      }
    }
  }
})
