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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJSZXN1bHRHcm91cExlZ2VuZCIsIkF2Z09yaWVudGF0aW9uIiwiQXZnVmVsb2NpdHkiLCJPcmllbnRhdGlvbkludGVuc2l0eSIsIk9yaWVudGF0aW9uRGlyZWN0aW9uIiwiU2VsZWN0RmllbGQiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9sZWdlbmRzIiwiX2dyYXBocyIsIm9yaWVudGF0aW9uX3RpbWUiLCJjcmVhdGUiLCJ2ZWxvY2l0eV90aW1lIiwib3JpZW50YXRpb25faW50ZW5zaXR5Iiwib3JpZW50YXRpb25fZGlyZWN0aW9uIiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsImdyYXBoIiwiYWRkQ2hpbGQiLCJ2aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkdyYXBoRGlzYWJsZVJlcXVlc3QiLCJfb25HcmFwaEVuYWJsZVJlcXVlc3QiLCJzZWxlY3RPcHRzIiwia2V5IiwibGFiZWwiLCJfZ3JhcGhTZWxlY3QiLCJpZCIsIm9wdGlvbnMiLCJ2YWx1ZSIsIl9vbkdyYXBoU2VsZWN0aW9uQ2hhbmdlIiwiX29uTW9kZWxDaGFuZ2UiLCJfb25EYXRhU2V0QWRkZWQiLCJfb25EYXRhU2V0UmVtb3ZlZCIsIl9vbkRhdGFTZXRzQ2xlYXJlZCIsIl9vblJlc3VsdEdyb3VwUmVtb3ZlZCIsIl9vblJlc3VsdFRvZ2dsZSIsIiRlbCIsImZpbmQiLCJjbGljayIsIl9vblRhYkNsaWNrIiwiZGlzYWJsZUZpZWxkcyIsInVwZGF0ZSIsImdldCIsImRzIiwicmVzIiwidG9nZ2xlUmVzdWx0IiwiZXZ0Iiwic2hvdyIsImhpZGUiLCJkaXNwYXRjaEV2ZW50IiwiZGF0YSIsInBhdGgiLCJ0b2dnbGVDbGFzcyIsInVwZGF0ZUZpZWxkU3RhdHVzIiwiY3VycmVudFRhcmdldCIsImVuYWJsZUZpZWxkcyIsImVuYWJsZSIsInJlbW92ZVByb3AiLCJkaXNhYmxlIiwicHJvcCIsImRhdGFzZXQiLCJleHBJZCIsInJlc3VsdEdyb3VwIiwidXBkYXRlR3JhcGhzIiwibGVuZ3RoIiwianFldnQiLCJncm91cCIsInJlbW92ZUNoaWxkIiwicmVzdWx0SWQiLCJzaG93biIsImVuYWJsZU9wdGlvbiIsImRpc2FibGVPcHRpb24iLCJzZWxlY3RGaXJzdEFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLGlCQUFSLENBRGI7QUFBQSxNQUVFTSxvQkFBb0JOLFFBQVEsaUJBQVIsQ0FGdEI7QUFBQSxNQUlFTyxpQkFBaUJQLFFBQVEsZ0RBQVIsQ0FKbkI7QUFBQSxNQUtFUSxjQUFjUixRQUFRLDZDQUFSLENBTGhCO0FBQUEsTUFNRVMsdUJBQXVCVCxRQUFRLHFEQUFSLENBTnpCO0FBQUEsTUFPRVUsdUJBQXVCVixRQUFRLHFEQUFSLENBUHpCO0FBQUEsTUFRRVcsY0FBY1gsUUFBUSxrQ0FBUixDQVJoQjs7QUFXQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDhCQUFZWSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLHNJQUNqQkEsUUFBUVIsUUFEUzs7QUFFdkJKLFlBQU1hLFdBQU4sUUFBd0IsQ0FDdEIsaUJBRHNCLEVBQ0gsbUJBREcsRUFDa0Isb0JBRGxCLEVBQ3dDLGFBRHhDLEVBRXRCLGdCQUZzQixFQUVKLHVCQUZJLEVBRXFCLHlCQUZyQixFQUVnRCxpQkFGaEQsRUFHdEIsd0JBSHNCLEVBR0ksdUJBSEosQ0FBeEI7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LENBQWtCRyxLQUFsQixFQUFiLEVBQXdDSixLQUF4QyxFQUFQO0FBQ0Q7QUFySkg7O0FBQUE7QUFBQSxJQUFzQzdCLE9BQXRDO0FBdUpELENBektEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG4gIFxuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vdGFiLmh0bWwnKSxcbiAgICBSZXN1bHRHcm91cExlZ2VuZCA9IHJlcXVpcmUoJy4vbGVnZW5kL2xlZ2VuZCcpLFxuXG4gICAgQXZnT3JpZW50YXRpb24gPSByZXF1aXJlKCdldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl90aW1lL2dyYXBoJyksXG4gICAgQXZnVmVsb2NpdHkgPSByZXF1aXJlKCdldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC92ZWxvY2l0eV90aW1lL2dyYXBoJyksXG4gICAgT3JpZW50YXRpb25JbnRlbnNpdHkgPSByZXF1aXJlKCdldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl9pbnRlbnNpdHkvZ3JhcGgnKSxcbiAgICBPcmllbnRhdGlvbkRpcmVjdGlvbiA9IHJlcXVpcmUoJ2V1Z2xlbmEvYWdncmVnYXRlL2dyYXBoL29yaWVudGF0aW9uX2RpcmVjdGlvbi9ncmFwaCcpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKVxuICAgIDtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIEFnZ3JlZ2F0ZVRhYlZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25EYXRhU2V0QWRkZWQnLCAnX29uRGF0YVNldFJlbW92ZWQnLCAnX29uRGF0YVNldHNDbGVhcmVkJywgJ19vblRhYkNsaWNrJywgXG4gICAgICAgICdfb25Nb2RlbENoYW5nZScsICdfb25SZXN1bHRHcm91cFJlbW92ZWQnLCAnX29uR3JhcGhTZWxlY3Rpb25DaGFuZ2UnLCAnX29uUmVzdWx0VG9nZ2xlJyxcbiAgICAgICAgJ19vbkdyYXBoRGlzYWJsZVJlcXVlc3QnLCAnX29uR3JhcGhFbmFibGVSZXF1ZXN0J10pXG4gICAgICB0aGlzLl9sZWdlbmRzID0ge307XG4gICAgICB0aGlzLl9ncmFwaHMgPSB7XG4gICAgICAgIG9yaWVudGF0aW9uX3RpbWU6IEF2Z09yaWVudGF0aW9uLmNyZWF0ZSh7fSksXG4gICAgICAgIHZlbG9jaXR5X3RpbWU6IEF2Z1ZlbG9jaXR5LmNyZWF0ZSh7fSksXG4gICAgICAgIG9yaWVudGF0aW9uX2ludGVuc2l0eTogT3JpZW50YXRpb25JbnRlbnNpdHkuY3JlYXRlKHt9KSxcbiAgICAgICAgb3JpZW50YXRpb25fZGlyZWN0aW9uOiBPcmllbnRhdGlvbkRpcmVjdGlvbi5jcmVhdGUoe30pXG4gICAgICB9O1xuXG4gICAgICBPYmplY3QudmFsdWVzKHRoaXMuX2dyYXBocykuZm9yRWFjaCgoZ3JhcGgpID0+IHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChncmFwaC52aWV3KCksIFwiLmFnZ3JlZ2F0ZV9fZ3JhcGhzXCIpXG4gICAgICAgIGdyYXBoLmFkZEV2ZW50TGlzdGVuZXIoJ0FnZ3JlZ2F0ZUdyYXBoLkRpc2FibGVSZXF1ZXN0JywgdGhpcy5fb25HcmFwaERpc2FibGVSZXF1ZXN0KTtcbiAgICAgICAgZ3JhcGguYWRkRXZlbnRMaXN0ZW5lcignQWdncmVnYXRlR3JhcGguRW5hYmxlUmVxdWVzdCcsIHRoaXMuX29uR3JhcGhFbmFibGVSZXF1ZXN0KTtcbiAgICAgIH0pXG5cbiAgICAgIGxldCBzZWxlY3RPcHRzID0ge307XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fZ3JhcGhzKSB7XG4gICAgICAgIHNlbGVjdE9wdHNba2V5XSA9IHRoaXMuX2dyYXBoc1trZXldLmxhYmVsKClcbiAgICAgIH1cbiAgICAgIHRoaXMuX2dyYXBoU2VsZWN0ID0gU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgbGFiZWw6ICdWaXN1YWxpemF0aW9uJyxcbiAgICAgICAgaWQ6ICd2aXN1YWxpemF0aW9uJyxcbiAgICAgICAgb3B0aW9uczogc2VsZWN0T3B0cyxcbiAgICAgICAgdmFsdWU6ICdvcmllbnRhdGlvbl90aW1lJ1xuICAgICAgfSlcblxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9ncmFwaFNlbGVjdC52aWV3KCksICcuYWdncmVnYXRlX19sZWdlbmRfX3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgIHRoaXMuX2dyYXBoU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLkNoYW5nZScsIHRoaXMuX29uR3JhcGhTZWxlY3Rpb25DaGFuZ2UpXG4gICAgICB0aGlzLl9vbkdyYXBoU2VsZWN0aW9uQ2hhbmdlKClcblxuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZSlcbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ0FnZ3JlZ2F0ZURhdGEuRGF0YVNldEFkZGVkJywgdGhpcy5fb25EYXRhU2V0QWRkZWQpXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdBZ2dyZWdhdGVEYXRhLkRhdGFTZXRSZW1vdmVkJywgdGhpcy5fb25EYXRhU2V0UmVtb3ZlZClcbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ0FnZ3JlZ2F0ZURhdGEuRGF0YVNldHNDbGVhcmVkJywgdGhpcy5fb25EYXRhU2V0c0NsZWFyZWQpXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdBZ2dyZWdhdGVEYXRhLlJlc3VsdEdyb3VwUmVtb3ZlZCcsIHRoaXMuX29uUmVzdWx0R3JvdXBSZW1vdmVkKVxuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignQWdncmVnYXRlRGF0YS5SZXN1bHRUb2dnbGUnLCB0aGlzLl9vblJlc3VsdFRvZ2dsZSlcblxuICAgICAgdGhpcy4kZWwuZmluZCgnLmFnZ3JlZ2F0ZV9fdGFiJykuY2xpY2sodGhpcy5fb25UYWJDbGljaylcbiAgICAgIHRoaXMuZGlzYWJsZUZpZWxkcygpO1xuICAgIH1cblxuICAgIHVwZGF0ZUdyYXBocyhtb2RlbCkge1xuICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLl9ncmFwaHMpLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGdyYXBoLnVwZGF0ZShtb2RlbC5nZXQoJ2RhdGFzZXRzJykpO1xuICAgICAgICBPYmplY3QudmFsdWVzKG1vZGVsLmdldCgnZGF0YXNldHMnKSkuZm9yRWFjaCgoZHMpID0+IHtcbiAgICAgICAgICBkcy5nZXQoJ3Jlc3VsdHMnKS5mb3JFYWNoKChyZXMpID0+IHtcbiAgICAgICAgICAgIGdyYXBoLnRvZ2dsZVJlc3VsdChyZXMuZ2V0KCdpZCcpLCByZXMuZ2V0KCdzaG93bicpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkdyYXBoU2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuX2dyYXBocykge1xuICAgICAgICBpZiAoa2V5ID09IHRoaXMuX2dyYXBoU2VsZWN0LnZhbHVlKCkpIHtcbiAgICAgICAgICB0aGlzLl9ncmFwaHNba2V5XS52aWV3KCkuc2hvdygpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZ3JhcGhzW2tleV0udmlldygpLmhpZGUoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZVRhYi5HcmFwaFNlbGVjdGlvbkNoYW5nZScsIHt9KVxuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJvcGVuXCIpIHtcbiAgICAgICAgdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ2FnZ3JlZ2F0ZV9fb3BlbicsIGV2dC5kYXRhLnZhbHVlKVxuICAgICAgICB0aGlzLnVwZGF0ZUZpZWxkU3RhdHVzKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVGaWVsZFN0YXR1cyhtb2RlbCkge1xuICAgICAgaWYgKG1vZGVsLmdldCgnb3BlbicpKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlRmllbGRzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpc2FibGVGaWVsZHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbmFibGVGaWVsZHMoKSB7XG4gICAgICB0aGlzLl9ncmFwaFNlbGVjdC5lbmFibGUoKTtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJ2lucHV0LCBidXR0b24nKS5yZW1vdmVQcm9wKCdkaXNhYmxlZCcpO1xuICAgIH1cblxuICAgIGRpc2FibGVGaWVsZHMoKSB7XG4gICAgICB0aGlzLl9ncmFwaFNlbGVjdC5kaXNhYmxlKCk7XG4gICAgICB0aGlzLiRlbC5maW5kKCdpbnB1dCwgYnV0dG9uJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBfb25EYXRhU2V0QWRkZWQoZXZ0KSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuYWdncmVnYXRlX19sZWdlbmRfX2VtcHR5JykuaGlkZSgpO1xuICAgICAgY29uc3QgZHMgPSBldnQuZGF0YS5kYXRhc2V0O1xuICAgICAgY29uc3QgZXhwSWQgPSBldnQuZGF0YS5yZXN1bHRHcm91cC5nZXQoJ2V4cGVyaW1lbnRJZCcpXG4gICAgICBpZiAoIXRoaXMuX2xlZ2VuZHNbZXhwSWRdKSB7XG4gICAgICAgIHRoaXMuX2xlZ2VuZHNbZXhwSWRdID0gbmV3IFJlc3VsdEdyb3VwTGVnZW5kKGV2dC5jdXJyZW50VGFyZ2V0LmdldChgZGF0YXNldHMuJHtleHBJZH1gKSk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fbGVnZW5kc1tleHBJZF0sICcuYWdncmVnYXRlX19sZWdlbmRfX3Jlc3VsdHMnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudXBkYXRlR3JhcGhzKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIHRoaXMudXBkYXRlRmllbGRTdGF0dXMoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgIH1cblxuICAgIF9vbkRhdGFTZXRSZW1vdmVkKGV2dCkge1xuICAgICAgaWYgKE9iamVjdC52YWx1ZXMoZXZ0LmN1cnJlbnRUYXJnZXQuZ2V0KCdkYXRhc2V0cycpKS5sZW5ndGggPT0gMCkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuYWdncmVnYXRlX19sZWdlbmRfX2VtcHR5Jykuc2hvdygpO1xuICAgICAgfVxuICAgICAgdGhpcy51cGRhdGVHcmFwaHMoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgdGhpcy51cGRhdGVGaWVsZFN0YXR1cyhldnQuY3VycmVudFRhcmdldCk7XG4gICAgfVxuXG4gICAgX29uRGF0YVNldHNDbGVhcmVkKGV2dCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLmFnZ3JlZ2F0ZV9fbGVnZW5kX19lbXB0eScpLnNob3coKTtcbiAgICAgIHRoaXMudXBkYXRlR3JhcGhzKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIHRoaXMudXBkYXRlRmllbGRTdGF0dXMoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgIH1cblxuICAgIF9vblRhYkNsaWNrKGpxZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZVRhYi5Ub2dnbGVSZXF1ZXN0Jywge30sIHRydWUpO1xuICAgIH1cblxuICAgIF9vblJlc3VsdEdyb3VwUmVtb3ZlZChldnQpIHtcbiAgICAgIGNvbnN0IGV4cElkID0gZXZ0LmRhdGEuZ3JvdXAuZ2V0KCdleHBlcmltZW50SWQnKTtcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5fbGVnZW5kc1tleHBJZF0pO1xuICAgICAgZGVsZXRlIHRoaXMuX2xlZ2VuZHNbZXhwSWRdO1xuICAgICAgdGhpcy5fb25EYXRhU2V0UmVtb3ZlZChldnQpO1xuICAgICAgdGhpcy51cGRhdGVGaWVsZFN0YXR1cyhldnQuY3VycmVudFRhcmdldCk7XG4gICAgfVxuXG4gICAgX29uUmVzdWx0VG9nZ2xlKGV2dCkge1xuICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLl9ncmFwaHMpLmZvckVhY2goKGdyYXBoKSA9PiB7XG4gICAgICAgIGdyYXBoLnRvZ2dsZVJlc3VsdChldnQuZGF0YS5yZXN1bHRJZCwgZXZ0LmRhdGEuc2hvd24pXG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkdyYXBoRW5hYmxlUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX2dyYXBoU2VsZWN0LmVuYWJsZU9wdGlvbihldnQuZGF0YS5pZClcbiAgICB9XG5cbiAgICBfb25HcmFwaERpc2FibGVSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fZ3JhcGhTZWxlY3QuZGlzYWJsZU9wdGlvbihldnQuZGF0YS5pZClcbiAgICAgIHRoaXMuX2dyYXBoU2VsZWN0LnNlbGVjdEZpcnN0QWJsZSgpO1xuICAgIH1cblxuICAgIGdldEN1cnJlbnRWaXN1YWxpemF0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2dyYXBoc1t0aGlzLl9ncmFwaFNlbGVjdC52YWx1ZSgpXS5sYWJlbCgpXG4gICAgfVxuICB9XG59KSJdfQ==
