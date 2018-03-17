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
      key: 'changePlaybackRate',
      value: function changePlaybackRate(faster) {
        this.view().setPlaybackRate(faster);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlkZW9kaXNwbGF5LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlZpZGVvRGlzcGxheSIsImNvbmZpZyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsInZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVGltZXJFdmVudCIsIl9vblNob3dWaWRlbyIsImRhdGEiLCJfbW9kZWwiLCJzZXQiLCJydW5UaW1lIiwidmlkZW8iLCJldnQiLCJzaG93VmlkZW8iLCJmYXN0ZXIiLCJzZXRQbGF5YmFja1JhdGUiLCJ0aW1lIiwic3RhcnQiLCJzdG9wIiwicGF1c2UiLCJzZWVrIiwiZ2V0IiwiZGlzcGF0Y2hFdmVudCIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFNWkssWUFOWTtBQUFBOztBQU9oQiw0QkFBeUI7QUFBQSxVQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3ZCQSxhQUFPQyxVQUFQLEdBQW9CRCxPQUFPQyxVQUFQLElBQXFCTCxLQUF6QztBQUNBSSxhQUFPRSxTQUFQLEdBQW1CRixPQUFPRSxTQUFQLElBQW9CTCxJQUF2Qzs7QUFGdUIsOEhBR2pCRyxNQUhpQjs7QUFJdkJGLFlBQU1LLFdBQU4sUUFBd0IsQ0FBQyxlQUFELEVBQWlCLGNBQWpCLENBQXhCOztBQUVBLFlBQUtDLElBQUwsR0FBWUMsZ0JBQVosQ0FBNkIsaUJBQTdCLEVBQWdELE1BQUtDLGFBQXJEO0FBQ0EsWUFBS0QsZ0JBQUwsQ0FBc0Isd0JBQXRCLEVBQWdELE1BQUtFLFlBQXJEOztBQVB1QjtBQVN4Qjs7QUFoQmU7QUFBQTtBQUFBLGtDQWtCSkMsSUFsQkksRUFrQkU7QUFDaEIsWUFBSUEsSUFBSixFQUFVO0FBQ1IsZUFBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFNBQWhCLEVBQTJCRixLQUFLRyxPQUFoQztBQUNBLGVBQUtGLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixPQUFoQixFQUF5QkYsS0FBS0ksS0FBOUI7QUFDRCxTQUhELE1BR087QUFDTCxlQUFLSCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsU0FBaEIsRUFBMkIsQ0FBM0I7QUFDQSxlQUFLRCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUIsSUFBekI7QUFDRDtBQUNGO0FBMUJlO0FBQUE7QUFBQSxtQ0E0QkhHLEdBNUJHLEVBNEJFO0FBQ2hCLGFBQUtKLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixXQUFoQixFQUE2QkcsSUFBSUwsSUFBSixDQUFTTSxTQUF0QztBQUNEO0FBOUJlO0FBQUE7QUFBQSx5Q0FnQ0dDLE1BaENILEVBZ0NXO0FBQ3pCLGFBQUtYLElBQUwsR0FBWVksZUFBWixDQUE0QkQsTUFBNUI7QUFDRDtBQWxDZTtBQUFBO0FBQUEsbUNBb0NIO0FBQ1gsZUFBTyxLQUFLWCxJQUFMLEdBQVlhLElBQVosRUFBUDtBQUNEO0FBdENlO0FBQUE7QUFBQSxvQ0F1Q0Y7QUFDWixhQUFLYixJQUFMLEdBQVljLEtBQVo7QUFDRDtBQXpDZTtBQUFBO0FBQUEsbUNBMENIO0FBQ1gsYUFBS2QsSUFBTCxHQUFZZSxJQUFaO0FBQ0Q7QUE1Q2U7QUFBQTtBQUFBLG9DQTZDRjtBQUNaLGFBQUtmLElBQUwsR0FBWWdCLEtBQVo7QUFDRDtBQS9DZTtBQUFBO0FBQUEsaUNBZ0RMSCxJQWhESyxFQWdEQztBQUNmLGFBQUtiLElBQUwsR0FBWWlCLElBQVosQ0FBaUJKLElBQWpCO0FBQ0Q7QUFsRGU7QUFBQTtBQUFBLHVDQW1EQztBQUNmLGVBQU8sS0FBS1IsTUFBTCxDQUFZYSxHQUFaLENBQWdCLFNBQWhCLENBQVA7QUFDRDtBQXJEZTtBQUFBO0FBQUEsb0NBdURGVCxHQXZERSxFQXVERztBQUNqQixhQUFLVSxhQUFMLENBQW1CVixHQUFuQjtBQUNEO0FBekRlOztBQUFBO0FBQUEsSUFNU2xCLFNBTlQ7O0FBNERsQkksZUFBYXlCLE1BQWIsR0FBc0IsVUFBQ2hCLElBQUQ7QUFBQSxXQUFVLElBQUlULFlBQUosQ0FBaUIsRUFBRTBCLFdBQVdqQixJQUFiLEVBQWpCLENBQVY7QUFBQSxHQUF0Qjs7QUFFQSxTQUFPVCxZQUFQO0FBQ0QsQ0EvREQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3ZpZGVvZGlzcGxheS92aWRlb2Rpc3BsYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyk7XG5cbiAgY2xhc3MgVmlkZW9EaXNwbGF5IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcgPSB7fSkge1xuICAgICAgY29uZmlnLm1vZGVsQ2xhc3MgPSBjb25maWcubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIGNvbmZpZy52aWV3Q2xhc3MgPSBjb25maWcudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihjb25maWcpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25UaW1lckV2ZW50JywnX29uU2hvd1ZpZGVvJ10pXG5cbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ1RpbWVyU291cmNlLkVuZCcsIHRoaXMuX29uVGltZXJFdmVudClcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignVmlkZW9EaXNwbGF5LlNob3dWaWRlbycsIHRoaXMuX29uU2hvd1ZpZGVvKVxuXG4gICAgfVxuXG4gICAgaGFuZGxlVmlkZW8oZGF0YSkge1xuICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwuc2V0KCdydW5UaW1lJywgZGF0YS5ydW5UaW1lKTtcbiAgICAgICAgdGhpcy5fbW9kZWwuc2V0KCd2aWRlbycsIGRhdGEudmlkZW8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbW9kZWwuc2V0KCdydW5UaW1lJywgMCk7XG4gICAgICAgIHRoaXMuX21vZGVsLnNldCgndmlkZW8nLCBudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25TaG93VmlkZW8oZXZ0KSB7XG4gICAgICB0aGlzLl9tb2RlbC5zZXQoJ3Nob3dWaWRlbycsIGV2dC5kYXRhLnNob3dWaWRlbyk7XG4gICAgfVxuXG4gICAgY2hhbmdlUGxheWJhY2tSYXRlKGZhc3Rlcikge1xuICAgICAgdGhpcy52aWV3KCkuc2V0UGxheWJhY2tSYXRlKGZhc3Rlcik7XG4gICAgfVxuXG4gICAgdGltZXJfdGltZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnZpZXcoKS50aW1lKCk7XG4gICAgfVxuICAgIHRpbWVyX3N0YXJ0KCkge1xuICAgICAgdGhpcy52aWV3KCkuc3RhcnQoKTtcbiAgICB9XG4gICAgdGltZXJfc3RvcCgpIHtcbiAgICAgIHRoaXMudmlldygpLnN0b3AoKTtcbiAgICB9XG4gICAgdGltZXJfcGF1c2UoKSB7XG4gICAgICB0aGlzLnZpZXcoKS5wYXVzZSgpO1xuICAgIH1cbiAgICB0aW1lcl9zZWVrKHRpbWUpIHtcbiAgICAgIHRoaXMudmlldygpLnNlZWsodGltZSk7XG4gICAgfVxuICAgIHRpbWVyX2R1cmF0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgncnVuVGltZScpO1xuICAgIH1cblxuICAgIF9vblRpbWVyRXZlbnQoZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICB9XG4gIH1cblxuICBWaWRlb0Rpc3BsYXkuY3JlYXRlID0gKGRhdGEpID0+IG5ldyBWaWRlb0Rpc3BsYXkoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG5cbiAgcmV0dXJuIFZpZGVvRGlzcGxheTtcbn0pXG4iXX0=
