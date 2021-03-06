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
    datasets: {},
    open: false
  },
      Palette = require('core/util/palette');

  return function (_Model) {
    _inherits(ModelingDataModel, _Model);

    function ModelingDataModel(config) {
      _classCallCheck(this, ModelingDataModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (ModelingDataModel.__proto__ || Object.getPrototypeOf(ModelingDataModel)).call(this, config));
    }

    _createClass(ModelingDataModel, [{
      key: 'toggle',
      value: function toggle() {
        this.set('open', !this.get('open'));
        return Promise.resolve(true);
      }
    }, {
      key: 'getDisplayState',
      value: function getDisplayState() {
        var state = {};
        return state;
      }
    }]);

    return ModelingDataModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJNb2RlbCIsImRlZmF1bHRzIiwiZGF0YXNldHMiLCJvcGVuIiwiUGFsZXR0ZSIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwic2V0IiwiZ2V0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJzdGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksUUFBUUosUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRUssV0FBVztBQUNUQyxjQUFVLEVBREQ7QUFFVEMsVUFBTTtBQUZHLEdBRGI7QUFBQSxNQUtFQyxVQUFVUixRQUFRLG1CQUFSLENBTFo7O0FBT0E7QUFBQTs7QUFDRSwrQkFBWVMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT0osUUFBUCxHQUFrQkosTUFBTVMsY0FBTixDQUFxQkQsT0FBT0osUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCO0FBRGtCLG1JQUVaSSxNQUZZO0FBR25COztBQUpIO0FBQUE7QUFBQSwrQkFNVztBQUNQLGFBQUtFLEdBQUwsQ0FBUyxNQUFULEVBQWlCLENBQUMsS0FBS0MsR0FBTCxDQUFTLE1BQVQsQ0FBbEI7QUFDQSxlQUFPQyxRQUFRQyxPQUFSLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQVRIO0FBQUE7QUFBQSx3Q0FXb0I7QUFDaEIsWUFBTUMsUUFBUSxFQUFkO0FBQ0EsZUFBT0EsS0FBUDtBQUNEO0FBZEg7O0FBQUE7QUFBQSxJQUF1Q1gsS0FBdkM7QUFnQkQsQ0E1QkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ibG9ja2x5dGFiL21vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIGRhdGFzZXRzOiB7fSxcbiAgICAgIG9wZW46IGZhbHNlXG4gICAgfSxcbiAgICBQYWxldHRlID0gcmVxdWlyZSgnY29yZS91dGlsL3BhbGV0dGUnKVxuXG4gIHJldHVybiBjbGFzcyBNb2RlbGluZ0RhdGFNb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgIGNvbmZpZy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICB0aGlzLnNldCgnb3BlbicsICF0aGlzLmdldCgnb3BlbicpKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgIH1cblxuICAgIGdldERpc3BsYXlTdGF0ZSgpIHtcbiAgICAgIGNvbnN0IHN0YXRlID0ge307XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuICB9XG59KVxuIl19
