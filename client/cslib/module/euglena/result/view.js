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

      Utils.bindMethods(_this, ['_onTick', '_onVisualizationChange', '_onModelChange', 'activateModelComparison']);

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

      var modelOpts = {};
      if (Globals.get('AppConfig.system.enableDirectComparison') && Globals.get('AppConfig.model.tabs').length == 2) {
        modelOpts = {
          'none': 'No Model',
          'both': 'Both Models'
        };
      } else {
        modelOpts = {
          'none': 'No Model'
        };
      }

      Globals.get('AppConfig.model.tabs').forEach(function (tabConf, ind) {
        var id = Globals.get('AppConfig.model.tabs.length') == 1 ? '' : String.fromCharCode(97 + ind);
        modelOpts[id] = 'Model ' + id.toUpperCase();
      });
      _this._modelSelect = SelectField.create({
        id: 'model',
        label: 'Model',
        options: modelOpts,
        initialValue: 'none'
      });
      _this._modelSelect.setValue('none');

      if (Globals.get('AppConfig.model.tabs').length) {
        _this.addChild(_this._modelSelect.view(), '.results__controls__model');
        _this._modelSelect.addEventListener('Field.Change', _this._onModelChange);
      }

      if (Globals.get('AppConfig.system.enableDirectComparison')) {
        _this._visualResult_2 = VisualResult.create();
        _this._visualResult_2.hideControls();
        _this.$el.find('.results__visuals').append('<div class="results__euglena_2">\n        <h2 class="results__title">View of Microscope and Model B</h2></div>');
        _this.addChild(_this._visualResult_2.view(), '.results__euglena_2');
        _this.$el.find('.results__euglena_2').hide();
      }

      var visOpts = {};
      Globals.get('AppConfig.visualization.visualizationTypes').forEach(function (visConf) {
        visOpts[visConf.id] = visConf.label;
      });

      _this._visSelect = SelectField.create({
        id: "visualization",
        label: 'Visualization',
        options: visOpts
      });

      if (Object.keys(visOpts).length) {
        _this.addChild(_this._visSelect.view(), '.results__controls__visualization');
        _this._visSelect.addEventListener('Field.Change', _this._onVisualizationChange);
        _this._onVisualizationChange({ currentTarget: _this._visSelect });
      } else {
        _this.$el.find('.results__visualization').hide();
      }

      Globals.get('Relay').addEventListener('EuglenaModel.directComparison', _this.activateModelComparison);

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
        var modelComparison = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        this.$el.find('.results__controls__experiment').html('<label>Experiment:</label><span class="">' + new Date(exp.date_created).toLocaleString() + '</span>');
        if (this.$el.find('.results__visualization').is(':visible')) {
          this._graphs.forEach(function (graph) {
            graph.reset();
            graph.handleData(res, 'live');
            graph.handleData(null, 'model');
          });
        }

        this._visualResult.handleLightData(exp.configuration);
        this._visualResult.play(res);

        if (Globals.get('AppConfig.system.enableDirectComparison')) {
          this._visualResult_2.handleLightData(exp.configuration);
          this._visualResult_2.play(res);
        }
      }
    }, {
      key: 'handleModelResults',
      value: function handleModelResults(model, res, tabId) {
        var _this2 = this;

        var modelComparison = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;


        if (!modelComparison) {

          var color = 0;
          if (tabId != 'none') {
            color = Globals.get('ModelTab.' + tabId).color();
          }
          this._graphs.forEach(function (graph) {
            if (Globals.get('AppConfig.system.expModelModality') == 'sequential') {
              if (tabId == 'none') {
                graph.setLive(true);
                graph.handleData(null, 'model');
              } else {
                graph.setLive(false);
                graph.handleData(res, 'model', color);
              }
            } else {
              graph.handleData(res, 'model', color);
            }
          });
          this._visualResult.handleModelData(res, model, color); // Activate the euglena mini models for the corresponding Model
          Globals.get('Relay').dispatchEvent('VisualResult.ResetRequest', {});
          if (tabId != this._modelSelect.value()) {
            this._silenceModelSelect = true;
            this._modelSelect.setValue(tabId).then(function () {
              _this2._silenceModelSelect = false;
            });
          }
        } else {
          // If model comparison is activated
          this._graphs.forEach(function (graph) {
            graph.handleData(null, 'model');
          });

          var _color = Globals.get('ModelTab.' + tabId).color();

          if (tabId == 'a') {
            this._visualResult.handleModelData(res, model, _color);
          } else if (tabId == 'b') {
            this._visualResult_2.handleModelData(res, model, _color);
          }
        }
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
      key: 'showVideo',
      value: function showVideo(activeVideo) {
        //this._visualResult.showVideo(activeVideo);
        this._visualResult.dispatchEvent('VideoResult.ShowVideo', { showVideo: activeVideo });
        if (Globals.get('AppConfig.system.enableDirectComparison')) {
          this._visualResult_2.dispatchEvent('VideoResult.ShowVideo', { showVideo: activeVideo });
        }
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
        if (this._silenceModelSelect) return;
        this.dispatchEvent('ResultsView.RequestModelData', {
          tabId: evt.currentTarget.value()
        });
      }
    }, {
      key: 'activateModelComparison',
      value: function activateModelComparison() {
        if (Globals.get('directModelComparison')) {
          this.$el.find('.results__visualization').hide();
          this._visSelect.hide();

          this.$el.find('.results__euglena').children('.results__title').html("View of Microscope and Model A");
          this.$el.find('.results__euglena_2').show();
        } else {
          // hide the div for visualResult_2

          this.$el.find('.results__euglena').children('.results__title').html("View of Microscope");
          this.$el.find('.results__euglena_2').hide();

          if (Object.keys(this._visSelect._model._data.options).length) {
            this.$el.find('.results__visualization').show();
            this._visSelect.show();
          }
        }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJWaXN1YWxSZXN1bHQiLCJTZWxlY3RGaWVsZCIsInZpc21hcCIsImNpcmNsZSIsImhpc3RvZ3JhbSIsInRpbWVzZXJpZXMiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdmlzdWFsUmVzdWx0IiwiY3JlYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblRpY2siLCJfZ3JhcGhzIiwiZ2V0IiwibWFwIiwidmlzQ29uZiIsInNldHRpbmdzIiwiaWQiLCJhZGRDaGlsZCIsInZpZXciLCJmb3JFYWNoIiwiZ3JhcGgiLCJtb2RlbE9wdHMiLCJsZW5ndGgiLCJ0YWJDb25mIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidG9VcHBlckNhc2UiLCJfbW9kZWxTZWxlY3QiLCJsYWJlbCIsIm9wdGlvbnMiLCJpbml0aWFsVmFsdWUiLCJzZXRWYWx1ZSIsIl9vbk1vZGVsQ2hhbmdlIiwiX3Zpc3VhbFJlc3VsdF8yIiwiaGlkZUNvbnRyb2xzIiwiJGVsIiwiZmluZCIsImFwcGVuZCIsImhpZGUiLCJ2aXNPcHRzIiwiX3Zpc1NlbGVjdCIsIk9iamVjdCIsImtleXMiLCJfb25WaXN1YWxpemF0aW9uQ2hhbmdlIiwiY3VycmVudFRhcmdldCIsImFjdGl2YXRlTW9kZWxDb21wYXJpc29uIiwiZXZ0IiwidXBkYXRlIiwiZGF0YSIsInRpbWUiLCJsaWdodHMiLCJleHAiLCJyZXMiLCJtb2RlbENvbXBhcmlzb24iLCJodG1sIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsInRvTG9jYWxlU3RyaW5nIiwiaXMiLCJyZXNldCIsImhhbmRsZURhdGEiLCJoYW5kbGVMaWdodERhdGEiLCJjb25maWd1cmF0aW9uIiwicGxheSIsIm1vZGVsIiwidGFiSWQiLCJjb2xvciIsInNldExpdmUiLCJoYW5kbGVNb2RlbERhdGEiLCJkaXNwYXRjaEV2ZW50IiwidmFsdWUiLCJfc2lsZW5jZU1vZGVsU2VsZWN0IiwidGhlbiIsImNsZWFyIiwiYWN0aXZlVmlkZW8iLCJzaG93VmlkZW8iLCJzaG93IiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwidmlzdWFsaXphdGlvbiIsImNoaWxkcmVuIiwiX21vZGVsIiwiX2RhdGEiLCJnZXRBYmxlT3B0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHFCQUFSLENBRGI7QUFBQSxNQUVFTSxrQkFBa0JOLFFBQVEsMkNBQVIsQ0FGcEI7QUFBQSxNQUdFTyxZQUFZUCxRQUFRLGlEQUFSLENBSGQ7QUFBQSxNQUlFUSxhQUFhUixRQUFRLG1EQUFSLENBSmY7QUFBQSxNQUtFUyxlQUFlVCxRQUFRLDZDQUFSLENBTGpCO0FBQUEsTUFNRVUsY0FBY1YsUUFBUSxrQ0FBUixDQU5oQjs7QUFTQSxNQUFNVyxTQUFTO0FBQ2JDLFlBQVFOLGVBREs7QUFFYk8sZUFBV04sU0FGRTtBQUdiTyxnQkFBWU47QUFIQyxHQUFmOztBQU1BUixVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UseUJBQVllLElBQVosRUFBa0I7QUFBQTs7QUFBQSw0SEFDVkEsUUFBUVYsUUFERTs7QUFFaEJILFlBQU1jLFdBQU4sUUFBd0IsQ0FBQyxTQUFELEVBQVksd0JBQVosRUFBc0MsZ0JBQXRDLEVBQXdELHlCQUF4RCxDQUF4Qjs7QUFFQSxZQUFLQyxhQUFMLEdBQXFCUixhQUFhUyxNQUFiLEVBQXJCO0FB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LFFBQWhCLENBQXlCLEtBQUtTLFVBQUwsQ0FBZ0I0QyxjQUFoQixHQUFpQyxDQUFqQyxDQUF6QjtBQUNEO0FBck5IOztBQUFBO0FBQUEsSUFBaUMzRixPQUFqQztBQXVORCxDQTdPRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9yZXN1bHQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3Jlc3VsdHMuaHRtbCcpLFxuICAgIENpcmNsZUhpc3RvZ3JhbSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoJyksXG4gICAgSGlzdG9ncmFtID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvaGlzdG9ncmFtZ3JhcGgvaGlzdG9ncmFtZ3JhcGgnKSxcbiAgICBUaW1lU2VyaWVzID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvdGltZXNlcmllc2dyYXBoL3RpbWVzZXJpZXNncmFwaCcpLFxuICAgIFZpc3VhbFJlc3VsdCA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L3Zpc3VhbHJlc3VsdC92aXN1YWxyZXN1bHQnKSxcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJylcbiAgO1xuXG4gIGNvbnN0IHZpc21hcCA9IHtcbiAgICBjaXJjbGU6IENpcmNsZUhpc3RvZ3JhbSxcbiAgICBoaXN0b2dyYW06IEhpc3RvZ3JhbSxcbiAgICB0aW1lc2VyaWVzOiBUaW1lU2VyaWVzXG4gIH1cblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFJlc3VsdHNWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IodG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblRpY2snLCAnX29uVmlzdWFsaXphdGlvbkNoYW5nZScsICdfb25Nb2RlbENoYW5nZScsICdhY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbiddKTtcblxuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0ID0gVmlzdWFsUmVzdWx0LmNyZWF0ZSgpO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmFkZEV2ZW50TGlzdGVuZXIoJ1Zpc3VhbFJlc3VsdC5UaWNrJywgdGhpcy5fb25UaWNrKTtcbiAgICAgIHRoaXMuX2dyYXBocyA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlzdWFsaXphdGlvbi52aXN1YWxpemF0aW9uVHlwZXMnKS5tYXAoKHZpc0NvbmYpID0+IHtcbiAgICAgICAgdmlzQ29uZi5zZXR0aW5ncy5pZCA9IHZpc0NvbmYuaWQ7XG4gICAgICAgIHJldHVybiB2aXNtYXBbdmlzQ29uZi5pZF0uY3JlYXRlKHZpc0NvbmYuc2V0dGluZ3MpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzdWFsUmVzdWx0LnZpZXcoKSwgJy5yZXN1bHRzX19ldWdsZW5hJyk7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChncmFwaC52aWV3KCksICcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBtb2RlbE9wdHMgPSB7fTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykgJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykubGVuZ3RoID09IDIpIHtcbiAgICAgICAgbW9kZWxPcHRzID0ge1xuICAgICAgICAgJ25vbmUnOiAnTm8gTW9kZWwnLFxuICAgICAgICAgJ2JvdGgnOiAnQm90aCBNb2RlbHMnXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtb2RlbE9wdHMgPSB7XG4gICAgICAgICAnbm9uZSc6ICdObyBNb2RlbCdcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykuZm9yRWFjaCgodGFiQ29uZiwgaW5kKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicy5sZW5ndGgnKT09MSA/ICcnIDogU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGluZClcbiAgICAgICAgbW9kZWxPcHRzW2lkXSA9IGBNb2RlbCAke2lkLnRvVXBwZXJDYXNlKCl9YDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3QgPSBTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogJ21vZGVsJyxcbiAgICAgICAgbGFiZWw6ICdNb2RlbCcsXG4gICAgICAgIG9wdGlvbnM6IG1vZGVsT3B0cyxcbiAgICAgICAgaW5pdGlhbFZhbHVlOiAnbm9uZSdcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUoJ25vbmUnKVxuXG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fbW9kZWxTZWxlY3QudmlldygpLCAnLnJlc3VsdHNfX2NvbnRyb2xzX19tb2RlbCcpO1xuICAgICAgICB0aGlzLl9tb2RlbFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmVuYWJsZURpcmVjdENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHRfMiA9IFZpc3VhbFJlc3VsdC5jcmVhdGUoKTtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuaGlkZUNvbnRyb2xzKCk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxzJykuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicmVzdWx0c19fZXVnbGVuYV8yXCI+XG4gICAgICAgIDxoMiBjbGFzcz1cInJlc3VsdHNfX3RpdGxlXCI+VmlldyBvZiBNaWNyb3Njb3BlIGFuZCBNb2RlbCBCPC9oMj48L2Rpdj5gKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXN1YWxSZXN1bHRfMi52aWV3KCksICcucmVzdWx0c19fZXVnbGVuYV8yJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hXzInKS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZpc09wdHMgPSB7fTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlzdWFsaXphdGlvbi52aXN1YWxpemF0aW9uVHlwZXMnKS5mb3JFYWNoKCh2aXNDb25mKSA9PiB7XG4gICAgICAgIHZpc09wdHNbdmlzQ29uZi5pZF0gPSB2aXNDb25mLmxhYmVsO1xuICAgICAgfSlcblxuICAgICAgdGhpcy5fdmlzU2VsZWN0ID0gU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6IFwidmlzdWFsaXphdGlvblwiLFxuICAgICAgICBsYWJlbDogJ1Zpc3VhbGl6YXRpb24nLFxuICAgICAgICBvcHRpb25zOiB2aXNPcHRzXG4gICAgICB9KTtcblxuICAgICAgaWYoT2JqZWN0LmtleXModmlzT3B0cykubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzU2VsZWN0LnZpZXcoKSwgJy5yZXN1bHRzX19jb250cm9sc19fdmlzdWFsaXphdGlvbicpO1xuICAgICAgICB0aGlzLl92aXNTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKTtcbiAgICAgICAgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKHsgY3VycmVudFRhcmdldDogdGhpcy5fdmlzU2VsZWN0IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKS5oaWRlKCk7XG4gICAgICB9XG5cblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXVnbGVuYU1vZGVsLmRpcmVjdENvbXBhcmlzb24nLCB0aGlzLmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKTtcblxuICAgIH1cblxuICAgIF9vblRpY2soZXZ0KSB7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgZ3JhcGgudXBkYXRlKGV2dC5kYXRhLnRpbWUsIGV2dC5kYXRhLmxpZ2h0cyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGVFeHBlcmltZW50UmVzdWx0cyhleHAsIHJlcywgbW9kZWxDb21wYXJpc29uID0gZmFsc2UpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19jb250cm9sc19fZXhwZXJpbWVudCcpLmh0bWwoYDxsYWJlbD5FeHBlcmltZW50OjwvbGFiZWw+PHNwYW4gY2xhc3M9XCJcIj4keyhuZXcgRGF0ZShleHAuZGF0ZV9jcmVhdGVkKSkudG9Mb2NhbGVTdHJpbmcoKX08L3NwYW4+YClcbiAgICAgIGlmICh0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShyZXMsICdsaXZlJyk7XG4gICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCAnbW9kZWwnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5oYW5kbGVMaWdodERhdGEoZXhwLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LnBsYXkocmVzKTtcblxuICAgICAgaWYoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZW5hYmxlRGlyZWN0Q29tcGFyaXNvbicpKSB7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLmhhbmRsZUxpZ2h0RGF0YShleHAuY29uZmlndXJhdGlvbik7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLnBsYXkocmVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVNb2RlbFJlc3VsdHMobW9kZWwsIHJlcywgdGFiSWQsIG1vZGVsQ29tcGFyaXNvbiA9IGZhbHNlKSB7XG5cbiAgICAgIGlmICghbW9kZWxDb21wYXJpc29uKSB7XG5cbiAgICAgICAgbGV0IGNvbG9yID0gMDtcbiAgICAgICAgaWYgKHRhYklkICE9ICdub25lJykge1xuICAgICAgICAgIGNvbG9yID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7dGFiSWR9YCkuY29sb3IoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdzZXF1ZW50aWFsJykge1xuICAgICAgICAgICAgaWYgKHRhYklkID09ICdub25lJykge1xuICAgICAgICAgICAgICBncmFwaC5zZXRMaXZlKHRydWUpO1xuICAgICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsICdtb2RlbCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZ3JhcGguc2V0TGl2ZShmYWxzZSk7XG4gICAgICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbW9kZWwnLCBjb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbW9kZWwnLCBjb2xvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5oYW5kbGVNb2RlbERhdGEocmVzLCBtb2RlbCwgY29sb3IpOyAvLyBBY3RpdmF0ZSB0aGUgZXVnbGVuYSBtaW5pIG1vZGVscyBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgTW9kZWxcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnVmlzdWFsUmVzdWx0LlJlc2V0UmVxdWVzdCcse30pO1xuICAgICAgICBpZiAodGFiSWQgIT0gdGhpcy5fbW9kZWxTZWxlY3QudmFsdWUoKSkge1xuICAgICAgICAgIHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUodGFiSWQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc2lsZW5jZU1vZGVsU2VsZWN0ID0gZmFsc2U7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHsgLy8gSWYgbW9kZWwgY29tcGFyaXNvbiBpcyBhY3RpdmF0ZWRcbiAgICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCdtb2RlbCcpO1xuICAgICAgICB9KVxuXG4gICAgICAgIGxldCBjb2xvciA9IEdsb2JhbHMuZ2V0KGBNb2RlbFRhYi4ke3RhYklkfWApLmNvbG9yKCk7XG5cbiAgICAgICAgaWYgKHRhYklkID09ICdhJykge3RoaXMuX3Zpc3VhbFJlc3VsdC5oYW5kbGVNb2RlbERhdGEocmVzLCBtb2RlbCwgY29sb3IpfVxuICAgICAgICBlbHNlIGlmICh0YWJJZCA9PSAnYicpIHt0aGlzLl92aXN1YWxSZXN1bHRfMi5oYW5kbGVNb2RlbERhdGEocmVzLCBtb2RlbCwgY29sb3IpfVxuXG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fY29udHJvbHNfX2V4cGVyaW1lbnQnKS5odG1sKGA8bGFiZWw+RXhwZXJpbWVudDo8L2xhYmVsPjxzcGFuIGNsYXNzPVwiXCI+KE5ldyBFeHBlcmltZW50KTwvc3Bhbj5gKVxuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmNsZWFyKCk7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgZ3JhcGgucmVzZXQoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNob3dWaWRlbyhhY3RpdmVWaWRlbykge1xuICAgICAgLy90aGlzLl92aXN1YWxSZXN1bHQuc2hvd1ZpZGVvKGFjdGl2ZVZpZGVvKTtcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5kaXNwYXRjaEV2ZW50KCdWaWRlb1Jlc3VsdC5TaG93VmlkZW8nLCB7c2hvd1ZpZGVvOiBhY3RpdmVWaWRlb30pO1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmVuYWJsZURpcmVjdENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHRfMi5kaXNwYXRjaEV2ZW50KCdWaWRlb1Jlc3VsdC5TaG93VmlkZW8nLCB7c2hvd1ZpZGVvOiBhY3RpdmVWaWRlb30pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vblZpc3VhbGl6YXRpb25DaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgaWYgKGdyYXBoLmlkKCkgPT0gZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKSkge1xuICAgICAgICAgIGdyYXBoLnZpZXcoKS5zaG93KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ3JhcGgudmlldygpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInZpc3VhbGl6YXRpb25fY2hhbmdlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHZpc3VhbGl6YXRpb246IGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIGlmICh0aGlzLl9zaWxlbmNlTW9kZWxTZWxlY3QpIHJldHVybjtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnUmVzdWx0c1ZpZXcuUmVxdWVzdE1vZGVsRGF0YScsIHtcbiAgICAgICAgdGFiSWQ6IGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgYWN0aXZhdGVNb2RlbENvbXBhcmlzb24oKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuaGlkZSgpO1xuICAgICAgICB0aGlzLl92aXNTZWxlY3QuaGlkZSgpO1xuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hJykuY2hpbGRyZW4oJy5yZXN1bHRzX190aXRsZScpLmh0bWwoXCJWaWV3IG9mIE1pY3Jvc2NvcGUgYW5kIE1vZGVsIEFcIik7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hXzInKS5zaG93KCk7XG5cbiAgICAgIH0gZWxzZSB7IC8vIGhpZGUgdGhlIGRpdiBmb3IgdmlzdWFsUmVzdWx0XzJcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYScpLmNoaWxkcmVuKCcucmVzdWx0c19fdGl0bGUnKS5odG1sKFwiVmlldyBvZiBNaWNyb3Njb3BlXCIpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYV8yJykuaGlkZSgpO1xuXG4gICAgICAgIGlmKE9iamVjdC5rZXlzKHRoaXMuX3Zpc1NlbGVjdC5fbW9kZWwuX2RhdGEub3B0aW9ucykubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKS5zaG93KCk7XG4gICAgICAgICAgdGhpcy5fdmlzU2VsZWN0LnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKCdub25lJyk7XG4gICAgICB0aGlzLl92aXNTZWxlY3Quc2V0VmFsdWUodGhpcy5fdmlzU2VsZWN0LmdldEFibGVPcHRpb25zKClbMF0pXG4gICAgfVxuICB9XG59KVxuIl19
