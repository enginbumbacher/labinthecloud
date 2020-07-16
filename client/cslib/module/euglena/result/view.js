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

      if (Globals.get('AppConfig.model.tabs')) {
        Globals.get('AppConfig.model.tabs').forEach((tabConf, ind) => {
          let id = Globals.get('AppConfig.model.tabs.length')==1 ? '' : String.fromCharCode(97 + ind)
          modelOpts[id] = `Model ${id.toUpperCase()}`;
        });
        this._modelSelect = SelectField.create({
          id: 'model',
          label: 'Model',
          options: modelOpts,
          initialValue: 'none',
          description: 'Turn models on or off.'
        });
        this._modelSelect.setValue('none')

        if (Globals.get('AppConfig.model.tabs').length) {
          this.addChild(this._modelSelect.view(), '.results__controls__model');
          this._modelSelect.addEventListener('Field.Change', this._onModelChange);
        }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJDb21wb25lbnRTcGVlZCIsIk9yaWVudGF0aW9uQ2hhbmdlIiwiVmlzdWFsUmVzdWx0IiwiU2VsZWN0RmllbGQiLCJ2aXNtYXAiLCJjaXJjbGUiLCJoaXN0b2dyYW0iLCJ0aW1lc2VyaWVzIiwiY29tcG9uZW50c3BlZWQiLCJvcmllbnRhdGlvbmNoYW5nZSIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl92aXN1YWxSZXN1bHQiLCJjcmVhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVGljayIsIl9ncmFwaHMiLCJnZXQiLCJtYXAiLCJ2aXNDb25mIiwic2V0dGluZ3MiLCJpZCIsImFkZENoaWxkIiwidmlldyIsImZvckVhY2giLCJncmFwaCIsImxpZ2h0Q29uZmlnIiwibW9kZWxPcHRzIiwibGVuZ3RoIiwidGFiQ29uZiIsImluZCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsInRvVXBwZXJDYXNlIiwiX21vZGVsU2VsZWN0IiwibGFiZWwiLCJvcHRpb25zIiwiaW5pdGlhbFZhbHVlIiwiZGVzY3JpcHRpb24iLCJzZXRWYWx1ZSIsIl9vbk1vZGVsQ2hhbmdlIiwiX3Zpc3VhbFJlc3VsdF8yIiwiaGlkZUNvbnRyb2xzIiwiJGVsIiwiZmluZCIsImFwcGVuZCIsImhpZGUiLCJ2aXNPcHRzIiwiX3Zpc1NlbGVjdCIsIk9iamVjdCIsImtleXMiLCJfb25WaXN1YWxpemF0aW9uQ2hhbmdlIiwiY3VycmVudFRhcmdldCIsImNsaWNrIiwiX21vdmVUYWJzIiwiYWN0aXZhdGVNb2RlbENvbXBhcmlzb24iLCJoYXNDbGFzcyIsImhpZGVUYWIiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiZGlzcGF0Y2hFdmVudCIsImV2dCIsInVwZGF0ZSIsImRhdGEiLCJ0aW1lIiwibGlnaHRzIiwiZXhwIiwicmVzIiwibW9kZWxDb21wYXJpc29uIiwiY29uZmlndXJhdGlvbiIsImh0bWwiLCJEYXRlIiwiZGF0ZV9jcmVhdGVkIiwidG9Mb2NhbGVTdHJpbmciLCJpcyIsInJlc2V0IiwiaGFuZGxlRGF0YSIsImhhbmRsZUxpZ2h0RGF0YSIsInBsYXkiLCJtb2RlbCIsInRhYklkIiwiY29sb3IiLCJzZW5zb3JDb25maWdKU09OIiwibnVtU2Vuc29ycyIsIkpTT04iLCJwYXJzZSIsImtleSIsInRvTG93ZXJDYXNlIiwibWF0Y2giLCJzZXRMaXZlIiwiaGFuZGxlTW9kZWxEYXRhIiwidmFsdWUiLCJfc2lsZW5jZU1vZGVsU2VsZWN0IiwidGhlbiIsImNsZWFyIiwiYWN0aXZlVmlkZW8iLCJzaG93VmlkZW8iLCJzaG93IiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwidmlzdWFsaXphdGlvbiIsImNoaWxkcmVuIiwiX21vZGVsIiwiX2RhdGEiLCJnZXRBYmxlT3B0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHFCQUFSLENBRGI7QUFBQSxNQUVFTSxrQkFBa0JOLFFBQVEsMkNBQVIsQ0FGcEI7QUFBQSxNQUdFTyxZQUFZUCxRQUFRLGlEQUFSLENBSGQ7QUFBQSxNQUlFUSxhQUFhUixRQUFRLG1EQUFSLENBSmY7QUFBQSxNQUtFUyxpQkFBaUJULFFBQVEsMkRBQVIsQ0FMbkI7QUFBQSxNQU1FVSxvQkFBb0JWLFFBQVEsaUVBQVIsQ0FOdEI7QUFBQSxNQU9FVyxlQUFlWCxRQUFRLDZDQUFSLENBUGpCO0FBQUEsTUFRRVksY0FBY1osUUFBUSxrQ0FBUixDQVJoQjs7QUFXQSxNQUFNYSxTQUFTO0FBQ2JDLFlBQVFSLGVBREs7QUFFYlMsZUFBV1IsU0FGRTtBQUdiUyxnQkFBWVIsVUFIQztBQUliUyxvQkFBZ0JSLGNBSkg7QUFLYlMsdUJBQW1CUjtBQUxOLEdBQWY7O0FBUUFWLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSx5QkFBWW1CLElBQVosRUFBa0I7QUFBQTs7QUFBQSw0SEFDVkEsUUFBUWQsUUFERTs7QUFFaEJILFlBQU1rQixXQUFOLFFBQXdCLENBQUMsU0FBRCxFQUFZLHdCQUFaLEVBQXNDLGdCQUF0QyxFQUF3RCx5QkFBeEQsRUFBbUYsV0FBbkYsQ0FBeEI7O0FBRUEsWUFBS0MsYUFBTCxHQUFxQlYsYUFBYVcsTUFBYixFQUFyQjtBQUNBLFlBQUtELGFBQUwsQ0FBbUJFLGdCQUFuQixDQUFvQyxtQkFBcEMsRUFBeUQsTUFBS0MsT0FBOUQ7QUFDQSxZQUFLQyxPQUFMLEdBQWV4QixRQUFReUIsR0FBUixDQUFZLDRDQUFaLEVBQTBEQyxHQUExRCxDQUE4RCxVQUFDQyxPQUFELEVBQWE7QUFDeEZBLGdCQUFRQyxRQUFSLENBQWlCQyxFQUFqQixHQUFzQkYsUUFBUUUsRUFBOUI7QUFDQSxlQUFPakIsT0FBT2UsUUFBUUUsRUFBZixFQUFtQlIsTUFBbkIsQ0FBMEJNLFFBQVFDLFFBQWxDLENBQVA7QUFDRCxPQUhjLENBQWY7O0FBS0EsWUFBS0UsUUFBTCxDQUFjLE1BQUtWLGFBQUwsQ0FBbUJXLElBQW5CLEVBQWQsRUFBeUMsbUJBQXpDO0FBQ0EsWUFBS1AsT0FBTCxDQUFhUSxPQUFiLENBQXFCLFVBQUNDLEtBQUQsRUFBVztBQUM5QixjQUFLSCxRQUFMLENBQWNHLE1BQU1GLElBQU4sRUFBZCxFQUE0Qix5QkFBNUI7QUFDRCxPQUZEOztBQUlBLFlBQUtHLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUEsVUFBSUMsWUFBWSxFQUFoQjtBQUNBLFVBQUluQyxRQUFReUIsR0FBUixDQUFZLHlDQUFaLEtBQTBEekIsUUFBUXlCLEdBQVIsQ0FBWSxzQkFBWixFQUFvQ1csTUFBcEMsSUFBOEMsQ0FBNUcsRUFBK0c7QUFDN0dELG9CQUFZO0FBQ1gsa0JBQVEsVUFERztBQUVYLGtCQUFRO0FBRkcsU0FBWjtBQUlELE9BTEQsTUFLTztBQUNMQSxvQkFBWTtBQUNYLGtCQUFRO0FBREcsU0FBWjtBQUdEOztBQUVEbkMsY0FBUXlCLEdBQVIsQ0FBWSxzQkFBWixFQUFvQ08sT0FBcEMsQ0FBNEMsVUFBQ0ssT0FBRCxFQUFVQyxHQUFWLEVBQWtCO0FBQzVELFlBQUlULEtBQUs3QixRQUFReUIsR0FBUixDQUFZLDZCQUFaLEtBQTRDLENBQTVDLEdBQWdELEVBQWhELEdBQXFEYyxPQUFPQyxZQUFQLENBQW9CLEtBQUtGLEdBQXpCLENBQTlEO0FBQ0FILGtCQUFVTixFQUFWLGVBQXlCQSxHQUFHWSxXQUFILEVBQXpCO0FBQ0QsT0FIRDtBQUlBLFlBQUtDLFlBQUwsR0FBb0IvQixZQUFZVSxNQUFaLENBQW1CO0FBQ3JDUSxZQUFJLE9BRGlDO0FBRXJDYyxlQUFPLE9BRjhCO0FBR3JDQyxpQkFBU1QsU0FINEI7QUFJckNVLHNCQUFjLE1BSnVCO0FBS3JDQyxxQkFBYTtBQUx3QixPQUFuQixDQUFwQjtBQU9BLFlBQUtKLFlBQUwsQ0FBa0JLLFFBQWxCLENBQTJCLE1BQTNCOztBQUVBLFVBQUkvQyxRQUFReUIsR0FBUixDQUFZLHNCQUFaLEVBQW9DVyxNQUF4QyxFQUFnRDtBQUM5QyxjQUFLTixRQUFMLENBQWMsTUFBS1ksWUFBTCxDQUFrQlgsSUFBbEIsRUFBZCxFQUF3QywyQkFBeEM7QUFDQSxjQUFLVyxZQUFMLENBQWtCcEIsZ0JBQWxCLENBQW1DLGNBQW5DLEVBQW1ELE1BQUswQixjQUF4RDtBQUNEOztBQUVELFVBQUloRCxRQUFReUIsR0FBUixDQUFZLHlDQUFaLENBQUosRUFBNEQ7QUFDMUQsY0FBS3dCLGVBQUwsR0FBdUJ2QyxhQUFhVyxNQUFiLEVBQXZCO0FBQ0EsY0FBSzRCLGVBQUwsQ0FBcUJDLFlBQXJCO0FBQ0EsY0FBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMsbUJBQWQsRUFBbUNDLE1BQW5DO0FBRUEsY0FBS3ZCLFFBQUwsQ0FBYyxNQUFLbUIsZUFBTCxDQUFxQmxCLElBQXJCLEVBQWQsRUFBMkMscUJBQTNDO0FBQ0EsY0FBS29CLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHFCQUFkLEVBQXFDRSxJQUFyQztBQUNEOztBQUVELFVBQU1DLFVBQVUsRUFBaEI7QUFDQXZELGNBQVF5QixHQUFSLENBQVksNENBQVosRUFBMERPLE9BQTFELENBQWtFLFVBQUNMLE9BQUQsRUFBYTtBQUM3RTRCLGdCQUFRNUIsUUFBUUUsRUFBaEIsSUFBc0JGLFFBQVFnQixLQUE5QjtBQUNELE9BRkQ7O0FBSUEsWUFBS2EsVUFBTCxHQUFrQjdDLFlBQVlVLE1BQVosQ0FBbUI7QUFDbkNRLFlBQUksZUFEK0I7QUFFbkNjLGVBQU8sZUFGNEI7QUFHbkNDLGlCQUFTVyxPQUgwQjtBQUluQ1QscUJBQWE7QUFKc0IsT0FBbkIsQ0FBbEI7O0FBT0EsVUFBR1csT0FBT0MsSUFBUCxDQUFZSCxPQUFaLEVBQXFCbkIsTUFBeEIsRUFBZ0M7QUFDOUIsY0FBS04sUUFBTCxDQUFjLE1BQUswQixVQUFMLENBQWdCekIsSUFBaEIsRUFBZCxFQUFzQyxtQ0FBdEM7QUFDQSxjQUFLeUIsVUFBTCxDQUFnQmxDLGdCQUFoQixDQUFpQyxjQUFqQyxFQUFpRCxNQUFLcUMsc0JBQXREO0FBQ0EsY0FBS0Esc0JBQUwsQ0FBNEIsRUFBRUMsZUFBZSxNQUFLSixVQUF0QixFQUE1QjtBQUNELE9BSkQsTUFJTztBQUNMLGNBQUtMLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHlCQUFkLEVBQXlDRSxJQUF6QztBQUNEOztBQUVELFlBQUtILEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFdBQWQsRUFBMkJTLEtBQTNCLENBQWlDLE1BQUtDLFNBQXRDOztBQUdBOUQsY0FBUXlCLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSCxnQkFBckIsQ0FBc0MsK0JBQXRDLEVBQXVFLE1BQUt5Qyx1QkFBNUU7O0FBaEZnQjtBQWtGakI7O0FBbkZIO0FBQUE7QUFBQSxrQ0FxRmM7QUFDVixZQUFJLEtBQUtaLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFdBQWQsRUFBMkJZLFFBQTNCLENBQW9DLGFBQXBDLENBQUosRUFBd0Q7QUFDdEQsY0FBSUMsVUFBVSxJQUFkO0FBQ0EsZUFBS2QsR0FBTCxDQUFTQyxJQUFULENBQWMsV0FBZCxFQUEyQmMsV0FBM0IsQ0FBdUMsYUFBdkM7QUFDQSxlQUFLZixHQUFMLENBQVNDLElBQVQsQ0FBYyxXQUFkLEVBQTJCZSxRQUEzQixDQUFvQyxVQUFwQztBQUNELFNBSkQsTUFJTztBQUNMLGNBQUlGLFVBQVUsS0FBZDtBQUNBLGVBQUtkLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFdBQWQsRUFBMkJjLFdBQTNCLENBQXVDLFVBQXZDO0FBQ0EsZUFBS2YsR0FBTCxDQUFTQyxJQUFULENBQWMsV0FBZCxFQUEyQmUsUUFBM0IsQ0FBb0MsYUFBcEM7QUFDRDs7QUFFRG5FLGdCQUFReUIsR0FBUixDQUFZLE9BQVosRUFBcUIyQyxhQUFyQixDQUFtQyx3QkFBbkMsRUFBNEQsRUFBQ0gsU0FBU0EsT0FBVixFQUE1RDtBQUVEO0FBbEdIO0FBQUE7QUFBQSw4QkFvR1VJLEdBcEdWLEVBb0dlO0FBQ1gsWUFBSSxLQUFLN0MsT0FBVCxFQUFrQjtBQUNoQixlQUFLQSxPQUFMLENBQWFRLE9BQWIsQ0FBcUIsVUFBQ0MsS0FBRCxFQUFXO0FBQzlCQSxrQkFBTXFDLE1BQU4sQ0FBYUQsSUFBSUUsSUFBSixDQUFTQyxJQUF0QixFQUE0QkgsSUFBSUUsSUFBSixDQUFTRSxNQUFyQztBQUNELFdBRkQ7QUFHRDtBQUNGO0FBMUdIO0FBQUE7QUFBQSw4Q0E0RzBCQyxHQTVHMUIsRUE0RytCQyxHQTVHL0IsRUE0RzZEO0FBQUE7O0FBQUEsWUFBekJDLGVBQXlCLHVFQUFQLEtBQU87O0FBQ3pELGFBQUsxQyxXQUFMLEdBQW1Cd0MsSUFBSUcsYUFBdkI7QUFDQSxhQUFLMUIsR0FBTCxDQUFTQyxJQUFULENBQWMsZ0NBQWQsRUFBZ0QwQixJQUFoRCwrQ0FBa0csSUFBSUMsSUFBSixDQUFTTCxJQUFJTSxZQUFiLENBQUQsQ0FBNkJDLGNBQTdCLEVBQWpHO0FBQ0EsWUFBSSxLQUFLOUIsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUM4QixFQUF6QyxDQUE0QyxVQUE1QyxDQUFKLEVBQTZEO0FBQzNELGVBQUsxRCxPQUFMLENBQWFRLE9BQWIsQ0FBcUIsVUFBQ0MsS0FBRCxFQUFXO0FBQzlCQSxrQkFBTWtELEtBQU47QUFDQWxELGtCQUFNbUQsVUFBTixDQUFpQlQsR0FBakIsRUFBc0IsTUFBdEIsRUFBOEIsT0FBS3pDLFdBQW5DO0FBQ0FELGtCQUFNbUQsVUFBTixDQUFpQixJQUFqQixFQUF1QixPQUF2QixFQUFnQyxPQUFLbEQsV0FBckM7QUFDRCxXQUpEO0FBS0Q7O0FBRUQsYUFBS2QsYUFBTCxDQUFtQmlFLGVBQW5CLENBQW1DWCxJQUFJRyxhQUF2QztBQUNBLGFBQUt6RCxhQUFMLENBQW1Ca0UsSUFBbkIsQ0FBd0JYLEdBQXhCOztBQUVBLFlBQUczRSxRQUFReUIsR0FBUixDQUFZLHlDQUFaLENBQUgsRUFBMkQ7QUFDekQsZUFBS3dCLGVBQUwsQ0FBcUJvQyxlQUFyQixDQUFxQ1gsSUFBSUcsYUFBekM7QUFDQSxlQUFLNUIsZUFBTCxDQUFxQnFDLElBQXJCLENBQTBCWCxHQUExQjtBQUNEO0FBQ0Y7QUE5SEg7QUFBQTtBQUFBLHlDQWdJcUJZLEtBaElyQixFQWdJNEJaLEdBaEk1QixFQWdJaUNhLEtBaElqQyxFQWdJaUU7QUFBQTs7QUFBQSxZQUF6QlosZUFBeUIsdUVBQVAsS0FBTzs7O0FBRTdELFlBQUksQ0FBQ0EsZUFBTCxFQUFzQjtBQUNwQixjQUFJYSxRQUFRLENBQVo7QUFDQSxjQUFJRCxTQUFTLE1BQWIsRUFBcUI7QUFDbkIsZ0JBQUlELE1BQU1HLGdCQUFWLEVBQTRCO0FBQzFCLGtCQUFJQyxhQUFhLENBQWpCO0FBQ0FsQyxxQkFBT0MsSUFBUCxDQUFZa0MsS0FBS0MsS0FBTCxDQUFXTixNQUFNRyxnQkFBakIsQ0FBWixFQUFnRDFELE9BQWhELENBQXdELGVBQU87QUFBRSxvQkFBSThELElBQUlDLFdBQUosR0FBa0JDLEtBQWxCLENBQXdCLFFBQXhCLENBQUosRUFBdUNMLGNBQWMsQ0FBZDtBQUFrQixlQUExSDtBQUNBLGtCQUFJQSxjQUFjLENBQWxCLEVBQXFCO0FBQ25CRix3QkFBUSxRQUFSO0FBQ0QsZUFGRCxNQUVPO0FBQ0xBLHdCQUFRekYsUUFBUXlCLEdBQVIsZUFBd0IrRCxLQUF4QixFQUFpQ0MsS0FBakMsRUFBUjtBQUNEO0FBQ0YsYUFSRCxNQVFPO0FBQ0xBLHNCQUFRekYsUUFBUXlCLEdBQVIsZUFBd0IrRCxLQUF4QixFQUFpQ0MsS0FBakMsRUFBUjtBQUNEO0FBQ0Y7QUFDRCxlQUFLakUsT0FBTCxDQUFhUSxPQUFiLENBQXFCLFVBQUNDLEtBQUQsRUFBVztBQUM5QixnQkFBSWpDLFFBQVF5QixHQUFSLENBQVksbUNBQVosTUFBcUQsWUFBekQsRUFBdUU7QUFDckUsa0JBQUkrRCxTQUFTLE1BQWIsRUFBcUI7QUFDbkJ2RCxzQkFBTWdFLE9BQU4sQ0FBYyxJQUFkO0FBQ0FoRSxzQkFBTW1ELFVBQU4sQ0FBaUIsSUFBakIsRUFBdUIsT0FBdkIsRUFBZ0MsT0FBS2xELFdBQXJDO0FBQ0QsZUFIRCxNQUdPO0FBQ0xELHNCQUFNZ0UsT0FBTixDQUFjLEtBQWQ7QUFDQWhFLHNCQUFNbUQsVUFBTixDQUFpQlQsR0FBakIsRUFBc0IsT0FBdEIsRUFBK0IsT0FBS3pDLFdBQXBDLEVBQWlEdUQsS0FBakQ7QUFDRDtBQUNGLGFBUkQsTUFRTyxJQUFJekYsUUFBUXlCLEdBQVIsQ0FBWSxtQ0FBWixNQUFxRCxXQUF6RCxFQUFzRTtBQUMzRSxrQkFBSStELFNBQVMsTUFBYixFQUFxQjtBQUNuQnZELHNCQUFNZ0UsT0FBTixDQUFjLEtBQWQ7QUFDQWhFLHNCQUFNbUQsVUFBTixDQUFpQixJQUFqQixFQUF1QixPQUF2QixFQUFnQyxPQUFLbEQsV0FBckM7QUFDRCxlQUhELE1BR087QUFDTEQsc0JBQU1nRSxPQUFOLENBQWMsS0FBZDtBQUNBaEUsc0JBQU1tRCxVQUFOLENBQWlCVCxHQUFqQixFQUFzQixPQUF0QixFQUErQixPQUFLekMsV0FBcEMsRUFBaUR1RCxLQUFqRDtBQUNEO0FBQ0YsYUFSTSxNQVFBO0FBQ0x4RCxvQkFBTW1ELFVBQU4sQ0FBaUJULEdBQWpCLEVBQXNCLE9BQXRCLEVBQStCLE9BQUt6QyxXQUFwQyxFQUFpRHVELEtBQWpEO0FBQ0Q7QUFFRixXQXJCRDtBQXNCQSxlQUFLckUsYUFBTCxDQUFtQjhFLGVBQW5CLENBQW1DdkIsR0FBbkMsRUFBd0NZLEtBQXhDLEVBQStDRSxLQUEvQyxFQXJDb0IsQ0FxQ21DO0FBQ3ZEekYsa0JBQVF5QixHQUFSLENBQVksT0FBWixFQUFxQjJDLGFBQXJCLENBQW1DLDJCQUFuQyxFQUErRCxFQUEvRDtBQUNBLGNBQUlvQixTQUFTLEtBQUs5QyxZQUFMLENBQWtCeUQsS0FBbEIsRUFBYixFQUF3QztBQUN0QyxpQkFBS0MsbUJBQUwsR0FBMkIsSUFBM0I7QUFDQSxpQkFBSzFELFlBQUwsQ0FBa0JLLFFBQWxCLENBQTJCeUMsS0FBM0IsRUFBa0NhLElBQWxDLENBQXVDLFlBQU07QUFDM0MscUJBQUtELG1CQUFMLEdBQTJCLEtBQTNCO0FBQ0QsYUFGRDtBQUdEO0FBQ0YsU0E3Q0QsTUE2Q087QUFBRTtBQUNQLGVBQUs1RSxPQUFMLENBQWFRLE9BQWIsQ0FBcUIsVUFBQ0MsS0FBRCxFQUFXO0FBQzlCQSxrQkFBTW1ELFVBQU4sQ0FBaUIsSUFBakIsRUFBc0IsT0FBdEIsRUFBK0IsT0FBS2xELFdBQXBDO0FBQ0QsV0FGRDs7QUFJQSxjQUFJdUQsU0FBUXpGLFFBQVF5QixHQUFSLGVBQXdCK0QsS0FBeEIsRUFBaUNDLEtBQWpDLEVBQVo7O0FBRUEsY0FBSUQsU0FBUyxHQUFiLEVBQWtCO0FBQUMsaUJBQUtwRSxhQUFMLENBQW1COEUsZUFBbkIsQ0FBbUN2QixHQUFuQyxFQUF3Q1ksS0FBeEMsRUFBK0NFLE1BQS9DO0FBQXNELFdBQXpFLE1BQ0ssSUFBSUQsU0FBUyxHQUFiLEVBQWtCO0FBQUMsaUJBQUt2QyxlQUFMLENBQXFCaUQsZUFBckIsQ0FBcUN2QixHQUFyQyxFQUEwQ1ksS0FBMUMsRUFBaURFLE1BQWpEO0FBQXdEO0FBRWpGO0FBQ0Y7QUExTEg7QUFBQTtBQUFBLDhCQTRMVTtBQUNOLGFBQUt0QyxHQUFMLENBQVNDLElBQVQsQ0FBYyxnQ0FBZCxFQUFnRDBCLElBQWhEO0FBQ0EsYUFBSzFELGFBQUwsQ0FBbUJrRixLQUFuQjtBQUNBLGFBQUs5RSxPQUFMLENBQWFRLE9BQWIsQ0FBcUIsVUFBQ0MsS0FBRCxFQUFXO0FBQzlCQSxnQkFBTWtELEtBQU47QUFDRCxTQUZEO0FBR0Q7QUFsTUg7QUFBQTtBQUFBLGdDQW9NWW9CLFdBcE1aLEVBb015QjtBQUNyQjtBQUNBLGFBQUtuRixhQUFMLENBQW1CZ0QsYUFBbkIsQ0FBaUMsdUJBQWpDLEVBQTBELEVBQUNvQyxXQUFXRCxXQUFaLEVBQTFEO0FBQ0EsWUFBSXZHLFFBQVF5QixHQUFSLENBQVkseUNBQVosQ0FBSixFQUE0RDtBQUMxRCxlQUFLd0IsZUFBTCxDQUFxQm1CLGFBQXJCLENBQW1DLHVCQUFuQyxFQUE0RCxFQUFDb0MsV0FBV0QsV0FBWixFQUE1RDtBQUNEO0FBQ0Y7QUExTUg7QUFBQTtBQUFBLDZDQTRNeUJsQyxHQTVNekIsRUE0TThCO0FBQzFCLGFBQUs3QyxPQUFMLENBQWFRLE9BQWIsQ0FBcUIsVUFBQ0MsS0FBRCxFQUFXO0FBQzlCLGNBQUlBLE1BQU1KLEVBQU4sTUFBY3dDLElBQUlULGFBQUosQ0FBa0J1QyxLQUFsQixFQUFsQixFQUE2QztBQUMzQ2xFLGtCQUFNRixJQUFOLEdBQWEwRSxJQUFiO0FBQ0QsV0FGRCxNQUVPO0FBQ0x4RSxrQkFBTUYsSUFBTixHQUFhdUIsSUFBYjtBQUNEO0FBQ0YsU0FORDtBQU9BdEQsZ0JBQVF5QixHQUFSLENBQVksUUFBWixFQUFzQmlGLEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxzQkFEa0I7QUFFeEJDLG9CQUFVLFNBRmM7QUFHeEJyQyxnQkFBTTtBQUNKc0MsMkJBQWV4QyxJQUFJVCxhQUFKLENBQWtCdUMsS0FBbEI7QUFEWDtBQUhrQixTQUExQjtBQU9EO0FBM05IO0FBQUE7QUFBQSxxQ0E2TmlCOUIsR0E3TmpCLEVBNk5zQjtBQUNsQixZQUFJLEtBQUsrQixtQkFBVCxFQUE4QjtBQUM5QixhQUFLaEMsYUFBTCxDQUFtQiw4QkFBbkIsRUFBbUQ7QUFDakRvQixpQkFBT25CLElBQUlULGFBQUosQ0FBa0J1QyxLQUFsQjtBQUQwQyxTQUFuRDtBQUdEO0FBbE9IO0FBQUE7QUFBQSxnREFvTzRCO0FBQ3hCLFlBQUluRyxRQUFReUIsR0FBUixDQUFZLHVCQUFaLENBQUosRUFBMEM7QUFDeEMsZUFBSzBCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHlCQUFkLEVBQXlDRSxJQUF6QztBQUNBLGVBQUtFLFVBQUwsQ0FBZ0JGLElBQWhCOztBQUVBLGVBQUtILEdBQUwsQ0FBU0MsSUFBVCxDQUFjLG1CQUFkLEVBQW1DMEQsUUFBbkMsQ0FBNEMsaUJBQTVDLEVBQStEaEMsSUFBL0QsQ0FBb0UsZ0NBQXBFO0FBQ0EsZUFBSzNCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHFCQUFkLEVBQXFDcUQsSUFBckM7QUFFRCxTQVBELE1BT087QUFBRTs7QUFFUCxlQUFLdEQsR0FBTCxDQUFTQyxJQUFULENBQWMsbUJBQWQsRUFBbUMwRCxRQUFuQyxDQUE0QyxpQkFBNUMsRUFBK0RoQyxJQUEvRCxDQUFvRSxvQkFBcEU7QUFDQSxlQUFLM0IsR0FBTCxDQUFTQyxJQUFULENBQWMscUJBQWQsRUFBcUNFLElBQXJDOztBQUVBLGNBQUdHLE9BQU9DLElBQVAsQ0FBWSxLQUFLRixVQUFMLENBQWdCdUQsTUFBaEIsQ0FBdUJDLEtBQXZCLENBQTZCcEUsT0FBekMsRUFBa0RSLE1BQXJELEVBQTZEO0FBQzNELGlCQUFLZSxHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5Q3FELElBQXpDO0FBQ0EsaUJBQUtqRCxVQUFMLENBQWdCaUQsSUFBaEI7QUFDRDtBQUVGO0FBRUY7QUF4UEg7QUFBQTtBQUFBLDhCQTBQVTtBQUNOLGFBQUtILEtBQUw7QUFDQSxhQUFLNUQsWUFBTCxDQUFrQkssUUFBbEIsQ0FBMkIsTUFBM0I7QUFDQSxhQUFLUyxVQUFMLENBQWdCVCxRQUFoQixDQUF5QixLQUFLUyxVQUFMLENBQWdCeUQsY0FBaEIsR0FBaUMsQ0FBakMsQ0FBekI7QUFDRDtBQTlQSDs7QUFBQTtBQUFBLElBQWlDOUcsT0FBakM7QUFnUUQsQ0ExUkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvcmVzdWx0L3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9yZXN1bHRzLmh0bWwnKSxcbiAgICBDaXJjbGVIaXN0b2dyYW0gPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9jaXJjbGVncmFwaCcpLFxuICAgIEhpc3RvZ3JhbSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2hpc3RvZ3JhbWdyYXBoL2hpc3RvZ3JhbWdyYXBoJyksXG4gICAgVGltZVNlcmllcyA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L3RpbWVzZXJpZXNncmFwaC90aW1lc2VyaWVzZ3JhcGgnKSxcbiAgICBDb21wb25lbnRTcGVlZCA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2NvbXBvbmVudHNwZWVkZ3JhcGgvY29tcG9uZW50c3BlZWRncmFwaCcpLFxuICAgIE9yaWVudGF0aW9uQ2hhbmdlID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvb3JpZW50YXRpb25jaGFuZ2VncmFwaC9vcmllbnRhdGlvbmNoYW5nZWdyYXBoJyksXG4gICAgVmlzdWFsUmVzdWx0ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3Zpc3VhbHJlc3VsdCcpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKVxuICA7XG5cbiAgY29uc3QgdmlzbWFwID0ge1xuICAgIGNpcmNsZTogQ2lyY2xlSGlzdG9ncmFtLFxuICAgIGhpc3RvZ3JhbTogSGlzdG9ncmFtLFxuICAgIHRpbWVzZXJpZXM6IFRpbWVTZXJpZXMsXG4gICAgY29tcG9uZW50c3BlZWQ6IENvbXBvbmVudFNwZWVkLFxuICAgIG9yaWVudGF0aW9uY2hhbmdlOiBPcmllbnRhdGlvbkNoYW5nZVxuICB9XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBSZXN1bHRzVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKHRtcGwpIHtcbiAgICAgIHN1cGVyKHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25UaWNrJywgJ19vblZpc3VhbGl6YXRpb25DaGFuZ2UnLCAnX29uTW9kZWxDaGFuZ2UnLCAnYWN0aXZhdGVNb2RlbENvbXBhcmlzb24nLCAnX21vdmVUYWJzJ10pO1xuXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQgPSBWaXN1YWxSZXN1bHQuY3JlYXRlKCk7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlRpY2snLCB0aGlzLl9vblRpY2spO1xuICAgICAgdGhpcy5fZ3JhcGhzID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy52aXN1YWxpemF0aW9uLnZpc3VhbGl6YXRpb25UeXBlcycpLm1hcCgodmlzQ29uZikgPT4ge1xuICAgICAgICB2aXNDb25mLnNldHRpbmdzLmlkID0gdmlzQ29uZi5pZDtcbiAgICAgICAgcmV0dXJuIHZpc21hcFt2aXNDb25mLmlkXS5jcmVhdGUodmlzQ29uZi5zZXR0aW5ncyk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXN1YWxSZXN1bHQudmlldygpLCAnLnJlc3VsdHNfX2V1Z2xlbmEnKTtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICB0aGlzLmFkZENoaWxkKGdyYXBoLnZpZXcoKSwgJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJyk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5saWdodENvbmZpZyA9IG51bGw7XG5cbiAgICAgIHZhciBtb2RlbE9wdHMgPSB7fTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykgJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykubGVuZ3RoID09IDIpIHtcbiAgICAgICAgbW9kZWxPcHRzID0ge1xuICAgICAgICAgJ25vbmUnOiAnTm8gTW9kZWwnLFxuICAgICAgICAgJ2JvdGgnOiAnQm90aCBNb2RlbHMnXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtb2RlbE9wdHMgPSB7XG4gICAgICAgICAnbm9uZSc6ICdObyBNb2RlbCdcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykuZm9yRWFjaCgodGFiQ29uZiwgaW5kKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicy5sZW5ndGgnKT09MSA/ICcnIDogU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGluZClcbiAgICAgICAgbW9kZWxPcHRzW2lkXSA9IGBNb2RlbCAke2lkLnRvVXBwZXJDYXNlKCl9YDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3QgPSBTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogJ21vZGVsJyxcbiAgICAgICAgbGFiZWw6ICdNb2RlbCcsXG4gICAgICAgIG9wdGlvbnM6IG1vZGVsT3B0cyxcbiAgICAgICAgaW5pdGlhbFZhbHVlOiAnbm9uZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVHVybiBtb2RlbHMgb24gb3Igb2ZmLidcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUoJ25vbmUnKVxuXG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fbW9kZWxTZWxlY3QudmlldygpLCAnLnJlc3VsdHNfX2NvbnRyb2xzX19tb2RlbCcpO1xuICAgICAgICB0aGlzLl9tb2RlbFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmVuYWJsZURpcmVjdENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHRfMiA9IFZpc3VhbFJlc3VsdC5jcmVhdGUoKTtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuaGlkZUNvbnRyb2xzKCk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxzJykuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicmVzdWx0c19fZXVnbGVuYV8yXCI+XG4gICAgICAgIDxoMiBjbGFzcz1cInJlc3VsdHNfX3RpdGxlXCI+VmlldyBvZiBNaWNyb3Njb3BlIGFuZCBNb2RlbCBCPC9oMj48L2Rpdj5gKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXN1YWxSZXN1bHRfMi52aWV3KCksICcucmVzdWx0c19fZXVnbGVuYV8yJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hXzInKS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZpc09wdHMgPSB7fTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlzdWFsaXphdGlvbi52aXN1YWxpemF0aW9uVHlwZXMnKS5mb3JFYWNoKCh2aXNDb25mKSA9PiB7XG4gICAgICAgIHZpc09wdHNbdmlzQ29uZi5pZF0gPSB2aXNDb25mLmxhYmVsO1xuICAgICAgfSlcblxuICAgICAgdGhpcy5fdmlzU2VsZWN0ID0gU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6IFwidmlzdWFsaXphdGlvblwiLFxuICAgICAgICBsYWJlbDogJ1Zpc3VhbGl6YXRpb24nLFxuICAgICAgICBvcHRpb25zOiB2aXNPcHRzLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0VhY2ggdmlzdWFsaXphdGlvbiBzaG93cyBkaWZmZXJlbnQgYXNwZWN0cyBvZiBob3cgdGhlIEV1Z2xlbmEgb3IgbW9kZWxzIGJlaGF2ZS4nXG4gICAgICB9KTtcblxuICAgICAgaWYoT2JqZWN0LmtleXModmlzT3B0cykubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzU2VsZWN0LnZpZXcoKSwgJy5yZXN1bHRzX19jb250cm9sc19fdmlzdWFsaXphdGlvbicpO1xuICAgICAgICB0aGlzLl92aXNTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKTtcbiAgICAgICAgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKHsgY3VycmVudFRhcmdldDogdGhpcy5fdmlzU2VsZWN0IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLmNsaWNrKHRoaXMuX21vdmVUYWJzKTtcblxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuZGlyZWN0Q29tcGFyaXNvbicsIHRoaXMuYWN0aXZhdGVNb2RlbENvbXBhcmlzb24pO1xuXG4gICAgfVxuXG4gICAgX21vdmVUYWJzKCkge1xuICAgICAgaWYgKHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLmhhc0NsYXNzKCdub3RmbGlwcGVkWCcpKSB7XG4gICAgICAgIHZhciBoaWRlVGFiID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI21vdmVUYWJzJykucmVtb3ZlQ2xhc3MoJ25vdGZsaXBwZWRYJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLmFkZENsYXNzKCdmbGlwcGVkWCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGhpZGVUYWIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI21vdmVUYWJzJykucmVtb3ZlQ2xhc3MoJ2ZsaXBwZWRYJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLmFkZENsYXNzKCdub3RmbGlwcGVkWCcpO1xuICAgICAgfVxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdJbnRlcmFjdGl2ZVRhYnMuVG9nZ2xlJyx7aGlkZVRhYjogaGlkZVRhYn0pO1xuXG4gICAgfVxuXG4gICAgX29uVGljayhldnQpIHtcbiAgICAgIGlmICh0aGlzLl9ncmFwaHMpIHtcbiAgICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgICAgZ3JhcGgudXBkYXRlKGV2dC5kYXRhLnRpbWUsIGV2dC5kYXRhLmxpZ2h0cyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV4cCwgcmVzLCBtb2RlbENvbXBhcmlzb24gPSBmYWxzZSkge1xuICAgICAgdGhpcy5saWdodENvbmZpZyA9IGV4cC5jb25maWd1cmF0aW9uO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2NvbnRyb2xzX19leHBlcmltZW50JykuaHRtbChgPGxhYmVsPkV4cGVyaW1lbnQ6PC9sYWJlbD48c3BhbiBjbGFzcz1cIlwiPiR7KG5ldyBEYXRlKGV4cC5kYXRlX2NyZWF0ZWQpKS50b0xvY2FsZVN0cmluZygpfTwvc3Bhbj5gKVxuICAgICAgaWYgKHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgICAgZ3JhcGgucmVzZXQoKTtcbiAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ2xpdmUnLCB0aGlzLmxpZ2h0Q29uZmlnKTtcbiAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsICdtb2RlbCcsIHRoaXMubGlnaHRDb25maWcpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmhhbmRsZUxpZ2h0RGF0YShleHAuY29uZmlndXJhdGlvbik7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQucGxheShyZXMpO1xuXG4gICAgICBpZihHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuaGFuZGxlTGlnaHREYXRhKGV4cC5jb25maWd1cmF0aW9uKTtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIucGxheShyZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZU1vZGVsUmVzdWx0cyhtb2RlbCwgcmVzLCB0YWJJZCwgbW9kZWxDb21wYXJpc29uID0gZmFsc2UpIHtcblxuICAgICAgaWYgKCFtb2RlbENvbXBhcmlzb24pIHtcbiAgICAgICAgdmFyIGNvbG9yID0gMDtcbiAgICAgICAgaWYgKHRhYklkICE9ICdub25lJykge1xuICAgICAgICAgIGlmIChtb2RlbC5zZW5zb3JDb25maWdKU09OKSB7XG4gICAgICAgICAgICB2YXIgbnVtU2Vuc29ycyA9IDA7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhKU09OLnBhcnNlKG1vZGVsLnNlbnNvckNvbmZpZ0pTT04pKS5mb3JFYWNoKGtleSA9PiB7IGlmIChrZXkudG9Mb3dlckNhc2UoKS5tYXRjaCgnc2Vuc29yJykpIG51bVNlbnNvcnMgKz0gMTsgfSlcbiAgICAgICAgICAgIGlmIChudW1TZW5zb3JzID09IDIpIHtcbiAgICAgICAgICAgICAgY29sb3IgPSAweEY5MDAxQTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbG9yID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7dGFiSWR9YCkuY29sb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sb3IgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHt0YWJJZH1gKS5jb2xvcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09PSAnc2VxdWVudGlhbCcpIHtcbiAgICAgICAgICAgIGlmICh0YWJJZCA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgZ3JhcGguc2V0TGl2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCAnbW9kZWwnLCB0aGlzLmxpZ2h0Q29uZmlnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGdyYXBoLnNldExpdmUoZmFsc2UpO1xuICAgICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ21vZGVsJywgdGhpcy5saWdodENvbmZpZywgY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09PSAnanVzdG1vZGVsJykge1xuICAgICAgICAgICAgaWYgKHRhYklkID09ICdub25lJykge1xuICAgICAgICAgICAgICBncmFwaC5zZXRMaXZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCAnbW9kZWwnLCB0aGlzLmxpZ2h0Q29uZmlnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGdyYXBoLnNldExpdmUoZmFsc2UpO1xuICAgICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ21vZGVsJywgdGhpcy5saWdodENvbmZpZywgY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ21vZGVsJywgdGhpcy5saWdodENvbmZpZywgY29sb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKTsgLy8gQWN0aXZhdGUgdGhlIGV1Z2xlbmEgbWluaSBtb2RlbHMgZm9yIHRoZSBjb3JyZXNwb25kaW5nIE1vZGVsXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ1Zpc3VhbFJlc3VsdC5SZXNldFJlcXVlc3QnLHt9KTtcbiAgICAgICAgaWYgKHRhYklkICE9IHRoaXMuX21vZGVsU2VsZWN0LnZhbHVlKCkpIHtcbiAgICAgICAgICB0aGlzLl9zaWxlbmNlTW9kZWxTZWxlY3QgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKHRhYklkKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCA9IGZhbHNlO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7IC8vIElmIG1vZGVsIGNvbXBhcmlzb24gaXMgYWN0aXZhdGVkXG4gICAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEobnVsbCwnbW9kZWwnLCB0aGlzLmxpZ2h0Q29uZmlnKTtcbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgY29sb3IgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHt0YWJJZH1gKS5jb2xvcigpO1xuXG4gICAgICAgIGlmICh0YWJJZCA9PSAnYScpIHt0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKX1cbiAgICAgICAgZWxzZSBpZiAodGFiSWQgPT0gJ2InKSB7dGhpcy5fdmlzdWFsUmVzdWx0XzIuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKX1cblxuICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2NvbnRyb2xzX19leHBlcmltZW50JykuaHRtbChgPGxhYmVsPkV4cGVyaW1lbnQ6PC9sYWJlbD48c3BhbiBjbGFzcz1cIlwiPihOZXcgRXhwZXJpbWVudCk8L3NwYW4+YClcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5jbGVhcigpO1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzaG93VmlkZW8oYWN0aXZlVmlkZW8pIHtcbiAgICAgIC8vdGhpcy5fdmlzdWFsUmVzdWx0LnNob3dWaWRlbyhhY3RpdmVWaWRlbyk7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuZGlzcGF0Y2hFdmVudCgnVmlkZW9SZXN1bHQuU2hvd1ZpZGVvJywge3Nob3dWaWRlbzogYWN0aXZlVmlkZW99KTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuZGlzcGF0Y2hFdmVudCgnVmlkZW9SZXN1bHQuU2hvd1ZpZGVvJywge3Nob3dWaWRlbzogYWN0aXZlVmlkZW99KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25WaXN1YWxpemF0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGlmIChncmFwaC5pZCgpID09IGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKCkpIHtcbiAgICAgICAgICBncmFwaC52aWV3KCkuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyYXBoLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJ2aXN1YWxpemF0aW9uX2NoYW5nZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fc2lsZW5jZU1vZGVsU2VsZWN0KSByZXR1cm47XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1Jlc3VsdHNWaWV3LlJlcXVlc3RNb2RlbERhdGEnLCB7XG4gICAgICAgIHRhYklkOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLmhpZGUoKTtcbiAgICAgICAgdGhpcy5fdmlzU2VsZWN0LmhpZGUoKTtcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYScpLmNoaWxkcmVuKCcucmVzdWx0c19fdGl0bGUnKS5odG1sKFwiVmlldyBvZiBNaWNyb3Njb3BlIGFuZCBNb2RlbCBBXCIpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYV8yJykuc2hvdygpO1xuXG4gICAgICB9IGVsc2UgeyAvLyBoaWRlIHRoZSBkaXYgZm9yIHZpc3VhbFJlc3VsdF8yXG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2V1Z2xlbmEnKS5jaGlsZHJlbignLnJlc3VsdHNfX3RpdGxlJykuaHRtbChcIlZpZXcgb2YgTWljcm9zY29wZVwiKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2V1Z2xlbmFfMicpLmhpZGUoKTtcblxuICAgICAgICBpZihPYmplY3Qua2V5cyh0aGlzLl92aXNTZWxlY3QuX21vZGVsLl9kYXRhLm9wdGlvbnMpLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuc2hvdygpO1xuICAgICAgICAgIHRoaXMuX3Zpc1NlbGVjdC5zaG93KCk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICB0aGlzLl9tb2RlbFNlbGVjdC5zZXRWYWx1ZSgnbm9uZScpO1xuICAgICAgdGhpcy5fdmlzU2VsZWN0LnNldFZhbHVlKHRoaXMuX3Zpc1NlbGVjdC5nZXRBYmxlT3B0aW9ucygpWzBdKVxuICAgIH1cbiAgfVxufSlcbiJdfQ==
