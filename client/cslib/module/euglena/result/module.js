'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),

  // LightDisplay = require('euglena/component/lightdisplay/lightdisplay'),
  CircleHistogram = require('euglena/component/circlegraph/circlegraph'),
      Histogram = require('euglena/component/histogramgraph/histogramgraph'),
      TimeSeries = require('euglena/component/timeseriesgraph/timeseriesgraph'),
      EuglenaDisplay = require('euglena/component/euglenadisplay/euglenadisplay'),
      VisualResult = require('euglena/component/visualresult/visualresult');

  return function (_Module) {
    _inherits(ResultModule, _Module);

    function ResultModule() {
      _classCallCheck(this, ResultModule);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ResultModule).call(this));

      Utils.bindMethods(_this, ['_onPhaseChange', '_onDryRunRequest', '_onDryRunStopRequest', '_onServerResults', '_onTick']);

      // this._lightDisplay = LightDisplay.create({
      //   euglenaDisplay: Globals.get('AppConfig.view3d')
      // });
      // this._lightDisplay.addEventListener('LightDisplay.Tick', this._onTick)
      _this._visualResult = VisualResult.create();
      _this._visualResult.addEventListener('VisualResult.Tick', _this._onTick);
      _this._graphs = {
        circle: CircleHistogram.create(Globals.get('AppConfig.dataVis.circle')),
        histogram: Histogram.create(Globals.get('AppConfig.dataVis.histogram')),
        timeseries: TimeSeries.create(Globals.get('AppConfig.dataVis.timeseries'))
      };
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      Globals.get('Relay').addEventListener('Results.DryRunRequest', _this._onDryRunRequest);
      Globals.get('Relay').addEventListener('Results.DryRunStopRequest', _this._onDryRunStopRequest);
      Globals.get('Relay').addEventListener('ExperimentServer.Results', _this._onServerResults);
      return _this;
    }

    _createClass(ResultModule, [{
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase == "experiment") {
          // this._lightDisplay.reset();
          // Globals.get('Layout.panels.main').addChild(this._lightDisplay.view());
          Globals.get('Layout.panels.main').addChild(this._visualResult.view());

          for (var key in this._graphs) {
            this._graphs[key].reset();
            if (Globals.get('AppConfig.visualizationType').includes(key)) {
              Globals.get('Layout.panels.main').addChild(this._graphs[key].view());
            }
          }
        } else {
          // Globals.get('Layout.panels.main').removeChild(this._lightDisplay.view());
          Globals.get('Layout.panels.main').removeChild(this._visualResult.view());
          for (var _key in this._graphs) {
            Globals.get('Layout.panels.main').removeChild(this._graphs[_key].view());
          }
        }
      }
    }, {
      key: '_onDryRunRequest',
      value: function _onDryRunRequest(evt) {
        // this._dryRun = true;
        // this._lightDisplay.run(evt.data.lights);
        this._visualResult.handleLightData(evt.data.lights);
        this._visualResult.play();
      }
    }, {
      key: '_onDryRunStopRequest',
      value: function _onDryRunStopRequest(evt) {
        // this._lightDisplay.stop();
        this._visualResult.stop();
        // this._dryRun = false;
      }
    }, {
      key: '_onServerResults',
      value: function _onServerResults(evt) {
        // this._dryRun = false;
        for (var key in this._graphs) {
          this._graphs[key].reset();
        }
        this._visualResult.handleLightData(evt.data.lights);
        this._visualResult.play(evt.data);
        // this._lightDisplay.handleVideo(evt.data);
        // this._lightDisplay.run(evt.data.lights);
        for (var _key2 in this._graphs) {
          this._graphs[_key2].handleData(evt.data);
        }
      }
    }, {
      key: '_onTick',
      value: function _onTick(evt) {
        if (evt.data.mode != 'dryRun') {
          for (var key in this._graphs) {
            this._graphs[key].update(evt.data.time, evt.data.lights);
          }
        }
      }
    }]);

    return ResultModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxTQUFTLFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFVBQVUsUUFBUSxvQkFBUixDQUZaO0FBQUE7O0FBSUUsb0JBQWtCLFFBQVEsMkNBQVIsQ0FKcEI7QUFBQSxNQUtFLFlBQVksUUFBUSxpREFBUixDQUxkO0FBQUEsTUFNRSxhQUFhLFFBQVEsbURBQVIsQ0FOZjtBQUFBLE1BT0UsaUJBQWlCLFFBQVEsaURBQVIsQ0FQbkI7QUFBQSxNQVFFLGVBQWUsUUFBUSw2Q0FBUixDQVJqQjs7QUFZQTtBQUFBOztBQUNFLDRCQUFjO0FBQUE7O0FBQUE7O0FBRVosWUFBTSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsa0JBQW5CLEVBQXVDLHNCQUF2QyxFQUErRCxrQkFBL0QsRUFBbUYsU0FBbkYsQ0FBeEI7Ozs7OztBQU1BLFlBQUssYUFBTCxHQUFxQixhQUFhLE1BQWIsRUFBckI7QUFDQSxZQUFLLGFBQUwsQ0FBbUIsZ0JBQW5CLENBQW9DLG1CQUFwQyxFQUF5RCxNQUFLLE9BQTlEO0FBQ0EsWUFBSyxPQUFMLEdBQWU7QUFDYixnQkFBUSxnQkFBZ0IsTUFBaEIsQ0FBdUIsUUFBUSxHQUFSLENBQVksMEJBQVosQ0FBdkIsQ0FESztBQUViLG1CQUFXLFVBQVUsTUFBVixDQUFpQixRQUFRLEdBQVIsQ0FBWSw2QkFBWixDQUFqQixDQUZFO0FBR2Isb0JBQVksV0FBVyxNQUFYLENBQWtCLFFBQVEsR0FBUixDQUFZLDhCQUFaLENBQWxCO0FBSEMsT0FBZjtBQUtBLGNBQVEsR0FBUixDQUFZLE9BQVosRUFBcUIsZ0JBQXJCLENBQXNDLGlCQUF0QyxFQUF5RCxNQUFLLGNBQTlEO0FBQ0EsY0FBUSxHQUFSLENBQVksT0FBWixFQUFxQixnQkFBckIsQ0FBc0MsdUJBQXRDLEVBQStELE1BQUssZ0JBQXBFO0FBQ0EsY0FBUSxHQUFSLENBQVksT0FBWixFQUFxQixnQkFBckIsQ0FBc0MsMkJBQXRDLEVBQW1FLE1BQUssb0JBQXhFO0FBQ0EsY0FBUSxHQUFSLENBQVksT0FBWixFQUFxQixnQkFBckIsQ0FBc0MsMEJBQXRDLEVBQWtFLE1BQUssZ0JBQXZFO0FBbEJZO0FBbUJiOztBQXBCSDtBQUFBO0FBQUEscUNBc0JpQixHQXRCakIsRUFzQnNCO0FBQ2xCLFlBQUksSUFBSSxJQUFKLENBQVMsS0FBVCxJQUFrQixZQUF0QixFQUFvQzs7O0FBR2xDLGtCQUFRLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxRQUFsQyxDQUEyQyxLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsRUFBM0M7O0FBRUEsZUFBSyxJQUFJLEdBQVQsSUFBZ0IsS0FBSyxPQUFyQixFQUE4QjtBQUM1QixpQkFBSyxPQUFMLENBQWEsR0FBYixFQUFrQixLQUFsQjtBQUNBLGdCQUFJLFFBQVEsR0FBUixDQUFZLDZCQUFaLEVBQTJDLFFBQTNDLENBQW9ELEdBQXBELENBQUosRUFBOEQ7QUFDNUQsc0JBQVEsR0FBUixDQUFZLG9CQUFaLEVBQWtDLFFBQWxDLENBQTJDLEtBQUssT0FBTCxDQUFhLEdBQWIsRUFBa0IsSUFBbEIsRUFBM0M7QUFDRDtBQUNGO0FBQ0YsU0FYRCxNQVdPOztBQUVMLGtCQUFRLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxXQUFsQyxDQUE4QyxLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsRUFBOUM7QUFDQSxlQUFLLElBQUksSUFBVCxJQUFnQixLQUFLLE9BQXJCLEVBQThCO0FBQzVCLG9CQUFRLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxXQUFsQyxDQUE4QyxLQUFLLE9BQUwsQ0FBYSxJQUFiLEVBQWtCLElBQWxCLEVBQTlDO0FBQ0Q7QUFDRjtBQUNGO0FBekNIO0FBQUE7QUFBQSx1Q0EyQ21CLEdBM0NuQixFQTJDd0I7OztBQUdwQixhQUFLLGFBQUwsQ0FBbUIsZUFBbkIsQ0FBbUMsSUFBSSxJQUFKLENBQVMsTUFBNUM7QUFDQSxhQUFLLGFBQUwsQ0FBbUIsSUFBbkI7QUFDRDtBQWhESDtBQUFBO0FBQUEsMkNBa0R1QixHQWxEdkIsRUFrRDRCOztBQUV4QixhQUFLLGFBQUwsQ0FBbUIsSUFBbkI7O0FBRUQ7QUF0REg7QUFBQTtBQUFBLHVDQXdEbUIsR0F4RG5CLEVBd0R3Qjs7QUFFcEIsYUFBSyxJQUFJLEdBQVQsSUFBZ0IsS0FBSyxPQUFyQixFQUE4QjtBQUM1QixlQUFLLE9BQUwsQ0FBYSxHQUFiLEVBQWtCLEtBQWxCO0FBQ0Q7QUFDRCxhQUFLLGFBQUwsQ0FBbUIsZUFBbkIsQ0FBbUMsSUFBSSxJQUFKLENBQVMsTUFBNUM7QUFDQSxhQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsSUFBSSxJQUE1Qjs7O0FBR0EsYUFBSyxJQUFJLEtBQVQsSUFBZ0IsS0FBSyxPQUFyQixFQUE4QjtBQUM1QixlQUFLLE9BQUwsQ0FBYSxLQUFiLEVBQWtCLFVBQWxCLENBQTZCLElBQUksSUFBakM7QUFDRDtBQUNGO0FBcEVIO0FBQUE7QUFBQSw4QkFzRVUsR0F0RVYsRUFzRWU7QUFDWCxZQUFJLElBQUksSUFBSixDQUFTLElBQVQsSUFBaUIsUUFBckIsRUFBK0I7QUFDN0IsZUFBSyxJQUFJLEdBQVQsSUFBZ0IsS0FBSyxPQUFyQixFQUE4QjtBQUM1QixpQkFBSyxPQUFMLENBQWEsR0FBYixFQUFrQixNQUFsQixDQUF5QixJQUFJLElBQUosQ0FBUyxJQUFsQyxFQUF3QyxJQUFJLElBQUosQ0FBUyxNQUFqRDtBQUNEO0FBQ0Y7QUFDRjtBQTVFSDs7QUFBQTtBQUFBLElBQWtDLE1BQWxDO0FBOEVELENBM0ZEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
