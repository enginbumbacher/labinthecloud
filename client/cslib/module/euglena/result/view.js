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
        var _this2 = this;

        var color = 0;
        if (tabId != 'none') {
          color = Globals.get('ModelTab.' + tabId).color();
        }
        this._graphs.forEach(function (graph) {
          graph.handleData(res, 'model', color);
        });
        this._visualResult.handleModelData(res, model, color);
        if (tabId != this._modelSelect.value()) {
          this._silenceModelSelect = true;
          this._modelSelect.setValue(tabId).then(function () {
            _this2._silenceModelSelect = false;
          });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJWaXN1YWxSZXN1bHQiLCJTZWxlY3RGaWVsZCIsInZpc21hcCIsImNpcmNsZSIsImhpc3RvZ3JhbSIsInRpbWVzZXJpZXMiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdmlzdWFsUmVzdWx0IiwiY3JlYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblRpY2siLCJfZ3JhcGhzIiwiZ2V0IiwibWFwIiwidmlzQ29uZiIsInNldHRpbmdzIiwiaWQiLCJhZGRDaGlsZCIsInZpZXciLCJmb3JFYWNoIiwiZ3JhcGgiLCJtb2RlbE9wdHMiLCJ0YWJDb25mIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidG9VcHBlckNhc2UiLCJfbW9kZWxTZWxlY3QiLCJsYWJlbCIsIm9wdGlvbnMiLCJfb25Nb2RlbENoYW5nZSIsInZpc09wdHMiLCJfdmlzU2VsZWN0IiwiX29uVmlzdWFsaXphdGlvbkNoYW5nZSIsImN1cnJlbnRUYXJnZXQiLCJldnQiLCJ1cGRhdGUiLCJkYXRhIiwidGltZSIsImxpZ2h0cyIsImV4cCIsInJlcyIsIiRlbCIsImZpbmQiLCJodG1sIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsInRvTG9jYWxlU3RyaW5nIiwicmVzZXQiLCJoYW5kbGVEYXRhIiwiaGFuZGxlTGlnaHREYXRhIiwiY29uZmlndXJhdGlvbiIsInBsYXkiLCJtb2RlbCIsInRhYklkIiwiY29sb3IiLCJoYW5kbGVNb2RlbERhdGEiLCJ2YWx1ZSIsIl9zaWxlbmNlTW9kZWxTZWxlY3QiLCJzZXRWYWx1ZSIsInRoZW4iLCJjbGVhciIsInNob3ciLCJoaWRlIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwidmlzdWFsaXph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LEdBQWE0QyxJQUFiO0FBQ0QsV0FGRCxNQUVPO0FBQ0wxQyxrQkFBTUYsSUFBTixHQUFhNkMsSUFBYjtBQUNEO0FBQ0YsU0FORDtBQU9BeEUsZ0JBQVFxQixHQUFSLENBQVksUUFBWixFQUFzQm9ELEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxzQkFEa0I7QUFFeEJDLG9CQUFVLFNBRmM7QUFHeEI3QixnQkFBTTtBQUNKOEIsMkJBQWVoQyxJQUFJRCxhQUFKLENBQWtCdUIsS0FBbEI7QUFEWDtBQUhrQixTQUExQjtBQU9EO0FBekdIO0FBQUE7QUFBQSxxQ0EyR2lCdEIsR0EzR2pCLEVBMkdzQjtBQUNsQixZQUFJLEtBQUt1QixtQkFBVCxFQUE4Qjs7QUFFOUIsYUFBS1UsYUFBTCxDQUFtQiw4QkFBbkIsRUFBbUQ7QUFDakRkLGlCQUFPbkIsSUFBSUQsYUFBSixDQUFrQnVCLEtBQWxCO0FBRDBDLFNBQW5EO0FBR0Q7QUFqSEg7QUFBQTtBQUFBLDhCQW1IVTtBQUNOLGFBQUtJLEtBQUw7QUFDQSxhQUFLbEMsWUFBTCxDQUFrQmdDLFFBQWxCLENBQTJCLE1BQTNCO0FBQ0EsYUFBSzNCLFVBQUwsQ0FBZ0IyQixRQUFoQixDQUF5QixLQUFLM0IsVUFBTCxDQUFnQnFDLGNBQWhCLEdBQWlDLENBQWpDLENBQXpCO0FBQ0Q7QUF2SEg7O0FBQUE7QUFBQSxJQUFpQzNFLE9BQWpDO0FBeUhELENBL0lEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vcmVzdWx0cy5odG1sJyksXG4gICAgQ2lyY2xlSGlzdG9ncmFtID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvY2lyY2xlZ3JhcGgvY2lyY2xlZ3JhcGgnKSxcbiAgICBIaXN0b2dyYW0gPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC9oaXN0b2dyYW1ncmFwaCcpLFxuICAgIFRpbWVTZXJpZXMgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdGltZXNlcmllc2dyYXBoJyksXG4gICAgVmlzdWFsUmVzdWx0ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3Zpc3VhbHJlc3VsdCcpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKVxuICA7XG5cbiAgY29uc3QgdmlzbWFwID0ge1xuICAgIGNpcmNsZTogQ2lyY2xlSGlzdG9ncmFtLFxuICAgIGhpc3RvZ3JhbTogSGlzdG9ncmFtLFxuICAgIHRpbWVzZXJpZXM6IFRpbWVTZXJpZXNcbiAgfVxuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgUmVzdWx0c1ZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcih0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVGljaycsICdfb25WaXN1YWxpemF0aW9uQ2hhbmdlJywgJ19vbk1vZGVsQ2hhbmdlJ10pO1xuXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQgPSBWaXN1YWxSZXN1bHQuY3JlYXRlKCk7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlRpY2snLCB0aGlzLl9vblRpY2spO1xuICAgICAgdGhpcy5fZ3JhcGhzID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy52aXN1YWxpemF0aW9uLnZpc3VhbGl6YXRpb25UeXBlcycpLm1hcCgodmlzQ29uZikgPT4ge1xuICAgICAgICB2aXNDb25mLnNldHRpbmdzLmlkID0gdmlzQ29uZi5pZDtcbiAgICAgICAgcmV0dXJuIHZpc21hcFt2aXNDb25mLmlkXS5jcmVhdGUodmlzQ29uZi5zZXR0aW5ncyk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXN1YWxSZXN1bHQudmlldygpLCAnLnJlc3VsdHNfX2V1Z2xlbmEnKTtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICB0aGlzLmFkZENoaWxkKGdyYXBoLnZpZXcoKSwgJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJyk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbW9kZWxPcHRzID0ge1xuICAgICAgICAnbm9uZSc6ICdObyBNb2RlbCdcbiAgICAgIH07XG4gICAgICBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnRhYnMnKS5mb3JFYWNoKCh0YWJDb25mLCBpbmQpID0+IHtcbiAgICAgICAgbGV0IGlkID0gU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGluZClcbiAgICAgICAgbW9kZWxPcHRzW2lkXSA9IGBNb2RlbCAke2lkLnRvVXBwZXJDYXNlKCl9YDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3QgPSBTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogJ21vZGVsJyxcbiAgICAgICAgbGFiZWw6ICdNb2RlbCcsXG4gICAgICAgIG9wdGlvbnM6IG1vZGVsT3B0c1xuICAgICAgfSk7XG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX21vZGVsU2VsZWN0LnZpZXcoKSwgJy5yZXN1bHRzX19jb250cm9sc19fbW9kZWwnKTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpO1xuXG4gICAgICBjb25zdCB2aXNPcHRzID0ge307XG4gICAgICBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnZpc3VhbGl6YXRpb24udmlzdWFsaXphdGlvblR5cGVzJykuZm9yRWFjaCgodmlzQ29uZikgPT4ge1xuICAgICAgICB2aXNPcHRzW3Zpc0NvbmYuaWRdID0gdmlzQ29uZi5sYWJlbDtcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuX3Zpc1NlbGVjdCA9IFNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGlkOiBcInZpc3VhbGl6YXRpb25cIixcbiAgICAgICAgbGFiZWw6ICdWaXN1YWxpemF0aW9uJyxcbiAgICAgICAgb3B0aW9uczogdmlzT3B0c1xuICAgICAgfSk7XG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3Zpc1NlbGVjdC52aWV3KCksICcucmVzdWx0c19fY29udHJvbHNfX3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgIHRoaXMuX3Zpc1NlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vblZpc3VhbGl6YXRpb25DaGFuZ2UpO1xuICAgICAgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKHsgY3VycmVudFRhcmdldDogdGhpcy5fdmlzU2VsZWN0IH0pO1xuICAgICAgXG4gICAgfVxuXG4gICAgX29uVGljayhldnQpIHtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBncmFwaC51cGRhdGUoZXZ0LmRhdGEudGltZSwgZXZ0LmRhdGEubGlnaHRzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV4cCwgcmVzKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fY29udHJvbHNfX2V4cGVyaW1lbnQnKS5odG1sKGA8bGFiZWw+RXhwZXJpbWVudDo8L2xhYmVsPjxzcGFuIGNsYXNzPVwiXCI+JHsobmV3IERhdGUoZXhwLmRhdGVfY3JlYXRlZCkpLnRvTG9jYWxlU3RyaW5nKCl9PC9zcGFuPmApXG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHsgXG4gICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbGl2ZScpO1xuICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsICdtb2RlbCcpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTGlnaHREYXRhKGV4cC5jb25maWd1cmF0aW9uKTtcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5wbGF5KHJlcyk7XG4gICAgfVxuXG4gICAgaGFuZGxlTW9kZWxSZXN1bHRzKG1vZGVsLCByZXMsIHRhYklkKSB7XG4gICAgICBsZXQgY29sb3IgPSAwO1xuICAgICAgaWYgKHRhYklkICE9ICdub25lJykge1xuICAgICAgICBjb2xvciA9IEdsb2JhbHMuZ2V0KGBNb2RlbFRhYi4ke3RhYklkfWApLmNvbG9yKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShyZXMsICdtb2RlbCcsIGNvbG9yKTtcbiAgICAgIH0pXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKTtcbiAgICAgIGlmICh0YWJJZCAhPSB0aGlzLl9tb2RlbFNlbGVjdC52YWx1ZSgpKSB7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCA9IHRydWU7XG4gICAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKHRhYklkKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zaWxlbmNlTW9kZWxTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19jb250cm9sc19fZXhwZXJpbWVudCcpLmh0bWwoYDxsYWJlbD5FeHBlcmltZW50OjwvbGFiZWw+PHNwYW4gY2xhc3M9XCJcIj4oTmV3IEV4cGVyaW1lbnQpPC9zcGFuPmApXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuY2xlYXIoKTtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBncmFwaC5yZXNldCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgX29uVmlzdWFsaXphdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBpZiAoZ3JhcGguaWQoKSA9PSBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpKSB7XG4gICAgICAgICAgZ3JhcGgudmlldygpLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncmFwaC52aWV3KCkuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwidmlzdWFsaXphdGlvbl9jaGFuZ2VcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCkgcmV0dXJuO1xuICAgICAgXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1Jlc3VsdHNWaWV3LlJlcXVlc3RNb2RlbERhdGEnLCB7XG4gICAgICAgIHRhYklkOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUoJ25vbmUnKTtcbiAgICAgIHRoaXMuX3Zpc1NlbGVjdC5zZXRWYWx1ZSh0aGlzLl92aXNTZWxlY3QuZ2V0QWJsZU9wdGlvbnMoKVswXSlcbiAgICB9XG4gIH1cbn0pIl19
