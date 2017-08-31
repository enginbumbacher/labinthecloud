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
        if (evt.data.phase != 'login') {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2lwX3RhYnMvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJITSIsIlRhYnMiLCJVdGlscyIsIkdsb2JhbHMiLCJMb2NhbE1vZGFsIiwiYmluZE1ldGhvZHMiLCJfdGFicyIsImNyZWF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UYWJDaGFuZ2UiLCJfbW9kYWwiLCJzZXQiLCJnZXQiLCJfb25QaGFzZUNoYW5nZSIsIl9vblRhYlJlcXVlc3QiLCJfb25EaXNhYmxlUmVxdWVzdCIsIl9vbkVuYWJsZVJlcXVlc3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRhYnMiLCJpbnZva2UiLCJmb3JFYWNoIiwidGFiQ29uZiIsImluZCIsImJ1aWxkVGFiIiwiZ2V0UGFuZWwiLCJhZGRDb250ZW50IiwidmlldyIsImV2dCIsImRhdGEiLCJwaGFzZSIsInJlbW92ZUNvbnRlbnQiLCJzZWxlY3RUYWIiLCJnZXRUYWJzIiwiaWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJ0YWJJZCIsImRpc2FibGVUYWIiLCJlbmFibGVUYWIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUUsS0FBS0YsUUFBUSx5QkFBUixDQURQO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSwwQkFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWO0FBQUEsTUFJRUssVUFBVUwsUUFBUSxvQkFBUixDQUpaO0FBQUEsTUFLRU0sYUFBYU4sUUFBUSxzQ0FBUixDQUxmOztBQU9BQSxVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UscUNBQWM7QUFBQTs7QUFBQTs7QUFFWkksWUFBTUcsV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLGVBQW5CLEVBQW9DLG1CQUFwQyxFQUF5RCxrQkFB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
