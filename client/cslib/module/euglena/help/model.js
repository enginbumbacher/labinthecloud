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

      return _possibleConstructorReturn(this, (HelpModel.__proto__ || Object.getPrototypeOf(HelpModel)).call(this, Utils.ensureDefaults(data, defaults)));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2hlbHAvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIk1vZGVsIiwiVXRpbHMiLCJkZWZhdWx0cyIsIm9wZW4iLCJjb250ZW50cyIsImRhdGEiLCJlbnN1cmVEZWZhdWx0cyIsInNldCIsImdldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxXQUFXO0FBQ1RDLFVBQU0sS0FERztBQUVUQyxjQUFVO0FBRkQsR0FGYjs7QUFPQTtBQUFBOztBQUNFLHVCQUFZQyxJQUFaLEVBQWtCO0FBQUE7O0FBQUEsbUhBQ1ZKLE1BQU1LLGNBQU4sQ0FBcUJELElBQXJCLEVBQTJCSCxRQUEzQixDQURVO0FBRWpCOztBQUhIO0FBQUE7QUFBQSw2QkFLUztBQUNMLGFBQUtLLEdBQUwsQ0FBUyxNQUFULEVBQWlCLElBQWpCO0FBQ0Q7QUFQSDtBQUFBO0FBQUEsNkJBUVM7QUFDTCxhQUFLQSxHQUFMLENBQVMsTUFBVCxFQUFpQixLQUFqQjtBQUNEO0FBVkg7QUFBQTtBQUFBLCtCQVdXO0FBQ1AsYUFBS0EsR0FBTCxDQUFTLE1BQVQsRUFBaUIsQ0FBQyxLQUFLQyxHQUFMLENBQVMsTUFBVCxDQUFsQjtBQUNEO0FBYkg7O0FBQUE7QUFBQSxJQUErQlIsS0FBL0I7QUFlRCxDQXZCRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9oZWxwL21vZGVsLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
