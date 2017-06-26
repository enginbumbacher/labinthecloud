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

  var AggregateTimeGraph = function (_Component) {
    _inherits(AggregateTimeGraph, _Component);

    function AggregateTimeGraph(settings) {
      _classCallCheck(this, AggregateTimeGraph);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (AggregateTimeGraph.__proto__ || Object.getPrototypeOf(AggregateTimeGraph)).call(this, settings));

      Utils.bindMethods(_this, ['_onEnableRequest', '_onDisableRequest']);
      _this._model.addEventListener('AggregateGraph.EnableRequest', _this._onEnableRequest);
      _this._model.addEventListener('AggregateGraph.DisableRequest', _this._onDisableRequest);
      return _this;
    }

    _createClass(AggregateTimeGraph, [{
      key: '_onEnableRequest',
      value: function _onEnableRequest(evt) {
        this.dispatchEvent(evt);
      }
    }, {
      key: '_onDisableRequest',
      value: function _onDisableRequest(evt) {
        this.dispatchEvent(evt);
      }
    }, {
      key: 'update',
      value: function update(datasets) {
        this._model.update(datasets);
      }
    }, {
      key: 'label',
      value: function label() {
        return this._model.get('label');
      }
    }, {
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'toggleResult',
      value: function toggleResult(resId, shown) {
        this.view().toggleResult(resId, shown);
      }
    }]);

    return AggregateTimeGraph;
  }(Component);

  AggregateTimeGraph.create = function (data) {
    return new AggregateTimeGraph({ modelData: data });
  };

  return AggregateTimeGraph;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC90aW1lL2dyYXBoLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIkFnZ3JlZ2F0ZVRpbWVHcmFwaCIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX21vZGVsIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkVuYWJsZVJlcXVlc3QiLCJfb25EaXNhYmxlUmVxdWVzdCIsImV2dCIsImRpc3BhdGNoRXZlbnQiLCJkYXRhc2V0cyIsInVwZGF0ZSIsImdldCIsInJlc0lkIiwic2hvd24iLCJ2aWV3IiwidG9nZ2xlUmVzdWx0IiwiY3JlYXRlIiwiZGF0YSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksWUFBWUosUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VLLFFBQVFMLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU0sT0FBT04sUUFBUSxRQUFSLENBRlQ7O0FBTGtCLE1BU1pPLGtCQVRZO0FBQUE7O0FBVWhCLGdDQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCSixLQUE3QztBQUNBRyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCSixJQUEzQzs7QUFGb0IsMElBR2RFLFFBSGM7O0FBSXBCUCxZQUFNVSxXQUFOLFFBQXdCLENBQUMsa0JBQUQsRUFBcUIsbUJBQXJCLENBQXhCO0FBQ0EsWUFBS0MsTUFBTCxDQUFZQyxnQkFBWixDQUE2Qiw4QkFBN0IsRUFBNkQsTUFBS0MsZ0JBQWxFO0FBQ0EsWUFBS0YsTUFBTCxDQUFZQyxnQkFBWixDQUE2QiwrQkFBN0IsRUFBOEQsTUFBS0UsaUJBQW5FO0FBTm9CO0FBT3JCOztBQWpCZTtBQUFBO0FBQUEsdUNBbUJDQyxHQW5CRCxFQW1CTTtBQUNwQixhQUFLQyxhQUFMLENBQW1CRCxHQUFuQjtBQUNEO0FBckJlO0FBQUE7QUFBQSx3Q0FzQkVBLEdBdEJGLEVBc0JPO0FBQ3JCLGFBQUtDLGFBQUwsQ0FBbUJELEdBQW5CO0FBQ0Q7QUF4QmU7QUFBQTtBQUFBLDZCQTBCVEUsUUExQlMsRUEwQkM7QUFDZixhQUFLTixNQUFMLENBQVlPLE1BQVosQ0FBbUJELFFBQW5CO0FBQ0Q7QUE1QmU7QUFBQTtBQUFBLDhCQThCUjtBQUNOLGVBQU8sS0FBS04sTUFBTCxDQUFZUSxHQUFaLENBQWdCLE9BQWhCLENBQVA7QUFDRDtBQWhDZTtBQUFBO0FBQUEsMkJBaUNYO0FBQ0gsZUFBTyxLQUFLUixNQUFMLENBQVlRLEdBQVosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBbkNlO0FBQUE7QUFBQSxtQ0FxQ0hDLEtBckNHLEVBcUNJQyxLQXJDSixFQXFDVztBQUN6QixhQUFLQyxJQUFMLEdBQVlDLFlBQVosQ0FBeUJILEtBQXpCLEVBQWdDQyxLQUFoQztBQUNEO0FBdkNlOztBQUFBO0FBQUEsSUFTZWxCLFNBVGY7O0FBeUNsQkcscUJBQW1Ca0IsTUFBbkIsR0FBNEIsVUFBQ0MsSUFBRCxFQUFVO0FBQ3BDLFdBQU8sSUFBSW5CLGtCQUFKLENBQXVCLEVBQUVvQixXQUFXRCxJQUFiLEVBQXZCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9uQixrQkFBUDtBQUNELENBOUNEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC90aW1lL2dyYXBoLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
