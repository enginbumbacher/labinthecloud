'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Globals = require('core/model/globals');

  return function (_Module) {
    _inherits(EuglenaModule, _Module);

    function EuglenaModule() {
      _classCallCheck(this, EuglenaModule);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(EuglenaModule).call(this));
    }

    _createClass(EuglenaModule, [{
      key: 'run',
      value: function run() {
        Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });
      }
    }]);

    return EuglenaModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFNBQVMsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDSSxVQUFVLFFBQVEsb0JBQVIsQ0FEZDs7QUFJQTtBQUFBOztBQUNFLDZCQUFjO0FBQUE7O0FBQUE7QUFFYjs7QUFISDtBQUFBO0FBQUEsNEJBS1E7QUFDSixnQkFBUSxHQUFSLENBQVksT0FBWixFQUFxQixhQUFyQixDQUFtQyxpQkFBbkMsRUFBc0QsRUFBRSxPQUFPLE9BQVQsRUFBdEQ7QUFDRDtBQVBIOztBQUFBO0FBQUEsSUFBbUMsTUFBbkM7QUFTRCxDQWREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
