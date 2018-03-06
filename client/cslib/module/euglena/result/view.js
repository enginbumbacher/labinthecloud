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
        this._graphs.forEach(function (graph) {
          graph.update(evt.data.time, evt.data.lights);
        });
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
            color = Globals.get('ModelTab.' + tabId).color();
          }
          this._graphs.forEach(function (graph) {
            if (Globals.get('AppConfig.system.expModelModality') == 'sequential') {
              if (tabId == 'none') {
                graph.setLive(true);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJDb21wb25lbnRTcGVlZCIsIk9yaWVudGF0aW9uQ2hhbmdlIiwiVmlzdWFsUmVzdWx0IiwiU2VsZWN0RmllbGQiLCJ2aXNtYXAiLCJjaXJjbGUiLCJoaXN0b2dyYW0iLCJ0aW1lc2VyaWVzIiwiY29tcG9uZW50c3BlZWQiLCJvcmllbnRhdGlvbmNoYW5nZSIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl92aXN1YWxSZXN1bHQiLCJjcmVhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVGljayIsIl9ncmFwaHMiLCJnZXQiLCJtYXAiLCJ2aXNDb25mIiwic2V0dGluZ3MiLCJpZCIsImFkZENoaWxkIiwidmlldyIsImZvckVhY2giLCJncmFwaCIsImxpZ2h0Q29uZmlnIiwibW9kZWxPcHRzIiwibGVuZ3RoIiwidGFiQ29uZiIsImluZCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsInRvVXBwZXJDYXNlIiwiX21vZGVsU2VsZWN0IiwibGFiZWwiLCJvcHRpb25zIiwiaW5pdGlhbFZhbHVlIiwiZGVzY3JpcHRpb24iLCJzZXRWYWx1ZSIsIl9vbk1vZGVsQ2hhbmdlIiwiX3Zpc3VhbFJlc3VsdF8yIiwiaGlkZUNvbnRyb2xzIiwiJGVsIiwiZmluZCIsImFwcGVuZCIsImhpZGUiLCJ2aXNPcHRzIiwiX3Zpc1NlbGVjdCIsIk9iamVjdCIsImtleXMiLCJfb25WaXN1YWxpemF0aW9uQ2hhbmdlIiwiY3VycmVudFRhcmdldCIsImNsaWNrIiwiX21vdmVUYWJzIiwiYWN0aXZhdGVNb2RlbENvbXBhcmlzb24iLCJoYXNDbGFzcyIsImhpZGVUYWIiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiZGlzcGF0Y2hFdmVudCIsImV2dCIsInVwZGF0ZSIsImRhdGEiLCJ0aW1lIiwibGlnaHRzIiwiZXhwIiwicmVzIiwibW9kZWxDb21wYXJpc29uIiwiY29uZmlndXJhdGlvbiIsImh0bWwiLCJEYXRlIiwiZGF0ZV9jcmVhdGVkIiwidG9Mb2NhbGVTdHJpbmciLCJpcyIsInJlc2V0IiwiaGFuZGxlRGF0YSIsImhhbmRsZUxpZ2h0RGF0YSIsInBsYXkiLCJtb2RlbCIsInRhYklkIiwiY29sb3IiLCJzZXRMaXZlIiwiaGFuZGxlTW9kZWxEYXRhIiwidmFsdWUiLCJfc2lsZW5jZU1vZGVsU2VsZWN0IiwidGhlbiIsImNsZWFyIiwiYWN0aXZlVmlkZW8iLCJzaG93VmlkZW8iLCJzaG93IiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwidmlzdWFsaXphdGlvbiIsImNoaWxkcmVuIiwiX21vZGVsIiwiX2RhdGEiLCJnZXRBYmxlT3B0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHFCQUFSLENBRGI7QUFBQSxNQUVFTSxrQkFBa0JOLFFBQVEsMkNBQVIsQ0FGcEI7QUFBQSxNQUdFTyxZQUFZUCxRQUFRLGlEQUFSLENBSGQ7QUFBQSxNQUlFUSxhQUFhUixRQUFRLG1EQUFSLENBSmY7QUFBQSxNQUtFUyxpQkFBaUJULFFBQVEsMkRBQVIsQ0FMbkI7QUFBQSxNQU1FVSxvQkFBb0JWLFFBQVEsaUVBQVIsQ0FOdEI7QUFBQSxNQU9FVyxlQUFlWCxRQUFRLDZDQUFSLENBUGpCO0FBQUEsTUFRRVksY0FBY1osUUFBUSxrQ0FBUixDQVJoQjs7QUFXQSxNQUFNYSxTQUFTO0FBQ2JDLFlBQVFSLGVBREs7QUFF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QUFLZSxHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5QzhDLElBQXpDO0FBQ0EsaUJBQUsxQyxVQUFMLENBQWdCMEMsSUFBaEI7QUFDRDtBQUVGO0FBRUY7QUFyT0g7QUFBQTtBQUFBLDhCQXVPVTtBQUNOLGFBQUtILEtBQUw7QUFDQSxhQUFLckQsWUFBTCxDQUFrQkssUUFBbEIsQ0FBMkIsTUFBM0I7QUFDQSxhQUFLUyxVQUFMLENBQWdCVCxRQUFoQixDQUF5QixLQUFLUyxVQUFMLENBQWdCa0QsY0FBaEIsR0FBaUMsQ0FBakMsQ0FBekI7QUFDRDtBQTNPSDs7QUFBQTtBQUFBLElBQWlDdkcsT0FBakM7QUE2T0QsQ0F2UUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvcmVzdWx0L3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9yZXN1bHRzLmh0bWwnKSxcbiAgICBDaXJjbGVIaXN0b2dyYW0gPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9jaXJjbGVncmFwaCcpLFxuICAgIEhpc3RvZ3JhbSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2hpc3RvZ3JhbWdyYXBoL2hpc3RvZ3JhbWdyYXBoJyksXG4gICAgVGltZVNlcmllcyA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L3RpbWVzZXJpZXNncmFwaC90aW1lc2VyaWVzZ3JhcGgnKSxcbiAgICBDb21wb25lbnRTcGVlZCA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2NvbXBvbmVudHNwZWVkZ3JhcGgvY29tcG9uZW50c3BlZWRncmFwaCcpLFxuICAgIE9yaWVudGF0aW9uQ2hhbmdlID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvb3JpZW50YXRpb25jaGFuZ2VncmFwaC9vcmllbnRhdGlvbmNoYW5nZWdyYXBoJyksXG4gICAgVmlzdWFsUmVzdWx0ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3Zpc3VhbHJlc3VsdCcpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKVxuICA7XG5cbiAgY29uc3QgdmlzbWFwID0ge1xuICAgIGNpcmNsZTogQ2lyY2xlSGlzdG9ncmFtLFxuICAgIGhpc3RvZ3JhbTogSGlzdG9ncmFtLFxuICAgIHRpbWVzZXJpZXM6IFRpbWVTZXJpZXMsXG4gICAgY29tcG9uZW50c3BlZWQ6IENvbXBvbmVudFNwZWVkLFxuICAgIG9yaWVudGF0aW9uY2hhbmdlOiBPcmllbnRhdGlvbkNoYW5nZVxuICB9XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBSZXN1bHRzVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKHRtcGwpIHtcbiAgICAgIHN1cGVyKHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25UaWNrJywgJ19vblZpc3VhbGl6YXRpb25DaGFuZ2UnLCAnX29uTW9kZWxDaGFuZ2UnLCAnYWN0aXZhdGVNb2RlbENvbXBhcmlzb24nLCAnX21vdmVUYWJzJ10pO1xuXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQgPSBWaXN1YWxSZXN1bHQuY3JlYXRlKCk7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlRpY2snLCB0aGlzLl9vblRpY2spO1xuICAgICAgdGhpcy5fZ3JhcGhzID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy52aXN1YWxpemF0aW9uLnZpc3VhbGl6YXRpb25UeXBlcycpLm1hcCgodmlzQ29uZikgPT4ge1xuICAgICAgICB2aXNDb25mLnNldHRpbmdzLmlkID0gdmlzQ29uZi5pZDtcbiAgICAgICAgcmV0dXJuIHZpc21hcFt2aXNDb25mLmlkXS5jcmVhdGUodmlzQ29uZi5zZXR0aW5ncyk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXN1YWxSZXN1bHQudmlldygpLCAnLnJlc3VsdHNfX2V1Z2xlbmEnKTtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICB0aGlzLmFkZENoaWxkKGdyYXBoLnZpZXcoKSwgJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJyk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5saWdodENvbmZpZyA9IG51bGw7XG5cbiAgICAgIHZhciBtb2RlbE9wdHMgPSB7fTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykgJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykubGVuZ3RoID09IDIpIHtcbiAgICAgICAgbW9kZWxPcHRzID0ge1xuICAgICAgICAgJ25vbmUnOiAnTm8gTW9kZWwnLFxuICAgICAgICAgJ2JvdGgnOiAnQm90aCBNb2RlbHMnXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtb2RlbE9wdHMgPSB7XG4gICAgICAgICAnbm9uZSc6ICdObyBNb2RlbCdcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykuZm9yRWFjaCgodGFiQ29uZiwgaW5kKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicy5sZW5ndGgnKT09MSA/ICcnIDogU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGluZClcbiAgICAgICAgbW9kZWxPcHRzW2lkXSA9IGBNb2RlbCAke2lkLnRvVXBwZXJDYXNlKCl9YDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3QgPSBTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogJ21vZGVsJyxcbiAgICAgICAgbGFiZWw6ICdNb2RlbCcsXG4gICAgICAgIG9wdGlvbnM6IG1vZGVsT3B0cyxcbiAgICAgICAgaW5pdGlhbFZhbHVlOiAnbm9uZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVHVybiBtb2RlbHMgb24gb3Igb2ZmLidcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUoJ25vbmUnKVxuXG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fbW9kZWxTZWxlY3QudmlldygpLCAnLnJlc3VsdHNfX2NvbnRyb2xzX19tb2RlbCcpO1xuICAgICAgICB0aGlzLl9tb2RlbFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmVuYWJsZURpcmVjdENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHRfMiA9IFZpc3VhbFJlc3VsdC5jcmVhdGUoKTtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuaGlkZUNvbnRyb2xzKCk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxzJykuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicmVzdWx0c19fZXVnbGVuYV8yXCI+XG4gICAgICAgIDxoMiBjbGFzcz1cInJlc3VsdHNfX3RpdGxlXCI+VmlldyBvZiBNaWNyb3Njb3BlIGFuZCBNb2RlbCBCPC9oMj48L2Rpdj5gKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXN1YWxSZXN1bHRfMi52aWV3KCksICcucmVzdWx0c19fZXVnbGVuYV8yJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hXzInKS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZpc09wdHMgPSB7fTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlzdWFsaXphdGlvbi52aXN1YWxpemF0aW9uVHlwZXMnKS5mb3JFYWNoKCh2aXNDb25mKSA9PiB7XG4gICAgICAgIHZpc09wdHNbdmlzQ29uZi5pZF0gPSB2aXNDb25mLmxhYmVsO1xuICAgICAgfSlcblxuICAgICAgdGhpcy5fdmlzU2VsZWN0ID0gU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6IFwidmlzdWFsaXphdGlvblwiLFxuICAgICAgICBsYWJlbDogJ1Zpc3VhbGl6YXRpb24nLFxuICAgICAgICBvcHRpb25zOiB2aXNPcHRzLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0VhY2ggdmlzdWFsaXphdGlvbiBzaG93cyBkaWZmZXJlbnQgYXNwZWN0cyBvZiBob3cgdGhlIEV1Z2xlbmEgb3IgbW9kZWxzIGJlaGF2ZS4nXG4gICAgICB9KTtcblxuICAgICAgaWYoT2JqZWN0LmtleXModmlzT3B0cykubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzU2VsZWN0LnZpZXcoKSwgJy5yZXN1bHRzX19jb250cm9sc19fdmlzdWFsaXphdGlvbicpO1xuICAgICAgICB0aGlzLl92aXNTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKTtcbiAgICAgICAgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKHsgY3VycmVudFRhcmdldDogdGhpcy5fdmlzU2VsZWN0IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLmNsaWNrKHRoaXMuX21vdmVUYWJzKTtcblxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuZGlyZWN0Q29tcGFyaXNvbicsIHRoaXMuYWN0aXZhdGVNb2RlbENvbXBhcmlzb24pO1xuXG4gICAgfVxuXG4gICAgX21vdmVUYWJzKCkge1xuICAgICAgaWYgKHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLmhhc0NsYXNzKCdub3RmbGlwcGVkWCcpKSB7XG4gICAgICAgIHZhciBoaWRlVGFiID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI21vdmVUYWJzJykucmVtb3ZlQ2xhc3MoJ25vdGZsaXBwZWRYJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLmFkZENsYXNzKCdmbGlwcGVkWCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGhpZGVUYWIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI21vdmVUYWJzJykucmVtb3ZlQ2xhc3MoJ2ZsaXBwZWRYJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLmFkZENsYXNzKCdub3RmbGlwcGVkWCcpO1xuICAgICAgfVxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdJbnRlcmFjdGl2ZVRhYnMuVG9nZ2xlJyx7aGlkZVRhYjogaGlkZVRhYn0pO1xuXG4gICAgfVxuXG4gICAgX29uVGljayhldnQpIHtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBncmFwaC51cGRhdGUoZXZ0LmRhdGEudGltZSwgZXZ0LmRhdGEubGlnaHRzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV4cCwgcmVzLCBtb2RlbENvbXBhcmlzb24gPSBmYWxzZSkge1xuICAgICAgdGhpcy5saWdodENvbmZpZyA9IGV4cC5jb25maWd1cmF0aW9uO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2NvbnRyb2xzX19leHBlcmltZW50JykuaHRtbChgPGxhYmVsPkV4cGVyaW1lbnQ6PC9sYWJlbD48c3BhbiBjbGFzcz1cIlwiPiR7KG5ldyBEYXRlKGV4cC5kYXRlX2NyZWF0ZWQpKS50b0xvY2FsZVN0cmluZygpfTwvc3Bhbj5gKVxuICAgICAgaWYgKHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgICAgZ3JhcGgucmVzZXQoKTtcbiAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ2xpdmUnLCB0aGlzLmxpZ2h0Q29uZmlnKTtcbiAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsICdtb2RlbCcsIHRoaXMubGlnaHRDb25maWcpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmhhbmRsZUxpZ2h0RGF0YShleHAuY29uZmlndXJhdGlvbik7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQucGxheShyZXMpO1xuXG4gICAgICBpZihHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuaGFuZGxlTGlnaHREYXRhKGV4cC5jb25maWd1cmF0aW9uKTtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIucGxheShyZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZU1vZGVsUmVzdWx0cyhtb2RlbCwgcmVzLCB0YWJJZCwgbW9kZWxDb21wYXJpc29uID0gZmFsc2UpIHtcblxuICAgICAgaWYgKCFtb2RlbENvbXBhcmlzb24pIHtcblxuICAgICAgICBsZXQgY29sb3IgPSAwO1xuICAgICAgICBpZiAodGFiSWQgIT0gJ25vbmUnKSB7XG4gICAgICAgICAgY29sb3IgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHt0YWJJZH1gKS5jb2xvcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT0gJ3NlcXVlbnRpYWwnKSB7XG4gICAgICAgICAgICBpZiAodGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgIGdyYXBoLnNldExpdmUodHJ1ZSk7XG4gICAgICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEobnVsbCwgJ21vZGVsJywgdGhpcy5saWdodENvbmZpZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBncmFwaC5zZXRMaXZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShyZXMsICdtb2RlbCcsIHRoaXMubGlnaHRDb25maWcsIGNvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShyZXMsICdtb2RlbCcsIHRoaXMubGlnaHRDb25maWcsIGNvbG9yKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmhhbmRsZU1vZGVsRGF0YShyZXMsIG1vZGVsLCBjb2xvcik7IC8vIEFjdGl2YXRlIHRoZSBldWdsZW5hIG1pbmkgbW9kZWxzIGZvciB0aGUgY29ycmVzcG9uZGluZyBNb2RlbFxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuUmVzZXRSZXF1ZXN0Jyx7fSk7XG4gICAgICAgIGlmICh0YWJJZCAhPSB0aGlzLl9tb2RlbFNlbGVjdC52YWx1ZSgpKSB7XG4gICAgICAgICAgdGhpcy5fc2lsZW5jZU1vZGVsU2VsZWN0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9tb2RlbFNlbGVjdC5zZXRWYWx1ZSh0YWJJZCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zaWxlbmNlTW9kZWxTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgeyAvLyBJZiBtb2RlbCBjb21wYXJpc29uIGlzIGFjdGl2YXRlZFxuICAgICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsJ21vZGVsJywgdGhpcy5saWdodENvbmZpZyk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgbGV0IGNvbG9yID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7dGFiSWR9YCkuY29sb3IoKTtcblxuICAgICAgICBpZiAodGFiSWQgPT0gJ2EnKSB7dGhpcy5fdmlzdWFsUmVzdWx0LmhhbmRsZU1vZGVsRGF0YShyZXMsIG1vZGVsLCBjb2xvcil9XG4gICAgICAgIGVsc2UgaWYgKHRhYklkID09ICdiJykge3RoaXMuX3Zpc3VhbFJlc3VsdF8yLmhhbmRsZU1vZGVsRGF0YShyZXMsIG1vZGVsLCBjb2xvcil9XG5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19jb250cm9sc19fZXhwZXJpbWVudCcpLmh0bWwoYDxsYWJlbD5FeHBlcmltZW50OjwvbGFiZWw+PHNwYW4gY2xhc3M9XCJcIj4oTmV3IEV4cGVyaW1lbnQpPC9zcGFuPmApXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuY2xlYXIoKTtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBncmFwaC5yZXNldCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2hvd1ZpZGVvKGFjdGl2ZVZpZGVvKSB7XG4gICAgICAvL3RoaXMuX3Zpc3VhbFJlc3VsdC5zaG93VmlkZW8oYWN0aXZlVmlkZW8pO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmRpc3BhdGNoRXZlbnQoJ1ZpZGVvUmVzdWx0LlNob3dWaWRlbycsIHtzaG93VmlkZW86IGFjdGl2ZVZpZGVvfSk7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZW5hYmxlRGlyZWN0Q29tcGFyaXNvbicpKSB7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLmRpc3BhdGNoRXZlbnQoJ1ZpZGVvUmVzdWx0LlNob3dWaWRlbycsIHtzaG93VmlkZW86IGFjdGl2ZVZpZGVvfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uVmlzdWFsaXphdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBpZiAoZ3JhcGguaWQoKSA9PSBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpKSB7XG4gICAgICAgICAgZ3JhcGgudmlldygpLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncmFwaC52aWV3KCkuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwidmlzdWFsaXphdGlvbl9jaGFuZ2VcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCkgcmV0dXJuO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdSZXN1bHRzVmlldy5SZXF1ZXN0TW9kZWxEYXRhJywge1xuICAgICAgICB0YWJJZDogZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBhY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbigpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKS5oaWRlKCk7XG4gICAgICAgIHRoaXMuX3Zpc1NlbGVjdC5oaWRlKCk7XG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2V1Z2xlbmEnKS5jaGlsZHJlbignLnJlc3VsdHNfX3RpdGxlJykuaHRtbChcIlZpZXcgb2YgTWljcm9zY29wZSBhbmQgTW9kZWwgQVwiKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2V1Z2xlbmFfMicpLnNob3coKTtcblxuICAgICAgfSBlbHNlIHsgLy8gaGlkZSB0aGUgZGl2IGZvciB2aXN1YWxSZXN1bHRfMlxuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hJykuY2hpbGRyZW4oJy5yZXN1bHRzX190aXRsZScpLmh0bWwoXCJWaWV3IG9mIE1pY3Jvc2NvcGVcIik7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hXzInKS5oaWRlKCk7XG5cbiAgICAgICAgaWYoT2JqZWN0LmtleXModGhpcy5fdmlzU2VsZWN0Ll9tb2RlbC5fZGF0YS5vcHRpb25zKS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLnNob3coKTtcbiAgICAgICAgICB0aGlzLl92aXNTZWxlY3Quc2hvdygpO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUoJ25vbmUnKTtcbiAgICAgIHRoaXMuX3Zpc1NlbGVjdC5zZXRWYWx1ZSh0aGlzLl92aXNTZWxlY3QuZ2V0QWJsZU9wdGlvbnMoKVswXSlcbiAgICB9XG4gIH1cbn0pXG4iXX0=
