'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var FieldGroupView = require('core/component/fieldgroup/view'),
      Utils = require('core/util/utils'),
      Template = require('text!./experimentrow.html');
  require('link!./experimentrow.css');

  return function (_FieldGroupView) {
    _inherits(ExperimentRowView, _FieldGroupView);

    function ExperimentRowView(model, tmpl) {
      _classCallCheck(this, ExperimentRowView);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(ExperimentRowView).call(this, model, tmpl || Template));
    }

    return ExperimentRowView;
  }(FieldGroupView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9yb3cvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxpQkFBaUIsUUFBUSxnQ0FBUixDQUF2QjtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFdBQVcsUUFBUSwyQkFBUixDQUZiO0FBSUEsVUFBUSwwQkFBUjs7QUFFQTtBQUFBOztBQUNFLCtCQUFZLEtBQVosRUFBbUIsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxrR0FDakIsS0FEaUIsRUFDVixRQUFRLFFBREU7QUFFeEI7O0FBSEg7QUFBQSxJQUF1QyxjQUF2QztBQUtELENBWkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtL3Jvdy92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
