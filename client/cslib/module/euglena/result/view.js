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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJWaXN1YWxSZXN1bHQiLCJTZWxlY3RGaWVsZCIsInZpc21hcCIsImNpcmNsZSIsImhpc3RvZ3JhbSIsInRpbWVzZXJpZXMiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdmlzdWFsUmVzdWx0IiwiY3JlYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblRpY2siLCJfZ3JhcGhzIiwiZ2V0IiwibWFwIiwidmlzQ29uZiIsInNldHRpbmdzIiwiaWQiLCJhZGRDaGlsZCIsInZpZXciLCJmb3JFYWNoIiwiZ3JhcGgiLCJtb2RlbE9wdHMiLCJ0YWJDb25mIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidG9VcHBlckNhc2UiLCJfbW9kZWxTZWxlY3QiLCJsYWJlbCIsIm9wdGlvbnMiLCJfb25Nb2RlbENoYW5nZSIsInZpc09wdHMiLCJfdmlzU2VsZWN0IiwiX29uVmlzdWFsaXphdGlvbkNoYW5nZSIsImN1cnJlbnRUYXJnZXQiLCJldnQiLCJ1cGRhdGUiLCJkYXRhIiwidGltZSIsImxpZ2h0cyIsImV4cCIsInJlcyIsIiRlbCIsImZpbmQiLCJodG1sIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsInRvTG9jYWxlU3RyaW5nIiwicmVzZXQiLCJoYW5kbGVEYXRhIiwiaGFuZGxlTGlnaHREYXRhIiwiY29uZmlndXJhdGlvbiIsInBsYXkiLCJtb2RlbCIsInRhYklkIiwiY29sb3IiLCJoYW5kbGVNb2RlbERhdGEiLCJ2YWx1ZSIsInNldFZhbHVlIiwiY2xlYXIiLCJzaG93IiwiaGlkZSIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsInZpc3VhbGl6YXRpb24iLCJkaXNwYXRjaEV2ZW50IiwiZ2V0QWJs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RGtCO0FBRXhCQyxvQkFBVSxTQUZjO0FBR3hCM0IsZ0JBQU07QUFDSjRCLDJCQUFlOUIsSUFBSUQsYUFBSixDQUFrQnVCLEtBQWxCO0FBRFg7QUFIa0IsU0FBMUI7QUFPRDtBQXBHSDtBQUFBO0FBQUEscUNBc0dpQnRCLEdBdEdqQixFQXNHc0I7QUFDbEIsYUFBSytCLGFBQUwsQ0FBbUIsOEJBQW5CLEVBQW1EO0FBQ2pEWixpQkFBT25CLElBQUlELGFBQUosQ0FBa0J1QixLQUFsQjtBQUQwQyxTQUFuRDtBQUdEO0FBMUdIO0FBQUE7QUFBQSw4QkE0R1U7QUFDTixhQUFLRSxLQUFMO0FBQ0EsYUFBS2hDLFlBQUwsQ0FBa0IrQixRQUFsQixDQUEyQixNQUEzQjtBQUNBLGFBQUsxQixVQUFMLENBQWdCMEIsUUFBaEIsQ0FBeUIsS0FBSzFCLFVBQUwsQ0FBZ0JtQyxjQUFoQixHQUFpQyxDQUFqQyxDQUF6QjtBQUNEO0FBaEhIOztBQUFBO0FBQUEsSUFBaUN6RSxPQUFqQztBQWtIRCxDQXhJRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9yZXN1bHQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3Jlc3VsdHMuaHRtbCcpLFxuICAgIENpcmNsZUhpc3RvZ3JhbSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoJyksXG4gICAgSGlzdG9ncmFtID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvaGlzdG9ncmFtZ3JhcGgvaGlzdG9ncmFtZ3JhcGgnKSxcbiAgICBUaW1lU2VyaWVzID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvdGltZXNlcmllc2dyYXBoL3RpbWVzZXJpZXNncmFwaCcpLFxuICAgIFZpc3VhbFJlc3VsdCA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L3Zpc3VhbHJlc3VsdC92aXN1YWxyZXN1bHQnKSxcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJylcbiAgO1xuXG4gIGNvbnN0IHZpc21hcCA9IHtcbiAgICBjaXJjbGU6IENpcmNsZUhpc3RvZ3JhbSxcbiAgICBoaXN0b2dyYW06IEhpc3RvZ3JhbSxcbiAgICB0aW1lc2VyaWVzOiBUaW1lU2VyaWVzXG4gIH1cblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFJlc3VsdHNWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IodG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblRpY2snLCAnX29uVmlzdWFsaXphdGlvbkNoYW5nZScsICdfb25Nb2RlbENoYW5nZSddKTtcblxuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0ID0gVmlzdWFsUmVzdWx0LmNyZWF0ZSgpO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmFkZEV2ZW50TGlzdGVuZXIoJ1Zpc3VhbFJlc3VsdC5UaWNrJywgdGhpcy5fb25UaWNrKTtcbiAgICAgIHRoaXMuX2dyYXBocyA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlzdWFsaXphdGlvbi52aXN1YWxpemF0aW9uVHlwZXMnKS5tYXAoKHZpc0NvbmYpID0+IHtcbiAgICAgICAgdmlzQ29uZi5zZXR0aW5ncy5pZCA9IHZpc0NvbmYuaWQ7XG4gICAgICAgIHJldHVybiB2aXNtYXBbdmlzQ29uZi5pZF0uY3JlYXRlKHZpc0NvbmYuc2V0dGluZ3MpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzdWFsUmVzdWx0LnZpZXcoKSwgJy5yZXN1bHRzX19ldWdsZW5hJyk7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChncmFwaC52aWV3KCksICcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1vZGVsT3B0cyA9IHtcbiAgICAgICAgJ25vbmUnOiAnTm8gTW9kZWwnXG4gICAgICB9O1xuICAgICAgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykuZm9yRWFjaCgodGFiQ29uZiwgaW5kKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBpbmQpXG4gICAgICAgIG1vZGVsT3B0c1tpZF0gPSBgTW9kZWwgJHtpZC50b1VwcGVyQ2FzZSgpfWA7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0ID0gU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdtb2RlbCcsXG4gICAgICAgIGxhYmVsOiAnTW9kZWwnLFxuICAgICAgICBvcHRpb25zOiBtb2RlbE9wdHNcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tb2RlbFNlbGVjdC52aWV3KCksICcucmVzdWx0c19fY29udHJvbHNfX21vZGVsJyk7XG4gICAgICB0aGlzLl9tb2RlbFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcblxuICAgICAgY29uc3QgdmlzT3B0cyA9IHt9O1xuICAgICAgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy52aXN1YWxpemF0aW9uLnZpc3VhbGl6YXRpb25UeXBlcycpLmZvckVhY2goKHZpc0NvbmYpID0+IHtcbiAgICAgICAgdmlzT3B0c1t2aXNDb25mLmlkXSA9IHZpc0NvbmYubGFiZWw7XG4gICAgICB9KVxuXG4gICAgICB0aGlzLl92aXNTZWxlY3QgPSBTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogXCJ2aXN1YWxpemF0aW9uXCIsXG4gICAgICAgIGxhYmVsOiAnVmlzdWFsaXphdGlvbicsXG4gICAgICAgIG9wdGlvbnM6IHZpc09wdHNcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXNTZWxlY3QudmlldygpLCAnLnJlc3VsdHNfX2NvbnRyb2xzX192aXN1YWxpemF0aW9uJyk7XG4gICAgICB0aGlzLl92aXNTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKTtcbiAgICAgIHRoaXMuX29uVmlzdWFsaXphdGlvbkNoYW5nZSh7IGN1cnJlbnRUYXJnZXQ6IHRoaXMuX3Zpc1NlbGVjdCB9KTtcbiAgICAgIFxuICAgIH1cblxuICAgIF9vblRpY2soZXZ0KSB7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgZ3JhcGgudXBkYXRlKGV2dC5kYXRhLnRpbWUsIGV2dC5kYXRhLmxpZ2h0cyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGVFeHBlcmltZW50UmVzdWx0cyhleHAsIHJlcykge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2NvbnRyb2xzX19leHBlcmltZW50JykuaHRtbChgPGxhYmVsPkV4cGVyaW1lbnQ6PC9sYWJlbD48c3BhbiBjbGFzcz1cIlwiPiR7KG5ldyBEYXRlKGV4cC5kYXRlX2NyZWF0ZWQpKS50b0xvY2FsZVN0cmluZygpfTwvc3Bhbj5gKVxuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7IFxuICAgICAgICBncmFwaC5yZXNldCgpO1xuICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ2xpdmUnKTtcbiAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCAnbW9kZWwnKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmhhbmRsZUxpZ2h0RGF0YShleHAuY29uZmlndXJhdGlvbik7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQucGxheShyZXMpO1xuICAgIH1cblxuICAgIGhhbmRsZU1vZGVsUmVzdWx0cyhtb2RlbCwgcmVzLCB0YWJJZCkge1xuICAgICAgbGV0IGNvbG9yID0gMDtcbiAgICAgIGlmICh0YWJJZCAhPSAnbm9uZScpIHtcbiAgICAgICAgY29sb3IgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHt0YWJJZH1gKS5jb2xvcigpO1xuICAgICAgfVxuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbW9kZWwnLCBjb2xvcik7XG4gICAgICB9KVxuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmhhbmRsZU1vZGVsRGF0YShyZXMsIG1vZGVsLCBjb2xvcik7XG4gICAgICBpZiAodGFiSWQgIT0gdGhpcy5fbW9kZWxTZWxlY3QudmFsdWUoKSkgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUodGFiSWQpO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2NvbnRyb2xzX19leHBlcmltZW50JykuaHRtbChgPGxhYmVsPkV4cGVyaW1lbnQ6PC9sYWJlbD48c3BhbiBjbGFzcz1cIlwiPihOZXcgRXhwZXJpbWVudCk8L3NwYW4+YClcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5jbGVhcigpO1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBfb25WaXN1YWxpemF0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGlmIChncmFwaC5pZCgpID09IGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKCkpIHtcbiAgICAgICAgICBncmFwaC52aWV3KCkuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyYXBoLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJ2aXN1YWxpemF0aW9uX2NoYW5nZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1Jlc3VsdHNWaWV3LlJlcXVlc3RNb2RlbERhdGEnLCB7XG4gICAgICAgIHRhYklkOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUoJ25vbmUnKTtcbiAgICAgIHRoaXMuX3Zpc1NlbGVjdC5zZXRWYWx1ZSh0aGlzLl92aXNTZWxlY3QuZ2V0QWJsZU9wdGlvbnMoKVswXSlcbiAgICB9XG4gIH1cbn0pIl19
