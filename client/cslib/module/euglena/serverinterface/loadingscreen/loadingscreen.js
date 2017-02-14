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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3NlcnZlcmludGVyZmFjZS9sb2FkaW5nc2NyZWVuL2xvYWRpbmdzY3JlZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxVQUFVLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFLFFBQVEsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRSxXQUFXLFFBQVEsMkJBQVIsQ0FGYjs7QUFJQSxVQUFRLDBCQUFSOztBQUVBO0FBQUE7O0FBQ0UsNkJBQWM7QUFBQTs7QUFBQSxtR0FDTixRQURNOztBQUVaLFlBQUssS0FBTDtBQUZZO0FBR2I7O0FBSkg7QUFBQTtBQUFBLDhCQU1VO0FBQ04sYUFBSyxNQUFMLENBQVk7QUFDVixrQkFBUSxjQURFO0FBRVYsOEJBQW9CO0FBRlYsU0FBWjtBQUlEO0FBWEg7QUFBQTtBQUFBLDZCQWFTLElBYlQsRUFhZTtBQUNYLFlBQUksUUFBUSxFQUFaO0FBQ0EsZ0JBQVEsS0FBSyxNQUFiO0FBQ0UsZUFBSyxPQUFMO0FBQ0Usb0JBQVEscUJBQVI7QUFDRjtBQUNBLGVBQUssY0FBTDtBQUNFLG9CQUFRLHNCQUFSO0FBQ0Y7QUFDQSxlQUFLLFNBQUw7QUFDRSxvQkFBUSxvQkFBUjtBQUNGO0FBQ0EsZUFBSyxZQUFMO0FBQ0Usb0JBQVEsaUJBQVI7QUFDRjtBQUNBLGVBQUssYUFBTDtBQUNFLG9CQUFRLGtCQUFSO0FBQ0Y7O0FBZkY7QUFrQkEsWUFBSSxPQUFPLEVBQVg7QUFDQSxZQUFJLEtBQUssa0JBQUwsSUFBMkIsQ0FBL0IsRUFBa0M7QUFDaEMsaUJBQU8sc0JBQVA7QUFDRCxTQUZELE1BRU87QUFDTCw4QkFBa0IsTUFBTSxtQkFBTixDQUEwQixLQUFLLElBQUwsQ0FBVSxLQUFLLGtCQUFMLEdBQTBCLElBQXBDLENBQTFCLENBQWxCO0FBQ0Q7QUFDRCxhQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsc0JBQWQsRUFBc0MsSUFBdEMsQ0FBMkMsS0FBM0M7QUFDQSxhQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMseUJBQWQsRUFBeUMsSUFBekMsQ0FBOEMsSUFBOUM7QUFDRDtBQXpDSDs7QUFBQTtBQUFBLElBQW1DLE9BQW5DO0FBMkNELENBbEREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3NlcnZlcmludGVyZmFjZS9sb2FkaW5nc2NyZWVuL2xvYWRpbmdzY3JlZW4uanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
