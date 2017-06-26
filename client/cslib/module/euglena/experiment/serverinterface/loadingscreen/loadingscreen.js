'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      Template = require('text!./loadingscreen.html');

  require('link!./loadingscreen.css');

  return function (_DomView) {
    _inherits(LoadingScreen, _DomView);

    function LoadingScreen() {
      _classCallCheck(this, LoadingScreen);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LoadingScreen).call(this, Template));

      _this.reset();
      return _this;
    }

    _createClass(LoadingScreen, [{
      key: 'reset',
      value: function reset() {
        this.update({
          status: 'initializing',
          remaining_estimate: 0
        });
      }
    }, {
      key: 'update',
      value: function update(data) {
        var phase = '';
        switch (data.status) {
          case 'queue':
            phase = "Experiment In Queue";
            break;
          case 'initializing':
            phase = "Preparing Experiment";
            break;
          case 'running':
            phase = "Running Experiment";
            break;
          case 'processing':
            phase = "Processing Data";
            break;
          case 'downloading':
            phase = "Downloading Data";
            break;

        }
        var time = '';
        if (data.remaining_estimate <= 0) {
          time = 'Please wait a moment';
        } else {
          time = 'Approx. ' + Utils.secondsToTimeString(Math.ceil(data.remaining_estimate / 1000)) + ' remaining';
        }
        this.$el.find('.loadingscreen-phase').text(phase);
        this.$el.find('.loadingscreen-estimate').text(time);
      }
    }]);

    return LoadingScreen;
  }(DomView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL2xvYWRpbmdzY3JlZW4vbG9hZGluZ3NjcmVlbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFVBQVUsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFdBQVcsUUFBUSwyQkFBUixDQUZiOztBQUlBLFVBQVEsMEJBQVI7O0FBRUE7QUFBQTs7QUFDRSw2QkFBYztBQUFBOztBQUFBLG1HQUNOLFFBRE07O0FBRVosWUFBSyxLQUFMO0FBRlk7QUFHYjs7QUFKSDtBQUFBO0FBQUEsOEJBTVU7QUFDTixhQUFLLE1BQUwsQ0FBWTtBQUNWLGtCQUFRLGNBREU7QUFFViw4QkFBb0I7QUFGVixTQUFaO0FBSUQ7QUFYSDtBQUFBO0FBQUEsNkJBYVMsSUFiVCxFQWFlO0FBQ1gsWUFBSSxRQUFRLEVBQVo7QUFDQSxnQkFBUSxLQUFLLE1BQWI7QUFDRSxlQUFLLE9BQUw7QUFDRSxvQkFBUSxxQkFBUjtBQUNGO0FBQ0EsZUFBSyxjQUFMO0FBQ0Usb0JBQVEsc0JBQVI7QUFDRjtBQUNBLGVBQUssU0FBTDtBQUNFLG9CQUFRLG9CQUFSO0FBQ0Y7QUFDQSxlQUFLLFlBQUw7QUFDRSxvQkFBUSxpQkFBUjtBQUNGO0FBQ0EsZUFBSyxhQUFMO0FBQ0Usb0JBQVEsa0JBQVI7QUFDRjs7QUFmRjtBQWtCQSxZQUFJLE9BQU8sRUFBWDtBQUNBLFlBQUksS0FBSyxrQkFBTCxJQUEyQixDQUEvQixFQUFrQztBQUNoQyxpQkFBTyxzQkFBUDtBQUNELFNBRkQsTUFFTztBQUNMLDhCQUFrQixNQUFNLG1CQUFOLENBQTBCLEtBQUssSUFBTCxDQUFVLEtBQUssa0JBQUwsR0FBMEIsSUFBcEMsQ0FBMUIsQ0FBbEI7QUFDRDtBQUNELGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxzQkFBZCxFQUFzQyxJQUF0QyxDQUEyQyxLQUEzQztBQUNBLGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyx5QkFBZCxFQUF5QyxJQUF6QyxDQUE4QyxJQUE5QztBQUNEO0FBekNIOztBQUFBO0FBQUEsSUFBbUMsT0FBbkM7QUEyQ0QsQ0FsREQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9zZXJ2ZXJpbnRlcmZhY2UvbG9hZGluZ3NjcmVlbi9sb2FkaW5nc2NyZWVuLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
