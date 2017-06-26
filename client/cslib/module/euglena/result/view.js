'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var DomView = require('core/view/dom_view'),
      Template = require('text!./results.html'),
      CircleHistogram = require('euglena/component/circlegraph/circlegraph'),
      Histogram = require('euglena/component/histogramgraph/histogramgraph'),
      TimeSeries = require('euglena/component/timeseriesgraph/timeseriesgraph'),
      VisualResult = require('euglena/component/visualresult/visualresult'),
      SelectField = require('core/component/selectfield/field');

  var vismap = {
    circle: CircleHistogram,
    histogram: Histogram,
    timeseries: TimeSeries
  };

  require('link!./style.css');

  return function (_DomView) {
    _inherits(ResultsView, _DomView);

    function ResultsView(tmpl) {
      _classCallCheck(this, ResultsView);

      var _this = _possibleConstructorReturn(this, (ResultsView.__proto__ || Object.getPrototypeOf(ResultsView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onTick', '_onVisualizationChange', '_onModelChange']);

      _this._visualResult = VisualResult.create();
      _this._visualResult.addEventListener('VisualResult.Tick', _this._onTick);
      _this._graphs = Globals.get('AppConfig.visualization.visualizationTypes').map(function (visConf) {
        visConf.settings.id = visConf.id;
        return vismap[visConf.id].create(visConf.settings);
      });

      _this.addChild(_this._visualResult.view(), '.results__euglena');
      _this._graphs.forEach(function (graph) {
        _this.addChild(graph.view(), '.results__visualization');
      });

      var modelOpts = {
        'none': 'No Model'
      };
      Globals.get('AppConfig.model.tabs').forEach(function (tabConf, ind) {
        var id = String.fromCharCode(97 + ind);
        modelOpts[id] = 'Model ' + id.toUpperCase();
      });
      _this._modelSelect = SelectField.create({
        id: 'model',
        label: 'Model',
        options: modelOpts
      });
      _this.addChild(_this._modelSelect.view(), '.results__controls__model');
      _this._modelSelect.addEventListener('Field.Change', _this._onModelChange);

      var visOpts = {};
      Globals.get('AppConfig.visualization.visualizationTypes').forEach(function (visConf) {
        visOpts[visConf.id] = visConf.label;
      });

      _this._visSelect = SelectField.create({
        id: "visualization",
        label: 'Visualization',
        options: visOpts
      });
      _this.addChild(_this._visSelect.view(), '.results__controls__visualization');
      _this._visSelect.addEventListener('Field.Change', _this._onVisualizationChange);
      _this._onVisualizationChange({ currentTarget: _this._visSelect });

      return _this;
    }

    _createClass(ResultsView, [{
      key: '_onTick',
      value: function _onTick(evt) {
        this._graphs.forEach(function (graph) {
          graph.update(evt.data.time, evt.data.lights);
        });
      }
    }, {
      key: 'handleExperimentResults',
      value: function handleExperimentResults(exp, res) {
        this.$el.find('.results__controls__experiment').html('<label>Experiment:</label><span class="">' + new Date(exp.date_created).toLocaleString() + '</span>');
        this._graphs.forEach(function (graph) {
          graph.reset();
          graph.handleData(res, 'live');
        });
        this._visualResult.handleLightData(exp.configuration);
        this._visualResult.play(res);
      }
    }, {
      key: 'handleModelResults',
      value: function handleModelResults(model, res, tabId) {
        var color = 0;
        if (tabId != 'none') {
          color = Globals.get('ModelTab.' + tabId).color();
        }
        this._graphs.forEach(function (graph) {
          graph.handleData(res, 'model', color);
        });
        this._visualResult.handleModelData(res, model, color);
        if (tabId != this._modelSelect.value()) this._modelSelect.setValue(tabId);
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.$el.find('.results__controls__experiment').html('<label>Experiment:</label><span class="">(New Experiment)</span>');
        this._visualResult.clear();
        this._graphs.forEach(function (graph) {
          graph.reset();
        });
      }
    }, {
      key: '_onVisualizationChange',
      value: function _onVisualizationChange(evt) {
        this._graphs.forEach(function (graph) {
          if (graph.id() == evt.currentTarget.value()) {
            graph.view().show();
          } else {
            graph.view().hide();
          }
        });
        Globals.get('Logger').log({
          type: "visualization_change",
          category: "results",
          data: {
            visualization: evt.currentTarget.value()
          }
        });
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        this.dispatchEvent('ResultsView.RequestModelData', {
          tabId: evt.currentTarget.value()
        });
      }
    }]);

    return ResultsView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJWaXN1YWxSZXN1bHQiLCJTZWxlY3RGaWVsZCIsInZpc21hcCIsImNpcmNsZSIsImhpc3RvZ3JhbSIsInRpbWVzZXJpZXMiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdmlzdWFsUmVzdWx0IiwiY3JlYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblRpY2siLCJfZ3JhcGhzIiwiZ2V0IiwibWFwIiwidmlzQ29uZiIsInNldHRpbmdzIiwiaWQiLCJhZGRDaGlsZCIsInZpZXciLCJmb3JFYWNoIiwiZ3JhcGgiLCJtb2RlbE9wdHMiLCJ0YWJDb25mIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidG9VcHBlckNhc2UiLCJfbW9kZWxTZWxlY3QiLCJsYWJlbCIsIm9wdGlvbnMiLCJfb25Nb2RlbENoYW5nZSIsInZpc09wdHMiLCJfdmlzU2VsZWN0IiwiX29uVmlzdWFsaXphdGlvbkNoYW5nZSIsImN1cnJlbnRUYXJnZXQiLCJldnQiLCJ1cGRhdGUiLCJkYXRhIiwidGltZSIsImxpZ2h0cyIsImV4cCIsInJlcyIsIiRlbCIsImZpbmQiLCJodG1sIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsInRvTG9jYWxlU3RyaW5nIiwicmVzZXQiLCJoYW5kbGVEYXRhIiwiaGFuZGxlTGlnaHREYXRhIiwiY29uZmlndXJhdGlvbiIsInBsYXkiLCJtb2RlbCIsInRhYklkIiwiY29sb3IiLCJoYW5kbGVNb2RlbERhdGEiLCJ2YWx1ZSIsInNldFZhbHVlIiwiY2xlYXIiLCJzaG93IiwiaGlkZSIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsInZpc3VhbGl6YXRpb24iLCJkaXNwYXRjaEV2ZW50Il0sIm1hcHBp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QVFxQixHQUFSLGVBQXdCMEMsS0FBeEIsRUFBaUNDLEtBQWpDLEVBQVI7QUFDRDtBQUNELGFBQUs1QyxPQUFMLENBQWFRLE9BQWIsQ0FBcUIsVUFBQ0MsS0FBRCxFQUFXO0FBQzlCQSxnQkFBTTZCLFVBQU4sQ0FBaUJSLEdBQWpCLEVBQXNCLE9BQXRCLEVBQStCYyxLQUEvQjtBQUNELFNBRkQ7QUFHQSxhQUFLaEQsYUFBTCxDQUFtQmlELGVBQW5CLENBQW1DZixHQUFuQyxFQUF3Q1ksS0FBeEMsRUFBK0NFLEtBQS9DO0FBQ0EsWUFBSUQsU0FBUyxLQUFLM0IsWUFBTCxDQUFrQjhCLEtBQWxCLEVBQWIsRUFBd0MsS0FBSzlCLFlBQUwsQ0FBa0IrQixRQUFsQixDQUEyQkosS0FBM0I7QUFDekM7QUExRUg7QUFBQTtBQUFBLDhCQTRFVTtBQUNOLGFBQUtaLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGdDQUFkLEVBQWdEQyxJQUFoRDtBQUNBLGFBQUtyQyxhQUFMLENBQW1Cb0QsS0FBbkI7QUFDQSxhQUFLaEQsT0FBTCxDQUFhUSxPQUFiLENBQXFCLFVBQUNDLEtBQUQsRUFBVztBQUM5QkEsZ0JBQU00QixLQUFOO0FBQ0QsU0FGRDtBQUdEO0FBbEZIO0FBQUE7QUFBQSw2Q0FvRnlCYixHQXBGekIsRUFvRjhCO0FBQzFCLGFBQUt4QixPQUFMLENBQWFRLE9BQWIsQ0FBcUIsVUFBQ0MsS0FBRCxFQUFXO0FBQzlCLGNBQUlBLE1BQU1KLEVBQU4sTUFBY21CLElBQUlELGFBQUosQ0FBa0J1QixLQUFsQixFQUFsQixFQUE2QztBQUMzQ3JDLGtCQUFNRixJQUFOLEdBQWEwQyxJQUFiO0FBQ0QsV0FGRCxNQUVPO0FBQ0x4QyxrQkFBTUYsSUFBTixHQUFhMkMsSUFBYjtBQUNEO0FBQ0YsU0FORDtBQU9BdEUsZ0JBQVFxQixHQUFSLENBQVksUUFBWixFQUFzQmtELEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxzQkFEa0I7QUFFeEJDLG9CQUFVLFNBRmM7QUFHeEIzQixnQkFBTTtBQUNKNEIsMkJBQWU5QixJQUFJRCxhQUFKLENBQWtCdUIsS0FBbEI7QUFEWDtBQUhrQixTQUExQjtBQU9EO0FBbkdIO0FBQUE7QUFBQSxxQ0FxR2lCdEIsR0FyR2pCLEVBcUdzQjtBQUNsQixhQUFLK0IsYUFBTCxDQUFtQiw4QkFBbkIsRUFBbUQ7QUFDakRaLGlCQUFPbkIsSUFBSUQsYUFBSixDQUFrQnVCLEtBQWxCO0FBRDBDLFNBQW5EO0FBR0Q7QUF6R0g7O0FBQUE7QUFBQSxJQUFpQy9ELE9BQWpDO0FBMkdELENBaklEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
