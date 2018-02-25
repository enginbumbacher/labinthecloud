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
    }]);

    return ModelingTabView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCIkIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsIiRlbCIsImZpbmQiLCJvbiIsIl9vblRhYkNsaWNrIiwiX29uVHJhbnNpdGlvbkVuZCIsImRpc2FibGVGaWVsZHMiLCJldnQiLCJnZXQiLCJkaXNwYXRjaEV2ZW50IiwidHlwZSIsIm9mZiIsImRhdGEiLCJwYXRoIiwidG9nZ2xlQ2xhc3MiLCJ2YWx1ZSIsInVwZGF0ZUZpZWxkU3RhdHVzIiwiY3VycmVudFRhcmdldCIsImVuYWJsZUZpZWxkcyIsInJlbW92ZVByb3AiLCJwcm9wIiwianFldnQiLCJ0YWJUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLElBQUlELFFBQVEsUUFBUixDQUFWOztBQUVBLE1BQU1FLFFBQVFGLFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VHLFVBQVVILFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVJLEtBQUtKLFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSyxVQUFVTCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRU0sV0FBV04sUUFBUSxpQkFBUixDQURiOztBQUdBQSxVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UsNkJBQVlPLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsb0lBQ2pCQSxRQUFRRixRQURTOztBQUV2QkosWUFBTU8sV0FBTixRQUF3QixDQUN0QixhQURzQixFQUNQLGdCQURPLEVBQ1Usa0JBRFYsQ0FBeEI7O0FBR0FGLFlBQU1HLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUtDLGNBQTVDOztBQUVBLFlBQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGdCQUFkLEVBQWdDQyxFQUFoQyxDQUFtQyxPQUFuQyxFQUEyQyxNQUFLQyxXQUFoRDtBQUNBLFlBQUtILEdBQUwsQ0FBUyxDQUFULEVBQVlGLGdCQUFaLENBQTZCLGVBQTdCLEVBQThDLE1BQUtNLGdCQUFuRDtBQUNBLFlBQUtDLGFBQUw7QUFUdUI7QUFVeEI7O0FBWEg7QUFBQTtBQUFBLHVDQWFtQkMsR0FibkIsRUFhd0I7QUFDcEJmLGdCQUFRZ0IsR0FBUixDQUFZLE9BQVosRUFBcUJDLGFBQXJCLENBQW1DLDJCQUFuQyxFQUFnRSxFQUFDQyxNQUFNLE9BQVAsRUFBaEUsRUFBaUYsSUFBakY7QUFDRDtBQWZIO0FBQUE7QUFBQSxnQ0FpQlk7QUFDUixhQUFLVCxHQUFMLENBQVNDLElBQVQsQ0FBYyxnQkFBZCxFQUFnQ1MsR0FBaEMsQ0FBb0MsT0FBcEM7QUFDRDtBQW5CSDtBQUFBO0FBQUEsK0JBcUJXO0FBQ1AsYUFBS1YsR0FBTCxDQUFTQyxJQUFULENBQWMsZ0JBQWQsRUFBZ0NDLEVBQWhDLENBQW1DLE9BQW5DLEVBQTJDLEtBQUtDLFdBQWhEO0FBQ0Q7QUF2Qkg7QUFBQTtBQUFBLHFDQXlCaUJHLEdBekJqQixFQXlCc0I7QUFDbEIsWUFBSUEsSUFBSUssSUFBSixDQUFTQyxJQUFULElBQWlCLE1BQXJCLEVBQTZCO0FBQzNCLGVBQUtaLEdBQUwsQ0FBU2EsV0FBVCxDQUFxQixnQkFBckIsRUFBdUNQLElBQUlLLElBQUosQ0FBU0csS0FBaEQ7QUFDQSxlQUFLQyxpQkFBTCxDQUF1QlQsSUFBSVUsYUFBM0I7QUFDRDtBQUNIO0FBOUJGO0FBQUE7QUFBQSx3Q0FnQ29CckIsS0FoQ3BCLEVBZ0MyQjtBQUN2QixZQUFJQSxNQUFNWSxHQUFOLENBQVUsTUFBVixDQUFKLEVBQXVCO0FBQ3JCLGVBQUtVLFlBQUw7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLWixhQUFMO0FBQ0Q7QUFDRjtBQXRDSDtBQUFBO0FBQUEscUNBd0NpQjtBQUNiO0FBQ0EsYUFBS0wsR0FBTCxDQUFTQyxJQUFULENBQWMsZUFBZCxFQUErQmlCLFVBQS9CLENBQTBDLFVBQTFDO0FBQ0Q7QUEzQ0g7QUFBQTtBQUFBLHNDQTZDa0I7QUFDZDtBQUNBLGFBQUtsQixHQUFMLENBQVNDLElBQVQsQ0FBYyxlQUFkLEVBQStCa0IsSUFBL0IsQ0FBb0MsVUFBcEMsRUFBZ0QsSUFBaEQ7QUFDRDtBQWhESDtBQUFBO0FBQUEsa0NBa0RjQyxLQWxEZCxFQWtEcUI7QUFDakI3QixnQkFBUWdCLEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxhQUFyQixDQUFtQywyQkFBbkMsRUFBZ0UsRUFBQ2EsU0FBUyxTQUFWLEVBQWhFLEVBQXNGLElBQXRGO0FBQ0Q7QUFwREg7O0FBQUE7QUFBQSxJQUFxQzVCLE9BQXJDO0FBc0RELENBbEVEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3RhYi5odG1sJyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBNb2RlbGluZ1RhYlZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25UYWJDbGljaycsICdfb25Nb2RlbENoYW5nZScsJ19vblRyYW5zaXRpb25FbmQnXSlcblxuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZSlcblxuICAgICAgdGhpcy4kZWwuZmluZCgnLm1vZGVsaW5nX190YWInKS5vbignY2xpY2snLHRoaXMuX29uVGFiQ2xpY2spO1xuICAgICAgdGhpcy4kZWxbMF0uYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRoaXMuX29uVHJhbnNpdGlvbkVuZClcbiAgICAgIHRoaXMuZGlzYWJsZUZpZWxkcygpO1xuICAgIH1cblxuICAgIF9vblRyYW5zaXRpb25FbmQoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdNb2RlbGluZ1RhYi5UcmFuc2l0aW9uRW5kJywge3R5cGU6ICdtb2RlbCd9LCB0cnVlKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLm1vZGVsaW5nX190YWInKS5vZmYoJ2NsaWNrJyk7XG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLm1vZGVsaW5nX190YWInKS5vbignY2xpY2snLHRoaXMuX29uVGFiQ2xpY2spO1xuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJvcGVuXCIpIHtcbiAgICAgICAgdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ21vZGVsaW5nX19vcGVuJywgZXZ0LmRhdGEudmFsdWUpXG4gICAgICAgIHRoaXMudXBkYXRlRmllbGRTdGF0dXMoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgfVxuICAgfVxuXG4gICAgdXBkYXRlRmllbGRTdGF0dXMobW9kZWwpIHtcbiAgICAgIGlmIChtb2RlbC5nZXQoJ29wZW4nKSkge1xuICAgICAgICB0aGlzLmVuYWJsZUZpZWxkcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlRmllbGRzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZW5hYmxlRmllbGRzKCkge1xuICAgICAgLy90aGlzLl9ncmFwaFNlbGVjdC5lbmFibGUoKTtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJ2lucHV0LCBidXR0b24nKS5yZW1vdmVQcm9wKCdkaXNhYmxlZCcpO1xuICAgIH1cblxuICAgIGRpc2FibGVGaWVsZHMoKSB7XG4gICAgICAvL3RoaXMuX2dyYXBoU2VsZWN0LmRpc2FibGUoKTtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJ2lucHV0LCBidXR0b24nKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIH1cblxuICAgIF9vblRhYkNsaWNrKGpxZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0Jywge3RhYlR5cGU6ICdibG9ja2x5J30sIHRydWUpO1xuICAgIH1cbiAgfVxufSlcbiJdfQ==
