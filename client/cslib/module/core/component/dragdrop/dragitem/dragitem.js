'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');

  return function (_Component) {
    _inherits(DragItem, _Component);

    function DragItem() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, DragItem);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (DragItem.__proto__ || Object.getPrototypeOf(DragItem)).call(this, settings));

      Utils.bindMethods(_this, ['_passEvent']);

      _this._view.addEventListener('DragItem.RequestSelect', _this._passEvent);
      _this._view.addEventListener('DragItem.RequestMultiSelect', _this._passEvent);
      _this._view.addEventListener('DragItem.RequestDrag', _this._passEvent);
      return _this;
    }

    _createClass(DragItem, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'select',
      value: function select() {
        this._model.set('selected', true);
      }
    }, {
      key: 'deselect',
      value: function deselect() {
        this._model.set('selected', false);
      }
    }, {
      key: '_passEvent',
      value: function _passEvent(evt) {
        this.dispatchEvent(evt);
      }
    }, {
      key: 'handleReception',
      value: function handleReception(dropSite) {
        this._model.set('container', dropSite);
      }
    }, {
      key: 'handleDrag',
      value: function handleDrag() {
        this._view.handleDrag();
      }
    }, {
      key: 'endDrag',
      value: function endDrag() {
        this._view.endDrag();
      }
    }, {
      key: 'container',
      value: function container() {
        return this._model.get('container');
      }
    }, {
      key: 'export',
      value: function _export() {
        return this._model.get('id');
      }
    }]);

    return DragItem;
  }(Component);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcmFnaXRlbS9kcmFnaXRlbS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl92aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9wYXNzRXZlbnQiLCJfbW9kZWwiLCJnZXQiLCJzZXQiLCJldnQiLCJkaXNwYXRjaEV2ZW50IiwiZHJvcFNpdGUiLCJoYW5kbGVEcmFnIiwiZW5kRHJhZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFNQTtBQUFBOztBQUNFLHdCQUEyQjtBQUFBLFVBQWZLLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJKLEtBQTdDO0FBQ0FHLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JKLElBQTNDOztBQUZ5QixzSEFHbkJFLFFBSG1COztBQUl6QkQsWUFBTUksV0FBTixRQUF3QixDQUFDLFlBQUQsQ0FBeEI7O0FBRUEsWUFBS0MsS0FBTCxDQUFXQyxnQkFBWCxDQUE0Qix3QkFBNUIsRUFBc0QsTUFBS0MsVUFBM0Q7QUFDQSxZQUFLRixLQUFMLENBQVdDLGdCQUFYLENBQTRCLDZCQUE1QixFQUEyRCxNQUFLQyxVQUFoRTtBQUNBLFlBQUtGLEtBQUwsQ0FBV0MsZ0JBQVgsQ0FBNEIsc0JBQTVCLEVBQW9ELE1BQUtDLFVBQXpEO0FBUnlCO0FBUzFCOztBQVZIO0FBQUE7QUFBQSwyQkFZTztBQUNILGVBQU8sS0FBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQWRIO0FBQUE7QUFBQSwrQkFnQlc7QUFDUCxhQUFLRCxNQUFMLENBQVlFLEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEIsSUFBNUI7QUFDRDtBQWxCSDtBQUFBO0FBQUEsaUNBb0JhO0FBQ1QsYUFBS0YsTUFBTCxDQUFZRSxHQUFaLENBQWdCLFVBQWhCLEVBQTRCLEtBQTVCO0FBQ0Q7QUF0Qkg7QUFBQTtBQUFBLGlDQXdCYUMsR0F4QmIsRUF3QmtCO0FBQ2QsYUFBS0MsYUFBTCxDQUFtQkQsR0FBbkI7QUFDRDtBQTFCSDtBQUFBO0FBQUEsc0NBNEJrQkUsUUE1QmxCLEVBNEI0QjtBQUN4QixhQUFLTCxNQUFMLENBQVlFLEdBQVosQ0FBZ0IsV0FBaEIsRUFBNkJHLFFBQTdCO0FBQ0Q7QUE5Qkg7QUFBQTtBQUFBLG1DQWdDZTtBQUNYLGFBQUtSLEtBQUwsQ0FBV1MsVUFBWDtBQUNEO0FBbENIO0FBQUE7QUFBQSxnQ0FvQ1k7QUFDUixhQUFLVCxLQUFMLENBQVdVLE9BQVg7QUFDRDtBQXRDSDtBQUFBO0FBQUEsa0NBd0NjO0FBQ1YsZUFBTyxLQUFLUCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsV0FBaEIsQ0FBUDtBQUNEO0FBMUNIO0FBQUE7QUFBQSxnQ0E0Q1c7QUFDUCxlQUFPLEtBQUtELE1BQUwsQ0FBWUMsR0FBWixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUE5Q0g7O0FBQUE7QUFBQSxJQUE4QlosU0FBOUI7QUFnREQsQ0F2REQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2RyYWdkcm9wL2RyYWdpdGVtL2RyYWdpdGVtLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
