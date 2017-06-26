'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    id: '',
    label: ''
  };

  return function (_Model) {
    _inherits(FormActionModel, _Model);

    function FormActionModel(config) {
      _classCallCheck(this, FormActionModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (FormActionModel.__proto__ || Object.getPrototypeOf(FormActionModel)).call(this, config));
    }

    return FormActionModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2FjdGlvbnMvYmFzZS9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsImRlZmF1bHRzIiwiaWQiLCJsYWJlbCIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxXQUFXO0FBQ1RDLFFBQUksRUFESztBQUVUQyxXQUFPO0FBRkUsR0FGYjs7QUFPQTtBQUFBOztBQUNFLDZCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCQSxhQUFPSCxRQUFQLEdBQWtCRCxNQUFNSyxjQUFOLENBQXFCRCxPQUFPSCxRQUE1QixFQUFzQ0EsUUFBdEMsQ0FBbEI7QUFEa0IsK0hBRVpHLE1BRlk7QUFHbkI7O0FBSkg7QUFBQSxJQUFxQ0wsS0FBckM7QUFNRCxDQWREIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2FjdGlvbnMvYmFzZS9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
