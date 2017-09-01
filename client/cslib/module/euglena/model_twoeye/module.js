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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX3R3b2V5ZS9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkhNIiwiTW9kdWxlIiwiU3ltU2xpZGVyRmllbGQiLCJTbGlkZXJGaWVsZCIsIlR3b0V5ZVZpZXciLCJiaW5kTWV0aG9kcyIsImhvb2siLCJfaG9va01vZGVsRmllbGRzIiwiX2hvb2tNb2RpZnlFeHBvcnQiLCJfaG9va01vZGlmeUltcG9ydCIsIl9ob29rM2RWaWV3IiwiZmllbGRzIiwibWV0YSIsInR5cGUiLCJjb25jYXQiLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwiY29uZmlnIiwiSyIsIm1pbiIsInJhbmdlIiwibWF4Iiwic3RlcHMiLCJNYXRoIiwicm91bmQiLCJyZXNvbHV0aW9uIiwiZGVmYXVsdFZhbHVlIiwiaW5pdGlhbFZhbHVlIiwidiIsIm9tZWdhIiwicmFuZG9tbmVzcyIsImV4cCIsImZvckVhY2giLCJrZXkiLCJkZWx0YSIsImJhc2UiLCJkYXRhIiwidmlldyIsIm1vZGVsVHlwZSIsImJhc2VDb2xvciIsImNvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssaUJBQWlCTCxRQUFRLHFDQUFSLENBRG5CO0FBQUEsTUFFRU0sY0FBY04sUUFBUSxrQ0FBUixDQUZoQjtBQUFBLE1BR0VPLGFBQWFQLFFBQVEsYUFBUixDQUhmOztBQUtBO0FBQUE7O0FBQ0UsaUNBQWM7QUFBQTs7QUFBQTs7QUFFWkUsWUFBTU0sV0FBTixRQUF3QixDQUN0QixrQkFEc0IsRUFDRixtQkFERSxFQUNtQixtQkFEbkIsRUFDd0MsYUFEeEMsQ0FBeEI7O0FBSUFMLFNBQUdNLElBQUgsQ0FBUSxrQkFBUixFQUE0QixNQUFLQyxnQkFBakM7QUFDQVAsU0FBR00sSUFBSCxDQUFRLHdCQUFSLEVBQWtDLE1BQUtFLGlCQUF2QztBQUNBUixTQUFHTSxJQUFILENBQVEsd0JBQVIsRUFBa0MsTUFBS0csaUJBQXZDO0FBQ0FULFNBQUdNLElBQUgsQ0FBUSxnQkFBUixFQUEwQixNQUFLSSxXQUEvQjtBQVRZO0FBVWI7O0FBWEg7QUFBQTtBQUFBLHVDQWFtQkMsTUFibkIsRUFhMkJDLElBYjNCLEVBYWlDO0FBQzdCLFlBQUlBLEtBQUtDLElBQUwsSUFBYSxRQUFqQixFQUEyQjtBQUN6QkYsbUJBQVNBLE9BQU9HLE1BQVAsQ0FBYyxDQUFDWixlQUFlYSxNQUFmLENBQXNCO0FBQzVDQyxnQkFBSSxHQUR3QztBQUU1Q0MsbUJBQU9MLEtBQUtNLE1BQUwsQ0FBWUMsQ0FBWixDQUFjRixLQUZ1QjtBQUc1Q0csaUJBQUtSLEtBQUtNLE1BQUwsQ0FBWUMsQ0FBWixDQUFjRSxLQUFkLENBQW9CLENBQXBCLENBSHVDO0FBSTVDQyxpQkFBS1YsS0FBS00sTUFBTCxDQUFZQyxDQUFaLENBQWNFLEtBQWQsQ0FBb0IsQ0FBcEIsQ0FKdUM7QUFLNUNFLG1CQUFPQyxLQUFLQyxLQUFMLENBQVcsQ0FBQ2IsS0FBS00sTUFBTCxDQUFZQyxDQUFaLENBQWNFLEtBQWQsQ0FBb0IsQ0FBcEIsSUFBeUJULEtBQUtNLE1BQUwsQ0FBWUMsQ0FBWixDQUFjRSxLQUFkLENBQW9CLENBQXBCLENBQTFCLElBQW9EVCxLQUFLTSxNQUFMLENBQVlDLENBQVosQ0FBY08sVUFBN0UsQ0FMcUM7QUFNNUNDLDBCQUFjZixLQUFLTSxNQUFMLENBQVlDLENBQVosQ0FBY1M7QUFOZ0IsV0FBdEIsQ0FBRCxFQU9uQjFCLGVBQWVhLE1BQWYsQ0FBc0I7QUFDeEJDLGdCQUFJLEdBRG9CO0FBRXhCQyxtQkFBT0wsS0FBS00sTUFBTCxDQUFZVyxDQUFaLENBQWNaLEtBRkc7QUFHeEJHLGlCQUFLUixLQUFLTSxNQUFMLENBQVlXLENBQVosQ0FBY1IsS0FBZCxDQUFvQixDQUFwQixDQUhtQjtBQUl4QkMsaUJBQUtWLEtBQUtNLE1BQUwsQ0FBWVcsQ0FBWixDQUFjUixLQUFkLENBQW9CLENBQXBCLENBSm1CO0FBS3hCRSxtQkFBT0MsS0FBS0MsS0FBTCxDQUFXLENBQUNiLEtBQUtNLE1BQUwsQ0FBWVcsQ0FBWixDQUFjUixLQUFkLENBQW9CLENBQXBCLElBQXlCVCxLQUFLTSxNQUFMLENBQVlXLENBQVosQ0FBY1IsS0FBZCxDQUFvQixDQUFwQixDQUExQixJQUFvRFQsS0FBS00sTUFBTCxDQUFZVyxDQUFaLENBQWNILFVBQTdFLENBTGlCO0FBTXhCQywwQkFBY2YsS0FBS00sTUFBTCxDQUFZVyxDQUFaLENBQWNEO0FBTkosV0FBdEIsQ0FQbUIsRUFjbkIxQixlQUFlYSxNQUFmLENBQXNCO0FBQ3hCQyxnQkFBSSxPQURvQjtBQUV4QkMsbUJBQU9MLEtBQUtNLE1BQUwsQ0FBWVksS0FBWixDQUFrQmIsS0FGRDtBQUd4QkcsaUJBQUtSLEtBQUtNLE1BQUwsQ0FBWVksS0FBWixDQUFrQlQsS0FBbEIsQ0FBd0IsQ0FBeEIsQ0FIbUI7QUFJeEJDLGlCQUFLVixLQUFLTSxNQUFMLENBQVlZLEtBQVosQ0FBa0JULEtBQWxCLENBQXdCLENBQXhCLENBSm1CO0FBS3hCRSxtQkFBT0MsS0FBS0MsS0FBTCxDQUFXLENBQUNiLEtBQUtNLE1BQUwsQ0FBWVksS0FBWixDQUFrQlQsS0FBbEIsQ0FBd0IsQ0FBeEIsSUFBNkJULEtBQUtNLE1BQUwsQ0FBWVksS0FBWixDQUFrQlQsS0FBbEIsQ0FBd0IsQ0FBeEIsQ0FBOUIsSUFBNERULEtBQUtNLE1BQUwsQ0FBWVksS0FBWixDQUFrQkosVUFBekYsQ0FMaUI7QUFNeEJDLDBCQUFjZixLQUFLTSxNQUFMLENBQVlZLEtBQVosQ0FBa0JGO0FBTlIsV0FBdEIsQ0FkbUIsRUFxQm5CekIsWUFBWVksTUFBWixDQUFtQjtBQUNyQkMsZ0JBQUksWUFEaUI7QUFFckJDLG1CQUFPTCxLQUFLTSxNQUFMLENBQVlhLFVBQVosQ0FBdUJkLEtBRlQ7QUFHckJHLGlCQUFLUixLQUFLTSxNQUFMLENBQVlhLFVBQVosQ0FBdUJWLEtBQXZCLENBQTZCLENBQTdCLENBSGdCO0FBSXJCQyxpQkFBS1YsS0FBS00sTUFBTCxDQUFZYSxVQUFaLENBQXVCVixLQUF2QixDQUE2QixDQUE3QixDQUpnQjtBQUtyQkUsbUJBQU9DLEtBQUtDLEtBQUwsQ0FBVyxDQUFDYixLQUFLTSxNQUFMLENBQVlhLFVBQVosQ0FBdUJWLEtBQXZCLENBQTZCLENBQTdCLElBQWtDVCxLQUFLTSxNQUFMLENBQVlhLFVBQVosQ0FBdUJWLEtBQXZCLENBQTZCLENBQTdCLENBQW5DLElBQXNFVCxLQUFLTSxNQUFMLENBQVlhLFVBQVosQ0FBdUJMLFVBQXhHLENBTGM7QUFNckJDLDBCQUFjZixLQUFLTSxNQUFMLENBQVlhLFVBQVosQ0FBdUJIO0FBTmhCLFdBQW5CLENBckJtQixDQUFkLENBQVQ7QUE2QkQ7QUFDRCxlQUFPakIsTUFBUDtBQUNEO0FBOUNIO0FBQUE7QUFBQSx3Q0FnRG9CcUIsR0FoRHBCLEVBZ0R5QnBCLElBaER6QixFQWdEK0I7QUFDM0IsWUFBSUEsS0FBS0MsSUFBTCxJQUFhLFFBQWpCLEVBQTJCO0FBQ3pCLFdBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxPQUFYLEVBQW9Cb0IsT0FBcEIsQ0FBNEIsVUFBQ0MsR0FBRCxFQUFTO0FBQ25DRixnQkFBT0UsR0FBUCxlQUFzQkYsSUFBSUUsR0FBSixFQUFTQyxLQUEvQjtBQUNBSCxnQkFBSUUsR0FBSixJQUFXRixJQUFJRSxHQUFKLEVBQVNFLElBQXBCO0FBQ0QsV0FIRDtBQUlEO0FBQ0QsZUFBT0osR0FBUDtBQUNEO0FBeERIO0FBQUE7QUFBQSx3Q0EwRG9CSyxJQTFEcEIsRUEwRDBCekIsSUExRDFCLEVBMERnQztBQUM1QixZQUFJQSxLQUFLQyxJQUFMLElBQWEsUUFBakIsRUFBMkI7QUFDekIsV0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLE9BQVgsRUFBb0JvQixPQUFwQixDQUE0QixVQUFDQyxHQUFELEVBQVM7QUFDbkNHLGlCQUFLSCxHQUFMLElBQVk7QUFDVkUsb0JBQU1DLEtBQUtILEdBQUwsQ0FESTtBQUVWQyxxQkFBT0UsS0FBUUgsR0FBUjtBQUZHLGFBQVo7QUFJQSxtQkFBT0csS0FBUUgsR0FBUixZQUFQO0FBQ0QsV0FORDtBQU9EO0FBQ0QsZUFBT0csSUFBUDtBQUNEO0FBckVIO0FBQUE7QUFBQSxrQ0F1RWNDLElBdkVkLEVBdUVvQjFCLElBdkVwQixFQXVFMEI7QUFDdEIsWUFBSUEsS0FBS00sTUFBTCxDQUFZcUIsU0FBWixJQUF5QixRQUE3QixFQUF1QztBQUNyQyxpQkFBUSxJQUFJbkMsVUFBSixDQUFlLEVBQUVvQyxXQUFXNUIsS0FBSzZCLEtBQWxCLEVBQWYsQ0FBRCxDQUE0Q0gsSUFBNUMsRUFBUDtBQUNEO0FBQ0QsZUFBT0EsSUFBUDtBQUNEO0FBNUVIOztBQUFBO0FBQUEsSUFBdUNyQyxNQUF2QztBQThFRCxDQXhGRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF90d29leWUvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBTeW1TbGlkZXJGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3N5bXNsaWRlcmZpZWxkL2ZpZWxkJyksXG4gICAgU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZCcpLFxuICAgIFR3b0V5ZVZpZXcgPSByZXF1aXJlKCcuL3RocmVldmlldycpO1xuXG4gIHJldHVybiBjbGFzcyBUd29FeWVNb2RlbE1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX2hvb2tNb2RlbEZpZWxkcycsICdfaG9va01vZGlmeUV4cG9ydCcsICdfaG9va01vZGlmeUltcG9ydCcsICdfaG9vazNkVmlldydcbiAgICAgIF0pO1xuXG4gICAgICBITS5ob29rKCdNb2RlbEZvcm0uRmllbGRzJywgdGhpcy5faG9va01vZGVsRmllbGRzKTtcbiAgICAgIEhNLmhvb2soJ01vZGVsRm9ybS5Nb2RpZnlFeHBvcnQnLCB0aGlzLl9ob29rTW9kaWZ5RXhwb3J0KTtcbiAgICAgIEhNLmhvb2soJ01vZGVsRm9ybS5Nb2RpZnlJbXBvcnQnLCB0aGlzLl9ob29rTW9kaWZ5SW1wb3J0KTtcbiAgICAgIEhNLmhvb2soJ0V1Z2xlbmEuM2RWaWV3JywgdGhpcy5faG9vazNkVmlldylcbiAgICB9XG5cbiAgICBfaG9va01vZGVsRmllbGRzKGZpZWxkcywgbWV0YSkge1xuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcInR3b0V5ZVwiKSB7XG4gICAgICAgIGZpZWxkcyA9IGZpZWxkcy5jb25jYXQoW1N5bVNsaWRlckZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICdrJyxcbiAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcuSy5sYWJlbCxcbiAgICAgICAgICBtaW46IG1ldGEuY29uZmlnLksucmFuZ2VbMF0sXG4gICAgICAgICAgbWF4OiBtZXRhLmNvbmZpZy5LLnJhbmdlWzFdLFxuICAgICAgICAgIHN0ZXBzOiBNYXRoLnJvdW5kKChtZXRhLmNvbmZpZy5LLnJhbmdlWzFdIC0gbWV0YS5jb25maWcuSy5yYW5nZVswXSkgLyBtZXRhLmNvbmZpZy5LLnJlc29sdXRpb24pLFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZTogbWV0YS5jb25maWcuSy5pbml0aWFsVmFsdWVcbiAgICAgICAgfSksIFN5bVNsaWRlckZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICd2JyxcbiAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcudi5sYWJlbCxcbiAgICAgICAgICBtaW46IG1ldGEuY29uZmlnLnYucmFuZ2VbMF0sXG4gICAgICAgICAgbWF4OiBtZXRhLmNvbmZpZy52LnJhbmdlWzFdLFxuICAgICAgICAgIHN0ZXBzOiBNYXRoLnJvdW5kKChtZXRhLmNvbmZpZy52LnJhbmdlWzFdIC0gbWV0YS5jb25maWcudi5yYW5nZVswXSkgLyBtZXRhLmNvbmZpZy52LnJlc29sdXRpb24pLFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZTogbWV0YS5jb25maWcudi5pbml0aWFsVmFsdWVcbiAgICAgICAgfSksIFN5bVNsaWRlckZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICdvbWVnYScsXG4gICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLm9tZWdhLmxhYmVsLFxuICAgICAgICAgIG1pbjogbWV0YS5jb25maWcub21lZ2EucmFuZ2VbMF0sXG4gICAgICAgICAgbWF4OiBtZXRhLmNvbmZpZy5vbWVnYS5yYW5nZVsxXSxcbiAgICAgICAgICBzdGVwczogTWF0aC5yb3VuZCgobWV0YS5jb25maWcub21lZ2EucmFuZ2VbMV0gLSBtZXRhLmNvbmZpZy5vbWVnYS5yYW5nZVswXSkgLyBtZXRhLmNvbmZpZy5vbWVnYS5yZXNvbHV0aW9uKSxcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6IG1ldGEuY29uZmlnLm9tZWdhLmluaXRpYWxWYWx1ZVxuICAgICAgICB9KSwgU2xpZGVyRmllbGQuY3JlYXRlKHtcbiAgICAgICAgICBpZDogJ3JhbmRvbW5lc3MnLFxuICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5yYW5kb21uZXNzLmxhYmVsLFxuICAgICAgICAgIG1pbjogbWV0YS5jb25maWcucmFuZG9tbmVzcy5yYW5nZVswXSxcbiAgICAgICAgICBtYXg6IG1ldGEuY29uZmlnLnJhbmRvbW5lc3MucmFuZ2VbMV0sXG4gICAgICAgICAgc3RlcHM6IE1hdGgucm91bmQoKG1ldGEuY29uZmlnLnJhbmRvbW5lc3MucmFuZ2VbMV0gLSBtZXRhLmNvbmZpZy5yYW5kb21uZXNzLnJhbmdlWzBdKSAvIG1ldGEuY29uZmlnLnJhbmRvbW5lc3MucmVzb2x1dGlvbiksXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiBtZXRhLmNvbmZpZy5yYW5kb21uZXNzLmluaXRpYWxWYWx1ZVxuICAgICAgICB9KV0pXG4gICAgICB9XG4gICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cblxuICAgIF9ob29rTW9kaWZ5RXhwb3J0KGV4cCwgbWV0YSkge1xuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcInR3b0V5ZVwiKSB7XG4gICAgICAgIFsnaycsICd2JywgJ29tZWdhJ10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgZXhwW2Ake2tleX1fZGVsdGFgXSA9IGV4cFtrZXldLmRlbHRhO1xuICAgICAgICAgIGV4cFtrZXldID0gZXhwW2tleV0uYmFzZTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBleHBcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUltcG9ydChkYXRhLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwidHdvRXllXCIpIHtcbiAgICAgICAgWydrJywgJ3YnLCAnb21lZ2EnXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBkYXRhW2tleV0gPSB7XG4gICAgICAgICAgICBiYXNlOiBkYXRhW2tleV0sXG4gICAgICAgICAgICBkZWx0YTogZGF0YVtgJHtrZXl9X2RlbHRhYF1cbiAgICAgICAgICB9O1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2Ake2tleX1fZGVsdGFgXTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIF9ob29rM2RWaWV3KHZpZXcsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLmNvbmZpZy5tb2RlbFR5cGUgPT0gXCJ0d29FeWVcIikge1xuICAgICAgICByZXR1cm4gKG5ldyBUd29FeWVWaWV3KHsgYmFzZUNvbG9yOiBtZXRhLmNvbG9yIH0pKS52aWV3KClcbiAgICAgIH1cbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH1cbiAgfVxufSkiXX0=
