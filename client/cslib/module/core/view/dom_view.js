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

      var _this = _possibleConstructorReturn(this, (DomView.__proto__ || Object.getPrototypeOf(DomView)).call(this));

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
      value: function addChild(child) {
        var destination = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

        _get(DomView.prototype.__proto__ || Object.getPrototypeOf(DomView.prototype), 'addChild', this).call(this, child);
        var target = destination ? this.$el.find(destination).first() : this.$el;
        if (index == -1 || target.children().length <= index) {
          target.append(child.$dom());
        } else {
          child.$dom().insertBefore(target.children()[index]);
        }
      }

      // `removeChild(child)`
      //
      // Defers to the parent class (ultimately, the Parent class) to handle general
      // child management, and removes the child dom from this view's dom.

    }, {
      key: 'removeChild',
      value: function removeChild(child) {
        _get(DomView.prototype.__proto__ || Object.getPrototypeOf(DomView.prototype), 'removeChild', this).call(this, child);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3ZpZXcvZG9tX3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlZpZXciLCIkIiwidG1wbCIsIiRlbCIsInBhcnNlSFRNTCIsImNoaWxkIiwiZGVzdGluYXRpb24iLCJpbmRleCIsInRhcmdldCIsImZpbmQiLCJmaXJzdCIsImNoaWxkcmVuIiwibGVuZ3RoIiwiYXBwZW5kIiwiJGRvbSIsImluc2VydEJlZm9yZSIsImNvbnRhaW5zIiwiZG9tIiwiZGV0YWNoIiwic2hvdyIsImhpZGUiLCJib3VuZHMiLCJvZmZzZXQiLCJ3aWR0aCIsIm91dGVyV2lkdGgiLCJoZWlnaHQiLCJvdXRlckhlaWdodCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLE9BQU9ELFFBQVEsUUFBUixDQUFiO0FBQUEsTUFDRUUsSUFBSUYsUUFBUSxRQUFSLENBRE47O0FBR0E7QUFBQTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFSSxxQkFBWUcsSUFBWixFQUFrQjtBQUFBOztBQUFBOztBQUVoQixZQUFLQyxHQUFMLEdBQVksT0FBT0QsSUFBUCxJQUFlLFFBQWYsR0FBMEJELEVBQUVBLEVBQUVHLFNBQUYsQ0FBWUYsSUFBWixDQUFGLENBQTFCLEdBQWlERCxFQUFFQyxJQUFGLENBQTdEO0FBRmdCO0FBR2pCOztBQUdMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUE3QkU7QUFBQTtBQUFBLCtCQStCV0csS0EvQlgsRUErQmtEO0FBQUEsWUFBaENDLFdBQWdDLHVFQUFsQixJQUFrQjtBQUFBLFlBQVpDLEtBQVksdUVBQUosQ0FBQyxDQUFHOztBQUM5QyxtSEFBZUYsS0FBZjtBQUNBLFlBQUlHLFNBQVNGLGNBQWMsS0FBS0gsR0FBTCxDQUFTTSxJQUFULENBQWNILFdBQWQsRUFBMkJJLEtBQTNCLEVBQWQsR0FBbUQsS0FBS1AsR0FBckU7QUFDQSxZQUFJSSxTQUFTLENBQUMsQ0FBVixJQUFlQyxPQUFPRyxRQUFQLEdBQWtCQyxNQUFsQixJQUE0QkwsS0FBL0MsRUFBc0Q7QUFDcERDLGlCQUFPSyxNQUFQLENBQWNSLE1BQU1TLElBQU4sRUFBZDtBQUNELFNBRkQsTUFFTztBQUNMVCxnQkFBTVMsSUFBTixHQUFhQyxZQUFiLENBQTBCUCxPQUFPRyxRQUFQLEdBQWtCSixLQUFsQixDQUExQjtBQUNEO0FBQ0Y7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7O0FBN0NFO0FBQUE7QUFBQSxrQ0ErQ2NGLEtBL0NkLEVBK0NxQjtBQUNqQixzSEFBa0JBLEtBQWxCO0FBQ0EsWUFBSUosRUFBRWUsUUFBRixDQUFXLEtBQUtDLEdBQUwsRUFBWCxFQUF1QlosTUFBTVksR0FBTixFQUF2QixDQUFKLEVBQXlDOztBQUUvQztBQUNBOztBQUVRWixnQkFBTVMsSUFBTixHQUFhSSxNQUFiO0FBQ0Q7QUFDRjs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUE3REU7QUFBQTtBQUFBLDZCQStEUztBQUNMLGVBQU8sS0FBS2YsR0FBWjtBQUNEOztBQUdMO0FBQ0E7QUFDQTs7QUF0RUU7QUFBQTtBQUFBLDRCQXdFUTtBQUNKLGVBQU8sS0FBS0EsR0FBTCxDQUFTLENBQVQsQ0FBUDtBQUNEOztBQUVMO0FBQ0E7QUFDQTs7QUE5RUU7QUFBQTtBQUFBLDZCQWdGUztBQUNMLGFBQUtBLEdBQUwsQ0FBU2dCLElBQVQ7QUFDRDs7QUFFTDtBQUNBO0FBQ0E7O0FBdEZFO0FBQUE7QUFBQSw2QkF3RlM7QUFDTCxhQUFLaEIsR0FBTCxDQUFTaUIsSUFBVDtBQUNEOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBckdFO0FBQUE7QUFBQSwrQkFzR1c7QUFDUCxZQUFJQyxTQUFTLEtBQUtsQixHQUFMLENBQVNtQixNQUFULEVBQWI7QUFDQUQsZUFBT0UsS0FBUCxHQUFlLEtBQUtwQixHQUFMLENBQVNxQixVQUFULEVBQWY7QUFDQUgsZUFBT0ksTUFBUCxHQUFnQixLQUFLdEIsR0FBTCxDQUFTdUIsV0FBVCxFQUFoQjtBQUNBLGVBQU9MLE1BQVA7QUFDRDtBQTNHSDs7QUFBQTtBQUFBLElBQTZCckIsSUFBN0I7QUE2R0QsQ0FqSEQiLCJmaWxlIjoibW9kdWxlL2NvcmUvdmlldy9kb21fdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
