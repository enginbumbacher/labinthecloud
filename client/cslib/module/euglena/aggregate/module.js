'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Module = require('core/app/module'),
      AggregateDataTab = require('./tab/tab');

  var AggregateDataModule = function (_Module) {
    _inherits(AggregateDataModule, _Module);

    function AggregateDataModule() {
      _classCallCheck(this, AggregateDataModule);

      var _this = _possibleConstructorReturn(this, (AggregateDataModule.__proto__ || Object.getPrototypeOf(AggregateDataModule)).call(this));

      if (Globals.get('AppConfig.aggregate')) {
        Utils.bindMethods(_this, ['_onPhaseChange', '_onExperimentCountChange']);
        _this.tab = new AggregateDataTab();
        Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
        Globals.get('Relay').addEventListener('ExperimentCount.Change', _this._onExperimentCountChange);
      }
      return _this;
    }

    _createClass(AggregateDataModule, [{
      key: 'run',
      value: function run() {
        if (this.tab) Globals.get('Layout').getPanel('result').addContent(this.tab.view());
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase == "login") {
          this.tab.hide();
        }
      }
    }, {
      key: '_onExperimentCountChange',
      value: function _onExperimentCountChange(evt) {
        if (evt.data.count && !evt.data.old) {
          this.tab.show();
        } else if (!evt.data.count) {
          this.tab.hide();
        }
      }
    }]);

    return AggregateDataModule;
  }(Module);

  return AggregateDataModule;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTW9kdWxlIiwiQWdncmVnYXRlRGF0YVRhYiIsIkFnZ3JlZ2F0ZURhdGFNb2R1bGUiLCJnZXQiLCJiaW5kTWV0aG9kcyIsInRhYiIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25QaGFzZUNoYW5nZSIsIl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSIsImdldFBhbmVsIiwiYWRkQ29udGVudCIsInZpZXciLCJldnQiLCJkYXRhIiwicGhhc2UiLCJoaWRlIiwiY291bnQiLCJvbGQiLCJzaG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxTQUFTSixRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFSyxtQkFBbUJMLFFBQVEsV0FBUixDQURyQjs7QUFMa0IsTUFRWk0sbUJBUlk7QUFBQTs7QUFTaEIsbUNBQWM7QUFBQTs7QUFBQTs7QUFFWixVQUFJSixRQUFRSyxHQUFSLENBQVkscUJBQVosQ0FBSixFQUF3QztBQUN0Q04sY0FBTU8sV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLDBCQUFuQixDQUF4QjtBQUNBLGNBQUtDLEdBQUwsR0FBVyxJQUFJSixnQkFBSixFQUFYO0FBQ0FILGdCQUFRSyxHQUFSLENBQVksT0FBWixFQUFxQkcsZ0JBQXJCLENBQXNDLGlCQUF0QyxFQUF5RCxNQUFLQyxjQUE5RDtBQUNBVCxnQkFBUUssR0FBUixDQUFZLE9BQVosRUFBcUJHLGdCQUFyQixDQUFzQyx3QkFBdEMsRUFBZ0UsTUFBS0Usd0JBQXJFO0FBQ0Q7QUFQVztBQVFiOztBQWpCZTtBQUFBO0FBQUEsNEJBbUJWO0FBQ0osWUFBSSxLQUFLSCxHQUFULEVBQWNQLFFBQVFLLEdBQVIsQ0FBWSxRQUFaLEVBQXNCTSxRQUF0QixDQUErQixRQUEvQixFQUF5Q0MsVUFBekMsQ0FBb0QsS0FBS0wsR0FBTCxDQUFTTSxJQUFULEVBQXBEO0FBQ2Y7QUFyQmU7QUFBQTtBQUFBLHFDQXVCREMsR0F2QkMsRUF1Qkk7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTQyxLQUFULElBQWtCLE9BQXRCLEVBQStCO0FBQzdCLGVBQUtULEdBQUwsQ0FBU1UsSUFBVDtBQUNEO0FBQ0Y7QUEzQmU7QUFBQTtBQUFBLCtDQTZCU0gsR0E3QlQsRUE2QmM7QUFDNUIsWUFBSUEsSUFBSUMsSUFBSixDQUFTRyxLQUFULElBQWtCLENBQUNKLElBQUlDLElBQUosQ0FBU0ksR0FBaEMsRUFBcUM7QUFDbkMsZUFBS1osR0FBTCxDQUFTYSxJQUFUO0FBQ0QsU0FGRCxNQUVPLElBQUksQ0FBQ04sSUFBSUMsSUFBSixDQUFTRyxLQUFkLEVBQXFCO0FBQzFCLGVBQUtYLEdBQUwsQ0FBU1UsSUFBVDtBQUNEO0FBQ0Y7QUFuQ2U7O0FBQUE7QUFBQSxJQVFnQmYsTUFSaEI7O0FBc0NsQixTQUFPRSxtQkFBUDtBQUNELENBdkNEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
