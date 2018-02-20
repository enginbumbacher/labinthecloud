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
      _this.$el.attr('numericValue', config.numericValue);
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
      key: 'numericValue',
      value: function numericValue() {
        return this.$el.attr('numericValue');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC9vcHRpb252aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJjb25maWciLCIkZWwiLCJhdHRyIiwiaWQiLCJudW1lcmljVmFsdWUiLCJodG1sIiwibGFiZWwiLCJzZWxlY3QiLCJzZWxlY3RlZCIsInByb3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsb0JBQVIsQ0FEYjs7QUFHQTtBQUFBOztBQUNFLHdCQUFZRyxNQUFaLEVBQW9CO0FBQUE7O0FBQUEsMEhBQ1pELFFBRFk7O0FBRWxCLFlBQUtFLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLE9BQWQsRUFBdUJGLE9BQU9HLEVBQTlCO0FBQ0EsWUFBS0YsR0FBTCxDQUFTQyxJQUFULENBQWMsY0FBZCxFQUE2QkYsT0FBT0ksWUFBcEM7QUFDQSxZQUFLSCxHQUFMLENBQVNJLElBQVQsQ0FBY0wsT0FBT00sS0FBckI7QUFDQSxZQUFLQyxNQUFMLENBQVlQLE9BQU9RLFFBQW5CO0FBTGtCO0FBTW5COztBQVBIO0FBQUE7QUFBQSwyQkFTTztBQUNILGVBQU8sS0FBS1AsR0FBTCxDQUFTQyxJQUFULENBQWMsT0FBZCxDQUFQO0FBQ0Q7QUFYSDtBQUFBO0FBQUEscUNBYWlCO0FBQ2IsZUFBTyxLQUFLRCxHQUFMLENBQVNDLElBQVQsQ0FBYyxjQUFkLENBQVA7QUFDRDtBQWZIO0FBQUE7QUFBQSw2QkFpQlNNLFFBakJULEVBaUJtQjtBQUNmLGFBQUtQLEdBQUwsQ0FBU1EsSUFBVCxDQUFjLFVBQWQsRUFBMEJELFFBQTFCO0FBQ0Q7QUFuQkg7QUFBQTtBQUFBLGdDQXFCWTtBQUNSLGFBQUtQLEdBQUwsQ0FBU1EsSUFBVCxDQUFjLFVBQWQsRUFBMEIsSUFBMUI7QUFDRDtBQXZCSDtBQUFBO0FBQUEsK0JBd0JXO0FBQ1AsYUFBS1IsR0FBTCxDQUFTUSxJQUFULENBQWMsVUFBZCxFQUEwQixLQUExQjtBQUNEO0FBMUJIOztBQUFBO0FBQUEsSUFBZ0NYLE9BQWhDO0FBNEJELENBaENEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC9vcHRpb252aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9vcHRpb24uaHRtbCcpO1xuXG4gIHJldHVybiBjbGFzcyBPcHRpb25WaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICBzdXBlcihUZW1wbGF0ZSk7XG4gICAgICB0aGlzLiRlbC5hdHRyKCd2YWx1ZScsIGNvbmZpZy5pZCk7XG4gICAgICB0aGlzLiRlbC5hdHRyKCdudW1lcmljVmFsdWUnLGNvbmZpZy5udW1lcmljVmFsdWUpO1xuICAgICAgdGhpcy4kZWwuaHRtbChjb25maWcubGFiZWwpO1xuICAgICAgdGhpcy5zZWxlY3QoY29uZmlnLnNlbGVjdGVkKTtcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRlbC5hdHRyKCd2YWx1ZScpO1xuICAgIH1cblxuICAgIG51bWVyaWNWYWx1ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRlbC5hdHRyKCdudW1lcmljVmFsdWUnKTtcbiAgICB9XG5cbiAgICBzZWxlY3Qoc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuJGVsLnByb3AoJ3NlbGVjdGVkJywgc2VsZWN0ZWQpO1xuICAgIH1cblxuICAgIGRpc2FibGUoKSB7XG4gICAgICB0aGlzLiRlbC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIH1cbiAgICBlbmFibGUoKSB7XG4gICAgICB0aGlzLiRlbC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
