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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2lwX3RhYnMvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJITSIsIlRhYnMiLCJVdGlscyIsIkdsb2JhbHMiLCJMb2NhbE1vZGFsIiwiYmluZE1ldGhvZHMiLCJfdGFicyIsImNyZWF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UYWJDaGFuZ2UiLCJfbW9kYWwiLCJzZXQiLCJnZXQiLCJfb25QaGFzZUNoYW5nZSIsIlByb21pc2UiLCJyZXNvbHZlIiwidGFicyIsImludm9rZSIsImZvckVhY2giLCJ0YWJDb25mIiwiaW5kIiwiYnVpbGRUYWIiLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwicmVtb3ZlQ29udGVudCIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsInRhYiIsImlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFNBQVNELFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VFLEtBQUtGLFFBQVEseUJBQVIsQ0FEUDtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsMEJBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjtBQUFBLE1BSUVLLFVBQVVMLFFBQVEsb0JBQVIsQ0FKWjtBQUFBLE1BS0VNLGFBQWFOLFFBQVEsc0NBQVIsQ0FMZjs7QUFPQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLHFDQUFjO0FBQUE7O0FBQUE7O0FBRVpJLFlBQU1HLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxDQUF4Qjs7QUFFQSxZQUFLQyxLQUFMLEdBQWFMLEtBQUtNLE1BQUwsQ0FBWSxFQUFaLENBQWI7QUFDQSxZQUFLRCxLQUFMLENBQVdFLGdCQUFYLENBQTRCLFlBQTVCLEVBQTBDLE1BQUtDLFlBQS9DO0FBQ0EsWUFBS0MsTUFBTCxHQUFjTixXQUFXRyxNQUFYLENBQWtCLEVBQWxCLENBQWQ7QUFDQUosY0FBUVEsR0FBUixDQUFZLGtCQUFaLEVBQWdDLE1BQUtELE1BQXJDO0FBQ0FQLGNBQVFTLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSixnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUtLLGNBQTlEO0FBUlk7QUFTYjs7QUFWSDtBQUFBO0FBQUEsNkJBWVM7QUFDTCxlQUFPQyxRQUFRQyxPQUFSLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQWRIO0FBQUE7QUFBQSw0QkFnQlE7QUFBQTs7QUFDSixZQUFNQyxPQUFPaEIsR0FBR2lCLE1BQUgsQ0FBVSwwQkFBVixFQUFzQyxFQUF0QyxDQUFiO0FBQ0FELGFBQUtFLE9BQUwsQ0FBYSxVQUFDQyxPQUFELEVBQVVDLEdBQVYsRUFBa0I7QUFDN0IsaUJBQUtkLEtBQUwsQ0FBV2UsUUFBWCxDQUFvQkYsT0FBcEI7QUFDRCxTQUZEO0FBR0FoQixnQkFBUVMsR0FBUixDQUFZLFFBQVosRUFBc0JVLFFBQXRCLENBQStCLGFBQS9CLEVBQThDQyxVQUE5QyxDQUF5RCxLQUFLYixNQUFMLENBQVljLElBQVosRUFBekQ7QUFDRDtBQXRCSDtBQUFBO0FBQUEscUNBd0JpQkMsR0F4QmpCLEVBd0JzQjtBQUNsQixZQUFJQSxJQUFJQyxJQUFKLENBQVNDLEtBQVQsSUFBa0IsT0FBdEIsRUFBK0I7QUFDN0J4QixrQkFBUVMsR0FBUixDQUFZLFFBQVosRUFBc0JVLFFBQXRCLENBQStCLGFBQS9CLEVBQThDQyxVQUE5QyxDQUF5RCxLQUFLakIsS0FBTCxDQUFXa0IsSUFBWCxFQUF6RCxFQUE0RSxDQUE1RTtBQUNELFNBRkQsTUFFTztBQUNMckIsa0JBQVFTLEdBQVIsQ0FBWSxRQUFaLEVBQXNCVSxRQUF0QixDQUErQixhQUEvQixFQUE4Q00sYUFBOUMsQ0FBNEQsS0FBS3RCLEtBQUwsQ0FBV2tCLElBQVgsRUFBNUQ7QUFDRDtBQUNGO0FBOUJIO0FBQUE7QUFBQSxtQ0FnQ2VDLEdBaENmLEVBZ0NvQjtBQUNoQnRCLGdCQUFRUyxHQUFSLENBQVksUUFBWixFQUFzQmlCLEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxZQURrQjtBQUV4QkMsb0JBQVUsS0FGYztBQUd4QkwsZ0JBQU07QUFDSk0saUJBQUtQLElBQUlDLElBQUosQ0FBU00sR0FBVCxDQUFhQyxFQUFiO0FBREQ7QUFIa0IsU0FBMUI7QUFPRDtBQXhDSDs7QUFBQTtBQUFBLElBQTJDbEMsTUFBM0M7QUEwQ0QsQ0FwREQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvaXBfdGFicy9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
