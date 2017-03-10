'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      defaults = {
    K: 0.001,
    K_delta: 0.0002,
    v: 20,
    v_delta: 4,
    omega: 1,
    omega_delta: 0.2,
    randomness: 0
  };

  return function (_Model) {
    _inherits(ComponentManagerModel, _Model);

    function ComponentManagerModel(conf) {
      _classCallCheck(this, ComponentManagerModel);

      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      return _possibleConstructorReturn(this, Object.getPrototypeOf(ComponentManagerModel).call(this, conf));
    }

    return ComponentManagerModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V1Z2xlbmFjb250cm9sbGVyL2NvbXBvbmVudC9tb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxRQUFRLFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFVBQVUsUUFBUSxvQkFBUixDQUZaO0FBQUEsTUFJRSxXQUFXO0FBQ1QsT0FBRyxLQURNO0FBRVQsYUFBUyxNQUZBO0FBR1QsT0FBRyxFQUhNO0FBSVQsYUFBUyxDQUpBO0FBS1QsV0FBTyxDQUxFO0FBTVQsaUJBQWEsR0FOSjtBQU9ULGdCQUFZO0FBUEgsR0FKYjs7QUFlQTtBQUFBOztBQUNFLG1DQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsV0FBSyxRQUFMLEdBQWdCLE1BQU0sY0FBTixDQUFxQixLQUFLLFFBQTFCLEVBQW9DLFFBQXBDLENBQWhCO0FBRGdCLHNHQUVWLElBRlU7QUFHakI7O0FBSkg7QUFBQSxJQUEyQyxLQUEzQztBQU1ELENBdEJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V1Z2xlbmFjb250cm9sbGVyL2NvbXBvbmVudC9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
