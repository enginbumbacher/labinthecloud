'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      THREE = require('three'),
      Template = require('text!./euglenadisplay.html');

  return function (_DomView) {
    _inherits(EuglenaDisplayView, _DomView);

    function EuglenaDisplayView(model, tmpl) {
      _classCallCheck(this, EuglenaDisplayView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EuglenaDisplayView).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange']);

      _this.scene = new THREE.Scene();

      // this.camera = new THREE.OrthographicCamera(-12, 12, 9, -9, 1, 1000);
      var aspect = model.get('bounds.width') / model.get('bounds.height');
      var fov = 2 * Math.atan2(model.get('bounds.height') / 2, model.get('camera.height')) * 180 / Math.PI;
      _this.camera = new THREE.PerspectiveCamera(fov, aspect, model.get('camera.near'), model.get('camera.far'));
      _this.camera.position.z = model.get('camera.height');

      _this.renderer = new THREE.WebGLRenderer({ alpha: true });
      _this.renderer.setClearColor(0x99cc99, 0.25);
      _this.renderer.setSize(400, 300);

      _this.lights = {
        top: new THREE.DirectionalLight(0xffffff, 0),
        left: new THREE.DirectionalLight(0xffffff, 0),
        right: new THREE.DirectionalLight(0xffffff, 0),
        bottom: new THREE.DirectionalLight(0xffffff, 0),
        global: new THREE.AmbientLight(0xffffff, 0)
      };

      _this.lights.top.position.set(0, 1, 0);
      _this.lights.left.position.set(-1, 0, 0);
      _this.lights.right.position.set(1, 0, 0);
      _this.lights.bottom.position.set(0, -1, 0);

      for (var key in _this.lights) {
        _this.scene.add(_this.lights[key]);
      }

      _this._euglena = [];

      _this.$el.append(_this.renderer.domElement);
      _this._ensureEuglena(model);
      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(EuglenaDisplayView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        var model = evt.currentTarget;
        switch (evt.data.path) {
          case 'euglena':
            this._ensureEuglena(model);
            break;
        }
      }
    }, {
      key: '_ensureEuglena',
      value: function _ensureEuglena(model) {
        while (this._euglena.length) {
          this.scene.remove(this._euglena.pop());
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = model.get('euglena')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var euglena = _step.value;

            this.scene.add(euglena.view());
            this._euglena.push(euglena.view());
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: 'render',
      value: function render(state) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = state.model.get('euglena')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var euglena = _step2.value;

            euglena.update(state.lights, state.dT, state.model);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        for (var key in state.lights) {
          this.lights[key].intensity = state.lights[key] * 5 / 100;
        }
        this.renderer.render(this.scene, this.camera);
      }
    }]);

    return EuglenaDisplayView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sVUFBVSxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRSxRQUFRLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUUsUUFBUSxRQUFRLE9BQVIsQ0FGVjtBQUFBLE1BSUUsV0FBVyxRQUFRLDRCQUFSLENBSmI7O0FBT0E7QUFBQTs7QUFDRSxnQ0FBWSxLQUFaLEVBQW1CLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsd0dBQ2pCLFFBQVEsUUFEUzs7QUFFdkIsWUFBTSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsQ0FBeEI7O0FBRUEsWUFBSyxLQUFMLEdBQWEsSUFBSSxNQUFNLEtBQVYsRUFBYjs7O0FBR0EsVUFBSSxTQUFTLE1BQU0sR0FBTixDQUFVLGNBQVYsSUFBNEIsTUFBTSxHQUFOLENBQVUsZUFBVixDQUF6QztBQUNBLFVBQUksTUFBTSxJQUFJLEtBQUssS0FBTCxDQUFXLE1BQU0sR0FBTixDQUFVLGVBQVYsSUFBNkIsQ0FBeEMsRUFBMkMsTUFBTSxHQUFOLENBQVUsZUFBVixDQUEzQyxDQUFKLEdBQTZFLEdBQTdFLEdBQW1GLEtBQUssRUFBbEc7QUFDQSxZQUFLLE1BQUwsR0FBYyxJQUFJLE1BQU0saUJBQVYsQ0FBNEIsR0FBNUIsRUFBaUMsTUFBakMsRUFBeUMsTUFBTSxHQUFOLENBQVUsYUFBVixDQUF6QyxFQUFtRSxNQUFNLEdBQU4sQ0FBVSxZQUFWLENBQW5FLENBQWQ7QUFDQSxZQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLENBQXJCLEdBQXlCLE1BQU0sR0FBTixDQUFVLGVBQVYsQ0FBekI7O0FBRUEsWUFBSyxRQUFMLEdBQWdCLElBQUksTUFBTSxhQUFWLENBQXdCLEVBQUUsT0FBTyxJQUFULEVBQXhCLENBQWhCO0FBQ0EsWUFBSyxRQUFMLENBQWMsYUFBZCxDQUE0QixRQUE1QixFQUFzQyxJQUF0QztBQUNBLFlBQUssUUFBTCxDQUFjLE9BQWQsQ0FBc0IsR0FBdEIsRUFBMkIsR0FBM0I7O0FBRUEsWUFBSyxNQUFMLEdBQWM7QUFDWixhQUFLLElBQUksTUFBTSxnQkFBVixDQUEyQixRQUEzQixFQUFxQyxDQUFyQyxDQURPO0FBRVosY0FBTSxJQUFJLE1BQU0sZ0JBQVYsQ0FBMkIsUUFBM0IsRUFBcUMsQ0FBckMsQ0FGTTtBQUdaLGVBQU8sSUFBSSxNQUFNLGdCQUFWLENBQTJCLFFBQTNCLEVBQXFDLENBQXJDLENBSEs7QUFJWixnQkFBUSxJQUFJLE1BQU0sZ0JBQVYsQ0FBMkIsUUFBM0IsRUFBcUMsQ0FBckMsQ0FKSTtBQUtaLGdCQUFRLElBQUksTUFBTSxZQUFWLENBQXVCLFFBQXZCLEVBQWlDLENBQWpDO0FBTEksT0FBZDs7QUFRQSxZQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFFBQWhCLENBQXlCLEdBQXpCLENBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DO0FBQ0EsWUFBSyxNQUFMLENBQVksSUFBWixDQUFpQixRQUFqQixDQUEwQixHQUExQixDQUE4QixDQUFDLENBQS9CLEVBQWtDLENBQWxDLEVBQXFDLENBQXJDO0FBQ0EsWUFBSyxNQUFMLENBQVksS0FBWixDQUFrQixRQUFsQixDQUEyQixHQUEzQixDQUErQixDQUEvQixFQUFrQyxDQUFsQyxFQUFxQyxDQUFyQztBQUNBLFlBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsUUFBbkIsQ0FBNEIsR0FBNUIsQ0FBZ0MsQ0FBaEMsRUFBbUMsQ0FBQyxDQUFwQyxFQUF1QyxDQUF2Qzs7QUFFQSxXQUFLLElBQUksR0FBVCxJQUFnQixNQUFLLE1BQXJCLEVBQTZCO0FBQzNCLGNBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxNQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWY7QUFDRDs7QUFFRCxZQUFLLFFBQUwsR0FBZ0IsRUFBaEI7O0FBRUEsWUFBSyxHQUFMLENBQVMsTUFBVCxDQUFnQixNQUFLLFFBQUwsQ0FBYyxVQUE5QjtBQUNBLFlBQUssY0FBTCxDQUFvQixLQUFwQjtBQUNBLFlBQU0sZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBSyxjQUE1QztBQXJDdUI7QUFzQ3hCOztBQXZDSDtBQUFBO0FBQUEscUNBeUNpQixHQXpDakIsRUF5Q3NCO0FBQ2xCLFlBQU0sUUFBUSxJQUFJLGFBQWxCO0FBQ0EsZ0JBQVEsSUFBSSxJQUFKLENBQVMsSUFBakI7QUFDRSxlQUFLLFNBQUw7QUFDRSxpQkFBSyxjQUFMLENBQW9CLEtBQXBCO0FBQ0Y7QUFIRjtBQUtEO0FBaERIO0FBQUE7QUFBQSxxQ0FrRGlCLEtBbERqQixFQWtEd0I7QUFDcEIsZUFBTyxLQUFLLFFBQUwsQ0FBYyxNQUFyQixFQUE2QjtBQUMzQixlQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEtBQUssUUFBTCxDQUFjLEdBQWQsRUFBbEI7QUFDRDtBQUhtQjtBQUFBO0FBQUE7O0FBQUE7QUFJcEIsK0JBQW9CLE1BQU0sR0FBTixDQUFVLFNBQVYsQ0FBcEIsOEhBQTBDO0FBQUEsZ0JBQWpDLE9BQWlDOztBQUN4QyxpQkFBSyxLQUFMLENBQVcsR0FBWCxDQUFlLFFBQVEsSUFBUixFQUFmO0FBQ0EsaUJBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsUUFBUSxJQUFSLEVBQW5CO0FBQ0Q7QUFQbUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFyQjtBQTFESDtBQUFBO0FBQUEsNkJBNERTLEtBNURULEVBNERnQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNaLGdDQUFvQixNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCLFNBQWhCLENBQXBCLG1JQUFnRDtBQUFBLGdCQUF2QyxPQUF1Qzs7QUFDOUMsb0JBQVEsTUFBUixDQUFlLE1BQU0sTUFBckIsRUFBNkIsTUFBTSxFQUFuQyxFQUF1QyxNQUFNLEtBQTdDO0FBQ0Q7QUFIVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUlaLGFBQUssSUFBSSxHQUFULElBQWdCLE1BQU0sTUFBdEIsRUFBOEI7QUFDNUIsZUFBSyxNQUFMLENBQVksR0FBWixFQUFpQixTQUFqQixHQUE2QixNQUFNLE1BQU4sQ0FBYSxHQUFiLElBQW9CLENBQXBCLEdBQXdCLEdBQXJEO0FBQ0Q7QUFDRCxhQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLEtBQUssS0FBMUIsRUFBaUMsS0FBSyxNQUF0QztBQUNEO0FBcEVIOztBQUFBO0FBQUEsSUFBd0MsT0FBeEM7QUFzRUQsQ0E5RUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2V1Z2xlbmFkaXNwbGF5L3ZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
