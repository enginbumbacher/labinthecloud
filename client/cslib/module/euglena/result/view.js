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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJWaXN1YWxSZXN1bHQiLCJTZWxlY3RGaWVsZCIsInZpc21hcCIsImNpcmNsZSIsImhpc3RvZ3JhbSIsInRpbWVzZXJpZXMiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdmlzdWFsUmVzdWx0IiwiY3JlYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblRpY2siLCJfZ3JhcGhzIiwiZ2V0IiwibWFwIiwidmlzQ29uZiIsInNldHRpbmdzIiwiaWQiLCJhZGRDaGlsZCIsInZpZXciLCJmb3JFYWNoIiwiZ3JhcGgiLCJtb2RlbE9wdHMiLCJsZW5ndGgiLCJ0YWJDb25mIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidG9VcHBlckNhc2UiLCJfbW9kZWxTZWxlY3QiLCJsYWJlbCIsIm9wdGlvbnMiLCJpbml0aWFsVmFsdWUiLCJzZXRWYWx1ZSIsIl9vbk1vZGVsQ2hhbmdlIiwiX3Zpc3VhbFJlc3VsdF8yIiwiaGlkZUNvbnRyb2xzIiwiJGVsIiwiZmluZCIsImFwcGVuZCIsImhpZGUiLCJ2aXNPcHRzIiwiX3Zpc1NlbGVjdCIsIk9iamVjdCIsImtleXMiLCJfb25WaXN1YWxpemF0aW9uQ2hhbmdlIiwiY3VycmVudFRhcmdldCIsImNsaWNrIiwiX21vdmVUYWJzIiwiYWN0aXZhdGVNb2RlbENvbXBhcmlzb24iLCJoYXNDbGFzcyIsImhpZGVUYWIiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiZGlzcGF0Y2hFdmVudCIsImV2dCIsInVwZGF0ZSIsImRhdGEiLCJ0aW1lIiwibGlnaHRzIiwiZXhwIiwicmVzIiwibW9kZWxDb21wYXJpc29uIiwiaHRtbCIsIkRhdGUiLCJkYXRlX2NyZWF0ZWQiLCJ0b0xvY2FsZVN0cmluZyIsImlzIiwicmVzZXQiLCJoYW5kbGVEYXRhIiwiaGFuZGxlTGlnaHREYXRhIiwiY29uZmlndXJhdGlvbiIsInBsYXkiLCJtb2RlbCIsInRhYklkIiwiY29sb3IiLCJzZXRMaXZlIiwiaGFuZGxlTW9kZWxEYXRhIiwidmFsdWUiLCJfc2lsZW5jZU1vZGVsU2VsZWN0IiwidGhlbiIsImNsZWFyIiwiYWN0aXZlVmlkZW8iLCJzaG93VmlkZW8iLCJzaG93IiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwidmlzdWFsaXphdGlvbiIsImNoaWxkcmVuIiwiX21vZGVsIiwiX2RhdGEiLCJnZXRBYmxlT3B0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHFCQUFSLENBRGI7QUFBQSxNQUVFTSxrQkFBa0JOLFFBQVEsMkNBQVIsQ0FGcEI7QUFBQSxNQUdFTyxZQUFZUCxRQUFRLGlEQUFSLENBSGQ7QUFBQSxNQUlFUSxhQUFhUixRQUFRLG1EQUFSLENBSmY7QUFBQSxNQUtFUyxlQUFlVCxRQUFRLDZDQUFSLENBTGpCO0FBQUEsTUFNRVUsY0FBY1YsUUFBUSxrQ0FBUixDQU5oQjs7QUFTQSxNQUFNVyxTQUFTO0FBQ2JDLFlBQVFOLGVBREs7QUFFYk8sZUFBV04sU0FGRTtBQUdiTyxnQkFBWU47QUFIQyxHQUFmOztBQU1BUixVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UseUJBQVllLElBQVosRUFBa0I7QUFBQTs7QUFBQSw0SEFDVkEsUUFBUVYsUUFERTs7QUFFaEJILFlBQU1jLFdBQU4sUUFBd0IsQ0FBQyxTQUFELEVBQVksd0JBQVosRUFBc0MsZ0JB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QUF5Q0UsSUFBekM7QUFDQSxlQUFLRSxVQUFMLENBQWdCRixJQUFoQjs7QUFFQSxlQUFLSCxHQUFMLENBQVNDLElBQVQsQ0FBYyxtQkFBZCxFQUFtQ21ELFFBQW5DLENBQTRDLGlCQUE1QyxFQUErRDFCLElBQS9ELENBQW9FLGdDQUFwRTtBQUNBLGVBQUsxQixHQUFMLENBQVNDLElBQVQsQ0FBYyxxQkFBZCxFQUFxQzhDLElBQXJDO0FBRUQsU0FQRCxNQU9PO0FBQUU7O0FBRVAsZUFBSy9DLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLG1CQUFkLEVBQW1DbUQsUUFBbkMsQ0FBNEMsaUJBQTVDLEVBQStEMUIsSUFBL0QsQ0FBb0Usb0JBQXBFO0FBQ0EsZUFBSzFCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHFCQUFkLEVBQXFDRSxJQUFyQzs7QUFFQSxjQUFHRyxPQUFPQyxJQUFQLENBQVksS0FBS0YsVUFBTCxDQUFnQmdELE1BQWhCLENBQXVCQyxLQUF2QixDQUE2QjVELE9BQXpDLEVBQWtEUixNQUFyRCxFQUE2RDtBQUMzRCxpQkFBS2MsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUM4QyxJQUF6QztBQUNBLGlCQUFLMUMsVUFBTCxDQUFnQjBDLElBQWhCO0FBQ0Q7QUFFRjtBQUVGO0FBaE9IO0FBQUE7QUFBQSw4QkFrT1U7QUFDTixhQUFLSCxLQUFMO0FBQ0EsYUFBS3BELFlBQUwsQ0FBa0JJLFFBQWxCLENBQTJCLE1BQTNCO0FBQ0EsYUFBS1MsVUFBTCxDQUFnQlQsUUFBaEIsQ0FBeUIsS0FBS1MsVUFBTCxDQUFnQmtELGNBQWhCLEdBQWlDLENBQWpDLENBQXpCO0FBQ0Q7QUF0T0g7O0FBQUE7QUFBQSxJQUFpQ2pHLE9BQWpDO0FBd09ELENBOVBEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vcmVzdWx0cy5odG1sJyksXG4gICAgQ2lyY2xlSGlzdG9ncmFtID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvY2lyY2xlZ3JhcGgvY2lyY2xlZ3JhcGgnKSxcbiAgICBIaXN0b2dyYW0gPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC9oaXN0b2dyYW1ncmFwaCcpLFxuICAgIFRpbWVTZXJpZXMgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdGltZXNlcmllc2dyYXBoJyksXG4gICAgVmlzdWFsUmVzdWx0ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3Zpc3VhbHJlc3VsdCcpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKVxuICA7XG5cbiAgY29uc3QgdmlzbWFwID0ge1xuICAgIGNpcmNsZTogQ2lyY2xlSGlzdG9ncmFtLFxuICAgIGhpc3RvZ3JhbTogSGlzdG9ncmFtLFxuICAgIHRpbWVzZXJpZXM6IFRpbWVTZXJpZXNcbiAgfVxuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgUmVzdWx0c1ZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcih0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVGljaycsICdfb25WaXN1YWxpemF0aW9uQ2hhbmdlJywgJ19vbk1vZGVsQ2hhbmdlJywgJ2FjdGl2YXRlTW9kZWxDb21wYXJpc29uJywgJ19tb3ZlVGFicyddKTtcblxuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0ID0gVmlzdWFsUmVzdWx0LmNyZWF0ZSgpO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmFkZEV2ZW50TGlzdGVuZXIoJ1Zpc3VhbFJlc3VsdC5UaWNrJywgdGhpcy5fb25UaWNrKTtcbiAgICAgIHRoaXMuX2dyYXBocyA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlzdWFsaXphdGlvbi52aXN1YWxpemF0aW9uVHlwZXMnKS5tYXAoKHZpc0NvbmYpID0+IHtcbiAgICAgICAgdmlzQ29uZi5zZXR0aW5ncy5pZCA9IHZpc0NvbmYuaWQ7XG4gICAgICAgIHJldHVybiB2aXNtYXBbdmlzQ29uZi5pZF0uY3JlYXRlKHZpc0NvbmYuc2V0dGluZ3MpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzdWFsUmVzdWx0LnZpZXcoKSwgJy5yZXN1bHRzX19ldWdsZW5hJyk7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChncmFwaC52aWV3KCksICcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBtb2RlbE9wdHMgPSB7fTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykgJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykubGVuZ3RoID09IDIpIHtcbiAgICAgICAgbW9kZWxPcHRzID0ge1xuICAgICAgICAgJ25vbmUnOiAnTm8gTW9kZWwnLFxuICAgICAgICAgJ2JvdGgnOiAnQm90aCBNb2RlbHMnXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtb2RlbE9wdHMgPSB7XG4gICAgICAgICAnbm9uZSc6ICdObyBNb2RlbCdcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykuZm9yRWFjaCgodGFiQ29uZiwgaW5kKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicy5sZW5ndGgnKT09MSA/ICcnIDogU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGluZClcbiAgICAgICAgbW9kZWxPcHRzW2lkXSA9IGBNb2RlbCAke2lkLnRvVXBwZXJDYXNlKCl9YDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3QgPSBTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogJ21vZGVsJyxcbiAgICAgICAgbGFiZWw6ICdNb2RlbCcsXG4gICAgICAgIG9wdGlvbnM6IG1vZGVsT3B0cyxcbiAgICAgICAgaW5pdGlhbFZhbHVlOiAnbm9uZSdcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUoJ25vbmUnKVxuXG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fbW9kZWxTZWxlY3QudmlldygpLCAnLnJlc3VsdHNfX2NvbnRyb2xzX19tb2RlbCcpO1xuICAgICAgICB0aGlzLl9tb2RlbFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmVuYWJsZURpcmVjdENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHRfMiA9IFZpc3VhbFJlc3VsdC5jcmVhdGUoKTtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuaGlkZUNvbnRyb2xzKCk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxzJykuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicmVzdWx0c19fZXVnbGVuYV8yXCI+XG4gICAgICAgIDxoMiBjbGFzcz1cInJlc3VsdHNfX3RpdGxlXCI+VmlldyBvZiBNaWNyb3Njb3BlIGFuZCBNb2RlbCBCPC9oMj48L2Rpdj5gKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXN1YWxSZXN1bHRfMi52aWV3KCksICcucmVzdWx0c19fZXVnbGVuYV8yJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hXzInKS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZpc09wdHMgPSB7fTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlzdWFsaXphdGlvbi52aXN1YWxpemF0aW9uVHlwZXMnKS5mb3JFYWNoKCh2aXNDb25mKSA9PiB7XG4gICAgICAgIHZpc09wdHNbdmlzQ29uZi5pZF0gPSB2aXNDb25mLmxhYmVsO1xuICAgICAgfSlcblxuICAgICAgdGhpcy5fdmlzU2VsZWN0ID0gU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6IFwidmlzdWFsaXphdGlvblwiLFxuICAgICAgICBsYWJlbDogJ1Zpc3VhbGl6YXRpb24nLFxuICAgICAgICBvcHRpb25zOiB2aXNPcHRzXG4gICAgICB9KTtcblxuICAgICAgaWYoT2JqZWN0LmtleXModmlzT3B0cykubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzU2VsZWN0LnZpZXcoKSwgJy5yZXN1bHRzX19jb250cm9sc19fdmlzdWFsaXphdGlvbicpO1xuICAgICAgICB0aGlzLl92aXNTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKTtcbiAgICAgICAgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKHsgY3VycmVudFRhcmdldDogdGhpcy5fdmlzU2VsZWN0IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLmNsaWNrKHRoaXMuX21vdmVUYWJzKTtcblxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuZGlyZWN0Q29tcGFyaXNvbicsIHRoaXMuYWN0aXZhdGVNb2RlbENvbXBhcmlzb24pO1xuXG4gICAgfVxuXG4gICAgX21vdmVUYWJzKCkge1xuICAgICAgaWYgKHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLmhhc0NsYXNzKCdub3RmbGlwcGVkWCcpKSB7XG4gICAgICAgIHZhciBoaWRlVGFiID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI21vdmVUYWJzJykucmVtb3ZlQ2xhc3MoJ25vdGZsaXBwZWRYJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLmFkZENsYXNzKCdmbGlwcGVkWCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGhpZGVUYWIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI21vdmVUYWJzJykucmVtb3ZlQ2xhc3MoJ2ZsaXBwZWRYJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNtb3ZlVGFicycpLmFkZENsYXNzKCdub3RmbGlwcGVkWCcpO1xuICAgICAgfVxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdJbnRlcmFjdGl2ZVRhYnMuVG9nZ2xlJyx7aGlkZVRhYjogaGlkZVRhYn0pO1xuXG4gICAgfVxuXG4gICAgX29uVGljayhldnQpIHtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBncmFwaC51cGRhdGUoZXZ0LmRhdGEudGltZSwgZXZ0LmRhdGEubGlnaHRzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV4cCwgcmVzLCBtb2RlbENvbXBhcmlzb24gPSBmYWxzZSkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2NvbnRyb2xzX19leHBlcmltZW50JykuaHRtbChgPGxhYmVsPkV4cGVyaW1lbnQ6PC9sYWJlbD48c3BhbiBjbGFzcz1cIlwiPiR7KG5ldyBEYXRlKGV4cC5kYXRlX2NyZWF0ZWQpKS50b0xvY2FsZVN0cmluZygpfTwvc3Bhbj5gKVxuICAgICAgaWYgKHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgICAgZ3JhcGgucmVzZXQoKTtcbiAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ2xpdmUnKTtcbiAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsICdtb2RlbCcpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmhhbmRsZUxpZ2h0RGF0YShleHAuY29uZmlndXJhdGlvbik7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQucGxheShyZXMpO1xuXG4gICAgICBpZihHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuaGFuZGxlTGlnaHREYXRhKGV4cC5jb25maWd1cmF0aW9uKTtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIucGxheShyZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZU1vZGVsUmVzdWx0cyhtb2RlbCwgcmVzLCB0YWJJZCwgbW9kZWxDb21wYXJpc29uID0gZmFsc2UpIHtcblxuICAgICAgaWYgKCFtb2RlbENvbXBhcmlzb24pIHtcblxuICAgICAgICBsZXQgY29sb3IgPSAwO1xuICAgICAgICBpZiAodGFiSWQgIT0gJ25vbmUnKSB7XG4gICAgICAgICAgY29sb3IgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHt0YWJJZH1gKS5jb2xvcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT0gJ3NlcXVlbnRpYWwnKSB7XG4gICAgICAgICAgICBpZiAodGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgIGdyYXBoLnNldExpdmUodHJ1ZSk7XG4gICAgICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEobnVsbCwgJ21vZGVsJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBncmFwaC5zZXRMaXZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShyZXMsICdtb2RlbCcsIGNvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShyZXMsICdtb2RlbCcsIGNvbG9yKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmhhbmRsZU1vZGVsRGF0YShyZXMsIG1vZGVsLCBjb2xvcik7IC8vIEFjdGl2YXRlIHRoZSBldWdsZW5hIG1pbmkgbW9kZWxzIGZvciB0aGUgY29ycmVzcG9uZGluZyBNb2RlbFxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuUmVzZXRSZXF1ZXN0Jyx7fSk7XG4gICAgICAgIGlmICh0YWJJZCAhPSB0aGlzLl9tb2RlbFNlbGVjdC52YWx1ZSgpKSB7XG4gICAgICAgICAgdGhpcy5fc2lsZW5jZU1vZGVsU2VsZWN0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9tb2RlbFNlbGVjdC5zZXRWYWx1ZSh0YWJJZCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zaWxlbmNlTW9kZWxTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgeyAvLyBJZiBtb2RlbCBjb21wYXJpc29uIGlzIGFjdGl2YXRlZFxuICAgICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsJ21vZGVsJyk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgbGV0IGNvbG9yID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7dGFiSWR9YCkuY29sb3IoKTtcblxuICAgICAgICBpZiAodGFiSWQgPT0gJ2EnKSB7dGhpcy5fdmlzdWFsUmVzdWx0LmhhbmRsZU1vZGVsRGF0YShyZXMsIG1vZGVsLCBjb2xvcil9XG4gICAgICAgIGVsc2UgaWYgKHRhYklkID09ICdiJykge3RoaXMuX3Zpc3VhbFJlc3VsdF8yLmhhbmRsZU1vZGVsRGF0YShyZXMsIG1vZGVsLCBjb2xvcil9XG5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19jb250cm9sc19fZXhwZXJpbWVudCcpLmh0bWwoYDxsYWJlbD5FeHBlcmltZW50OjwvbGFiZWw+PHNwYW4gY2xhc3M9XCJcIj4oTmV3IEV4cGVyaW1lbnQpPC9zcGFuPmApXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuY2xlYXIoKTtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBncmFwaC5yZXNldCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2hvd1ZpZGVvKGFjdGl2ZVZpZGVvKSB7XG4gICAgICAvL3RoaXMuX3Zpc3VhbFJlc3VsdC5zaG93VmlkZW8oYWN0aXZlVmlkZW8pO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmRpc3BhdGNoRXZlbnQoJ1ZpZGVvUmVzdWx0LlNob3dWaWRlbycsIHtzaG93VmlkZW86IGFjdGl2ZVZpZGVvfSk7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZW5hYmxlRGlyZWN0Q29tcGFyaXNvbicpKSB7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLmRpc3BhdGNoRXZlbnQoJ1ZpZGVvUmVzdWx0LlNob3dWaWRlbycsIHtzaG93VmlkZW86IGFjdGl2ZVZpZGVvfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uVmlzdWFsaXphdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBpZiAoZ3JhcGguaWQoKSA9PSBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpKSB7XG4gICAgICAgICAgZ3JhcGgudmlldygpLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncmFwaC52aWV3KCkuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwidmlzdWFsaXphdGlvbl9jaGFuZ2VcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCkgcmV0dXJuO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdSZXN1bHRzVmlldy5SZXF1ZXN0TW9kZWxEYXRhJywge1xuICAgICAgICB0YWJJZDogZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBhY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbigpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKS5oaWRlKCk7XG4gICAgICAgIHRoaXMuX3Zpc1NlbGVjdC5oaWRlKCk7XG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2V1Z2xlbmEnKS5jaGlsZHJlbignLnJlc3VsdHNfX3RpdGxlJykuaHRtbChcIlZpZXcgb2YgTWljcm9zY29wZSBhbmQgTW9kZWwgQVwiKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2V1Z2xlbmFfMicpLnNob3coKTtcblxuICAgICAgfSBlbHNlIHsgLy8gaGlkZSB0aGUgZGl2IGZvciB2aXN1YWxSZXN1bHRfMlxuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hJykuY2hpbGRyZW4oJy5yZXN1bHRzX190aXRsZScpLmh0bWwoXCJWaWV3IG9mIE1pY3Jvc2NvcGVcIik7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hXzInKS5oaWRlKCk7XG5cbiAgICAgICAgaWYoT2JqZWN0LmtleXModGhpcy5fdmlzU2VsZWN0Ll9tb2RlbC5fZGF0YS5vcHRpb25zKS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLnNob3coKTtcbiAgICAgICAgICB0aGlzLl92aXNTZWxlY3Quc2hvdygpO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUoJ25vbmUnKTtcbiAgICAgIHRoaXMuX3Zpc1NlbGVjdC5zZXRWYWx1ZSh0aGlzLl92aXNTZWxlY3QuZ2V0QWJsZU9wdGlvbnMoKVswXSlcbiAgICB9XG4gIH1cbn0pXG4iXX0=
