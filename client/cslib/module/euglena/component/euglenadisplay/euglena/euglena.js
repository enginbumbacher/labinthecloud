'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Controller = require('core/controller/controller'),
      Utils = require('core/util/utils'),
      View = require('./view'),
      Model = require('./model');

  var Euglena = function (_Controller) {
    _inherits(Euglena, _Controller);

    function Euglena() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Euglena);

      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      return _possibleConstructorReturn(this, (Euglena.__proto__ || Object.getPrototypeOf(Euglena)).call(this, settings));
    }

    _createClass(Euglena, [{
      key: 'view',
      value: function view() {
        return this._view.threeObject();
      }
    }, {
      key: 'setInitialPosition',
      value: function setInitialPosition(pos) {
        this._model.setInitialPosition(pos);
      }
    }, {
      key: 'update',
      value: function update(time, bounds) {
        this._view.update(this._model.getState(time, bounds));
      }
    }]);

    return Euglena;
  }(Controller);

  Euglena.create = function (data) {
    return new Euglena({ modelData: data });
  };

  return Euglena;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9ldWdsZW5hL2V1Z2xlbmEuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbnRyb2xsZXIiLCJVdGlscyIsIlZpZXciLCJNb2RlbCIsIkV1Z2xlbmEiLCJzZXR0aW5ncyIsInZpZXdDbGFzcyIsIm1vZGVsQ2xhc3MiLCJfdmlldyIsInRocmVlT2JqZWN0IiwicG9zIiwiX21vZGVsIiwic2V0SW5pdGlhbFBvc2l0aW9uIiwidGltZSIsImJvdW5kcyIsInVwZGF0ZSIsImdldFN0YXRlIiwiY3JlYXRlIiwiZGF0YSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxhQUFhRCxRQUFRLDRCQUFSLENBQW5CO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxRQUFRSixRQUFRLFNBQVIsQ0FIVjs7QUFEa0IsTUFPWkssT0FQWTtBQUFBOztBQVFoQix1QkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxTQUFULEdBQXFCRCxTQUFTQyxTQUFULElBQXNCSixJQUEzQztBQUNBRyxlQUFTRSxVQUFULEdBQXNCRixTQUFTRSxVQUFULElBQXVCSixLQUE3QztBQUZ5QiwrR0FHbkJFLFFBSG1CO0FBSTFCOztBQVplO0FBQUE7QUFBQSw2QkFjVDtBQUNMLGVBQU8sS0FBS0csS0FBTCxDQUFXQyxXQUFYLEVBQVA7QUFDRDtBQWhCZTtBQUFBO0FBQUEseUNBa0JHQyxHQWxCSCxFQWtCUTtBQUN0QixhQUFLQyxNQUFMLENBQVlDLGtCQUFaLENBQStCRixHQUEvQjtBQUNEO0FBcEJlO0FBQUE7QUFBQSw2QkFzQlRHLElBdEJTLEVBc0JIQyxNQXRCRyxFQXNCSztBQUNuQixhQUFLTixLQUFMLENBQVdPLE1BQVgsQ0FBa0IsS0FBS0osTUFBTCxDQUFZSyxRQUFaLENBQXFCSCxJQUFyQixFQUEyQkMsTUFBM0IsQ0FBbEI7QUFDRDtBQXhCZTs7QUFBQTtBQUFBLElBT0lkLFVBUEo7O0FBMkJsQkksVUFBUWEsTUFBUixHQUFpQixVQUFDQyxJQUFELEVBQVU7QUFDekIsV0FBTyxJQUFJZCxPQUFKLENBQVksRUFBRWUsV0FBV0QsSUFBYixFQUFaLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9kLE9BQVA7QUFDRCxDQWhDRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvZXVnbGVuYWRpc3BsYXkvZXVnbGVuYS9ldWdsZW5hLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
