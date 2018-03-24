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
      ComponentSpeed = require('euglena/component/componentspeedgraph/componentspeedgraph'),
      OrientationChange = require('euglena/component/orientationchangegraph/orientationchangegraph'),
      VisualResult = require('euglena/component/visualresult/visualresult'),
      SelectField = require('core/component/selectfield/field');

  var vismap = {
    circle: CircleHistogram,
    histogram: Histogram,
    timeseries: TimeSeries,
    componentspeed: ComponentSpeed,
    orientationchange: OrientationChange
  };

  require('link!./style.css');

  return function (_DomView) {
    _inherits(ResultsView, _DomView);

    function ResultsView(tmpl) {
      _classCallCheck(this, ResultsView);

      var _this = _possibleConstructorReturn(this, (ResultsView.__proto__ || Object.getPrototypeOf(ResultsView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onTick', '_onVisualizationChange', '_onModelChange', 'activateModelComparison', '_moveTabs']);

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

      _this.lightConfig = null;

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
        initialValue: 'none',
        description: 'Turn models on or off.'
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
        options: visOpts,
        description: 'Each visualization shows different aspects of how the Euglena or models behave.'
      });

      if (Object.keys(visOpts).length) {
        _this.addChild(_this._visSelect.view(), '.results__controls__visualization');
        _this._visSelect.addEventListener('Field.Change', _this._onVisualizationChange);
        _this._onVisualizationChange({ currentTarget: _this._visSelect });
      } else {
        _this.$el.find('.results__visualization').hide();
      }

      _this.$el.find('#moveTabs').click(_this._moveTabs);

      Globals.get('Relay').addEventListener('EuglenaModel.directComparison', _this.activateModelComparison);

      return _this;
    }

    _createClass(ResultsView, [{
      key: '_moveTabs',
      value: function _moveTabs() {
        if (this.$el.find('#moveTabs').hasClass('notflippedX')) {
          var hideTab = true;
          this.$el.find('#moveTabs').removeClass('notflippedX');
          this.$el.find('#moveTabs').addClass('flippedX');
        } else {
          var hideTab = false;
          this.$el.find('#moveTabs').removeClass('flippedX');
          this.$el.find('#moveTabs').addClass('notflippedX');
        }

        Globals.get('Relay').dispatchEvent('InteractiveTabs.Toggle', { hideTab: hideTab });
      }
    }, {
      key: '_onTick',
      value: function _onTick(evt) {
        if (this._graphs) {
          this._graphs.forEach(function (graph) {
            graph.update(evt.data.time, evt.data.lights);
          });
        }
      }
    }, {
      key: 'handleExperimentResults',
      value: function handleExperimentResults(exp, res) {
        var _this2 = this;

        var modelComparison = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        this.lightConfig = exp.configuration;
        this.$el.find('.results__controls__experiment').html('<label>Experiment:</label><span class="">' + new Date(exp.date_created).toLocaleString() + '</span>');
        if (this.$el.find('.results__visualization').is(':visible')) {
          this._graphs.forEach(function (graph) {
            graph.reset();
            graph.handleData(res, 'live', _this2.lightConfig);
            graph.handleData(null, 'model', _this2.lightConfig);
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
        var _this3 = this;

        var modelComparison = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;


        if (!modelComparison) {

          var color = 0;
          if (tabId != 'none') {
            if (model.sensorConfigJSON) {
              var numSensors = 0;
              Object.keys(JSON.parse(model.sensorConfigJSON)).forEach(function (key) {
                if (key.toLowerCase().match('sensor')) numSensors += 1;
              });
              if (numSensors == 2) {
                color = 0xF9001A;
              } else {
                color = Globals.get('ModelTab.' + tabId).color();
              }
            } else {
              color = Globals.get('ModelTab.' + tabId).color();
            }
          }
          this._graphs.forEach(function (graph) {
            if (Globals.get('AppConfig.system.expModelModality') === 'sequential') {
              if (tabId == 'none') {
                graph.setLive(true);
                graph.handleData(null, 'model', _this3.lightConfig);
              } else {
                graph.setLive(false);
                graph.handleData(res, 'model', _this3.lightConfig, color);
              }
            } else if (Globals.get('AppConfig.system.expModelModality') === 'justmodel') {
              if (tabId == 'none') {
                graph.setLive(false);
                graph.handleData(null, 'model', _this3.lightConfig);
              } else {
                graph.setLive(false);
                graph.handleData(res, 'model', _this3.lightConfig, color);
              }
            } else {
              graph.handleData(res, 'model', _this3.lightConfig, color);
            }
          });
          this._visualResult.handleModelData(res, model, color); // Activate the euglena mini models for the corresponding Model
          Globals.get('Relay').dispatchEvent('VisualResult.ResetRequest', {});
          if (tabId != this._modelSelect.value()) {
            this._silenceModelSelect = true;
            this._modelSelect.setValue(tabId).then(function () {
              _this3._silenceModelSelect = false;
            });
          }
        } else {
          // If model comparison is activated
          this._graphs.forEach(function (graph) {
            graph.handleData(null, 'model', _this3.lightConfig);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJDb21wb25lbnRTcGVlZCIsIk9yaWVudGF0aW9uQ2hhbmdlIiwiVmlzdWFsUmVzdWx0IiwiU2VsZWN0RmllbGQiLCJ2aXNtYXAiLCJjaXJjbGUiLCJoaXN0b2dyYW0iLCJ0aW1lc2VyaWVzIiwiY29tcG9uZW50c3BlZWQiLCJvcmllbnRhdGlvbmNoYW5nZSIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl92aXN1YWxSZXN1bHQiLCJjcmVhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVGljayIsIl9ncmFwaHMiLCJnZXQiLCJtYXAiLCJ2aXNDb25mIiwic2V0dGluZ3MiLCJpZCIsImFkZENoaWxkIiwidmlldyIsImZvckVhY2giLCJncmFwaCIsImxpZ2h0Q29uZmlnIiwibW9kZWxPcHRzIiwibGVuZ3RoIiwidGFiQ29uZiIsImluZCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsInRvVXBwZXJDYXNlIiwiX21vZGVsU2VsZWN0IiwibGFiZWwiLCJvcHRpb25zIiwiaW5pdGlhbFZhbHVlIiwiZGVzY3JpcHRpb24iLCJzZXRWYWx1ZSIsIl9vbk1vZGVsQ2hhbmdlIiwiX3Zpc3VhbFJlc3VsdF8yIiwiaGlkZUNvbnRyb2xzIiwiJGVsIiwiZmluZCIsImFwcGVuZCIsImhpZGUiLCJ2aXNPcHRzIiwiX3Zpc1NlbGVjdCIsIk9iamVjdCIsImtleXMiLCJfb25WaXN1YWxpemF0aW9uQ2hhbmdlIiwiY3VycmVudFRhcmdldCIsImNsaWNrIiwiX21vdmVUYWJzIiwiYWN0aXZhdGVNb2RlbENvbXBhcmlzb24iLCJoYXNDbGFzcyIsImhpZGVUYWIiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiZGlzcGF0Y2hFdmVudCIsImV2dCIsInVwZGF0ZSIsImRhdGEiLCJ0aW1lIiwibGlnaHRzIiwiZXhwIiwicmVzIiwibW9kZWxDb21wYXJpc29uIiwiY29uZmlndXJhdGlvbiIsImh0bWwiLCJEYXRlIiwiZGF0ZV9jcmVhdGVkIiwidG9Mb2NhbGVTdHJpbmciLCJpcyIsInJlc2V0IiwiaGFuZGxlRGF0YSIsImhhbmRsZUxpZ2h0RGF0YSIsInBsYXkiLCJtb2RlbCIsInRhYklkIiwiY29sb3IiLCJzZW5zb3JDb25maWdKU09OIiwibnVtU2Vuc29ycyIsIkpTT04iLCJwYXJzZSIsImtleSIsInRvTG93ZXJDYXNlIiwibWF0Y2giLCJzZXRMaXZlIiwiaGFuZGxlTW9kZWxEYXRhIiwidmFsdWUiLCJfc2lsZW5jZU1vZGVsU2VsZWN0IiwidGhlbiIsImNsZWFyIiwiYWN0aXZlVmlkZW8iLCJzaG93VmlkZW8iLCJzaG93IiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwidmlzdWFsaXphdGlvbiIsImNoaWxkcmVuIiwiX21vZGVsIiwiX2RhdGEiLCJnZXRBYmxlT3B0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHFCQUFSLENBRGI7QUFBQSxNQUVFTSxrQkFBa0JOLFFBQVEsMkNBQVIsQ0FGcEI7QUFBQSxNQUdFTyxZQUFZUCxRQUFRLGlEQUFSLENBSGQ7QUFBQSxNQUlFUSxhQUFhUixRQUFRLG1EQUFSLENBSmY7QUFBQSxNQUtFUyxpQkFBaUJULFFBQVEsMkRBQVIsQ0FMbkI7QUFBQSxNQU1FVSxvQkFBb0JWLFFBQVEsaUVBQVIsQ0FOdEI7QUFBQSxNQU9FVyxlQUFlWCxRQUFRLDZDQUFSLENB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QSw4QkEyUFU7QUFDTixhQUFLSCxLQUFMO0FBQ0EsYUFBSzVELFlBQUwsQ0FBa0JLLFFBQWxCLENBQTJCLE1BQTNCO0FBQ0EsYUFBS1MsVUFBTCxDQUFnQlQsUUFBaEIsQ0FBeUIsS0FBS1MsVUFBTCxDQUFnQnlELGNBQWhCLEdBQWlDLENBQWpDLENBQXpCO0FBQ0Q7QUEvUEg7O0FBQUE7QUFBQSxJQUFpQzlHLE9BQWpDO0FBaVFELENBM1JEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vcmVzdWx0cy5odG1sJyksXG4gICAgQ2lyY2xlSGlzdG9ncmFtID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvY2lyY2xlZ3JhcGgvY2lyY2xlZ3JhcGgnKSxcbiAgICBIaXN0b2dyYW0gPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC9oaXN0b2dyYW1ncmFwaCcpLFxuICAgIFRpbWVTZXJpZXMgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdGltZXNlcmllc2dyYXBoJyksXG4gICAgQ29tcG9uZW50U3BlZWQgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9jb21wb25lbnRzcGVlZGdyYXBoL2NvbXBvbmVudHNwZWVkZ3JhcGgnKSxcbiAgICBPcmllbnRhdGlvbkNoYW5nZSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L29yaWVudGF0aW9uY2hhbmdlZ3JhcGgvb3JpZW50YXRpb25jaGFuZ2VncmFwaCcpLFxuICAgIFZpc3VhbFJlc3VsdCA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L3Zpc3VhbHJlc3VsdC92aXN1YWxyZXN1bHQnKSxcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJylcbiAgO1xuXG4gIGNvbnN0IHZpc21hcCA9IHtcbiAgICBjaXJjbGU6IENpcmNsZUhpc3RvZ3JhbSxcbiAgICBoaXN0b2dyYW06IEhpc3RvZ3JhbSxcbiAgICB0aW1lc2VyaWVzOiBUaW1lU2VyaWVzLFxuICAgIGNvbXBvbmVudHNwZWVkOiBDb21wb25lbnRTcGVlZCxcbiAgICBvcmllbnRhdGlvbmNoYW5nZTogT3JpZW50YXRpb25DaGFuZ2VcbiAgfVxuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgUmVzdWx0c1ZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcih0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVGljaycsICdfb25WaXN1YWxpemF0aW9uQ2hhbmdlJywgJ19vbk1vZGVsQ2hhbmdlJywgJ2FjdGl2YXRlTW9kZWxDb21wYXJpc29uJywgJ19tb3ZlVGFicyddKTtcblxuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0ID0gVmlzdWFsUmVzdWx0LmNyZWF0ZSgpO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmFkZEV2ZW50TGlzdGVuZXIoJ1Zpc3VhbFJlc3VsdC5UaWNrJywgdGhpcy5fb25UaWNrKTtcbiAgICAgIHRoaXMuX2dyYXBocyA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlzdWFsaXphdGlvbi52aXN1YWxpemF0aW9uVHlwZXMnKS5tYXAoKHZpc0NvbmYpID0+IHtcbiAgICAgICAgdmlzQ29uZi5zZXR0aW5ncy5pZCA9IHZpc0NvbmYuaWQ7XG4gICAgICAgIHJldHVybiB2aXNtYXBbdmlzQ29uZi5pZF0uY3JlYXRlKHZpc0NvbmYuc2V0dGluZ3MpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzdWFsUmVzdWx0LnZpZXcoKSwgJy5yZXN1bHRzX19ldWdsZW5hJyk7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChncmFwaC52aWV3KCksICcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubGlnaHRDb25maWcgPSBudWxsO1xuXG4gICAgICB2YXIgbW9kZWxPcHRzID0ge307XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZW5hYmxlRGlyZWN0Q29tcGFyaXNvbicpICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmxlbmd0aCA9PSAyKSB7XG4gICAgICAgIG1vZGVsT3B0cyA9IHtcbiAgICAgICAgICdub25lJzogJ05vIE1vZGVsJyxcbiAgICAgICAgICdib3RoJzogJ0JvdGggTW9kZWxzJ1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW9kZWxPcHRzID0ge1xuICAgICAgICAgJ25vbmUnOiAnTm8gTW9kZWwnXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmZvckVhY2goKHRhYkNvbmYsIGluZCkgPT4ge1xuICAgICAgICBsZXQgaWQgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnRhYnMubGVuZ3RoJyk9PTEgPyAnJyA6IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBpbmQpXG4gICAgICAgIG1vZGVsT3B0c1tpZF0gPSBgTW9kZWwgJHtpZC50b1VwcGVyQ2FzZSgpfWA7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0ID0gU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdtb2RlbCcsXG4gICAgICAgIGxhYmVsOiAnTW9kZWwnLFxuICAgICAgICBvcHRpb25zOiBtb2RlbE9wdHMsXG4gICAgICAgIGluaXRpYWxWYWx1ZTogJ25vbmUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1R1cm4gbW9kZWxzIG9uIG9yIG9mZi4nXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKCdub25lJylcblxuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX21vZGVsU2VsZWN0LnZpZXcoKSwgJy5yZXN1bHRzX19jb250cm9sc19fbW9kZWwnKTtcbiAgICAgICAgdGhpcy5fbW9kZWxTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIgPSBWaXN1YWxSZXN1bHQuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLmhpZGVDb250cm9scygpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFscycpLmFwcGVuZChgPGRpdiBjbGFzcz1cInJlc3VsdHNfX2V1Z2xlbmFfMlwiPlxuICAgICAgICA8aDIgY2xhc3M9XCJyZXN1bHRzX190aXRsZVwiPlZpZXcgb2YgTWljcm9zY29wZSBhbmQgTW9kZWwgQjwvaDI+PC9kaXY+YCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzdWFsUmVzdWx0XzIudmlldygpLCAnLnJlc3VsdHNfX2V1Z2xlbmFfMicpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYV8yJykuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB2aXNPcHRzID0ge307XG4gICAgICBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnZpc3VhbGl6YXRpb24udmlzdWFsaXphdGlvblR5cGVzJykuZm9yRWFjaCgodmlzQ29uZikgPT4ge1xuICAgICAgICB2aXNPcHRzW3Zpc0NvbmYuaWRdID0gdmlzQ29uZi5sYWJlbDtcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuX3Zpc1NlbGVjdCA9IFNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGlkOiBcInZpc3VhbGl6YXRpb25cIixcbiAgICAgICAgbGFiZWw6ICdWaXN1YWxpemF0aW9uJyxcbiAgICAgICAgb3B0aW9uczogdmlzT3B0cyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdFYWNoIHZpc3VhbGl6YXRpb24gc2hvd3MgZGlmZmVyZW50IGFzcGVjdHMgb2YgaG93IHRoZSBFdWdsZW5hIG9yIG1vZGVscyBiZWhhdmUuJ1xuICAgICAgfSk7XG5cbiAgICAgIGlmKE9iamVjdC5rZXlzKHZpc09wdHMpLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3Zpc1NlbGVjdC52aWV3KCksICcucmVzdWx0c19fY29udHJvbHNfX3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgICAgdGhpcy5fdmlzU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLkNoYW5nZScsIHRoaXMuX29uVmlzdWFsaXphdGlvbkNoYW5nZSk7XG4gICAgICAgIHRoaXMuX29uVmlzdWFsaXphdGlvbkNoYW5nZSh7IGN1cnJlbnRUYXJnZXQ6IHRoaXMuX3Zpc1NlbGVjdCB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiRlbC5maW5kKCcjbW92ZVRhYnMnKS5jbGljayh0aGlzLl9tb3ZlVGFicyk7XG5cblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXVnbGVuYU1vZGVsLmRpcmVjdENvbXBhcmlzb24nLCB0aGlzLmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKTtcblxuICAgIH1cblxuICAgIF9tb3ZlVGFicygpIHtcbiAgICAgIGlmICh0aGlzLiRlbC5maW5kKCcjbW92ZVRhYnMnKS5oYXNDbGFzcygnbm90ZmxpcHBlZFgnKSkge1xuICAgICAgICB2YXIgaGlkZVRhYiA9IHRydWU7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLnJlbW92ZUNsYXNzKCdub3RmbGlwcGVkWCcpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjbW92ZVRhYnMnKS5hZGRDbGFzcygnZmxpcHBlZFgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBoaWRlVGFiID0gZmFsc2U7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLnJlbW92ZUNsYXNzKCdmbGlwcGVkWCcpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjbW92ZVRhYnMnKS5hZGRDbGFzcygnbm90ZmxpcHBlZFgnKTtcbiAgICAgIH1cblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnSW50ZXJhY3RpdmVUYWJzLlRvZ2dsZScse2hpZGVUYWI6IGhpZGVUYWJ9KTtcblxuICAgIH1cblxuICAgIF9vblRpY2soZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fZ3JhcGhzKSB7XG4gICAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICAgIGdyYXBoLnVwZGF0ZShldnQuZGF0YS50aW1lLCBldnQuZGF0YS5saWdodHMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVFeHBlcmltZW50UmVzdWx0cyhleHAsIHJlcywgbW9kZWxDb21wYXJpc29uID0gZmFsc2UpIHtcbiAgICAgIHRoaXMubGlnaHRDb25maWcgPSBleHAuY29uZmlndXJhdGlvbjtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19jb250cm9sc19fZXhwZXJpbWVudCcpLmh0bWwoYDxsYWJlbD5FeHBlcmltZW50OjwvbGFiZWw+PHNwYW4gY2xhc3M9XCJcIj4keyhuZXcgRGF0ZShleHAuZGF0ZV9jcmVhdGVkKSkudG9Mb2NhbGVTdHJpbmcoKX08L3NwYW4+YClcbiAgICAgIGlmICh0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShyZXMsICdsaXZlJywgdGhpcy5saWdodENvbmZpZyk7XG4gICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCAnbW9kZWwnLCB0aGlzLmxpZ2h0Q29uZmlnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5oYW5kbGVMaWdodERhdGEoZXhwLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LnBsYXkocmVzKTtcblxuICAgICAgaWYoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZW5hYmxlRGlyZWN0Q29tcGFyaXNvbicpKSB7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLmhhbmRsZUxpZ2h0RGF0YShleHAuY29uZmlndXJhdGlvbik7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLnBsYXkocmVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVNb2RlbFJlc3VsdHMobW9kZWwsIHJlcywgdGFiSWQsIG1vZGVsQ29tcGFyaXNvbiA9IGZhbHNlKSB7XG5cbiAgICAgIGlmICghbW9kZWxDb21wYXJpc29uKSB7XG5cbiAgICAgICAgdmFyIGNvbG9yID0gMDtcbiAgICAgICAgaWYgKHRhYklkICE9ICdub25lJykge1xuICAgICAgICAgIGlmIChtb2RlbC5zZW5zb3JDb25maWdKU09OKSB7XG4gICAgICAgICAgICB2YXIgbnVtU2Vuc29ycyA9IDA7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhKU09OLnBhcnNlKG1vZGVsLnNlbnNvckNvbmZpZ0pTT04pKS5mb3JFYWNoKGtleSA9PiB7IGlmIChrZXkudG9Mb3dlckNhc2UoKS5tYXRjaCgnc2Vuc29yJykpIG51bVNlbnNvcnMgKz0gMTsgfSlcbiAgICAgICAgICAgIGlmIChudW1TZW5zb3JzID09IDIpIHtcbiAgICAgICAgICAgICAgY29sb3IgPSAweEY5MDAxQTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbG9yID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7dGFiSWR9YCkuY29sb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sb3IgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHt0YWJJZH1gKS5jb2xvcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09PSAnc2VxdWVudGlhbCcpIHtcbiAgICAgICAgICAgIGlmICh0YWJJZCA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgZ3JhcGguc2V0TGl2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCAnbW9kZWwnLCB0aGlzLmxpZ2h0Q29uZmlnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGdyYXBoLnNldExpdmUoZmFsc2UpO1xuICAgICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ21vZGVsJywgdGhpcy5saWdodENvbmZpZywgY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09PSAnanVzdG1vZGVsJykge1xuICAgICAgICAgICAgaWYgKHRhYklkID09ICdub25lJykge1xuICAgICAgICAgICAgICBncmFwaC5zZXRMaXZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCAnbW9kZWwnLCB0aGlzLmxpZ2h0Q29uZmlnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGdyYXBoLnNldExpdmUoZmFsc2UpO1xuICAgICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ21vZGVsJywgdGhpcy5saWdodENvbmZpZywgY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ21vZGVsJywgdGhpcy5saWdodENvbmZpZywgY29sb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKTsgLy8gQWN0aXZhdGUgdGhlIGV1Z2xlbmEgbWluaSBtb2RlbHMgZm9yIHRoZSBjb3JyZXNwb25kaW5nIE1vZGVsXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ1Zpc3VhbFJlc3VsdC5SZXNldFJlcXVlc3QnLHt9KTtcbiAgICAgICAgaWYgKHRhYklkICE9IHRoaXMuX21vZGVsU2VsZWN0LnZhbHVlKCkpIHtcbiAgICAgICAgICB0aGlzLl9zaWxlbmNlTW9kZWxTZWxlY3QgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKHRhYklkKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCA9IGZhbHNlO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7IC8vIElmIG1vZGVsIGNvbXBhcmlzb24gaXMgYWN0aXZhdGVkXG4gICAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEobnVsbCwnbW9kZWwnLCB0aGlzLmxpZ2h0Q29uZmlnKTtcbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgY29sb3IgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHt0YWJJZH1gKS5jb2xvcigpO1xuXG4gICAgICAgIGlmICh0YWJJZCA9PSAnYScpIHt0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKX1cbiAgICAgICAgZWxzZSBpZiAodGFiSWQgPT0gJ2InKSB7dGhpcy5fdmlzdWFsUmVzdWx0XzIuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKX1cblxuICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2NvbnRyb2xzX19leHBlcmltZW50JykuaHRtbChgPGxhYmVsPkV4cGVyaW1lbnQ6PC9sYWJlbD48c3BhbiBjbGFzcz1cIlwiPihOZXcgRXhwZXJpbWVudCk8L3NwYW4+YClcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5jbGVhcigpO1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzaG93VmlkZW8oYWN0aXZlVmlkZW8pIHtcbiAgICAgIC8vdGhpcy5fdmlzdWFsUmVzdWx0LnNob3dWaWRlbyhhY3RpdmVWaWRlbyk7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuZGlzcGF0Y2hFdmVudCgnVmlkZW9SZXN1bHQuU2hvd1ZpZGVvJywge3Nob3dWaWRlbzogYWN0aXZlVmlkZW99KTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuZGlzcGF0Y2hFdmVudCgnVmlkZW9SZXN1bHQuU2hvd1ZpZGVvJywge3Nob3dWaWRlbzogYWN0aXZlVmlkZW99KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25WaXN1YWxpemF0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGlmIChncmFwaC5pZCgpID09IGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKCkpIHtcbiAgICAgICAgICBncmFwaC52aWV3KCkuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyYXBoLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJ2aXN1YWxpemF0aW9uX2NoYW5nZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fc2lsZW5jZU1vZGVsU2VsZWN0KSByZXR1cm47XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1Jlc3VsdHNWaWV3LlJlcXVlc3RNb2RlbERhdGEnLCB7XG4gICAgICAgIHRhYklkOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLmhpZGUoKTtcbiAgICAgICAgdGhpcy5fdmlzU2VsZWN0LmhpZGUoKTtcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYScpLmNoaWxkcmVuKCcucmVzdWx0c19fdGl0bGUnKS5odG1sKFwiVmlldyBvZiBNaWNyb3Njb3BlIGFuZCBNb2RlbCBBXCIpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYV8yJykuc2hvdygpO1xuXG4gICAgICB9IGVsc2UgeyAvLyBoaWRlIHRoZSBkaXYgZm9yIHZpc3VhbFJlc3VsdF8yXG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2V1Z2xlbmEnKS5jaGlsZHJlbignLnJlc3VsdHNfX3RpdGxlJykuaHRtbChcIlZpZXcgb2YgTWljcm9zY29wZVwiKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2V1Z2xlbmFfMicpLmhpZGUoKTtcblxuICAgICAgICBpZihPYmplY3Qua2V5cyh0aGlzLl92aXNTZWxlY3QuX21vZGVsLl9kYXRhLm9wdGlvbnMpLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuc2hvdygpO1xuICAgICAgICAgIHRoaXMuX3Zpc1NlbGVjdC5zaG93KCk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICB0aGlzLl9tb2RlbFNlbGVjdC5zZXRWYWx1ZSgnbm9uZScpO1xuICAgICAgdGhpcy5fdmlzU2VsZWN0LnNldFZhbHVlKHRoaXMuX3Zpc1NlbGVjdC5nZXRBYmxlT3B0aW9ucygpWzBdKVxuICAgIH1cbiAgfVxufSlcbiJdfQ==
