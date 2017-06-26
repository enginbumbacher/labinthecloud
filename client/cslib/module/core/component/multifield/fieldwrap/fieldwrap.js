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
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, FieldWrap);

      settings.modelData = settings.modelData || {};
      settings.modelData.contents = new ContentView({
        field: settings.modelData.field,
        classes: settings.modelData.classes
      });
      settings.modelData.id = settings.modelData.id || settings.modelData.field.id();
      return _possibleConstructorReturn(this, (FieldWrap.__proto__ || Object.getPrototypeOf(FieldWrap)).call(this, settings));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL2ZpZWxkd3JhcC9maWVsZHdyYXAuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRyYWdJdGVtIiwiQ29udGVudFZpZXciLCJzZXR0aW5ncyIsIm1vZGVsRGF0YSIsImNvbnRlbnRzIiwiZmllbGQiLCJjbGFzc2VzIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJsb2NrIiwidW5sb2NrIiwic3VidmlldyIsImhpZGVSZW1vdmVCdXR0b24iLCJzaG93UmVtb3ZlQnV0dG9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFdBQVdELFFBQVEsMkNBQVIsQ0FBakI7QUFBQSxNQUNFRSxjQUFjRixRQUFRLFFBQVIsQ0FEaEI7O0FBSUE7QUFBQTs7QUFDRSx5QkFBMkI7QUFBQSxVQUFmRyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxTQUFULEdBQXFCRCxTQUFTQyxTQUFULElBQXNCLEVBQTNDO0FBQ0FELGVBQVNDLFNBQVQsQ0FBbUJDLFFBQW5CLEdBQThCLElBQUlILFdBQUosQ0FBZ0I7QUFDNUNJLGVBQU9ILFNBQVNDLFNBQVQsQ0FBbUJFLEtBRGtCO0FBRTVDQyxpQkFBU0osU0FBU0MsU0FBVCxDQUFtQkc7QUFGZ0IsT0FBaEIsQ0FBOUI7QUFJQUosZUFBU0MsU0FBVCxDQUFtQkksRUFBbkIsR0FBd0JMLFNBQVNDLFNBQVQsQ0FBbUJJLEVBQW5CLElBQXlCTCxTQUFTQyxTQUFULENBQW1CRSxLQUFuQixDQUF5QkUsRUFBekIsRUFBakQ7QUFOeUIsbUhBT25CTCxRQVBtQjtBQVExQjs7QUFUSDtBQUFBO0FBQUEsMkJBV087QUFDSCxhQUFLTSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUJGLEVBQXpCO0FBQ0Q7QUFiSDtBQUFBO0FBQUEsNkJBZVM7QUFDTCxhQUFLQyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEJDLElBQTVCO0FBQ0Q7QUFqQkg7QUFBQTtBQUFBLCtCQW1CVztBQUNQLGFBQUtGLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixVQUFoQixFQUE0QkUsTUFBNUI7QUFDRDtBQXJCSDtBQUFBO0FBQUEsa0NBdUJjO0FBQ1YsYUFBS0gsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFVBQWhCLEVBQTRCRyxPQUE1QjtBQUNEO0FBekJIO0FBQUE7QUFBQSx5Q0EyQnFCO0FBQ2pCLGFBQUtKLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixVQUFoQixFQUE0QkksZ0JBQTVCO0FBQ0Q7QUE3Qkg7QUFBQTtBQUFBLHlDQStCcUI7QUFDakIsYUFBS0wsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFVBQWhCLEVBQTRCSyxnQkFBNUI7QUFDRDtBQWpDSDs7QUFBQTtBQUFBLElBQStCZCxRQUEvQjtBQW1DRCxDQXhDRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvbXVsdGlmaWVsZC9maWVsZHdyYXAvZmllbGR3cmFwLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
