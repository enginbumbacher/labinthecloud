'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager'),
      Utils = require('core/util/utils');

  var DomView = require('core/view/dom_view'),
      Button = require('core/component/button/field'),
      Timer = require('core/util/timer'),
      Template = '<div class="notification__note"></div>';

  return function (_DomView) {
    _inherits(NoteView, _DomView);

    function NoteView(model, tmpl) {
      _classCallCheck(this, NoteView);

      var _this = _possibleConstructorReturn(this, (NoteView.__proto__ || Object.getPrototypeOf(NoteView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange', '_onAutoExpire']);

      _this.$el.addClass(model.get('classes').join(' '));
      _this.$el.attr('id', 'note__' + model.get('id'));

      if (model.get('autoExpire') !== null) {
        _this._timer = new Timer({ duration: model.get('autoExpire') });
        _this._timer.addEventListener('Timer.End', _this._onAutoExpire);
      }
      if (model.get('expireLabel')) {
        _this._button = Button.create({
          style: 'link',
          label: model.get('expireLabel'),
          eventName: 'Note.ExpirationRequest'
        });
        _this.addChild(_this._button.view());
      }

      _this.addChild(new DomView('<div class="note__message">' + model.get('message') + '</div>'));

      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(NoteView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        switch (evt.data.path) {
          case "alive":
            if (evt.data.value) {
              this.live();
            } else {
              this.expire();
            }
            break;
        }
      }
    }, {
      key: '_onAutoExpire',
      value: function _onAutoExpire(evt) {
        this.dispatchEvent('Note.ExpirationRequest', {});
      }
    }, {
      key: 'live',
      value: function live() {
        var _this2 = this;

        this.$el.addClass('note__alive');
        setTimeout(function () {
          if (_this2._timer) _this2._timer.start();
        }, 500);
      }
    }, {
      key: 'expire',
      value: function expire() {
        var _this3 = this;

        this.$el.removeClass('note__alive');
        setTimeout(function () {
          _this3.dispatchEvent('Note.Expired');
        }, 500);
      }
    }]);

    return NoteView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ub3RpZmljYXRpb25zL25vdGUvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkhNIiwiVXRpbHMiLCJEb21WaWV3IiwiQnV0dG9uIiwiVGltZXIiLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiJGVsIiwiYWRkQ2xhc3MiLCJnZXQiLCJqb2luIiwiYXR0ciIsIl90aW1lciIsImR1cmF0aW9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkF1dG9FeHBpcmUiLCJfYnV0dG9uIiwiY3JlYXRlIiwic3R5bGUiLCJsYWJlbCIsImV2ZW50TmFtZSIsImFkZENoaWxkIiwidmlldyIsIl9vbk1vZGVsQ2hhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ2YWx1ZSIsImxpdmUiLCJleHBpcmUiLCJkaXNwYXRjaEV2ZW50Iiwic2V0VGltZW91dCIsInN0YXJ0IiwicmVtb3ZlQ2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLEtBQUtGLFFBQVEseUJBQVIsQ0FEUDtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjs7QUFJQSxNQUFNSSxVQUFVSixRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUssU0FBU0wsUUFBUSw2QkFBUixDQURYO0FBQUEsTUFFRU0sUUFBUU4sUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRU8sV0FBVyx3Q0FIYjs7QUFLQTtBQUFBOztBQUNFLHNCQUFZQyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLHNIQUNqQkEsUUFBUUYsUUFEUzs7QUFFdkJKLFlBQU1PLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQixlQUFuQixDQUF4Qjs7QUFFQSxZQUFLQyxHQUFMLENBQVNDLFFBQVQsQ0FBa0JKLE1BQU1LLEdBQU4sQ0FBVSxTQUFWLEVBQXFCQyxJQUFyQixDQUEwQixHQUExQixDQUFsQjtBQUNBLFlBQUtILEdBQUwsQ0FBU0ksSUFBVCxDQUFjLElBQWQsYUFBNkJQLE1BQU1LLEdBQU4sQ0FBVSxJQUFWLENBQTdCOztBQUVBLFVBQUlMLE1BQU1LLEdBQU4sQ0FBVSxZQUFWLE1BQTRCLElBQWhDLEVBQXNDO0FBQ3BDLGNBQUtHLE1BQUwsR0FBYyxJQUFJVixLQUFKLENBQVUsRUFBRVcsVUFBVVQsTUFBTUssR0FBTixDQUFVLFlBQVYsQ0FBWixFQUFWLENBQWQ7QUFDQSxjQUFLRyxNQUFMLENBQVlFLGdCQUFaLENBQTZCLFdBQTdCLEVBQTBDLE1BQUtDLGFBQS9DO0FBQ0Q7QUFDRCxVQUFJWCxNQUFNSyxHQUFOLENBQVUsYUFBVixDQUFKLEVBQThCO0FBQzVCLGNBQUtPLE9BQUwsR0FBZWYsT0FBT2dCLE1BQVAsQ0FBYztBQUMzQkMsaUJBQU8sTUFEb0I7QUFFM0JDLGlCQUFPZixNQUFNSyxHQUFOLENBQVUsYUFBVixDQUZvQjtBQUczQlcscUJBQVc7QUFIZ0IsU0FBZCxDQUFmO0FBS0EsY0FBS0MsUUFBTCxDQUFjLE1BQUtMLE9BQUwsQ0FBYU0sSUFBYixFQUFkO0FBQ0Q7O0FBRUQsWUFBS0QsUUFBTCxDQUFjLElBQUlyQixPQUFKLGlDQUEwQ0ksTUFBTUssR0FBTixDQUFVLFNBQVYsQ0FBMUMsWUFBZDs7QUFFQUwsWUFBTVUsZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBS1MsY0FBNUM7QUF0QnVCO0FBdUJ4Qjs7QUF4Qkg7QUFBQTtBQUFBLHFDQTBCaUJDLEdBMUJqQixFQTBCc0I7QUFDbEIsZ0JBQVFBLElBQUlDLElBQUosQ0FBU0MsSUFBakI7QUFDRSxlQUFLLE9BQUw7QUFDRSxnQkFBSUYsSUFBSUMsSUFBSixDQUFTRSxLQUFiLEVBQW9CO0FBQ2xCLG1CQUFLQyxJQUFMO0FBQ0QsYUFGRCxNQUVPO0FBQ0wsbUJBQUtDLE1BQUw7QUFDRDtBQUNIO0FBUEY7QUFTRDtBQXBDSDtBQUFBO0FBQUEsb0NBc0NnQkwsR0F0Q2hCLEVBc0NxQjtBQUNqQixhQUFLTSxhQUFMLENBQW1CLHdCQUFuQixFQUE2QyxFQUE3QztBQUNEO0FBeENIO0FBQUE7QUFBQSw2QkEwQ1M7QUFBQTs7QUFDTCxhQUFLdkIsR0FBTCxDQUFTQyxRQUFULENBQWtCLGFBQWxCO0FBQ0F1QixtQkFBVyxZQUFNO0FBQ2YsY0FBSSxPQUFLbkIsTUFBVCxFQUFpQixPQUFLQSxNQUFMLENBQVlvQixLQUFaO0FBQ2xCLFNBRkQsRUFFRyxHQUZIO0FBR0Q7QUEvQ0g7QUFBQTtBQUFBLCtCQWlEVztBQUFBOztBQUNQLGFBQUt6QixHQUFMLENBQVMwQixXQUFULENBQXFCLGFBQXJCO0FBQ0FGLG1CQUFXLFlBQU07QUFDZixpQkFBS0QsYUFBTCxDQUFtQixjQUFuQjtBQUNELFNBRkQsRUFFRyxHQUZIO0FBR0Q7QUF0REg7O0FBQUE7QUFBQSxJQUE4QjlCLE9BQTlCO0FBd0RELENBbEVEIiwiZmlsZSI6Im1vZHVsZS9ub3RpZmljYXRpb25zL25vdGUvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyk7XG4gIFxuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgQnV0dG9uID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkJyksXG4gICAgVGltZXIgPSByZXF1aXJlKCdjb3JlL3V0aWwvdGltZXInKSxcbiAgICBUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwibm90aWZpY2F0aW9uX19ub3RlXCI+PC9kaXY+JztcblxuICByZXR1cm4gY2xhc3MgTm90ZVZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbk1vZGVsQ2hhbmdlJywgJ19vbkF1dG9FeHBpcmUnXSlcblxuICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MobW9kZWwuZ2V0KCdjbGFzc2VzJykuam9pbignICcpKTtcbiAgICAgIHRoaXMuJGVsLmF0dHIoJ2lkJywgYG5vdGVfXyR7bW9kZWwuZ2V0KCdpZCcpfWApXG5cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2F1dG9FeHBpcmUnKSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl90aW1lciA9IG5ldyBUaW1lcih7IGR1cmF0aW9uOiBtb2RlbC5nZXQoJ2F1dG9FeHBpcmUnKSB9KTtcbiAgICAgICAgdGhpcy5fdGltZXIuYWRkRXZlbnRMaXN0ZW5lcignVGltZXIuRW5kJywgdGhpcy5fb25BdXRvRXhwaXJlKTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2V4cGlyZUxhYmVsJykpIHtcbiAgICAgICAgdGhpcy5fYnV0dG9uID0gQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgICAgc3R5bGU6ICdsaW5rJyxcbiAgICAgICAgICBsYWJlbDogbW9kZWwuZ2V0KCdleHBpcmVMYWJlbCcpLFxuICAgICAgICAgIGV2ZW50TmFtZTogJ05vdGUuRXhwaXJhdGlvblJlcXVlc3QnXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2J1dHRvbi52aWV3KCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFkZENoaWxkKG5ldyBEb21WaWV3KGA8ZGl2IGNsYXNzPVwibm90ZV9fbWVzc2FnZVwiPiR7bW9kZWwuZ2V0KCdtZXNzYWdlJyl9PC9kaXY+YCkpO1xuXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIHN3aXRjaCAoZXZ0LmRhdGEucGF0aCkge1xuICAgICAgICBjYXNlIFwiYWxpdmVcIjpcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMubGl2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV4cGlyZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uQXV0b0V4cGlyZShldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnTm90ZS5FeHBpcmF0aW9uUmVxdWVzdCcsIHt9KTtcbiAgICB9XG5cbiAgICBsaXZlKCkge1xuICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ25vdGVfX2FsaXZlJyk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVyKSB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgfSwgNTAwKVxuICAgIH1cblxuICAgIGV4cGlyZSgpIHtcbiAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdub3RlX19hbGl2ZScpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnTm90ZS5FeHBpcmVkJyk7XG4gICAgICB9LCA1MDApO1xuICAgIH1cbiAgfVxufSkiXX0=
