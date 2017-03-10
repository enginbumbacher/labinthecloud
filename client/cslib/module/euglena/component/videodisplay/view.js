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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VideoDisplayView).call(this, tmpl || Template));

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
        this._video[0].currentTime = time;
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        var model = evt.currentTarget;
        switch (evt.data.path) {
          case "video":
            this._video.attr('src', evt.data.value);
            break;
          case "runTime":
            this._runTime = evt.data.value;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFVBQVUsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFdBQVcsUUFBUSwwQkFBUixDQUZiOztBQUlBO0FBQUE7O0FBQ0UsOEJBQVksS0FBWixFQUFtQixJQUFuQixFQUF5QjtBQUFBOztBQUFBLHNHQUNqQixRQUFRLFFBRFM7O0FBRXZCLFlBQU0sV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLGtCQUFuQixFQUF1QyxhQUF2QyxFQUFzRCxjQUF0RCxDQUF4Qjs7QUFFQSxZQUFLLE1BQUwsR0FBYyxNQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsdUJBQWQsQ0FBZDtBQUNBLFlBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxnQkFBZixFQUFpQyxNQUFLLGdCQUF0QztBQUNBLFlBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLE1BQUssV0FBN0I7QUFDQSxZQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWUsWUFBZixFQUE2QixNQUFLLFlBQWxDOztBQUVBLFlBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0I7QUFDZCxlQUFPLE1BQU0sR0FBTixDQUFVLE9BQVYsQ0FETztBQUVkLGdCQUFRLE1BQU0sR0FBTixDQUFVLFFBQVY7QUFGTSxPQUFoQjs7QUFLQSxZQUFNLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUssY0FBNUM7QUFkdUI7QUFleEI7O0FBaEJIO0FBQUE7QUFBQSw2QkFrQlM7QUFDTCxlQUFPLEtBQUssUUFBTCxHQUFnQixLQUFLLE1BQUwsQ0FBWSxDQUFaLEVBQWUsV0FBL0IsR0FBNkMsS0FBSyxNQUFMLENBQVksQ0FBWixFQUFlLFFBQW5FO0FBQ0Q7QUFwQkg7QUFBQTtBQUFBLDhCQXNCVTtBQUNOLGFBQUssTUFBTCxDQUFZLENBQVosRUFBZSxJQUFmO0FBQ0Q7QUF4Qkg7QUFBQTtBQUFBLDZCQTBCUztBQUNMLGFBQUssS0FBTDtBQUNBLGFBQUssSUFBTCxDQUFVLENBQVY7QUFDRDtBQTdCSDtBQUFBO0FBQUEsOEJBK0JVO0FBQ04sYUFBSyxNQUFMLENBQVksQ0FBWixFQUFlLEtBQWY7QUFDRDtBQWpDSDtBQUFBO0FBQUEsMkJBbUNPLElBbkNQLEVBbUNhO0FBQ1QsYUFBSyxNQUFMLENBQVksQ0FBWixFQUFlLFdBQWYsR0FBNkIsSUFBN0I7QUFDRDtBQXJDSDtBQUFBO0FBQUEscUNBdUNpQixHQXZDakIsRUF1Q3NCO0FBQ2xCLFlBQU0sUUFBUSxJQUFJLGFBQWxCO0FBQ0EsZ0JBQVEsSUFBSSxJQUFKLENBQVMsSUFBakI7QUFDRSxlQUFLLE9BQUw7QUFDRSxpQkFBSyxNQUFMLENBQVksSUFBWixDQUFpQixLQUFqQixFQUF3QixJQUFJLElBQUosQ0FBUyxLQUFqQztBQUNGO0FBQ0EsZUFBSyxTQUFMO0FBQ0UsaUJBQUssUUFBTCxHQUFnQixJQUFJLElBQUosQ0FBUyxLQUF6QjtBQUNGO0FBTkY7QUFRRDtBQWpESDtBQUFBO0FBQUEsdUNBbURtQixLQW5EbkIsRUFtRDBCO0FBQ3RCLGFBQUssTUFBTCxDQUFZLENBQVosRUFBZSxZQUFmLEdBQThCLEtBQUssTUFBTCxDQUFZLENBQVosRUFBZSxRQUFmLEdBQTBCLEtBQUssUUFBN0Q7QUFDQSxhQUFLLGFBQUwsQ0FBbUIsb0JBQW5CLEVBQXlDLEVBQXpDLEVBQTZDLElBQTdDO0FBQ0Q7QUF0REg7QUFBQTtBQUFBLG1DQXdEZSxLQXhEZixFQXdEc0I7QUFDbEIsWUFBTSxPQUFPLEtBQUssSUFBTCxFQUFiO0FBQ0EsWUFBSSxLQUFLLFNBQUwsSUFBa0IsT0FBTyxLQUFLLFNBQWxDLEVBQTZDO0FBQzNDLGVBQUssYUFBTCxDQUFtQixrQkFBbkI7QUFDRDtBQUNELGFBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNEO0FBOURIO0FBQUE7QUFBQSxrQ0ErRGMsS0EvRGQsRUErRHFCO0FBQ2pCLGFBQUssYUFBTCxDQUFtQixpQkFBbkI7QUFDRDtBQWpFSDs7QUFBQTtBQUFBLElBQXNDLE9BQXRDO0FBbUVELENBeEVEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
