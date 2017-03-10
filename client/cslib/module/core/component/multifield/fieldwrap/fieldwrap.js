'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DragItem = require('core/component/dragdrop/dragitem/dragitem'),
      ContentView = require('./view');

  return function (_DragItem) {
    _inherits(FieldWrap, _DragItem);

    function FieldWrap() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, FieldWrap);

      settings.modelData = settings.modelData || {};
      settings.modelData.contents = new ContentView({
        field: settings.modelData.field,
        classes: settings.modelData.classes
      });
      settings.modelData.id = settings.modelData.id || settings.modelData.field.id();
      return _possibleConstructorReturn(this, Object.getPrototypeOf(FieldWrap).call(this, settings));
    }

    _createClass(FieldWrap, [{
      key: 'id',
      value: function id() {
        this._model.get('field').id();
      }
    }, {
      key: 'lock',
      value: function lock() {
        this._model.get('contents').lock();
      }
    }, {
      key: 'unlock',
      value: function unlock() {
        this._model.get('contents').unlock();
      }
    }, {
      key: 'fieldView',
      value: function fieldView() {
        this._model.get('contents').subview;
      }
    }, {
      key: 'hideRemoveButton',
      value: function hideRemoveButton() {
        this._model.get('contents').hideRemoveButton();
      }
    }, {
      key: 'showRemoveButton',
      value: function showRemoveButton() {
        this._model.get('contents').showRemoveButton();
      }
    }]);

    return FieldWrap;
  }(DragItem);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL2ZpZWxkd3JhcC9maWVsZHdyYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxXQUFXLFFBQVEsMkNBQVIsQ0FBakI7QUFBQSxNQUNFLGNBQWMsUUFBUSxRQUFSLENBRGhCOztBQUlBO0FBQUE7O0FBQ0UseUJBQTJCO0FBQUEsVUFBZixRQUFlLHlEQUFKLEVBQUk7O0FBQUE7O0FBQ3pCLGVBQVMsU0FBVCxHQUFxQixTQUFTLFNBQVQsSUFBc0IsRUFBM0M7QUFDQSxlQUFTLFNBQVQsQ0FBbUIsUUFBbkIsR0FBOEIsSUFBSSxXQUFKLENBQWdCO0FBQzVDLGVBQU8sU0FBUyxTQUFULENBQW1CLEtBRGtCO0FBRTVDLGlCQUFTLFNBQVMsU0FBVCxDQUFtQjtBQUZnQixPQUFoQixDQUE5QjtBQUlBLGVBQVMsU0FBVCxDQUFtQixFQUFuQixHQUF3QixTQUFTLFNBQVQsQ0FBbUIsRUFBbkIsSUFBeUIsU0FBUyxTQUFULENBQW1CLEtBQW5CLENBQXlCLEVBQXpCLEVBQWpEO0FBTnlCLDBGQU9uQixRQVBtQjtBQVExQjs7QUFUSDtBQUFBO0FBQUEsMkJBV087QUFDSCxhQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLE9BQWhCLEVBQXlCLEVBQXpCO0FBQ0Q7QUFiSDtBQUFBO0FBQUEsNkJBZVM7QUFDTCxhQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFVBQWhCLEVBQTRCLElBQTVCO0FBQ0Q7QUFqQkg7QUFBQTtBQUFBLCtCQW1CVztBQUNQLGFBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEIsTUFBNUI7QUFDRDtBQXJCSDtBQUFBO0FBQUEsa0NBdUJjO0FBQ1YsYUFBSyxNQUFMLENBQVksR0FBWixDQUFnQixVQUFoQixFQUE0QixPQUE1QjtBQUNEO0FBekJIO0FBQUE7QUFBQSx5Q0EyQnFCO0FBQ2pCLGFBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEIsZ0JBQTVCO0FBQ0Q7QUE3Qkg7QUFBQTtBQUFBLHlDQStCcUI7QUFDakIsYUFBSyxNQUFMLENBQVksR0FBWixDQUFnQixVQUFoQixFQUE0QixnQkFBNUI7QUFDRDtBQWpDSDs7QUFBQTtBQUFBLElBQStCLFFBQS9CO0FBbUNELENBeENEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL2ZpZWxkd3JhcC9maWVsZHdyYXAuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
