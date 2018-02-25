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
      Globals.get('Relay').addEventListener('Notifications.Add', _this._onDisableRequest);
      Globals.get('Relay').addEventListener('Notifications.Remove', _this._onEnableRequest);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2lwX3RhYnMvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJITSIsIlRhYnMiLCJVdGlscyIsIkdsb2JhbHMiLCJMb2NhbE1vZGFsIiwiYmluZE1ldGhvZHMiLCJfdGFicyIsImNyZWF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UYWJDaGFuZ2UiLCJfbW9kYWwiLCJzZXQiLCJnZXQiLCJfb25QaGFzZUNoYW5nZSIsIl9vblRhYlJlcXVlc3QiLCJfb25EaXNhYmxlUmVxdWVzdCIsIl9vbkVuYWJsZVJlcXVlc3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRhYnMiLCJpbnZva2UiLCJmb3JFYWNoIiwidGFiQ29uZiIsImluZCIsImJ1aWxkVGFiIiwiZ2V0UGFuZWwiLCJhZGRDb250ZW50IiwidmlldyIsImV2dCIsImRhdGEiLCJwaGFzZSIsInJlbW92ZUNvbnRlbnQiLCJzZWxlY3RUYWIiLCJnZXRUYWJzIiwiaWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJ0YWJUeXBlIiwiX21vZGVsIiwiX2RhdGEiLCJmaWx0ZXIiLCJ0YWJJZCIsImRpc2FibGVUYWIiLCJlbmFibGVUYWIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUUsS0FBS0YsUUFBUSx5QkFBUixDQURQO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSwwQkFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWO0FBQUEsTUFJRUssVUFBVUwsUUFBUSxvQkFBUixDQUpaO0FBQUEsTUFLRU0sYUFBYU4sUUFBUSxzQ0FBUixDQUxmOztBQU9BQSxVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UscUNBQWM7QUFBQTs7QUFBQTs7QUFFWkksWUFBTUcsV0FBTixRQUF3QixDQUFDLGdCQUFE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QjtBQU9EO0FBaERIO0FBQUE7QUFBQSxvQ0FrRGdCTixHQWxEaEIsRUFrRHFCO0FBQ2pCLFlBQUlBLElBQUlDLElBQUosQ0FBU1UsT0FBYixFQUFzQjtBQUNwQixjQUFNRCxNQUFNLEtBQUtoQyxLQUFMLENBQVdrQyxNQUFYLENBQWtCQyxLQUFsQixDQUF3QnRCLElBQXhCLENBQTZCdUIsTUFBN0IsQ0FBb0MsVUFBQ0osR0FBRCxFQUFTO0FBQUUsbUJBQU9BLElBQUlFLE1BQUosQ0FBV0MsS0FBWCxDQUFpQkYsT0FBakIsSUFBNEJYLElBQUlDLElBQUosQ0FBU1UsT0FBNUM7QUFBb0QsV0FBbkcsRUFBcUcsQ0FBckcsQ0FBWjtBQUNBLGVBQUtqQyxLQUFMLENBQVcwQixTQUFYLENBQXFCTSxJQUFJRSxNQUFKLENBQVdDLEtBQVgsQ0FBaUJQLEVBQXRDO0FBQ0QsU0FIRCxNQUdPO0FBQ0wsZUFBSzVCLEtBQUwsQ0FBVzBCLFNBQVgsQ0FBcUJKLElBQUlDLElBQUosQ0FBU2MsS0FBOUI7QUFDRDtBQUNGO0FBekRIO0FBQUE7QUFBQSx3Q0EyRG9CZixHQTNEcEIsRUEyRHlCO0FBQ3JCLGFBQUt0QixLQUFMLENBQVdzQyxVQUFYLENBQXNCaEIsSUFBSUMsSUFBSixDQUFTYyxLQUEvQjtBQUNEO0FBN0RIO0FBQUE7QUFBQSx1Q0E4RG1CZixHQTlEbkIsRUE4RHdCO0FBQ3BCLGFBQUt0QixLQUFMLENBQVd1QyxTQUFYLENBQXFCakIsSUFBSUMsSUFBSixDQUFTYyxLQUE5QjtBQUNEO0FBaEVIOztBQUFBO0FBQUEsSUFBMkM1QyxNQUEzQztBQWtFRCxDQTVFRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9pcF90YWJzL21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyksXG4gICAgVGFicyA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3RhYnMvdGFicycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIExvY2FsTW9kYWwgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9sb2NhbG1vZGFsL2xvY2FsbW9kYWwnKTtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIEludGVyYWN0aXZlVGFic01vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25QaGFzZUNoYW5nZScsICdfb25UYWJSZXF1ZXN0JywgJ19vbkRpc2FibGVSZXF1ZXN0JywgJ19vbkVuYWJsZVJlcXVlc3QnXSk7XG5cbiAgICAgIHRoaXMuX3RhYnMgPSBUYWJzLmNyZWF0ZSh7fSk7XG4gICAgICB0aGlzLl90YWJzLmFkZEV2ZW50TGlzdGVuZXIoJ1RhYi5DaGFuZ2UnLCB0aGlzLl9vblRhYkNoYW5nZSlcbiAgICAgIHRoaXMuX21vZGFsID0gTG9jYWxNb2RhbC5jcmVhdGUoe30pO1xuICAgICAgR2xvYmFscy5zZXQoJ0ludGVyYWN0aXZlTW9kYWwnLCB0aGlzLl9tb2RhbCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0ludGVyYWN0aXZlVGFicy5UYWJSZXF1ZXN0JywgdGhpcy5fb25UYWJSZXF1ZXN0KVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignSW50ZXJhY3RpdmVUYWJzLkRpc2FibGVSZXF1ZXN0JywgdGhpcy5fb25EaXNhYmxlUmVxdWVzdClcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0ludGVyYWN0aXZlVGFicy5FbmFibGVSZXF1ZXN0JywgdGhpcy5fb25FbmFibGVSZXF1ZXN0KVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxpbmdUYWIuVG9nZ2xlUmVxdWVzdCcsIHRoaXMuX29uVGFiUmVxdWVzdClcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuQWRkJyx0aGlzLl9vbkRpc2FibGVSZXF1ZXN0KTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJyx0aGlzLl9vbkVuYWJsZVJlcXVlc3QpO1xuXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgY29uc3QgdGFicyA9IEhNLmludm9rZSgnSW50ZXJhY3RpdmVUYWJzLkxpc3RUYWJzJywgW10pO1xuICAgICAgdGFicy5mb3JFYWNoKCh0YWJDb25mLCBpbmQpID0+IHtcbiAgICAgICAgdGhpcy5fdGFicy5idWlsZFRhYih0YWJDb25mKTtcbiAgICAgIH0pO1xuICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLmFkZENvbnRlbnQodGhpcy5fbW9kYWwudmlldygpKTtcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSAhPSAnbG9naW4nICYmIGV2dC5kYXRhLnBoYXNlICE9IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLmFkZENvbnRlbnQodGhpcy5fdGFicy52aWV3KCksIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLnJlbW92ZUNvbnRlbnQodGhpcy5fdGFicy52aWV3KCkpO1xuICAgICAgICB0aGlzLl90YWJzLnNlbGVjdFRhYih0aGlzLl90YWJzLmdldFRhYnMoKVswXS5pZCgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25UYWJDaGFuZ2UoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3RhYl9jaGFuZ2UnLFxuICAgICAgICBjYXRlZ29yeTogJ2FwcCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYi5pZCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uVGFiUmVxdWVzdChldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS50YWJUeXBlKSB7XG4gICAgICAgIGNvbnN0IHRhYiA9IHRoaXMuX3RhYnMuX21vZGVsLl9kYXRhLnRhYnMuZmlsdGVyKCh0YWIpID0+IHsgcmV0dXJuIHRhYi5fbW9kZWwuX2RhdGEudGFiVHlwZSA9PSBldnQuZGF0YS50YWJUeXBlfSlbMF07XG4gICAgICAgIHRoaXMuX3RhYnMuc2VsZWN0VGFiKHRhYi5fbW9kZWwuX2RhdGEuaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdGFicy5zZWxlY3RUYWIoZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkRpc2FibGVSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fdGFicy5kaXNhYmxlVGFiKGV2dC5kYXRhLnRhYklkKTtcbiAgICB9XG4gICAgX29uRW5hYmxlUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX3RhYnMuZW5hYmxlVGFiKGV2dC5kYXRhLnRhYklkKTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
