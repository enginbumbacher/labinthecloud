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

      Utils.bindMethods(_this, ['_onPhaseChange']);

      _this._tabs = Tabs.create({});
      _this._tabs.addEventListener('Tab.Change', _this._onTabChange);
      _this._modal = LocalModal.create({});
      Globals.set('InteractiveModal', _this._modal);
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
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
    }]);

    return InteractiveTabsModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2lwX3RhYnMvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJITSIsIlRhYnMiLCJVdGlscyIsIkdsb2JhbHMiLCJMb2NhbE1vZGFsIiwiYmluZE1ldGhvZHMiLCJfdGFicyIsImNyZWF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UYWJDaGFuZ2UiLCJfbW9kYWwiLCJzZXQiLCJnZXQiLCJfb25QaGFzZUNoYW5nZSIsIlByb21pc2UiLCJyZXNvbHZlIiwidGFicyIsImludm9rZSIsImZvckVhY2giLCJ0YWJDb25mIiwiaW5kIiwiYnVpbGRUYWIiLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwicmVtb3ZlQ29udGVudCIsInNlbGVjdFRhYiIsImdldFRhYnMiLCJpZCIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsInRhYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxTQUFTRCxRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFRSxLQUFLRixRQUFRLHlCQUFSLENBRFA7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLDBCQUFSLENBRlQ7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7QUFBQSxNQUlFSyxVQUFVTCxRQUFRLG9CQUFSLENBSlo7QUFBQSxNQUtFTSxhQUFhTixRQUFRLHNDQUFSLENBTGY7O0FBT0FBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxxQ0FBYztBQUFBOztBQUFBOztBQUVaSSxZQUFNRyxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsQ0FBeEI7O0FBRUEsWUFBS0MsS0FBTCxHQUFhTCxLQUFLTSxNQUFMLENBQVksRUFBWixDQUFiO0FBQ0EsWUFBS0QsS0FBTCxDQUFXRSxnQkFBWCxDQUE0QixZQUE1QixFQUEwQyxNQUFLQyxZQUEvQztBQUNBLFlBQUtDLE1BQUwsR0FBY04sV0FBV0csTUFBWCxDQUFrQixFQUFsQixDQUFkO0FBQ0FKLGNBQVFRLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxNQUFLRCxNQUFyQztBQUNBUCxjQUFRUyxHQUFSLENBQVksT0FBWixFQUFxQkosZ0JBQXJCLENBQXNDLGlCQUF0QyxFQUF5RCxNQUFLSyxjQUE5RDtBQVJZO0FBU2I7O0FBVkg7QUFBQTtBQUFBLDZCQVlTO0FBQ0wsZUFBT0MsUUFBUUMsT0FBUixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFkSDtBQUFBO0FBQUEsNEJBZ0JRO0FBQUE7O0FBQ0osWUFBTUMsT0FBT2hCLEdBQUdpQixNQUFILENBQVUsMEJBQVYsRUFBc0MsRUFBdEMsQ0FBYjtBQUNBRCxhQUFLRSxPQUFMLENBQWEsVUFBQ0MsT0FBRCxFQUFVQyxHQUFWLEVBQWtCO0FBQzdCLGlCQUFLZCxLQUFMLENBQVdlLFFBQVgsQ0FBb0JGLE9BQXBCO0FBQ0QsU0FGRDtBQUdBaEIsZ0JBQVFTLEdBQVIsQ0FBWSxRQUFaLEVBQXNCVSxRQUF0QixDQUErQixhQUEvQixFQUE4Q0MsVUFBOUMsQ0FBeUQsS0FBS2IsTUFBTCxDQUFZYyxJQUFaLEVBQXpEO0FBQ0Q7QUF0Qkg7QUFBQTtBQUFBLHFDQXdCaUJDLEdBeEJqQixFQXdCc0I7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTQyxLQUFULElBQWtCLE9BQXRCLEVBQStCO0FBQzdCeEIsa0JBQVFTLEdBQVIsQ0FBWSxRQUFaLEVBQXNCVSxRQUF0QixDQUErQixhQUEvQixFQUE4Q0MsVUFBOUMsQ0FBeUQsS0FBS2pCLEtBQUwsQ0FBV2tCLElBQVgsRUFBekQsRUFBNEUsQ0FBNUU7QUFDRCxTQUZELE1BRU87QUFDTHJCLGtCQUFRUyxHQUFSLENBQVksUUFBWixFQUFzQlUsUUFBdEIsQ0FBK0IsYUFBL0IsRUFBOENNLGFBQTlDLENBQTRELEtBQUt0QixLQUFMLENBQVdrQixJQUFYLEVBQTVEO0FBQ0EsZUFBS2xCLEtBQUwsQ0FBV3VCLFNBQVgsQ0FBcUIsS0FBS3ZCLEtBQUwsQ0FBV3dCLE9BQVgsR0FBcUIsQ0FBckIsRUFBd0JDLEVBQXhCLEVBQXJCO0FBQ0Q7QUFDRjtBQS9CSDtBQUFBO0FBQUEsbUNBaUNlTixHQWpDZixFQWlDb0I7QUFDaEJ0QixnQkFBUVMsR0FBUixDQUFZLFFBQVosRUFBc0JvQixHQUF0QixDQUEwQjtBQUN4QkMsZ0JBQU0sWUFEa0I7QUFFeEJDLG9CQUFVLEtBRmM7QUFHeEJSLGdCQUFNO0FBQ0pTLGlCQUFLVixJQUFJQyxJQUFKLENBQVNTLEdBQVQsQ0FBYUosRUFBYjtBQUREO0FBSGtCLFNBQTFCO0FBT0Q7QUF6Q0g7O0FBQUE7QUFBQSxJQUEyQ2hDLE1BQTNDO0FBMkNELENBckREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2lwX3RhYnMvbW9kdWxlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
