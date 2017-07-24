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

      if (Globals.get('AppConfig.aggregate')) _this.tab = new AggregateDataTab();
      return _this;
    }

    _createClass(AggregateDataModule, [{
      key: 'run',
      value: function run() {
        if (this.tab) Globals.get('Layout').getPanel('result').addContent(this.tab.view());
      }
    }]);

    return AggregateDataModule;
  }(Module);

  return AggregateDataModule;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTW9kdWxlIiwiQWdncmVnYXRlRGF0YVRhYiIsIkFnZ3JlZ2F0ZURhdGFNb2R1bGUiLCJnZXQiLCJ0YWIiLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxTQUFTSixRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFSyxtQkFBbUJMLFFBQVEsV0FBUixDQURyQjs7QUFMa0IsTUFRWk0sbUJBUlk7QUFBQTs7QUFTaEIsbUNBQWM7QUFBQTs7QUFBQTs7QUFFWixVQUFJSixRQUFRSyxHQUFSLENBQVkscUJBQVosQ0FBSixFQUF3QyxNQUFLQyxHQUFMLEdBQVcsSUFBSUgsZ0JBQUosRUFBWDtBQUY1QjtBQUdiOztBQVplO0FBQUE7QUFBQSw0QkFjVjtBQUNKLFlBQUksS0FBS0csR0FBVCxFQUFjTixRQUFRSyxHQUFSLENBQVksUUFBWixFQUFzQkUsUUFBdEIsQ0FBK0IsUUFBL0IsRUFBeUNDLFVBQXpDLENBQW9ELEtBQUtGLEdBQUwsQ0FBU0csSUFBVCxFQUFwRDtBQUNmO0FBaEJlOztBQUFBO0FBQUEsSUFRZ0JQLE1BUmhCOztBQW1CbEIsU0FBT0UsbUJBQVA7QUFDRCxDQXBCRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9hZ2dyZWdhdGUvbW9kdWxlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
