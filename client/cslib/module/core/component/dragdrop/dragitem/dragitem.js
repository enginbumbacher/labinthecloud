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
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, DragItem);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DragItem).call(this, settings));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcmFnaXRlbS9kcmFnaXRlbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFlBQVksUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0UsUUFBUSxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUUsT0FBTyxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0UsUUFBUSxRQUFRLGlCQUFSLENBSFY7O0FBTUE7QUFBQTs7QUFDRSx3QkFBMkI7QUFBQSxVQUFmLFFBQWUseURBQUosRUFBSTs7QUFBQTs7QUFDekIsZUFBUyxVQUFULEdBQXNCLFNBQVMsVUFBVCxJQUF1QixLQUE3QztBQUNBLGVBQVMsU0FBVCxHQUFxQixTQUFTLFNBQVQsSUFBc0IsSUFBM0M7O0FBRnlCLDhGQUduQixRQUhtQjs7QUFJekIsWUFBTSxXQUFOLFFBQXdCLENBQUMsWUFBRCxDQUF4Qjs7QUFFQSxZQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUE0Qix3QkFBNUIsRUFBc0QsTUFBSyxVQUEzRDtBQUNBLFlBQUssS0FBTCxDQUFXLGdCQUFYLENBQTRCLDZCQUE1QixFQUEyRCxNQUFLLFVBQWhFO0FBQ0EsWUFBSyxLQUFMLENBQVcsZ0JBQVgsQ0FBNEIsc0JBQTVCLEVBQW9ELE1BQUssVUFBekQ7QUFSeUI7QUFTMUI7O0FBVkg7QUFBQTtBQUFBLDJCQVlPO0FBQ0gsZUFBTyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQWRIO0FBQUE7QUFBQSwrQkFnQlc7QUFDUCxhQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFVBQWhCLEVBQTRCLElBQTVCO0FBQ0Q7QUFsQkg7QUFBQTtBQUFBLGlDQW9CYTtBQUNULGFBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEIsS0FBNUI7QUFDRDtBQXRCSDtBQUFBO0FBQUEsaUNBd0JhLEdBeEJiLEVBd0JrQjtBQUNkLGFBQUssYUFBTCxDQUFtQixHQUFuQjtBQUNEO0FBMUJIO0FBQUE7QUFBQSxzQ0E0QmtCLFFBNUJsQixFQTRCNEI7QUFDeEIsYUFBSyxNQUFMLENBQVksR0FBWixDQUFnQixXQUFoQixFQUE2QixRQUE3QjtBQUNEO0FBOUJIO0FBQUE7QUFBQSxtQ0FnQ2U7QUFDWCxhQUFLLEtBQUwsQ0FBVyxVQUFYO0FBQ0Q7QUFsQ0g7QUFBQTtBQUFBLGdDQW9DWTtBQUNSLGFBQUssS0FBTCxDQUFXLE9BQVg7QUFDRDtBQXRDSDtBQUFBO0FBQUEsa0NBd0NjO0FBQ1YsZUFBTyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFdBQWhCLENBQVA7QUFDRDtBQTFDSDtBQUFBO0FBQUEsZ0NBNENXO0FBQ1AsZUFBTyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQTlDSDs7QUFBQTtBQUFBLElBQThCLFNBQTlCO0FBZ0RELENBdkREIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcmFnaXRlbS9kcmFnaXRlbS5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
