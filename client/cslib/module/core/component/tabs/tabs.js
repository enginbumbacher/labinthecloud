'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      Tab = require('./tab/tab');

  var Tabs = function (_Component) {
    _inherits(Tabs, _Component);

    function Tabs(settings) {
      _classCallCheck(this, Tabs);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, settings));

      Utils.bindMethods(_this, ['_onTabSelected', '_onModelChange']);

      _this.view().addEventListener('Tab.Selected', _this._onTabSelected);
      _this._model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(Tabs, [{
      key: 'addTab',
      value: function addTab(tab) {
        this._model.addTab(tab);
      }
    }, {
      key: 'buildTab',
      value: function buildTab(config) {
        this.addTab(Tab.create(config));
      }
    }, {
      key: 'removeTab',
      value: function removeTab(id) {
        this._model.removeTab(id);
      }
    }, {
      key: 'selectTab',
      value: function selectTab(id) {
        this._model.selectTab(id);
      }
    }, {
      key: 'getTabs',
      value: function getTabs() {
        return this._model.get('tabs');
      }
    }, {
      key: 'disableTab',
      value: function disableTab(id) {
        this._model.disableTab(id);
      }
    }, {
      key: 'enableTab',
      value: function enableTab(id) {
        this._model.enableTab(id);
      }
    }, {
      key: '_onTabSelected',
      value: function _onTabSelected(evt) {
        var tabs = this.getTabs();
        var tab = tabs.filter(function (tab) {
          return tab._model._data.id == evt.data.id;
        })[0];
        if (tab != this._model.currentTab()) {
          Globals.get('Relay').dispatchEvent('Tab.Change', {
            tabId: evt.data.id,
            tabType: tab._model._data.tabType
          });
        }

        if (this._active) this._model.selectTab(evt.data.id);
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == "currentIndex") {
          this.dispatchEvent('Tab.Change', {
            tab: this._model.currentTab()
          });
        }
      }
    }]);

    return Tabs;
  }(Component);

  ;

  Tabs.create = function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new Tabs({ modelData: config });
  };

  return Tabs;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYnMuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIlV0aWxzIiwiR2xvYmFscyIsIlRhYiIsIlRhYnMiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsInZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVGFiU2VsZWN0ZWQiLCJfbW9kZWwiLCJfb25Nb2RlbENoYW5nZSIsInRhYiIsImFkZFRhYiIsImNvbmZpZyIsImNyZWF0ZSIsImlkIiwicmVtb3ZlVGFiIiwic2VsZWN0VGFiIiwiZ2V0IiwiZGlzYWJsZVRhYiIsImVuYWJsZVRhYiIsImV2dCIsInRhYnMiLCJnZXRUYWJzIiwiZmlsdGVyIiwiX2RhdGEiLCJkYXRhIiwiY3VycmVudFRhYiIsImRpc3BhdGNoRXZlbnQiLCJ0YWJJZCIsInRhYlR5cGUiLCJfYWN0aXZlIiwicGF0aCIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjtBQUFBLE1BSUVLLFVBQVVMLFFBQVEsb0JBQVIsQ0FKWjtBQUFBLE1BTUVNLE1BQU1OLFFBQVEsV0FBUixDQU5SOztBQURrQixNQVNaTyxJQVRZO0FBQUE7O0FBVWhCLGtCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCUCxLQUE3QztBQUNBTSxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCUCxJQUEzQzs7QUFGb0IsOEdBR2RLLFFBSGM7O0FBS3BCSixZQUFNTyxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsZ0JBQW5CLENBQXhCOztBQUVBLFlBQUtDLElBQUwsR0FBWUMsZ0JBQVosQ0FBNkIsY0FBN0IsRUFBNkMsTUFBS0MsY0FBbEQ7QUFDQSxZQUFLQyxNQUFMLENBQVlGLGdCQUFaLENBQTZCLGNBQTdCLEVBQTZDLE1BQUtHLGNBQWxEO0FBUm9CO0FBU3JCOztBQW5CZTtBQUFBO0FBQUEsNkJBcUJUQyxHQXJCUyxFQXFCSjtBQUNWLGFBQUtGLE1BQUwsQ0FBWUcsTUFBWixDQUFtQkQsR0FBbkI7QUFDRDtBQXZCZTtBQUFBO0FBQUEsK0JBeUJQRSxNQXpCTyxFQXlCQztBQUNmLGFBQUtELE1BQUwsQ0FBWVosSUFBSWMsTUFBSixDQUFXRCxNQUFYLENBQVo7QUFDRDtBQTNCZTtBQUFBO0FBQUEsZ0NBNkJORSxFQTdCTSxFQTZCRjtBQUNaLGFBQUtOLE1BQUwsQ0FBWU8sU0FBWixDQUFzQkQsRUFBdEI7QUFDRDtBQS9CZTtBQUFBO0FBQUEsZ0NBaUNOQSxFQWpDTSxFQWlDRjtBQUNaLGFBQUtOLE1BQUwsQ0FBWVEsU0FBWixDQUFzQkYsRUFBdEI7QUFDRDtBQW5DZTtBQUFBO0FBQUEsZ0NBcUNOO0FBQ1IsZUFBTyxLQUFLTixNQUFMLENBQVlTLEdBQVosQ0FBZ0IsTUFBaEIsQ0FBUDtBQUNEO0FBdkNlO0FBQUE7QUFBQSxpQ0F5Q0xILEVBekNLLEVBeUNEO0FBQ2IsYUFBS04sTUFBTCxDQUFZVSxVQUFaLENBQXVCSixFQUF2QjtBQUNEO0FBM0NlO0FBQUE7QUFBQSxnQ0E2Q05BLEVBN0NNLEVBNkNGO0FBQ1osYUFBS04sTUFBTCxDQUFZVyxTQUFaLENBQXNCTCxFQUF0QjtBQUNEO0FBL0NlO0FBQUE7QUFBQSxxQ0FpRERNLEdBakRDLEVBaURJO0FBQ2xCLFlBQU1DLE9BQU8sS0FBS0MsT0FBTCxFQUFiO0FBQ0EsWUFBTVosTUFBTVcsS0FBS0UsTUFBTCxDQUFZLFVBQUNiLEdBQUQsRUFBUztBQUFFLGlCQUFPQSxJQUFJRixNQUFKLENBQVdnQixLQUFYLENBQWlCVixFQUFqQixJQUF1Qk0sSUFBSUssSUFBSixDQUFTWCxFQUF2QztBQUEwQyxTQUFqRSxFQUFtRSxDQUFuRSxDQUFaO0FBQ0EsWUFBSUosT0FBTyxLQUFLRixNQUFMLENBQVlrQixVQUFaLEVBQVgsRUFBcUM7QUFDbkM1QixrQkFBUW1CLEdBQVIsQ0FBWSxPQUFaLEVBQXFCVSxhQUFyQixDQUFtQyxZQUFuQyxFQUFpRDtBQUM3Q0MsbUJBQU9SLElBQUlLLElBQUosQ0FBU1gsRUFENkI7QUFFN0NlLHFCQUFTbkIsSUFBSUYsTUFBSixDQUFXZ0IsS0FBWCxDQUFpQks7QUFGbUIsV0FBakQ7QUFJRDs7QUFFRCxZQUFJLEtBQUtDLE9BQVQsRUFBa0IsS0FBS3RCLE1BQUwsQ0FBWVEsU0FBWixDQUFzQkksSUFBSUssSUFBSixDQUFTWCxFQUEvQjtBQUNuQjtBQTVEZTtBQUFBO0FBQUEscUNBOERETSxHQTlEQyxFQThESTtBQUNsQixZQUFJQSxJQUFJSyxJQUFKLENBQVNNLElBQVQsSUFBaUIsY0FBckIsRUFBcUM7QUFDbkMsZUFBS0osYUFBTCxDQUFtQixZQUFuQixFQUFpQztBQUMvQmpCLGlCQUFLLEtBQUtGLE1BQUwsQ0FBWWtCLFVBQVo7QUFEMEIsV0FBakM7QUFHRDtBQUNGO0FBcEVlOztBQUFBO0FBQUEsSUFTQ2hDLFNBVEQ7O0FBcUVqQjs7QUFFRE0sT0FBS2EsTUFBTCxHQUFjLFlBQWlCO0FBQUEsUUFBaEJELE1BQWdCLHVFQUFQLEVBQU87O0FBQzdCLFdBQU8sSUFBSVosSUFBSixDQUFTLEVBQUVnQyxXQUFXcEIsTUFBYixFQUFULENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9aLElBQVA7QUFDRCxDQTVFRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvdGFicy90YWJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcblxuICAgIFRhYiA9IHJlcXVpcmUoJy4vdGFiL3RhYicpO1xuXG4gIGNsYXNzIFRhYnMgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuXG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblRhYlNlbGVjdGVkJywgJ19vbk1vZGVsQ2hhbmdlJ10pXG5cbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ1RhYi5TZWxlY3RlZCcsIHRoaXMuX29uVGFiU2VsZWN0ZWQpXG4gICAgICB0aGlzLl9tb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKVxuICAgIH1cblxuICAgIGFkZFRhYih0YWIpIHtcbiAgICAgIHRoaXMuX21vZGVsLmFkZFRhYih0YWIpO1xuICAgIH1cblxuICAgIGJ1aWxkVGFiKGNvbmZpZykge1xuICAgICAgdGhpcy5hZGRUYWIoVGFiLmNyZWF0ZShjb25maWcpKTtcbiAgICB9XG5cbiAgICByZW1vdmVUYWIoaWQpIHtcbiAgICAgIHRoaXMuX21vZGVsLnJlbW92ZVRhYihpZClcbiAgICB9XG5cbiAgICBzZWxlY3RUYWIoaWQpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNlbGVjdFRhYihpZCk7XG4gICAgfVxuXG4gICAgZ2V0VGFicygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ3RhYnMnKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlVGFiKGlkKSB7XG4gICAgICB0aGlzLl9tb2RlbC5kaXNhYmxlVGFiKGlkKTtcbiAgICB9XG5cbiAgICBlbmFibGVUYWIoaWQpIHtcbiAgICAgIHRoaXMuX21vZGVsLmVuYWJsZVRhYihpZCk7XG4gICAgfVxuXG4gICAgX29uVGFiU2VsZWN0ZWQoZXZ0KSB7XG4gICAgICBjb25zdCB0YWJzID0gdGhpcy5nZXRUYWJzKClcbiAgICAgIGNvbnN0IHRhYiA9IHRhYnMuZmlsdGVyKCh0YWIpID0+IHsgcmV0dXJuIHRhYi5fbW9kZWwuX2RhdGEuaWQgPT0gZXZ0LmRhdGEuaWR9KVswXTtcbiAgICAgIGlmICh0YWIgIT0gdGhpcy5fbW9kZWwuY3VycmVudFRhYigpKSB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ1RhYi5DaGFuZ2UnLCB7XG4gICAgICAgICAgICB0YWJJZDogZXZ0LmRhdGEuaWQsXG4gICAgICAgICAgICB0YWJUeXBlOiB0YWIuX21vZGVsLl9kYXRhLnRhYlR5cGVcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2FjdGl2ZSkgdGhpcy5fbW9kZWwuc2VsZWN0VGFiKGV2dC5kYXRhLmlkKTtcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoID09IFwiY3VycmVudEluZGV4XCIpIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdUYWIuQ2hhbmdlJywge1xuICAgICAgICAgIHRhYjogdGhpcy5fbW9kZWwuY3VycmVudFRhYigpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFRhYnMuY3JlYXRlID0gKGNvbmZpZyA9IHt9KSA9PiB7XG4gICAgcmV0dXJuIG5ldyBUYWJzKHsgbW9kZWxEYXRhOiBjb25maWcgfSlcbiAgfVxuXG4gIHJldHVybiBUYWJzO1xufSlcbiJdfQ==
