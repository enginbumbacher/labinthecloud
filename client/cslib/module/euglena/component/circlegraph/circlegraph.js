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
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, CircleHistogram);

      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(CircleHistogram).call(this, config));
    }

    _createClass(CircleHistogram, [{
      key: 'handleData',
      value: function handleData(data) {
        this._model.parseData(data);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9jaXJjbGVncmFwaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFlBQVksUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0UsUUFBUSxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUUsT0FBTyxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0UsUUFBUSxRQUFRLGlCQUFSLENBSFY7O0FBRGtCLE1BT1osZUFQWTtBQUFBOztBQVFoQiwrQkFBeUI7QUFBQSxVQUFiLE1BQWEseURBQUosRUFBSTs7QUFBQTs7QUFDdkIsYUFBTyxVQUFQLEdBQW9CLE9BQU8sVUFBUCxJQUFxQixLQUF6QztBQUNBLGFBQU8sU0FBUCxHQUFtQixPQUFPLFNBQVAsSUFBb0IsSUFBdkM7QUFGdUIsZ0dBR2pCLE1BSGlCO0FBSXhCOztBQVplO0FBQUE7QUFBQSxpQ0FjTCxJQWRLLEVBY0M7QUFDZixhQUFLLE1BQUwsQ0FBWSxTQUFaLENBQXNCLElBQXRCO0FBQ0Q7QUFoQmU7QUFBQTtBQUFBLDZCQWtCVCxTQWxCUyxFQWtCRSxNQWxCRixFQWtCVTtBQUN4QixhQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLFNBQW5CLEVBQThCLE1BQTlCO0FBQ0Q7QUFwQmU7QUFBQTtBQUFBLDhCQXNCUjtBQUNOLGFBQUssTUFBTCxDQUFZLEtBQVo7QUFDRDtBQXhCZTs7QUFBQTtBQUFBLElBT1ksU0FQWjs7QUEyQmxCLGtCQUFnQixNQUFoQixHQUF5QixVQUFDLElBQUQ7QUFBQSxXQUFVLElBQUksZUFBSixDQUFvQixFQUFFLFdBQVcsSUFBYixFQUFwQixDQUFWO0FBQUEsR0FBekI7O0FBRUEsU0FBTyxlQUFQO0FBQ0QsQ0E5QkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
