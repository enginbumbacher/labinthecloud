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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJWaXN1YWxSZXN1bHQiLCJTZWxlY3RGaWVsZCIsInZpc21hcCIsImNpcmNsZSIsImhpc3RvZ3JhbSIsInRpbWVzZXJpZXMiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdmlzdWFsUmVzdWx0IiwiY3JlYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblRpY2siLCJfZ3JhcGhzIiwiZ2V0IiwibWFwIiwidmlzQ29uZiIsInNldHRpbmdzIiwiaWQiLCJhZGRDaGlsZCIsInZpZXciLCJmb3JFYWNoIiwiZ3JhcGgiLCJtb2RlbE9wdHMiLCJsZW5ndGgiLCJ0YWJDb25mIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidG9VcHBlckNhc2UiLCJfbW9kZWxTZWxlY3QiLCJsYWJlbCIsIm9wdGlvbnMiLCJpbml0aWFsVmFsdWUiLCJkZXNjcmlwdGlvbiIsInNldFZhbHVlIiwiX29uTW9kZWxDaGFuZ2UiLCJfdmlzdWFsUmVzdWx0XzIiLCJoaWRlQ29udHJvbHMiLCIkZWwiLCJmaW5kIiwiYXBwZW5kIiwiaGlkZSIsInZpc09wdHMiLCJfdmlzU2VsZWN0IiwiT2JqZWN0Iiwia2V5cyIsIl9vblZpc3VhbGl6YXRpb25DaGFuZ2UiLCJjdXJyZW50VGFyZ2V0IiwiY2xpY2siLCJfbW92ZVRhYnMiLCJhY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbiIsImhhc0NsYXNzIiwiaGlkZVRhYiIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJkaXNwYXRjaEV2ZW50IiwiZXZ0IiwidXBkYXRlIiwiZGF0YSIsInRpbWUiLCJsaWdodHMiLCJleHAiLCJyZXMiLCJtb2RlbENvbXBhcmlzb24iLCJodG1sIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsInRvTG9jYWxlU3RyaW5nIiwiaXMiLCJyZXNldCIsImhhbmRsZURhdGEiLCJoYW5kbGVMaWdodERhdGEiLCJjb25maWd1cmF0aW9uIiwicGxheSIsIm1vZGVsIiwidGFiSWQiLCJjb2xvciIsInNldExpdmUiLCJoYW5kbGVNb2RlbERhdGEiLCJ2YWx1ZSIsIl9zaWxlbmNlTW9kZWxTZWxlY3QiLCJ0aGVuIiwiY2xlYXIiLCJhY3RpdmVWaWRlbyIsInNob3dWaWRlbyIsInNob3ciLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ2aXN1YWxpemF0aW9uIiwiY2hpbGRyZW4iLCJfbW9kZWwiLCJfZGF0YSIsImdldEFibGVPcHRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksVUFBVUosUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VLLFdBQVdMLFFBQVEscUJBQVIsQ0FEYjtBQUFBLE1BRUVNLGtCQUFrQk4sUUFBUSwyQ0FBUixDQUZwQjtBQUFBLE1BR0VPLFlBQVlQLFFBQVEsaURBQVIsQ0FIZDtBQUFBLE1BSUVRLGFBQWFSLFFBQVEsbURBQVIsQ0FKZjtBQUFBLE1BS0VTLGVBQWVULFFBQVEsNkNBQVIsQ0FMakI7QUFBQSxNQU1FVSxjQUFjVixRQUFRLGtDQUFSLENBTmhCOztBQVNBLE1BQU1XLFNBQVM7QUFDYkMsWUFBUU4sZUFESztBQUViTyxlQUFXTixTQUZFO0FBR2JPLGdCQUFZTjtBQUhDLEdBQWY7O0FBTUFSLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSx5QkFBWWUsSUFBWixFQUFrQjtBQUFBOztBQUFBLDRIQUNWQSxRQUFRVixRQURFOztBQUVoQkgsWUFBTWMsV0FBTixRQUF3QixDQUFDLFNBQUQsRUFBWSx3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Q0FBSixFQUEwQztBQUN4QyxlQUFLeUIsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUNFLElBQXpDO0FBQ0EsZUFBS0UsVUFBTCxDQUFnQkYsSUFBaEI7O0FBRUEsZUFBS0gsR0FBTCxDQUFTQyxJQUFULENBQWMsbUJBQWQsRUFBbUNtRCxRQUFuQyxDQUE0QyxpQkFBNUMsRUFBK0QxQixJQUEvRCxDQUFvRSxnQ0FBcEU7QUFDQSxlQUFLMUIsR0FBTCxDQUFTQyxJQUFULENBQWMscUJBQWQsRUFBcUM4QyxJQUFyQztBQUVELFNBUEQsTUFPTztBQUFFOztBQUVQLGVBQUsvQyxHQUFMLENBQVNDLElBQVQsQ0FBYyxtQkFBZCxFQUFtQ21ELFFBQW5DLENBQTRDLGlCQUE1QyxFQUErRDFCLElBQS9ELENBQW9FLG9CQUFwRTtBQUNBLGVBQUsxQixHQUFMLENBQVNDLElBQVQsQ0FBYyxxQkFBZCxFQUFxQ0UsSUFBckM7O0FBRUEsY0FBR0csT0FBT0MsSUFBUCxDQUFZLEtBQUtGLFVBQUwsQ0FBZ0JnRCxNQUFoQixDQUF1QkMsS0FBdkIsQ0FBNkI3RCxPQUF6QyxFQUFrRFIsTUFBckQsRUFBNkQ7QUFDM0QsaUJBQUtlLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHlCQUFkLEVBQXlDOEMsSUFBekM7QUFDQSxpQkFBSzFDLFVBQUwsQ0FBZ0IwQyxJQUFoQjtBQUNEO0FBRUY7QUFFRjtBQWxPSDtBQUFBO0FBQUEsOEJBb09VO0FBQ04sYUFBS0gsS0FBTDtBQUNBLGFBQUtyRCxZQUFMLENBQWtCSyxRQUFsQixDQUEyQixNQUEzQjtBQUNBLGFBQUtTLFVBQUwsQ0FBZ0JULFFBQWhCLENBQXlCLEtBQUtTLFVBQUwsQ0FBZ0JrRCxjQUFoQixHQUFpQyxDQUFqQyxDQUF6QjtBQUNEO0FBeE9IOztBQUFBO0FBQUEsSUFBaUNsRyxPQUFqQztBQTBPRCxDQWhRRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9yZXN1bHQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3Jlc3VsdHMuaHRtbCcpLFxuICAgIENpcmNsZUhpc3RvZ3JhbSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoJyksXG4gICAgSGlzdG9ncmFtID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvaGlzdG9ncmFtZ3JhcGgvaGlzdG9ncmFtZ3JhcGgnKSxcbiAgICBUaW1lU2VyaWVzID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvdGltZXNlcmllc2dyYXBoL3RpbWVzZXJpZXNncmFwaCcpLFxuICAgIFZpc3VhbFJlc3VsdCA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L3Zpc3VhbHJlc3VsdC92aXN1YWxyZXN1bHQnKSxcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJylcbiAgO1xuXG4gIGNvbnN0IHZpc21hcCA9IHtcbiAgICBjaXJjbGU6IENpcmNsZUhpc3RvZ3JhbSxcbiAgICBoaXN0b2dyYW06IEhpc3RvZ3JhbSxcbiAgICB0aW1lc2VyaWVzOiBUaW1lU2VyaWVzXG4gIH1cblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFJlc3VsdHNWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IodG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblRpY2snLCAnX29uVmlzdWFsaXphdGlvbkNoYW5nZScsICdfb25Nb2RlbENoYW5nZScsICdhY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbicsICdfbW92ZVRhYnMnXSk7XG5cbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdCA9IFZpc3VhbFJlc3VsdC5jcmVhdGUoKTtcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuVGljaycsIHRoaXMuX29uVGljayk7XG4gICAgICB0aGlzLl9ncmFwaHMgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnZpc3VhbGl6YXRpb24udmlzdWFsaXphdGlvblR5cGVzJykubWFwKCh2aXNDb25mKSA9PiB7XG4gICAgICAgIHZpc0NvbmYuc2V0dGluZ3MuaWQgPSB2aXNDb25mLmlkO1xuICAgICAgICByZXR1cm4gdmlzbWFwW3Zpc0NvbmYuaWRdLmNyZWF0ZSh2aXNDb25mLnNldHRpbmdzKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3Zpc3VhbFJlc3VsdC52aWV3KCksICcucmVzdWx0c19fZXVnbGVuYScpO1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoZ3JhcGgudmlldygpLCAnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbW9kZWxPcHRzID0ge307XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZW5hYmxlRGlyZWN0Q29tcGFyaXNvbicpICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmxlbmd0aCA9PSAyKSB7XG4gICAgICAgIG1vZGVsT3B0cyA9IHtcbiAgICAgICAgICdub25lJzogJ05vIE1vZGVsJyxcbiAgICAgICAgICdib3RoJzogJ0JvdGggTW9kZWxzJ1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW9kZWxPcHRzID0ge1xuICAgICAgICAgJ25vbmUnOiAnTm8gTW9kZWwnXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmZvckVhY2goKHRhYkNvbmYsIGluZCkgPT4ge1xuICAgICAgICBsZXQgaWQgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnRhYnMubGVuZ3RoJyk9PTEgPyAnJyA6IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBpbmQpXG4gICAgICAgIG1vZGVsT3B0c1tpZF0gPSBgTW9kZWwgJHtpZC50b1VwcGVyQ2FzZSgpfWA7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0ID0gU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdtb2RlbCcsXG4gICAgICAgIGxhYmVsOiAnTW9kZWwnLFxuICAgICAgICBvcHRpb25zOiBtb2RlbE9wdHMsXG4gICAgICAgIGluaXRpYWxWYWx1ZTogJ25vbmUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1R1cm4gbW9kZWxzIG9uIG9yIG9mZi4nXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKCdub25lJylcblxuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX21vZGVsU2VsZWN0LnZpZXcoKSwgJy5yZXN1bHRzX19jb250cm9sc19fbW9kZWwnKTtcbiAgICAgICAgdGhpcy5fbW9kZWxTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIgPSBWaXN1YWxSZXN1bHQuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLmhpZGVDb250cm9scygpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFscycpLmFwcGVuZChgPGRpdiBjbGFzcz1cInJlc3VsdHNfX2V1Z2xlbmFfMlwiPlxuICAgICAgICA8aDIgY2xhc3M9XCJyZXN1bHRzX190aXRsZVwiPlZpZXcgb2YgTWljcm9zY29wZSBhbmQgTW9kZWwgQjwvaDI+PC9kaXY+YCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzdWFsUmVzdWx0XzIudmlldygpLCAnLnJlc3VsdHNfX2V1Z2xlbmFfMicpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYV8yJykuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB2aXNPcHRzID0ge307XG4gICAgICBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnZpc3VhbGl6YXRpb24udmlzdWFsaXphdGlvblR5cGVzJykuZm9yRWFjaCgodmlzQ29uZikgPT4ge1xuICAgICAgICB2aXNPcHRzW3Zpc0NvbmYuaWRdID0gdmlzQ29uZi5sYWJlbDtcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuX3Zpc1NlbGVjdCA9IFNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGlkOiBcInZpc3VhbGl6YXRpb25cIixcbiAgICAgICAgbGFiZWw6ICdWaXN1YWxpemF0aW9uJyxcbiAgICAgICAgb3B0aW9uczogdmlzT3B0cyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdFYWNoIHZpc3VhbGl6YXRpb24gc2hvd3MgZGlmZmVyZW50IGFzcGVjdHMgb2YgaG93IHRoZSBFdWdsZW5hIG9yIG1vZGVscyBiZWhhdmUuJ1xuICAgICAgfSk7XG5cbiAgICAgIGlmKE9iamVjdC5rZXlzKHZpc09wdHMpLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3Zpc1NlbGVjdC52aWV3KCksICcucmVzdWx0c19fY29udHJvbHNfX3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgICAgdGhpcy5fdmlzU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLkNoYW5nZScsIHRoaXMuX29uVmlzdWFsaXphdGlvbkNoYW5nZSk7XG4gICAgICAgIHRoaXMuX29uVmlzdWFsaXphdGlvbkNoYW5nZSh7IGN1cnJlbnRUYXJnZXQ6IHRoaXMuX3Zpc1NlbGVjdCB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiRlbC5maW5kKCcjbW92ZVRhYnMnKS5jbGljayh0aGlzLl9tb3ZlVGFicyk7XG5cblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXVnbGVuYU1vZGVsLmRpcmVjdENvbXBhcmlzb24nLCB0aGlzLmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKTtcblxuICAgIH1cblxuICAgIF9tb3ZlVGFicygpIHtcbiAgICAgIGlmICh0aGlzLiRlbC5maW5kKCcjbW92ZVRhYnMnKS5oYXNDbGFzcygnbm90ZmxpcHBlZFgnKSkge1xuICAgICAgICB2YXIgaGlkZVRhYiA9IHRydWU7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLnJlbW92ZUNsYXNzKCdub3RmbGlwcGVkWCcpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjbW92ZVRhYnMnKS5hZGRDbGFzcygnZmxpcHBlZFgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBoaWRlVGFiID0gZmFsc2U7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLnJlbW92ZUNsYXNzKCdmbGlwcGVkWCcpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjbW92ZVRhYnMnKS5hZGRDbGFzcygnbm90ZmxpcHBlZFgnKTtcbiAgICAgIH1cblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnSW50ZXJhY3RpdmVUYWJzLlRvZ2dsZScse2hpZGVUYWI6IGhpZGVUYWJ9KTtcblxuICAgIH1cblxuICAgIF9vblRpY2soZXZ0KSB7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgZ3JhcGgudXBkYXRlKGV2dC5kYXRhLnRpbWUsIGV2dC5kYXRhLmxpZ2h0cyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGVFeHBlcmltZW50UmVzdWx0cyhleHAsIHJlcywgbW9kZWxDb21wYXJpc29uID0gZmFsc2UpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19jb250cm9sc19fZXhwZXJpbWVudCcpLmh0bWwoYDxsYWJlbD5FeHBlcmltZW50OjwvbGFiZWw+PHNwYW4gY2xhc3M9XCJcIj4keyhuZXcgRGF0ZShleHAuZGF0ZV9jcmVhdGVkKSkudG9Mb2NhbGVTdHJpbmcoKX08L3NwYW4+YClcbiAgICAgIGlmICh0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShyZXMsICdsaXZlJyk7XG4gICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCAnbW9kZWwnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5oYW5kbGVMaWdodERhdGEoZXhwLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LnBsYXkocmVzKTtcblxuICAgICAgaWYoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZW5hYmxlRGlyZWN0Q29tcGFyaXNvbicpKSB7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLmhhbmRsZUxpZ2h0RGF0YShleHAuY29uZmlndXJhdGlvbik7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLnBsYXkocmVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVNb2RlbFJlc3VsdHMobW9kZWwsIHJlcywgdGFiSWQsIG1vZGVsQ29tcGFyaXNvbiA9IGZhbHNlKSB7XG5cbiAgICAgIGlmICghbW9kZWxDb21wYXJpc29uKSB7XG5cbiAgICAgICAgbGV0IGNvbG9yID0gMDtcbiAgICAgICAgaWYgKHRhYklkICE9ICdub25lJykge1xuICAgICAgICAgIGNvbG9yID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7dGFiSWR9YCkuY29sb3IoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdzZXF1ZW50aWFsJykge1xuICAgICAgICAgICAgaWYgKHRhYklkID09ICdub25lJykge1xuICAgICAgICAgICAgICBncmFwaC5zZXRMaXZlKHRydWUpO1xuICAgICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsICdtb2RlbCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZ3JhcGguc2V0TGl2ZShmYWxzZSk7XG4gICAgICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbW9kZWwnLCBjb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbW9kZWwnLCBjb2xvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5oYW5kbGVNb2RlbERhdGEocmVzLCBtb2RlbCwgY29sb3IpOyAvLyBBY3RpdmF0ZSB0aGUgZXVnbGVuYSBtaW5pIG1vZGVscyBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgTW9kZWxcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnVmlzdWFsUmVzdWx0LlJlc2V0UmVxdWVzdCcse30pO1xuICAgICAgICBpZiAodGFiSWQgIT0gdGhpcy5fbW9kZWxTZWxlY3QudmFsdWUoKSkge1xuICAgICAgICAgIHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUodGFiSWQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc2lsZW5jZU1vZGVsU2VsZWN0ID0gZmFsc2U7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHsgLy8gSWYgbW9kZWwgY29tcGFyaXNvbiBpcyBhY3RpdmF0ZWRcbiAgICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCdtb2RlbCcpO1xuICAgICAgICB9KVxuXG4gICAgICAgIGxldCBjb2xvciA9IEdsb2JhbHMuZ2V0KGBNb2RlbFRhYi4ke3RhYklkfWApLmNvbG9yKCk7XG5cbiAgICAgICAgaWYgKHRhYklkID09ICdhJykge3RoaXMuX3Zpc3VhbFJlc3VsdC5oYW5kbGVNb2RlbERhdGEocmVzLCBtb2RlbCwgY29sb3IpfVxuICAgICAgICBlbHNlIGlmICh0YWJJZCA9PSAnYicpIHt0aGlzLl92aXN1YWxSZXN1bHRfMi5oYW5kbGVNb2RlbERhdGEocmVzLCBtb2RlbCwgY29sb3IpfVxuXG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fY29udHJvbHNfX2V4cGVyaW1lbnQnKS5odG1sKGA8bGFiZWw+RXhwZXJpbWVudDo8L2xhYmVsPjxzcGFuIGNsYXNzPVwiXCI+KE5ldyBFeHBlcmltZW50KTwvc3Bhbj5gKVxuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmNsZWFyKCk7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgZ3JhcGgucmVzZXQoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNob3dWaWRlbyhhY3RpdmVWaWRlbykge1xuICAgICAgLy90aGlzLl92aXN1YWxSZXN1bHQuc2hvd1ZpZGVvKGFjdGl2ZVZpZGVvKTtcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5kaXNwYXRjaEV2ZW50KCdWaWRlb1Jlc3VsdC5TaG93VmlkZW8nLCB7c2hvd1ZpZGVvOiBhY3RpdmVWaWRlb30pO1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmVuYWJsZURpcmVjdENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHRfMi5kaXNwYXRjaEV2ZW50KCdWaWRlb1Jlc3VsdC5TaG93VmlkZW8nLCB7c2hvd1ZpZGVvOiBhY3RpdmVWaWRlb30pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vblZpc3VhbGl6YXRpb25DaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgaWYgKGdyYXBoLmlkKCkgPT0gZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKSkge1xuICAgICAgICAgIGdyYXBoLnZpZXcoKS5zaG93KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ3JhcGgudmlldygpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInZpc3VhbGl6YXRpb25fY2hhbmdlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHZpc3VhbGl6YXRpb246IGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIGlmICh0aGlzLl9zaWxlbmNlTW9kZWxTZWxlY3QpIHJldHVybjtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnUmVzdWx0c1ZpZXcuUmVxdWVzdE1vZGVsRGF0YScsIHtcbiAgICAgICAgdGFiSWQ6IGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgYWN0aXZhdGVNb2RlbENvbXBhcmlzb24oKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuaGlkZSgpO1xuICAgICAgICB0aGlzLl92aXNTZWxlY3QuaGlkZSgpO1xuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hJykuY2hpbGRyZW4oJy5yZXN1bHRzX190aXRsZScpLmh0bWwoXCJWaWV3IG9mIE1pY3Jvc2NvcGUgYW5kIE1vZGVsIEFcIik7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hXzInKS5zaG93KCk7XG5cbiAgICAgIH0gZWxzZSB7IC8vIGhpZGUgdGhlIGRpdiBmb3IgdmlzdWFsUmVzdWx0XzJcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYScpLmNoaWxkcmVuKCcucmVzdWx0c19fdGl0bGUnKS5odG1sKFwiVmlldyBvZiBNaWNyb3Njb3BlXCIpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYV8yJykuaGlkZSgpO1xuXG4gICAgICAgIGlmKE9iamVjdC5rZXlzKHRoaXMuX3Zpc1NlbGVjdC5fbW9kZWwuX2RhdGEub3B0aW9ucykubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKS5zaG93KCk7XG4gICAgICAgICAgdGhpcy5fdmlzU2VsZWN0LnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKCdub25lJyk7XG4gICAgICB0aGlzLl92aXNTZWxlY3Quc2V0VmFsdWUodGhpcy5fdmlzU2VsZWN0LmdldEFibGVPcHRpb25zKClbMF0pXG4gICAgfVxuICB9XG59KVxuIl19
