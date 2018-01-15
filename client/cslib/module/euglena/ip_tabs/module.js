'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      HM = require('core/event/hook_manager'),
      Tabs = require('core/component/tabs/tabs'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      LocalModal = require('core/component/localmodal/localmodal');

  require('link!./style.css');

  return function (_Module) {
    _inherits(InteractiveTabsModule, _Module);

    function InteractiveTabsModule() {
      _classCallCheck(this, InteractiveTabsModule);

      var _this = _possibleConstructorReturn(this, (InteractiveTabsModule.__proto__ || Object.getPrototypeOf(InteractiveTabsModule)).call(this));

      Utils.bindMethods(_this, ['_onPhaseChange', '_onTabRequest', '_onDisableRequest', '_onEnableRequest']);

      _this._tabs = Tabs.create({});
      _this._tabs.addEventListener('Tab.Change', _this._onTabChange);
      _this._modal = LocalModal.create({});
      Globals.set('InteractiveModal', _this._modal);
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      Globals.get('Relay').addEventListener('InteractiveTabs.TabRequest', _this._onTabRequest);
      Globals.get('Relay').addEventListener('InteractiveTabs.DisableRequest', _this._onDisableRequest);
      Globals.get('Relay').addEventListener('InteractiveTabs.EnableRequest', _this._onEnableRequest);
      Globals.get('Relay').addEventListener('ModelingTab.ToggleRequest', _this._onTabRequest);

      return _this;
    }

    _createClass(InteractiveTabsModule, [{
      key: 'init',
      value: function init() {
        return Promise.resolve(true);
      }
    }, {
      key: 'run',
      value: function run() {
        var _this2 = this;

        var tabs = HM.invoke('InteractiveTabs.ListTabs', []);
        tabs.forEach(function (tabConf, ind) {
          _this2._tabs.buildTab(tabConf);
        });
        Globals.get('Layout').getPanel('interactive').addContent(this._modal.view());
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase != 'login' && evt.data.phase != "login_attempted") {
          Globals.get('Layout').getPanel('interactive').addContent(this._tabs.view(), 0);
        } else {
          Globals.get('Layout').getPanel('interactive').removeContent(this._tabs.view());
          this._tabs.selectTab(this._tabs.getTabs()[0].id());
        }
      }
    }, {
      key: '_onTabChange',
      value: function _onTabChange(evt) {
        Globals.get('Logger').log({
          type: 'tab_change',
          category: 'app',
          data: {
            tab: evt.data.tab.id()
          }
        });
      }
    }, {
      key: '_onTabRequest',
      value: function _onTabRequest(evt) {
        if (evt.data.tabType) {
          var tab = this._tabs._model._data.tabs.filter(function (tab) {
            return tab._model._data.tabType == evt.data.tabType;
          })[0];
          this._tabs.selectTab(tab._model._data.id);
        } else {
          this._tabs.selectTab(evt.data.tabId);
        }
      }
    }, {
      key: '_onDisableRequest',
      value: function _onDisableRequest(evt) {
        this._tabs.disableTab(evt.data.tabId);
      }
    }, {
      key: '_onEnableRequest',
      value: function _onEnableRequest(evt) {
        this._tabs.enableTab(evt.data.tabId);
      }
    }]);

    return InteractiveTabsModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2lwX3RhYnMvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJITSIsIlRhYnMiLCJVdGlscyIsIkdsb2JhbHMiLCJMb2NhbE1vZGFsIiwiYmluZE1ldGhvZHMiLCJfdGFicyIsImNyZWF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UYWJDaGFuZ2UiLCJfbW9kYWwiLCJzZXQiLCJnZXQiLCJfb25QaGFzZUNoYW5nZSIsIl9vblRhYlJlcXVlc3QiLCJfb25EaXNhYmxlUmVxdWVzdCIsIl9vbkVuYWJsZVJlcXVlc3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRhYnMiLCJpbnZva2UiLCJmb3JFYWNoIiwidGFiQ29uZiIsImluZCIsImJ1aWxkVGFiIiwiZ2V0UGFuZWwiLCJhZGRDb250ZW50IiwidmlldyIsImV2dCIsImRhdGEiLCJwaGFzZSIsInJlbW92ZUNvbnRlbnQiLCJzZWxlY3RUYWIiLCJnZXRUYWJzIiwiaWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJ0YWJUeXBlIiwiX21vZGVsIiwiX2RhdGEiLCJmaWx0ZXIiLCJ0YWJJZCIsImRpc2FibGVUYWIiLCJlbmFibGVUYWIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUUsS0FBS0YsUUFBUSx5QkFBUixDQURQO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSwwQkFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWO0FBQUEsTUFJRUssVUFBVUwsUUFBUSxvQkFBUixDQUpaO0FBQUEsTUFLRU0sYUFBYU4sUUFBUSxzQ0FBUixDQUxmOztBQU9BQSxVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UscUNBQWM7QUFBQTs7QUFBQTs7QUFFWkksWUFBTUcsV0FBTixRQUF3QixDQUFDLGdCQUFE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SUFBeEIsQ0FBNkJ1QixNQUE3QixDQUFvQyxVQUFDSixHQUFELEVBQVM7QUFBRSxtQkFBT0EsSUFBSUUsTUFBSixDQUFXQyxLQUFYLENBQWlCRixPQUFqQixJQUE0QlgsSUFBSUMsSUFBSixDQUFTVSxPQUE1QztBQUFvRCxXQUFuRyxFQUFxRyxDQUFyRyxDQUFaO0FBQ0EsZUFBS2pDLEtBQUwsQ0FBVzBCLFNBQVgsQ0FBcUJNLElBQUlFLE1BQUosQ0FBV0MsS0FBWCxDQUFpQlAsRUFBdEM7QUFDRCxTQUhELE1BR087QUFDTCxlQUFLNUIsS0FBTCxDQUFXMEIsU0FBWCxDQUFxQkosSUFBSUMsSUFBSixDQUFTYyxLQUE5QjtBQUNEO0FBQ0Y7QUF2REg7QUFBQTtBQUFBLHdDQXlEb0JmLEdBekRwQixFQXlEeUI7QUFDckIsYUFBS3RCLEtBQUwsQ0FBV3NDLFVBQVgsQ0FBc0JoQixJQUFJQyxJQUFKLENBQVNjLEtBQS9CO0FBQ0Q7QUEzREg7QUFBQTtBQUFBLHVDQTREbUJmLEdBNURuQixFQTREd0I7QUFDcEIsYUFBS3RCLEtBQUwsQ0FBV3VDLFNBQVgsQ0FBcUJqQixJQUFJQyxJQUFKLENBQVNjLEtBQTlCO0FBQ0Q7QUE5REg7O0FBQUE7QUFBQSxJQUEyQzVDLE1BQTNDO0FBZ0VELENBMUVEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2lwX3RhYnMvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBUYWJzID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvdGFicy90YWJzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgTG9jYWxNb2RhbCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2xvY2FsbW9kYWwvbG9jYWxtb2RhbCcpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgSW50ZXJhY3RpdmVUYWJzTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblBoYXNlQ2hhbmdlJywgJ19vblRhYlJlcXVlc3QnLCAnX29uRGlzYWJsZVJlcXVlc3QnLCAnX29uRW5hYmxlUmVxdWVzdCddKTtcblxuICAgICAgdGhpcy5fdGFicyA9IFRhYnMuY3JlYXRlKHt9KTtcbiAgICAgIHRoaXMuX3RhYnMuYWRkRXZlbnRMaXN0ZW5lcignVGFiLkNoYW5nZScsIHRoaXMuX29uVGFiQ2hhbmdlKVxuICAgICAgdGhpcy5fbW9kYWwgPSBMb2NhbE1vZGFsLmNyZWF0ZSh7fSk7XG4gICAgICBHbG9iYWxzLnNldCgnSW50ZXJhY3RpdmVNb2RhbCcsIHRoaXMuX21vZGFsKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignSW50ZXJhY3RpdmVUYWJzLlRhYlJlcXVlc3QnLCB0aGlzLl9vblRhYlJlcXVlc3QpXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdJbnRlcmFjdGl2ZVRhYnMuRGlzYWJsZVJlcXVlc3QnLCB0aGlzLl9vbkRpc2FibGVSZXF1ZXN0KVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignSW50ZXJhY3RpdmVUYWJzLkVuYWJsZVJlcXVlc3QnLCB0aGlzLl9vbkVuYWJsZVJlcXVlc3QpXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0JywgdGhpcy5fb25UYWJSZXF1ZXN0KVxuXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgY29uc3QgdGFicyA9IEhNLmludm9rZSgnSW50ZXJhY3RpdmVUYWJzLkxpc3RUYWJzJywgW10pO1xuICAgICAgdGFicy5mb3JFYWNoKCh0YWJDb25mLCBpbmQpID0+IHtcbiAgICAgICAgdGhpcy5fdGFicy5idWlsZFRhYih0YWJDb25mKTtcbiAgICAgIH0pO1xuICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLmFkZENvbnRlbnQodGhpcy5fbW9kYWwudmlldygpKTtcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSAhPSAnbG9naW4nICYmIGV2dC5kYXRhLnBoYXNlICE9IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLmFkZENvbnRlbnQodGhpcy5fdGFicy52aWV3KCksIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLnJlbW92ZUNvbnRlbnQodGhpcy5fdGFicy52aWV3KCkpO1xuICAgICAgICB0aGlzLl90YWJzLnNlbGVjdFRhYih0aGlzLl90YWJzLmdldFRhYnMoKVswXS5pZCgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25UYWJDaGFuZ2UoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3RhYl9jaGFuZ2UnLFxuICAgICAgICBjYXRlZ29yeTogJ2FwcCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYi5pZCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uVGFiUmVxdWVzdChldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS50YWJUeXBlKSB7XG4gICAgICAgIGNvbnN0IHRhYiA9IHRoaXMuX3RhYnMuX21vZGVsLl9kYXRhLnRhYnMuZmlsdGVyKCh0YWIpID0+IHsgcmV0dXJuIHRhYi5fbW9kZWwuX2RhdGEudGFiVHlwZSA9PSBldnQuZGF0YS50YWJUeXBlfSlbMF07XG4gICAgICAgIHRoaXMuX3RhYnMuc2VsZWN0VGFiKHRhYi5fbW9kZWwuX2RhdGEuaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdGFicy5zZWxlY3RUYWIoZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkRpc2FibGVSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fdGFicy5kaXNhYmxlVGFiKGV2dC5kYXRhLnRhYklkKTtcbiAgICB9XG4gICAgX29uRW5hYmxlUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX3RhYnMuZW5hYmxlVGFiKGV2dC5kYXRhLnRhYklkKTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
