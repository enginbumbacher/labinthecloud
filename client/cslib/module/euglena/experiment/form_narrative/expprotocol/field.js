'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var SelectField = require('core/component/selectfield/field'),
      View = require('./view'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals');

  var ExpProtocolField = function (_SelectField) {
    _inherits(ExpProtocolField, _SelectField);

    function ExpProtocolField(config) {
      _classCallCheck(this, ExpProtocolField);

      config.viewClass = config.viewClass || View;

      var _this = _possibleConstructorReturn(this, (ExpProtocolField.__proto__ || Object.getPrototypeOf(ExpProtocolField)).call(this, config));

      Utils.bindMethods(_this, ['_onModelChange', 'showDescription', 'setVisibility', 'isVisible']);
      return _this;
    }

    _createClass(ExpProtocolField, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(ExpProtocolField.prototype.__proto__ || Object.getPrototypeOf(ExpProtocolField.prototype), '_onModelChange', this).call(this, evt);
      }
    }, {
      key: 'showDescription',
      value: function showDescription(key) {
        if (key) {
          this.view()._showDescription(this._model._data.description[key]);
        } else {
          this.view()._showDescription(this._model._data.description);
        }
      }
    }, {
      key: 'setVisibility',
      value: function setVisibility(state) {
        var visibility = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.2;

        if (state == 'hidden') {
          this.view()._setVisibility(false, visibility);
        } else if (state == 'visible') {
          this.view()._setVisibility(true, visibility);
        }
      }
    }, {
      key: 'isVisible',
      value: function isVisible() {
        return this.view()._isVisible();
      }
    }]);

    return ExpProtocolField;
  }(SelectField);

  ExpProtocolField.create = function (data) {
    return new ExpProtocolField({
      modelData: data
    });
  };
  return ExpProtocolField;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZXhwcHJvdG9jb2wvZmllbGQuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlNlbGVjdEZpZWxkIiwiVmlldyIsIlV0aWxzIiwiR2xvYmFscyIsIkV4cFByb3RvY29sRmllbGQiLCJjb25maWciLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsImV2dCIsImtleSIsInZpZXciLCJfc2hvd0Rlc2NyaXB0aW9uIiwiX21vZGVsIiwiX2RhdGEiLCJkZXNjcmlwdGlvbiIsInN0YXRlIiwidmlzaWJpbGl0eSIsIl9zZXRWaXNpYmlsaXR5IiwiX2lzVmlzaWJsZSIsImNyZWF0ZSIsImRhdGEiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxjQUFjRCxRQUFRLGtDQUFSLENBQXBCO0FBQUEsTUFDRUUsT0FBT0YsUUFBUSxRQUFSLENBRFQ7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUdFSSxVQUFVSixRQUFRLG9CQUFSLENBSFo7O0FBRGtCLE1BT1pLLGdCQVBZO0FBQUE7O0FBUWhCLDhCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCQSxhQUFPQyxTQUFQLEdBQW1CRCxPQUFPQyxTQUFQLElBQW9CTCxJQUF2Qzs7QUFEa0Isc0lBRVpJLE1BRlk7O0FBR2xCSCxZQUFNSyxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBa0IsaUJBQWxCLEVBQXFDLGVBQXJDLEVBQXFELFdBQXJELENBQXhCO0FBSGtCO0FBSW5COztBQVplO0FBQUE7QUFBQSxxQ0FjREMsR0FkQyxFQWNJO0FBQ2xCLDJJQUFxQkEsR0FBckI7QUFDRDtBQWhCZTtBQUFBO0FBQUEsc0NBa0JBQyxHQWxCQSxFQWtCSztBQUNuQixZQUFJQSxHQUFKLEVBQVM7QUFDUCxlQUFLQyxJQUFMLEdBQVlDLGdCQUFaLENBQTZCLEtBQUtDLE1BQUwsQ0FBWUMsS0FBWixDQUFrQkMsV0FBbEIsQ0FBOEJMLEdBQTlCLENBQTdCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBS0MsSUFBTCxHQUFZQyxnQkFBWixDQUE2QixLQUFLQyxNQUFMLENBQVlDLEtBQVosQ0FBa0JDLFdBQS9DO0FBQ0Q7QUFDRjtBQXhCZTtBQUFBO0FBQUEsb0NBMEJGQyxLQTFCRSxFQTBCb0I7QUFBQSxZQUFoQkMsVUFBZ0IsdUVBQUwsR0FBSzs7QUFDbEMsWUFBSUQsU0FBUyxRQUFiLEVBQXVCO0FBQ3JCLGVBQUtMLElBQUwsR0FBWU8sY0FBWixDQUEyQixLQUEzQixFQUFpQ0QsVUFBakM7QUFDRCxTQUZELE1BRU8sSUFBSUQsU0FBUyxTQUFiLEVBQXdCO0FBQzdCLGVBQUtMLElBQUwsR0FBWU8sY0FBWixDQUEyQixJQUEzQixFQUFnQ0QsVUFBaEM7QUFDRDtBQUNGO0FBaENlO0FBQUE7QUFBQSxrQ0FrQ0o7QUFDVixlQUFPLEtBQUtOLElBQUwsR0FBWVEsVUFBWixFQUFQO0FBQ0Q7QUFwQ2U7O0FBQUE7QUFBQSxJQU9hbEIsV0FQYjs7QUF1Q25CSSxtQkFBaUJlLE1BQWpCLEdBQTBCLFVBQUNDLElBQUQsRUFBVTtBQUNqQyxXQUFPLElBQUloQixnQkFBSixDQUFxQjtBQUMxQmlCLGlCQUFXRDtBQURlLEtBQXJCLENBQVA7QUFHRCxHQUpGO0FBS0MsU0FBT2hCLGdCQUFQO0FBQ0QsQ0E3Q0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtX25hcnJhdGl2ZS9leHBwcm90b2NvbC9maWVsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpXG4gIDtcblxuICBjbGFzcyBFeHBQcm90b2NvbEZpZWxkIGV4dGVuZHMgU2VsZWN0RmllbGQge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgY29uZmlnLnZpZXdDbGFzcyA9IGNvbmZpZy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbk1vZGVsQ2hhbmdlJywnc2hvd0Rlc2NyaXB0aW9uJywgJ3NldFZpc2liaWxpdHknLCdpc1Zpc2libGUnXSk7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzdXBlci5fb25Nb2RlbENoYW5nZShldnQpO1xuICAgIH1cblxuICAgIHNob3dEZXNjcmlwdGlvbihrZXkpIHtcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgdGhpcy52aWV3KCkuX3Nob3dEZXNjcmlwdGlvbih0aGlzLl9tb2RlbC5fZGF0YS5kZXNjcmlwdGlvbltrZXldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldygpLl9zaG93RGVzY3JpcHRpb24odGhpcy5fbW9kZWwuX2RhdGEuZGVzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldFZpc2liaWxpdHkoc3RhdGUsdmlzaWJpbGl0eT0wLjIpIHtcbiAgICAgIGlmIChzdGF0ZSA9PSAnaGlkZGVuJykge1xuICAgICAgICB0aGlzLnZpZXcoKS5fc2V0VmlzaWJpbGl0eShmYWxzZSx2aXNpYmlsaXR5KTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT0gJ3Zpc2libGUnKSB7XG4gICAgICAgIHRoaXMudmlldygpLl9zZXRWaXNpYmlsaXR5KHRydWUsdmlzaWJpbGl0eSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaXNWaXNpYmxlKCkge1xuICAgICAgcmV0dXJuIHRoaXMudmlldygpLl9pc1Zpc2libGUoKTtcbiAgICB9XG4gIH1cblxuIEV4cFByb3RvY29sRmllbGQuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IEV4cFByb3RvY29sRmllbGQoe1xuICAgICAgbW9kZWxEYXRhOiBkYXRhXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIEV4cFByb3RvY29sRmllbGQ7XG59KVxuIl19
