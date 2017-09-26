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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJWaXN1YWxSZXN1bHQiLCJTZWxlY3RGaWVsZCIsInZpc21hcCIsImNpcmNsZSIsImhpc3RvZ3JhbSIsInRpbWVzZXJpZXMiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdmlzdWFsUmVzdWx0IiwiY3JlYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblRpY2siLCJfZ3JhcGhzIiwiZ2V0IiwibWFwIiwidmlzQ29uZiIsInNldHRpbmdzIiwiaWQiLCJhZGRDaGlsZCIsInZpZXciLCJmb3JFYWNoIiwiZ3JhcGgiLCJtb2RlbE9wdHMiLCJsZW5ndGgiLCJ0YWJDb25mIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidG9VcHBlckNhc2UiLCJfbW9kZWxTZWxlY3QiLCJsYWJlbCIsIm9wdGlvbnMiLCJfb25Nb2RlbENoYW5nZSIsIl92aXN1YWxSZXN1bHRfMiIsImhpZGVDb250cm9scyIsIiRlbCIsImZpbmQiLCJhcHBlbmQiLCJoaWRlIiwidmlzT3B0cyIsIl92aXNTZWxlY3QiLCJPYmplY3QiLCJrZXlzIiwiX29uVmlzdWFsaXphdGlvbkNoYW5nZSIsImN1cnJlbnRUYXJnZXQiLCJhY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbiIsImV2dCIsInVwZGF0ZSIsImRhdGEiLCJ0aW1lIiwibGlnaHRzIiwiZXhwIiwicmVzIiwibW9kZWxDb21wYXJpc29uIiwiaHRtbCIsIkRhdGUiLCJkYXRlX2NyZWF0ZWQiLCJ0b0xvY2FsZVN0cmluZyIsImlzIiwicmVzZXQiLCJoYW5kbGVEYXRhIiwiaGFuZGxlTGlnaHREYXRhIiwiY29uZmlndXJhdGlvbiIsInBsYXkiLCJtb2RlbCIsInRhYklkIiwiY29sb3IiLCJzZXRMaXZlIiwiaGFuZGxlTW9kZWxEYXRhIiwidmFsdWUiLCJfc2lsZW5jZU1vZGVsU2VsZWN0Iiwic2V0VmFsdWUiLCJ0aGVuIiwiY2xlYXIiLCJhY3RpdmVWaWRlbyIsImRpc3BhdGNoRXZlbnQiLCJzaG93VmlkZW8iLCJzaG93IiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwidmlzdWFsaXphdGlvbiIsImNoaWxkcmVuIiwiZ2V0QWJsZU9wdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxVQUFVSixRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUssV0FBV0wsUUFBUSxxQkFBUixDQURiO0FBQUEsTUFFRU0sa0JBQWtCTixRQUFRLDJDQUFSLENBRnBCO0FBQUEsTUFHRU8sWUFBWVAsUUFBUSxpREFBUixDQUhkO0FBQUEsTUFJRVEsYUFBYVIsUUFBUSxtREFBUixDQUpmO0FBQUEsTUFLRVMsZUFBZVQsUUFBUSw2Q0FBUixDQUxqQjtBQUFBLE1BTUVVLGNBQWNWLFFBQVEsa0NBQVIsQ0FOaEI7O0FBU0EsTUFBTVcsU0FBUztBQUNiQyxZQUFRTixlQURLO0FBRWJPLGVBQVdOLFNBRkU7QUFHYk8sZ0JBQVlOO0FBSEMsR0FBZjs7QUFNQVIsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLHlCQUFZZSxJQUFaLEVBQWtCO0FBQUE7O0FBQUEsNEhBQ1ZBLFFBQVFWLFFBREU7O0FBRWhCSCxZQUFNYyxXQUFOLFFBQXdCLENBQUMsU0FBRCxFQUFZLHdCQUFaLEVBQXNDLGdCQUF0QyxDQUF4Qjs7QUFFQSxZQUFLQyxhQUFMLEdBQXFCUixhQUFhUyxNQUFiLEVBQXJCO0FBQ0EsWUFBS0QsYUFBTCxDQUFtQkUsZ0JBQW5CLENBQW9DLG1CQUFwQyxFQUF5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R0FBUixDQUFZLHVCQUFaLENBQUosRUFBMEM7QUFDeEMsZUFBS3NCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHlCQUFkLEVBQXlDRSxJQUF6QztBQUNBLGVBQUtFLFVBQUwsQ0FBZ0JGLElBQWhCOztBQUVBLGVBQUtILEdBQUwsQ0FBU0MsSUFBVCxDQUFjLG1CQUFkLEVBQW1DOEMsUUFBbkMsQ0FBNEMsaUJBQTVDLEVBQStENUIsSUFBL0QsQ0FBb0UsZ0NBQXBFO0FBQ0EsZUFBS25CLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHFCQUFkLEVBQXFDeUMsSUFBckM7QUFFRCxTQVBELE1BT087QUFBRTs7QUFFUCxlQUFLMUMsR0FBTCxDQUFTQyxJQUFULENBQWMsbUJBQWQsRUFBbUM4QyxRQUFuQyxDQUE0QyxpQkFBNUMsRUFBK0Q1QixJQUEvRCxDQUFvRSxvQkFBcEU7QUFDQSxlQUFLbkIsR0FBTCxDQUFTQyxJQUFULENBQWMscUJBQWQsRUFBcUNFLElBQXJDOztBQUVBLGVBQUtILEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHlCQUFkLEVBQXlDeUMsSUFBekM7QUFDQSxlQUFLckMsVUFBTCxDQUFnQnFDLElBQWhCO0FBRUQ7QUFFRjtBQTFNSDtBQUFBO0FBQUEsOEJBNE1VO0FBQ04sYUFBS0osS0FBTDtBQUNBLGFBQUs1QyxZQUFMLENBQWtCMEMsUUFBbEIsQ0FBMkIsTUFBM0I7QUFDQSxhQUFLL0IsVUFBTCxDQUFnQitCLFFBQWhCLENBQXlCLEtBQUsvQixVQUFMLENBQWdCMkMsY0FBaEIsR0FBaUMsQ0FBakMsQ0FBekI7QUFDRDtBQWhOSDs7QUFBQTtBQUFBLElBQWlDeEYsT0FBakM7QUFrTkQsQ0F4T0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvcmVzdWx0L3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9yZXN1bHRzLmh0bWwnKSxcbiAgICBDaXJjbGVIaXN0b2dyYW0gPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9jaXJjbGVncmFwaCcpLFxuICAgIEhpc3RvZ3JhbSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2hpc3RvZ3JhbWdyYXBoL2hpc3RvZ3JhbWdyYXBoJyksXG4gICAgVGltZVNlcmllcyA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L3RpbWVzZXJpZXNncmFwaC90aW1lc2VyaWVzZ3JhcGgnKSxcbiAgICBWaXN1YWxSZXN1bHQgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlzdWFscmVzdWx0JyksXG4gICAgU2VsZWN0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZCcpXG4gIDtcblxuICBjb25zdCB2aXNtYXAgPSB7XG4gICAgY2lyY2xlOiBDaXJjbGVIaXN0b2dyYW0sXG4gICAgaGlzdG9ncmFtOiBIaXN0b2dyYW0sXG4gICAgdGltZXNlcmllczogVGltZVNlcmllc1xuICB9XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBSZXN1bHRzVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKHRtcGwpIHtcbiAgICAgIHN1cGVyKHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25UaWNrJywgJ19vblZpc3VhbGl6YXRpb25DaGFuZ2UnLCAnX29uTW9kZWxDaGFuZ2UnXSk7XG5cbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdCA9IFZpc3VhbFJlc3VsdC5jcmVhdGUoKTtcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuVGljaycsIHRoaXMuX29uVGljayk7XG4gICAgICB0aGlzLl9ncmFwaHMgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnZpc3VhbGl6YXRpb24udmlzdWFsaXphdGlvblR5cGVzJykubWFwKCh2aXNDb25mKSA9PiB7XG4gICAgICAgIHZpc0NvbmYuc2V0dGluZ3MuaWQgPSB2aXNDb25mLmlkO1xuICAgICAgICByZXR1cm4gdmlzbWFwW3Zpc0NvbmYuaWRdLmNyZWF0ZSh2aXNDb25mLnNldHRpbmdzKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3Zpc3VhbFJlc3VsdC52aWV3KCksICcucmVzdWx0c19fZXVnbGVuYScpO1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoZ3JhcGgudmlldygpLCAnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbW9kZWxPcHRzID0ge307XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZW5hYmxlRGlyZWN0Q29tcGFyaXNvbicpICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmxlbmd0aCA9PSAyKSB7XG4gICAgICAgIG1vZGVsT3B0cyA9IHtcbiAgICAgICAgICdub25lJzogJ05vIE1vZGVsJyxcbiAgICAgICAgICdib3RoJzogJ0JvdGggTW9kZWxzJ1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW9kZWxPcHRzID0ge1xuICAgICAgICAgJ25vbmUnOiAnTm8gTW9kZWwnXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmZvckVhY2goKHRhYkNvbmYsIGluZCkgPT4ge1xuICAgICAgICBsZXQgaWQgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnRhYnMubGVuZ3RoJyk9PTEgPyAnJyA6IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBpbmQpXG4gICAgICAgIG1vZGVsT3B0c1tpZF0gPSBgTW9kZWwgJHtpZC50b1VwcGVyQ2FzZSgpfWA7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0ID0gU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdtb2RlbCcsXG4gICAgICAgIGxhYmVsOiAnTW9kZWwnLFxuICAgICAgICBvcHRpb25zOiBtb2RlbE9wdHNcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fbW9kZWxTZWxlY3QudmlldygpLCAnLnJlc3VsdHNfX2NvbnRyb2xzX19tb2RlbCcpO1xuICAgICAgICB0aGlzLl9tb2RlbFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmVuYWJsZURpcmVjdENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLl92aXN1YWxSZXN1bHRfMiA9IFZpc3VhbFJlc3VsdC5jcmVhdGUoKTtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuaGlkZUNvbnRyb2xzKCk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxzJykuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicmVzdWx0c19fZXVnbGVuYV8yXCI+XG4gICAgICAgIDxoMiBjbGFzcz1cInJlc3VsdHNfX3RpdGxlXCI+VmlldyBvZiBNaWNyb3Njb3BlIGFuZCBNb2RlbCBCPC9oMj48L2Rpdj5gKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXN1YWxSZXN1bHRfMi52aWV3KCksICcucmVzdWx0c19fZXVnbGVuYV8yJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19ldWdsZW5hXzInKS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZpc09wdHMgPSB7fTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlzdWFsaXphdGlvbi52aXN1YWxpemF0aW9uVHlwZXMnKS5mb3JFYWNoKCh2aXNDb25mKSA9PiB7XG4gICAgICAgIHZpc09wdHNbdmlzQ29uZi5pZF0gPSB2aXNDb25mLmxhYmVsO1xuICAgICAgfSlcblxuICAgICAgdGhpcy5fdmlzU2VsZWN0ID0gU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6IFwidmlzdWFsaXphdGlvblwiLFxuICAgICAgICBsYWJlbDogJ1Zpc3VhbGl6YXRpb24nLFxuICAgICAgICBvcHRpb25zOiB2aXNPcHRzXG4gICAgICB9KTtcblxuICAgICAgaWYoT2JqZWN0LmtleXModmlzT3B0cykubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzU2VsZWN0LnZpZXcoKSwgJy5yZXN1bHRzX19jb250cm9sc19fdmlzdWFsaXphdGlvbicpO1xuICAgICAgICB0aGlzLl92aXNTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKTtcbiAgICAgICAgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKHsgY3VycmVudFRhcmdldDogdGhpcy5fdmlzU2VsZWN0IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX3Zpc3VhbGl6YXRpb24nKS5oaWRlKCk7XG4gICAgICB9XG5cblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXVnbGVuYU1vZGVsLmRpcmVjdENvbXBhcmlzb24nLCB0aGlzLmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKTtcblxuICAgIH1cblxuICAgIF9vblRpY2soZXZ0KSB7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgZ3JhcGgudXBkYXRlKGV2dC5kYXRhLnRpbWUsIGV2dC5kYXRhLmxpZ2h0cyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGVFeHBlcmltZW50UmVzdWx0cyhleHAsIHJlcywgbW9kZWxDb21wYXJpc29uID0gZmFsc2UpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19jb250cm9sc19fZXhwZXJpbWVudCcpLmh0bWwoYDxsYWJlbD5FeHBlcmltZW50OjwvbGFiZWw+PHNwYW4gY2xhc3M9XCJcIj4keyhuZXcgRGF0ZShleHAuZGF0ZV9jcmVhdGVkKSkudG9Mb2NhbGVTdHJpbmcoKX08L3NwYW4+YClcbiAgICAgIGlmICh0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShyZXMsICdsaXZlJyk7XG4gICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCAnbW9kZWwnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5oYW5kbGVMaWdodERhdGEoZXhwLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LnBsYXkocmVzKTtcblxuICAgICAgaWYoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZW5hYmxlRGlyZWN0Q29tcGFyaXNvbicpKSB7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLmhhbmRsZUxpZ2h0RGF0YShleHAuY29uZmlndXJhdGlvbik7XG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdF8yLnBsYXkocmVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVNb2RlbFJlc3VsdHMobW9kZWwsIHJlcywgdGFiSWQsIG1vZGVsQ29tcGFyaXNvbiA9IGZhbHNlKSB7XG5cbiAgICAgIGlmICghbW9kZWxDb21wYXJpc29uKSB7XG5cbiAgICAgICAgbGV0IGNvbG9yID0gMDtcbiAgICAgICAgaWYgKHRhYklkICE9ICdub25lJykge1xuICAgICAgICAgIGNvbG9yID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7dGFiSWR9YCkuY29sb3IoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdzZXF1ZW50aWFsJykge1xuICAgICAgICAgICAgaWYgKHRhYklkID09ICdub25lJykge1xuICAgICAgICAgICAgICBncmFwaC5zZXRMaXZlKHRydWUpO1xuICAgICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsICdtb2RlbCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZ3JhcGguc2V0TGl2ZShmYWxzZSk7XG4gICAgICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbW9kZWwnLCBjb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbW9kZWwnLCBjb2xvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5oYW5kbGVNb2RlbERhdGEocmVzLCBtb2RlbCwgY29sb3IpOyAvLyBBY3RpdmF0ZSB0aGUgZXVnbGVuYSBtaW5pIG1vZGVscyBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgTW9kZWxcbiAgICAgICAgaWYgKHRhYklkICE9IHRoaXMuX21vZGVsU2VsZWN0LnZhbHVlKCkpIHtcbiAgICAgICAgICB0aGlzLl9zaWxlbmNlTW9kZWxTZWxlY3QgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKHRhYklkKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCA9IGZhbHNlO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7IC8vIElmIG1vZGVsIGNvbXBhcmlzb24gaXMgYWN0aXZhdGVkXG4gICAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICAgIGdyYXBoLmhhbmRsZURhdGEobnVsbCwnbW9kZWwnKTtcbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgY29sb3IgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHt0YWJJZH1gKS5jb2xvcigpO1xuXG4gICAgICAgIGlmICh0YWJJZCA9PSAnYScpIHt0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKX1cbiAgICAgICAgZWxzZSBpZiAodGFiSWQgPT0gJ2InKSB7dGhpcy5fdmlzdWFsUmVzdWx0XzIuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKX1cblxuICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2NvbnRyb2xzX19leHBlcmltZW50JykuaHRtbChgPGxhYmVsPkV4cGVyaW1lbnQ6PC9sYWJlbD48c3BhbiBjbGFzcz1cIlwiPihOZXcgRXhwZXJpbWVudCk8L3NwYW4+YClcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5jbGVhcigpO1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzaG93VmlkZW8oYWN0aXZlVmlkZW8pIHtcbiAgICAgIC8vdGhpcy5fdmlzdWFsUmVzdWx0LnNob3dWaWRlbyhhY3RpdmVWaWRlbyk7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuZGlzcGF0Y2hFdmVudCgnVmlkZW9SZXN1bHQuU2hvd1ZpZGVvJywge3Nob3dWaWRlbzogYWN0aXZlVmlkZW99KTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5lbmFibGVEaXJlY3RDb21wYXJpc29uJykpIHtcbiAgICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0XzIuZGlzcGF0Y2hFdmVudCgnVmlkZW9SZXN1bHQuU2hvd1ZpZGVvJywge3Nob3dWaWRlbzogYWN0aXZlVmlkZW99KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25WaXN1YWxpemF0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGlmIChncmFwaC5pZCgpID09IGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKCkpIHtcbiAgICAgICAgICBncmFwaC52aWV3KCkuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyYXBoLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJ2aXN1YWxpemF0aW9uX2NoYW5nZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fc2lsZW5jZU1vZGVsU2VsZWN0KSByZXR1cm47XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1Jlc3VsdHNWaWV3LlJlcXVlc3RNb2RlbERhdGEnLCB7XG4gICAgICAgIHRhYklkOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpLmhpZGUoKTtcbiAgICAgICAgdGhpcy5fdmlzU2VsZWN0LmhpZGUoKTtcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYScpLmNoaWxkcmVuKCcucmVzdWx0c19fdGl0bGUnKS5odG1sKFwiVmlldyBvZiBNaWNyb3Njb3BlIGFuZCBNb2RlbCBBXCIpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYV8yJykuc2hvdygpO1xuXG4gICAgICB9IGVsc2UgeyAvLyBkZWxldGUgdGhlIGRpdiBmb3IgdmlzdWFsUmVzdWx0XzJcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYScpLmNoaWxkcmVuKCcucmVzdWx0c19fdGl0bGUnKS5odG1sKFwiVmlldyBvZiBNaWNyb3Njb3BlXCIpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcucmVzdWx0c19fZXVnbGVuYV8yJykuaGlkZSgpO1xuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX192aXN1YWxpemF0aW9uJykuc2hvdygpO1xuICAgICAgICB0aGlzLl92aXNTZWxlY3Quc2hvdygpO1xuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKCdub25lJyk7XG4gICAgICB0aGlzLl92aXNTZWxlY3Quc2V0VmFsdWUodGhpcy5fdmlzU2VsZWN0LmdldEFibGVPcHRpb25zKClbMF0pXG4gICAgfVxuICB9XG59KVxuIl19
