'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view');

  var AggregateDataTab = function (_Component) {
    _inherits(AggregateDataTab, _Component);

    function AggregateDataTab() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, AggregateDataTab);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (AggregateDataTab.__proto__ || Object.getPrototypeOf(AggregateDataTab)).call(this, settings));

      Utils.bindMethods(_this, ['_onAddRequest', '_onToggleRequest', '_onResultToggleRequest', '_onClearAllRequest', '_onClearRequest', '_onGraphSelectionChange']);

      Globals.get('Relay').addEventListener('AggregateData.AddRequest', _this._onAddRequest);
      _this.view().addEventListener('AggregateTab.ToggleRequest', _this._onToggleRequest);
      _this.view().addEventListener('LegendRow.ShowToggleRequest', _this._onResultToggleRequest);
      _this.view().addEventListener('LegendRow.ClearRequest', _this._onClearRequest);
      _this.view().addEventListener('Legend.ClearAllRequest', _this._onClearAllRequest);
      _this.view().addEventListener('AggregateTab.GraphSelectionChange', _this._onGraphSelectionChange);
      return _this;
    }

    _createClass(AggregateDataTab, [{
      key: 'hide',
      value: function hide() {
        this.view().hide();
      }
    }, {
      key: 'show',
      value: function show() {
        this.view().show();
      }
    }, {
      key: '_onAddRequest',
      value: function _onAddRequest(evt) {
        this._model.addDataSet(evt.data.data);
      }
    }, {
      key: '_onToggleRequest',
      value: function _onToggleRequest(evt) {
        this._model.toggle();
        Globals.get('Logger').log({
          type: this._model.get('open') ? 'open' : 'close',
          category: 'aggregate',
          data: {
            displayState: this._model.getDisplayState(),
            visualization: this.view().getCurrentVisualization()
          }
        });
      }
    }, {
      key: '_onResultToggleRequest',
      value: function _onResultToggleRequest(evt) {
        this._model.toggleResult(evt.data.resultId);
        Globals.get('Logger').log({
          type: 'result_toggle',
          category: 'aggregate',
          data: {
            displayState: this._model.getDisplayState(),
            visualization: this.view().getCurrentVisualization()
          }
        });
      }
    }, {
      key: '_onClearRequest',
      value: function _onClearRequest(evt) {
        this._model.clearResult(evt.data.resultId);
        Globals.get('Logger').log({
          type: 'remove_data',
          category: 'aggregate',
          data: {
            resultId: evt.data.resultId,
            displayState: this._model.getDisplayState(),
            visualization: this.view().getCurrentVisualization()
          }
        });
      }
    }, {
      key: '_onClearAllRequest',
      value: function _onClearAllRequest(evt) {
        this._model.clearResultGroup(evt.data.experimentId);
        Globals.get('Logger').log({
          type: 'remove_group',
          category: 'aggregate',
          data: {
            experimentId: evt.data.experimentId,
            displayState: this._model.getDisplayState(),
            visualization: this.view().getCurrentVisualization()
          }
        });
      }
    }, {
      key: '_onGraphSelectionChange',
      value: function _onGraphSelectionChange(evt) {
        Globals.get('Logger').log({
          type: 'visualization_change',
          category: 'aggregate',
          data: {
            displayState: this._model.getDisplayState(),
            visualization: this.view().getCurrentVisualization()
          }
        });
      }
    }]);

    return AggregateDataTab;
  }(Component);

  AggregateDataTab.create = function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new AggregateDataTab({ modelData: data });
  };

  return AggregateDataTab;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvdGFiLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIkFnZ3JlZ2F0ZURhdGFUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25BZGRSZXF1ZXN0IiwidmlldyIsIl9vblRvZ2dsZVJlcXVlc3QiLCJfb25SZXN1bHRUb2dnbGVSZXF1ZXN0IiwiX29uQ2xlYXJSZXF1ZXN0IiwiX29uQ2xlYXJBbGxSZXF1ZXN0IiwiX29uR3JhcGhTZWxlY3Rpb25DaGFuZ2UiLCJoaWRlIiwic2hvdyIsImV2dCIsIl9tb2RlbCIsImFkZERhdGFTZXQiLCJkYXRhIiwidG9nZ2xlIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZGlzcGxheVN0YXRlIiwiZ2V0RGlzcGxheVN0YXRlIiwidmlzdWFsaXphdGlvbiIsImdldEN1cnJlbnRWaXN1YWxpemF0aW9uIiwidG9nZ2xlUmVzdWx0IiwicmVzdWx0SWQiLCJjbGVhclJlc3VsdCIsImNsZWFyUmVzdWx0R3JvdXAiLCJleHBlcmltZW50SWQiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFlBQVlKLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFSyxRQUFRTCxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVNLE9BQU9OLFFBQVEsUUFBUixDQUZUOztBQUxrQixNQVNaTyxnQkFUWTtBQUFBOztBQVVoQixn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QUFBQSx5Q0EwRUdYLEdBMUVILEVBMEVRO0FBQ3RCLGFBQUtDLE1BQUwsQ0FBWWMsZ0JBQVosQ0FBNkJmLElBQUlHLElBQUosQ0FBU2EsWUFBdEM7QUFDQXJDLGdCQUFRVSxHQUFSLENBQVksUUFBWixFQUFzQmdCLEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxjQURrQjtBQUV4QkMsb0JBQVUsV0FGYztBQUd4QkosZ0JBQU07QUFDSmEsMEJBQWNoQixJQUFJRyxJQUFKLENBQVNhLFlBRG5CO0FBRUpSLDBCQUFjLEtBQUtQLE1BQUwsQ0FBWVEsZUFBWixFQUZWO0FBR0pDLDJCQUFlLEtBQUtsQixJQUFMLEdBQVltQix1QkFBWjtBQUhYO0FBSGtCLFNBQTFCO0FBU0Q7QUFyRmU7QUFBQTtBQUFBLDhDQXVGUVgsR0F2RlIsRUF1RmE7QUFDM0JyQixnQkFBUVUsR0FBUixDQUFZLFFBQVosRUFBc0JnQixHQUF0QixDQUEwQjtBQUN4QkMsZ0JBQU0sc0JBRGtCO0FBRXhCQyxvQkFBVSxXQUZjO0FBR3hCSixnQkFBTTtBQUNKSywwQkFBYyxLQUFLUCxNQUFMLENBQVlRLGVBQVosRUFEVjtBQUVKQywyQkFBZSxLQUFLbEIsSUFBTCxHQUFZbUIsdUJBQVo7QUFGWDtBQUhrQixTQUExQjtBQVFEO0FBaEdlOztBQUFBO0FBQUEsSUFTYTlCLFNBVGI7O0FBbUdsQkcsbUJBQWlCaUMsTUFBakIsR0FBMEIsWUFBZTtBQUFBLFFBQWRkLElBQWMsdUVBQVAsRUFBTzs7QUFDdkMsV0FBTyxJQUFJbkIsZ0JBQUosQ0FBcUIsRUFBRWtDLFdBQVdmLElBQWIsRUFBckIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT25CLGdCQUFQO0FBQ0QsQ0F4R0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL3RhYi90YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcblxuICBjbGFzcyBBZ2dyZWdhdGVEYXRhVGFiIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25BZGRSZXF1ZXN0JywgJ19vblRvZ2dsZVJlcXVlc3QnLCAnX29uUmVzdWx0VG9nZ2xlUmVxdWVzdCcsICdfb25DbGVhckFsbFJlcXVlc3QnLCAnX29uQ2xlYXJSZXF1ZXN0JyxcbiAgICAgICAgJ19vbkdyYXBoU2VsZWN0aW9uQ2hhbmdlJ10pXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FnZ3JlZ2F0ZURhdGEuQWRkUmVxdWVzdCcsIHRoaXMuX29uQWRkUmVxdWVzdCk7XG4gICAgICB0aGlzLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdBZ2dyZWdhdGVUYWIuVG9nZ2xlUmVxdWVzdCcsIHRoaXMuX29uVG9nZ2xlUmVxdWVzdClcbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0xlZ2VuZFJvdy5TaG93VG9nZ2xlUmVxdWVzdCcsIHRoaXMuX29uUmVzdWx0VG9nZ2xlUmVxdWVzdClcbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0xlZ2VuZFJvdy5DbGVhclJlcXVlc3QnLCB0aGlzLl9vbkNsZWFyUmVxdWVzdClcbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0xlZ2VuZC5DbGVhckFsbFJlcXVlc3QnLCB0aGlzLl9vbkNsZWFyQWxsUmVxdWVzdClcbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0FnZ3JlZ2F0ZVRhYi5HcmFwaFNlbGVjdGlvbkNoYW5nZScsIHRoaXMuX29uR3JhcGhTZWxlY3Rpb25DaGFuZ2UpXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIHRoaXMudmlldygpLmhpZGUoKTtcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgdGhpcy52aWV3KCkuc2hvdygpO1xuICAgIH1cblxuICAgIF9vbkFkZFJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9tb2RlbC5hZGREYXRhU2V0KGV2dC5kYXRhLmRhdGEpO1xuICAgIH1cblxuICAgIF9vblRvZ2dsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9tb2RlbC50b2dnbGUoKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiB0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSA/ICdvcGVuJyA6ICdjbG9zZScsXG4gICAgICAgIGNhdGVnb3J5OiAnYWdncmVnYXRlJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblJlc3VsdFRvZ2dsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9tb2RlbC50b2dnbGVSZXN1bHQoZXZ0LmRhdGEucmVzdWx0SWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdyZXN1bHRfdG9nZ2xlJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiB0aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uQ2xlYXJSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fbW9kZWwuY2xlYXJSZXN1bHQoZXZ0LmRhdGEucmVzdWx0SWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdyZW1vdmVfZGF0YScsXG4gICAgICAgIGNhdGVnb3J5OiAnYWdncmVnYXRlJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlc3VsdElkOiBldnQuZGF0YS5yZXN1bHRJZCxcbiAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgIHZpc3VhbGl6YXRpb246IHRoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25DbGVhckFsbFJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9tb2RlbC5jbGVhclJlc3VsdEdyb3VwKGV2dC5kYXRhLmV4cGVyaW1lbnRJZCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3JlbW92ZV9ncm91cCcsXG4gICAgICAgIGNhdGVnb3J5OiAnYWdncmVnYXRlJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogZXZ0LmRhdGEuZXhwZXJpbWVudElkLFxuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkdyYXBoU2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICd2aXN1YWxpemF0aW9uX2NoYW5nZScsXG4gICAgICAgIGNhdGVnb3J5OiAnYWdncmVnYXRlJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIEFnZ3JlZ2F0ZURhdGFUYWIuY3JlYXRlID0gKGRhdGEgPSB7fSkgPT4ge1xuICAgIHJldHVybiBuZXcgQWdncmVnYXRlRGF0YVRhYih7IG1vZGVsRGF0YTogZGF0YSB9KVxuICB9XG4gIFxuICByZXR1cm4gQWdncmVnYXRlRGF0YVRhYjtcbn0pIl19
