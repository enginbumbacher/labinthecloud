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

      Utils.bindMethods(_this, ['_onTimerEvent', '_onShowVideo']);

      _this.view().addEventListener('TimerSource.End', _this._onTimerEvent);
      _this.addEventListener('VideoDisplay.ShowVideo', _this._onShowVideo);

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
      key: '_onShowVideo',
      value: function _onShowVideo(evt) {
        this._model.set('showVideo', evt.data.showVideo);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlkZW9kaXNwbGF5LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlZpZGVvRGlzcGxheSIsImNvbmZpZyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsInZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVGltZXJFdmVudCIsIl9vblNob3dWaWRlbyIsImRhdGEiLCJfbW9kZWwiLCJzZXQiLCJydW5UaW1lIiwidmlkZW8iLCJldnQiLCJzaG93VmlkZW8iLCJ0aW1lIiwic3RhcnQiLCJzdG9wIiwicGF1c2UiLCJzZWVrIiwiZ2V0IiwiZGlzcGF0Y2hFdmVudCIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFNWkssWUFOWTtBQUFBOztBQU9oQiw0QkFBeUI7QUFBQSxVQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3ZCQSxhQUFPQyxVQUFQLEdBQW9CRCxPQUFPQyxVQUFQLElBQXFCTCxLQUF6QztBQUNBSSxhQUFPRSxTQUFQLEdBQW1CRixPQUFPRSxTQUFQLElBQW9CTCxJQUF2Qzs7QUFGdUIsOEhBR2pCRyxNQUhpQjs7QUFJdkJGLFlBQU1LLFdBQU4sUUFBd0IsQ0FBQyxlQUFELEVBQWlCLGNBQWpCLENBQXhCOztBQUVBLFlBQUtDLElBQUwsR0FBWUMsZ0JBQVosQ0FBNkIsaUJBQTdCLEVBQWdELE1BQUtDLGFBQXJEO0FBQ0EsWUFBS0QsZ0JBQUwsQ0FBc0Isd0JBQXRCLEVBQWdELE1BQUtFLFlBQXJEOztBQVB1QjtBQVN4Qjs7QUFoQmU7QUFBQTtBQUFBLGtDQWtCSkMsSUFsQkksRUFrQkU7QUFDaEIsWUFBSUEsSUFBSixFQUFVO0FBQ1IsZUFBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFNBQWhCLEVBQTJCRixLQUFLRyxPQUFoQztBQUNBLGVBQUtGLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixPQUFoQixFQUF5QkYsS0FBS0ksS0FBOUI7QUFDRCxTQUhELE1BR087QUFDTCxlQUFLSCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsU0FBaEIsRUFBMkIsQ0FBM0I7QUFDQSxlQUFLRCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUIsSUFBekI7QUFDRDtBQUNGO0FBMUJlO0FBQUE7QUFBQSxtQ0E0QkhHLEdBNUJHLEVBNEJFO0FBQ2hCLGFBQUtKLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixXQUFoQixFQUE2QkcsSUFBSUwsSUFBSixDQUFTTSxTQUF0QztBQUNEO0FBOUJlO0FBQUE7QUFBQSxtQ0FnQ0g7QUFDWCxlQUFPLEtBQUtWLElBQUwsR0FBWVcsSUFBWixFQUFQO0FBQ0Q7QUFsQ2U7QUFBQTtBQUFBLG9DQW1DRjtBQUNaLGFBQUtYLElBQUwsR0FBWVksS0FBWjtBQUNEO0FBckNlO0FBQUE7QUFBQSxtQ0FzQ0g7QUFDWCxhQUFLWixJQUFMLEdBQVlhLElBQVo7QUFDRDtBQXhDZTtBQUFBO0FBQUEsb0NBeUNGO0FBQ1osYUFBS2IsSUFBTCxHQUFZYyxLQUFaO0FBQ0Q7QUEzQ2U7QUFBQTtBQUFBLGlDQTRDTEgsSUE1Q0ssRUE0Q0M7QUFDZixhQUFLWCxJQUFMLEdBQVllLElBQVosQ0FBaUJKLElBQWpCO0FBQ0Q7QUE5Q2U7QUFBQTtBQUFBLHVDQStDQztBQUNmLGVBQU8sS0FBS04sTUFBTCxDQUFZVyxHQUFaLENBQWdCLFNBQWhCLENBQVA7QUFDRDtBQWpEZTtBQUFBO0FBQUEsb0NBbURGUCxHQW5ERSxFQW1ERztBQUNqQixhQUFLUSxhQUFMLENBQW1CUixHQUFuQjtBQUNEO0FBckRlOztBQUFBO0FBQUEsSUFNU2xCLFNBTlQ7O0FBd0RsQkksZUFBYXVCLE1BQWIsR0FBc0IsVUFBQ2QsSUFBRDtBQUFBLFdBQVUsSUFBSVQsWUFBSixDQUFpQixFQUFFd0IsV0FBV2YsSUFBYixFQUFqQixDQUFWO0FBQUEsR0FBdEI7O0FBRUEsU0FBT1QsWUFBUDtBQUNELENBM0REIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlkZW9kaXNwbGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpO1xuXG4gIGNsYXNzIFZpZGVvRGlzcGxheSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgIGNvbmZpZy5tb2RlbENsYXNzID0gY29uZmlnLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBjb25maWcudmlld0NsYXNzID0gY29uZmlnLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVGltZXJFdmVudCcsJ19vblNob3dWaWRlbyddKVxuXG4gICAgICB0aGlzLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdUaW1lclNvdXJjZS5FbmQnLCB0aGlzLl9vblRpbWVyRXZlbnQpXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ1ZpZGVvRGlzcGxheS5TaG93VmlkZW8nLCB0aGlzLl9vblNob3dWaWRlbylcblxuICAgIH1cblxuICAgIGhhbmRsZVZpZGVvKGRhdGEpIHtcbiAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnNldCgncnVuVGltZScsIGRhdGEucnVuVGltZSk7XG4gICAgICAgIHRoaXMuX21vZGVsLnNldCgndmlkZW8nLCBkYXRhLnZpZGVvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnNldCgncnVuVGltZScsIDApO1xuICAgICAgICB0aGlzLl9tb2RlbC5zZXQoJ3ZpZGVvJywgbnVsbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uU2hvd1ZpZGVvKGV2dCkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdzaG93VmlkZW8nLCBldnQuZGF0YS5zaG93VmlkZW8pO1xuICAgIH1cblxuICAgIHRpbWVyX3RpbWUoKSB7XG4gICAgICByZXR1cm4gdGhpcy52aWV3KCkudGltZSgpO1xuICAgIH1cbiAgICB0aW1lcl9zdGFydCgpIHtcbiAgICAgIHRoaXMudmlldygpLnN0YXJ0KCk7XG4gICAgfVxuICAgIHRpbWVyX3N0b3AoKSB7XG4gICAgICB0aGlzLnZpZXcoKS5zdG9wKCk7XG4gICAgfVxuICAgIHRpbWVyX3BhdXNlKCkge1xuICAgICAgdGhpcy52aWV3KCkucGF1c2UoKTtcbiAgICB9XG4gICAgdGltZXJfc2Vlayh0aW1lKSB7XG4gICAgICB0aGlzLnZpZXcoKS5zZWVrKHRpbWUpO1xuICAgIH1cbiAgICB0aW1lcl9kdXJhdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ3J1blRpbWUnKTtcbiAgICB9XG5cbiAgICBfb25UaW1lckV2ZW50KGV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAgfVxuICB9XG5cbiAgVmlkZW9EaXNwbGF5LmNyZWF0ZSA9IChkYXRhKSA9PiBuZXcgVmlkZW9EaXNwbGF5KHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuXG4gIHJldHVybiBWaWRlb0Rpc3BsYXk7XG59KVxuIl19
