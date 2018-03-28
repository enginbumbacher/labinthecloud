'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      Template = require('text!./videodisplay.html');

  return function (_DomView) {
    _inherits(VideoDisplayView, _DomView);

    function VideoDisplayView(model, tmpl) {
      _classCallCheck(this, VideoDisplayView);

      var _this = _possibleConstructorReturn(this, (VideoDisplayView.__proto__ || Object.getPrototypeOf(VideoDisplayView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange', '_onVideoMetaData', '_onVideoEnd', '_onVideoTick']);

      _this._video = _this.$el.find('.video-display__video');
      _this._video.on('loadedmetadata', _this._onVideoMetaData);
      _this._video.on('ended', _this._onVideoEnd);
      _this._video.on('timeupdate', _this._onVideoTick);

      _this._video.css({
        width: model.get('width'),
        height: model.get('height')
      });

      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(VideoDisplayView, [{
      key: 'time',
      value: function time() {
        return this._runTime * this._video[0].currentTime / this._video[0].duration;
      }
    }, {
      key: 'setPlaybackRate',
      value: function setPlaybackRate(faster) {
        if (this._video[0]) {
          if (faster) {
            this._video[0].playbackRate = 4 * this._video[0].duration / this._runTime;
          } else {
            this._video[0].playbackRate = 1 * this._video[0].duration / this._runTime;
          }
        }
      }
    }, {
      key: 'start',
      value: function start() {
        this._video[0].play();
      }
    }, {
      key: 'stop',
      value: function stop() {
        this.pause();
        this.seek(0);
      }
    }, {
      key: 'pause',
      value: function pause() {
        this._video[0].pause();
      }
    }, {
      key: 'seek',
      value: function seek(time) {
        if (this._video[0].duration) {
          this._video[0].currentTime = time * this._video[0].duration / this._runTime;
        } else {
          this._video[0].currentTime = 0;
        }
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        var model = evt.currentTarget;
        switch (evt.data.path) {
          case "video":
            this._video.attr('src', evt.data.value);
            if (evt.data.value == null) {
              this._video.hide();
            } else {
              this._video.show();
            }
            break;
          case "runTime":
            this._runTime = evt.data.value;
            break;
          case "showVideo":
            if (evt.data.value) {
              this._video.css({ display: 'inline' });
            } else {
              this._video.css({ display: 'none' });
            }
            break;
        }
      }
    }, {
      key: '_onVideoMetaData',
      value: function _onVideoMetaData(jqevt) {
        this._video[0].playbackRate = this._video[0].duration / this._runTime;
        this.dispatchEvent('VideoDisplay.Ready', {}, true);
      }
    }, {
      key: '_onVideoTick',
      value: function _onVideoTick(jqevt) {
        var curr = this.time();
        if (this._lastTime && curr < this._lastTime) {
          this.dispatchEvent('TimerSource.Loop');
        }
        this._lastTime = curr;
      }
    }, {
      key: '_onVideoEnd',
      value: function _onVideoEnd(jqevt) {
        this.dispatchEvent('TimerSource.End');
      }
    }]);

    return VideoDisplayView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl92aWRlbyIsIiRlbCIsImZpbmQiLCJvbiIsIl9vblZpZGVvTWV0YURhdGEiLCJfb25WaWRlb0VuZCIsIl9vblZpZGVvVGljayIsImNzcyIsIndpZHRoIiwiZ2V0IiwiaGVpZ2h0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiX3J1blRpbWUiLCJjdXJyZW50VGltZSIsImR1cmF0aW9uIiwiZmFzdGVyIiwicGxheWJhY2tSYXRlIiwicGxheSIsInBhdXNlIiwic2VlayIsInRpbWUiLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YSIsInBhdGgiLCJhdHRyIiwidmFsdWUiLCJoaWRlIiwic2hvdyIsImRpc3BsYXkiLCJqcWV2dCIsImRpc3BhdGNoRXZlbnQiLCJjdXJyIiwiX2xhc3RUaW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxXQUFXSCxRQUFRLDBCQUFSLENBRmI7O0FBSUE7QUFBQTs7QUFDRSw4QkFBWUksS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxzSUFDakJBLFFBQVFGLFFBRFM7O0FBRXZCRCxZQUFNSSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsa0JBQW5CLEVBQXVDLGFBQXZDLEVBQXNELGNBQXRELENBQXhCOztBQUVBLFlBQUtDLE1BQUwsR0FBYyxNQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYyx1QkFBZCxDQUFkO0FBQ0EsWUFBS0YsTUFBTCxDQUFZRyxFQUFa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QUFMLENBQVlPLEdBQVosQ0FBZ0IsRUFBQ3VCLFNBQVMsTUFBVixFQUFoQjtBQUFxQztBQUM5QztBQWZGO0FBaUJEO0FBckVIO0FBQUE7QUFBQSx1Q0F1RW1CQyxLQXZFbkIsRUF1RTBCO0FBQ3RCLGFBQUsvQixNQUFMLENBQVksQ0FBWixFQUFlaUIsWUFBZixHQUE4QixLQUFLakIsTUFBTCxDQUFZLENBQVosRUFBZWUsUUFBZixHQUEwQixLQUFLRixRQUE3RDtBQUNBLGFBQUttQixhQUFMLENBQW1CLG9CQUFuQixFQUF5QyxFQUF6QyxFQUE2QyxJQUE3QztBQUNEO0FBMUVIO0FBQUE7QUFBQSxtQ0E0RWVELEtBNUVmLEVBNEVzQjtBQUNsQixZQUFNRSxPQUFPLEtBQUtaLElBQUwsRUFBYjtBQUNBLFlBQUksS0FBS2EsU0FBTCxJQUFrQkQsT0FBTyxLQUFLQyxTQUFsQyxFQUE2QztBQUMzQyxlQUFLRixhQUFMLENBQW1CLGtCQUFuQjtBQUNEO0FBQ0QsYUFBS0UsU0FBTCxHQUFpQkQsSUFBakI7QUFDRDtBQWxGSDtBQUFBO0FBQUEsa0NBbUZjRixLQW5GZCxFQW1GcUI7QUFDakIsYUFBS0MsYUFBTCxDQUFtQixpQkFBbkI7QUFDRDtBQXJGSDs7QUFBQTtBQUFBLElBQXNDdEMsT0FBdEM7QUF1RkQsQ0E1RkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3ZpZGVvZGlzcGxheS92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3ZpZGVvZGlzcGxheS5odG1sJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFZpZGVvRGlzcGxheVZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbk1vZGVsQ2hhbmdlJywgJ19vblZpZGVvTWV0YURhdGEnLCAnX29uVmlkZW9FbmQnLCAnX29uVmlkZW9UaWNrJ10pO1xuXG4gICAgICB0aGlzLl92aWRlbyA9IHRoaXMuJGVsLmZpbmQoJy52aWRlby1kaXNwbGF5X192aWRlbycpO1xuICAgICAgdGhpcy5fdmlkZW8ub24oJ2xvYWRlZG1ldGFkYXRhJywgdGhpcy5fb25WaWRlb01ldGFEYXRhKVxuICAgICAgdGhpcy5fdmlkZW8ub24oJ2VuZGVkJywgdGhpcy5fb25WaWRlb0VuZCk7XG4gICAgICB0aGlzLl92aWRlby5vbigndGltZXVwZGF0ZScsIHRoaXMuX29uVmlkZW9UaWNrKTtcblxuICAgICAgdGhpcy5fdmlkZW8uY3NzKHtcbiAgICAgICAgd2lkdGg6IG1vZGVsLmdldCgnd2lkdGgnKSxcbiAgICAgICAgaGVpZ2h0OiBtb2RlbC5nZXQoJ2hlaWdodCcpXG4gICAgICB9KVxuXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICB9XG5cbiAgICB0aW1lKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3J1blRpbWUgKiB0aGlzLl92aWRlb1swXS5jdXJyZW50VGltZSAvIHRoaXMuX3ZpZGVvWzBdLmR1cmF0aW9uO1xuICAgIH1cblxuICAgIHNldFBsYXliYWNrUmF0ZShmYXN0ZXIpIHtcbiAgICAgIGlmICh0aGlzLl92aWRlb1swXSkge1xuICAgICAgICBpZiAoZmFzdGVyKSB7dGhpcy5fdmlkZW9bMF0ucGxheWJhY2tSYXRlID0gNCAqIHRoaXMuX3ZpZGVvWzBdLmR1cmF0aW9uIC8gdGhpcy5fcnVuVGltZTt9XG4gICAgICAgIGVsc2UgeyB0aGlzLl92aWRlb1swXS5wbGF5YmFja1JhdGUgPSAxICogdGhpcy5fdmlkZW9bMF0uZHVyYXRpb24gLyB0aGlzLl9ydW5UaW1lO31cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgIHRoaXMuX3ZpZGVvWzBdLnBsYXkoKTtcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgdGhpcy5zZWVrKDApO1xuICAgIH1cblxuICAgIHBhdXNlKCkge1xuICAgICAgdGhpcy5fdmlkZW9bMF0ucGF1c2UoKVxuICAgIH1cblxuICAgIHNlZWsodGltZSkge1xuICAgICAgaWYgKHRoaXMuX3ZpZGVvWzBdLmR1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3ZpZGVvWzBdLmN1cnJlbnRUaW1lID0gdGltZSAqIHRoaXMuX3ZpZGVvWzBdLmR1cmF0aW9uIC8gdGhpcy5fcnVuVGltZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3ZpZGVvWzBdLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gZXZ0LmN1cnJlbnRUYXJnZXQ7XG4gICAgICBzd2l0Y2ggKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSBcInZpZGVvXCI6XG4gICAgICAgICAgdGhpcy5fdmlkZW8uYXR0cignc3JjJywgZXZ0LmRhdGEudmFsdWUpO1xuICAgICAgICAgIGlmIChldnQuZGF0YS52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl92aWRlby5oaWRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpZGVvLnNob3coKTtcbiAgICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicnVuVGltZVwiOlxuICAgICAgICAgIHRoaXMuX3J1blRpbWUgPSBldnQuZGF0YS52YWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzaG93VmlkZW9cIjpcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUpIHsgdGhpcy5fdmlkZW8uY3NzKHtkaXNwbGF5OiAnaW5saW5lJ30pO31cbiAgICAgICAgICBlbHNlIHsgdGhpcy5fdmlkZW8uY3NzKHtkaXNwbGF5OiAnbm9uZSd9KTsgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25WaWRlb01ldGFEYXRhKGpxZXZ0KSB7XG4gICAgICB0aGlzLl92aWRlb1swXS5wbGF5YmFja1JhdGUgPSB0aGlzLl92aWRlb1swXS5kdXJhdGlvbiAvIHRoaXMuX3J1blRpbWU7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1ZpZGVvRGlzcGxheS5SZWFkeScsIHt9LCB0cnVlKTtcbiAgICB9XG5cbiAgICBfb25WaWRlb1RpY2soanFldnQpIHtcbiAgICAgIGNvbnN0IGN1cnIgPSB0aGlzLnRpbWUoKTtcbiAgICAgIGlmICh0aGlzLl9sYXN0VGltZSAmJiBjdXJyIDwgdGhpcy5fbGFzdFRpbWUpIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdUaW1lclNvdXJjZS5Mb29wJyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9sYXN0VGltZSA9IGN1cnI7XG4gICAgfVxuICAgIF9vblZpZGVvRW5kKGpxZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1RpbWVyU291cmNlLkVuZCcpO1xuICAgIH1cbiAgfVxufSlcbiJdfQ==
