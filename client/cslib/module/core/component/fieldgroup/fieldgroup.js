'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Field = require('core/component/form/field/field'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');
  // # FieldGroup
  //
  // A field that encapsulates multiple subfields of varying types.
  return function (_Field) {
    _inherits(FieldGroup, _Field);

    function FieldGroup() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, FieldGroup);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FieldGroup).call(this, settings));

      Utils.bindMethods(_this, ['_onSubFieldChange']);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this._model.get('fields')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var field = _step.value;

          field.addEventListener('Field.Change', _this._onSubFieldChange);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return _this;
    }

    _createClass(FieldGroup, [{
      key: '_onSubFieldChange',
      value: function _onSubFieldChange(evt) {
        this.dispatchEvent('Field.Change', {
          value: this.value()
        });
      }
    }, {
      key: 'getSubField',
      value: function getSubField(id) {
        this._model.getSubField(id);
      }
    }, {
      key: 'addField',
      value: function addField(field) {
        this._model.addField(field);
        field.addEventListener('Field.Change', this._onSubFieldChange);
      }
    }, {
      key: 'removeField',
      value: function removeField(id) {
        if (this.getSubField(id)) {
          this.getSubField(id).removeEventListener('Field.Change', this._onSubFieldChange);
        }
        this._model.removeField(id);
      }
    }]);

    return FieldGroup;
  }(Field);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9maWVsZGdyb3VwL2ZpZWxkZ3JvdXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxRQUFRLFFBQVEsaUNBQVIsQ0FBZDtBQUFBLE1BQ0UsUUFBUSxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUUsT0FBTyxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0UsUUFBUSxRQUFRLGlCQUFSLENBSFY7Ozs7QUFRQTtBQUFBOztBQUNFLDBCQUEyQjtBQUFBLFVBQWYsUUFBZSx5REFBSixFQUFJOztBQUFBOztBQUN6QixlQUFTLFVBQVQsR0FBc0IsU0FBUyxVQUFULElBQXVCLEtBQTdDO0FBQ0EsZUFBUyxTQUFULEdBQXFCLFNBQVMsU0FBVCxJQUFzQixJQUEzQzs7QUFGeUIsZ0dBR25CLFFBSG1COztBQUl6QixZQUFNLFdBQU4sUUFBd0IsQ0FBQyxtQkFBRCxDQUF4Qjs7QUFKeUI7QUFBQTtBQUFBOztBQUFBO0FBTXpCLDZCQUFrQixNQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFFBQWhCLENBQWxCLDhIQUE2QztBQUFBLGNBQXBDLEtBQW9DOztBQUMzQyxnQkFBTSxnQkFBTixDQUF1QixjQUF2QixFQUF1QyxNQUFLLGlCQUE1QztBQUNEO0FBUndCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFTMUI7O0FBVkg7QUFBQTtBQUFBLHdDQVlvQixHQVpwQixFQVl5QjtBQUNyQixhQUFLLGFBQUwsQ0FBbUIsY0FBbkIsRUFBbUM7QUFDakMsaUJBQU8sS0FBSyxLQUFMO0FBRDBCLFNBQW5DO0FBR0Q7QUFoQkg7QUFBQTtBQUFBLGtDQWtCYyxFQWxCZCxFQWtCa0I7QUFDZCxhQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLEVBQXhCO0FBQ0Q7QUFwQkg7QUFBQTtBQUFBLCtCQXNCVyxLQXRCWCxFQXNCa0I7QUFDZCxhQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLEtBQXJCO0FBQ0EsY0FBTSxnQkFBTixDQUF1QixjQUF2QixFQUF1QyxLQUFLLGlCQUE1QztBQUNEO0FBekJIO0FBQUE7QUFBQSxrQ0EyQmMsRUEzQmQsRUEyQmtCO0FBQ2QsWUFBSSxLQUFLLFdBQUwsQ0FBaUIsRUFBakIsQ0FBSixFQUEwQjtBQUN4QixlQUFLLFdBQUwsQ0FBaUIsRUFBakIsRUFBcUIsbUJBQXJCLENBQXlDLGNBQXpDLEVBQXlELEtBQUssaUJBQTlEO0FBQ0Q7QUFDRCxhQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLEVBQXhCO0FBQ0Q7QUFoQ0g7O0FBQUE7QUFBQSxJQUFnQyxLQUFoQztBQWtDRCxDQTNDRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZmllbGRncm91cC9maWVsZGdyb3VwLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
