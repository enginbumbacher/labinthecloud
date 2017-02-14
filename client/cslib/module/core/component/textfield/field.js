'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseField = require('core/component/form/field/field'),
      Model = require('./model'),
      View = require('./view');

  var TextField = function (_BaseField) {
    _inherits(TextField, _BaseField);

    function TextField() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, TextField);

      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(TextField).call(this, settings));
    }

    return TextField;
  }(BaseField);

  TextField.create = function (data) {
    return new TextField({ modelData: data });
  };

  return TextField;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90ZXh0ZmllbGQvZmllbGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sWUFBWSxRQUFRLGlDQUFSLENBQWxCO0FBQUEsTUFDRSxRQUFRLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRSxPQUFPLFFBQVEsUUFBUixDQUZUOztBQURrQixNQUtaLFNBTFk7QUFBQTs7QUFNaEIseUJBQTJCO0FBQUEsVUFBZixRQUFlLHlEQUFKLEVBQUk7O0FBQUE7O0FBQ3pCLGVBQVMsU0FBVCxHQUFxQixTQUFTLFNBQVQsSUFBc0IsSUFBM0M7QUFDQSxlQUFTLFVBQVQsR0FBc0IsU0FBUyxVQUFULElBQXVCLEtBQTdDO0FBRnlCLDBGQUduQixRQUhtQjtBQUkxQjs7QUFWZTtBQUFBLElBS00sU0FMTjs7QUFhbEIsWUFBVSxNQUFWLEdBQW1CLFVBQUMsSUFBRCxFQUFVO0FBQzNCLFdBQU8sSUFBSSxTQUFKLENBQWMsRUFBRSxXQUFXLElBQWIsRUFBZCxDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPLFNBQVA7QUFDRCxDQWxCRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvdGV4dGZpZWxkL2ZpZWxkLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
