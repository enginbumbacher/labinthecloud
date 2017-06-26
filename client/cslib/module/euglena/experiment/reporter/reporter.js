'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils');

  var DomView = require('core/view/dom_view'),
      Template = require('text!./reporter.html'),
      Button = require('core/component/button/field');

  require('link!./style.css');

  return function (_DomView) {
    _inherits(ExperimentReporter, _DomView);

    function ExperimentReporter() {
      _classCallCheck(this, ExperimentReporter);

      var _this = _possibleConstructorReturn(this, (ExperimentReporter.__proto__ || Object.getPrototypeOf(ExperimentReporter)).call(this, Template));

      _this.buttons = {
        send: Button.create({
          id: "send",
          label: "Send to Results Panel",
          eventName: "ExperimentReporter.Send"
        }),
        dont: Button.create({
          id: "dont",
          label: "Don't Send",
          eventName: "ExperimentReporter.DontSend"
        })
      };
      _this.addChild(_this.buttons.send.view(), ".exp_reporter__buttons");
      _this.addChild(_this.buttons.dont.view(), ".exp_reporter__buttons");

      _this.reset();
      return _this;
    }

    _createClass(ExperimentReporter, [{
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
        if (data.status != "complete") {
          this.$el.find('.exp_reporter__complete').hide();
          this.$el.find('.exp_reporter__working').show();
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
            case 'retreiving':
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
          this.$el.find('.exp_reporter__phase').text(phase);
          this.$el.find('.exp_reporter__estimate').text(time);
        } else {
          this.results = data.results;
          this.$el.find('.exp_reporter__complete').show();
          this.$el.find('.exp_reporter__working').hide();
        }
      }
    }, {
      key: 'setFullscreen',
      value: function setFullscreen(fullscreen) {
        this.$el.toggleClass('exp_reporter__fullscreen', fullscreen);
      }
    }]);

    return ExperimentReporter;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvcmVwb3J0ZXIvcmVwb3J0ZXIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkJ1dHRvbiIsImJ1dHRvbnMiLCJzZW5kIiwiY3JlYXRlIiwiaWQiLCJsYWJlbCIsImV2ZW50TmFtZSIsImRvbnQiLCJhZGRDaGlsZCIsInZpZXciLCJyZXNldCIsInVwZGF0ZSIsInN0YXR1cyIsInJlbWFpbmluZ19lc3RpbWF0ZSIsImRhdGEiLCIkZWwiLCJmaW5kIiwiaGlkZSIsInNob3ciLCJwaGFzZSIsInRpbWUiLCJzZWNvbmRzVG9UaW1lU3RyaW5nIiwiTWF0aCIsImNlaWwiLCJ0ZXh0IiwicmVzdWx0cyIsImZ1bGxzY3JlZW4iLCJ0b2dnbGVDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWOztBQUdBLE1BQU1HLFVBQVVILFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSSxXQUFXSixRQUFRLHNCQUFSLENBRGI7QUFBQSxNQUVFSyxTQUFTTCxRQUFRLDZCQUFSLENBRlg7O0FBSUFBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxrQ0FBYztBQUFBOztBQUFBLDBJQUNOSSxRQURNOztBQUdaLFlBQUtFLE9BQUwsR0FBZTtBQUNiQyxjQUFNRixPQUFPRyxNQUFQLENBQWM7QUFDbEJDLGNBQUksTUFEYztBQUVsQkMsaUJBQU8sdUJBRlc7QUFHbEJDLHFCQUFXO0FBSE8sU0FBZCxDQURPO0FBTWJDLGNBQU1QLE9BQU9HLE1BQVAsQ0FBYztBQUNsQkMsY0FBSSxNQURjO0FBRWxCQyxpQkFBTyxZQUZXO0FBR2xCQyxxQkFBVztBQUhPLFNBQWQ7QUFOTyxPQUFmO0FBWUEsWUFBS0UsUUFBTCxDQUFjLE1BQUtQLE9BQUwsQ0FBYUMsSUFBYixDQUFrQk8sSUFBbEIsRUFBZCxFQUF3Qyx3QkFBeEM7QUFDQSxZQUFLRCxRQUFMLENBQWMsTUFBS1AsT0FBTCxDQUFhTSxJQUFiLENBQWtCRSxJQUFsQixFQUFkLEVBQXdDLHdCQUF4Qzs7QUFFQSxZQUFLQyxLQUFMO0FBbEJZO0FBbUJiOztBQXBCSDtBQUFBO0FBQUEsOEJBc0JVO0FBQ04sYUFBS0MsTUFBTCxDQUFZO0FBQ1ZDLGtCQUFRLGNBREU7QUFFVkMsOEJBQW9CO0FBRlYsU0FBWjtBQUlEO0FBM0JIO0FBQUE7QUFBQSw2QkE2QlNDLElBN0JULEVBNkJlO0FBQ1gsWUFBSUEsS0FBS0YsTUFBTCxJQUFlLFVBQW5CLEVBQStCO0FBQzdCLGVBQUtHLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHlCQUFkLEVBQXlDQyxJQUF6QztBQUNBLGVBQUtGLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHdCQUFkLEVBQXdDRSxJQUF4QztBQUNBLGNBQUlDLFFBQVEsRUFBWjtBQUNBLGtCQUFRTCxLQUFLRixNQUFiO0FBQ0UsaUJBQUssT0FBTDtBQUNFTyxzQkFBUSxxQkFBUjtBQUNGO0FBQ0EsaUJBQUssY0FBTDtBQUNFQSxzQkFBUSxzQkFBUjtBQUNGO0FBQ0EsaUJBQUssU0FBTDtBQUNFQSxzQkFBUSxvQkFBUjtBQUNGO0FBQ0EsaUJBQUssWUFBTDtBQUNFQSxzQkFBUSxpQkFBUjtBQUNGO0FBQ0EsaUJBQUssWUFBTDtBQUNFQSxzQkFBUSxpQkFBUjtBQUNGO0FBQ0EsaUJBQUssYUFBTDtBQUNFQSxzQkFBUSxrQkFBUjtBQUNGO0FBbEJGO0FBb0JBLGNBQUlDLE9BQU8sRUFBWDtBQUNBLGNBQUlOLEtBQUtELGtCQUFMLElBQTJCLENBQS9CLEVBQWtDO0FBQ2hDTyxtQkFBTyxzQkFBUDtBQUNELFdBRkQsTUFFTztBQUNMQSxnQ0FBa0J2QixNQUFNd0IsbUJBQU4sQ0FBMEJDLEtBQUtDLElBQUwsQ0FBVVQsS0FBS0Qsa0JBQUwsR0FBMEIsSUFBcEMsQ0FBMUIsQ0FBbEI7QUFDRDtBQUNELGVBQUtFLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHNCQUFkLEVBQXNDUSxJQUF0QyxDQUEyQ0wsS0FBM0M7QUFDQSxlQUFLSixHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5Q1EsSUFBekMsQ0FBOENKLElBQTlDO0FBQ0QsU0FoQ0QsTUFnQ087QUFDTCxlQUFLSyxPQUFMLEdBQWVYLEtBQUtXLE9BQXBCO0FBQ0EsZUFBS1YsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUNFLElBQXpDO0FBQ0EsZUFBS0gsR0FBTCxDQUFTQyxJQUFULENBQWMsd0JBQWQsRUFBd0NDLElBQXhDO0FBQ0Q7QUFDRjtBQW5FSDtBQUFBO0FBQUEsb0NBcUVnQlMsVUFyRWhCLEVBcUU0QjtBQUN4QixhQUFLWCxHQUFMLENBQVNZLFdBQVQsQ0FBcUIsMEJBQXJCLEVBQWlERCxVQUFqRDtBQUNEO0FBdkVIOztBQUFBO0FBQUEsSUFBd0M1QixPQUF4QztBQXlFRCxDQW5GRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L3JlcG9ydGVyL3JlcG9ydGVyLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
