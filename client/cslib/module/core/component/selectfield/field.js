'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseField = require('core/component/form/field/field'),
      Model = require('./model'),
      View = require('./view');

  var SelectField = function (_BaseField) {
    _inherits(SelectField, _BaseField);

    function SelectField() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, SelectField);

      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(SelectField).call(this, settings));
    }

    return SelectField;
  }(BaseField);

  SelectField.create = function (data) {
    return new SelectField({ modelData: data });
  };

  return SelectField;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxZQUFZLFFBQVEsaUNBQVIsQ0FBbEI7QUFBQSxNQUNFLFFBQVEsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFLE9BQU8sUUFBUSxRQUFSLENBRlQ7O0FBRGtCLE1BS1osV0FMWTtBQUFBOztBQU1oQiwyQkFBMkI7QUFBQSxVQUFmLFFBQWUseURBQUosRUFBSTs7QUFBQTs7QUFDekIsZUFBUyxTQUFULEdBQXFCLFNBQVMsU0FBVCxJQUFzQixJQUEzQztBQUNBLGVBQVMsVUFBVCxHQUFzQixTQUFTLFVBQVQsSUFBdUIsS0FBN0M7QUFGeUIsNEZBR25CLFFBSG1CO0FBSTFCOztBQVZlO0FBQUEsSUFLUSxTQUxSOztBQWFsQixjQUFZLE1BQVosR0FBcUIsVUFBQyxJQUFELEVBQVU7QUFDN0IsV0FBTyxJQUFJLFdBQUosQ0FBZ0IsRUFBRSxXQUFXLElBQWIsRUFBaEIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBTyxXQUFQO0FBQ0QsQ0FsQkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
