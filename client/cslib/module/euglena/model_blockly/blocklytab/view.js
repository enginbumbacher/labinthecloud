'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var $ = require('jquery');

  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var DomView = require('core/view/dom_view'),
      Template = require('text!./tab.html');

  require('link!./style.css');

  return function (_DomView) {
    _inherits(ModelingTabView, _DomView);

    function ModelingTabView(model, tmpl) {
      _classCallCheck(this, ModelingTabView);

      var _this = _possibleConstructorReturn(this, (ModelingTabView.__proto__ || Object.getPrototypeOf(ModelingTabView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onTabClick', '_onModelChange', '_onTransitionEnd']);

      model.addEventListener('Model.Change', _this._onModelChange);

      _this.$el.find('.modeling__tab').on('click', _this._onTabClick);
      _this.$el[0].addEventListener('transitionend', _this._onTransitionEnd);
      _this.disableFields();
      return _this;
    }

    _createClass(ModelingTabView, [{
      key: '_onTransitionEnd',
      value: function _onTransitionEnd(evt) {
        Globals.get('Relay').dispatchEvent('ModelingTab.TransitionEnd', { type: 'model' }, true);
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.$el.find('.modeling__tab').off('click');
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.$el.find('.modeling__tab').on('click', this._onTabClick);
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == "open") {
          this.$el.toggleClass('modeling__open', evt.data.value);
          this.updateFieldStatus(evt.currentTarget);
        }
      }
    }, {
      key: 'updateFieldStatus',
      value: function updateFieldStatus(model) {
        if (model.get('open')) {
          this.enableFields();
        } else {
          this.disableFields();
        }
      }
    }, {
      key: 'enableFields',
      value: function enableFields() {
        //this._graphSelect.enable();
        this.$el.find('input, button').removeProp('disabled');
      }
    }, {
      key: 'disableFields',
      value: function disableFields() {
        //this._graphSelect.disable();
        this.$el.find('input, button').prop('disabled', true);
      }
    }, {
      key: '_onTabClick',
      value: function _onTabClick(jqevt) {
        Globals.get('Relay').dispatchEvent('ModelingTab.ToggleRequest', { tabType: 'blockly' }, true);
      }
    }, {
      key: 'toggle',
      value: function toggle(tabOpen) {
        if (tabOpen) {
          this.$el.find('#selectModeling').removeClass('flipped');
          this.$el.find('#selectModeling').addClass('notflipped');
        } else {
          this.$el.find('#selectModeling').removeClass('notflipped');
          this.$el.find('#selectModeling').addClass('flipped');
        }
      }
    }]);

    return ModelingTabView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCIkIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsIiRlbCIsImZpbmQiLCJvbiIsIl9vblRhYkNsaWNrIiwiX29uVHJhbnNpdGlvbkVuZCIsImRpc2FibGVGaWVsZHMiLCJldnQiLCJnZXQiLCJkaXNwYXRjaEV2ZW50IiwidHlwZSIsIm9mZiIsImRhdGEiLCJwYXRoIiwidG9nZ2xlQ2xhc3MiLCJ2YWx1ZSIsInVwZGF0ZUZpZWxkU3RhdHVzIiwiY3VycmVudFRhcmdldCIsImVuYWJsZUZpZWxkcyIsInJlbW92ZVByb3AiLCJwcm9wIiwianFldnQiLCJ0YWJUeXBlIiwidGFiT3BlbiIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsSUFBSUQsUUFBUSxRQUFSLENBQVY7O0FBRUEsTUFBTUUsUUFBUUYsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUcsVUFBVUgsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUksS0FBS0osUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1LLFVBQVVMLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFTSxXQUFXTixRQUFRLGlCQUFSLENBRGI7O0FBR0FBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSw2QkFBWU8sS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxvSUFDakJBLFFBQVFGLFFBRFM7O0FBRXZCSixZQUFNTyxXQUFOLFFBQXdCLENBQ3RCLGFBRHNCLEVBQ1AsZ0JBRE8sRUFDVSxrQkFEVixDQUF4Qjs7QUFHQUYsWUFBTUcsZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBS0MsY0FBNUM7O0FBRUEsWUFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMsZ0JBQWQsRUFBZ0NDLEVBQWhDLENBQW1DLE9BQW5DLEVBQTJDLE1BQUtDLFdBQWhEO0FBQ0EsWUFBS0gsR0FBTCxDQUFTLENBQVQsRUFBWUYsZ0JBQVosQ0FBNkIsZUFBN0IsRUFBOEMsTUFBS00sZ0JBQW5EO0FBQ0EsWUFBS0MsYUFBTDtBQVR1QjtBQVV4Qjs7QUFYSDtBQUFBO0FBQUEsdUNBYW1CQyxHQWJuQixFQWF3QjtBQUNwQmYsZ0JBQVFnQixHQUFSLENBQVksT0FBWixFQUFxQkMsYUFBckIsQ0FBbUMsMkJBQW5DLEVBQWdFLEVBQUNDLE1BQU0sT0FBUCxFQUFoRSxFQUFpRixJQUFqRjtBQUNEO0FBZkg7QUFBQTtBQUFBLGdDQWlCWTtBQUNSLGFBQUtULEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGdCQUFkLEVBQWdDUyxHQUFoQyxDQUFvQyxPQUFwQztBQUNEO0FBbkJIO0FBQUE7QUFBQSwrQkFxQlc7QUFDUCxhQUFLVixHQUFMLENBQVNDLElBQVQsQ0FBYyxnQkFBZCxFQUFnQ0MsRUFBaEMsQ0FBbUMsT0FBbkMsRUFBMkMsS0FBS0MsV0FBaEQ7QUFDRDtBQXZCSDtBQUFBO0FBQUEscUNBeUJpQkcsR0F6QmpCLEVBeUJzQjtBQUNsQixZQUFJQSxJQUFJSyxJQUFKLENBQVNDLElBQVQsSUFBaUIsTUFBckIsRUFBNkI7QUFDM0IsZUFBS1osR0FBTCxDQUFTYSxXQUFULENBQXFCLGdCQUFyQixFQUF1Q1AsSUFBSUssSUFBSixDQUFTRyxLQUFoRDtBQUNBLGVBQUtDLGlCQUFMLENBQXVCVCxJQUFJVSxhQUEzQjtBQUNEO0FBQ0g7QUE5QkY7QUFBQTtBQUFBLHdDQWdDb0JyQixLQWhDcEIsRUFnQzJCO0FBQ3ZCLFlBQUlBLE1BQU1ZLEdBQU4sQ0FBVSxNQUFWLENBQUosRUFBdUI7QUFDckIsZUFBS1UsWUFBTDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtaLGFBQUw7QUFDRDtBQUNGO0FBdENIO0FBQUE7QUFBQSxxQ0F3Q2lCO0FBQ2I7QUFDQSxhQUFLTCxHQUFMLENBQVNDLElBQVQsQ0FBYyxlQUFkLEVBQStCaUIsVUFBL0IsQ0FBMEMsVUFBMUM7QUFDRDtBQTNDSDtBQUFBO0FBQUEsc0NBNkNrQjtBQUNkO0FBQ0EsYUFBS2xCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGVBQWQsRUFBK0JrQixJQUEvQixDQUFvQyxVQUFwQyxFQUFnRCxJQUFoRDtBQUNEO0FBaERIO0FBQUE7QUFBQSxrQ0FrRGNDLEtBbERkLEVBa0RxQjtBQUNqQjdCLGdCQUFRZ0IsR0FBUixDQUFZLE9BQVosRUFBcUJDLGFBQXJCLENBQW1DLDJCQUFuQyxFQUFnRSxFQUFDYSxTQUFTLFNBQVYsRUFBaEUsRUFBc0YsSUFBdEY7QUFDRDtBQXBESDtBQUFBO0FBQUEsNkJBc0RTQyxPQXREVCxFQXNEa0I7QUFDZCxZQUFJQSxPQUFKLEVBQWE7QUFDWCxlQUFLdEIsR0FBTCxDQUFTQyxJQUFULENBQWMsaUJBQWQsRUFBaUNzQixXQUFqQyxDQUE2QyxTQUE3QztBQUNBLGVBQUt2QixHQUFMLENBQVNDLElBQVQsQ0FBYyxpQkFBZCxFQUFpQ3VCLFFBQWpDLENBQTBDLFlBQTFDO0FBQ0QsU0FIRCxNQUdPO0FBQ0wsZUFBS3hCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGlCQUFkLEVBQWlDc0IsV0FBakMsQ0FBNkMsWUFBN0M7QUFDQSxlQUFLdkIsR0FBTCxDQUFTQyxJQUFULENBQWMsaUJBQWQsRUFBaUN1QixRQUFqQyxDQUEwQyxTQUExQztBQUNEO0FBQ0Y7QUE5REg7O0FBQUE7QUFBQSxJQUFxQy9CLE9BQXJDO0FBZ0VELENBNUVEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3RhYi5odG1sJyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBNb2RlbGluZ1RhYlZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25UYWJDbGljaycsICdfb25Nb2RlbENoYW5nZScsJ19vblRyYW5zaXRpb25FbmQnXSlcblxuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZSlcblxuICAgICAgdGhpcy4kZWwuZmluZCgnLm1vZGVsaW5nX190YWInKS5vbignY2xpY2snLHRoaXMuX29uVGFiQ2xpY2spO1xuICAgICAgdGhpcy4kZWxbMF0uYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRoaXMuX29uVHJhbnNpdGlvbkVuZClcbiAgICAgIHRoaXMuZGlzYWJsZUZpZWxkcygpO1xuICAgIH1cblxuICAgIF9vblRyYW5zaXRpb25FbmQoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdNb2RlbGluZ1RhYi5UcmFuc2l0aW9uRW5kJywge3R5cGU6ICdtb2RlbCd9LCB0cnVlKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLm1vZGVsaW5nX190YWInKS5vZmYoJ2NsaWNrJyk7XG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLm1vZGVsaW5nX190YWInKS5vbignY2xpY2snLHRoaXMuX29uVGFiQ2xpY2spO1xuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJvcGVuXCIpIHtcbiAgICAgICAgdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ21vZGVsaW5nX19vcGVuJywgZXZ0LmRhdGEudmFsdWUpXG4gICAgICAgIHRoaXMudXBkYXRlRmllbGRTdGF0dXMoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgfVxuICAgfVxuXG4gICAgdXBkYXRlRmllbGRTdGF0dXMobW9kZWwpIHtcbiAgICAgIGlmIChtb2RlbC5nZXQoJ29wZW4nKSkge1xuICAgICAgICB0aGlzLmVuYWJsZUZpZWxkcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlRmllbGRzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZW5hYmxlRmllbGRzKCkge1xuICAgICAgLy90aGlzLl9ncmFwaFNlbGVjdC5lbmFibGUoKTtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJ2lucHV0LCBidXR0b24nKS5yZW1vdmVQcm9wKCdkaXNhYmxlZCcpO1xuICAgIH1cblxuICAgIGRpc2FibGVGaWVsZHMoKSB7XG4gICAgICAvL3RoaXMuX2dyYXBoU2VsZWN0LmRpc2FibGUoKTtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJ2lucHV0LCBidXR0b24nKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIH1cblxuICAgIF9vblRhYkNsaWNrKGpxZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0Jywge3RhYlR5cGU6ICdibG9ja2x5J30sIHRydWUpO1xuICAgIH1cblxuICAgIHRvZ2dsZSh0YWJPcGVuKSB7XG4gICAgICBpZiAodGFiT3Blbikge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjc2VsZWN0TW9kZWxpbmcnKS5yZW1vdmVDbGFzcygnZmxpcHBlZCcpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjc2VsZWN0TW9kZWxpbmcnKS5hZGRDbGFzcygnbm90ZmxpcHBlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI3NlbGVjdE1vZGVsaW5nJykucmVtb3ZlQ2xhc3MoJ25vdGZsaXBwZWQnKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI3NlbGVjdE1vZGVsaW5nJykuYWRkQ2xhc3MoJ2ZsaXBwZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG4iXX0=
