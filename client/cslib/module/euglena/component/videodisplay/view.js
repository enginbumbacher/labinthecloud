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
        this._video[0].currentTime = time * this._video[0].duration / this._runTime;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl92aWRlbyIsIiRlbCIsImZpbmQiLCJvbiIsIl9vblZpZGVvTWV0YURhdGEiLCJfb25WaWRlb0VuZCIsIl9vblZpZGVvVGljayIsImNzcyIsIndpZHRoIiwiZ2V0IiwiaGVpZ2h0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiX3J1blRpbWUiLCJjdXJyZW50VGltZSIsImR1cmF0aW9uIiwicGxheSIsInBhdXNlIiwic2VlayIsInRpbWUiLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YSIsInBhdGgiLCJhdHRyIiwidmFsdWUiLCJoaWRlIiwic2hvdyIsImRpc3BsYXkiLCJqcWV2dCIsInBsYXliYWNrUmF0ZSIsImRpc3BhdGNoRXZlbnQiLCJjdXJyIiwiX2xhc3RUaW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxXQUFXSCxRQUFRLDBCQUFSLENBRmI7O0FBSUE7QUFBQTs7QUFDRSw4QkFBWUksS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxzSUFDakJBLFFBQVFGLFFBRFM7O0FBRXZCRCxZQUFNSSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsa0JBQW5CLEVBQXVDLGFBQXZDLEVBQXNELGNBQXRELENBQXhCOztBQUVBLFlBQUtDLE1BQUwsR0FBYyxNQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYyx1QkFBZCxDQUFkO0FBQ0EsWUFBS0YsTUFBTCxDQUFZRyxFQUFaLENBQWUsZ0JB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SCxLQXhFZCxFQXdFcUI7QUFDakIsYUFBS0UsYUFBTCxDQUFtQixpQkFBbkI7QUFDRDtBQTFFSDs7QUFBQTtBQUFBLElBQXNDckMsT0FBdEM7QUE0RUQsQ0FqRkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3ZpZGVvZGlzcGxheS92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3ZpZGVvZGlzcGxheS5odG1sJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFZpZGVvRGlzcGxheVZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbk1vZGVsQ2hhbmdlJywgJ19vblZpZGVvTWV0YURhdGEnLCAnX29uVmlkZW9FbmQnLCAnX29uVmlkZW9UaWNrJ10pO1xuXG4gICAgICB0aGlzLl92aWRlbyA9IHRoaXMuJGVsLmZpbmQoJy52aWRlby1kaXNwbGF5X192aWRlbycpO1xuICAgICAgdGhpcy5fdmlkZW8ub24oJ2xvYWRlZG1ldGFkYXRhJywgdGhpcy5fb25WaWRlb01ldGFEYXRhKVxuICAgICAgdGhpcy5fdmlkZW8ub24oJ2VuZGVkJywgdGhpcy5fb25WaWRlb0VuZCk7XG4gICAgICB0aGlzLl92aWRlby5vbigndGltZXVwZGF0ZScsIHRoaXMuX29uVmlkZW9UaWNrKTtcblxuICAgICAgdGhpcy5fdmlkZW8uY3NzKHtcbiAgICAgICAgd2lkdGg6IG1vZGVsLmdldCgnd2lkdGgnKSxcbiAgICAgICAgaGVpZ2h0OiBtb2RlbC5nZXQoJ2hlaWdodCcpXG4gICAgICB9KVxuXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICB9XG5cbiAgICB0aW1lKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3J1blRpbWUgKiB0aGlzLl92aWRlb1swXS5jdXJyZW50VGltZSAvIHRoaXMuX3ZpZGVvWzBdLmR1cmF0aW9uO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgdGhpcy5fdmlkZW9bMF0ucGxheSgpO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICB0aGlzLnNlZWsoMCk7XG4gICAgfVxuXG4gICAgcGF1c2UoKSB7XG4gICAgICB0aGlzLl92aWRlb1swXS5wYXVzZSgpXG4gICAgfVxuXG4gICAgc2Vlayh0aW1lKSB7XG4gICAgICB0aGlzLl92aWRlb1swXS5jdXJyZW50VGltZSA9IHRpbWUgKiB0aGlzLl92aWRlb1swXS5kdXJhdGlvbiAvIHRoaXMuX3J1blRpbWU7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBjb25zdCBtb2RlbCA9IGV2dC5jdXJyZW50VGFyZ2V0O1xuICAgICAgc3dpdGNoIChldnQuZGF0YS5wYXRoKSB7XG4gICAgICAgIGNhc2UgXCJ2aWRlb1wiOlxuICAgICAgICAgIHRoaXMuX3ZpZGVvLmF0dHIoJ3NyYycsIGV2dC5kYXRhLnZhbHVlKTtcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlkZW8uaGlkZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92aWRlby5zaG93KCk7XG4gICAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJ1blRpbWVcIjpcbiAgICAgICAgICB0aGlzLl9ydW5UaW1lID0gZXZ0LmRhdGEudmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2hvd1ZpZGVvXCI6XG4gICAgICAgICAgaWYgKGV2dC5kYXRhLnZhbHVlKSB7IHRoaXMuX3ZpZGVvLmNzcyh7ZGlzcGxheTogJ2lubGluZSd9KTt9XG4gICAgICAgICAgZWxzZSB7IHRoaXMuX3ZpZGVvLmNzcyh7ZGlzcGxheTogJ25vbmUnfSk7IH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uVmlkZW9NZXRhRGF0YShqcWV2dCkge1xuICAgICAgdGhpcy5fdmlkZW9bMF0ucGxheWJhY2tSYXRlID0gdGhpcy5fdmlkZW9bMF0uZHVyYXRpb24gLyB0aGlzLl9ydW5UaW1lO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaWRlb0Rpc3BsYXkuUmVhZHknLCB7fSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgX29uVmlkZW9UaWNrKGpxZXZ0KSB7XG4gICAgICBjb25zdCBjdXJyID0gdGhpcy50aW1lKCk7XG4gICAgICBpZiAodGhpcy5fbGFzdFRpbWUgJiYgY3VyciA8IHRoaXMuX2xhc3RUaW1lKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnVGltZXJTb3VyY2UuTG9vcCcpO1xuICAgICAgfVxuICAgICAgdGhpcy5fbGFzdFRpbWUgPSBjdXJyO1xuICAgIH1cbiAgICBfb25WaWRlb0VuZChqcWV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdUaW1lclNvdXJjZS5FbmQnKTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
