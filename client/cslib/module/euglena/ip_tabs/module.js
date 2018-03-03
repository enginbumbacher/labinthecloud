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

      Utils.bindMethods(_this, ['_onPhaseChange', '_onTabRequest', '_onDisableRequest', '_onEnableRequest', '_toggleTabs']);

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

      Globals.get('Relay').addEventListener('InteractiveTabs.Toggle', _this._toggleTabs);
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
    }, {
      key: '_toggleTabs',
      value: function _toggleTabs(evt) {
        if (evt.data.hideTab) {
          document.getElementsByClassName('panel__interactive')[0].style.display = 'none';
        } else {
          document.getElementsByClassName('panel__interactive')[0].style.display = 'block';
        }
      }
    }]);

    return InteractiveTabsModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2lwX3RhYnMvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJITSIsIlRhYnMiLCJVdGlscyIsIkdsb2JhbHMiLCJMb2NhbE1vZGFsIiwiYmluZE1ldGhvZHMiLCJfdGFicyIsImNyZWF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UYWJDaGFuZ2UiLCJfbW9kYWwiLCJzZXQiLCJnZXQiLCJfb25QaGFzZUNoYW5nZSIsIl9vblRhYlJlcXVlc3QiLCJfb25EaXNhYmxlUmVxdWVzdCIsIl9vbkVuYWJsZVJlcXVlc3QiLCJfdG9nZ2xlVGFicyIsIlByb21pc2UiLCJyZXNvbHZlIiwidGFicyIsImludm9rZSIsImZvckVhY2giLCJ0YWJDb25mIiwiaW5kIiwiYnVpbGRUYWIiLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwicmVtb3ZlQ29udGVudCIsInNlbGVjdFRhYiIsImdldFRhYnMiLCJpZCIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsInRhYiIsInRhYlR5cGUiLCJfbW9kZWwiLCJfZGF0YSIsImZpbHRlciIsInRhYklkIiwiZGlzYWJsZVRhYiIsImVuYWJsZVRhYiIsImhpZGVUYWIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJzdHlsZSIsImRpc3BsYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUUsS0FBS0YsUUFBUSx5QkFBUixDQURQO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSwwQkFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWO0FBQUEsTUFJRUssVUFBVUwsUUFBUSxvQkFBUixDQUpaO0FBQUEsTUFLRU0sYUFBYU4sUUFBUSxzQ0FBUixDQUxmOztBQU9BQSxV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O0FBQ3BCQyxtQkFBU0Msc0JBQVQsQ0FBZ0Msb0JBQWhDLEVBQXNELENBQXRELEVBQXlEQyxLQUF6RCxDQUErREMsT0FBL0QsR0FBdUUsTUFBdkU7QUFDRCxTQUZELE1BRU87QUFDTEgsbUJBQVNDLHNCQUFULENBQWdDLG9CQUFoQyxFQUFzRCxDQUF0RCxFQUF5REMsS0FBekQsQ0FBK0RDLE9BQS9ELEdBQXVFLE9BQXZFO0FBQ0Q7QUFDRjtBQXpFSDs7QUFBQTtBQUFBLElBQTJDcEQsTUFBM0M7QUEyRUQsQ0FyRkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvaXBfdGFicy9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIFRhYnMgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC90YWJzL3RhYnMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBMb2NhbE1vZGFsID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvbG9jYWxtb2RhbC9sb2NhbG1vZGFsJyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBJbnRlcmFjdGl2ZVRhYnNNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uUGhhc2VDaGFuZ2UnLCAnX29uVGFiUmVxdWVzdCcsICdfb25EaXNhYmxlUmVxdWVzdCcsICdfb25FbmFibGVSZXF1ZXN0JywnX3RvZ2dsZVRhYnMnXSk7XG5cbiAgICAgIHRoaXMuX3RhYnMgPSBUYWJzLmNyZWF0ZSh7fSk7XG4gICAgICB0aGlzLl90YWJzLmFkZEV2ZW50TGlzdGVuZXIoJ1RhYi5DaGFuZ2UnLCB0aGlzLl9vblRhYkNoYW5nZSlcbiAgICAgIHRoaXMuX21vZGFsID0gTG9jYWxNb2RhbC5jcmVhdGUoe30pO1xuICAgICAgR2xvYmFscy5zZXQoJ0ludGVyYWN0aXZlTW9kYWwnLCB0aGlzLl9tb2RhbCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0ludGVyYWN0aXZlVGFicy5UYWJSZXF1ZXN0JywgdGhpcy5fb25UYWJSZXF1ZXN0KVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignSW50ZXJhY3RpdmVUYWJzLkRpc2FibGVSZXF1ZXN0JywgdGhpcy5fb25EaXNhYmxlUmVxdWVzdClcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0ludGVyYWN0aXZlVGFicy5FbmFibGVSZXF1ZXN0JywgdGhpcy5fb25FbmFibGVSZXF1ZXN0KVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxpbmdUYWIuVG9nZ2xlUmVxdWVzdCcsIHRoaXMuX29uVGFiUmVxdWVzdClcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuQWRkJyx0aGlzLl9vbkRpc2FibGVSZXF1ZXN0KTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJyx0aGlzLl9vbkVuYWJsZVJlcXVlc3QpO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdJbnRlcmFjdGl2ZVRhYnMuVG9nZ2xlJywgdGhpcy5fdG9nZ2xlVGFicyk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgY29uc3QgdGFicyA9IEhNLmludm9rZSgnSW50ZXJhY3RpdmVUYWJzLkxpc3RUYWJzJywgW10pO1xuICAgICAgdGFicy5mb3JFYWNoKCh0YWJDb25mLCBpbmQpID0+IHtcbiAgICAgICAgdGhpcy5fdGFicy5idWlsZFRhYih0YWJDb25mKTtcbiAgICAgIH0pO1xuICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLmFkZENvbnRlbnQodGhpcy5fbW9kYWwudmlldygpKTtcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSAhPSAnbG9naW4nICYmIGV2dC5kYXRhLnBoYXNlICE9IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLmFkZENvbnRlbnQodGhpcy5fdGFicy52aWV3KCksIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLnJlbW92ZUNvbnRlbnQodGhpcy5fdGFicy52aWV3KCkpO1xuICAgICAgICB0aGlzLl90YWJzLnNlbGVjdFRhYih0aGlzLl90YWJzLmdldFRhYnMoKVswXS5pZCgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25UYWJDaGFuZ2UoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3RhYl9jaGFuZ2UnLFxuICAgICAgICBjYXRlZ29yeTogJ2FwcCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYi5pZCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uVGFiUmVxdWVzdChldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS50YWJUeXBlKSB7XG4gICAgICAgIGNvbnN0IHRhYiA9IHRoaXMuX3RhYnMuX21vZGVsLl9kYXRhLnRhYnMuZmlsdGVyKCh0YWIpID0+IHsgcmV0dXJuIHRhYi5fbW9kZWwuX2RhdGEudGFiVHlwZSA9PSBldnQuZGF0YS50YWJUeXBlfSlbMF07XG4gICAgICAgIHRoaXMuX3RhYnMuc2VsZWN0VGFiKHRhYi5fbW9kZWwuX2RhdGEuaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdGFicy5zZWxlY3RUYWIoZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkRpc2FibGVSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fdGFicy5kaXNhYmxlVGFiKGV2dC5kYXRhLnRhYklkKTtcbiAgICB9XG4gICAgX29uRW5hYmxlUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX3RhYnMuZW5hYmxlVGFiKGV2dC5kYXRhLnRhYklkKTtcbiAgICB9XG5cbiAgICBfdG9nZ2xlVGFicyhldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5oaWRlVGFiKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhbmVsX19pbnRlcmFjdGl2ZScpWzBdLnN0eWxlLmRpc3BsYXk9J25vbmUnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFuZWxfX2ludGVyYWN0aXZlJylbMF0uc3R5bGUuZGlzcGxheT0nYmxvY2snO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdfQ==
