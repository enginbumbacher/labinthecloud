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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkNpcmNsZUhpc3RvZ3JhbSIsIkhpc3RvZ3JhbSIsIlRpbWVTZXJpZXMiLCJWaXN1YWxSZXN1bHQiLCJTZWxlY3RGaWVsZCIsInZpc21hcCIsImNpcmNsZSIsImhpc3RvZ3JhbSIsInRpbWVzZXJpZXMiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdmlzdWFsUmVzdWx0IiwiY3JlYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblRpY2siLCJfZ3JhcGhzIiwiZ2V0IiwibWFwIiwidmlzQ29uZiIsInNldHRpbmdzIiwiaWQiLCJhZGRDaGlsZCIsInZpZXciLCJmb3JFYWNoIiwiZ3JhcGgiLCJtb2RlbE9wdHMiLCJ0YWJDb25mIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidG9VcHBlckNhc2UiLCJfbW9kZWxTZWxlY3QiLCJsYWJlbCIsIm9wdGlvbnMiLCJfb25Nb2RlbENoYW5nZSIsInZpc09wdHMiLCJfdmlzU2VsZWN0IiwiX29uVmlzdWFsaXphdGlvbkNoYW5nZSIsImN1cnJlbnRUYXJnZXQiLCJldnQiLCJ1cGRhdGUiLCJkYXRhIiwidGltZSIsImxpZ2h0cyIsImV4cCIsInJlcyIsIiRlbCIsImZpbmQiLCJodG1sIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsInRvTG9jYWxlU3RyaW5nIiwicmVzZXQiLCJoYW5kbGVEYXRhIiwiaGFuZGxlTGlnaHREYXRhIiwiY29uZmlndXJhdGlvbiIsInBsYXkiLCJtb2RlbCIsInRhYklkIiwiY29sb3IiLCJzZXRMaXZlIiwiaGFuZGxlTW9kZWxEYXRhIiwidmFsdWUiLCJfc2lsZW5jZU1vZGVsU2VsZWN0Iiwic2V0VmFsdWUiLCJ0aGVuIiwiY2xlYXIiLCJhY3RpdmVWaWRlbyIsImRpc3BhdGNoRXZlbnQiLCJzaG93VmlkZW8iLCJzaG93IiwiaGlkZSIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsInZpc3VhbGl6YXRpb24iLCJnZXRBYmxlT3B0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHFCQUFSLENBRGI7QUFBQSxNQUVFTSxrQkFBa0JOLFFBQVEsMkNBQVIsQ0FGcEI7QUFBQSxNQUdFTyxZQUFZUCxRQUFRLGlEQUFSLENBSGQ7QUFBQSxNQUlFUSxhQUFhUixRQUFRLG1EQUFSLENBSmY7QUFBQSxNQUtFUyxlQUFlVCxRQUFRLDZDQUFSLENBTGpCO0FBQUEsTUFNRVUsY0FBY1YsUUFBUSxrQ0FBUixDQU5oQjs7QUFTQSxNQUFNVyxTQUFTO0FBQ2JDLFlBQVFOLGVBREs7QUFFYk8sZUFBV04sU0FGRTtBQUdiTyxnQkFBWU47QUFIQyxHQUFmOztBQU1BUixVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UseUJBQVllLElBQVosRUFBa0I7QUFBQTs7QUFBQSw0SEFDVkEsUUFBUVYsUUFERTs7QUFFaEJILFlBQU1jLFdBQU4sUUFBd0IsQ0FBQyxTQUFELEVBQVksd0JBQVosRUFBc0MsZ0JBQXRDLENBQXhCOztBQUVBLFlBQUtDLGFBQUwsR0FBcUJSLGFBQWFTLE1BQWIsRUFBckI7QUFDQSxZQUFLRCxhQUFMLENBQW1CRSxnQkFBbkIsQ0FBb0MsbUJBQXBDLEVBQXlELE1BQUtDLE9BQTlEO0FBQ0EsWUFBS0MsT0FBTCxHQUFlcEIsUUFBUXFCLEdBQVIsQ0FBWSw0Q0FBWixFQUEwREMsR0FBMUQsQ0FBOEQsVUFBQ0MsT0FBRCxFQUFhO0FBQ3hGQSxnQkFBUUMsUUFBUixDQUFpQkMsRUFBakIs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QUwsQ0FBa0JpQyxRQUFsQixDQUEyQixNQUEzQjtBQUNBLGFBQUs1QixVQUFMLENBQWdCNEIsUUFBaEIsQ0FBeUIsS0FBSzVCLFVBQUwsQ0FBZ0J3QyxjQUFoQixHQUFpQyxDQUFqQyxDQUF6QjtBQUNEO0FBdElIOztBQUFBO0FBQUEsSUFBaUM5RSxPQUFqQztBQXdJRCxDQTlKRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9yZXN1bHQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3Jlc3VsdHMuaHRtbCcpLFxuICAgIENpcmNsZUhpc3RvZ3JhbSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoJyksXG4gICAgSGlzdG9ncmFtID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvaGlzdG9ncmFtZ3JhcGgvaGlzdG9ncmFtZ3JhcGgnKSxcbiAgICBUaW1lU2VyaWVzID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvdGltZXNlcmllc2dyYXBoL3RpbWVzZXJpZXNncmFwaCcpLFxuICAgIFZpc3VhbFJlc3VsdCA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L3Zpc3VhbHJlc3VsdC92aXN1YWxyZXN1bHQnKSxcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJylcbiAgO1xuXG4gIGNvbnN0IHZpc21hcCA9IHtcbiAgICBjaXJjbGU6IENpcmNsZUhpc3RvZ3JhbSxcbiAgICBoaXN0b2dyYW06IEhpc3RvZ3JhbSxcbiAgICB0aW1lc2VyaWVzOiBUaW1lU2VyaWVzXG4gIH1cblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFJlc3VsdHNWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IodG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblRpY2snLCAnX29uVmlzdWFsaXphdGlvbkNoYW5nZScsICdfb25Nb2RlbENoYW5nZSddKTtcblxuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0ID0gVmlzdWFsUmVzdWx0LmNyZWF0ZSgpO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmFkZEV2ZW50TGlzdGVuZXIoJ1Zpc3VhbFJlc3VsdC5UaWNrJywgdGhpcy5fb25UaWNrKTtcbiAgICAgIHRoaXMuX2dyYXBocyA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlzdWFsaXphdGlvbi52aXN1YWxpemF0aW9uVHlwZXMnKS5tYXAoKHZpc0NvbmYpID0+IHtcbiAgICAgICAgdmlzQ29uZi5zZXR0aW5ncy5pZCA9IHZpc0NvbmYuaWQ7XG4gICAgICAgIHJldHVybiB2aXNtYXBbdmlzQ29uZi5pZF0uY3JlYXRlKHZpc0NvbmYuc2V0dGluZ3MpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmlzdWFsUmVzdWx0LnZpZXcoKSwgJy5yZXN1bHRzX19ldWdsZW5hJyk7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChncmFwaC52aWV3KCksICcucmVzdWx0c19fdmlzdWFsaXphdGlvbicpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1vZGVsT3B0cyA9IHtcbiAgICAgICAgJ25vbmUnOiAnTm8gTW9kZWwnXG4gICAgICB9O1xuICAgICAgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykuZm9yRWFjaCgodGFiQ29uZiwgaW5kKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBpbmQpXG4gICAgICAgIG1vZGVsT3B0c1tpZF0gPSBgTW9kZWwgJHtpZC50b1VwcGVyQ2FzZSgpfWA7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0ID0gU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdtb2RlbCcsXG4gICAgICAgIGxhYmVsOiAnTW9kZWwnLFxuICAgICAgICBvcHRpb25zOiBtb2RlbE9wdHNcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tb2RlbFNlbGVjdC52aWV3KCksICcucmVzdWx0c19fY29udHJvbHNfX21vZGVsJyk7XG4gICAgICB0aGlzLl9tb2RlbFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcblxuICAgICAgY29uc3QgdmlzT3B0cyA9IHt9O1xuICAgICAgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy52aXN1YWxpemF0aW9uLnZpc3VhbGl6YXRpb25UeXBlcycpLmZvckVhY2goKHZpc0NvbmYpID0+IHtcbiAgICAgICAgdmlzT3B0c1t2aXNDb25mLmlkXSA9IHZpc0NvbmYubGFiZWw7XG4gICAgICB9KVxuXG4gICAgICB0aGlzLl92aXNTZWxlY3QgPSBTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogXCJ2aXN1YWxpemF0aW9uXCIsXG4gICAgICAgIGxhYmVsOiAnVmlzdWFsaXphdGlvbicsXG4gICAgICAgIG9wdGlvbnM6IHZpc09wdHNcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92aXNTZWxlY3QudmlldygpLCAnLnJlc3VsdHNfX2NvbnRyb2xzX192aXN1YWxpemF0aW9uJyk7XG4gICAgICB0aGlzLl92aXNTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25WaXN1YWxpemF0aW9uQ2hhbmdlKTtcbiAgICAgIHRoaXMuX29uVmlzdWFsaXphdGlvbkNoYW5nZSh7IGN1cnJlbnRUYXJnZXQ6IHRoaXMuX3Zpc1NlbGVjdCB9KTtcblxuICAgIH1cblxuICAgIF9vblRpY2soZXZ0KSB7XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgZ3JhcGgudXBkYXRlKGV2dC5kYXRhLnRpbWUsIGV2dC5kYXRhLmxpZ2h0cyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGVFeHBlcmltZW50UmVzdWx0cyhleHAsIHJlcykge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnJlc3VsdHNfX2NvbnRyb2xzX19leHBlcmltZW50JykuaHRtbChgPGxhYmVsPkV4cGVyaW1lbnQ6PC9sYWJlbD48c3BhbiBjbGFzcz1cIlwiPiR7KG5ldyBEYXRlKGV4cC5kYXRlX2NyZWF0ZWQpKS50b0xvY2FsZVN0cmluZygpfTwvc3Bhbj5gKVxuICAgICAgdGhpcy5fZ3JhcGhzLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGdyYXBoLnJlc2V0KCk7XG4gICAgICAgIGdyYXBoLmhhbmRsZURhdGEocmVzLCAnbGl2ZScpO1xuICAgICAgICBncmFwaC5oYW5kbGVEYXRhKG51bGwsICdtb2RlbCcpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTGlnaHREYXRhKGV4cC5jb25maWd1cmF0aW9uKTtcbiAgICAgIHRoaXMuX3Zpc3VhbFJlc3VsdC5wbGF5KHJlcyk7XG4gICAgfVxuXG4gICAgaGFuZGxlTW9kZWxSZXN1bHRzKG1vZGVsLCByZXMsIHRhYklkKSB7XG4gICAgICBsZXQgY29sb3IgPSAwO1xuICAgICAgaWYgKHRhYklkICE9ICdub25lJykge1xuICAgICAgICBjb2xvciA9IEdsb2JhbHMuZ2V0KGBNb2RlbFRhYi4ke3RhYklkfWApLmNvbG9yKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9ncmFwaHMuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PSAnc2VxdWVudGlhbCcpIHtcbiAgICAgICAgICBpZiAodGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgICAgICBncmFwaC5zZXRMaXZlKHRydWUpO1xuICAgICAgICAgICAgZ3JhcGguaGFuZGxlRGF0YShudWxsLCAnbW9kZWwnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ3JhcGguc2V0TGl2ZShmYWxzZSk7XG4gICAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ21vZGVsJywgY29sb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncmFwaC5oYW5kbGVEYXRhKHJlcywgJ21vZGVsJywgY29sb3IpO1xuICAgICAgICB9XG5cbiAgICAgIH0pXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuaGFuZGxlTW9kZWxEYXRhKHJlcywgbW9kZWwsIGNvbG9yKTtcbiAgICAgIGlmICh0YWJJZCAhPSB0aGlzLl9tb2RlbFNlbGVjdC52YWx1ZSgpKSB7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCA9IHRydWU7XG4gICAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKHRhYklkKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zaWxlbmNlTW9kZWxTZWxlY3QgPSBmYWxzZTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZXN1bHRzX19jb250cm9sc19fZXhwZXJpbWVudCcpLmh0bWwoYDxsYWJlbD5FeHBlcmltZW50OjwvbGFiZWw+PHNwYW4gY2xhc3M9XCJcIj4oTmV3IEV4cGVyaW1lbnQpPC9zcGFuPmApXG4gICAgICB0aGlzLl92aXN1YWxSZXN1bHQuY2xlYXIoKTtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBncmFwaC5yZXNldCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2hvd1ZpZGVvKGFjdGl2ZVZpZGVvKSB7XG4gICAgICAvL3RoaXMuX3Zpc3VhbFJlc3VsdC5zaG93VmlkZW8oYWN0aXZlVmlkZW8pO1xuICAgICAgdGhpcy5fdmlzdWFsUmVzdWx0LmRpc3BhdGNoRXZlbnQoJ1ZpZGVvUmVzdWx0LlNob3dWaWRlbycsIHtzaG93VmlkZW86IGFjdGl2ZVZpZGVvfSk7XG4gICAgfVxuXG4gICAgX29uVmlzdWFsaXphdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2dyYXBocy5mb3JFYWNoKChncmFwaCkgPT4ge1xuICAgICAgICBpZiAoZ3JhcGguaWQoKSA9PSBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpKSB7XG4gICAgICAgICAgZ3JhcGgudmlldygpLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncmFwaC52aWV3KCkuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwidmlzdWFsaXphdGlvbl9jaGFuZ2VcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKHRoaXMuX3NpbGVuY2VNb2RlbFNlbGVjdCkgcmV0dXJuO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdSZXN1bHRzVmlldy5SZXF1ZXN0TW9kZWxEYXRhJywge1xuICAgICAgICB0YWJJZDogZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIHRoaXMuX21vZGVsU2VsZWN0LnNldFZhbHVlKCdub25lJyk7XG4gICAgICB0aGlzLl92aXNTZWxlY3Quc2V0VmFsdWUodGhpcy5fdmlzU2VsZWN0LmdldEFibGVPcHRpb25zKClbMF0pXG4gICAgfVxuICB9XG59KVxuIl19
