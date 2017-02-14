'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      d3 = require('d3'),
      Template = require('text!./circlegraph.html'),
      LightDisplay = require('euglena/component/lightdisplay/lightdisplay');
  require('link!./circlegraph.css');

  return function (_DomView) {
    _inherits(CircleHistogramView, _DomView);

    function CircleHistogramView(model, tmpl) {
      _classCallCheck(this, CircleHistogramView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CircleHistogramView).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange']);
      _this._lightDisplay = LightDisplay.create({
        width: model.get('width') + model.get('margins.left') + model.get('margins.right'),
        height: model.get('height') + model.get('margins.top') + model.get('margins.bottom')
      });
      _this._lightDisplay.render({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      });
      _this.addChild(_this._lightDisplay.view(), ".circle-graph__lights");

      model.addEventListener('Model.Change', _this._onModelChange);
      var svg = d3.select(_this.$el.find('.circle-graph__graph').get(0)).append('svg');
      svg.attr('width', model.get('width') + model.get('margins.left') + model.get('margins.right'));
      svg.attr('height', model.get('height') + model.get('margins.top') + model.get('margins.bottom'));
      _this.svg = svg.append('g');
      _this.svg.attr('transform', 'translate(' + (model.get('margins.left') + model.get('width') / 2) + ',' + (model.get('margins.top') + model.get('height') / 2) + ')');
      return _this;
    }

    _createClass(CircleHistogramView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        switch (evt.data.path) {
          case "histogram":
            this.render(evt.currentTarget);
            break;
          case "data":
            if (evt.data.value) {
              this.setup(evt.currentTarget);
            } else {
              this.reset();
            }
            break;
          case "lights":
            this._lightDisplay.render(evt.data.value);
            break;
        }
      }
    }, {
      key: 'setup',
      value: function setup(model) {
        this.arc = d3.arc().outerRadius(function (d) {
          return model.get('width') / 2 * (d.data.frequency / model.get('data.maxBinValue'));
        }).innerRadius(0);
        this.pie = d3.pie().value(function (d) {
          return 1;
        }).sort(function (a, b) {
          return a.thetaStart - b.thetaStart;
        });
      }
    }, {
      key: 'render',
      value: function render(model) {
        var bins = model.get('histogram');
        var data = this.svg.selectAll('.circle-graph__slice').data(this.pie(bins));
        data.enter().append('path').attr('class', 'circle-graph__slice').attr('transform', 'rotate(90)').merge(data).transition().ease(d3.easeLinear).attr('d', this.arc);
        data.exit().remove();

        var measureCount = bins.reduce(function (v, c) {
          return v + c.frequency;
        }, 0);
        this.$el.find('.circle-graph__meta').html(measureCount + ' samples');
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.svg.selectAll('.circle-graph__slice').remove();
        this.$el.find(".circle-graph__meta").html('0 samples');
      }
    }]);

    return CircleHistogramView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sVUFBVSxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRSxRQUFRLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUUsS0FBSyxRQUFRLElBQVIsQ0FGUDtBQUFBLE1BR0UsV0FBVyxRQUFRLHlCQUFSLENBSGI7QUFBQSxNQUlFLGVBQWUsUUFBUSw2Q0FBUixDQUpqQjtBQU1BLFVBQVEsd0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxpQ0FBWSxLQUFaLEVBQW1CLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEseUdBQ2pCLFFBQVEsUUFEUzs7QUFFdkIsWUFBTSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsQ0FBeEI7QUFDQSxZQUFLLGFBQUwsR0FBcUIsYUFBYSxNQUFiLENBQW9CO0FBQ3ZDLGVBQU8sTUFBTSxHQUFOLENBQVUsT0FBVixJQUFxQixNQUFNLEdBQU4sQ0FBVSxjQUFWLENBQXJCLEdBQWlELE1BQU0sR0FBTixDQUFVLGVBQVYsQ0FEakI7QUFFdkMsZ0JBQVEsTUFBTSxHQUFOLENBQVUsUUFBVixJQUFzQixNQUFNLEdBQU4sQ0FBVSxhQUFWLENBQXRCLEdBQWlELE1BQU0sR0FBTixDQUFVLGdCQUFWO0FBRmxCLE9BQXBCLENBQXJCO0FBSUEsWUFBSyxhQUFMLENBQW1CLE1BQW5CLENBQTBCO0FBQ3hCLGFBQUssQ0FEbUI7QUFFeEIsY0FBTSxDQUZrQjtBQUd4QixlQUFPLENBSGlCO0FBSXhCLGdCQUFRO0FBSmdCLE9BQTFCO0FBTUEsWUFBSyxRQUFMLENBQWMsTUFBSyxhQUFMLENBQW1CLElBQW5CLEVBQWQsRUFBeUMsdUJBQXpDOztBQUVBLFlBQU0sZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBSyxjQUE1QztBQUNBLFVBQUksTUFBTSxHQUFHLE1BQUgsQ0FBVSxNQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsc0JBQWQsRUFBc0MsR0FBdEMsQ0FBMEMsQ0FBMUMsQ0FBVixFQUF3RCxNQUF4RCxDQUErRCxLQUEvRCxDQUFWO0FBQ0EsVUFBSSxJQUFKLENBQVMsT0FBVCxFQUFrQixNQUFNLEdBQU4sQ0FBVSxPQUFWLElBQXFCLE1BQU0sR0FBTixDQUFVLGNBQVYsQ0FBckIsR0FBaUQsTUFBTSxHQUFOLENBQVUsZUFBVixDQUFuRTtBQUNBLFVBQUksSUFBSixDQUFTLFFBQVQsRUFBbUIsTUFBTSxHQUFOLENBQVUsUUFBVixJQUFzQixNQUFNLEdBQU4sQ0FBVSxhQUFWLENBQXRCLEdBQWlELE1BQU0sR0FBTixDQUFVLGdCQUFWLENBQXBFO0FBQ0EsWUFBSyxHQUFMLEdBQVcsSUFBSSxNQUFKLENBQVcsR0FBWCxDQUFYO0FBQ0EsWUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLFdBQWQsa0JBQXdDLE1BQU0sR0FBTixDQUFVLGNBQVYsSUFBNEIsTUFBTSxHQUFOLENBQVUsT0FBVixJQUFxQixDQUF6RixXQUE4RixNQUFNLEdBQU4sQ0FBVSxhQUFWLElBQTJCLE1BQU0sR0FBTixDQUFVLFFBQVYsSUFBc0IsQ0FBL0k7QUFwQnVCO0FBcUJ4Qjs7QUF0Qkg7QUFBQTtBQUFBLHFDQXdCaUIsR0F4QmpCLEVBd0JzQjtBQUNsQixnQkFBUSxJQUFJLElBQUosQ0FBUyxJQUFqQjtBQUNFLGVBQUssV0FBTDtBQUNFLGlCQUFLLE1BQUwsQ0FBWSxJQUFJLGFBQWhCO0FBQ0E7QUFDRixlQUFLLE1BQUw7QUFDRSxnQkFBSSxJQUFJLElBQUosQ0FBUyxLQUFiLEVBQW9CO0FBQ2xCLG1CQUFLLEtBQUwsQ0FBVyxJQUFJLGFBQWY7QUFDRCxhQUZELE1BRU87QUFDTCxtQkFBSyxLQUFMO0FBQ0Q7QUFDRDtBQUNGLGVBQUssUUFBTDtBQUNFLGlCQUFLLGFBQUwsQ0FBbUIsTUFBbkIsQ0FBMEIsSUFBSSxJQUFKLENBQVMsS0FBbkM7QUFDQTtBQWJKO0FBZUQ7QUF4Q0g7QUFBQTtBQUFBLDRCQTBDUSxLQTFDUixFQTBDZTtBQUNYLGFBQUssR0FBTCxHQUFXLEdBQUcsR0FBSCxHQUNSLFdBRFEsQ0FDSSxVQUFDLENBQUQ7QUFBQSxpQkFBUSxNQUFNLEdBQU4sQ0FBVSxPQUFWLElBQXFCLENBQXRCLElBQTRCLEVBQUUsSUFBRixDQUFPLFNBQVAsR0FBbUIsTUFBTSxHQUFOLENBQVUsa0JBQVYsQ0FBL0MsQ0FBUDtBQUFBLFNBREosRUFFUixXQUZRLENBRUksQ0FGSixDQUFYO0FBR0EsYUFBSyxHQUFMLEdBQVcsR0FBRyxHQUFILEdBQ1IsS0FEUSxDQUNGLFVBQUMsQ0FBRDtBQUFBLGlCQUFPLENBQVA7QUFBQSxTQURFLEVBRVIsSUFGUSxDQUVILFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxpQkFBVSxFQUFFLFVBQUYsR0FBZSxFQUFFLFVBQTNCO0FBQUEsU0FGRyxDQUFYO0FBR0Q7QUFqREg7QUFBQTtBQUFBLDZCQW1EUyxLQW5EVCxFQW1EZ0I7QUFDWixZQUFJLE9BQU8sTUFBTSxHQUFOLENBQVUsV0FBVixDQUFYO0FBQ0EsWUFBSSxPQUFPLEtBQUssR0FBTCxDQUFTLFNBQVQsQ0FBbUIsc0JBQW5CLEVBQ1IsSUFEUSxDQUNILEtBQUssR0FBTCxDQUFTLElBQVQsQ0FERyxDQUFYO0FBRUEsYUFBSyxLQUFMLEdBQ0csTUFESCxDQUNVLE1BRFYsRUFFRyxJQUZILENBRVEsT0FGUixFQUVpQixxQkFGakIsRUFHRyxJQUhILENBR1EsV0FIUixFQUdxQixZQUhyQixFQUlHLEtBSkgsQ0FJUyxJQUpULEVBS0csVUFMSCxHQU1LLElBTkwsQ0FNVSxHQUFHLFVBTmIsRUFPSyxJQVBMLENBT1UsR0FQVixFQU9lLEtBQUssR0FQcEI7QUFRQSxhQUFLLElBQUwsR0FBWSxNQUFaOztBQUVBLFlBQUksZUFBZSxLQUFLLE1BQUwsQ0FBWSxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsaUJBQVUsSUFBSSxFQUFFLFNBQWhCO0FBQUEsU0FBWixFQUF1QyxDQUF2QyxDQUFuQjtBQUNBLGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxxQkFBZCxFQUFxQyxJQUFyQyxDQUE2QyxZQUE3QztBQUNEO0FBbkVIO0FBQUE7QUFBQSw4QkFxRVU7QUFDTixhQUFLLEdBQUwsQ0FBUyxTQUFULENBQW1CLHNCQUFuQixFQUEyQyxNQUEzQztBQUNBLGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxxQkFBZCxFQUFxQyxJQUFyQyxDQUEwQyxXQUExQztBQUNEO0FBeEVIOztBQUFBO0FBQUEsSUFBeUMsT0FBekM7QUEwRUQsQ0FuRkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2NpcmNsZWdyYXBoL3ZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
