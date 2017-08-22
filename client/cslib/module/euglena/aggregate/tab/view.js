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
      _this.disableFields();
      return _this;
    }

    _createClass(AggregateTabView, [{
      key: 'updateGraphs',
      value: function updateGraphs(model) {
        Object.values(this._graphs).forEach(function (graph) {
          graph.update(model.get('datasets'));
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
          this.updateFieldStatus(evt.currentTarget);
        }
      }
    }, {
      key: 'updateFieldStatus',
      value: function updateFieldStatus(model) {
        if (model.get('open')) {
          this.enableFields();
        } else {
          this.disableFields();
        }
      }
    }, {
      key: 'enableFields',
      value: function enableFields() {
        this._graphSelect.enable();
        this.$el.find('input, button').removeProp('disabled');
      }
    }, {
      key: 'disableFields',
      value: function disableFields() {
        this._graphSelect.disable();
        this.$el.find('input, button').prop('disabled', true);
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
        this.updateFieldStatus(evt.currentTarget);
      }
    }, {
      key: '_onDataSetRemoved',
      value: function _onDataSetRemoved(evt) {
        if (Object.values(evt.currentTarget.get('datasets')).length == 0) {
          this.$el.find('.aggregate__legend__empty').show();
        }
        this.updateGraphs(evt.currentTarget);
        this.updateFieldStatus(evt.currentTarget);
      }
    }, {
      key: '_onDataSetsCleared',
      value: function _onDataSetsCleared(evt) {
        this.$el.find('.aggregate__legend__empty').show();
        this.updateGraphs(evt.currentTarget);
        this.updateFieldStatus(evt.currentTarget);
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
        this.updateFieldStatus(evt.currentTarget);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJSZXN1bHRHcm91cExlZ2VuZCIsIkF2Z09yaWVudGF0aW9uIiwiQXZnVmVsb2NpdHkiLCJPcmllbnRhdGlvbkludGVuc2l0eSIsIk9yaWVudGF0aW9uRGlyZWN0aW9uIiwiU2VsZWN0RmllbGQiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9sZWdlbmRzIiwiX2dyYXBocyIsIm9yaWVudGF0aW9uX3RpbWUiLCJjcmVhdGUiLCJ2ZWxvY2l0eV90aW1lIiwib3JpZW50YXRpb25faW50ZW5zaXR5Iiwib3JpZW50YXRpb25fZGlyZWN0aW9uIiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsImdyYXBoIiwiYWRkQ2hpbGQiLCJ2aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkdyYXBoRGlzYWJsZVJlcXVlc3QiLCJfb25HcmFwaEVuYWJsZVJlcXVlc3QiLCJzZWxlY3RPcHRzIiwia2V5IiwibGFiZWwiLCJfZ3JhcGhTZWxlY3QiLCJpZCIsIm9wdGlvbnMiLCJ2YWx1ZSIsIl9vbkdyYXBoU2VsZWN0aW9uQ2hhbmdlIiwiX29uTW9kZWxDaGFuZ2UiLCJfb25EYXRhU2V0QWRkZWQiLCJfb25EYXRhU2V0UmVtb3ZlZCIsIl9vbkRhdGFTZXRzQ2xlYXJlZCIsIl9vblJlc3VsdEdyb3VwUmVtb3ZlZCIsIl9vblJlc3VsdFRvZ2dsZSIsIiRlbCIsImZpbmQiLCJjbGljayIsIl9vblRhYkNsaWNrIiwiZGlzYWJsZUZpZWxkcyIsInVwZGF0ZSIsImdldCIsImV2dCIsInNob3ciLCJoaWRlIiwiZGlzcGF0Y2hFdmVudCIsImRhdGEiLCJwYXRoIiwidG9nZ2xlQ2xhc3MiLCJ1cGRhdGVGaWVsZFN0YXR1cyIsImN1cnJlbnRUYXJnZXQiLCJlbmFibGVGaWVsZHMiLCJlbmFibGUiLCJyZW1vdmVQcm9wIiwiZGlzYWJsZSIsInByb3AiLCJkcyIsImRhdGFzZXQiLCJleHBJZCIsInJlc3VsdEdyb3VwIiwidXBkYXRlR3JhcGhzIiwibGVuZ3RoIiwianFldnQiLCJncm91cCIsInJlbW92ZUNoaWxkIiwidG9nZ2xlUmVzdWx0IiwicmVzdWx0SWQiLCJzaG93biIsImVuYWJsZU9wdGlvbiIsImRpc2FibGVPcHRpb24iLCJzZWxlY3RGaXJzdEFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLGlCQUFSLENBRGI7QUFBQSxNQUVFTSxvQkFBb0JOLFFBQVEsaUJBQVIsQ0FGdEI7QUFBQSxNQUlFTyxpQkFBaUJQLFFBQVEsZ0RBQVIsQ0FKbkI7QUFBQSxNQUtFUSxjQUFjUixRQUFRLDZDQUFSLENBTGhCO0FBQUEsTUFNRVMsdUJBQXVCVCxRQUFRLHFEQUFSLENBTnpCO0FBQUEsTUFPRVUsdUJBQXVCVixRQUFRLHFEQUFSLENBUHpCO0FBQUEsTUFRRVcsY0FBY1gsUUFBUSxrQ0FBUixDQVJoQjs7QUFXQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDhCQUFZWSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLHNJQUNqQkEsUUFBUVIsUUFEUzs7QUFFdkJKLFlBQU1hLFdBQU4sUUFBd0IsQ0FDdEIsaUJBRHNCLEVBQ0gsbUJBREcsRUFDa0Isb0JBRGxCLEVBQ3dDLGFBRHhDLEVBRXRCLGdCQUZzQixFQUVKLHVCQUZJLEVBRXFCLHlCQUZyQixFQUVnRCxpQkFGaEQsRUFHdEIsd0JBSHNCLEVBR0ksdUJBSEosQ0FBeEI7QUFJQSxZ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akI7QUFDQSxlQUFPLEtBQUtyRCxRQUFMLENBQWNxRCxLQUFkLENBQVA7QUFDQSxhQUFLM0IsaUJBQUwsQ0FBdUJXLEdBQXZCO0FBQ0EsYUFBS08saUJBQUwsQ0FBdUJQLElBQUlRLGFBQTNCO0FBQ0Q7QUE3SEg7QUFBQTtBQUFBLHNDQStIa0JSLEdBL0hsQixFQStIdUI7QUFDbkI5QixlQUFPQyxNQUFQLENBQWMsS0FBS1AsT0FBbkIsRUFBNEJRLE9BQTVCLENBQW9DLFVBQUNDLEtBQUQsRUFBVztBQUM3Q0EsZ0JBQU1rRCxZQUFOLENBQW1CdkIsSUFBSUksSUFBSixDQUFTb0IsUUFBNUIsRUFBc0N4QixJQUFJSSxJQUFKLENBQVNxQixLQUEvQztBQUNELFNBRkQ7QUFHRDtBQW5JSDtBQUFBO0FBQUEsNENBcUl3QnpCLEdBckl4QixFQXFJNkI7QUFDekIsYUFBS2xCLFlBQUwsQ0FBa0I0QyxZQUFsQixDQUErQjFCLElBQUlJLElBQUosQ0FBU3JCLEVBQXhDO0FBQ0Q7QUF2SUg7QUFBQTtBQUFBLDZDQXlJeUJpQixHQXpJekIsRUF5SThCO0FBQzFCLGFBQUtsQixZQUFMLENBQWtCNkMsYUFBbEIsQ0FBZ0MzQixJQUFJSSxJQUFKLENBQVNyQixFQUF6QztBQUNBLGFBQUtELFlBQUwsQ0FBa0I4QyxlQUFsQjtBQUNEO0FBNUlIO0FBQUE7QUFBQSxnREE4STRCO0FBQ3hCLGVBQU8sS0FBS2hFLE9BQUwsQ0FBYSxLQUFLa0IsWUFBTCxDQUFrQkcsS0FBbEIsRUFBYixFQUF3Q0osS0FBeEMsRUFBUDtBQUNEO0FBaEpIOztBQUFBO0FBQUEsSUFBc0M3QixPQUF0QztBQWtKRCxDQXBLRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9hZ2dyZWdhdGUvdGFiL3ZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
