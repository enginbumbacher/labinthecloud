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
          graph.handleData(null, 'model');
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
    }, {
      key: 'reset',
      value: function reset() {
        this.clear();
        this._modelSelect.setValue('none');
        this._visSelect.setValue(this._visSelect.getAbleOptions()[0]);
      }
    }]);

    return ResultsView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJWaXN1YWxSZXN1bHQiLCJTZWxlY3RGaWVsZCIsInZpc21hcCIsImNpcmNsZSIsImhpc3RvZ3JhbSIsInRpbWVzZXJpZXMiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdmlzdWFsUmVzdWx0IiwiY3JlYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblRpY2siLCJfZ3JhcGhzIiwiZ2V0IiwibWFwIiwidmlzQ29uZiIsInNldHRpbmdzIiwiaWQiLCJhZGRDaGlsZCIsInZpZXciLCJmb3JFYWNoIiwiZ3JhcGgiLCJtb2RlbE9wdHMiLCJ0YWJDb25mIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidG9VcHBlckNhc2UiLCJfbW9kZWxTZWxlY3QiLCJsYWJlbCIsIm9wdGlvbnMiLCJfb25Nb2RlbENoYW5nZSIsInZpc09wdHMiLCJfdmlzU2VsZWN0IiwiX29uVmlzdWFsaXphdGlvbkNoYW5nZSIsImN1cnJlbnRUYXJnZXQiLCJldnQiLCJ1cGRhdGUiLCJkYXRhIiwidGltZSIsImxpZ2h0cyIsImV4cCIsInJlcyIsIiRlbCIsImZpbmQiLCJodG1sIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsInRvTG9jYWxlU3RyaW5nIiwicmVzZXQiLCJoYW5kbGVEYXRhIiwiaGFuZGxlTGlnaHREYXRhIiwiY29uZmlndXJhdGlvbiIsInBsYXkiLCJtb2RlbCIsInRhYklkIiwiY29sb3IiLCJoYW5kbGVNb2RlbERhdGEiLCJ2YWx1ZSIsInNldFZhbHVlIiwiY2xlYXIiLCJzaG93IiwiaGlkZSIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsInZpc3VhbGl6YXRpb24iLCJkaXNwYXRjaEV2ZW50IiwiZ2V0QWJs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RGtCO0FBRXhCQyxvQkFBVSxTQUZjO0FBR3hCM0IsZ0JBQU07QUFDSjRCLDJCQUFlOUIsSUFBSUQsYUFBSixDQUFrQnVCLEtBQWxCO0FBRFg7QUFIa0IsU0FBMUI7QUFPRDtBQXBHSDtBQUFBO0FBQUEscUNBc0dpQnRCLEdBdEdqQixFQXNHc0I7QUFDbEIsYUFBSytCLGFBQUwsQ0FBbUIsOEJBQW5CLEVBQW1EO0FBQ2pEWixpQkFBT25CLElBQUlELGFBQUosQ0FBa0J1QixLQUFsQjtBQUQwQyxTQUFuRDtBQUdEO0FBMUdIO0FBQUE7QUFBQSw4QkE0R1U7QUFDTixhQUFLRSxLQUFMO0FBQ0EsYUFBS2hDLFlBQUwsQ0FBa0IrQixRQUFsQixDQUEyQixNQUEzQjtBQUNBLGFBQUsxQixVQUFMLENBQWdCMEIsUUFBaEIsQ0FBeUIsS0FBSzFCLFVBQUwsQ0FBZ0JtQyxjQUFoQixHQUFpQyxDQUFqQyxDQUF6QjtBQUNEO0FBaEhIOztBQUFBO0FBQUEsSUFBaUN6RSxPQUFqQztBQWtIRCxDQXhJRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9yZXN1bHQvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
