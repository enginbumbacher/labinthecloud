'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    open: false,
    contents: ""
  };

  return function (_Model) {
    _inherits(HelpModel, _Model);

    function HelpModel(data) {
      _classCallCheck(this, HelpModel);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(HelpModel).call(this, Utils.ensureDefaults(data, defaults)));
    }

    _createClass(HelpModel, [{
      key: 'show',
      value: function show() {
        this.set('open', true);
      }
    }, {
      key: 'hide',
      value: function hide() {
        this.set('open', false);
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this.set('open', !this.get('open'));
      }
    }]);

    return HelpModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2hlbHAvbW9kZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxRQUFRLFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFdBQVc7QUFDVCxVQUFNLEtBREc7QUFFVCxjQUFVO0FBRkQsR0FGYjs7QUFPQTtBQUFBOztBQUNFLHVCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFBQSwwRkFDVixNQUFNLGNBQU4sQ0FBcUIsSUFBckIsRUFBMkIsUUFBM0IsQ0FEVTtBQUVqQjs7QUFISDtBQUFBO0FBQUEsNkJBS1M7QUFDTCxhQUFLLEdBQUwsQ0FBUyxNQUFULEVBQWlCLElBQWpCO0FBQ0Q7QUFQSDtBQUFBO0FBQUEsNkJBUVM7QUFDTCxhQUFLLEdBQUwsQ0FBUyxNQUFULEVBQWlCLEtBQWpCO0FBQ0Q7QUFWSDtBQUFBO0FBQUEsK0JBV1c7QUFDUCxhQUFLLEdBQUwsQ0FBUyxNQUFULEVBQWlCLENBQUMsS0FBSyxHQUFMLENBQVMsTUFBVCxDQUFsQjtBQUNEO0FBYkg7O0FBQUE7QUFBQSxJQUErQixLQUEvQjtBQWVELENBdkJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2hlbHAvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
