'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');

  var VideoDisplay = function (_Component) {
    _inherits(VideoDisplay, _Component);

    function VideoDisplay() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, VideoDisplay);

      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;

      var _this = _possibleConstructorReturn(this, (VideoDisplay.__proto__ || Object.getPrototypeOf(VideoDisplay)).call(this, config));

      Utils.bindMethods(_this, ['_onTimerEvent']);

      _this.view().addEventListener('TimerSource.End', _this._onTimerEvent);
      return _this;
    }

    _createClass(VideoDisplay, [{
      key: 'handleVideo',
      value: function handleVideo(data) {
        if (data) {
          this._model.set('runTime', data.runTime);
          this._model.set('video', data.video);
        } else {
          this._model.set('runTime', 0);
          this._model.set('video', null);
        }
      }
    }, {
      key: 'timer_time',
      value: function timer_time() {
        return this.view().time();
      }
    }, {
      key: 'timer_start',
      value: function timer_start() {
        this.view().start();
      }
    }, {
      key: 'timer_stop',
      value: function timer_stop() {
        this.view().stop();
      }
    }, {
      key: 'timer_pause',
      value: function timer_pause() {
        this.view().pause();
      }
    }, {
      key: 'timer_seek',
      value: function timer_seek(time) {
        this.view().seek(time);
      }
    }, {
      key: 'timer_duration',
      value: function timer_duration() {
        return this._model.get('runTime');
      }
    }, {
      key: '_onTimerEvent',
      value: function _onTimerEvent(evt) {
        this.dispatchEvent(evt);
      }
    }]);

    return VideoDisplay;
  }(Component);

  VideoDisplay.create = function (data) {
    return new VideoDisplay({ modelData: data });
  };

  return VideoDisplay;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlkZW9kaXNwbGF5LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlZpZGVvRGlzcGxheSIsImNvbmZpZyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsInZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVGltZXJFdmVudCIsImRhdGEiLCJfbW9kZWwiLCJzZXQiLCJydW5UaW1lIiwidmlkZW8iLCJ0aW1lIiwic3RhcnQiLCJzdG9wIiwicGF1c2UiLCJzZWVrIiwiZ2V0IiwiZXZ0IiwiZGlzcGF0Y2hFdmVudCIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFNWkssWUFOWTtBQUFBOztBQU9oQiw0QkFBeUI7QUFBQSxVQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3ZCQSxhQUFPQyxVQUFQLEdBQW9CRCxPQUFPQyxVQUFQLElBQXFCTCxLQUF6QztBQUNBSSxhQUFPRSxTQUFQLEdBQW1CRixPQUFPRSxTQUFQLElBQW9CTCxJQUF2Qzs7QUFGdUIsOEhBR2pCRyxNQUhpQjs7QUFJdkJGLFlBQU1LLFdBQU4sUUFBd0IsQ0FBQyxlQUFELENBQXhCOztBQUVBLFlBQUtDLElBQUwsR0FBWUMsZ0JBQVosQ0FBNkIsaUJBQTdCLEVBQWdELE1BQUtDLGFBQXJEO0FBTnVCO0FBT3hCOztBQWRlO0FBQUE7QUFBQSxrQ0FnQkpDLElBaEJJLEVBZ0JFO0FBQ2hCLFlBQUlBLElBQUosRUFBVTtBQUNSLGVBQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixTQUFoQixFQUEyQkYsS0FBS0csT0FBaEM7QUFDQSxlQUFLRixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUJGLEtBQUtJLEtBQTlCO0FBQ0QsU0FIRCxNQUdPO0FBQ0wsZUFBS0gsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFNBQWhCLEVBQTJCLENBQTNCO0FBQ0EsZUFBS0QsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLEVBQXlCLElBQXpCO0FBQ0Q7QUFDRjtBQXhCZTtBQUFBO0FBQUEsbUNBMEJIO0FBQ1gsZUFBTyxLQUFLTCxJQUFMLEdBQVlRLElBQVosRUFBUDtBQUNEO0FBNUJlO0FBQUE7QUFBQSxvQ0E2QkY7QUFDWixhQUFLUixJQUFMLEdBQVlTLEtBQVo7QUFDRDtBQS9CZTtBQUFBO0FBQUEsbUNBZ0NIO0FBQ1gsYUFBS1QsSUFBTCxHQUFZVSxJQUFaO0FBQ0Q7QUFsQ2U7QUFBQTtBQUFBLG9DQW1DRjtBQUNaLGFBQUtWLElBQUwsR0FBWVcsS0FBWjtBQUNEO0FBckNlO0FBQUE7QUFBQSxpQ0FzQ0xILElBdENLLEVBc0NDO0FBQ2YsYUFBS1IsSUFBTCxHQUFZWSxJQUFaLENBQWlCSixJQUFqQjtBQUNEO0FBeENlO0FBQUE7QUFBQSx1Q0F5Q0M7QUFDZixlQUFPLEtBQUtKLE1BQUwsQ0FBWVMsR0FBWixDQUFnQixTQUFoQixDQUFQO0FBQ0Q7QUEzQ2U7QUFBQTtBQUFBLG9DQTZDRkMsR0E3Q0UsRUE2Q0c7QUFDakIsYUFBS0MsYUFBTCxDQUFtQkQsR0FBbkI7QUFDRDtBQS9DZTs7QUFBQTtBQUFBLElBTVN2QixTQU5UOztBQWtEbEJJLGVBQWFxQixNQUFiLEdBQXNCLFVBQUNiLElBQUQ7QUFBQSxXQUFVLElBQUlSLFlBQUosQ0FBaUIsRUFBRXNCLFdBQVdkLElBQWIsRUFBakIsQ0FBVjtBQUFBLEdBQXRCOztBQUVBLFNBQU9SLFlBQVA7QUFDRCxDQXJERCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdmlkZW9kaXNwbGF5L3ZpZGVvZGlzcGxheS5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
