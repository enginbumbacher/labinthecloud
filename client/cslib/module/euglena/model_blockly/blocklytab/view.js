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

      _this.$el.find('.modeling__tab').click(_this._onTabClick);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCIkIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsIiRlbCIsImZpbmQiLCJjbGljayIsIl9vblRhYkNsaWNrIiwiX29uVHJhbnNpdGlvbkVuZCIsImRpc2FibGVGaWVsZHMiLCJldnQiLCJnZXQiLCJkaXNwYXRjaEV2ZW50IiwidHlwZSIsImRhdGEiLCJwYXRoIiwidG9nZ2xlQ2xhc3MiLCJ2YWx1ZSIsInVwZGF0ZUZpZWxkU3RhdHVzIiwiY3VycmVudFRhcmdldCIsImVuYWJsZUZpZWxkcyIsInJlbW92ZVByb3AiLCJwcm9wIiwianFldnQiLCJ0YWJUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLElBQUlELFFBQVEsUUFBUixDQUFWOztBQUVBLE1BQU1FLFFBQVFGLFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VHLFVBQVVILFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVJLEtBQUtKLFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSyxVQUFVTCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRU0sV0FBV04sUUFBUSxpQkFBUixDQURiOztBQUdBQSxVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UsNkJBQVlPLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsb0lBQ2pCQSxRQUFRRixRQURTOztBQUV2QkosWUFBTU8sV0FBTixRQUF3QixDQUN0QixhQURzQixFQUNQLGdCQURPLEVBQ1Usa0JBRFYsQ0FBeEI7O0FBR0FGLFlBQU1HLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUtDLGNBQTVDOztBQUVBLFlBQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGdCQUFkLEVBQWdDQyxLQUFoQyxDQUFzQyxNQUFLQyxXQUEzQztBQUNBLFlBQUtILEdBQUwsQ0FBUyxDQUFULEVBQVlGLGdCQUFaLENBQTZCLGVBQTdCLEVBQThDLE1BQUtNLGdCQUFuRDtBQUNBLFlBQUtDLGFBQUw7QUFUdUI7QUFVeEI7O0FBWEg7QUFBQTtBQUFBLHVDQWFtQkMsR0FibkIsRUFhd0I7QUFDcEJmLGdCQUFRZ0IsR0FBUixDQUFZLE9BQVosRUFBcUJDLGFBQXJCLENBQW1DLDJCQUFuQyxFQUFnRSxFQUFDQyxNQUFNLE9BQVAsRUFBaEUsRUFBaUYsSUFBakY7QUFDRDtBQWZIO0FBQUE7QUFBQSxxQ0FpQmlCSCxHQWpCakIsRUFpQnNCO0FBQ2xCLFlBQUlBLElBQUlJLElBQUosQ0FBU0MsSUFBVCxJQUFpQixNQUFyQixFQUE2QjtBQUMzQixlQUFLWCxHQUFMLENBQVNZLFdBQVQsQ0FBcUIsZ0JBQXJCLEVBQXVDTixJQUFJSSxJQUFKLENBQVNHLEtBQWhEO0FBQ0EsZUFBS0MsaUJBQUwsQ0FBdUJSLElBQUlTLGFBQTNCO0FBQ0Q7QUFDSDtBQXRCRjtBQUFBO0FBQUEsd0NBd0JvQnBCLEtBeEJwQixFQXdCMkI7QUFDdkIsWUFBSUEsTUFBTVksR0FBTixDQUFVLE1BQVYsQ0FBSixFQUF1QjtBQUNyQixlQUFLUyxZQUFMO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBS1gsYUFBTDtBQUNEO0FBQ0Y7QUE5Qkg7QUFBQTtBQUFBLHFDQWdDaUI7QUFDYjtBQUNBLGFBQUtMLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGVBQWQsRUFBK0JnQixVQUEvQixDQUEwQyxVQUExQztBQUNEO0FBbkNIO0FBQUE7QUFBQSxzQ0FxQ2tCO0FBQ2Q7QUFDQSxhQUFLakIsR0FBTCxDQUFTQyxJQUFULENBQWMsZUFBZCxFQUErQmlCLElBQS9CLENBQW9DLFVBQXBDLEVBQWdELElBQWhEO0FBQ0Q7QUF4Q0g7QUFBQTtBQUFBLGtDQTBDY0MsS0ExQ2QsRUEwQ3FCO0FBQ2pCNUIsZ0JBQVFnQixHQUFSLENBQVksT0FBWixFQUFxQkMsYUFBckIsQ0FBbUMsMkJBQW5DLEVBQWdFLEVBQUNZLFNBQVMsU0FBVixFQUFoRSxFQUFzRixJQUF0RjtBQUNEO0FBNUNIOztBQUFBO0FBQUEsSUFBcUMzQixPQUFyQztBQThDRCxDQTFERCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2Jsb2NrbHl0YWIvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi90YWIuaHRtbCcpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgTW9kZWxpbmdUYWJWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX29uVGFiQ2xpY2snLCAnX29uTW9kZWxDaGFuZ2UnLCdfb25UcmFuc2l0aW9uRW5kJ10pXG5cbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpXG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5tb2RlbGluZ19fdGFiJykuY2xpY2sodGhpcy5fb25UYWJDbGljaylcbiAgICAgIHRoaXMuJGVsWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0aGlzLl9vblRyYW5zaXRpb25FbmQpXG4gICAgICB0aGlzLmRpc2FibGVGaWVsZHMoKTtcbiAgICB9XG5cbiAgICBfb25UcmFuc2l0aW9uRW5kKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTW9kZWxpbmdUYWIuVHJhbnNpdGlvbkVuZCcsIHt0eXBlOiAnbW9kZWwnfSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGF0aCA9PSBcIm9wZW5cIikge1xuICAgICAgICB0aGlzLiRlbC50b2dnbGVDbGFzcygnbW9kZWxpbmdfX29wZW4nLCBldnQuZGF0YS52YWx1ZSlcbiAgICAgICAgdGhpcy51cGRhdGVGaWVsZFN0YXR1cyhldnQuY3VycmVudFRhcmdldCk7XG4gICAgICB9XG4gICB9XG5cbiAgICB1cGRhdGVGaWVsZFN0YXR1cyhtb2RlbCkge1xuICAgICAgaWYgKG1vZGVsLmdldCgnb3BlbicpKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlRmllbGRzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpc2FibGVGaWVsZHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbmFibGVGaWVsZHMoKSB7XG4gICAgICAvL3RoaXMuX2dyYXBoU2VsZWN0LmVuYWJsZSgpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnaW5wdXQsIGJ1dHRvbicpLnJlbW92ZVByb3AoJ2Rpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgZGlzYWJsZUZpZWxkcygpIHtcbiAgICAgIC8vdGhpcy5fZ3JhcGhTZWxlY3QuZGlzYWJsZSgpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnaW5wdXQsIGJ1dHRvbicpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgX29uVGFiQ2xpY2soanFldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ01vZGVsaW5nVGFiLlRvZ2dsZVJlcXVlc3QnLCB7dGFiVHlwZTogJ2Jsb2NrbHknfSwgdHJ1ZSk7XG4gICAgfVxuICB9XG59KVxuIl19
