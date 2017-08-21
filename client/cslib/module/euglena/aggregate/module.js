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
        Utils.bindMethods(_this, ['_onPhaseChange']);
        _this.tab = new AggregateDataTab();
        Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
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
        } else {
          this.tab.show();
        }
      }
    }]);

    return AggregateDataModule;
  }(Module);

  return AggregateDataModule;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTW9kdWxlIiwiQWdncmVnYXRlRGF0YVRhYiIsIkFnZ3JlZ2F0ZURhdGFNb2R1bGUiLCJnZXQiLCJiaW5kTWV0aG9kcyIsInRhYiIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25QaGFzZUNoYW5nZSIsImdldFBhbmVsIiwiYWRkQ29udGVudCIsInZpZXciLCJldnQiLCJkYXRhIiwicGhhc2UiLCJoaWRlIiwic2hvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssbUJBQW1CTCxRQUFRLFdBQVIsQ0FEckI7O0FBTGtCLE1BUVpNLG1CQVJZO0FBQUE7O0FBU2hCLG1DQUFjO0FBQUE7O0FBQUE7O0FBRVosVUFBSUosUUFBUUssR0FBUixDQUFZLHFCQUFaLENBQUosRUFBd0M7QUFDdENOLGNBQU1PLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxDQUF4QjtBQUNBLGNBQUtDLEdBQUwsR0FBVyxJQUFJSixnQkFBSixFQUFYO0FBQ0FILGdCQUFRSyxHQUFSLENBQVksT0FBWixFQUFxQkcsZ0JBQXJCLENBQXNDLGlCQUF0QyxFQUF5RCxNQUFLQyxjQUE5RDtBQUNEO0FBTlc7QUFPYjs7QUFoQmU7QUFBQTtBQUFBLDRCQWtCVjtBQUNKLFlBQUksS0FBS0YsR0FBVCxFQUFjUCxRQUFRSyxHQUFSLENBQVksUUFBWixFQUFzQkssUUFBdEIsQ0FBK0IsUUFBL0IsRUFBeUNDLFVBQXpDLENBQW9ELEtBQUtKLEdBQUwsQ0FBU0ssSUFBVCxFQUFwRDtBQUNmO0FBcEJlO0FBQUE7QUFBQSxxQ0FzQkRDLEdBdEJDLEVBc0JJO0FBQ2xCLFlBQUlBLElBQUlDLElBQUosQ0FBU0MsS0FBVCxJQUFrQixPQUF0QixFQUErQjtBQUM3QixlQUFLUixHQUFMLENBQVNTLElBQVQ7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLVCxHQUFMLENBQVNVLElBQVQ7QUFDRDtBQUNGO0FBNUJlOztBQUFBO0FBQUEsSUFRZ0JmLE1BUmhCOztBQStCbEIsU0FBT0UsbUJBQVA7QUFDRCxDQWhDRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9hZ2dyZWdhdGUvbW9kdWxlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
