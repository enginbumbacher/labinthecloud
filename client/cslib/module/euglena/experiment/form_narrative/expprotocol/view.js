'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var SelectFieldView = require('core/component/selectfield/view'),
      Template = require('text!./expprotocol.html'),
      Utils = require('core/util/utils');

  require('link!./expprotocol.css');

  return function (_SelectFieldView) {
    _inherits(ExpProtocolFieldView, _SelectFieldView);

    function ExpProtocolFieldView(model, tmpl) {
      _classCallCheck(this, ExpProtocolFieldView);

      model._data.label = '';

      var _this = _possibleConstructorReturn(this, (ExpProtocolFieldView.__proto__ || Object.getPrototypeOf(ExpProtocolFieldView)).call(this, model, tmpl || Template));

      Utils.bindMethods(_this, ['_showDescription', '_setVisibility', '_isVisible']);
      return _this;
    }

    _createClass(ExpProtocolFieldView, [{
      key: '_showDescription',
      value: function _showDescription(description) {
        this.$el.find('.exp-protocol__description').text(description);
      }
    }, {
      key: '_setVisibility',
      value: function _setVisibility(state, visibility) {
        //this.$el.find('.exp-protocol__description').css('opacity',state ? 1.0 : visibility);
        this.$el.css('opacity', state ? 1.0 : visibility);
      }
    }, {
      key: '_isVisible',
      value: function _isVisible() {
        return this.$el.css('opacity') == 1.0;
      }
    }]);

    return ExpProtocolFieldView;
  }(SelectFieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZXhwcHJvdG9jb2wvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiU2VsZWN0RmllbGRWaWV3IiwiVGVtcGxhdGUiLCJVdGlscyIsIm1vZGVsIiwidG1wbCIsIl9kYXRhIiwibGFiZWwiLCJiaW5kTWV0aG9kcyIsImRlc2NyaXB0aW9uIiwiJGVsIiwiZmluZCIsInRleHQiLCJzdGF0ZSIsInZpc2liaWxpdHkiLCJjc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsa0JBQWtCRCxRQUFRLGlDQUFSLENBQXhCO0FBQUEsTUFDRUUsV0FBV0YsUUFBUSx5QkFBUixDQURiO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWOztBQUtBQSxVQUFRLHdCQUFSOztBQUVBO0FBQUE7O0FBQ0Usa0NBQVlJLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQ3ZCRCxZQUFNRSxLQUFOLENBQVlDLEtBQVosR0FBb0IsRUFBcEI7O0FBRHVCLDhJQUVqQkgsS0FGaUIsRUFFVkMsUUFBUUgsUUFGRTs7QUFHdkJDLFlBQU1LLFdBQU4sUUFBd0IsQ0FBQyxrQkFBRCxFQUFvQixnQkFBcEIsRUFBcUMsWUFBckMsQ0FBeEI7QUFIdUI7QUFJeEI7O0FBTEg7QUFBQTtBQUFBLHVDQU9tQkMsV0FQbkIsRUFPZ0M7QUFDNUIsYUFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMsNEJBQWQsRUFBNENDLElBQTVDLENBQWlESCxXQUFqRDtBQUNEO0FBVEg7QUFBQTtBQUFBLHFDQVdpQkksS0FYakIsRUFXdUJDLFVBWHZCLEVBV21DO0FBQy9CO0FBQ0EsYUFBS0osR0FBTCxDQUFTSyxHQUFULENBQWEsU0FBYixFQUF1QkYsUUFBUSxHQUFSLEdBQWNDLFVBQXJDO0FBQ0Q7QUFkSDtBQUFBO0FBQUEsbUNBZ0JlO0FBQ1gsZUFBTyxLQUFLSixHQUFMLENBQVNLLEdBQVQsQ0FBYSxTQUFiLEtBQTJCLEdBQWxDO0FBQ0Q7QUFsQkg7O0FBQUE7QUFBQSxJQUEwQ2QsZUFBMUM7QUFvQkQsQ0E1QkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtX25hcnJhdGl2ZS9leHBwcm90b2NvbC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFNlbGVjdEZpZWxkVmlldyA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9leHBwcm90b2NvbC5odG1sJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKVxuICA7XG5cbiAgcmVxdWlyZSgnbGluayEuL2V4cHByb3RvY29sLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBFeHBQcm90b2NvbEZpZWxkVmlldyBleHRlbmRzIFNlbGVjdEZpZWxkVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIG1vZGVsLl9kYXRhLmxhYmVsID0gJydcbiAgICAgIHN1cGVyKG1vZGVsLCB0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX3Nob3dEZXNjcmlwdGlvbicsJ19zZXRWaXNpYmlsaXR5JywnX2lzVmlzaWJsZSddKTtcbiAgICB9XG5cbiAgICBfc2hvd0Rlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuZXhwLXByb3RvY29sX19kZXNjcmlwdGlvbicpLnRleHQoZGVzY3JpcHRpb24pO1xuICAgIH1cblxuICAgIF9zZXRWaXNpYmlsaXR5KHN0YXRlLHZpc2liaWxpdHkpIHtcbiAgICAgIC8vdGhpcy4kZWwuZmluZCgnLmV4cC1wcm90b2NvbF9fZGVzY3JpcHRpb24nKS5jc3MoJ29wYWNpdHknLHN0YXRlID8gMS4wIDogdmlzaWJpbGl0eSk7XG4gICAgICB0aGlzLiRlbC5jc3MoJ29wYWNpdHknLHN0YXRlID8gMS4wIDogdmlzaWJpbGl0eSk7XG4gICAgfVxuXG4gICAgX2lzVmlzaWJsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRlbC5jc3MoJ29wYWNpdHknKSA9PSAxLjA7XG4gICAgfVxuICB9XG59KVxuIl19
