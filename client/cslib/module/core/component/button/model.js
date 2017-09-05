'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseModel = require('core/component/form/field/model'),
      Utils = require('core/util/utils'),
      defaults = {
    id: null,
    label: '',
    eventName: 'Button.Pressed',
    eventData: {},
    style: "button",
    killNativeEvent: true
  };

  return function (_BaseModel) {
    _inherits(ButtonModel, _BaseModel);

    function ButtonModel(config) {
      _classCallCheck(this, ButtonModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (ButtonModel.__proto__ || Object.getPrototypeOf(ButtonModel)).call(this, config));
    }

    return ButtonModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9idXR0b24vbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkJhc2VNb2RlbCIsIlV0aWxzIiwiZGVmYXVsdHMiLCJpZCIsImxhYmVsIiwiZXZlbnROYW1lIiwiZXZlbnREYXRhIiwic3R5bGUiLCJraWxsTmF0aXZlRXZlbnQiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSxpQ0FBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFdBQVc7QUFDVEMsUUFBSSxJQURLO0FBRVRDLFdBQU8sRUFGRTtBQUdUQyxlQUFXLGdCQUhGO0FBSVRDLGVBQVcsRUFKRjtBQUtUQyxXQUFPLFFBTEU7QUFNVEMscUJBQWlCO0FBTlIsR0FGYjs7QUFXQTtBQUFBOztBQUNFLHlCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCQSxhQUFPUCxRQUFQLEdBQWtCRCxNQUFNUyxjQUFOLENBQXFCRCxPQUFPUCxRQUE1QixFQUFzQ0EsUUFBdEMsQ0FBbEI7QUFEa0IsdUhBRVpPLE1BRlk7QUFHbkI7O0FBSkg7QUFBQSxJQUFpQ1QsU0FBakM7QUFNRCxDQWxCRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvYnV0dG9uL21vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEJhc2VNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgaWQ6IG51bGwsXG4gICAgICBsYWJlbDogJycsXG4gICAgICBldmVudE5hbWU6ICdCdXR0b24uUHJlc3NlZCcsXG4gICAgICBldmVudERhdGE6IHt9LFxuICAgICAgc3R5bGU6IFwiYnV0dG9uXCIsXG4gICAgICBraWxsTmF0aXZlRXZlbnQ6IHRydWVcbiAgICB9O1xuXG4gIHJldHVybiBjbGFzcyBCdXR0b25Nb2RlbCBleHRlbmRzIEJhc2VNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICBjb25maWcuZGVmYXVsdHMgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhjb25maWcuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgfVxuICB9XG59KTtcbiJdfQ==
