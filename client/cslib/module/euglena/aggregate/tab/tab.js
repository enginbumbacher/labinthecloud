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
      key: '_onAddRequest',
      value: function _onAddRequest(evt) {
        console.log(evt.data.data);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvdGFiLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIkFnZ3JlZ2F0ZURhdGFUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25BZGRSZXF1ZXN0IiwidmlldyIsIl9vblRvZ2dsZVJlcXVlc3QiLCJfb25SZXN1bHRUb2dnbGVSZXF1ZXN0IiwiX29uQ2xlYXJSZXF1ZXN0IiwiX29uQ2xlYXJBbGxSZXF1ZXN0IiwiX29uR3JhcGhTZWxlY3Rpb25DaGFuZ2UiLCJldnQiLCJjb25zb2xlIiwibG9nIiwiZGF0YSIsIl9tb2RlbCIsImFkZERhdGFTZXQiLCJ0b2dnbGUiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJkaXNwbGF5U3RhdGUiLCJnZXREaXNwbGF5U3RhdGUiLCJ2aXN1YWxpemF0aW9uIiwiZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24iLCJ0b2dnbGVSZXN1bHQiLCJyZXN1bHRJZCIsImNsZWFyUmVzdWx0IiwiY2xlYXJSZXN1bHRHcm91cCIsImV4cGVyaW1lbnRJZCIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksWUFBWUosUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VLLFFBQVFMLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU0sT0FBT04sUUFBUSxRQUFSLENBRlQ7O0FBTGtCLE1BU1pPLGdCQVRZO0FBQUE7O0FBVWhCLGdDQUEy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QUosQ0FBU2MsWUFBdEM7QUFDQXBDLGdCQUFRVSxHQUFSLENBQVksUUFBWixFQUFzQlcsR0FBdEIsQ0FBMEI7QUFDeEJLLGdCQUFNLGNBRGtCO0FBRXhCQyxvQkFBVSxXQUZjO0FBR3hCTCxnQkFBTTtBQUNKYywwQkFBY2pCLElBQUlHLElBQUosQ0FBU2MsWUFEbkI7QUFFSlIsMEJBQWMsS0FBS0wsTUFBTCxDQUFZTSxlQUFaLEVBRlY7QUFHSkMsMkJBQWUsS0FBS2pCLElBQUwsR0FBWWtCLHVCQUFaO0FBSFg7QUFIa0IsU0FBMUI7QUFTRDtBQTlFZTtBQUFBO0FBQUEsOENBZ0ZRWixHQWhGUixFQWdGYTtBQUMzQm5CLGdCQUFRVSxHQUFSLENBQVksUUFBWixFQUFzQlcsR0FBdEIsQ0FBMEI7QUFDeEJLLGdCQUFNLHNCQURrQjtBQUV4QkMsb0JBQVUsV0FGYztBQUd4QkwsZ0JBQU07QUFDSk0sMEJBQWMsS0FBS0wsTUFBTCxDQUFZTSxlQUFaLEVBRFY7QUFFSkMsMkJBQWUsS0FBS2pCLElBQUwsR0FBWWtCLHVCQUFaO0FBRlg7QUFIa0IsU0FBMUI7QUFRRDtBQXpGZTs7QUFBQTtBQUFBLElBU2E3QixTQVRiOztBQTRGbEJHLG1CQUFpQmdDLE1BQWpCLEdBQTBCLFlBQWU7QUFBQSxRQUFkZixJQUFjLHVFQUFQLEVBQU87O0FBQ3ZDLFdBQU8sSUFBSWpCLGdCQUFKLENBQXFCLEVBQUVpQyxXQUFXaEIsSUFBYixFQUFyQixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPakIsZ0JBQVA7QUFDRCxDQWpHRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9hZ2dyZWdhdGUvdGFiL3RhYi5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
