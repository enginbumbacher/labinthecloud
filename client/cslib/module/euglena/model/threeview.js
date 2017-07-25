'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require) {
  var Utils = require('core/util/utils'),
      THREE = require('three');

  var defaults = {
    tubeRadius: 0.5,
    tubeLength: 3,

    baseColor: 0x2222ff
  };

  return function () {
    function EuglenaThreeView(config) {
      _classCallCheck(this, EuglenaThreeView);

      this.config = Utils.ensureDefaults(config, defaults);
      this._body = new THREE.Object3D();
      var tubeLength = this.config.tubeLength;
      var TubeCurve = THREE.Curve.create(function () {}, function (t) {
        return new THREE.Vector3(0, 0, t * tubeLength - tubeLength / 2);
      });

      this.tubeCurve = new TubeCurve();
      var tubeGeom = new THREE.TubeGeometry(this.tubeCurve, 10, this.config.tubeRadius, this.config.tubeSegments, false);
      var sphereGeom = new THREE.SphereGeometry(this.config.tubeRadius, this.config.tubeSegments, this.config.tubeSegments);
      var colmat = new THREE.MeshLambertMaterial({ color: this.config.baseColor });

      var tube = THREE.SceneUtils.createMultiMaterialObject(tubeGeom, [colmat]);
      var leftCap = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [colmat]);
      var rightCap = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [colmat]);

      leftCap.position.x = this.tubeCurve.getPoint(0).x;
      leftCap.position.y = this.tubeCurve.getPoint(0).y;
      leftCap.position.z = this.tubeCurve.getPoint(0).z;
      rightCap.position.x = this.tubeCurve.getPoint(1).x;
      rightCap.position.y = this.tubeCurve.getPoint(1).y;
      rightCap.position.z = this.tubeCurve.getPoint(1).z;

      this._body.add(tube, leftCap, rightCap);
    }

    _createClass(EuglenaThreeView, [{
      key: 'view',
      value: function view() {
        return this._body;
      }
    }]);

    return EuglenaThreeView;
  }();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RocmVldmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJUSFJFRSIsImRlZmF1bHRzIiwidHViZVJhZGl1cyIsInR1YmVMZW5ndGgiLCJiYXNlQ29sb3IiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsIl9ib2R5IiwiT2JqZWN0M0QiLCJUdWJlQ3VydmUiLCJDdXJ2ZSIsImNyZWF0ZSIsInQiLCJWZWN0b3IzIiwidHViZUN1cnZlIiwidHViZUdlb20iLCJUdWJlR2VvbWV0cnkiLCJ0dWJlU2VnbWVudHMiLCJzcGhlcmVHZW9tIiwiU3BoZXJlR2VvbWV0cnkiLCJjb2xtYXQiLCJNZXNoTGFtYmVydE1hdGVyaWFsIiwiY29sb3IiLCJ0dWJlIiwiU2NlbmVVdGlscyIsImNyZWF0ZU11bHRpTWF0ZXJpYWxPYmplY3QiLCJsZWZ0Q2FwIiwicmlnaHRDYXAiLCJwb3NpdGlvbiIsIngiLCJnZXRQb2ludCIsInkiLCJ6IiwiYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxPQUFSLENBRFY7O0FBR0EsTUFBTUcsV0FBVztBQUNiQyxnQkFBWSxHQURDO0FBRWJDLGdCQUFZLENBRkM7O0FBSWJDLGVBQVc7QUFKRSxHQUFqQjs7QUFRQTtBQUNFLDhCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLFdBQUtBLE1BQUwsR0FBY04sTUFBTU8sY0FBTixDQUFxQkQsTUFBckIsRUFBNkJKLFFBQTdCLENBQWQ7QUFDQSxXQUFLTSxLQUFMLEdBQWEsSUFBSVAsTUFBTVEsUUFBVixFQUFiO0FBQ0EsVUFBTUwsYUFBYSxLQUFLRSxNQUFMLENBQVlGLFVBQS9CO0FBQ0EsVUFBTU0sWUFBWVQsTUFBTVUsS0FBTixDQUFZQyxNQUFaLENBQW1CLFlBQVksQ0FBRSxDQUFqQyxFQUFtQyxVQUFVQyxDQUFWLEVBQWE7QUFDaEUsZUFBTyxJQUFJWixNQUFNYSxPQUFWLENBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCRCxJQUFJVCxVQUFKLEdBQWlCQSxhQUFhLENBQXRELENBQVA7QUFDRCxPQUZpQixDQUFsQjs7QUFJQSxXQUFLVyxTQUFMLEdBQWlCLElBQUlMLFNBQUosRUFBakI7QUFDQSxVQUFNTSxXQUFXLElBQUlmLE1BQU1nQixZQUFWLENBQXVCLEtBQUtGLFNBQTVCLEVBQXVDLEVBQXZDLEVBQTJDLEtBQUtULE1BQUwsQ0FBWUgsVUFBdkQsRUFBbUUsS0FBS0csTUFBTCxDQUFZWSxZQUEvRSxFQUE2RixLQUE3RixDQUFqQjtBQUNBLFVBQU1DLGFBQWEsSUFBSWxCLE1BQU1tQixjQUFWLENBQXlCLEtBQUtkLE1BQUwsQ0FBWUgsVUFBckMsRUFBaUQsS0FBS0csTUFBTCxDQUFZWSxZQUE3RCxFQUEyRSxLQUFLWixNQUFMLENBQVlZLFlBQXZGLENBQW5CO0FBQ0EsVUFBTUcsU0FBUyxJQUFJcEIsTUFBTXFCLG1CQUFWLENBQThCLEVBQUVDLE9BQU8sS0FBS2pCLE1BQUwsQ0FBWUQsU0FBckIsRUFBOUIsQ0FBZjs7QUFFQSxVQUFNbUIsT0FBT3ZCLE1BQU13QixVQUFOLENBQWlCQyx5QkFBakIsQ0FBMkNWLFFBQTNDLEVBQXFELENBQUNLLE1BQUQsQ0FBckQsQ0FBYjtBQUNBLFVBQU1NLFVBQVUxQixNQUFNd0IsVUFBTixDQUFpQkMseUJBQWpCLENBQTJDUCxVQUEzQyxFQUF1RCxDQUFDRSxNQUFELENBQXZELENBQWhCO0FBQ0EsVUFBTU8sV0FBVzNCLE1BQU13QixVQUFOLENBQWlCQyx5QkFBakIsQ0FBMkNQLFVBQTNDLEVBQXVELENBQUNFLE1BQUQsQ0FBdkQsQ0FBakI7O0FBRUFNLGNBQVFFLFFBQVIsQ0FBaUJDLENBQWpCLEdBQXFCLEtBQUtmLFNBQUwsQ0FBZWdCLFFBQWYsQ0FBd0IsQ0FBeEIsRUFBMkJELENBQWhEO0FBQ0FILGNBQVFFLFFBQVIsQ0FBaUJHLENBQWpCLEdBQXFCLEtBQUtqQixTQUFMLENBQWVnQixRQUFmLENBQXdCLENBQXhCLEVBQTJCQyxDQUFoRDtBQUNBTCxjQUFRRSxRQUFSLENBQWlCSSxDQUFqQixHQUFxQixLQUFLbEIsU0FBTCxDQUFlZ0IsUUFBZixDQUF3QixDQUF4QixFQUEyQkUsQ0FBaEQ7QUFDQUwsZUFBU0MsUUFBVCxDQUFrQkMsQ0FBbEIsR0FBc0IsS0FBS2YsU0FBTCxDQUFlZ0IsUUFBZixDQUF3QixDQUF4QixFQUEyQkQsQ0FBakQ7QUFDQUYsZUFBU0MsUUFBVCxDQUFrQkcsQ0FBbEIsR0FBc0IsS0FBS2pCLFNBQUwsQ0FBZWdCLFFBQWYsQ0FBd0IsQ0FBeEIsRUFBMkJDLENBQWpEO0FBQ0FKLGVBQVNDLFFBQVQsQ0FBa0JJLENBQWxCLEdBQXNCLEtBQUtsQixTQUFMLENBQWVnQixRQUFmLENBQXdCLENBQXhCLEVBQTJCRSxDQUFqRDs7QUFFQSxXQUFLekIsS0FBTCxDQUFXMEIsR0FBWCxDQUFlVixJQUFmLEVBQXFCRyxPQUFyQixFQUE4QkMsUUFBOUI7QUFDRDs7QUExQkg7QUFBQTtBQUFBLDZCQTRCUztBQUNMLGVBQU8sS0FBS3BCLEtBQVo7QUFDRDtBQTlCSDs7QUFBQTtBQUFBO0FBZ0NELENBNUNEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL3RocmVldmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
