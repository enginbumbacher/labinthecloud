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

  var CircleHistogram = function (_Component) {
    _inherits(CircleHistogram, _Component);

    function CircleHistogram() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, CircleHistogram);

      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;
      return _possibleConstructorReturn(this, (CircleHistogram.__proto__ || Object.getPrototypeOf(CircleHistogram)).call(this, config));
    }

    _createClass(CircleHistogram, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'handleData',
      value: function handleData(data) {
        var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
        var lightConfig = arguments[2];
        var color = arguments[3];

        this._model.parseData(data, layer, color);
      }
    }, {
      key: 'setLive',
      value: function setLive(showLayerLive) {
        this._model.setLayerLive(showLayerLive);
      }
    }, {
      key: 'update',
      value: function update(timestamp, lights) {
        this._model.update(timestamp, lights);
      }
    }, {
      key: 'reset',
      value: function reset() {
        this._model.reset();
      }
    }]);

    return CircleHistogram;
  }(Component);

  CircleHistogram.create = function (data) {
    return new CircleHistogram({ modelData: data });
  };

  return CircleHistogram;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9jaXJjbGVncmFwaC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJDaXJjbGVIaXN0b2dyYW0iLCJjb25maWciLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsImxheWVyIiwibGlnaHRDb25maWciLCJjb2xvciIsInBhcnNlRGF0YSIsInNob3dMYXllckxpdmUiLCJzZXRMYXllckxpdmUiLCJ0aW1lc3RhbXAiLCJsaWdodHMiLCJ1cGRhdGUiLCJyZXNldCIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFPWkssZUFQWTtBQUFBOztBQVFoQiwrQkFBeUI7QUFBQSxVQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3ZCQSxhQUFPQyxVQUFQLEdBQW9CRCxPQUFPQyxVQUFQLElBQXFCTCxLQUF6QztBQUNBSSxhQUFPRSxTQUFQLEdBQW1CRixPQUFPRSxTQUFQLElBQW9CTCxJQUF2QztBQUZ1QiwrSEFHakJHLE1BSGlCO0FBSXhCOztBQVplO0FBQUE7QUFBQSwyQkFjWDtBQUNILGVBQU8sS0FBS0csTUFBTCxDQUFZQyxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQWhCZTtBQUFBO0FBQUEsaUNBa0JMQyxJQWxCSyxFQWtCd0M7QUFBQSxZQUF2Q0MsS0FBdUMsdUVBQS9CLFNBQStCO0FBQUEsWUFBcEJDLFdBQW9CO0FBQUEsWUFBUEMsS0FBTzs7QUFDdEQsYUFBS0wsTUFBTCxDQUFZTSxTQUFaLENBQXNCSixJQUF0QixFQUE0QkMsS0FBNUIsRUFBbUNFLEtBQW5DO0FBQ0Q7QUFwQmU7QUFBQTtBQUFBLDhCQXNCUkUsYUF0QlEsRUFzQk87QUFDckIsYUFBS1AsTUFBTCxDQUFZUSxZQUFaLENBQXlCRCxhQUF6QjtBQUNEO0FBeEJlO0FBQUE7QUFBQSw2QkEwQlRFLFNBMUJTLEVBMEJFQyxNQTFCRixFQTBCVTtBQUN4QixhQUFLVixNQUFMLENBQVlXLE1BQVosQ0FBbUJGLFNBQW5CLEVBQThCQyxNQUE5QjtBQUNEO0FBNUJlO0FBQUE7QUFBQSw4QkE4QlI7QUFDTixhQUFLVixNQUFMLENBQVlZLEtBQVo7QUFDRDtBQWhDZTs7QUFBQTtBQUFBLElBT1lwQixTQVBaOztBQW1DbEJJLGtCQUFnQmlCLE1BQWhCLEdBQXlCLFVBQUNYLElBQUQ7QUFBQSxXQUFVLElBQUlOLGVBQUosQ0FBb0IsRUFBRWtCLFdBQVdaLElBQWIsRUFBcEIsQ0FBVjtBQUFBLEdBQXpCOztBQUVBLFNBQU9OLGVBQVA7QUFDRCxDQXRDRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvY2lyY2xlZ3JhcGgvY2lyY2xlZ3JhcGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJylcbiAgO1xuXG4gIGNsYXNzIENpcmNsZUhpc3RvZ3JhbSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgIGNvbmZpZy5tb2RlbENsYXNzID0gY29uZmlnLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBjb25maWcudmlld0NsYXNzID0gY29uZmlnLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuXG4gICAgaGFuZGxlRGF0YShkYXRhLCBsYXllciA9ICdkZWZhdWx0JywgbGlnaHRDb25maWcsIGNvbG9yKSB7XG4gICAgICB0aGlzLl9tb2RlbC5wYXJzZURhdGEoZGF0YSwgbGF5ZXIsIGNvbG9yKTtcbiAgICB9XG5cbiAgICBzZXRMaXZlKHNob3dMYXllckxpdmUpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldExheWVyTGl2ZShzaG93TGF5ZXJMaXZlKTtcbiAgICB9XG5cbiAgICB1cGRhdGUodGltZXN0YW1wLCBsaWdodHMpIHtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZSh0aW1lc3RhbXAsIGxpZ2h0cyk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLl9tb2RlbC5yZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIENpcmNsZUhpc3RvZ3JhbS5jcmVhdGUgPSAoZGF0YSkgPT4gbmV3IENpcmNsZUhpc3RvZ3JhbSh7IG1vZGVsRGF0YTogZGF0YSB9KTtcblxuICByZXR1cm4gQ2lyY2xlSGlzdG9ncmFtO1xufSlcbiJdfQ==
