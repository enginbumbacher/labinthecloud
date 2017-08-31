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

      return _possibleConstructorReturn(this, (EuglenaModule.__proto__ || Object.getPrototypeOf(EuglenaModule)).call(this));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiR2xvYmFscyIsImdldCIsImRpc3BhdGNoRXZlbnQiLCJwaGFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxTQUFTRCxRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNJRSxVQUFVRixRQUFRLG9CQUFSLENBRGQ7O0FBSUE7QUFBQTs7QUFDRSw2QkFBYztBQUFBOztBQUFBO0FBRWI7O0FBSEg7QUFBQTtBQUFBLDRCQUtRO0FBQ0pFLGdCQUFRQyxHQUFSLENBQVksT0FBWixFQUFxQkMsYUFBckIsQ0FBbUMsaUJBQW5DLEVBQXNELEVBQUVDLE9BQU8sT0FBVCxFQUF0RDtBQUNEO0FBUEg7O0FBQUE7QUFBQSxJQUFtQ0osTUFBbkM7QUFTRCxDQWREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKVxuICAgICwgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpXG4gICAgO1xuXG4gIHJldHVybiBjbGFzcyBFdWdsZW5hTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQXBwUGhhc2UuQ2hhbmdlJywgeyBwaGFzZTogXCJsb2dpblwiIH0pO1xuICAgIH1cbiAgfVxufSk7Il19
