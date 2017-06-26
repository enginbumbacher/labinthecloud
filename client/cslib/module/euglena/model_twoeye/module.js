'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var Module = require('core/app/module'),
      SymSliderField = require('core/component/symsliderfield/field'),
      SliderField = require('core/component/sliderfield/field'),
      TwoEyeView = require('./threeview');

  return function (_Module) {
    _inherits(TwoEyeModelModule, _Module);

    function TwoEyeModelModule() {
      _classCallCheck(this, TwoEyeModelModule);

      var _this = _possibleConstructorReturn(this, (TwoEyeModelModule.__proto__ || Object.getPrototypeOf(TwoEyeModelModule)).call(this));

      Utils.bindMethods(_this, ['_hookModelFields', '_hookModifyExport', '_hookModifyImport', '_hook3dView']);

      HM.hook('ModelForm.Fields', _this._hookModelFields);
      HM.hook('ModelForm.ModifyExport', _this._hookModifyExport);
      HM.hook('ModelForm.ModifyImport', _this._hookModifyImport);
      HM.hook('Euglena.3dView', _this._hook3dView);
      return _this;
    }

    _createClass(TwoEyeModelModule, [{
      key: '_hookModelFields',
      value: function _hookModelFields(fields, meta) {
        if (meta.type == "twoEye") {
          fields = fields.concat([SymSliderField.create({
            id: 'k',
            label: meta.config.K.label,
            min: meta.config.K.range[0],
            max: meta.config.K.range[1],
            steps: Math.round((meta.config.K.range[1] - meta.config.K.range[0]) / meta.config.K.resolution),
            defaultValue: meta.config.K.initialValue
          }), SymSliderField.create({
            id: 'v',
            label: meta.config.v.label,
            min: meta.config.v.range[0],
            max: meta.config.v.range[1],
            steps: Math.round((meta.config.v.range[1] - meta.config.v.range[0]) / meta.config.v.resolution),
            defaultValue: meta.config.v.initialValue
          }), SymSliderField.create({
            id: 'omega',
            label: meta.config.omega.label,
            min: meta.config.omega.range[0],
            max: meta.config.omega.range[1],
            steps: Math.round((meta.config.omega.range[1] - meta.config.omega.range[0]) / meta.config.omega.resolution),
            defaultValue: meta.config.omega.initialValue
          }), SliderField.create({
            id: 'randomness',
            label: meta.config.randomness.label,
            min: meta.config.randomness.range[0],
            max: meta.config.randomness.range[1],
            steps: Math.round((meta.config.randomness.range[1] - meta.config.randomness.range[0]) / meta.config.randomness.resolution),
            defaultValue: meta.config.randomness.initialValue
          })]);
        }
        return fields;
      }
    }, {
      key: '_hookModifyExport',
      value: function _hookModifyExport(exp, meta) {
        if (meta.type == "twoEye") {
          ['k', 'v', 'omega'].forEach(function (key) {
            exp[key + '_delta'] = exp[key].delta;
            exp[key] = exp[key].base;
          });
        }
        return exp;
      }
    }, {
      key: '_hookModifyImport',
      value: function _hookModifyImport(data, meta) {
        if (meta.type == "twoEye") {
          ['k', 'v', 'omega'].forEach(function (key) {
            data[key] = {
              base: data[key],
              delta: data[key + '_delta']
            };
            delete data[key + '_delta'];
          });
        }
        return data;
      }
    }, {
      key: '_hook3dView',
      value: function _hook3dView(view, meta) {
        if (meta.config.modelType == "twoEye") {
          return new TwoEyeView({ baseColor: meta.color }).view();
        }
        return view;
      }
    }]);

    return TwoEyeModelModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX3R3b2V5ZS9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkhNIiwiTW9kdWxlIiwiU3ltU2xpZGVyRmllbGQiLCJTbGlkZXJGaWVsZCIsIlR3b0V5ZVZpZXciLCJiaW5kTWV0aG9kcyIsImhvb2siLCJfaG9va01vZGVsRmllbGRzIiwiX2hvb2tNb2RpZnlFeHBvcnQiLCJfaG9va01vZGlmeUltcG9ydCIsIl9ob29rM2RWaWV3IiwiZmllbGRzIiwibWV0YSIsInR5cGUiLCJjb25jYXQiLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwiY29uZmlnIiwiSyIsIm1pbiIsInJhbmdlIiwibWF4Iiwic3RlcHMiLCJNYXRoIiwicm91bmQiLCJyZXNvbHV0aW9uIiwiZGVmYXVsdFZhbHVlIiwiaW5pdGlhbFZhbHVlIiwidiIsIm9tZWdhIiwicmFuZG9tbmVzcyIsImV4cCIsImZvckVhY2giLCJrZXkiLCJkZWx0YSIsImJhc2UiLCJkYXRhIiwidmlldyIsIm1vZGVsVHlwZSIsImJhc2VDb2xvciIsImNvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssaUJBQWlCTCxRQUFRLHFDQUFSLENBRG5CO0FBQUEsTUFFRU0sY0FBY04sUUFBUSxrQ0FBUixDQUZoQjtBQUFBLE1BR0VPLGFBQWFQLFFBQVEsYUFBUixDQUhmOztBQUtBO0FBQUE7O0FBQ0UsaUNBQWM7QUFBQTs7QUFBQTs7QUFFWkUsWUFBTU0sV0FBTixRQUF3QixDQUN0QixrQkFEc0IsRUFDRixtQkFERSxFQUNtQixtQkFEbkIsRUFDd0MsYUFEeEMsQ0FBeEI7O0FBSUFMLFNBQUdNLElBQUgsQ0FBUSxrQkFBUixFQUE0QixNQUFLQyxnQkFBakM7QUFDQVAsU0FBR00sSUFBSCxDQUFRLHdCQUFSLEVBQWtDLE1BQUtFLGlCQUF2QztBQUNBUixTQUFHTSxJQUFILENBQVEsd0JBQVIsRUFBa0MsTUFBS0csaUJBQXZDO0FBQ0FULFNBQUdNLElBQUgsQ0FBUSxnQkFBUixFQUEwQixNQUFLSSxXQUEvQjtBQVRZO0FBVWI7O0FBWEg7QUFBQTtBQUFBLHVDQWFtQkMsTUFibkIsRUFhMkJDLElBYjNCLEVBYWlDO0FBQzdCLFlBQUlBLEtBQUtDLElBQUwsSUFBYSxRQUFqQixFQUEyQjtBQUN6QkYsbUJBQVNBLE9BQU9HLE1BQVAsQ0FBYyxDQUFDWixlQUFlYSxNQUFmLENBQXNCO0FBQzVDQyxnQkFBSSxHQUR3QztBQUU1Q0MsbUJBQU9MLEtBQUtNLE1BQUwsQ0FBWUMsQ0FBWixDQUFjRixLQUZ1QjtBQUc1Q0csaUJBQUtSLEtBQUtNLE1BQUwsQ0FBWUMsQ0FBWixDQUFjRSxLQUFkLENBQW9CLENBQXBCLENBSHVDO0FBSTVDQyxpQkFBS1YsS0FBS00sTUFBTCxDQUFZQyxDQUFaLENBQWNFLEtBQWQsQ0FBb0IsQ0FBcEIsQ0FKdUM7QUFLNUNFLG1CQUFPQyxLQUFLQyxLQUFMLENBQVcsQ0FBQ2IsS0FBS00sTUFBTCxDQUFZQyxDQUFaLENBQWNFLEtBQWQsQ0FBb0IsQ0FBcEIsSUFBeUJULEtBQUtNLE1BQUwsQ0FBWUMsQ0FBWixDQUFjRSxLQUFkLENBQW9CLENBQXBCLENBQTFCLElBQW9EVCxLQUFLTSxNQUFMLENBQVlDLENBQVosQ0FBY08sVUFBN0UsQ0FMcUM7QUFNNUNDLDBCQUFjZixLQUFLTSxNQUFMLENBQVlDLENBQVosQ0FBY1M7QUFOZ0IsV0FBdEIsQ0FBRCxFQU9uQjFCLGVBQWVhLE1BQWYsQ0FBc0I7QUFDeEJDLGdCQUFJLEdBRG9CO0FBRXhCQyxtQkFBT0wsS0FBS00sTUFBTCxDQUFZVyxDQUFaLENBQWNaLEtBRkc7QUFHeEJHLGlCQUFLUixLQUFLTSxNQUFMLENBQVlXLENBQVosQ0FBY1IsS0FBZCxDQUFvQixDQUFwQixDQUhtQjtBQUl4QkMsaUJBQUtWLEtBQUtNLE1BQUwsQ0FBWVcsQ0FBWixDQUFjUixLQUFkLENBQW9CLENBQXBCLENBSm1CO0FBS3hCRSxtQkFBT0MsS0FBS0MsS0FBTCxDQUFXLENBQUNiLEtBQUtNLE1BQUwsQ0FBWVcsQ0FBWixDQUFjUixLQUFkLENBQW9CLENBQXBCLElBQXlCVCxLQUFLTSxNQUFMLENBQVlXLENBQVosQ0FBY1IsS0FBZCxDQUFvQixDQUFwQixDQUExQixJQUFvRFQsS0FBS00sTUFBTCxDQUFZVyxDQUFaLENBQWNILFVBQTdFLENBTGlCO0FBTXhCQywwQkFBY2YsS0FBS00sTUFBTCxDQUFZVyxDQUFaLENBQWNEO0FBTkosV0FBdEIsQ0FQbUIsRUFjbkIxQixlQUFlYSxNQUFmLENBQXNCO0FBQ3hCQyxnQkFBSSxPQURvQjtBQUV4QkMsbUJBQU9MLEtBQUtNLE1BQUwsQ0FBWVksS0FBWixDQUFrQmIsS0FGRDtBQUd4QkcsaUJBQUtSLEtBQUtNLE1BQUwsQ0FBWVksS0FBWixDQUFrQlQsS0FBbEIsQ0FBd0IsQ0FBeEIsQ0FIbUI7QUFJeEJDLGlCQUFLVixLQUFLTSxNQUFMLENBQVlZLEtBQVosQ0FBa0JULEtBQWxCLENBQXdCLENBQXhCLENBSm1CO0FBS3hCRSxtQkFBT0MsS0FBS0MsS0FBTCxDQUFXLENBQUNiLEtBQUtNLE1BQUwsQ0FBWVksS0FBWixDQUFrQlQsS0FBbEIsQ0FBd0IsQ0FBeEIsSUFBNkJULEtBQUtNLE1BQUwsQ0FBWVksS0FBWixDQUFrQlQsS0FBbEIsQ0FBd0IsQ0FBeEIsQ0FBOUIsSUFBNERULEtBQUtNLE1BQUwsQ0FBWVksS0FBWixDQUFrQkosVUFBekYsQ0FMaUI7QUFNeEJDLDBCQUFjZixLQUFLTSxNQUFMLENBQVlZLEtBQVosQ0FBa0JGO0FBTlIsV0FBdEIsQ0FkbUIsRUFxQm5CekIsWUFBWVksTUFBWixDQUFtQjtBQUNyQkMsZ0JBQUksWUFEaUI7QUFFckJDLG1CQUFPTCxLQUFLTSxNQUFMLENBQVlhLFVBQVosQ0FBdUJkLEtBRlQ7QUFHckJHLGlCQUFLUixLQUFLTSxNQUFMLENBQVlhLFVBQVosQ0FBdUJWLEtBQXZCLENBQTZCLENBQTdCLENBSGdCO0FBSXJCQyxpQkFBS1YsS0FBS00sTUFBTCxDQUFZYSxVQUFaLENBQXVCVixLQUF2QixDQUE2QixDQUE3QixDQUpnQjtBQUtyQkUsbUJBQU9DLEtBQUtDLEtBQUwsQ0FBVyxDQUFDYixLQUFLTSxNQUFMLENBQVlhLFVBQVosQ0FBdUJWLEtBQXZCLENBQTZCLENBQTdCLElBQWtDVCxLQUFLTSxNQUFMLENBQVlhLFVBQVosQ0FBdUJWLEtBQXZCLENBQTZCLENBQTdCLENBQW5DLElBQXNFVCxLQUFLTSxNQUFMLENBQVlhLFVBQVosQ0FBdUJMLFVBQXhHLENBTGM7QUFNckJDLDBCQUFjZixLQUFLTSxNQUFMLENBQVlhLFVBQVosQ0FBdUJIO0FBTmhCLFdBQW5CLENBckJtQixDQUFkLENBQVQ7QUE2QkQ7QUFDRCxlQUFPakIsTUFBUDtBQUNEO0FBOUNIO0FBQUE7QUFBQSx3Q0FnRG9CcUIsR0FoRHBCLEVBZ0R5QnBCLElBaER6QixFQWdEK0I7QUFDM0IsWUFBSUEsS0FBS0MsSUFBTCxJQUFhLFFBQWpCLEVBQTJCO0FBQ3pCLFdBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxPQUFYLEVBQW9Cb0IsT0FBcEIsQ0FBNEIsVUFBQ0MsR0FBRCxFQUFTO0FBQ25DRixnQkFBT0UsR0FBUCxlQUFzQkYsSUFBSUUsR0FBSixFQUFTQyxLQUEvQjtBQUNBSCxnQkFBSUUsR0FBSixJQUFXRixJQUFJRSxHQUFKLEVBQVNFLElBQXBCO0FBQ0QsV0FIRDtBQUlEO0FBQ0QsZUFBT0osR0FBUDtBQUNEO0FBeERIO0FBQUE7QUFBQSx3Q0EwRG9CSyxJQTFEcEIsRUEwRDBCekIsSUExRDFCLEVBMERnQztBQUM1QixZQUFJQSxLQUFLQyxJQUFMLElBQWEsUUFBakIsRUFBMkI7QUFDekIsV0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLE9BQVgsRUFBb0JvQixPQUFwQixDQUE0QixVQUFDQyxHQUFELEVBQVM7QUFDbkNHLGlCQUFLSCxHQUFMLElBQVk7QUFDVkUsb0JBQU1DLEtBQUtILEdBQUwsQ0FESTtBQUVWQyxxQkFBT0UsS0FBUUgsR0FBUjtBQUZHLGFBQVo7QUFJQSxtQkFBT0csS0FBUUgsR0FBUixZQUFQO0FBQ0QsV0FORDtBQU9EO0FBQ0QsZUFBT0csSUFBUDtBQUNEO0FBckVIO0FBQUE7QUFBQSxrQ0F1RWNDLElBdkVkLEVBdUVvQjFCLElBdkVwQixFQXVFMEI7QUFDdEIsWUFBSUEsS0FBS00sTUFBTCxDQUFZcUIsU0FBWixJQUF5QixRQUE3QixFQUF1QztBQUNyQyxpQkFBUSxJQUFJbkMsVUFBSixDQUFlLEVBQUVvQyxXQUFXNUIsS0FBSzZCLEtBQWxCLEVBQWYsQ0FBRCxDQUE0Q0gsSUFBNUMsRUFBUDtBQUNEO0FBQ0QsZUFBT0EsSUFBUDtBQUNEO0FBNUVIOztBQUFBO0FBQUEsSUFBdUNyQyxNQUF2QztBQThFRCxDQXhGRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF90d29leWUvbW9kdWxlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
