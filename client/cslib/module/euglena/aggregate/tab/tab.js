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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvdGFiLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIkFnZ3JlZ2F0ZURhdGFUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25BZGRSZXF1ZXN0IiwidmlldyIsIl9vblRvZ2dsZVJlcXVlc3QiLCJfb25SZXN1bHRUb2dnbGVSZXF1ZXN0IiwiX29uQ2xlYXJSZXF1ZXN0IiwiX29uQ2xlYXJBbGxSZXF1ZXN0IiwiX29uR3JhcGhTZWxlY3Rpb25DaGFuZ2UiLCJldnQiLCJfbW9kZWwiLCJhZGREYXRhU2V0IiwiZGF0YSIsInRvZ2dsZSIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImRpc3BsYXlTdGF0ZSIsImdldERpc3BsYXlTdGF0ZSIsInZpc3VhbGl6YXRpb24iLCJnZXRDdXJyZW50VmlzdWFsaXphdGlvbiIsInRvZ2dsZVJlc3VsdCIsInJlc3VsdElkIiwiY2xlYXJSZXN1bHQiLCJjbGVhclJlc3VsdEdyb3VwIiwiZXhwZXJpbWVudElkIiwiY3JlYXRlIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxZQUFZSixRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUssUUFBUUwsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFTSxPQUFPTixRQUFRLFFBQVIsQ0FGVDs7QUFMa0IsTUFTWk8sZ0JBVFk7QUFBQTs7QUFVaEIsZ0NBQTJCO0FBQUEsVUFB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QUEwQjtBQUN4QkMsZ0JBQU0sY0FEa0I7QUFFeEJDLG9CQUFVLFdBRmM7QUFHeEJKLGdCQUFNO0FBQ0phLDBCQUFjaEIsSUFBSUcsSUFBSixDQUFTYSxZQURuQjtBQUVKUiwwQkFBYyxLQUFLUCxNQUFMLENBQVlRLGVBQVosRUFGVjtBQUdKQywyQkFBZSxLQUFLaEIsSUFBTCxHQUFZaUIsdUJBQVo7QUFIWDtBQUhrQixTQUExQjtBQVNEO0FBN0VlO0FBQUE7QUFBQSw4Q0ErRVFYLEdBL0VSLEVBK0VhO0FBQzNCbkIsZ0JBQVFVLEdBQVIsQ0FBWSxRQUFaLEVBQXNCYyxHQUF0QixDQUEwQjtBQUN4QkMsZ0JBQU0sc0JBRGtCO0FBRXhCQyxvQkFBVSxXQUZjO0FBR3hCSixnQkFBTTtBQUNKSywwQkFBYyxLQUFLUCxNQUFMLENBQVlRLGVBQVosRUFEVjtBQUVKQywyQkFBZSxLQUFLaEIsSUFBTCxHQUFZaUIsdUJBQVo7QUFGWDtBQUhrQixTQUExQjtBQVFEO0FBeEZlOztBQUFBO0FBQUEsSUFTYTVCLFNBVGI7O0FBMkZsQkcsbUJBQWlCK0IsTUFBakIsR0FBMEIsWUFBZTtBQUFBLFFBQWRkLElBQWMsdUVBQVAsRUFBTzs7QUFDdkMsV0FBTyxJQUFJakIsZ0JBQUosQ0FBcUIsRUFBRWdDLFdBQVdmLElBQWIsRUFBckIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT2pCLGdCQUFQO0FBQ0QsQ0FoR0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL3RhYi90YWIuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
