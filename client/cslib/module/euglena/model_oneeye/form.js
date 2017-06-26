'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var Form = require('core/component/form/form');

  var OneEyeForm = function (_Form) {
    _inherits(OneEyeForm, _Form);

    function OneEyeForm() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var config = arguments[1];

      _classCallCheck(this, OneEyeForm);

      settings.fields = [];
      return _possibleConstructorReturn(this, Object.getPrototypeOf(OneEyeForm).call(this, settings));
    }

    return OneEyeForm;
  }(Form);

  OneEyeForm.create = function () {
    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var config = arguments[1];

    return new OneEyeForm(data, config);
  };

  return OneEyeForm;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX29uZWV5ZS9mb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFVBQVUsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLEtBQUssUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU0sT0FBTyxRQUFRLDBCQUFSLENBQWI7O0FBTGtCLE1BT1osVUFQWTtBQUFBOztBQVFoQiwwQkFBbUM7QUFBQSxVQUF2QixRQUF1Qix5REFBWixFQUFZO0FBQUEsVUFBUixNQUFROztBQUFBOztBQUNqQyxlQUFTLE1BQVQsR0FBa0IsRUFBbEI7QUFEaUMsMkZBRzNCLFFBSDJCO0FBSWxDOztBQVplO0FBQUEsSUFPTyxJQVBQOztBQWVsQixhQUFXLE1BQVgsR0FBb0IsWUFBdUI7QUFBQSxRQUF0QixJQUFzQix5REFBZixFQUFlO0FBQUEsUUFBWCxNQUFXOztBQUN6QyxXQUFPLElBQUksVUFBSixDQUFlLElBQWYsRUFBcUIsTUFBckIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBTyxVQUFQO0FBQ0QsQ0FwQkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfb25lZXllL2Zvcm0uanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
