'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

*/
define(function (require) {
  var EventDispatcher = require('core/event/dispatcher'),
      Utils = require('core/util/utils'),
      defaults = {
    modelClass: null,
    viewClass: null,
    modelData: {}
  };

  return function (_EventDispatcher) {
    _inherits(Controller, _EventDispatcher);

    function Controller(settings) {
      _classCallCheck(this, Controller);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Controller).call(this));

      var config = Utils.ensureDefaults(settings, defaults);
      if (config.modelClass) _this._model = new config.modelClass({ data: config.modelData });
      if (config.viewClass) _this._view = new config.viewClass(_this._model);
      return _this;
    }

    _createClass(Controller, [{
      key: 'view',
      value: function view() {
        return this._view;
      }
    }]);

    return Controller;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbnRyb2xsZXIvY29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBR0EsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLGtCQUFrQixRQUFRLHVCQUFSLENBQXhCO0FBQUEsTUFDRSxRQUFRLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUUsV0FBVztBQUNULGdCQUFZLElBREg7QUFFVCxlQUFXLElBRkY7QUFHVCxlQUFXO0FBSEYsR0FGYjs7QUFRQTtBQUFBOztBQUNFLHdCQUFZLFFBQVosRUFBc0I7QUFBQTs7QUFBQTs7QUFFcEIsVUFBSSxTQUFTLE1BQU0sY0FBTixDQUFxQixRQUFyQixFQUErQixRQUEvQixDQUFiO0FBQ0EsVUFBSSxPQUFPLFVBQVgsRUFBdUIsTUFBSyxNQUFMLEdBQWMsSUFBSSxPQUFPLFVBQVgsQ0FBc0IsRUFBRSxNQUFNLE9BQU8sU0FBZixFQUF0QixDQUFkO0FBQ3ZCLFVBQUksT0FBTyxTQUFYLEVBQXNCLE1BQUssS0FBTCxHQUFhLElBQUksT0FBTyxTQUFYLENBQXFCLE1BQUssTUFBMUIsQ0FBYjtBQUpGO0FBS3JCOztBQU5IO0FBQUE7QUFBQSw2QkFRUztBQUNMLGVBQU8sS0FBSyxLQUFaO0FBQ0Q7QUFWSDs7QUFBQTtBQUFBLElBQWdDLGVBQWhDO0FBWUQsQ0FyQkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29udHJvbGxlci9jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
