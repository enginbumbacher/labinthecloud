'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var DomView = require('core/view/dom_view'),
      Template = require('text!./tab.html');

  return function (_DomView) {
    _inherits(ModelTabView, _DomView);

    function ModelTabView(model, tmpl) {
      _classCallCheck(this, ModelTabView);

      return _possibleConstructorReturn(this, (ModelTabView.__proto__ || Object.getPrototypeOf(ModelTabView)).call(this, tmpl || Template));
    }

    return ModelTabView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxVQUFVSixRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUssV0FBV0wsUUFBUSxpQkFBUixDQURiOztBQUdBO0FBQUE7O0FBQ0UsMEJBQVlNLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEseUhBQ2pCQSxRQUFRRixRQURTO0FBRXhCOztBQUhIO0FBQUEsSUFBa0NELE9BQWxDO0FBS0QsQ0FiRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbC90YWIvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
