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

  var referenceBall = THREE.SceneUtils.createMultiMaterialObject(new THREE.SphereGeometry(5, 12, 12), [new THREE.MeshLambertMaterial({ color: 0x990000 })]);

  return function (_DomView) {
    _inherits(EuglenaDisplayView, _DomView);

    function EuglenaDisplayView(model, tmpl) {
      _classCallCheck(this, EuglenaDisplayView);

      var _this = _possibleConstructorReturn(this, (EuglenaDisplayView.__proto__ || Object.getPrototypeOf(EuglenaDisplayView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange']);

      _this.scene = new THREE.Scene();

      // this.camera = new THREE.OrthographicCamera(-12, 12, 9, -9, 1, 1000);
      var aspect = model.get('bounds.width') / model.get('bounds.height');
      var fov = 2 * Math.atan2(model.get('bounds.height') / 2, model.get('camera.height')) * 180 / Math.PI;
      _this.camera = new THREE.PerspectiveCamera(fov, aspect, model.get('camera.near'), model.get('camera.far'));
      _this.camera.position.z = model.get('camera.height');
      _this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      _this.renderer = new THREE.WebGLRenderer({ alpha: true });
      _this.renderer.setClearColor(0xf6fdf6, 0.25);
      _this.renderer.setSize(500, 375);

      _this.lights = {
        top: new THREE.DirectionalLight(0xffffff, 0),
        left: new THREE.DirectionalLight(0xffffff, 0),
        right: new THREE.DirectionalLight(0xffffff, 0),
        bottom: new THREE.DirectionalLight(0xffffff, 0),
        global: new THREE.AmbientLight(0xffffff, 0.6)
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
      // this.scene.add(referenceBall);
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
          case 'magnification':
            this._adjustCamera(model);
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
      key: '_adjustCamera',
      value: function _adjustCamera(model) {
        var aspect = model.get('bounds.width') / model.get('bounds.height');
        var fov = 2 * Math.atan2(model.get('bounds.height') / (2 * model.get('magnification')), model.get('camera.height')) * 180 / Math.PI;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, model.get('camera.near'), model.get('camera.far'));
        this.camera.position.z = model.get('camera.height');
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
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

            euglena.update(state.time, {
              width: state.model.get('bounds.width') / state.model.get('magnification'),
              height: state.model.get('bounds.height') / state.model.get('magnification')
            });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVXRpbHMiLCJUSFJFRSIsIlRlbXBsYXRlIiwicmVmZXJlbmNlQmFsbCIsIlNjZW5lVXRpbHMiLCJjcmVhdGVNdWx0aU1hdGVyaWFsT2JqZWN0IiwiU3BoZXJlR2VvbWV0cnkiLCJNZXNoTGFtYmVydE1hdGVyaWFsIiwiY29sb3IiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsInNjZW5lIiwiU2NlbmUiLCJhc3BlY3QiLCJnZXQiLCJmb3YiLCJNYXRoIiwiYXRhbjIiLCJQSSIsImNhbWVyYSIsIlBlcnNwZWN0aXZlQ2FtZXJhIiwicG9zaXRpb24iLCJ6IiwibG9va0F0IiwiVmVjdG9yMyIsInJlbmRlcmVyIiwiV2ViR0xSZW5kZXJlciIsImFscGhhIiwic2V0Q2xlYXJDb2xvciIsInNldFNpemUiLCJsaWdodHMiLCJ0b3AiLCJEaXJlY3Rpb25hbExpZ2h0IiwibGVmdCIsInJpZ2h0IiwiYm90dG9tIiwiZ2xvYmFsIiwiQW1iaWVudExpZ2h0Iiwic2V0Iiwia2V5IiwiYWRkIiwiX2V1Z2xlbmEiLCIkZWwiLCJhcHBlbmQiLCJkb21FbGVtZW50IiwiX2Vuc3VyZUV1Z2xlbmEiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxDaGFuZ2UiLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YSIsInBhdGgiLCJfYWRqdXN0Q2FtZXJhIiwibGVuZ3RoIiwicmVtb3ZlIiwicG9wIiwiZXVnbGVuYSIsInZpZXciLCJwdXNoIiwic3RhdGUiLCJ1cGRhdGUiLCJ0aW1lIiwid2lkdGgiLCJoZWlnaHQiLCJpbnRlbnNpdHkiLCJyZW5kZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1B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QUFOLENBQVlNLEdBQVosQ0FBZ0IsY0FBaEIsSUFBa0M2QyxNQUFNbkQsS0FBTixDQUFZTSxHQUFaLENBQWdCLGVBQWhCLENBRGhCO0FBRXpCaUQsc0JBQVFKLE1BQU1uRCxLQUFOLENBQVlNLEdBQVosQ0FBZ0IsZUFBaEIsSUFBbUM2QyxNQUFNbkQsS0FBTixDQUFZTSxHQUFaLENBQWdCLGVBQWhCO0FBRmxCLGFBQTNCO0FBSUQ7QUFOVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU9aLGFBQUssSUFBSXlCLEdBQVQsSUFBZ0JvQixNQUFNN0IsTUFBdEIsRUFBOEI7QUFDNUIsZUFBS0EsTUFBTCxDQUFZUyxHQUFaLEVBQWlCeUIsU0FBakIsR0FBNkJMLE1BQU03QixNQUFOLENBQWFTLEdBQWIsSUFBb0IsQ0FBcEIsR0FBd0IsR0FBckQ7QUFDRDtBQUNELGFBQUtkLFFBQUwsQ0FBY3dDLE1BQWQsQ0FBcUIsS0FBS3RELEtBQTFCLEVBQWlDLEtBQUtRLE1BQXRDO0FBQ0Q7QUFwRkg7O0FBQUE7QUFBQSxJQUF3Q3JCLE9BQXhDO0FBc0ZELENBbkdEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIFRIUkVFID0gcmVxdWlyZSgndGhyZWUnKSxcblxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL2V1Z2xlbmFkaXNwbGF5Lmh0bWwnKVxuICA7XG5cbiAgbGV0IHJlZmVyZW5jZUJhbGwgPSBUSFJFRS5TY2VuZVV0aWxzLmNyZWF0ZU11bHRpTWF0ZXJpYWxPYmplY3QoXG4gICAgbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDUsIDEyLCAxMiksXG4gICAgW25ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IDB4OTkwMDAwIH0pXVxuICApO1xuXG4gIHJldHVybiBjbGFzcyBFdWdsZW5hRGlzcGxheVZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbk1vZGVsQ2hhbmdlJ10pO1xuXG4gICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgIC8vIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSgtMTIsIDEyLCA5LCAtOSwgMSwgMTAwMCk7XG4gICAgICBsZXQgYXNwZWN0ID0gbW9kZWwuZ2V0KCdib3VuZHMud2lkdGgnKSAvIG1vZGVsLmdldCgnYm91bmRzLmhlaWdodCcpO1xuICAgICAgbGV0IGZvdiA9IDIgKiBNYXRoLmF0YW4yKG1vZGVsLmdldCgnYm91bmRzLmhlaWdodCcpIC8gMiwgbW9kZWwuZ2V0KCdjYW1lcmEuaGVpZ2h0JykpICogMTgwIC8gTWF0aC5QSTtcbiAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKGZvdiwgYXNwZWN0LCBtb2RlbC5nZXQoJ2NhbWVyYS5uZWFyJyksIG1vZGVsLmdldCgnY2FtZXJhLmZhcicpKTtcbiAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSBtb2RlbC5nZXQoJ2NhbWVyYS5oZWlnaHQnKTtcbiAgICAgIHRoaXMuY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLDAsMCkpO1xuXG4gICAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoeyBhbHBoYTogdHJ1ZSB9KTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweGY2ZmRmNiwgMC4yNSk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUoNTAwLCAzNzUpO1xuXG4gICAgICB0aGlzLmxpZ2h0cyA9IHtcbiAgICAgICAgdG9wOiBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMCksXG4gICAgICAgIGxlZnQ6IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwKSxcbiAgICAgICAgcmlnaHQ6IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwKSxcbiAgICAgICAgYm90dG9tOiBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMCksXG4gICAgICAgIGdsb2JhbDogbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZiwgMC42KVxuICAgICAgfVxuXG4gICAgICB0aGlzLmxpZ2h0cy50b3AucG9zaXRpb24uc2V0KDAsIDEsIDApO1xuICAgICAgdGhpcy5saWdodHMubGVmdC5wb3NpdGlvbi5zZXQoLTEsIDAsIDApO1xuICAgICAgdGhpcy5saWdodHMucmlnaHQucG9zaXRpb24uc2V0KDEsIDAsIDApO1xuICAgICAgdGhpcy5saWdodHMuYm90dG9tLnBvc2l0aW9uLnNldCgwLCAtMSwgMCk7XG5cbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmxpZ2h0cykge1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmxpZ2h0c1trZXldKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fZXVnbGVuYSA9IFtdO1xuXG4gICAgICB0aGlzLiRlbC5hcHBlbmQodGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICAgIHRoaXMuX2Vuc3VyZUV1Z2xlbmEobW9kZWwpO1xuICAgICAgLy8gdGhpcy5zY2VuZS5hZGQocmVmZXJlbmNlQmFsbCk7XG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gZXZ0LmN1cnJlbnRUYXJnZXQ7XG4gICAgICBzd2l0Y2ggKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSAnZXVnbGVuYSc6XG4gICAgICAgICAgdGhpcy5fZW5zdXJlRXVnbGVuYShtb2RlbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtYWduaWZpY2F0aW9uJzpcbiAgICAgICAgICB0aGlzLl9hZGp1c3RDYW1lcmEobW9kZWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfZW5zdXJlRXVnbGVuYShtb2RlbCkge1xuICAgICAgd2hpbGUgKHRoaXMuX2V1Z2xlbmEubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuc2NlbmUucmVtb3ZlKHRoaXMuX2V1Z2xlbmEucG9wKCkpO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgZXVnbGVuYSBvZiBtb2RlbC5nZXQoJ2V1Z2xlbmEnKSkge1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChldWdsZW5hLnZpZXcoKSk7XG4gICAgICAgIHRoaXMuX2V1Z2xlbmEucHVzaChldWdsZW5hLnZpZXcoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2FkanVzdENhbWVyYShtb2RlbCkge1xuICAgICAgbGV0IGFzcGVjdCA9IG1vZGVsLmdldCgnYm91bmRzLndpZHRoJykgLyBtb2RlbC5nZXQoJ2JvdW5kcy5oZWlnaHQnKTtcbiAgICAgIGxldCBmb3YgPSAyICogTWF0aC5hdGFuMihtb2RlbC5nZXQoJ2JvdW5kcy5oZWlnaHQnKSAvICgyICogbW9kZWwuZ2V0KCdtYWduaWZpY2F0aW9uJykpLCBtb2RlbC5nZXQoJ2NhbWVyYS5oZWlnaHQnKSkgKiAxODAgLyBNYXRoLlBJO1xuICAgICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoZm92LCBhc3BlY3QsIG1vZGVsLmdldCgnY2FtZXJhLm5lYXInKSwgbW9kZWwuZ2V0KCdjYW1lcmEuZmFyJykpO1xuICAgICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IG1vZGVsLmdldCgnY2FtZXJhLmhlaWdodCcpO1xuICAgICAgdGhpcy5jYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsMCwwKSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKHN0YXRlKSB7XG4gICAgICBmb3IgKGxldCBldWdsZW5hIG9mIHN0YXRlLm1vZGVsLmdldCgnZXVnbGVuYScpKSB7XG4gICAgICAgIGV1Z2xlbmEudXBkYXRlKHN0YXRlLnRpbWUsIHtcbiAgICAgICAgICB3aWR0aDogc3RhdGUubW9kZWwuZ2V0KCdib3VuZHMud2lkdGgnKSAvIHN0YXRlLm1vZGVsLmdldCgnbWFnbmlmaWNhdGlvbicpLFxuICAgICAgICAgIGhlaWdodDogc3RhdGUubW9kZWwuZ2V0KCdib3VuZHMuaGVpZ2h0JykgLyBzdGF0ZS5tb2RlbC5nZXQoJ21hZ25pZmljYXRpb24nKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGtleSBpbiBzdGF0ZS5saWdodHMpIHtcbiAgICAgICAgdGhpcy5saWdodHNba2V5XS5pbnRlbnNpdHkgPSBzdGF0ZS5saWdodHNba2V5XSAqIDUgLyAxMDBcbiAgICAgIH1cbiAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
