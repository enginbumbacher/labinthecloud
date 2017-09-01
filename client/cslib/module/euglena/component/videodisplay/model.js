'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    runTime: 0,
    video: null
  };

  return function (_Model) {
    _inherits(VideoDisplayModel, _Model);

    function VideoDisplayModel() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, VideoDisplayModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (VideoDisplayModel.__proto__ || Object.getPrototypeOf(VideoDisplayModel)).call(this, config));
    }

    return VideoDisplayModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIk1vZGVsIiwiVXRpbHMiLCJkZWZhdWx0cyIsInJ1blRpbWUiLCJ2aWRlbyIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUdFRyxXQUFXO0FBQ1RDLGFBQVMsQ0FEQTtBQUVUQyxXQUFPO0FBRkUsR0FIYjs7QUFRQTtBQUFBOztBQUNFLGlDQUF5QjtBQUFBLFVBQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFBQTs7QUFDdkJBLGFBQU9ILFFBQVAsR0FBa0JELE1BQU1LLGNBQU4sQ0FBcUJELE9BQU9ILFFBQTVCLEVBQXNDQSxRQUF0QyxDQUFsQjtBQUR1QixtSUFFakJHLE1BRmlCO0FBR3hCOztBQUpIO0FBQUEsSUFBdUNMLEtBQXZDO0FBTUQsQ0FmRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdmlkZW9kaXNwbGF5L21vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZGVsID0gcmVxdWlyZSgnY29yZS9tb2RlbC9tb2RlbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIHJ1blRpbWU6IDAsXG4gICAgICB2aWRlbzogbnVsbFxuICAgIH07XG5cbiAgcmV0dXJuIGNsYXNzIFZpZGVvRGlzcGxheU1vZGVsIGV4dGVuZHMgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG4gICAgICBjb25maWcuZGVmYXVsdHMgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhjb25maWcuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgfVxuICB9XG59KSJdfQ==
