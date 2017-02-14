'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseField = require('core/component/form/field/field'),
      View = require('./view'),
      Model = require('./model');

  var ButtonField = function (_BaseField) {
    _inherits(ButtonField, _BaseField);

    function ButtonField(settings) {
      _classCallCheck(this, ButtonField);

      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(ButtonField).call(this, settings));
    }

    _createClass(ButtonField, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'trigger',
      value: function trigger() {
        this._view._onClick(null);
      }
    }, {
      key: 'setLabel',
      value: function setLabel(label) {
        this._model.set('label', label);
      }
    }]);

    return ButtonField;
  }(BaseField);

  ButtonField.create = function (data) {
    return new ButtonField({ modelData: data });
  };

  return ButtonField;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9idXR0b24vZmllbGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxZQUFZLFFBQVEsaUNBQVIsQ0FBbEI7QUFBQSxNQUNFLE9BQU8sUUFBUSxRQUFSLENBRFQ7QUFBQSxNQUVFLFFBQVEsUUFBUSxTQUFSLENBRlY7O0FBRGtCLE1BS1osV0FMWTtBQUFBOztBQU1oQix5QkFBWSxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCLGVBQVMsU0FBVCxHQUFxQixTQUFTLFNBQVQsSUFBc0IsSUFBM0M7QUFDQSxlQUFTLFVBQVQsR0FBc0IsU0FBUyxVQUFULElBQXVCLEtBQTdDO0FBRm9CLDRGQUdkLFFBSGM7QUFJckI7O0FBVmU7QUFBQTtBQUFBLDJCQVlYO0FBQ0gsZUFBTyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQWRlO0FBQUE7QUFBQSxnQ0FnQk47QUFDUixhQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLElBQXBCO0FBQ0Q7QUFsQmU7QUFBQTtBQUFBLCtCQW9CUCxLQXBCTyxFQW9CQTtBQUNkLGFBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUIsS0FBekI7QUFDRDtBQXRCZTs7QUFBQTtBQUFBLElBS1EsU0FMUjs7QUF5QmxCLGNBQVksTUFBWixHQUFxQixVQUFDLElBQUQsRUFBVTtBQUM3QixXQUFPLElBQUksV0FBSixDQUFnQixFQUFFLFdBQVcsSUFBYixFQUFoQixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPLFdBQVA7QUFDRCxDQTlCRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
