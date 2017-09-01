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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3BhbmVsX3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIk1vZHVsZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTGF5b3V0UGFuZWwiLCJiaW5kTWV0aG9kcyIsInBhbmVsIiwiY3JlYXRlIiwiaWQiLCJob29rIiwiX2hvb2tMYXlvdXRQYW5lbHMiLCJQcm9taXNlIiwicmVzb2x2ZSIsImxpc3QiLCJtZXRhIiwicHVzaCIsIndlaWdodCIsImJ1aWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFNBQVNELFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjtBQUFBLE1BR0VJLEtBQUtKLFFBQVEseUJBQVIsQ0FIUDtBQUFBLE1BSUVLLGNBQWNMLFFBQVEsMkJBQVIsQ0FKaEI7O0FBUUE7QUFBQTs7QUFDRSxpQ0FBYztBQUFBOztBQUFBOztBQUVaRSxZQUFNSSxXQUFOLFFBQXdCLENBQUMsbUJBQUQsQ0FBeEI7QUFDQSxZQUFLQyxLQUFMLEdBQWFGLFlBQVlHLE1BQVosQ0FBbUIsRUFBRUMsSUFBSSxRQUFOLEVBQW5CLENBQWI7QUFIWTtBQUliOztBQUxIO0FBQUE7QUFBQSw2QkFPUztBQUNMTCxXQUFHTSxJQUFILENBQVEsZUFBUixFQUF5QixLQUFLQyxpQkFBOUI7QUFDQSxlQUFPQyxRQUFRQyxPQUFSLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQVZIO0FBQUE7QUFBQSx3Q0FZb0JDLElBWnBCLEVBWTBCQyxJQVoxQixFQVlnQztBQUM1QkQsYUFBS0UsSUFBTCxDQUFVO0FBQ1JDLGtCQUFRLENBREE7QUFFUlYsaUJBQU8sS0FBS0E7QUFGSixTQUFWO0FBSUEsZUFBT08sSUFBUDtBQUNEO0FBbEJIO0FBQUE7QUFBQSw0QkFvQlE7QUFDSixhQUFLUCxLQUFMLENBQVdXLEtBQVg7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUE1RUY7O0FBQUE7QUFBQSxJQUF1Q2pCLE1BQXZDO0FBOEVELENBdkZEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3BhbmVsX3Jlc3VsdC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIExheW91dFBhbmVsID0gcmVxdWlyZSgnbW9kdWxlL2xheW91dC9wYW5lbC9wYW5lbCcpXG4gIDtcblxuXG4gIHJldHVybiBjbGFzcyBSZXN1bHRQYW5lbE1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfaG9va0xheW91dFBhbmVscyddKTtcbiAgICAgIHRoaXMucGFuZWwgPSBMYXlvdXRQYW5lbC5jcmVhdGUoeyBpZDogXCJyZXN1bHRcIiB9KTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgSE0uaG9vaygnTGF5b3V0LlBhbmVscycsIHRoaXMuX2hvb2tMYXlvdXRQYW5lbHMpXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cblxuICAgIF9ob29rTGF5b3V0UGFuZWxzKGxpc3QsIG1ldGEpIHtcbiAgICAgIGxpc3QucHVzaCh7XG4gICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgcGFuZWw6IHRoaXMucGFuZWxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgdGhpcy5wYW5lbC5idWlsZCgpO1xuICAgIH1cblxuICAgIC8vIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vICAgc3VwZXIoKTtcbiAgICAvLyAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uUGhhc2VDaGFuZ2UnLCAnX29uRHJ5UnVuUmVxdWVzdCcsICdfb25EcnlSdW5TdG9wUmVxdWVzdCcsICdfb25TZXJ2ZXJSZXN1bHRzJywgJ19vblRpY2snXSk7XG5cbiAgICAvLyAgIHRoaXMuX3Zpc3VhbFJlc3VsdCA9IFZpc3VhbFJlc3VsdC5jcmVhdGUoKTtcbiAgICAvLyAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuVGljaycsIHRoaXMuX29uVGljayk7XG4gICAgLy8gICB0aGlzLl9ncmFwaHMgPSB7XG4gICAgLy8gICAgIGNpcmNsZTogQ2lyY2xlSGlzdG9ncmFtLmNyZWF0ZShHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmRhdGFWaXMuY2lyY2xlJykpLFxuICAgIC8vICAgICBoaXN0b2dyYW06IEhpc3RvZ3JhbS5jcmVhdGUoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5kYXRhVmlzLmhpc3RvZ3JhbScpKSxcbiAgICAvLyAgICAgdGltZXNlcmllczogVGltZVNlcmllcy5jcmVhdGUoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5kYXRhVmlzLnRpbWVzZXJpZXMnKSlcbiAgICAvLyAgIH07XG4gICAgLy8gICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKTtcbiAgICAvLyAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ1Jlc3VsdHMuRHJ5UnVuUmVxdWVzdCcsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgLy8gICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdSZXN1bHRzLkRyeVJ1blN0b3BSZXF1ZXN0JywgdGhpcy5fb25EcnlSdW5TdG9wUmVxdWVzdCk7XG4gICAgLy8gICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLlJlc3VsdHMnLCB0aGlzLl9vblNlcnZlclJlc3VsdHMpO1xuICAgIC8vIH1cblxuICAgIC8vIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgIC8vICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwiZXhwZXJpbWVudFwiKSB7XG4gICAgLy8gICAgIEdsb2JhbHMuZ2V0KCdMYXlvdXQucGFuZWxzLm1haW4nKS5hZGRDaGlsZCh0aGlzLl92aXN1YWxSZXN1bHQudmlldygpKTtcblxuICAgIC8vICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fZ3JhcGhzKSB7XG4gICAgLy8gICAgICAgdGhpcy5fZ3JhcGhzW2tleV0ucmVzZXQoKTtcbiAgICAvLyAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy52aXN1YWxpemF0aW9uVHlwZScpLmluY2x1ZGVzKGtleSkpIHtcbiAgICAvLyAgICAgICAgIEdsb2JhbHMuZ2V0KCdMYXlvdXQucGFuZWxzLm1haW4nKS5hZGRDaGlsZCh0aGlzLl9ncmFwaHNba2V5XS52aWV3KCkpO1xuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSBlbHNlIHtcbiAgICAvLyAgICAgR2xvYmFscy5nZXQoJ0xheW91dC5wYW5lbHMubWFpbicpLnJlbW92ZUNoaWxkKHRoaXMuX3Zpc3VhbFJlc3VsdC52aWV3KCkpO1xuICAgIC8vICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fZ3JhcGhzKSB7XG4gICAgLy8gICAgICAgR2xvYmFscy5nZXQoJ0xheW91dC5wYW5lbHMubWFpbicpLnJlbW92ZUNoaWxkKHRoaXMuX2dyYXBoc1trZXldLnZpZXcoKSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyBfb25TZXJ2ZXJSZXN1bHRzKGV2dCkge1xuICAgIC8vICAgZm9yIChsZXQga2V5IGluIHRoaXMuX2dyYXBocykge1xuICAgIC8vICAgICB0aGlzLl9ncmFwaHNba2V5XS5yZXNldCgpO1xuICAgIC8vICAgfVxuICAgIC8vICAgdGhpcy5fdmlzdWFsUmVzdWx0LmhhbmRsZUxpZ2h0RGF0YShldnQuZGF0YS5saWdodHMpO1xuICAgIC8vICAgdGhpcy5fdmlzdWFsUmVzdWx0LnBsYXkoZXZ0LmRhdGEpO1xuICAgIC8vICAgZm9yIChsZXQga2V5IGluIHRoaXMuX2dyYXBocykge1xuICAgIC8vICAgICB0aGlzLl9ncmFwaHNba2V5XS5oYW5kbGVEYXRhKGV2dC5kYXRhKTtcbiAgICAvLyAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyBfb25UaWNrKGV2dCkge1xuICAgIC8vICAgaWYgKGV2dC5kYXRhLm1vZGUgIT0gJ2RyeVJ1bicpIHtcbiAgICAvLyAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuX2dyYXBocykge1xuICAgIC8vICAgICAgIHRoaXMuX2dyYXBoc1trZXldLnVwZGF0ZShldnQuZGF0YS50aW1lLCBldnQuZGF0YS5saWdodHMpO1xuICAgIC8vICAgICB9XG4gICAgLy8gICB9XG4gICAgLy8gfVxuICB9XG59KSJdfQ==
