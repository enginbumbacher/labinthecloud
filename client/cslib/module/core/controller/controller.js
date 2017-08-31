'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

*/
define(function (require) {
  var EventDispatcher = require('core/event/dispatcher'),
      Utils = require('core/util/utils'),
      defaults = {
    modelClass: null,
    viewClass: null,
    modelData: {}
  };

  return function (_EventDispatcher) {
    _inherits(Controller, _EventDispatcher);

    function Controller(settings) {
      _classCallCheck(this, Controller);

      var _this = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this));

      var config = Utils.ensureDefaults(settings, defaults);
      if (config.modelClass) _this._model = new config.modelClass({ data: config.modelData });
      if (config.viewClass) _this._view = new config.viewClass(_this._model);
      return _this;
    }

    _createClass(Controller, [{
      key: 'view',
      value: function view() {
        return this._view;
      }
    }]);

    return Controller;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbnRyb2xsZXIvY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRXZlbnREaXNwYXRjaGVyIiwiVXRpbHMiLCJkZWZhdWx0cyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJtb2RlbERhdGEiLCJzZXR0aW5ncyIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwiX21vZGVsIiwiZGF0YSIsIl92aWV3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7OztBQUdBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxrQkFBa0JELFFBQVEsdUJBQVIsQ0FBeEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxXQUFXO0FBQ1RDLGdCQUFZLElBREg7QUFFVEMsZUFBVyxJQUZGO0FBR1RDLGVBQVc7QUFIRixHQUZiOztBQVFBO0FBQUE7O0FBQ0Usd0JBQVlDLFFBQVosRUFBc0I7QUFBQTs7QUFBQTs7QUFFcEIsVUFBSUMsU0FBU04sTUFBTU8sY0FBTixDQUFxQkYsUUFBckIsRUFBK0JKLFFBQS9CLENBQWI7QUFDQSxVQUFJSyxPQUFPSixVQUFYLEVBQXVCLE1BQUtNLE1BQUwsR0FBYyxJQUFJRixPQUFPSixVQUFYLENBQXNCLEVBQUVPLE1BQU1ILE9BQU9GLFNBQWYsRUFBdEIsQ0FBZDtBQUN2QixVQUFJRSxPQUFPSCxTQUFYLEVBQXNCLE1BQUtPLEtBQUwsR0FBYSxJQUFJSixPQUFPSCxTQUFYLENBQXFCLE1BQUtLLE1BQTFCLENBQWI7QUFKRjtBQUtyQjs7QUFOSDtBQUFBO0FBQUEsNkJBUVM7QUFDTCxlQUFPLEtBQUtFLEtBQVo7QUFDRDtBQVZIOztBQUFBO0FBQUEsSUFBZ0NYLGVBQWhDO0FBWUQsQ0FyQkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29udHJvbGxlci9jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuKi9cbmRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdjb3JlL2V2ZW50L2Rpc3BhdGNoZXInKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgbW9kZWxDbGFzczogbnVsbCxcbiAgICAgIHZpZXdDbGFzczogbnVsbCxcbiAgICAgIG1vZGVsRGF0YToge31cbiAgICB9O1xuXG4gIHJldHVybiBjbGFzcyBDb250cm9sbGVyIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGxldCBjb25maWcgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhzZXR0aW5ncywgZGVmYXVsdHMpO1xuICAgICAgaWYgKGNvbmZpZy5tb2RlbENsYXNzKSB0aGlzLl9tb2RlbCA9IG5ldyBjb25maWcubW9kZWxDbGFzcyh7IGRhdGE6IGNvbmZpZy5tb2RlbERhdGEgfSk7XG4gICAgICBpZiAoY29uZmlnLnZpZXdDbGFzcykgdGhpcy5fdmlldyA9IG5ldyBjb25maWcudmlld0NsYXNzKHRoaXMuX21vZGVsKTtcbiAgICB9XG5cbiAgICB2aWV3KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZpZXc7XG4gICAgfVxuICB9XG59KTsiXX0=
