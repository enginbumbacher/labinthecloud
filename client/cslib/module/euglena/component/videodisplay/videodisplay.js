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
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, VideoDisplay);

      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(VideoDisplay).call(this, config));
    }

    _createClass(VideoDisplay, [{
      key: 'handleVideo',
      value: function handleVideo(data) {
        if (data) {
          this._model.set('runTime', data.runTime);
          this._model.set('video', data.video);
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
    }]);

    return VideoDisplay;
  }(Component);

  VideoDisplay.create = function (data) {
    return new VideoDisplay({ modelData: data });
  };

  return VideoDisplay;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlkZW9kaXNwbGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sWUFBWSxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRSxRQUFRLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRSxPQUFPLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRSxRQUFRLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFNWixZQU5ZO0FBQUE7O0FBT2hCLDRCQUF5QjtBQUFBLFVBQWIsTUFBYSx5REFBSixFQUFJOztBQUFBOztBQUN2QixhQUFPLFVBQVAsR0FBb0IsT0FBTyxVQUFQLElBQXFCLEtBQXpDO0FBQ0EsYUFBTyxTQUFQLEdBQW1CLE9BQU8sU0FBUCxJQUFvQixJQUF2QztBQUZ1Qiw2RkFHakIsTUFIaUI7QUFJeEI7O0FBWGU7QUFBQTtBQUFBLGtDQWFKLElBYkksRUFhRTtBQUNoQixZQUFJLElBQUosRUFBVTtBQUNSLGVBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsU0FBaEIsRUFBMkIsS0FBSyxPQUFoQztBQUNBLGVBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUIsS0FBSyxLQUE5QjtBQUNEO0FBQ0Y7QUFsQmU7QUFBQTtBQUFBLG1DQW9CSDtBQUNYLGVBQU8sS0FBSyxJQUFMLEdBQVksSUFBWixFQUFQO0FBQ0Q7QUF0QmU7QUFBQTtBQUFBLG9DQXVCRjtBQUNaLGFBQUssSUFBTCxHQUFZLEtBQVo7QUFDRDtBQXpCZTtBQUFBO0FBQUEsbUNBMEJIO0FBQ1gsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNEO0FBNUJlO0FBQUE7QUFBQSxvQ0E2QkY7QUFDWixhQUFLLElBQUwsR0FBWSxLQUFaO0FBQ0Q7QUEvQmU7QUFBQTtBQUFBLGlDQWdDTCxJQWhDSyxFQWdDQztBQUNmLGFBQUssSUFBTCxHQUFZLElBQVosQ0FBaUIsSUFBakI7QUFDRDtBQWxDZTtBQUFBO0FBQUEsdUNBbUNDO0FBQ2YsZUFBTyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFNBQWhCLENBQVA7QUFDRDtBQXJDZTs7QUFBQTtBQUFBLElBTVMsU0FOVDs7QUF3Q2xCLGVBQWEsTUFBYixHQUFzQixVQUFDLElBQUQ7QUFBQSxXQUFVLElBQUksWUFBSixDQUFpQixFQUFFLFdBQVcsSUFBYixFQUFqQixDQUFWO0FBQUEsR0FBdEI7O0FBRUEsU0FBTyxZQUFQO0FBQ0QsQ0EzQ0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3ZpZGVvZGlzcGxheS92aWRlb2Rpc3BsYXkuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
