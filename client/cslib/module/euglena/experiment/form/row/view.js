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

      return _possibleConstructorReturn(this, (ExperimentRowView.__proto__ || Object.getPrototypeOf(ExperimentRowView)).call(this, model, tmpl || Template));
    }

    return ExperimentRowView;
  }(FieldGroupView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9yb3cvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRmllbGRHcm91cFZpZXciLCJVdGlscyIsIlRlbXBsYXRlIiwibW9kZWwiLCJ0bXBsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxpQkFBaUJELFFBQVEsZ0NBQVIsQ0FBdkI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxXQUFXSCxRQUFRLDJCQUFSLENBRmI7QUFJQUEsVUFBUSwwQkFBUjs7QUFFQTtBQUFBOztBQUNFLCtCQUFZSSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLG1JQUNqQkQsS0FEaUIsRUFDVkMsUUFBUUYsUUFERTtBQUV4Qjs7QUFISDtBQUFBLElBQXVDRixjQUF2QztBQUtELENBWkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtL3Jvdy92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEZpZWxkR3JvdXBWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZmllbGRncm91cC92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9leHBlcmltZW50cm93Lmh0bWwnKVxuICA7XG4gIHJlcXVpcmUoJ2xpbmshLi9leHBlcmltZW50cm93LmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBFeHBlcmltZW50Um93VmlldyBleHRlbmRzIEZpZWxkR3JvdXBWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIobW9kZWwsIHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgIH1cbiAgfVxufSkiXX0=
