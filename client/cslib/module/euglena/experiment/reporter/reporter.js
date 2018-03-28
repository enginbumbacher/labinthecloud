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
              phase = "We sent your experiment to the real microscopes. If you can, check out the data from the last experiments.";
              break;
            case 'processing':
              phase = "Your new experiment is in process. If you can, continue with the data from the last experiments.";
              break;
            case 'retrieving':
              phase = "Processing Data";
              break;
            case 'downloading':
              phase = "The data from your new experiment is getting downloaded.";
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvcmVwb3J0ZXIvcmVwb3J0ZXIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkJ1dHRvbiIsImJ1dHRvbnMiLCJzZW5kIiwiY3JlYXRlIiwiaWQiLCJsYWJlbCIsImV2ZW50TmFtZSIsImRvbnQiLCJhZGRDaGlsZCIsInZpZXciLCJyZXNldCIsInVwZGF0ZSIsInN0YXR1cyIsInJlbWFpbmluZ19lc3RpbWF0ZSIsImRhdGEiLCIkZWwiLCJmaW5kIiwiaGlkZSIsInNob3ciLCJwaGFzZSIsInRpbWUiLCJzZWNvbmRzVG9UaW1lU3RyaW5nIiwiTWF0aCIsImNlaWwiLCJ0ZXh0IiwicmVzdWx0cyIsImZ1bGxzY3JlZW4iLCJ0b2dnbGVDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWOztBQUdBLE1BQU1HLFVBQVVILFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSSxXQUFXSixRQUFRLHNCQUFSLENBRGI7QUFBQSxNQUVFSyxTQUFTTCxRQUFRLDZCQUFSLENBRlg7O0FBSUFBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxrQ0FBYztBQUFBOztBQUFBLDBJQUNOSSxRQURNOztBQUdaLFlBQUtFLE9BQUwsR0FBZTtBQUNiQyxjQUFNRixPQUFPRyxNQUFQLENBQWM7QUFDbEJDLGNBQUksTUFEYztBQUVsQkMsaUJBQU8sdUJBRlc7QUFHbEJDLHFCQUFXO0FBSE8sU0FBZCxDQURPO0FBTWJDLGNBQU1QLE9BQU9HLE1BQVAsQ0FBYztBQUNsQkMsY0FBSSxNQURjO0FBRWxCQyxpQkFBTyxZQUZXO0FBR2xCQyxxQkFBVztBQUhPLFNBQWQ7QUFOTyxPQUFmO0FBWUEsWUFBS0UsUUFBTCxDQUFjLE1BQUtQLE9BQUwsQ0FBYUMsSUFBYixDQUFrQk8sSUFBbEIsRUFBZCxFQUF3Qyx3QkFBeEM7QUFDQSxZQUFLRCxRQUFMLENBQWMsTUFBS1AsT0FBTCxDQUFhTSxJQUFiLENBQWtCRSxJQUFsQixFQUFkLEVBQXdDLHdCQUF4Qzs7QUFFQSxZQUFLQyxLQUFMO0FBbEJZO0FBbUJiOztBQXBCSDtBQUFBO0FBQUEsOEJBc0JVO0FBQ04sYUFBS0MsTUFBTCxDQUFZO0FBQ1ZDLGtCQUFRLGNBREU7QUFFVkMsOEJBQW9CO0FBRlYsU0FBWjtBQUlEO0FBM0JIO0FBQUE7QUFBQSw2QkE2QlNDLElBN0JULEVBNkJlO0FBQ1gsWUFBSUEsS0FBS0YsTUFBTCxJQUFlLFVBQW5CLEVBQStCO0FBQzdCLGVBQUtHLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHlCQUFkLEVBQXlDQyxJQUF6QztBQUNBLGVBQUtGLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHdCQUFkLEVBQXdDRSxJQUF4QztBQUNBLGNBQUlDLFFBQVEsRUFBWjtBQUNBLGtCQUFRTCxLQUFLRixNQUFiO0FBQ0UsaUJBQUssT0FBTDtBQUNFTyxzQkFBUSxxQkFBUjtBQUNGO0FBQ0EsaUJBQUssY0FBTDtBQUNFQSxzQkFBUSxzQkFBUjtBQUNGO0FBQ0EsaUJBQUssU0FBTDtBQUNFQSxzQkFBUSw0R0FBUjtBQUNGO0FBQ0EsaUJBQUssWUFBTDtBQUNFQSxzQkFBUSxrR0FBUjtBQUNGO0FBQ0EsaUJBQUssWUFBTDtBQUNFQSxzQkFBUSxpQkFBUjtBQUNGO0FBQ0EsaUJBQUssYUFBTDtBQUNFQSxzQkFBUSwwREFBUjtBQUNGO0FBbEJGO0FBb0JBLGNBQUlDLE9BQU8sRUFBWDtBQUNBLGNBQUlOLEtBQUtELGtCQUFMLElBQTJCLENBQS9CLEVBQWtDO0FBQ2hDTyxtQkFBTyxzQkFBUDtBQUNELFdBRkQsTUFFTztBQUNMQSxnQ0FBa0J2QixNQUFNd0IsbUJBQU4sQ0FBMEJDLEtBQUtDLElBQUwsQ0FBVVQsS0FBS0Qsa0JBQUwsR0FBMEIsSUFBcEMsQ0FBMUIsQ0FBbEI7QUFDRDtBQUNELGVBQUtFLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHNCQUFkLEVBQXNDUSxJQUF0QyxDQUEyQ0wsS0FBM0M7QUFDQSxlQUFLSixHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5Q1EsSUFBekMsQ0FBOENKLElBQTlDO0FBQ0QsU0FoQ0QsTUFnQ087QUFDTCxlQUFLSyxPQUFMLEdBQWVYLEtBQUtXLE9BQXBCO0FBQ0EsZUFBS1YsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUNFLElBQXpDO0FBQ0EsZUFBS0gsR0FBTCxDQUFTQyxJQUFULENBQWMsd0JBQWQsRUFBd0NDLElBQXhDO0FBQ0Q7QUFDRjtBQW5FSDtBQUFBO0FBQUEsb0NBcUVnQlMsVUFyRWhCLEVBcUU0QjtBQUN4QixhQUFLWCxHQUFMLENBQVNZLFdBQVQsQ0FBcUIsMEJBQXJCLEVBQWlERCxVQUFqRDtBQUNEO0FBdkVIOztBQUFBO0FBQUEsSUFBd0M1QixPQUF4QztBQXlFRCxDQW5GRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L3JlcG9ydGVyL3JlcG9ydGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpO1xuXG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9yZXBvcnRlci5odG1sJyksXG4gICAgQnV0dG9uID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkJyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBFeHBlcmltZW50UmVwb3J0ZXIgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKFRlbXBsYXRlKTtcblxuICAgICAgdGhpcy5idXR0b25zID0ge1xuICAgICAgICBzZW5kOiBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgICBpZDogXCJzZW5kXCIsXG4gICAgICAgICAgbGFiZWw6IFwiU2VuZCB0byBSZXN1bHRzIFBhbmVsXCIsXG4gICAgICAgICAgZXZlbnROYW1lOiBcIkV4cGVyaW1lbnRSZXBvcnRlci5TZW5kXCJcbiAgICAgICAgfSksXG4gICAgICAgIGRvbnQ6IEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICAgIGlkOiBcImRvbnRcIixcbiAgICAgICAgICBsYWJlbDogXCJEb24ndCBTZW5kXCIsXG4gICAgICAgICAgZXZlbnROYW1lOiBcIkV4cGVyaW1lbnRSZXBvcnRlci5Eb250U2VuZFwiXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMuYnV0dG9ucy5zZW5kLnZpZXcoKSwgXCIuZXhwX3JlcG9ydGVyX19idXR0b25zXCIpXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMuYnV0dG9ucy5kb250LnZpZXcoKSwgXCIuZXhwX3JlcG9ydGVyX19idXR0b25zXCIpXG5cbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgIHRoaXMudXBkYXRlKHtcbiAgICAgICAgc3RhdHVzOiAnaW5pdGlhbGl6aW5nJyxcbiAgICAgICAgcmVtYWluaW5nX2VzdGltYXRlOiAwXG4gICAgICB9KVxuICAgIH1cblxuICAgIHVwZGF0ZShkYXRhKSB7XG4gICAgICBpZiAoZGF0YS5zdGF0dXMgIT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5leHBfcmVwb3J0ZXJfX2NvbXBsZXRlJykuaGlkZSgpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuZXhwX3JlcG9ydGVyX193b3JraW5nJykuc2hvdygpO1xuICAgICAgICBsZXQgcGhhc2UgPSAnJztcbiAgICAgICAgc3dpdGNoIChkYXRhLnN0YXR1cykge1xuICAgICAgICAgIGNhc2UgJ3F1ZXVlJzpcbiAgICAgICAgICAgIHBoYXNlID0gXCJFeHBlcmltZW50IEluIFF1ZXVlXCI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnaW5pdGlhbGl6aW5nJzpcbiAgICAgICAgICAgIHBoYXNlID0gXCJQcmVwYXJpbmcgRXhwZXJpbWVudFwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3J1bm5pbmcnOlxuICAgICAgICAgICAgcGhhc2UgPSBcIldlIHNlbnQgeW91ciBleHBlcmltZW50IHRvIHRoZSByZWFsIG1pY3Jvc2NvcGVzLiBJZiB5b3UgY2FuLCBjaGVjayBvdXQgdGhlIGRhdGEgZnJvbSB0aGUgbGFzdCBleHBlcmltZW50cy5cIlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3Byb2Nlc3NpbmcnOlxuICAgICAgICAgICAgcGhhc2UgPSBcIllvdXIgbmV3IGV4cGVyaW1lbnQgaXMgaW4gcHJvY2Vzcy4gSWYgeW91IGNhbiwgY29udGludWUgd2l0aCB0aGUgZGF0YSBmcm9tIHRoZSBsYXN0IGV4cGVyaW1lbnRzLlwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3JldHJpZXZpbmcnOlxuICAgICAgICAgICAgcGhhc2UgPSBcIlByb2Nlc3NpbmcgRGF0YVwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2Rvd25sb2FkaW5nJzpcbiAgICAgICAgICAgIHBoYXNlID0gXCJUaGUgZGF0YSBmcm9tIHlvdXIgbmV3IGV4cGVyaW1lbnQgaXMgZ2V0dGluZyBkb3dubG9hZGVkLlwiXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRpbWUgPSAnJztcbiAgICAgICAgaWYgKGRhdGEucmVtYWluaW5nX2VzdGltYXRlIDw9IDApIHtcbiAgICAgICAgICB0aW1lID0gJ1BsZWFzZSB3YWl0IGEgbW9tZW50JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aW1lID0gYEFwcHJveC4gJHtVdGlscy5zZWNvbmRzVG9UaW1lU3RyaW5nKE1hdGguY2VpbChkYXRhLnJlbWFpbmluZ19lc3RpbWF0ZSAvIDEwMDApKX0gcmVtYWluaW5nYFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5leHBfcmVwb3J0ZXJfX3BoYXNlJykudGV4dChwaGFzZSlcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLmV4cF9yZXBvcnRlcl9fZXN0aW1hdGUnKS50ZXh0KHRpbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZXN1bHRzID0gZGF0YS5yZXN1bHRzO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuZXhwX3JlcG9ydGVyX19jb21wbGV0ZScpLnNob3coKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLmV4cF9yZXBvcnRlcl9fd29ya2luZycpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRGdWxsc2NyZWVuKGZ1bGxzY3JlZW4pIHtcbiAgICAgIHRoaXMuJGVsLnRvZ2dsZUNsYXNzKCdleHBfcmVwb3J0ZXJfX2Z1bGxzY3JlZW4nLCBmdWxsc2NyZWVuKTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
