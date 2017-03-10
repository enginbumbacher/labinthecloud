'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// DomView
// =======
//
// Base class for HTML templated views.

define(function (require) {
  var View = require('./view'),
      $ = require('jquery');

  return function (_View) {
    _inherits(DomView, _View);

    // `new DomView(template)`
    //
    // Creates a new DomView with the provided template. The template is expected to
    // be one of two formats: either an HTML string, or a jQuery object.
    //
    // Typical class extension is as follows:
    //
    //     define (require) ->
    //       template = require 'text!templates/path/to/template.html'
    //
    //       class ThingView extends DomView
    //         constructor: () ->
    //           super template

    function DomView(tmpl) {
      _classCallCheck(this, DomView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DomView).call(this));

      _this.$el = typeof tmpl == "string" ? $($.parseHTML(tmpl)) : $(tmpl);
      return _this;
    }

    // Public API
    // ----------

    // `addChild(child, destination)`
    //
    // Defers to the parent class (ultimately, the Parent class) to handle general
    // child management, and appends the child dom to this view's dom, at the
    // destination if provided.

    _createClass(DomView, [{
      key: 'addChild',
      value: function addChild(child, destination) {
        _get(Object.getPrototypeOf(DomView.prototype), 'addChild', this).call(this, child);
        var target = destination ? this.$el.find(destination).first() : this.$el;
        target.append(child.$dom());
      }

      // `removeChild(child)`
      //
      // Defers to the parent class (ultimately, the Parent class) to handle general
      // child management, and removes the child dom from this view's dom.

    }, {
      key: 'removeChild',
      value: function removeChild(child) {
        _get(Object.getPrototypeOf(DomView.prototype), 'removeChild', this).call(this, child);
        if ($.contains(this.dom(), child.dom())) {

          // We use jQuery's detach method in order to retain any event listeners
          // the child may have set on its own dom.

          child.$dom().detach();
        }
      }

      // `$dom()`
      //
      // Returns the jQuery object wrapped around the view's dom. Replaced the previous,
      // confusing `view()` method (there was a lot of view.view()).

    }, {
      key: '$dom',
      value: function $dom() {
        return this.$el;
      }

      // `dom()`
      //
      // Returns the core DOM object of the view.

    }, {
      key: 'dom',
      value: function dom() {
        return this.$el[0];
      }

      // `show()`
      //
      // Reveals the dom element. Currently utilizes jQuery's own show() method.

    }, {
      key: 'show',
      value: function show() {
        this.$el.show();
      }

      // `hide()`
      //
      // Reveals the dom element. Currently utilizes jQuery's own hide() method.

    }, {
      key: 'hide',
      value: function hide() {
        this.$el.hide();
      }

      // `bounds()`
      //
      // Returns an object containing the bounds of the element, in the following form:

      //     {
      //       left: (float)
      //       top: (float)
      //       width: (float)
      //       height: (float)
      //     }

    }, {
      key: 'bounds',
      value: function bounds() {
        var bounds = this.$el.offset();
        bounds.width = this.$el.outerWidth();
        bounds.height = this.$el.outerHeight();
        return bounds;
      }
    }]);

    return DomView;
  }(View);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3ZpZXcvZG9tX3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sT0FBTyxRQUFRLFFBQVIsQ0FBYjtBQUFBLE1BQ0UsSUFBSSxRQUFRLFFBQVIsQ0FETjs7QUFHQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JFLHFCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFBQTs7QUFFaEIsWUFBSyxHQUFMLEdBQVksT0FBTyxJQUFQLElBQWUsUUFBZixHQUEwQixFQUFFLEVBQUUsU0FBRixDQUFZLElBQVosQ0FBRixDQUExQixHQUFpRCxFQUFFLElBQUYsQ0FBN0Q7QUFGZ0I7QUFHakI7Ozs7Ozs7Ozs7O0FBbkJIO0FBQUE7QUFBQSwrQkErQlcsS0EvQlgsRUErQmtCLFdBL0JsQixFQStCK0I7QUFDM0Isb0ZBQWUsS0FBZjtBQUNBLFlBQUksU0FBUyxjQUFjLEtBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxXQUFkLEVBQTJCLEtBQTNCLEVBQWQsR0FBbUQsS0FBSyxHQUFyRTtBQUNBLGVBQU8sTUFBUCxDQUFjLE1BQU0sSUFBTixFQUFkO0FBQ0Q7Ozs7Ozs7QUFuQ0g7QUFBQTtBQUFBLGtDQTJDYyxLQTNDZCxFQTJDcUI7QUFDakIsdUZBQWtCLEtBQWxCO0FBQ0EsWUFBSSxFQUFFLFFBQUYsQ0FBVyxLQUFLLEdBQUwsRUFBWCxFQUF1QixNQUFNLEdBQU4sRUFBdkIsQ0FBSixFQUF5Qzs7Ozs7QUFLdkMsZ0JBQU0sSUFBTixHQUFhLE1BQWI7QUFDRDtBQUNGOzs7Ozs7O0FBcERIO0FBQUE7QUFBQSw2QkEyRFM7QUFDTCxlQUFPLEtBQUssR0FBWjtBQUNEOzs7Ozs7QUE3REg7QUFBQTtBQUFBLDRCQW9FUTtBQUNKLGVBQU8sS0FBSyxHQUFMLENBQVMsQ0FBVCxDQUFQO0FBQ0Q7Ozs7OztBQXRFSDtBQUFBO0FBQUEsNkJBNEVTO0FBQ0wsYUFBSyxHQUFMLENBQVMsSUFBVDtBQUNEOzs7Ozs7QUE5RUg7QUFBQTtBQUFBLDZCQW9GUztBQUNMLGFBQUssR0FBTCxDQUFTLElBQVQ7QUFDRDs7Ozs7Ozs7Ozs7OztBQXRGSDtBQUFBO0FBQUEsK0JBa0dXO0FBQ1AsWUFBSSxTQUFTLEtBQUssR0FBTCxDQUFTLE1BQVQsRUFBYjtBQUNBLGVBQU8sS0FBUCxHQUFlLEtBQUssR0FBTCxDQUFTLFVBQVQsRUFBZjtBQUNBLGVBQU8sTUFBUCxHQUFnQixLQUFLLEdBQUwsQ0FBUyxXQUFULEVBQWhCO0FBQ0EsZUFBTyxNQUFQO0FBQ0Q7QUF2R0g7O0FBQUE7QUFBQSxJQUE2QixJQUE3QjtBQXlHRCxDQTdHRCIsImZpbGUiOiJtb2R1bGUvY29yZS92aWV3L2RvbV92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
