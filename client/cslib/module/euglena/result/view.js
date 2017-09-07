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
        'none': 'No Model',
        'both': 'Both Models'
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

        if (!modelComparison) {
          this.$el.find('.results__controls__experiment').html('<label>Experiment:</label><span class="">' + new Date(exp.date_created).toLocaleString() + '</span>');
          this._graphs.forEach(function (graph) {
            graph.reset();
            graph.handleData(res, 'live');
            graph.handleData(null, 'model');
          });
          this._visualResult.handleLightData(exp.configuration);
          this._visualResult.play(res);
        } else {
          this._visualResult_2.handleLightData(exp.configuration);
          this._visualResult_2.play(res);
        }
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
      key: 'showVideo',
      value: function showVideo(activeVideo) {
        //this._visualResult.showVideo(activeVideo);
        this._visualResult.dispatchEvent('VideoResult.ShowVideo', { showVideo: activeVideo });
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

          this.$el.find('.results__visuals').append('<div class="results__euglena_2">\n        <h2 class="results__title">View of Microscope and Model B</h2></div>');

          this.$el.find('.results__euglena').children('.results__title').html("View of Microscope and Model A");

          this._visualResult_2 = VisualResult.create();
          this._visualResult_2.hideControls();
          this.addChild(this._visualResult_2.view(), '.results__euglena_2');
        } else {
          var elements = document.getElementsByClassName("results__euglena_2");
          while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
          }
          this._visualResult_2 = null;

          this.$el.find('.results__euglena').children('.results__title').html("View of Microscope");

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJWaXN1YWxSZXN1bHQiLCJTZWxlY3RGaWVsZCIsInZpc21hcCIsImNpcmNsZSIsImhpc3RvZ3JhbSIsInRpbWVzZXJpZXMiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdmlzdWFsUmVzdWx0IiwiY3JlYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblRpY2siLCJfZ3JhcGhzIiwiZ2V0IiwibWFwIiwidmlzQ29uZiIsInNldHRpbmdzIiwiaWQiLCJhZGRDaGlsZCIsInZpZXciLCJmb3JFYWNoIiwiZ3JhcGgiLCJtb2RlbE9wdHMiLCJ0YWJDb25mIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidG9VcHBlckNhc2UiLCJfbW9kZWxTZWxlY3QiLCJsYWJlbCIsIm9wdGlvbnMiLCJfb25Nb2RlbENoYW5nZSIsInZpc09wdHMiLCJfdmlzU2VsZWN0IiwiX29uVmlzdWFsaXphdGlvbkNoYW5nZSIsImN1cnJlbnRUYXJnZXQiLCJhY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbiIsImV2dCIsInVwZGF0ZSIsImRhdGEiLCJ0aW1lIiwibGlnaHRzIiwiZXhwIiwicmVzIiwibW9kZWxDb21wYXJpc29uIiwiJGVsIiwiZmluZCIsImh0bWwiLCJEYXRlIiwiZGF0ZV9jcmVhdGVkIiwidG9Mb2NhbGVTdHJpbmciLCJyZXNldCIsImhhbmRsZURhdGEiLCJoYW5kbGVMaWdodERhdGEiLCJjb25maWd1cmF0aW9uIiwicGxheSIsIl92aXN1YWxSZXN1bHRfMiIsIm1vZGVsIiwidGFiSWQiLCJjb2xvciIsInNldExpdmUiLCJoYW5kbGVNb2RlbERhdGEiLCJ2YWx1ZSIsIl9zaWxlbmNlTW9kZWxTZWxlY3QiLCJzZXRWYWx1ZSIsInRoZW4iLCJjbGVhciIsImFjdGl2ZVZpZGVvIiwiZGlzcGF0Y2hFdmVudCIsInNob3dWaWRlbyIsInNob3ciLCJoaWRlIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwidmlzdWFsaXphdGlvbiIsImFwcGVuZCIsImNoaWxkcmVuIiwiaGlkZUNvbnRyb2xzIiwiZWxlbWVudHMiLCJkb2N1bWVudCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJsZW5ndGgiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJnZXRBYmxlT3B0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHFCQUFSLENBRGI7QUFBQSxNQUVFTSxrQkFBa0JOLFFBQVEsMkNBQVIsQ0FGcEI7QUFBQSxNQUdFTyxZQUFZUCxRQUFRLGlEQUFSLENBSGQ7QUFBQSxNQUlFUSxhQUFhUixRQUFRLG1EQUFSLENBSmY7QUFBQSxNQUtFUyxlQUFlVCxRQUFRLDZDQUFSLENBTGpCO0FBQUEsTUFNRVUsY0FBY1YsUUFBUSxrQ0FBUixDQU5oQjs7QUFTQSxNQUFNVyxTQUFTO0FBQ2JDLFlBQVFOLGVBREs7QUFFYk8sZUFBV04sU0FGRTtBQUdiTyxnQkFBWU47QUFIQyxHQUFmOztBQU1BUixVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UseUJBQVllLElBQVosRUFBa0I7QUFBQTs7QUFBQSw0SEFDVkEsUUFBUVYsUUFERTs7QUFFaEJILFlBQU1jLFdBQU4sUUFBd0IsQ0FBQyxTQUFELEVBQVksd0JBQVosRUFBc0MsZ0JBQXRDLENBQXhCOztBQUVBLFlBQUtDLGFBQUwsR0FBcUJSLGFBQWFTLE1BQWIs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Q0EsaUJBQU1GLFNBQVNHLE1BQVQsR0FBa0IsQ0FBeEIsRUFBMEI7QUFDdEJILHFCQUFTLENBQVQsRUFBWUksVUFBWixDQUF1QkMsV0FBdkIsQ0FBbUNMLFNBQVMsQ0FBVCxDQUFuQztBQUNIO0FBQ0QsZUFBS3ZCLGVBQUwsR0FBdUIsSUFBdkI7O0FBRUEsZUFBS1gsR0FBTCxDQUFTQyxJQUFULENBQWMsbUJBQWQsRUFBbUMrQixRQUFuQyxDQUE0QyxpQkFBNUMsRUFBK0Q5QixJQUEvRCxDQUFvRSxvQkFBcEU7O0FBRUEsZUFBS0YsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUN3QixJQUF6QztBQUNBLGVBQUtyQyxVQUFMLENBQWdCcUMsSUFBaEI7QUFDRDtBQUVGO0FBcktIO0FBQUE7QUFBQSw4QkF1S1U7QUFDTixhQUFLSixLQUFMO0FBQ0EsYUFBS3RDLFlBQUwsQ0FBa0JvQyxRQUFsQixDQUEyQixNQUEzQjtBQUNBLGFBQUsvQixVQUFMLENBQWdCK0IsUUFBaEIsQ0FBeUIsS0FBSy9CLFVBQUwsQ0FBZ0JvRCxjQUFoQixHQUFpQyxDQUFqQyxDQUF6QjtBQUNEO0FBM0tIOztBQUFBO0FBQUEsSUFBaUMxRixPQUFqQztBQTZLRCxDQW5NRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9yZXN1bHQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3Jlc3VsdHMuaHRtbCcpLFxuICAgIENpcmNsZUhpc3RvZ3JhbSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoJyksXG4gICAgSGlzdG9ncmFtID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvaGlzdG9ncmFtZ3JhcGgvaGlzdG9ncmFtZ3JhcGgnKSxcbiAgICBUaW1lU2VyaWVzID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvdGltZXNlcmllc2dyYXBoL3RpbWVzZXJpZXNncmFwaCcpLFxuICAgIFZpc3VhbFJlc3VsdCA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L3Zpc3VhbHJlc3VsdC92aXN1YWxyZXN1bHQnKSxcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJylcbiAgO1xuXG4gIGNvbnN0IHZpc21hcCA9IHtcbiAgICBjaXJjbGU6IENpcmNsZUhpc3RvZ3JhbSxcbiAgICBoaXN0b2dyYW06IEhpc3RvZ3JhbSxcbiAgICB0aW1lc2VyaWVzOiBUaW1lU2VyaWVzXG4gIH1cblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFJlc3VsdHNWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IodG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblRpY2snLCAnX29uVmlzdWFsaXphdGlvbkNoYW5nZScsICdfb25Nb2RlbENoYW5nZSddKTtcblxuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0ID0gVmlzdWFsUmVzdWx0LmNyZWF0ZSgpO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmFkZEV2ZW50TGlzdGVuZXIoJ1Zpc3VhbFJlc3VsdC5UaWNrJywgdGhpcy5fb25UaWNrKTtcbiAgICAgIHRoaXMuX2dyYXBocyA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlzdWFsaXphdGlvbi52aXN1YWxpemF0aW9uVHlwZXMnKS5tYXAoKHZpc0NvbmYpID0+IHtcbiAgICAgICAgdmlzQ29uZi5zZXR0aW5ncy5pZCA9IHZpc0NvbmYuaWQ7XG4gICAgICAgIHJldHVybiB2aXNtYXBbdmlzQ29uZi5pZF0uY3JlYXRlKHZpc0NvbmYuc2V0dGluZ3MpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzdWFsUmVzdWx0LnZpZXcoKSwgJy5yZXN1bHRzX19ldWdsZW5hJyk7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChncmFwaC52aWV3KCksICcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1vZGVsT3B0cyA9IHtcbiAgICAgICAgJ25vbmUnOiAnTm8gTW9kZWwnLFxuICAgICAgICAnYm90aCc6ICdCb3RoIE1vZGVscydcbiAgICAgIH07XG4gICAgICBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnRhYnMnKS5mb3JFYWNoKCh0YWJDb25mLCBpbmQpID0+IHtcbiAgICAgICAgbGV0IGlkID0gU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGluZClcbiAgICAgICAgbW9kZWxPcHRzW2lkXSA9IGBNb2RlbCAke2lkLnRvVXBwZXJDYXNlKCl9YDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbW9kZWxTZWxlY3QgPSBTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogJ21vZGVsJyxcbiAgICAgICAgbGFiZWw6ICdNb2RlbCcsXG4gICAgICAgIG9wdGlvbnM6IG1vZGVsT3B0c1xuICAgICAgfSk7XG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX21vZGVsU2VsZWN0LnZpZXcoKSwgJy5yZXN1bHRzX19jb250cm9sc19fbW9kZWwnKTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpO1xuXG4gICAgICBjb25zdCB2aXNPcHRzID0ge307XG4gICAgICBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnZpc3VhbGl6YXRpb24udmlzdWFsaXphdGlvblR5cGVzJykuZm9yRWFjaCgodmlzQ29uZikgPT4ge1xuICAgICAgICB2aXNPcHRzW3Zpc0NvbmYuaWRdID0gdmlzQ29uZi5sYWJlbDtcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuX3Zpc1NlbGVjdCA9IFNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGlkOiBcInZpc3VhbGl6YXRpb25cIixcbiAgICAgICAgbGFiZWw6ICdWaXN1YWxpemF0aW9uJyxcbiAgICAgICAgb3B0aW9uczogdmlzT3B0c1xuICAgICAgfSk7XG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3Zpc1NlbGVjdC52aWV3KCksICcucmVzdWx0c19fY29udHJvbHNfX3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgIHRoaXMuX3Zpc1NlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vblZpc3VhbGl6YXRpb25DaGFuZ2UpO1xuICAgICAgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKHsgY3VycmVudFRhcmdldDogdGhpcy5fdmlzU2VsZWN0IH0pO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuZGlyZWN0Q29tcGFyaXNvbicsIHRoaXMuYWN0aXZhdGVNb2RlbENvbXBhcmlzb24pO1xuXG4gICAgfVxuXG4gICAgX29uVGljayhldnQpIHtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBncmFwaC51cGRhdGUoZXZ0LmRhdGEudGltZSwgZXZ0LmRhdGEubGlnaHRzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV4cCwgcmVzLCBtb2RlbENvbXBhcmlzb24gPSBmYWxzZSkge1xuICAgICAgaWYgKCFtb2RlbENvbXBhcmlzb24pIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2NvbnRyb2xzX19leHBlcmltZW50JykuaHRtbChgPGxhYmVsPkV4cGVyaW1lbnQ6PC9sYWJlbD48c3BhbiBjbGFzcz1cIlwiPiR7KG5ldyBEYXRlKGV4cC5kYXRlX2NyZWF0ZWQpKS50b0xvY2FsZVN0cmluZygpfTwvc3Bhbj5gKVxuICAgICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgICBncmFwaC5yZXNldCgpO1xuICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbGl2ZScpO1xuICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEobnVsbCwgJ21vZGVsJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTGlnaHREYXRhKGV4cC5jb25maWd1cmF0aW9uKTtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LnBsYXkocmVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLmhhbmRsZUxpZ2h0RGF0YShleHAuY29uZmlndXJhdGlvbik7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLnBsYXkocmVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVNb2RlbFJlc3VsdHMobW9kZWwsIHJlcywgdGFiSWQpIHtcbiAgICAgIGxldCBjb2xvciA9IDA7XG4gICAgICBpZiAodGFiSWQgIT0gJ25vbmUnKSB7XG4gICAgICAgIGNvbG9yID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7dGFiSWR9YCkuY29sb3IoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdzZXF1ZW50aWFsJykge1xuICAgICAgICAgIGlmICh0YWJJZCA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgIGdyYXBoLnNldExpdmUodHJ1ZSk7XG4gICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsICdtb2RlbCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncmFwaC5zZXRMaXZlKGZhbHNlKTtcbiAgICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbW9kZWwnLCBjb2xvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbW9kZWwnLCBjb2xvcik7XG4gICAgICAgIH1cblxuICAgICAgfSlcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5oYW5kbGVNb2RlbERhdGEocmVzLCBtb2RlbCwgY29sb3IpO1xuICAgICAgaWYgKHRhYklkICE9IHRoaXMuX21vZGVsU2VsZWN0LnZhbHVlKCkpIHtcbiAgICAgICAgdGhpcy5fc2lsZW5jZU1vZGVsU2VsZWN0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbW9kZWxTZWxlY3Quc2V0VmFsdWUodGFiSWQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCA9IGZhbHNlO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2NvbnRyb2xzX19leHBlcmltZW50JykuaHRtbChgPGxhYmVsPkV4cGVyaW1lbnQ6PC9sYWJlbD48c3BhbiBjbGFzcz1cIlwiPihOZXcgRXhwZXJpbWVudCk8L3NwYW4+YClcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5jbGVhcigpO1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzaG93VmlkZW8oYWN0aXZlVmlkZW8pIHtcbiAgICAgIC8vdGhpcy5fdmlzdWFsUmVzdWx0LnNob3dWaWRlbyhhY3RpdmVWaWRlbyk7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuZGlzcGF0Y2hFdmVudCgnVmlkZW9SZXN1bHQuU2hvd1ZpZGVvJywge3Nob3dWaWRlbzogYWN0aXZlVmlkZW99KTtcbiAgICB9XG5cbiAgICBfb25WaXN1YWxpemF0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGlmIChncmFwaC5pZCgpID09IGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKCkpIHtcbiAgICAgICAgICBncmFwaC52aWV3KCkuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyYXBoLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJ2aXN1YWxpemF0aW9uX2NoYW5nZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fc2lsZW5jZU1vZGVsU2VsZWN0KSByZXR1cm47XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1Jlc3VsdHNWaWV3LlJlcXVlc3RNb2RlbERhdGEnLCB7XG4gICAgICAgIHRhYklkOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLmhpZGUoKTtcbiAgICAgICAgdGhpcy5fdmlzU2VsZWN0LmhpZGUoKTtcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFscycpLmFwcGVuZChgPGRpdiBjbGFzcz1cInJlc3VsdHNfX2V1Z2xlbmFfMlwiPlxuICAgICAgICA8aDIgY2xhc3M9XCJyZXN1bHRzX190aXRsZVwiPlZpZXcgb2YgTWljcm9zY29wZSBhbmQgTW9kZWwgQjwvaDI+PC9kaXY+YCk7XG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2V1Z2xlbmEnKS5jaGlsZHJlbignLnJlc3VsdHNfX3RpdGxlJykuaHRtbChcIlZpZXcgb2YgTWljcm9zY29wZSBhbmQgTW9kZWwgQVwiKTtcblxuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHRfMiA9IFZpc3VhbFJlc3VsdC5jcmVhdGUoKTtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuaGlkZUNvbnRyb2xzKCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzdWFsUmVzdWx0XzIudmlldygpLCAnLnJlc3VsdHNfX2V1Z2xlbmFfMicpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicmVzdWx0c19fZXVnbGVuYV8yXCIpO1xuICAgICAgICB3aGlsZShlbGVtZW50cy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIGVsZW1lbnRzWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudHNbMF0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yID0gbnVsbDtcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYScpLmNoaWxkcmVuKCcucmVzdWx0c19fdGl0bGUnKS5odG1sKFwiVmlldyBvZiBNaWNyb3Njb3BlXCIpO1xuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuc2hvdygpO1xuICAgICAgICB0aGlzLl92aXNTZWxlY3Quc2hvdygpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICB0aGlzLl9tb2RlbFNlbGVjdC5zZXRWYWx1ZSgnbm9uZScpO1xuICAgICAgdGhpcy5fdmlzU2VsZWN0LnNldFZhbHVlKHRoaXMuX3Zpc1NlbGVjdC5nZXRBYmxlT3B0aW9ucygpWzBdKVxuICAgIH1cbiAgfVxufSlcbiJdfQ==
