'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Model = require('core/model/model'),
      defaults = {
    duration: 0,
    lights: {
      top: [],
      bottom: [],
      left: [],
      right: []
    }
  };

  return function (_Model) {
    _inherits(LightGridModel, _Model);

    function LightGridModel(conf) {
      _classCallCheck(this, LightGridModel);

      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      return _possibleConstructorReturn(this, (LightGridModel.__proto__ || Object.getPrototypeOf(LightGridModel)).call(this, conf));
    }

    _createClass(LightGridModel, [{
      key: 'update',
      value: function update(lights) {
        var parsed = {
          top: [],
          bottom: [],
          left: [],
          right: []
        };
        var duration = 0;
        lights.forEach(function (spec) {
          duration += spec.duration;
          for (var key in parsed) {
            parsed[key].push({ intensity: spec[key], duration: spec.duration });
          }
        });

        this.set('duration', duration);
        this.set('lights', parsed);
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.set('lights', {
          top: [],
          bottom: [],
          left: [],
          right: []
        });
      }
    }]);

    return LightGridModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9saWdodGdyaWQvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTW9kZWwiLCJkZWZhdWx0cyIsImR1cmF0aW9uIiwibGlnaHRzIiwidG9wIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0IiwiY29uZiIsImVuc3VyZURlZmF1bHRzIiwicGFyc2VkIiwiZm9yRWFjaCIsInNwZWMiLCJrZXkiLCJwdXNoIiwiaW50ZW5zaXR5Iiwic2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxRQUFRSixRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFSyxXQUFXO0FBQ1RDLGNBQVUsQ0FERDtBQUVUQyxZQUFRO0FBQ05DLFdBQUssRUFEQztBQUVOQyxjQUFRLEVBRkY7QUFHTkMsWUFBTSxFQUhBO0FBSU5DLGFBQU87QUFKRDtBQUZDLEdBRGI7O0FBV0E7QUFBQTs7QUFDRSw0QkFBWUMsSUFBWixFQUFrQjtBQUFBOztBQUNoQkEsV0FBS1AsUUFBTCxHQUFnQkosTUFBTVksY0FBTixDQUFxQkQsS0FBS1AsUUFBMUIsRUFBb0NBLFFBQXBDLENBQWhCO0FBRGdCLDZIQUVWTyxJQUZVO0FBR2pCOztBQUpIO0FBQUE7QUFBQSw2QkFNU0wsTUFOVCxFQU1pQjtBQUNiLFlBQU1PLFNBQVM7QUFDYk4sZUFBSyxFQURRO0FBRWJDLGtCQUFRLEVBRks7QUFHYkMsZ0JBQU0sRUFITztBQUliQyxpQkFBTztBQUpNLFNBQWY7QUFNQSxZQUFJTCxXQUFXLENBQWY7QUFDQUMsZUFBT1EsT0FBUCxDQUFlLFVBQUNDLElBQUQsRUFBVTtBQUN2QlYsc0JBQVlVLEtBQUtWLFFBQWpCO0FBQ0EsZUFBSyxJQUFJVyxHQUFULElBQWdCSCxNQUFoQixFQUF3QjtBQUN0QkEsbUJBQU9HLEdBQVAsRUFBWUMsSUFBWixDQUFpQixFQUFFQyxXQUFXSCxLQUFLQyxHQUFMLENBQWIsRUFBd0JYLFVBQVVVLEtBQUtWLFFBQXZDLEVBQWpCO0FBQ0Q7QUFDRixTQUxEOztBQU9BLGFBQUtjLEdBQUwsQ0FBUyxVQUFULEVBQXFCZCxRQUFyQjtBQUNBLGFBQUtjLEdBQUwsQ0FBUyxRQUFULEVBQW1CTixNQUFuQjtBQUNEO0FBdkJIO0FBQUE7QUFBQSw4QkF5QlU7QUFDTixhQUFLTSxHQUFMLENBQVMsUUFBVCxFQUFtQjtBQUNqQlosZUFBSyxFQURZO0FBRWpCQyxrQkFBUSxFQUZTO0FBR2pCQyxnQkFBTSxFQUhXO0FBSWpCQyxpQkFBTztBQUpVLFNBQW5CO0FBTUQ7QUFoQ0g7O0FBQUE7QUFBQSxJQUFvQ1AsS0FBcEM7QUFrQ0QsQ0FsREQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL2dyYXBoL2xpZ2h0Z3JpZC9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJylcbiAgXG4gIGNvbnN0IE1vZGVsID0gcmVxdWlyZSgnY29yZS9tb2RlbC9tb2RlbCcpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgZHVyYXRpb246IDAsXG4gICAgICBsaWdodHM6IHtcbiAgICAgICAgdG9wOiBbXSxcbiAgICAgICAgYm90dG9tOiBbXSxcbiAgICAgICAgbGVmdDogW10sXG4gICAgICAgIHJpZ2h0OiBbXVxuICAgICAgfVxuICAgIH1cblxuICByZXR1cm4gY2xhc3MgTGlnaHRHcmlkTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZikge1xuICAgICAgY29uZi5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmYuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKGNvbmYpO1xuICAgIH1cblxuICAgIHVwZGF0ZShsaWdodHMpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHtcbiAgICAgICAgdG9wOiBbXSxcbiAgICAgICAgYm90dG9tOiBbXSxcbiAgICAgICAgbGVmdDogW10sXG4gICAgICAgIHJpZ2h0OiBbXVxuICAgICAgfVxuICAgICAgbGV0IGR1cmF0aW9uID0gMDtcbiAgICAgIGxpZ2h0cy5mb3JFYWNoKChzcGVjKSA9PiB7XG4gICAgICAgIGR1cmF0aW9uICs9IHNwZWMuZHVyYXRpb247XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBwYXJzZWQpIHtcbiAgICAgICAgICBwYXJzZWRba2V5XS5wdXNoKHsgaW50ZW5zaXR5OiBzcGVjW2tleV0sIGR1cmF0aW9uOiBzcGVjLmR1cmF0aW9uIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuc2V0KCdkdXJhdGlvbicsIGR1cmF0aW9uKTtcbiAgICAgIHRoaXMuc2V0KCdsaWdodHMnLCBwYXJzZWQpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5zZXQoJ2xpZ2h0cycsIHtcbiAgICAgICAgdG9wOiBbXSxcbiAgICAgICAgYm90dG9tOiBbXSxcbiAgICAgICAgbGVmdDogW10sXG4gICAgICAgIHJpZ2h0OiBbXVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn0pIl19
