'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      HM = require('core/event/hook_manager');

  var LayoutPanel = function (_Component) {
    _inherits(LayoutPanel, _Component);

    function LayoutPanel(settings) {
      _classCallCheck(this, LayoutPanel);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      return _possibleConstructorReturn(this, (LayoutPanel.__proto__ || Object.getPrototypeOf(LayoutPanel)).call(this, settings));
    }

    _createClass(LayoutPanel, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'build',
      value: function build() {
        var _this2 = this;

        var contents = [];
        HM.invoke('Panel.Contents', contents, {
          id: this._model.get('id')
        });
        contents.forEach(function (content, ind) {
          _this2._model.addContent(content);
        });
      }
    }, {
      key: 'addContent',
      value: function addContent(content) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        this._model.addContent(content, index);
      }
    }, {
      key: 'removeContent',
      value: function removeContent(content) {
        this._model.removeContent(content);
      }
    }]);

    return LayoutPanel;
  }(Component);

  LayoutPanel.create = function (config) {
    return new LayoutPanel({ modelData: config });
  };
  return LayoutPanel;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9sYXlvdXQvcGFuZWwvcGFuZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIkhNIiwiTGF5b3V0UGFuZWwiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJfbW9kZWwiLCJnZXQiLCJjb250ZW50cyIsImludm9rZSIsImlkIiwiZm9yRWFjaCIsImNvbnRlbnQiLCJpbmQiLCJhZGRDb250ZW50IiwiaW5kZXgiLCJyZW1vdmVDb250ZW50IiwiY3JlYXRlIiwiY29uZmlnIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUO0FBQUEsTUFJRUksS0FBS0osUUFBUSx5QkFBUixDQUpQOztBQURrQixNQU9aSyxXQVBZO0FBQUE7O0FBUWhCLHlCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCTCxLQUE3QztBQUNBSSxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCTCxJQUEzQztBQUZvQix1SEFHZEcsUUFIYztBQUlyQjs7QUFaZTtBQUFBO0FBQUEsMkJBY1g7QUFDSCxlQUFPLEtBQUtHLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFoQmU7QUFBQTtBQUFBLDhCQWtCUjtBQUFBOztBQUNOLFlBQUlDLFdBQVcsRUFBZjtBQUNBUCxXQUFHUSxNQUFILENBQVUsZ0JBQVYsRUFBNEJELFFBQTVCLEVBQXNDO0FBQ3BDRSxjQUFJLEtBQUtKLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixJQUFoQjtBQURnQyxTQUF0QztBQUdBQyxpQkFBU0csT0FBVCxDQUFpQixVQUFDQyxPQUFELEVBQVVDLEdBQVYsRUFBa0I7QUFDakMsaUJBQUtQLE1BQUwsQ0FBWVEsVUFBWixDQUF1QkYsT0FBdkI7QUFDRCxTQUZEO0FBR0Q7QUExQmU7QUFBQTtBQUFBLGlDQTRCTEEsT0E1QkssRUE0QmtCO0FBQUEsWUFBZEcsS0FBYyx1RUFBTixJQUFNOztBQUNoQyxhQUFLVCxNQUFMLENBQVlRLFVBQVosQ0FBdUJGLE9BQXZCLEVBQWdDRyxLQUFoQztBQUNEO0FBOUJlO0FBQUE7QUFBQSxvQ0FnQ0ZILE9BaENFLEVBZ0NPO0FBQ3JCLGFBQUtOLE1BQUwsQ0FBWVUsYUFBWixDQUEwQkosT0FBMUI7QUFDRDtBQWxDZTs7QUFBQTtBQUFBLElBT1FkLFNBUFI7O0FBcUNsQkksY0FBWWUsTUFBWixHQUFxQixVQUFDQyxNQUFELEVBQVk7QUFDL0IsV0FBTyxJQUFJaEIsV0FBSixDQUFnQixFQUFFaUIsV0FBV0QsTUFBYixFQUFoQixDQUFQO0FBQ0QsR0FGRDtBQUdBLFNBQU9oQixXQUFQO0FBQ0QsQ0F6Q0QiLCJmaWxlIjoibW9kdWxlL2xheW91dC9wYW5lbC9wYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG5cbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY2xhc3MgTGF5b3V0UGFuZWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIGlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKTtcbiAgICB9XG5cbiAgICBidWlsZCgpIHtcbiAgICAgIGxldCBjb250ZW50cyA9IFtdO1xuICAgICAgSE0uaW52b2tlKCdQYW5lbC5Db250ZW50cycsIGNvbnRlbnRzLCB7XG4gICAgICAgIGlkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgIH0pO1xuICAgICAgY29udGVudHMuZm9yRWFjaCgoY29udGVudCwgaW5kKSA9PiB7XG4gICAgICAgIHRoaXMuX21vZGVsLmFkZENvbnRlbnQoY29udGVudCk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIGFkZENvbnRlbnQoY29udGVudCwgaW5kZXggPSBudWxsKSB7XG4gICAgICB0aGlzLl9tb2RlbC5hZGRDb250ZW50KGNvbnRlbnQsIGluZGV4KTtcbiAgICB9XG5cbiAgICByZW1vdmVDb250ZW50KGNvbnRlbnQpIHtcbiAgICAgIHRoaXMuX21vZGVsLnJlbW92ZUNvbnRlbnQoY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgTGF5b3V0UGFuZWwuY3JlYXRlID0gKGNvbmZpZykgPT4ge1xuICAgIHJldHVybiBuZXcgTGF5b3V0UGFuZWwoeyBtb2RlbERhdGE6IGNvbmZpZyB9KTtcbiAgfVxuICByZXR1cm4gTGF5b3V0UGFuZWw7XG59KSJdfQ==
