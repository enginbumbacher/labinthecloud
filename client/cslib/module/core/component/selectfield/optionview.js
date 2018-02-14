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
    }, {
      key: 'hide',
      value: function hide() {
        this.$el.css('display', 'none');
      }
    }, {
      key: 'show',
      value: function show() {
        this.$el.css('display', 'block');
      }
    }]);

    return OptionView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9vcHRpb252aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJjb25maWciLCIkZWwiLCJhdHRyIiwiaWQiLCJodG1sIiwibGFiZWwiLCJzZWxlY3QiLCJzZWxlY3RlZCIsInByb3AiLCJjc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsb0JBQVIsQ0FEYjs7QUFHQTtBQUFBOztBQUNFLHdCQUFZRyxNQUFaLEVBQW9CO0FBQUE7O0FBQUEsMEhBQ1pELFFBRFk7O0FBRWxCLFlBQUtFLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLE9BQWQsRUFBdUJGLE9BQU9HLEVBQTlCO0FBQ0EsWUFBS0YsR0FBTCxDQUFTRyxJQUFULENBQWNKLE9BQU9LLEtBQXJCO0FBQ0EsWUFBS0MsTUFBTCxDQUFZTixPQUFPTyxRQUFuQjtBQUprQjtBQUtuQjs7QUFOSDtBQUFBO0FBQUEsMkJBUU87QUFDSCxlQUFPLEtBQUtOLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLE9BQWQsQ0FBUDtBQUNEO0FBVkg7QUFBQTtBQUFBLDZCQVlTSyxRQVpULEVBWW1CO0FBQ2YsYUFBS04sR0FBTCxDQUFTTyxJQUFULENBQWMsVUFBZCxFQUEwQkQsUUFBMUI7QUFDRDtBQWRIO0FBQUE7QUFBQSxnQ0FnQlk7QUFDUixhQUFLTixHQUFMLENBQVNPLElBQVQsQ0FBYyxVQUFkLEVBQTBCLElBQTFCO0FBQ0Q7QUFsQkg7QUFBQTtBQUFBLCtCQW9CVztBQUNQLGFBQUtQLEdBQUwsQ0FBU08sSUFBVCxDQUFjLFVBQWQsRUFBMEIsS0FBMUI7QUFDRDtBQXRCSDtBQUFBO0FBQUEsNkJBd0JTO0FBQ0wsYUFBS1AsR0FBTCxDQUFTUSxHQUFULENBQWEsU0FBYixFQUF3QixNQUF4QjtBQUNEO0FBMUJIO0FBQUE7QUFBQSw2QkE0QlM7QUFDTCxhQUFLUixHQUFMLENBQVNRLEdBQVQsQ0FBYSxTQUFiLEVBQXdCLE9BQXhCO0FBQ0Q7QUE5Qkg7O0FBQUE7QUFBQSxJQUFnQ1gsT0FBaEM7QUFnQ0QsQ0FwQ0QiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL29wdGlvbnZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL29wdGlvbi5odG1sJyk7XG5cbiAgcmV0dXJuIGNsYXNzIE9wdGlvblZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgIHN1cGVyKFRlbXBsYXRlKTtcbiAgICAgIHRoaXMuJGVsLmF0dHIoJ3ZhbHVlJywgY29uZmlnLmlkKTtcbiAgICAgIHRoaXMuJGVsLmh0bWwoY29uZmlnLmxhYmVsKTtcbiAgICAgIHRoaXMuc2VsZWN0KGNvbmZpZy5zZWxlY3RlZCk7XG4gICAgfVxuXG4gICAgaWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kZWwuYXR0cigndmFsdWUnKTtcbiAgICB9XG5cbiAgICBzZWxlY3Qoc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuJGVsLnByb3AoJ3NlbGVjdGVkJywgc2VsZWN0ZWQpO1xuICAgIH1cblxuICAgIGRpc2FibGUoKSB7XG4gICAgICB0aGlzLiRlbC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICB0aGlzLiRlbC5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICB0aGlzLiRlbC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
