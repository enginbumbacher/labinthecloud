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
        options: modelOpts
      });

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJWaXN1YWxSZXN1bHQiLCJTZWxlY3RGaWVsZCIsInZpc21hcCIsImNpcmNsZSIsImhpc3RvZ3JhbSIsInRpbWVzZXJpZXMiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdmlzdWFsUmVzdWx0IiwiY3JlYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblRpY2siLCJfZ3JhcGhzIiwiZ2V0IiwibWFwIiwidmlzQ29uZiIsInNldHRpbmdzIiwiaWQiLCJhZGRDaGlsZCIsInZpZXciLCJmb3JFYWNoIiwiZ3JhcGgiLCJtb2RlbE9wdHMiLCJsZW5ndGgiLCJ0YWJDb25mIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidG9VcHBlckNhc2UiLCJfbW9kZWxTZWxlY3QiLCJsYWJlbCIsIm9wdGlvbnMiLCJfb25Nb2RlbENoYW5nZSIsIl92aXN1YWxSZXN1bHRfMiIsImhpZGVDb250cm9scyIsIiRlbCIsImZpbmQiLCJhcHBlbmQiLCJoaWRlIiwidmlzT3B0cyIsIl92aXNTZWxlY3QiLCJPYmplY3QiLCJrZXlzIiwiX29uVmlzdWFsaXphdGlvbkNoYW5nZSIsImN1cnJlbnRUYXJnZXQiLCJhY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbiIsImV2dCIsInVwZGF0ZSIsImRhdGEiLCJ0aW1lIiwibGlnaHRzIiwiZXhwIiwicmVzIiwibW9kZWxDb21wYXJpc29uIiwiaHRtbCIsIkRhdGUiLCJkYXRlX2NyZWF0ZWQiLCJ0b0xvY2FsZVN0cmluZyIsImlzIiwicmVzZXQiLCJoYW5kbGVEYXRhIiwiaGFuZGxlTGlnaHREYXRhIiwiY29uZmlndXJhdGlvbiIsInBsYXkiLCJtb2RlbCIsInRhYklkIiwiY29sb3IiLCJzZXRMaXZlIiwiaGFuZGxlTW9kZWxEYXRhIiwidmFsdWUiLCJfc2lsZW5jZU1vZGVsU2VsZWN0Iiwic2V0VmFsdWUiLCJ0aGVuIiwiY2xlYXIiLCJhY3RpdmVWaWRlbyIsImRpc3BhdGNoRXZlbnQiLCJzaG93VmlkZW8iLCJzaG93IiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwidmlzdWFsaXphdGlvbiIsImNoaWxkcmVuIiwiX21vZGVsIiwiX2RhdGEiLCJnZXRBYmxlT3B0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHFCQUFSLENBRGI7QUFBQSxNQUVFTSxrQkFBa0JOLFFBQVEsMkNBQVIsQ0FGcEI7QUFBQSxNQUdFTyxZQUFZUCxRQUFRLGlEQUFSLENBSGQ7QUFBQSxNQUlFUSxhQUFhUixRQUFRLG1EQUFSLENBSmY7QUFBQSxNQUtFUyxlQUFlVCxRQUFRLDZDQUFSLENBTGpCO0FBQUEsTUFNRVUsY0FBY1YsUUFBUSxrQ0FBUixDQU5oQjs7QUFTQSxNQUFNVyxTQUFTO0FBQ2JDLFlBQVFOLGVBREs7QUFFYk8sZUFBV04sU0FGRTtBQUdiTyxnQkFBWU47QUFIQyxHQUFmOztBQU1BUixVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UseUJBQVllLElBQVosRUFBa0I7QUFBQTs7QUFBQSw0SEFDVkEsUUFBUVYsUUFERTs7QUFFaEJILFlBQU1jLFdBQU4sUUFBd0IsQ0FBQyxTQUFELEVBQVksd0JBQVosRUFBc0MsZ0JBQXRDLEVBQXdELHlCQUF4RCxDQUF4Qjs7QUFFQSxZQUFLQyxhQUFMLEdBQXFCUixhQUFhUyxNQUFiLEVBQXJCO0FBQ0EsWUFBS0QsYUFBTCxD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Iiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vcmVzdWx0cy5odG1sJyksXG4gICAgQ2lyY2xlSGlzdG9ncmFtID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvY2lyY2xlZ3JhcGgvY2lyY2xlZ3JhcGgnKSxcbiAgICBIaXN0b2dyYW0gPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC9oaXN0b2dyYW1ncmFwaCcpLFxuICAgIFRpbWVTZXJpZXMgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdGltZXNlcmllc2dyYXBoJyksXG4gICAgVmlzdWFsUmVzdWx0ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3Zpc3VhbHJlc3VsdCcpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKVxuICA7XG5cbiAgY29uc3QgdmlzbWFwID0ge1xuICAgIGNpcmNsZTogQ2lyY2xlSGlzdG9ncmFtLFxuICAgIGhpc3RvZ3JhbTogSGlzdG9ncmFtLFxuICAgIHRpbWVzZXJpZXM6IFRpbWVTZXJpZXNcbiAgfVxuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgUmVzdWx0c1ZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcih0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVGljaycsICdfb25WaXN1YWxpemF0aW9uQ2hhbmdlJywgJ19vbk1vZGVsQ2hhbmdlJywgJ2FjdGl2YXRlTW9kZWxDb21wYXJpc29uJ10pO1xuXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQgPSBWaXN1YWxSZXN1bHQuY3JlYXRlKCk7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlRpY2snLCB0aGlzLl9vblRpY2spO1xuICAgICAgdGhpcy5fZ3JhcGhzID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy52aXN1YWxpemF0aW9uLnZpc3VhbGl6YXRpb25UeXBlcycpLm1hcCgodmlzQ29uZikgPT4ge1xuICAgICAgICB2aXNDb25mLnNldHRpbmdzLmlkID0gdmlzQ29uZi5pZDtcbiAgICAgICAgcmV0dXJuIHZpc21hcFt2aXNDb25mLmlkXS5jcmVhdGUodmlzQ29uZi5zZXR0aW5ncyk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXN1YWxSZXN1bHQudmlldygpLCAnLnJlc3VsdHNfX2V1Z2xlbmEnKTtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICB0aGlzLmFkZENoaWxkKGdyYXBoLnZpZXcoKSwgJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJyk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIG1vZGVsT3B0cyA9IHt9O1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmVuYWJsZURpcmVjdENvbXBhcmlzb24nKSAmJiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnRhYnMnKS5sZW5ndGggPT0gMikge1xuICAgICAgICBtb2RlbE9wdHMgPSB7XG4gICAgICAgICAnbm9uZSc6ICdObyBNb2RlbCcsXG4gICAgICAgICAnYm90aCc6ICdCb3RoIE1vZGVscydcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vZGVsT3B0cyA9IHtcbiAgICAgICAgICdub25lJzogJ05vIE1vZGVsJ1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnRhYnMnKS5mb3JFYWNoKCh0YWJDb25mLCBpbmQpID0+IHtcbiAgICAgICAgbGV0IGlkID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzLmxlbmd0aCcpPT0xID8gJycgOiBTdHJpbmcuZnJvbUNoYXJDb2RlKDk3ICsgaW5kKVxuICAgICAgICBtb2RlbE9wdHNbaWRdID0gYE1vZGVsICR7aWQudG9VcHBlckNhc2UoKX1gO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9tb2RlbFNlbGVjdCA9IFNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnbW9kZWwnLFxuICAgICAgICBsYWJlbDogJ01vZGVsJyxcbiAgICAgICAgb3B0aW9uczogbW9kZWxPcHRzXG4gICAgICB9KTtcblxuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX21vZGVsU2VsZWN0LnZpZXcoKSwgJy5yZXN1bHRzX19jb250cm9sc19fbW9kZWwnKTtcbiAgICAgICAgdGhpcy5fbW9kZWxTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIgPSBWaXN1YWxSZXN1bHQuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLmhpZGVDb250cm9scygpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFscycpLmFwcGVuZChgPGRpdiBjbGFzcz1cInJlc3VsdHNfX2V1Z2xlbmFfMlwiPlxuICAgICAgICA8aDIgY2xhc3M9XCJyZXN1bHRzX190aXRsZVwiPlZpZXcgb2YgTWljcm9zY29wZSBhbmQgTW9kZWwgQjwvaDI+PC9kaXY+YCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzdWFsUmVzdWx0XzIudmlldygpLCAnLnJlc3VsdHNfX2V1Z2xlbmFfMicpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYV8yJykuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB2aXNPcHRzID0ge307XG4gICAgICBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnZpc3VhbGl6YXRpb24udmlzdWFsaXphdGlvblR5cGVzJykuZm9yRWFjaCgodmlzQ29uZikgPT4ge1xuICAgICAgICB2aXNPcHRzW3Zpc0NvbmYuaWRdID0gdmlzQ29uZi5sYWJlbDtcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuX3Zpc1NlbGVjdCA9IFNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGlkOiBcInZpc3VhbGl6YXRpb25cIixcbiAgICAgICAgbGFiZWw6ICdWaXN1YWxpemF0aW9uJyxcbiAgICAgICAgb3B0aW9uczogdmlzT3B0c1xuICAgICAgfSk7XG5cbiAgICAgIGlmKE9iamVjdC5rZXlzKHZpc09wdHMpLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3Zpc1NlbGVjdC52aWV3KCksICcucmVzdWx0c19fY29udHJvbHNfX3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgICAgdGhpcy5fdmlzU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLkNoYW5nZScsIHRoaXMuX29uVmlzdWFsaXphdGlvbkNoYW5nZSk7XG4gICAgICAgIHRoaXMuX29uVmlzdWFsaXphdGlvbkNoYW5nZSh7IGN1cnJlbnRUYXJnZXQ6IHRoaXMuX3Zpc1NlbGVjdCB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuaGlkZSgpO1xuICAgICAgfVxuXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V1Z2xlbmFNb2RlbC5kaXJlY3RDb21wYXJpc29uJywgdGhpcy5hY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbik7XG5cbiAgICB9XG5cbiAgICBfb25UaWNrKGV2dCkge1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGdyYXBoLnVwZGF0ZShldnQuZGF0YS50aW1lLCBldnQuZGF0YS5saWdodHMpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMoZXhwLCByZXMsIG1vZGVsQ29tcGFyaXNvbiA9IGZhbHNlKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fY29udHJvbHNfX2V4cGVyaW1lbnQnKS5odG1sKGA8bGFiZWw+RXhwZXJpbWVudDo8L2xhYmVsPjxzcGFuIGNsYXNzPVwiXCI+JHsobmV3IERhdGUoZXhwLmRhdGVfY3JlYXRlZCkpLnRvTG9jYWxlU3RyaW5nKCl9PC9zcGFuPmApXG4gICAgICBpZiAodGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKS5pcygnOnZpc2libGUnKSkge1xuICAgICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgICBncmFwaC5yZXNldCgpO1xuICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbGl2ZScpO1xuICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEobnVsbCwgJ21vZGVsJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTGlnaHREYXRhKGV4cC5jb25maWd1cmF0aW9uKTtcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5wbGF5KHJlcyk7XG5cbiAgICAgIGlmKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmVuYWJsZURpcmVjdENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHRfMi5oYW5kbGVMaWdodERhdGEoZXhwLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHRfMi5wbGF5KHJlcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlTW9kZWxSZXN1bHRzKG1vZGVsLCByZXMsIHRhYklkLCBtb2RlbENvbXBhcmlzb24gPSBmYWxzZSkge1xuXG4gICAgICBpZiAoIW1vZGVsQ29tcGFyaXNvbikge1xuXG4gICAgICAgIGxldCBjb2xvciA9IDA7XG4gICAgICAgIGlmICh0YWJJZCAhPSAnbm9uZScpIHtcbiAgICAgICAgICBjb2xvciA9IEdsb2JhbHMuZ2V0KGBNb2RlbFRhYi4ke3RhYklkfWApLmNvbG9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PSAnc2VxdWVudGlhbCcpIHtcbiAgICAgICAgICAgIGlmICh0YWJJZCA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgZ3JhcGguc2V0TGl2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCAnbW9kZWwnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGdyYXBoLnNldExpdmUoZmFsc2UpO1xuICAgICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ21vZGVsJywgY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ21vZGVsJywgY29sb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKTsgLy8gQWN0aXZhdGUgdGhlIGV1Z2xlbmEgbWluaSBtb2RlbHMgZm9yIHRoZSBjb3JyZXNwb25kaW5nIE1vZGVsXG4gICAgICAgIGlmICh0YWJJZCAhPSB0aGlzLl9tb2RlbFNlbGVjdC52YWx1ZSgpKSB7XG4gICAgICAgICAgdGhpcy5fc2lsZW5jZU1vZGVsU2VsZWN0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9tb2RlbFNlbGVjdC5zZXRWYWx1ZSh0YWJJZCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zaWxlbmNlTW9kZWxTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgeyAvLyBJZiBtb2RlbCBjb21wYXJpc29uIGlzIGFjdGl2YXRlZFxuICAgICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsJ21vZGVsJyk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgbGV0IGNvbG9yID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7dGFiSWR9YCkuY29sb3IoKTtcblxuICAgICAgICBpZiAodGFiSWQgPT0gJ2EnKSB7dGhpcy5fdmlzdWFsUmVzdWx0LmhhbmRsZU1vZGVsRGF0YShyZXMsIG1vZGVsLCBjb2xvcil9XG4gICAgICAgIGVsc2UgaWYgKHRhYklkID09ICdiJykge3RoaXMuX3Zpc3VhbFJlc3VsdF8yLmhhbmRsZU1vZGVsRGF0YShyZXMsIG1vZGVsLCBjb2xvcil9XG5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19jb250cm9sc19fZXhwZXJpbWVudCcpLmh0bWwoYDxsYWJlbD5FeHBlcmltZW50OjwvbGFiZWw+PHNwYW4gY2xhc3M9XCJcIj4oTmV3IEV4cGVyaW1lbnQpPC9zcGFuPmApXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuY2xlYXIoKTtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBncmFwaC5yZXNldCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2hvd1ZpZGVvKGFjdGl2ZVZpZGVvKSB7XG4gICAgICAvL3RoaXMuX3Zpc3VhbFJlc3VsdC5zaG93VmlkZW8oYWN0aXZlVmlkZW8pO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmRpc3BhdGNoRXZlbnQoJ1ZpZGVvUmVzdWx0LlNob3dWaWRlbycsIHtzaG93VmlkZW86IGFjdGl2ZVZpZGVvfSk7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZW5hYmxlRGlyZWN0Q29tcGFyaXNvbicpKSB7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLmRpc3BhdGNoRXZlbnQoJ1ZpZGVvUmVzdWx0LlNob3dWaWRlbycsIHtzaG93VmlkZW86IGFjdGl2ZVZpZGVvfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uVmlzdWFsaXphdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBpZiAoZ3JhcGguaWQoKSA9PSBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpKSB7XG4gICAgICAgICAgZ3JhcGgudmlldygpLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncmFwaC52aWV3KCkuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwidmlzdWFsaXphdGlvbl9jaGFuZ2VcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCkgcmV0dXJuO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdSZXN1bHRzVmlldy5SZXF1ZXN0TW9kZWxEYXRhJywge1xuICAgICAgICB0YWJJZDogZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBhY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbigpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKS5oaWRlKCk7XG4gICAgICAgIHRoaXMuX3Zpc1NlbGVjdC5oaWRlKCk7XG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2V1Z2xlbmEnKS5jaGlsZHJlbignLnJlc3VsdHNfX3RpdGxlJykuaHRtbChcIlZpZXcgb2YgTWljcm9zY29wZSBhbmQgTW9kZWwgQVwiKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2V1Z2xlbmFfMicpLnNob3coKTtcblxuICAgICAgfSBlbHNlIHsgLy8gaGlkZSB0aGUgZGl2IGZvciB2aXN1YWxSZXN1bHRfMlxuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hJykuY2hpbGRyZW4oJy5yZXN1bHRzX190aXRsZScpLmh0bWwoXCJWaWV3IG9mIE1pY3Jvc2NvcGVcIik7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hXzInKS5oaWRlKCk7XG5cbiAgICAgICAgaWYoT2JqZWN0LmtleXModGhpcy5fdmlzU2VsZWN0Ll9tb2RlbC5fZGF0YS5vcHRpb25zKS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLnNob3coKTtcbiAgICAgICAgICB0aGlzLl92aXNTZWxlY3Quc2hvdygpO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUoJ25vbmUnKTtcbiAgICAgIHRoaXMuX3Zpc1NlbGVjdC5zZXRWYWx1ZSh0aGlzLl92aXNTZWxlY3QuZ2V0QWJsZU9wdGlvbnMoKVswXSlcbiAgICB9XG4gIH1cbn0pXG4iXX0=
