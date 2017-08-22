'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var DomView = require('core/view/dom_view'),
      Template = require('text!./tab.html'),
      ResultGroupLegend = require('./legend/legend'),
      AvgOrientation = require('euglena/aggregate/graph/orientation_time/graph'),
      AvgVelocity = require('euglena/aggregate/graph/velocity_time/graph'),
      OrientationIntensity = require('euglena/aggregate/graph/orientation_intensity/graph'),
      OrientationDirection = require('euglena/aggregate/graph/orientation_direction/graph'),
      SelectField = require('core/component/selectfield/field');

  require('link!./style.css');

  return function (_DomView) {
    _inherits(AggregateTabView, _DomView);

    function AggregateTabView(model, tmpl) {
      _classCallCheck(this, AggregateTabView);

      var _this = _possibleConstructorReturn(this, (AggregateTabView.__proto__ || Object.getPrototypeOf(AggregateTabView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onDataSetAdded', '_onDataSetRemoved', '_onDataSetsCleared', '_onTabClick', '_onModelChange', '_onResultGroupRemoved', '_onGraphSelectionChange', '_onResultToggle', '_onGraphDisableRequest', '_onGraphEnableRequest']);
      _this._legends = {};
      _this._graphs = {
        orientation_time: AvgOrientation.create({}),
        velocity_time: AvgVelocity.create({}),
        orientation_intensity: OrientationIntensity.create({}),
        orientation_direction: OrientationDirection.create({})
      };

      Object.values(_this._graphs).forEach(function (graph) {
        _this.addChild(graph.view(), ".aggregate__graphs");
        graph.addEventListener('AggregateGraph.DisableRequest', _this._onGraphDisableRequest);
        graph.addEventListener('AggregateGraph.EnableRequest', _this._onGraphEnableRequest);
      });

      var selectOpts = {};
      for (var key in _this._graphs) {
        selectOpts[key] = _this._graphs[key].label();
      }
      _this._graphSelect = SelectField.create({
        label: 'Visualization',
        id: 'visualization',
        options: selectOpts,
        value: 'orientation_time'
      });

      _this.addChild(_this._graphSelect.view(), '.aggregate__legend__visualization');
      _this._graphSelect.addEventListener('Field.Change', _this._onGraphSelectionChange);
      _this._onGraphSelectionChange();

      model.addEventListener('Model.Change', _this._onModelChange);
      model.addEventListener('AggregateData.DataSetAdded', _this._onDataSetAdded);
      model.addEventListener('AggregateData.DataSetRemoved', _this._onDataSetRemoved);
      model.addEventListener('AggregateData.DataSetsCleared', _this._onDataSetsCleared);
      model.addEventListener('AggregateData.ResultGroupRemoved', _this._onResultGroupRemoved);
      model.addEventListener('AggregateData.ResultToggle', _this._onResultToggle);

      _this.$el.find('.aggregate__tab').click(_this._onTabClick);
      return _this;
    }

    _createClass(AggregateTabView, [{
      key: 'updateGraphs',
      value: function updateGraphs(model) {
        Object.values(this._graphs).forEach(function (graph) {
          graph.update(model.get('datasets'));
          Object.values(model.get('datasets')).forEach(function (ds) {
            ds.get('results').forEach(function (res) {
              graph.toggleResult(res.get('id'), res.get('shown'));
            });
          });
        });
      }
    }, {
      key: '_onGraphSelectionChange',
      value: function _onGraphSelectionChange(evt) {
        for (var key in this._graphs) {
          if (key == this._graphSelect.value()) {
            this._graphs[key].view().show();
          } else {
            this._graphs[key].view().hide();
          }
        }
        this.dispatchEvent('AggregateTab.GraphSelectionChange', {});
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == "open") {
          this.$el.toggleClass('aggregate__open', evt.data.value);
        }
      }
    }, {
      key: '_onDataSetAdded',
      value: function _onDataSetAdded(evt) {
        this.$el.find('.aggregate__legend__empty').hide();
        var ds = evt.data.dataset;
        var expId = evt.data.resultGroup.get('experimentId');
        if (!this._legends[expId]) {
          this._legends[expId] = new ResultGroupLegend(evt.currentTarget.get('datasets.' + expId));
          this.addChild(this._legends[expId], '.aggregate__legend__results');
        }
        this.updateGraphs(evt.currentTarget);
      }
    }, {
      key: '_onDataSetRemoved',
      value: function _onDataSetRemoved(evt) {
        if (Object.values(evt.currentTarget.get('datasets')).length == 0) {
          this.$el.find('.aggregate__legend__empty').show();
        }
        this.updateGraphs(evt.currentTarget);
      }
    }, {
      key: '_onDataSetsCleared',
      value: function _onDataSetsCleared(evt) {
        this.$el.find('.aggregate__legend__empty').show();
        this.updateGraphs(evt.currentTarget);
      }
    }, {
      key: '_onTabClick',
      value: function _onTabClick(jqevt) {
        this.dispatchEvent('AggregateTab.ToggleRequest', {}, true);
      }
    }, {
      key: '_onResultGroupRemoved',
      value: function _onResultGroupRemoved(evt) {
        var expId = evt.data.group.get('experimentId');
        this.removeChild(this._legends[expId]);
        delete this._legends[expId];
        this._onDataSetRemoved(evt);
      }
    }, {
      key: '_onResultToggle',
      value: function _onResultToggle(evt) {
        Object.values(this._graphs).forEach(function (graph) {
          graph.toggleResult(evt.data.resultId, evt.data.shown);
        });
      }
    }, {
      key: '_onGraphEnableRequest',
      value: function _onGraphEnableRequest(evt) {
        this._graphSelect.enableOption(evt.data.id);
      }
    }, {
      key: '_onGraphDisableRequest',
      value: function _onGraphDisableRequest(evt) {
        this._graphSelect.disableOption(evt.data.id);
        this._graphSelect.selectFirstAble();
      }
    }, {
      key: 'getCurrentVisualization',
      value: function getCurrentVisualization() {
        return this._graphs[this._graphSelect.value()].label();
      }
    }]);

    return AggregateTabView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJSZXN1bHRHcm91cExlZ2VuZCIsIkF2Z09yaWVudGF0aW9uIiwiQXZnVmVsb2NpdHkiLCJPcmllbnRhdGlvbkludGVuc2l0eSIsIk9yaWVudGF0aW9uRGlyZWN0aW9uIiwiU2VsZWN0RmllbGQiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9sZWdlbmRzIiwiX2dyYXBocyIsIm9yaWVudGF0aW9uX3RpbWUiLCJjcmVhdGUiLCJ2ZWxvY2l0eV90aW1lIiwib3JpZW50YXRpb25faW50ZW5zaXR5Iiwib3JpZW50YXRpb25fZGlyZWN0aW9uIiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsImdyYXBoIiwiYWRkQ2hpbGQiLCJ2aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkdyYXBoRGlzYWJsZVJlcXVlc3QiLCJfb25HcmFwaEVuYWJsZVJlcXVlc3QiLCJzZWxlY3RPcHRzIiwia2V5IiwibGFiZWwiLCJfZ3JhcGhTZWxlY3QiLCJpZCIsIm9wdGlvbnMiLCJ2YWx1ZSIsIl9vbkdyYXBoU2VsZWN0aW9uQ2hhbmdlIiwiX29uTW9kZWxDaGFuZ2UiLCJfb25EYXRhU2V0QWRkZWQiLCJfb25EYXRhU2V0UmVtb3ZlZCIsIl9vbkRhdGFTZXRzQ2xlYXJlZCIsIl9vblJlc3VsdEdyb3VwUmVtb3ZlZCIsIl9vblJlc3VsdFRvZ2dsZSIsIiRlbCIsImZpbmQiLCJjbGljayIsIl9vblRhYkNsaWNrIiwidXBkYXRlIiwiZ2V0IiwiZHMiLCJyZXMiLCJ0b2dnbGVSZXN1bHQiLCJldnQiLCJzaG93IiwiaGlkZSIsImRpc3BhdGNoRXZlbnQiLCJkYXRhIiwicGF0aCIsInRvZ2dsZUNsYXNzIiwiZGF0YXNldCIsImV4cElkIiwicmVzdWx0R3JvdXAiLCJjdXJyZW50VGFyZ2V0IiwidXBkYXRlR3JhcGhzIiwibGVuZ3RoIiwianFldnQiLCJncm91cCIsInJlbW92ZUNoaWxkIiwicmVzdWx0SWQiLCJzaG93biIsImVuYWJsZU9wdGlvbiIsImRpc2FibGVPcHRpb24iLCJzZWxlY3RGaXJzdEFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLGlCQUFSLENBRGI7QUFBQSxNQUVFTSxvQkFBb0JOLFFBQVEsaUJBQVIsQ0FGdEI7QUFBQSxNQUlFTyxpQkFBaUJQLFFBQVEsZ0RBQVIsQ0FKbkI7QUFBQSxNQUtFUSxjQUFjUixRQUFRLDZDQUFSLENBTGhCO0FBQUEsTUFNRVMsdUJBQXVCVCxRQUFRLHFEQUFSLENBTnpCO0FBQUEsTUFPRVUsdUJBQXVCVixRQUFRLHFEQUFSLENBUHpCO0FBQUEsTUFRRVcsY0FBY1gsUUFBUSxrQ0FBUixDQVJoQjs7QUFXQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDhCQUFZWSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLHNJQUNqQkEsUUFBUVIsUUFEUzs7QUFFdkJKLFlBQU1hLFdBQU4sUUFBd0IsQ0FDdEIsaUJBRHNCLEVBQ0gsbUJBREcsRUFDa0Isb0JBRGxCLEVBQ3dDLGFBRHhDLEVBRXRCLGdCQUZzQixFQUVKLHVCQUZJLEVBRXFCLHlCQUZyQixFQUVnRCxpQkFGaEQsRUFHdEIsd0JBSHNCLEVBR0ksdUJBSEosQ0FBeEI7QUFJQSxZQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsWUFBS0MsT0FBTCxHQUFlO0FBQ2JDLDBCQUFrQlYsZUFBZVcsTUFBZixDQUFzQixFQUF0QixDQURM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QWpELElBQTJELENBQS9ELEVBQWtFO0FBQ2hFLGVBQUtyQixHQUFMLENBQVNDLElBQVQsQ0FBYywyQkFBZCxFQUEyQ1MsSUFBM0M7QUFDRDtBQUNELGFBQUtVLFlBQUwsQ0FBa0JYLElBQUlVLGFBQXRCO0FBQ0Q7QUExRkg7QUFBQTtBQUFBLHlDQTRGcUJWLEdBNUZyQixFQTRGMEI7QUFDdEIsYUFBS1QsR0FBTCxDQUFTQyxJQUFULENBQWMsMkJBQWQsRUFBMkNTLElBQTNDO0FBQ0EsYUFBS1UsWUFBTCxDQUFrQlgsSUFBSVUsYUFBdEI7QUFDRDtBQS9GSDtBQUFBO0FBQUEsa0NBaUdjRyxLQWpHZCxFQWlHcUI7QUFDakIsYUFBS1YsYUFBTCxDQUFtQiw0QkFBbkIsRUFBaUQsRUFBakQsRUFBcUQsSUFBckQ7QUFDRDtBQW5HSDtBQUFBO0FBQUEsNENBcUd3QkgsR0FyR3hCLEVBcUc2QjtBQUN6QixZQUFNUSxRQUFRUixJQUFJSSxJQUFKLENBQVNVLEtBQVQsQ0FBZWxCLEdBQWYsQ0FBbUIsY0FBbkIsQ0FBZDtBQUNBLGFBQUttQixXQUFMLENBQWlCLEtBQUt0RCxRQUFMLENBQWMrQyxLQUFkLENBQWpCO0FBQ0EsZUFBTyxLQUFLL0MsUUFBTCxDQUFjK0MsS0FBZCxDQUFQO0FBQ0EsYUFBS3JCLGlCQUFMLENBQXVCYSxHQUF2QjtBQUNEO0FBMUdIO0FBQUE7QUFBQSxzQ0E0R2tCQSxHQTVHbEIsRUE0R3VCO0FBQ25CaEMsZUFBT0MsTUFBUCxDQUFjLEtBQUtQLE9BQW5CLEVBQTRCUSxPQUE1QixDQUFvQyxVQUFDQyxLQUFELEVBQVc7QUFDN0NBLGdCQUFNNEIsWUFBTixDQUFtQkMsSUFBSUksSUFBSixDQUFTWSxRQUE1QixFQUFzQ2hCLElBQUlJLElBQUosQ0FBU2EsS0FBL0M7QUFDRCxTQUZEO0FBR0Q7QUFoSEg7QUFBQTtBQUFBLDRDQWtId0JqQixHQWxIeEIsRUFrSDZCO0FBQ3pCLGFBQUtwQixZQUFMLENBQWtCc0MsWUFBbEIsQ0FBK0JsQixJQUFJSSxJQUFKLENBQVN2QixFQUF4QztBQUNEO0FBcEhIO0FBQUE7QUFBQSw2Q0FzSHlCbUIsR0F0SHpCLEVBc0g4QjtBQUMxQixhQUFLcEIsWUFBTCxDQUFrQnVDLGFBQWxCLENBQWdDbkIsSUFBSUksSUFBSixDQUFTdkIsRUFBekM7QUFDQSxhQUFLRCxZQUFMLENBQWtCd0MsZUFBbEI7QUFDRDtBQXpISDtBQUFBO0FBQUEsZ0RBMkg0QjtBQUN4QixlQUFPLEtBQUsxRCxPQUFMLENBQWEsS0FBS2tCLFlBQUwsQ0FBa0JHLEtBQWxCLEVBQWIsRUFBd0NKLEtBQXhDLEVBQVA7QUFDRDtBQTdISDs7QUFBQTtBQUFBLElBQXNDN0IsT0FBdEM7QUErSEQsQ0FqSkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL3RhYi92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
