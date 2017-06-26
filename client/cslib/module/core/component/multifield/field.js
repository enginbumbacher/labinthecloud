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

  return function (_Field) {
    _inherits(MultiField, _Field);

    function MultiField() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, MultiField);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (MultiField.__proto__ || Object.getPrototypeOf(MultiField)).call(this, settings));

      Utils.bindMethods(_this, ['_onAddRequest', '_onRemoveRequest', '_onOrderChange', '_onModelChange']);

      _this.view().addEventListener('MultiField.AddFieldRequest', _this._onAddRequest);
      _this.view().addEventListener('MultiField.RemoveFieldRequest', _this._onRemoveRequest);
      _this.view().addEventListener('MultiField.OrderChangeRequest', _this._onOrderChange);
      _this._model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(MultiField, [{
      key: '_onAddRequest',
      value: function _onAddRequest(evt) {
        evt.stopPropagation();
        this._model.createField();
      }
    }, {
      key: '_onRemoveRequest',
      value: function _onRemoveRequest(evt) {
        evt.stopPropagation();
        this._model.removeField(evt.data.id);
      }
    }, {
      key: '_onOrderChange',
      value: function _onOrderChange(evt) {
        evt.stopPropagation();
        this._model.updateOrder(evt.data.order);
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == "value") {
          this.dispatchEvent('Field.Change', {
            value: this.value()
          });
        }
      }
    }, {
      key: 'setChildMeta',
      value: function setChildMeta(cls, init) {
        this._model.setChildMeta(cls, init);
      }
    }, {
      key: 'lockField',
      value: function lockField(ind) {
        this._model.lockField(ind);
      }
    }, {
      key: 'unlockField',
      value: function unlockField(ind) {
        this._model.unlockField(ind);
      }
    }, {
      key: 'getFields',
      value: function getFields() {
        this._model.get('fields');
      }
    }, {
      key: 'setValue',
      value: function setValue(val) {
        var _this2 = this;

        this._model.setValue(val).then(function () {
          _this2.dispatchEvent('Field.Change', {
            value: _this2.value()
          });
        });
      }
    }]);

    return MultiField;
  }(Field);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL2ZpZWxkLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJGaWVsZCIsIk1vZGVsIiwiVmlldyIsIlV0aWxzIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJ2aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkFkZFJlcXVlc3QiLCJfb25SZW1vdmVSZXF1ZXN0IiwiX29uT3JkZXJDaGFuZ2UiLCJfbW9kZWwiLCJfb25Nb2RlbENoYW5nZSIsImV2dCIsInN0b3BQcm9wYWdhdGlvbiIsImNyZWF0ZUZpZWxkIiwicmVtb3ZlRmllbGQiLCJkYXRhIiwiaWQiLCJ1cGRhdGVPcmRlciIsIm9yZGVyIiwicGF0aCIsImRpc3BhdGNoRXZlbnQiLCJ2YWx1ZSIsImNscyIsImluaXQiLCJzZXRDaGlsZE1ldGEiLCJpbmQiLCJsb2NrRmllbGQiLCJ1bmxvY2tGaWVsZCIsImdldCIsInZhbCIsInNldFZhbHVlIiwidGhlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlDQUFSLENBQWQ7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWOztBQU1BO0FBQUE7O0FBQ0UsMEJBQTJCO0FBQUEsVUFBZkssUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QkosS0FBN0M7QUFDQUcsZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQkosSUFBM0M7O0FBRnlCLDBIQUduQkUsUUFIbUI7O0FBSXpCRCxZQUFNSSxXQUFOLFFBQXdCLENBQUMsZUFBRCxFQUFrQixrQkFBbEIsRUFBc0MsZ0JBQXRDLEVBQXdELGdCQUF4RCxDQUF4Qjs7QUFFQSxZQUFLQyxJQUFMLEdBQVlDLGdCQUFaLENBQTZCLDRCQUE3QixFQUEyRCxNQUFLQyxhQUFoRTtBQUNBLFlBQUtGLElBQUwsR0FBWUMsZ0JBQVosQ0FBNkIsK0JBQTdCLEVBQThELE1BQUtFLGdCQUFuRTtBQUNBLFlBQUtILElBQUwsR0FBWUMsZ0JBQVosQ0FBNkIsK0JBQTdCLEVBQThELE1BQUtHLGNBQW5FO0FBQ0EsWUFBS0MsTUFBTCxDQUFZSixnQkFBWixDQUE2QixjQUE3QixFQUE2QyxNQUFLSyxjQUFsRDtBQVR5QjtBQVUxQjs7QUFYSDtBQUFBO0FBQUEsb0NBYWdCQyxHQWJoQixFQWFxQjtBQUNqQkEsWUFBSUMsZUFBSjtBQUNBLGFBQUtILE1BQUwsQ0FBWUksV0FBWjtBQUNEO0FBaEJIO0FBQUE7QUFBQSx1Q0FrQm1CRixHQWxCbkIsRUFrQndCO0FBQ3BCQSxZQUFJQyxlQUFKO0FBQ0EsYUFBS0gsTUFBTCxDQUFZSyxXQUFaLENBQXdCSCxJQUFJSSxJQUFKLENBQVNDLEVBQWpDO0FBQ0Q7QUFyQkg7QUFBQTtBQUFBLHFDQXVCaUJMLEdBdkJqQixFQXVCc0I7QUFDbEJBLFlBQUlDLGVBQUo7QUFDQSxhQUFLSCxNQUFMLENBQVlRLFdBQVosQ0FBd0JOLElBQUlJLElBQUosQ0FBU0csS0FBakM7QUFDRDtBQTFCSDtBQUFBO0FBQUEscUNBNEJpQlAsR0E1QmpCLEVBNEJzQjtBQUNsQixZQUFJQSxJQUFJSSxJQUFKLENBQVNJLElBQVQsSUFBaUIsT0FBckIsRUFBOEI7QUFDNUIsZUFBS0MsYUFBTCxDQUFtQixjQUFuQixFQUFtQztBQUNqQ0MsbUJBQU8sS0FBS0EsS0FBTDtBQUQwQixXQUFuQztBQUdEO0FBQ0Y7QUFsQ0g7QUFBQTtBQUFBLG1DQW9DZUMsR0FwQ2YsRUFvQ29CQyxJQXBDcEIsRUFvQzBCO0FBQ3RCLGFBQUtkLE1BQUwsQ0FBWWUsWUFBWixDQUF5QkYsR0FBekIsRUFBOEJDLElBQTlCO0FBQ0Q7QUF0Q0g7QUFBQTtBQUFBLGdDQXdDWUUsR0F4Q1osRUF3Q2lCO0FBQ2IsYUFBS2hCLE1BQUwsQ0FBWWlCLFNBQVosQ0FBc0JELEdBQXRCO0FBQ0Q7QUExQ0g7QUFBQTtBQUFBLGtDQTRDY0EsR0E1Q2QsRUE0Q21CO0FBQ2YsYUFBS2hCLE1BQUwsQ0FBWWtCLFdBQVosQ0FBd0JGLEdBQXhCO0FBQ0Q7QUE5Q0g7QUFBQTtBQUFBLGtDQWdEYztBQUNWLGFBQUtoQixNQUFMLENBQVltQixHQUFaLENBQWdCLFFBQWhCO0FBQ0Q7QUFsREg7QUFBQTtBQUFBLCtCQW9EV0MsR0FwRFgsRUFvRGdCO0FBQUE7O0FBQ1osYUFBS3BCLE1BQUwsQ0FBWXFCLFFBQVosQ0FBcUJELEdBQXJCLEVBQTBCRSxJQUExQixDQUErQixZQUFNO0FBQ25DLGlCQUFLWCxhQUFMLENBQW1CLGNBQW5CLEVBQW1DO0FBQ2pDQyxtQkFBTyxPQUFLQSxLQUFMO0FBRDBCLFdBQW5DO0FBR0QsU0FKRDtBQUtEO0FBMURIOztBQUFBO0FBQUEsSUFBZ0N6QixLQUFoQztBQTRERCxDQW5FRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvbXVsdGlmaWVsZC9maWVsZC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
