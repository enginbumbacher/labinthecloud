'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./visualresult.html'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      Button = require('core/component/button/field');

  require('link!./visualresult.css');

  return function (_DomView) {
    _inherits(VisualResultView, _DomView);

    function VisualResultView(model, tmpl) {
      _classCallCheck(this, VisualResultView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VisualResultView).call(this, tmpl || Template));

      _this.$el.find('.visual-result__content').css({
        width: model.get('width'),
        height: model.get('height')
      });
      _this.playPauseButton = Button.create({
        id: "playPause",
        label: "Pause",
        eventName: "VisualResult.PlayPauseRequest",
        style: "visual-result__control__toggle"
      });
      _this.addChild(_this.playPauseButton.view(), ".visual-result__control");
      return _this;
    }

    _createClass(VisualResultView, [{
      key: 'tick',
      value: function tick(time) {
        this.$el.find('.visual-result__time').text(Utils.secondsToTimeString(time));
      }
    }, {
      key: 'handlePlayState',
      value: function handlePlayState(playing) {
        this.playPauseButton.setLabel(playing ? "Pause" : "Play");
      }
    }]);

    return VisualResultView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFVBQVUsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0UsV0FBVyxRQUFRLDBCQUFSLENBRGI7QUFBQSxNQUVFLFFBQVEsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRSxVQUFVLFFBQVEsb0JBQVIsQ0FIWjtBQUFBLE1BSUUsU0FBUyxRQUFRLDZCQUFSLENBSlg7O0FBTUEsVUFBUSx5QkFBUjs7QUFFQTtBQUFBOztBQUNFLDhCQUFZLEtBQVosRUFBbUIsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxzR0FDakIsUUFBUSxRQURTOztBQUd2QixZQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMseUJBQWQsRUFBeUMsR0FBekMsQ0FBNkM7QUFDM0MsZUFBTyxNQUFNLEdBQU4sQ0FBVSxPQUFWLENBRG9DO0FBRTNDLGdCQUFRLE1BQU0sR0FBTixDQUFVLFFBQVY7QUFGbUMsT0FBN0M7QUFJQSxZQUFLLGVBQUwsR0FBdUIsT0FBTyxNQUFQLENBQWM7QUFDbkMsWUFBSSxXQUQrQjtBQUVuQyxlQUFPLE9BRjRCO0FBR25DLG1CQUFXLCtCQUh3QjtBQUluQyxlQUFPO0FBSjRCLE9BQWQsQ0FBdkI7QUFNQSxZQUFLLFFBQUwsQ0FBYyxNQUFLLGVBQUwsQ0FBcUIsSUFBckIsRUFBZCxFQUEyQyx5QkFBM0M7QUFidUI7QUFjeEI7O0FBZkg7QUFBQTtBQUFBLDJCQWlCTyxJQWpCUCxFQWlCYTtBQUNULGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxzQkFBZCxFQUFzQyxJQUF0QyxDQUEyQyxNQUFNLG1CQUFOLENBQTBCLElBQTFCLENBQTNDO0FBQ0Q7QUFuQkg7QUFBQTtBQUFBLHNDQXFCa0IsT0FyQmxCLEVBcUIyQjtBQUN2QixhQUFLLGVBQUwsQ0FBcUIsUUFBckIsQ0FBOEIsVUFBVSxPQUFWLEdBQW9CLE1BQWxEO0FBQ0Q7QUF2Qkg7O0FBQUE7QUFBQSxJQUFzQyxPQUF0QztBQXlCRCxDQWxDRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3ZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
