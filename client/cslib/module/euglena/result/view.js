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

      var modelOpts = {};
      if (Globals.get('AppConfig.system.enableDirectComparison')) {
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
      _this.addChild(_this._visSelect.view(), '.results__controls__visualization');
      _this._visSelect.addEventListener('Field.Change', _this._onVisualizationChange);
      _this._onVisualizationChange({ currentTarget: _this._visSelect });

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
          // delete the div for visualResult_2

          this.$el.find('.results__euglena').children('.results__title').html("View of Microscope");
          this.$el.find('.results__euglena_2').hide();

          this.$el.find('.results__visualization').show();
          this._visSelect.show();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJWaXN1YWxSZXN1bHQiLCJTZWxlY3RGaWVsZCIsInZpc21hcCIsImNpcmNsZSIsImhpc3RvZ3JhbSIsInRpbWVzZXJpZXMiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdmlzdWFsUmVzdWx0IiwiY3JlYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblRpY2siLCJfZ3JhcGhzIiwiZ2V0IiwibWFwIiwidmlzQ29uZiIsInNldHRpbmdzIiwiaWQiLCJhZGRDaGlsZCIsInZpZXciLCJmb3JFYWNoIiwiZ3JhcGgiLCJtb2RlbE9wdHMiLCJ0YWJDb25mIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidG9VcHBlckNhc2UiLCJfbW9kZWxTZWxlY3QiLCJsYWJlbCIsIm9wdGlvbnMiLCJfb25Nb2RlbENoYW5nZSIsIl92aXN1YWxSZXN1bHRfMiIsImhpZGVDb250cm9scyIsIiRlbCIsImZpbmQiLCJhcHBlbmQiLCJoaWRlIiwidmlzT3B0cyIsIl92aXNTZWxlY3QiLCJfb25WaXN1YWxpemF0aW9uQ2hhbmdlIiwiY3VycmVudFRhcmdldCIsImFjdGl2YXRlTW9kZWxDb21wYXJpc29uIiwiZXZ0IiwidXBkYXRlIiwiZGF0YSIsInRpbWUiLCJsaWdodHMiLCJleHAiLCJyZXMiLCJtb2RlbENvbXBhcmlzb24iLCJodG1sIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsInRvTG9jYWxlU3RyaW5nIiwiaXMiLCJyZXNldCIsImhhbmRsZURhdGEiLCJoYW5kbGVMaWdodERhdGEiLCJjb25maWd1cmF0aW9uIiwicGxheSIsIm1vZGVsIiwidGFiSWQiLCJjb2xvciIsInNldExpdmUiLCJoYW5kbGVNb2RlbERhdGEiLCJ2YWx1ZSIsIl9zaWxlbmNlTW9kZWxTZWxlY3QiLCJzZXRWYWx1ZSIsInRoZW4iLCJjbGVhciIsImFjdGl2ZVZpZGVvIiwiZGlzcGF0Y2hFdmVudCIsInNob3dWaWRlbyIsInNob3ciLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ2aXN1YWxpemF0aW9uIiwiY2hpbGRyZW4iLCJnZXRBYmxlT3B0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHFCQUFSLENBRGI7QUFBQSxNQUVFTSxrQkFBa0JOLFFBQVEsMkNBQVIsQ0FGcEI7QUFBQSxNQUdFTyxZQUFZUCxRQUFRLGlEQUFSLENBSGQ7QUFBQSxNQUlFUSxhQUFhUixRQUFRLG1EQUFSLENBSmY7QUFBQSxNQUtFUyxlQUFlVCxRQUFRLDZDQUFSLENBTGpCO0FBQUEsTUFNRVUsY0FBY1YsUUFBUSxrQ0FBUixDQU5oQjs7QUFTQSxNQUFNVyxTQUFTO0FBQ2JDLFlBQVFOLGVBREs7QUFFYk8sZUFBV04sU0FGRTtBQUdiTyxnQkFBWU47QUFIQyxHQUFmOztBQU1BUixVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UseUJBQVllLElBQVosRUFBa0I7QUFBQTs7QUFBQSw0SEFDVkEsUUFBUVYsUUFERTs7QUFFaEJILFlBQU1jLFdBQU4sUUFBd0IsQ0FBQyxTQUFELEVBQVksd0JBQVosRUFBc0MsZ0JBQXRDLENBQXhCOztBQUVBLFlBQUtDLGFBQUwsR0FBcUJSLGFBQWFTLE1BQWIsRUFBckI7QUFDQSxZQUFLRCxhQUFMLENBQW1CRSxnQkFBbkIsQ0FBb0MsbUJBQXBDLEVBQXlELE1BQUtDLE9BQTlEO0FBQ0EsWUFBS0Ms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NEMsUUFBbkMsQ0FBNEMsaUJBQTVDLEVBQStENUIsSUFBL0QsQ0FBb0Usb0JBQXBFO0FBQ0EsZUFBS2pCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHFCQUFkLEVBQXFDRSxJQUFyQzs7QUFFQSxlQUFLSCxHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5Q3VDLElBQXpDO0FBQ0EsZUFBS25DLFVBQUwsQ0FBZ0JtQyxJQUFoQjtBQUVEO0FBRUY7QUFqTUg7QUFBQTtBQUFBLDhCQW1NVTtBQUNOLGFBQUtKLEtBQUw7QUFDQSxhQUFLMUMsWUFBTCxDQUFrQndDLFFBQWxCLENBQTJCLE1BQTNCO0FBQ0EsYUFBSzdCLFVBQUwsQ0FBZ0I2QixRQUFoQixDQUF5QixLQUFLN0IsVUFBTCxDQUFnQnlDLGNBQWhCLEdBQWlDLENBQWpDLENBQXpCO0FBQ0Q7QUF2TUg7O0FBQUE7QUFBQSxJQUFpQ3JGLE9BQWpDO0FBeU1ELENBL05EIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vcmVzdWx0cy5odG1sJyksXG4gICAgQ2lyY2xlSGlzdG9ncmFtID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvY2lyY2xlZ3JhcGgvY2lyY2xlZ3JhcGgnKSxcbiAgICBIaXN0b2dyYW0gPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC9oaXN0b2dyYW1ncmFwaCcpLFxuICAgIFRpbWVTZXJpZXMgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdGltZXNlcmllc2dyYXBoJyksXG4gICAgVmlzdWFsUmVzdWx0ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3Zpc3VhbHJlc3VsdCcpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKVxuICA7XG5cbiAgY29uc3QgdmlzbWFwID0ge1xuICAgIGNpcmNsZTogQ2lyY2xlSGlzdG9ncmFtLFxuICAgIGhpc3RvZ3JhbTogSGlzdG9ncmFtLFxuICAgIHRpbWVzZXJpZXM6IFRpbWVTZXJpZXNcbiAgfVxuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgUmVzdWx0c1ZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcih0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVGljaycsICdfb25WaXN1YWxpemF0aW9uQ2hhbmdlJywgJ19vbk1vZGVsQ2hhbmdlJ10pO1xuXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQgPSBWaXN1YWxSZXN1bHQuY3JlYXRlKCk7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlRpY2snLCB0aGlzLl9vblRpY2spO1xuICAgICAgdGhpcy5fZ3JhcGhzID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy52aXN1YWxpemF0aW9uLnZpc3VhbGl6YXRpb25UeXBlcycpLm1hcCgodmlzQ29uZikgPT4ge1xuICAgICAgICB2aXNDb25mLnNldHRpbmdzLmlkID0gdmlzQ29uZi5pZDtcbiAgICAgICAgcmV0dXJuIHZpc21hcFt2aXNDb25mLmlkXS5jcmVhdGUodmlzQ29uZi5zZXR0aW5ncyk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXN1YWxSZXN1bHQudmlldygpLCAnLnJlc3VsdHNfX2V1Z2xlbmEnKTtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICB0aGlzLmFkZENoaWxkKGdyYXBoLnZpZXcoKSwgJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJyk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIG1vZGVsT3B0cyA9IHt9O1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmVuYWJsZURpcmVjdENvbXBhcmlzb24nKSkge1xuICAgICAgICBtb2RlbE9wdHMgPSB7XG4gICAgICAgICAnbm9uZSc6ICdObyBNb2RlbCcsXG4gICAgICAgICAnYm90aCc6ICdCb3RoIE1vZGVscydcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vZGVsT3B0cyA9IHtcbiAgICAgICAgICdub25lJzogJ05vIE1vZGVsJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykuZm9yRWFjaCgodGFiQ29uZiwgaW5kKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBpbmQpXG4gICAgICAgIG1vZGVsT3B0c1tpZF0gPSBgTW9kZWwgJHtpZC50b1VwcGVyQ2FzZSgpfWA7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0ID0gU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdtb2RlbCcsXG4gICAgICAgIGxhYmVsOiAnTW9kZWwnLFxuICAgICAgICBvcHRpb25zOiBtb2RlbE9wdHNcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tb2RlbFNlbGVjdC52aWV3KCksICcucmVzdWx0c19fY29udHJvbHNfX21vZGVsJyk7XG4gICAgICB0aGlzLl9tb2RlbFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcblxuXG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZW5hYmxlRGlyZWN0Q29tcGFyaXNvbicpKSB7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yID0gVmlzdWFsUmVzdWx0LmNyZWF0ZSgpO1xuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHRfMi5oaWRlQ29udHJvbHMoKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX3Zpc3VhbHMnKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJyZXN1bHRzX19ldWdsZW5hXzJcIj5cbiAgICAgICAgPGgyIGNsYXNzPVwicmVzdWx0c19fdGl0bGVcIj5WaWV3IG9mIE1pY3Jvc2NvcGUgYW5kIE1vZGVsIEI8L2gyPjwvZGl2PmApO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3Zpc3VhbFJlc3VsdF8yLnZpZXcoKSwgJy5yZXN1bHRzX19ldWdsZW5hXzInKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2V1Z2xlbmFfMicpLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmlzT3B0cyA9IHt9O1xuICAgICAgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy52aXN1YWxpemF0aW9uLnZpc3VhbGl6YXRpb25UeXBlcycpLmZvckVhY2goKHZpc0NvbmYpID0+IHtcbiAgICAgICAgdmlzT3B0c1t2aXNDb25mLmlkXSA9IHZpc0NvbmYubGFiZWw7XG4gICAgICB9KVxuXG4gICAgICB0aGlzLl92aXNTZWxlY3QgPSBTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogXCJ2aXN1YWxpemF0aW9uXCIsXG4gICAgICAgIGxhYmVsOiAnVmlzdWFsaXphdGlvbicsXG4gICAgICAgIG9wdGlvbnM6IHZpc09wdHNcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXNTZWxlY3QudmlldygpLCAnLnJlc3VsdHNfX2NvbnRyb2xzX192aXN1YWxpemF0aW9uJyk7XG4gICAgICB0aGlzLl92aXNTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKTtcbiAgICAgIHRoaXMuX29uVmlzdWFsaXphdGlvbkNoYW5nZSh7IGN1cnJlbnRUYXJnZXQ6IHRoaXMuX3Zpc1NlbGVjdCB9KTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXVnbGVuYU1vZGVsLmRpcmVjdENvbXBhcmlzb24nLCB0aGlzLmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKTtcblxuICAgIH1cblxuICAgIF9vblRpY2soZXZ0KSB7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgZ3JhcGgudXBkYXRlKGV2dC5kYXRhLnRpbWUsIGV2dC5kYXRhLmxpZ2h0cyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGVFeHBlcmltZW50UmVzdWx0cyhleHAsIHJlcywgbW9kZWxDb21wYXJpc29uID0gZmFsc2UpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19jb250cm9sc19fZXhwZXJpbWVudCcpLmh0bWwoYDxsYWJlbD5FeHBlcmltZW50OjwvbGFiZWw+PHNwYW4gY2xhc3M9XCJcIj4keyhuZXcgRGF0ZShleHAuZGF0ZV9jcmVhdGVkKSkudG9Mb2NhbGVTdHJpbmcoKX08L3NwYW4+YClcbiAgICAgIGlmICh0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShyZXMsICdsaXZlJyk7XG4gICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCAnbW9kZWwnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5oYW5kbGVMaWdodERhdGEoZXhwLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LnBsYXkocmVzKTtcblxuICAgICAgaWYoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZW5hYmxlRGlyZWN0Q29tcGFyaXNvbicpKSB7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLmhhbmRsZUxpZ2h0RGF0YShleHAuY29uZmlndXJhdGlvbik7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLnBsYXkocmVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVNb2RlbFJlc3VsdHMobW9kZWwsIHJlcywgdGFiSWQsIG1vZGVsQ29tcGFyaXNvbiA9IGZhbHNlKSB7XG5cbiAgICAgIGlmICghbW9kZWxDb21wYXJpc29uKSB7XG5cbiAgICAgICAgbGV0IGNvbG9yID0gMDtcbiAgICAgICAgaWYgKHRhYklkICE9ICdub25lJykge1xuICAgICAgICAgIGNvbG9yID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7dGFiSWR9YCkuY29sb3IoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdzZXF1ZW50aWFsJykge1xuICAgICAgICAgICAgaWYgKHRhYklkID09ICdub25lJykge1xuICAgICAgICAgICAgICBncmFwaC5zZXRMaXZlKHRydWUpO1xuICAgICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsICdtb2RlbCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZ3JhcGguc2V0TGl2ZShmYWxzZSk7XG4gICAgICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbW9kZWwnLCBjb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbW9kZWwnLCBjb2xvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5oYW5kbGVNb2RlbERhdGEocmVzLCBtb2RlbCwgY29sb3IpOyAvLyBBY3RpdmF0ZSB0aGUgZXVnbGVuYSBtaW5pIG1vZGVscyBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgTW9kZWxcbiAgICAgICAgaWYgKHRhYklkICE9IHRoaXMuX21vZGVsU2VsZWN0LnZhbHVlKCkpIHtcbiAgICAgICAgICB0aGlzLl9zaWxlbmNlTW9kZWxTZWxlY3QgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKHRhYklkKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCA9IGZhbHNlO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7IC8vIElmIG1vZGVsIGNvbXBhcmlzb24gaXMgYWN0aXZhdGVkXG4gICAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEobnVsbCwnbW9kZWwnKTtcbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgY29sb3IgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHt0YWJJZH1gKS5jb2xvcigpO1xuXG4gICAgICAgIGlmICh0YWJJZCA9PSAnYScpIHt0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKX1cbiAgICAgICAgZWxzZSBpZiAodGFiSWQgPT0gJ2InKSB7dGhpcy5fdmlzdWFsUmVzdWx0XzIuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKX1cblxuICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2NvbnRyb2xzX19leHBlcmltZW50JykuaHRtbChgPGxhYmVsPkV4cGVyaW1lbnQ6PC9sYWJlbD48c3BhbiBjbGFzcz1cIlwiPihOZXcgRXhwZXJpbWVudCk8L3NwYW4+YClcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5jbGVhcigpO1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzaG93VmlkZW8oYWN0aXZlVmlkZW8pIHtcbiAgICAgIC8vdGhpcy5fdmlzdWFsUmVzdWx0LnNob3dWaWRlbyhhY3RpdmVWaWRlbyk7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuZGlzcGF0Y2hFdmVudCgnVmlkZW9SZXN1bHQuU2hvd1ZpZGVvJywge3Nob3dWaWRlbzogYWN0aXZlVmlkZW99KTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuZGlzcGF0Y2hFdmVudCgnVmlkZW9SZXN1bHQuU2hvd1ZpZGVvJywge3Nob3dWaWRlbzogYWN0aXZlVmlkZW99KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25WaXN1YWxpemF0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGlmIChncmFwaC5pZCgpID09IGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKCkpIHtcbiAgICAgICAgICBncmFwaC52aWV3KCkuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyYXBoLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJ2aXN1YWxpemF0aW9uX2NoYW5nZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fc2lsZW5jZU1vZGVsU2VsZWN0KSByZXR1cm47XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1Jlc3VsdHNWaWV3LlJlcXVlc3RNb2RlbERhdGEnLCB7XG4gICAgICAgIHRhYklkOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLmhpZGUoKTtcbiAgICAgICAgdGhpcy5fdmlzU2VsZWN0LmhpZGUoKTtcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYScpLmNoaWxkcmVuKCcucmVzdWx0c19fdGl0bGUnKS5odG1sKFwiVmlldyBvZiBNaWNyb3Njb3BlIGFuZCBNb2RlbCBBXCIpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYV8yJykuc2hvdygpO1xuXG4gICAgICB9IGVsc2UgeyAvLyBkZWxldGUgdGhlIGRpdiBmb3IgdmlzdWFsUmVzdWx0XzJcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYScpLmNoaWxkcmVuKCcucmVzdWx0c19fdGl0bGUnKS5odG1sKFwiVmlldyBvZiBNaWNyb3Njb3BlXCIpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYV8yJykuaGlkZSgpO1xuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuc2hvdygpO1xuICAgICAgICB0aGlzLl92aXNTZWxlY3Quc2hvdygpO1xuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKCdub25lJyk7XG4gICAgICB0aGlzLl92aXNTZWxlY3Quc2V0VmFsdWUodGhpcy5fdmlzU2VsZWN0LmdldEFibGVPcHRpb25zKClbMF0pXG4gICAgfVxuICB9XG59KVxuIl19
