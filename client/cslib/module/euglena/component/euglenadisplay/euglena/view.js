'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var EventDispatcher = require('core/event/dispatcher'),
      Utils = require('core/util/utils'),
      THREE = require('three'),
      HM = require('core/event/hook_manager');

  return function (_EventDispatcher) {
    _inherits(EuglenaView, _EventDispatcher);

    function EuglenaView(model) {
      _classCallCheck(this, EuglenaView);

      var _this = _possibleConstructorReturn(this, (EuglenaView.__proto__ || Object.getPrototypeOf(EuglenaView)).call(this));

      _this._three = HM.invoke('Euglena.3dView', null, { config: model.get('config'), color: model.get("color") });
      return _this;
    }

    _createClass(EuglenaView, [{
      key: 'threeObject',
      value: function threeObject() {
        return this._three;
      }
    }, {
      key: 'update',
      value: function update(state) {
        this._three.position.set(state.position.x, state.position.y, state.position.z);

        var prev_Euler = new THREE.Euler(state.roll, state.pitch, state.yaw, 'XYZ');
        this._three.setRotationFromEuler(prev_Euler);
      }
    }]);

    return EuglenaView;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9ldWdsZW5hL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkV2ZW50RGlzcGF0Y2hlciIsIlV0aWxzIiwiVEhSRUUiLCJITSIsIm1vZGVsIiwiX3RocmVlIiwiaW52b2tlIiwiY29uZmlnIiwiZ2V0IiwiY29sb3IiLCJzdGF0ZSIsInBvc2l0aW9uIiwic2V0IiwieCIsInkiLCJ6IiwicHJldl9FdWxlciIsIkV1bGVyIiwicm9sbCIsInBpdGNoIiwieWF3Iiwic2V0Um90YXRpb25Gcm9tRXVsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsa0JBQWtCRCxRQUFRLHVCQUFSLENBQXhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxPQUFSLENBRlY7QUFBQSxNQUdFSSxLQUFLSixRQUFRLHlCQUFSLENBSFA7O0FBS0E7QUFBQTs7QUFDRSx5QkFBWUssS0FBWixFQUFtQjtBQUFBOztBQUFBOztBQUVqQixZQUFLQyxNQUFMLEdBQWNGLEdBQUdHLE1BQUgsQ0FBVSxnQkFBVixFQUE0QixJQUE1QixFQUFrQyxFQUFFQyxRQUFRSCxNQUFNSSxHQUFOLENBQVUsUUFBVixDQUFWLEVBQStCQyxPQUFPTCxNQUFNSSxHQUFOLENBQVUsT0FBVixDQUF0QyxFQUFsQyxDQUFkO0FBRmlCO0FBR2xCOztBQUpIO0FBQUE7QUFBQSxvQ0FNZ0I7QUFDWixlQUFPLEtBQUtILE1BQVo7QUFDRDtBQVJIO0FBQUE7QUFBQSw2QkFVU0ssS0FWVCxFQVVnQjtBQUNaLGFBQUtMLE1BQUwsQ0FBWU0sUUFBWixDQUFxQkMsR0FBckIsQ0FBeUJGLE1BQU1DLFFBQU4sQ0FBZUUsQ0FBeEMsRUFBMkNILE1BQU1DLFFBQU4sQ0FBZUcsQ0FBMUQsRUFBNkRKLE1BQU1DLFFBQU4sQ0FBZUksQ0FBNUU7O0FBRUEsWUFBSUMsYUFBYSxJQUFJZCxNQUFNZSxLQUFWLENBQWdCUCxNQUFNUSxJQUF0QixFQUEyQlIsTUFBTVMsS0FBakMsRUFBdUNULE1BQU1VLEdBQTdDLEVBQWlELEtBQWpELENBQWpCO0FBQ0EsYUFBS2YsTUFBTCxDQUFZZ0Isb0JBQVosQ0FBaUNMLFVBQWpDO0FBQ0Q7QUFmSDs7QUFBQTtBQUFBLElBQWlDaEIsZUFBakM7QUFpQkQsQ0F2QkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2V1Z2xlbmFkaXNwbGF5L2V1Z2xlbmEvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdjb3JlL2V2ZW50L2Rpc3BhdGNoZXInKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIFRIUkVFID0gcmVxdWlyZSgndGhyZWUnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgcmV0dXJuIGNsYXNzIEV1Z2xlbmFWaWV3IGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMuX3RocmVlID0gSE0uaW52b2tlKCdFdWdsZW5hLjNkVmlldycsIG51bGwsIHsgY29uZmlnOiBtb2RlbC5nZXQoJ2NvbmZpZycpLCBjb2xvcjogbW9kZWwuZ2V0KFwiY29sb3JcIikgfSlcbiAgICB9XG5cbiAgICB0aHJlZU9iamVjdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl90aHJlZTtcbiAgICB9XG5cbiAgICB1cGRhdGUoc3RhdGUpIHtcbiAgICAgIHRoaXMuX3RocmVlLnBvc2l0aW9uLnNldChzdGF0ZS5wb3NpdGlvbi54LCBzdGF0ZS5wb3NpdGlvbi55LCBzdGF0ZS5wb3NpdGlvbi56KTtcblxuICAgICAgbGV0IHByZXZfRXVsZXIgPSBuZXcgVEhSRUUuRXVsZXIoc3RhdGUucm9sbCxzdGF0ZS5waXRjaCxzdGF0ZS55YXcsJ1hZWicpO1xuICAgICAgdGhpcy5fdGhyZWUuc2V0Um90YXRpb25Gcm9tRXVsZXIocHJldl9FdWxlcik7XG4gICAgfVxuICB9XG59KVxuIl19
