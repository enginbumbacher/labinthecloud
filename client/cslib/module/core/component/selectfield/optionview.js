'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./option.html');

  return function (_DomView) {
    _inherits(OptionView, _DomView);

    function OptionView(config) {
      _classCallCheck(this, OptionView);

      var _this = _possibleConstructorReturn(this, (OptionView.__proto__ || Object.getPrototypeOf(OptionView)).call(this, Template));

      _this.$el.attr('value', config.id);
      _this.$el.html(config.label);
      _this.select(config.selected);
      return _this;
    }

    _createClass(OptionView, [{
      key: 'id',
      value: function id() {
        return this.$el.attr('value');
      }
    }, {
      key: 'select',
      value: function select(selected) {
        this.$el.prop('selected', selected);
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.$el.prop('disabled', true);
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.$el.prop('disabled', false);
      }
    }]);

    return OptionView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9vcHRpb252aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJjb25maWciLCIkZWwiLCJhdHRyIiwiaWQiLCJodG1sIiwibGFiZWwiLCJzZWxlY3QiLCJzZWxlY3RlZCIsInByb3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsb0JBQVIsQ0FEYjs7QUFHQTtBQUFBOztBQUNFLHdCQUFZRyxNQUFaLEVBQW9CO0FBQUE7O0FBQUEsMEhBQ1pELFFBRFk7O0FBRWxCLFlBQUtFLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLE9BQWQsRUFBdUJGLE9BQU9HLEVBQTlCO0FBQ0EsWUFBS0YsR0FBTCxDQUFTRyxJQUFULENBQWNKLE9BQU9LLEtBQXJCO0FBQ0EsWUFBS0MsTUFBTCxDQUFZTixPQUFPTyxRQUFuQjtBQUprQjtBQUtuQjs7QUFOSDtBQUFBO0FBQUEsMkJBUU87QUFDSCxlQUFPLEtBQUtOLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLE9BQWQsQ0FBUDtBQUNEO0FBVkg7QUFBQTtBQUFBLDZCQVlTSyxRQVpULEVBWW1CO0FBQ2YsYUFBS04sR0FBTCxDQUFTTyxJQUFULENBQWMsVUFBZCxFQUEwQkQsUUFBMUI7QUFDRDtBQWRIO0FBQUE7QUFBQSxnQ0FnQlk7QUFDUixhQUFLTixHQUFMLENBQVNPLElBQVQsQ0FBYyxVQUFkLEVBQTBCLElBQTFCO0FBQ0Q7QUFsQkg7QUFBQTtBQUFBLCtCQW1CVztBQUNQLGFBQUtQLEdBQUwsQ0FBU08sSUFBVCxDQUFjLFVBQWQsRUFBMEIsS0FBMUI7QUFDRDtBQXJCSDs7QUFBQTtBQUFBLElBQWdDVixPQUFoQztBQXVCRCxDQTNCRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvb3B0aW9udmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
