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

      Utils.bindMethods(_this, ['_onPhaseChange', '_onTabRequest']);

      _this._tabs = Tabs.create({});
      _this._tabs.addEventListener('Tab.Change', _this._onTabChange);
      _this._modal = LocalModal.create({});
      Globals.set('InteractiveModal', _this._modal);
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      Globals.get('Relay').addEventListener('InteractiveTabs.TabRequest', _this._onTabRequest);
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
    }]);

    return InteractiveTabsModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2lwX3RhYnMvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJITSIsIlRhYnMiLCJVdGlscyIsIkdsb2JhbHMiLCJMb2NhbE1vZGFsIiwiYmluZE1ldGhvZHMiLCJfdGFicyIsImNyZWF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UYWJDaGFuZ2UiLCJfbW9kYWwiLCJzZXQiLCJnZXQiLCJfb25QaGFzZUNoYW5nZSIsIl9vblRhYlJlcXVlc3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRhYnMiLCJpbnZva2UiLCJmb3JFYWNoIiwidGFiQ29uZiIsImluZCIsImJ1aWxkVGFiIiwiZ2V0UGFuZWwiLCJhZGRDb250ZW50IiwidmlldyIsImV2dCIsImRhdGEiLCJwaGFzZSIsInJlbW92ZUNvbnRlbnQiLCJzZWxlY3RUYWIiLCJnZXRUYWJzIiwiaWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJ0YWJJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxTQUFTRCxRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFRSxLQUFLRixRQUFRLHlCQUFSLENBRFA7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLDBCQUFSLENBRlQ7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7QUFBQSxNQUlFSyxVQUFVTCxRQUFRLG9CQUFSLENBSlo7QUFBQSxNQUtFTSxhQUFhTixRQUFRLHNDQUFSLENBTGY7O0FBT0FBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxxQ0FBYztBQUFBOztBQUFBOztBQUVaSSxZQUFNRyxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsZUFBbkIsQ0FBeEI7O0FBRUEsWUFBS0MsS0FBTCxHQUFhTCxLQUFLTSxNQUFMLENBQVksRUFBWixDQUFiO0FBQ0EsWUFBS0QsS0FBTCxDQUFXRSxnQkFBWCxDQUE0QixZQUE1QixFQUEwQyxNQUFLQyxZQUEvQztBQUNBLFlBQUtDLE1BQUwsR0FBY04sV0FBV0csTUFBWCxDQUFrQixFQUFsQixDQUFkO0FBQ0FKLGNBQVFRLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxNQUFLRCxNQUFyQztBQUNBUCxjQUFRUyxHQUFSLENBQVksT0FBWixFQUFxQkosZ0JBQXJCLENBQXNDLGlCQUF0QyxFQUF5RCxNQUFLSyxjQUE5RDtBQUNBVixjQUFRUyxHQUFSLENBQVksT0FBWixFQUFxQkosZ0JBQXJCLENBQXNDLDRCQUF0QyxFQUFvRSxNQUFLTSxhQUF6RTtBQVRZO0FBVWI7O0FBWEg7QUFBQTtBQUFBLDZCQWFTO0FBQ0wsZUFBT0MsUUFBUUMsT0FBUixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFmSDtBQUFBO0FBQUEsNEJBaUJRO0FBQUE7O0FBQ0osWUFBTUMsT0FBT2pCLEdBQUdrQixNQUFILENBQVUsMEJBQVYsRUFBc0MsRUFBdEMsQ0FBYjtBQUNBRCxhQUFLRSxPQUFMLENBQWEsVUFBQ0MsT0FBRCxFQUFVQyxHQUFWLEVBQWtCO0FBQzdCLGlCQUFLZixLQUFMLENBQVdnQixRQUFYLENBQW9CRixPQUFwQjtBQUNELFNBRkQ7QUFHQWpCLGdCQUFRUyxHQUFSLENBQVksUUFBWixFQUFzQlcsUUFBdEIsQ0FBK0IsYUFBL0IsRUFBOENDLFVBQTlDLENBQXlELEtBQUtkLE1BQUwsQ0FBWWUsSUFBWixFQUF6RDtBQUNEO0FBdkJIO0FBQUE7QUFBQSxxQ0F5QmlCQyxHQXpCakIsRUF5QnNCO0FBQ2xCLFlBQUlBLElBQUlDLElBQUosQ0FBU0MsS0FBVCxJQUFrQixPQUF0QixFQUErQjtBQUM3QnpCLGtCQUFRUyxHQUFSLENBQVksUUFBWixFQUFzQlcsUUFBdEIsQ0FBK0IsYUFBL0IsRUFBOENDLFVBQTlDLENBQXlELEtBQUtsQixLQUFMLENBQVdtQixJQUFYLEVBQXpELEVBQTRFLENBQTVFO0FBQ0QsU0FGRCxNQUVPO0FBQ0x0QixrQkFBUVMsR0FBUixDQUFZLFFBQVosRUFBc0JXLFFBQXRCLENBQStCLGFBQS9CLEVBQThDTSxhQUE5QyxDQUE0RCxLQUFLdkIsS0FBTCxDQUFXbUIsSUFBWCxFQUE1RDtBQUNBLGVBQUtuQixLQUFMLENBQVd3QixTQUFYLENBQXFCLEtBQUt4QixLQUFMLENBQVd5QixPQUFYLEdBQXFCLENBQXJCLEVBQXdCQyxFQUF4QixFQUFyQjtBQUNEO0FBQ0Y7QUFoQ0g7QUFBQTtBQUFBLG1DQWtDZU4sR0FsQ2YsRUFrQ29CO0FBQ2hCdkIsZ0JBQVFTLEdBQVIsQ0FBWSxRQUFaLEVBQXNCcUIsR0FBdEIsQ0FBMEI7QUFDeEJDLGdCQUFNLFlBRGtCO0FBRXhCQyxvQkFBVSxLQUZjO0FBR3hCUixnQkFBTTtBQUNKUyxpQkFBS1YsSUFBSUMsSUFBSixDQUFTUyxHQUFULENBQWFKLEVBQWI7QUFERDtBQUhrQixTQUExQjtBQU9EO0FBMUNIO0FBQUE7QUFBQSxvQ0E0Q2dCTixHQTVDaEIsRUE0Q3FCO0FBQ2pCLGFBQUtwQixLQUFMLENBQVd3QixTQUFYLENBQXFCSixJQUFJQyxJQUFKLENBQVNVLEtBQTlCO0FBQ0Q7QUE5Q0g7O0FBQUE7QUFBQSxJQUEyQ3RDLE1BQTNDO0FBZ0RELENBMUREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2lwX3RhYnMvbW9kdWxlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
