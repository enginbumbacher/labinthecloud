'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager'),
      LayoutPanel = require('module/layout/panel/panel');

  return function (_Module) {
    _inherits(ResultPanelModule, _Module);

    function ResultPanelModule() {
      _classCallCheck(this, ResultPanelModule);

      var _this = _possibleConstructorReturn(this, (ResultPanelModule.__proto__ || Object.getPrototypeOf(ResultPanelModule)).call(this));

      Utils.bindMethods(_this, ['_hookLayoutPanels']);
      _this.panel = LayoutPanel.create({ id: "result" });
      return _this;
    }

    _createClass(ResultPanelModule, [{
      key: 'init',
      value: function init() {
        HM.hook('Layout.Panels', this._hookLayoutPanels);
        return Promise.resolve(true);
      }
    }, {
      key: '_hookLayoutPanels',
      value: function _hookLayoutPanels(list, meta) {
        list.push({
          weight: 0,
          panel: this.panel
        });
        return list;
      }
    }, {
      key: 'run',
      value: function run() {
        this.panel.build();
      }

      // constructor() {
      //   super();
      //   Utils.bindMethods(this, ['_onPhaseChange', '_onDryRunRequest', '_onDryRunStopRequest', '_onServerResults', '_onTick']);

      //   this._visualResult = VisualResult.create();
      //   this._visualResult.addEventListener('VisualResult.Tick', this._onTick);
      //   this._graphs = {
      //     circle: CircleHistogram.create(Globals.get('AppConfig.dataVis.circle')),
      //     histogram: Histogram.create(Globals.get('AppConfig.dataVis.histogram')),
      //     timeseries: TimeSeries.create(Globals.get('AppConfig.dataVis.timeseries'))
      //   };
      //   Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
      //   Globals.get('Relay').addEventListener('Results.DryRunRequest', this._onDryRunRequest);
      //   Globals.get('Relay').addEventListener('Results.DryRunStopRequest', this._onDryRunStopRequest);
      //   Globals.get('Relay').addEventListener('ExperimentServer.Results', this._onServerResults);
      // }

      // _onPhaseChange(evt) {
      //   if (evt.data.phase == "experiment") {
      //     Globals.get('Layout.panels.main').addChild(this._visualResult.view());

      //     for (let key in this._graphs) {
      //       this._graphs[key].reset();
      //       if (Globals.get('AppConfig.visualizationType').includes(key)) {
      //         Globals.get('Layout.panels.main').addChild(this._graphs[key].view());
      //       }
      //     }
      //   } else {
      //     Globals.get('Layout.panels.main').removeChild(this._visualResult.view());
      //     for (let key in this._graphs) {
      //       Globals.get('Layout.panels.main').removeChild(this._graphs[key].view());
      //     }
      //   }
      // }

      // _onServerResults(evt) {
      //   for (let key in this._graphs) {
      //     this._graphs[key].reset();
      //   }
      //   this._visualResult.handleLightData(evt.data.lights);
      //   this._visualResult.play(evt.data);
      //   for (let key in this._graphs) {
      //     this._graphs[key].handleData(evt.data);
      //   }
      // }

      // _onTick(evt) {
      //   if (evt.data.mode != 'dryRun') {
      //     for (let key in this._graphs) {
      //       this._graphs[key].update(evt.data.time, evt.data.lights);
      //     }
      //   }
      // }

    }]);

    return ResultPanelModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3BhbmVsX3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIk1vZHVsZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTGF5b3V0UGFuZWwiLCJiaW5kTWV0aG9kcyIsInBhbmVsIiwiY3JlYXRlIiwiaWQiLCJob29rIiwiX2hvb2tMYXlvdXRQYW5lbHMiLCJQcm9taXNlIiwicmVzb2x2ZSIsImxpc3QiLCJtZXRhIiwicHVzaCIsIndlaWdodCIsImJ1aWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFNBQVNELFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjtBQUFBLE1BR0VJLEtBQUtKLFFBQVEseUJBQVIsQ0FIUDtBQUFBLE1BSUVLLGNBQWNMLFFBQVEsMkJBQVIsQ0FKaEI7O0FBUUE7QUFBQTs7QUFDRSxpQ0FBYztBQUFBOztBQUFBOztBQUVaRSxZQUFNSSxXQUFOLFFBQXdCLENBQUMsbUJBQUQsQ0FBeEI7QUFDQSxZQUFLQyxLQUFMLEdBQWFGLFlBQVlHLE1BQVosQ0FBbUIsRUFBRUMsSUFBSSxRQUFOLEVBQW5CLENBQWI7QUFIWTtBQUliOztBQUxIO0FBQUE7QUFBQSw2QkFPUztBQUNMTCxXQUFHTSxJQUFILENBQVEsZUFBUixFQUF5QixLQUFLQyxpQkFBOUI7QUFDQSxlQUFPQyxRQUFRQyxPQUFSLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQVZIO0FBQUE7QUFBQSx3Q0FZb0JDLElBWnBCLEVBWTBCQyxJQVoxQixFQVlnQztBQUM1QkQsYUFBS0UsSUFBTCxDQUFVO0FBQ1JDLGtCQUFRLENBREE7QUFFUlYsaUJBQU8sS0FBS0E7QUFGSixTQUFWO0FBSUEsZUFBT08sSUFBUDtBQUNEO0FBbEJIO0FBQUE7QUFBQSw0QkFvQlE7QUFDSixhQUFLUCxLQUFMLENBQVdXLEtBQVg7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUE1RUY7O0FBQUE7QUFBQSxJQUF1Q2pCLE1BQXZDO0FBOEVELENBdkZEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3BhbmVsX3Jlc3VsdC9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
