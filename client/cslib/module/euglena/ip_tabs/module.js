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
        this._tabs.selectTab(evt.data.tabId);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2lwX3RhYnMvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJITSIsIlRhYnMiLCJVdGlscyIsIkdsb2JhbHMiLCJMb2NhbE1vZGFsIiwiYmluZE1ldGhvZHMiLCJfdGFicyIsImNyZWF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UYWJDaGFuZ2UiLCJfbW9kYWwiLCJzZXQiLCJnZXQiLCJfb25QaGFzZUNoYW5nZSIsIl9vblRhYlJlcXVlc3QiLCJfb25EaXNhYmxlUmVxdWVzdCIsIl9vbkVuYWJsZVJlcXVlc3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRhYnMiLCJpbnZva2UiLCJmb3JFYWNoIiwidGFiQ29uZiIsImluZCIsImJ1aWxkVGFiIiwiZ2V0UGFuZWwiLCJhZGRDb250ZW50IiwidmlldyIsImV2dCIsImRhdGEiLCJwaGFzZSIsInJlbW92ZUNvbnRlbnQiLCJzZWxlY3RUYWIiLCJnZXRUYWJzIiwiaWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJ0YWJJZCIsImRpc2FibGVUYWIiLCJlbmFibGVUYWIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUUsS0FBS0YsUUFBUSx5QkFBUixDQURQO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSwwQkFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWO0FBQUEsTUFJRUssVUFBVUwsUUFBUSxvQkFBUixDQUpaO0FBQUEsTUFLRU0sYUFBYU4sUUFBUSxzQ0FBUixDQUxmOztBQU9BQSxVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UscUNBQWM7QUFBQTs7QUFBQTs7QUFFWkksWUFBTUcsV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLGVBQW5CLEVBQW9DLG1CQUFwQyxFQUF5RCxrQkFB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QixhQUFLdEIsS0FBTCxDQUFXbUMsU0FBWCxDQUFxQmIsSUFBSUMsSUFBSixDQUFTVSxLQUE5QjtBQUNEO0FBdkRIOztBQUFBO0FBQUEsSUFBMkN4QyxNQUEzQztBQXlERCxDQW5FRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9pcF90YWJzL21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyksXG4gICAgVGFicyA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3RhYnMvdGFicycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIExvY2FsTW9kYWwgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9sb2NhbG1vZGFsL2xvY2FsbW9kYWwnKTtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIEludGVyYWN0aXZlVGFic01vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25QaGFzZUNoYW5nZScsICdfb25UYWJSZXF1ZXN0JywgJ19vbkRpc2FibGVSZXF1ZXN0JywgJ19vbkVuYWJsZVJlcXVlc3QnXSk7XG5cbiAgICAgIHRoaXMuX3RhYnMgPSBUYWJzLmNyZWF0ZSh7fSk7XG4gICAgICB0aGlzLl90YWJzLmFkZEV2ZW50TGlzdGVuZXIoJ1RhYi5DaGFuZ2UnLCB0aGlzLl9vblRhYkNoYW5nZSlcbiAgICAgIHRoaXMuX21vZGFsID0gTG9jYWxNb2RhbC5jcmVhdGUoe30pO1xuICAgICAgR2xvYmFscy5zZXQoJ0ludGVyYWN0aXZlTW9kYWwnLCB0aGlzLl9tb2RhbCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0ludGVyYWN0aXZlVGFicy5UYWJSZXF1ZXN0JywgdGhpcy5fb25UYWJSZXF1ZXN0KVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignSW50ZXJhY3RpdmVUYWJzLkRpc2FibGVSZXF1ZXN0JywgdGhpcy5fb25EaXNhYmxlUmVxdWVzdClcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0ludGVyYWN0aXZlVGFicy5FbmFibGVSZXF1ZXN0JywgdGhpcy5fb25FbmFibGVSZXF1ZXN0KVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cblxuICAgIHJ1bigpIHtcbiAgICAgIGNvbnN0IHRhYnMgPSBITS5pbnZva2UoJ0ludGVyYWN0aXZlVGFicy5MaXN0VGFicycsIFtdKTtcbiAgICAgIHRhYnMuZm9yRWFjaCgodGFiQ29uZiwgaW5kKSA9PiB7XG4gICAgICAgIHRoaXMuX3RhYnMuYnVpbGRUYWIodGFiQ29uZik7XG4gICAgICB9KTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMYXlvdXQnKS5nZXRQYW5lbCgnaW50ZXJhY3RpdmUnKS5hZGRDb250ZW50KHRoaXMuX21vZGFsLnZpZXcoKSk7XG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgIT0gJ2xvZ2luJyAmJiBldnQuZGF0YS5waGFzZSAhPSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMYXlvdXQnKS5nZXRQYW5lbCgnaW50ZXJhY3RpdmUnKS5hZGRDb250ZW50KHRoaXMuX3RhYnMudmlldygpLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMYXlvdXQnKS5nZXRQYW5lbCgnaW50ZXJhY3RpdmUnKS5yZW1vdmVDb250ZW50KHRoaXMuX3RhYnMudmlldygpKTtcbiAgICAgICAgdGhpcy5fdGFicy5zZWxlY3RUYWIodGhpcy5fdGFicy5nZXRUYWJzKClbMF0uaWQoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uVGFiQ2hhbmdlKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICd0YWJfY2hhbmdlJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdhcHAnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdGFiOiBldnQuZGF0YS50YWIuaWQoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblRhYlJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl90YWJzLnNlbGVjdFRhYihldnQuZGF0YS50YWJJZCk7XG4gICAgfVxuXG4gICAgX29uRGlzYWJsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl90YWJzLmRpc2FibGVUYWIoZXZ0LmRhdGEudGFiSWQpO1xuICAgIH1cbiAgICBfb25FbmFibGVSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fdGFicy5lbmFibGVUYWIoZXZ0LmRhdGEudGFiSWQpO1xuICAgIH1cbiAgfVxufSlcbiJdfQ==
