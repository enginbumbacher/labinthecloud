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
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, FieldGroup);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (FieldGroup.__proto__ || Object.getPrototypeOf(FieldGroup)).call(this, settings));

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9maWVsZGdyb3VwL2ZpZWxkZ3JvdXAuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkZpZWxkIiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9tb2RlbCIsImdldCIsImZpZWxkIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblN1YkZpZWxkQ2hhbmdlIiwiZXZ0IiwiZGlzcGF0Y2hFdmVudCIsInZhbHVlIiwiaWQiLCJnZXRTdWJGaWVsZCIsImFkZEZpZWxkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInJlbW92ZUZpZWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUNBQVIsQ0FBZDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7QUFLRjtBQUNBO0FBQ0E7QUFDRTtBQUFBOztBQUNFLDBCQUEyQjtBQUFBLFVBQWZLLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJKLEtBQTdDO0FBQ0FHLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JKLElBQTNDOztBQUZ5QiwwSEFHbkJFLFFBSG1COztBQUl6QkQsWUFBTUksV0FBTixRQUF3QixDQUFDLG1CQUFELENBQXhCOztBQUp5QjtBQUFBO0FBQUE7O0FBQUE7QUFNekIsNkJBQWtCLE1BQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixRQUFoQixDQUFsQiw4SEFBNkM7QUFBQSxjQUFwQ0MsS0FBb0M7O0FBQzNDQSxnQkFBTUMsZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBS0MsaUJBQTVDO0FBQ0Q7QUFSd0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQVMxQjs7QUFWSDtBQUFBO0FBQUEsd0NBWW9CQyxHQVpwQixFQVl5QjtBQUNyQixhQUFLQyxhQUFMLENBQW1CLGNBQW5CLEVBQW1DO0FBQ2pDQyxpQkFBTyxLQUFLQSxLQUFMO0FBRDBCLFNBQW5DO0FBR0Q7QUFoQkg7QUFBQTtBQUFBLGtDQWtCY0MsRUFsQmQsRUFrQmtCO0FBQ2QsYUFBS1IsTUFBTCxDQUFZUyxXQUFaLENBQXdCRCxFQUF4QjtBQUNEO0FBcEJIO0FBQUE7QUFBQSwrQkFzQldOLEtBdEJYLEVBc0JrQjtBQUNkLGFBQUtGLE1BQUwsQ0FBWVUsUUFBWixDQUFxQlIsS0FBckI7QUFDQUEsY0FBTUMsZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsS0FBS0MsaUJBQTVDO0FBQ0Q7QUF6Qkg7QUFBQTtBQUFBLGtDQTJCY0ksRUEzQmQsRUEyQmtCO0FBQ2QsWUFBSSxLQUFLQyxXQUFMLENBQWlCRCxFQUFqQixDQUFKLEVBQTBCO0FBQ3hCLGVBQUtDLFdBQUwsQ0FBaUJELEVBQWpCLEVBQXFCRyxtQkFBckIsQ0FBeUMsY0FBekMsRUFBeUQsS0FBS1AsaUJBQTlEO0FBQ0Q7QUFDRCxhQUFLSixNQUFMLENBQVlZLFdBQVosQ0FBd0JKLEVBQXhCO0FBQ0Q7QUFoQ0g7O0FBQUE7QUFBQSxJQUFnQ2hCLEtBQWhDO0FBa0NELENBM0NEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9maWVsZGdyb3VwL2ZpZWxkZ3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL2ZpZWxkJyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJylcbiAgO1xuLy8gIyBGaWVsZEdyb3VwXG4vL1xuLy8gQSBmaWVsZCB0aGF0IGVuY2Fwc3VsYXRlcyBtdWx0aXBsZSBzdWJmaWVsZHMgb2YgdmFyeWluZyB0eXBlcy5cbiAgcmV0dXJuIGNsYXNzIEZpZWxkR3JvdXAgZXh0ZW5kcyBGaWVsZCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uU3ViRmllbGRDaGFuZ2UnXSk7XG5cbiAgICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuX21vZGVsLmdldCgnZmllbGRzJykpIHtcbiAgICAgICAgZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25TdWJGaWVsZENoYW5nZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uU3ViRmllbGRDaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLkNoYW5nZScsIHtcbiAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0U3ViRmllbGQoaWQpIHtcbiAgICAgIHRoaXMuX21vZGVsLmdldFN1YkZpZWxkKGlkKTtcbiAgICB9XG5cbiAgICBhZGRGaWVsZChmaWVsZCkge1xuICAgICAgdGhpcy5fbW9kZWwuYWRkRmllbGQoZmllbGQpO1xuICAgICAgZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25TdWJGaWVsZENoYW5nZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlRmllbGQoaWQpIHtcbiAgICAgIGlmICh0aGlzLmdldFN1YkZpZWxkKGlkKSkge1xuICAgICAgICB0aGlzLmdldFN1YkZpZWxkKGlkKS5yZW1vdmVFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vblN1YkZpZWxkQ2hhbmdlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX21vZGVsLnJlbW92ZUZpZWxkKGlkKTtcbiAgICB9XG4gIH1cbn0pOyJdfQ==
