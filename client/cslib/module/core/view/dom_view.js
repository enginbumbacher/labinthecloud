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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3ZpZXcvZG9tX3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlZpZXciLCIkIiwidG1wbCIsIiRlbCIsInBhcnNlSFRNTCIsImNoaWxkIiwiZGVzdGluYXRpb24iLCJpbmRleCIsInRhcmdldCIsImZpbmQiLCJmaXJzdCIsImNoaWxkcmVuIiwibGVuZ3RoIiwiYXBwZW5kIiwiJGRvbSIsImluc2VydEJlZm9yZSIsImNvbnRhaW5zIiwiZG9tIiwiZGV0YWNoIiwic2hvdyIsImhpZGUiLCJib3VuZHMiLCJvZmZzZXQiLCJ3aWR0aCIsIm91dGVyV2lkdGgiLCJoZWlnaHQiLCJvdXRlckhlaWdodCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLE9BQU9ELFFBQVEsUUFBUixDQUFiO0FBQUEsTUFDRUUsSUFBSUYsUUFBUSxRQUFSLENBRE47O0FBR0E7QUFBQTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFSSxxQkFBWUcsSUFBWixFQUFrQjtBQUFBOztBQUFBOztBQUVoQixZQUFLQyxHQUFMLEdBQVksT0FBT0QsSUFBUCxJQUFlLFFBQWYsR0FBMEJELEVBQUVBLEVBQUVHLFNBQUYsQ0FBWUYsSUFBWixDQUFGLENBQTFCLEdBQWlERCxFQUFFQyxJQUFGLENBQTdEO0FBRmdCO0FBR2pCOztBQUdMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUE3QkU7QUFBQTtBQUFBLCtCQStCV0csS0EvQlgsRUErQmtEO0FBQUEsWUFBaENDLFdBQWdDLHVFQUFsQixJQUFrQjtBQUFBLFlBQVpDLEtBQVksdUVBQUosQ0FBQyxDQUFHOztBQUM5QyxtSEFBZUYsS0FBZjtBQUNBLFlBQUlHLFNBQVNGLGNBQWMsS0FBS0gsR0FBTCxDQUFTTSxJQUFULENBQWNILFdBQWQsRUFBMkJJLEtBQTNCLEVBQWQsR0FBbUQsS0FBS1AsR0FBckU7QUFDQSxZQUFJSSxTQUFTLENBQUMsQ0FBVixJQUFlQyxPQUFPRyxRQUFQLEdBQWtCQyxNQUFsQixJQUE0QkwsS0FBL0MsRUFBc0Q7QUFDcERDLGlCQUFPSyxNQUFQLENBQWNSLE1BQU1TLElBQU4sRUFBZDtBQUNELFNBRkQsTUFFTztBQUNMVCxnQkFBTVMsSUFBTixHQUFhQyxZQUFiLENBQTBCUCxPQUFPRyxRQUFQLEdBQWtCSixLQUFsQixDQUExQjtBQUNEO0FBQ0Y7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7O0FBN0NFO0FBQUE7QUFBQSxrQ0ErQ2NGLEtBL0NkLEVBK0NxQjtBQUNqQixzSEFBa0JBLEtBQWxCO0FBQ0EsWUFBSUosRUFBRWUsUUFBRixDQUFXLEtBQUtDLEdBQUwsRUFBWCxFQUF1QlosTUFBTVksR0FBTixFQUF2QixDQUFKLEVBQXlDOztBQUUvQztBQUNBOztBQUVRWixnQkFBTVMsSUFBTixHQUFhSSxNQUFiO0FBQ0Q7QUFDRjs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUE3REU7QUFBQTtBQUFBLDZCQStEUztBQUNMLGVBQU8sS0FBS2YsR0FBWjtBQUNEOztBQUdMO0FBQ0E7QUFDQTs7QUF0RUU7QUFBQTtBQUFBLDRCQXdFUTtBQUNKLGVBQU8sS0FBS0EsR0FBTCxDQUFTLENBQVQsQ0FBUDtBQUNEOztBQUVMO0FBQ0E7QUFDQTs7QUE5RUU7QUFBQTtBQUFBLDZCQWdGUztBQUNMLGFBQUtBLEdBQUwsQ0FBU2dCLElBQVQ7QUFDRDs7QUFFTDtBQUNBO0FBQ0E7O0FBdEZFO0FBQUE7QUFBQSw2QkF3RlM7QUFDTCxhQUFLaEIsR0FBTCxDQUFTaUIsSUFBVDtBQUNEOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBckdFO0FBQUE7QUFBQSwrQkFzR1c7QUFDUCxZQUFJQyxTQUFTLEtBQUtsQixHQUFMLENBQVNtQixNQUFULEVBQWI7QUFDQUQsZUFBT0UsS0FBUCxHQUFlLEtBQUtwQixHQUFMLENBQVNxQixVQUFULEVBQWY7QUFDQUgsZUFBT0ksTUFBUCxHQUFnQixLQUFLdEIsR0FBTCxDQUFTdUIsV0FBVCxFQUFoQjtBQUNBLGVBQU9MLE1BQVA7QUFDRDtBQTNHSDs7QUFBQTtBQUFBLElBQTZCckIsSUFBN0I7QUE2R0QsQ0FqSEQiLCJmaWxlIjoibW9kdWxlL2NvcmUvdmlldy9kb21fdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIERvbVZpZXdcbi8vID09PT09PT1cbi8vXG4vLyBCYXNlIGNsYXNzIGZvciBIVE1MIHRlbXBsYXRlZCB2aWV3cy5cblxuZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgcmV0dXJuIGNsYXNzIERvbVZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgICBcbi8vIGBuZXcgRG9tVmlldyh0ZW1wbGF0ZSlgXG4vL1xuLy8gQ3JlYXRlcyBhIG5ldyBEb21WaWV3IHdpdGggdGhlIHByb3ZpZGVkIHRlbXBsYXRlLiBUaGUgdGVtcGxhdGUgaXMgZXhwZWN0ZWQgdG9cbi8vIGJlIG9uZSBvZiB0d28gZm9ybWF0czogZWl0aGVyIGFuIEhUTUwgc3RyaW5nLCBvciBhIGpRdWVyeSBvYmplY3QuXG4vL1xuLy8gVHlwaWNhbCBjbGFzcyBleHRlbnNpb24gaXMgYXMgZm9sbG93czpcbi8vXG4vLyAgICAgZGVmaW5lIChyZXF1aXJlKSAtPlxuLy8gICAgICAgdGVtcGxhdGUgPSByZXF1aXJlICd0ZXh0IXRlbXBsYXRlcy9wYXRoL3RvL3RlbXBsYXRlLmh0bWwnXG4vLyBcbi8vICAgICAgIGNsYXNzIFRoaW5nVmlldyBleHRlbmRzIERvbVZpZXdcbi8vICAgICAgICAgY29uc3RydWN0b3I6ICgpIC0+XG4vLyAgICAgICAgICAgc3VwZXIgdGVtcGxhdGVcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcih0bXBsKSB7XG4gICAgICBzdXBlcigpXG4gICAgICB0aGlzLiRlbCA9ICh0eXBlb2YgdG1wbCA9PSBcInN0cmluZ1wiID8gJCgkLnBhcnNlSFRNTCh0bXBsKSkgOiAkKHRtcGwpKTtcbiAgICB9XG4gICAgXG4gICAgXG4vLyBQdWJsaWMgQVBJXG4vLyAtLS0tLS0tLS0tXG5cbi8vIGBhZGRDaGlsZChjaGlsZCwgZGVzdGluYXRpb24pYFxuLy9cbi8vIERlZmVycyB0byB0aGUgcGFyZW50IGNsYXNzICh1bHRpbWF0ZWx5LCB0aGUgUGFyZW50IGNsYXNzKSB0byBoYW5kbGUgZ2VuZXJhbFxuLy8gY2hpbGQgbWFuYWdlbWVudCwgYW5kIGFwcGVuZHMgdGhlIGNoaWxkIGRvbSB0byB0aGlzIHZpZXcncyBkb20sIGF0IHRoZVxuLy8gZGVzdGluYXRpb24gaWYgcHJvdmlkZWQuXG4gICAgXG4gICAgYWRkQ2hpbGQoY2hpbGQsIGRlc3RpbmF0aW9uID0gbnVsbCwgaW5kZXggPSAtMSkge1xuICAgICAgc3VwZXIuYWRkQ2hpbGQoY2hpbGQpO1xuICAgICAgbGV0IHRhcmdldCA9IGRlc3RpbmF0aW9uID8gdGhpcy4kZWwuZmluZChkZXN0aW5hdGlvbikuZmlyc3QoKSA6IHRoaXMuJGVsO1xuICAgICAgaWYgKGluZGV4ID09IC0xIHx8IHRhcmdldC5jaGlsZHJlbigpLmxlbmd0aCA8PSBpbmRleCkge1xuICAgICAgICB0YXJnZXQuYXBwZW5kKGNoaWxkLiRkb20oKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZC4kZG9tKCkuaW5zZXJ0QmVmb3JlKHRhcmdldC5jaGlsZHJlbigpW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgXG4vLyBgcmVtb3ZlQ2hpbGQoY2hpbGQpYFxuLy9cbi8vIERlZmVycyB0byB0aGUgcGFyZW50IGNsYXNzICh1bHRpbWF0ZWx5LCB0aGUgUGFyZW50IGNsYXNzKSB0byBoYW5kbGUgZ2VuZXJhbFxuLy8gY2hpbGQgbWFuYWdlbWVudCwgYW5kIHJlbW92ZXMgdGhlIGNoaWxkIGRvbSBmcm9tIHRoaXMgdmlldydzIGRvbS5cbiAgICBcbiAgICByZW1vdmVDaGlsZChjaGlsZCkge1xuICAgICAgc3VwZXIucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgaWYgKCQuY29udGFpbnModGhpcy5kb20oKSwgY2hpbGQuZG9tKCkpKSB7XG4gICAgICAgIFxuLy8gV2UgdXNlIGpRdWVyeSdzIGRldGFjaCBtZXRob2QgaW4gb3JkZXIgdG8gcmV0YWluIGFueSBldmVudCBsaXN0ZW5lcnMgXG4vLyB0aGUgY2hpbGQgbWF5IGhhdmUgc2V0IG9uIGl0cyBvd24gZG9tLlxuICAgICAgICBcbiAgICAgICAgY2hpbGQuJGRvbSgpLmRldGFjaCgpXG4gICAgICB9XG4gICAgfVxuICAgIFxuLy8gYCRkb20oKWBcbi8vXG4vLyBSZXR1cm5zIHRoZSBqUXVlcnkgb2JqZWN0IHdyYXBwZWQgYXJvdW5kIHRoZSB2aWV3J3MgZG9tLiBSZXBsYWNlZCB0aGUgcHJldmlvdXMsXG4vLyBjb25mdXNpbmcgYHZpZXcoKWAgbWV0aG9kICh0aGVyZSB3YXMgYSBsb3Qgb2Ygdmlldy52aWV3KCkpLlxuICAgIFxuICAgICRkb20oKSB7XG4gICAgICByZXR1cm4gdGhpcy4kZWw7XG4gICAgfVxuXG4gICAgXG4vLyBgZG9tKClgXG4vL1xuLy8gUmV0dXJucyB0aGUgY29yZSBET00gb2JqZWN0IG9mIHRoZSB2aWV3LlxuICAgIFxuICAgIGRvbSgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRlbFswXTtcbiAgICB9XG5cbi8vIGBzaG93KClgXG4vL1xuLy8gUmV2ZWFscyB0aGUgZG9tIGVsZW1lbnQuIEN1cnJlbnRseSB1dGlsaXplcyBqUXVlcnkncyBvd24gc2hvdygpIG1ldGhvZC5cblxuICAgIHNob3coKSB7XG4gICAgICB0aGlzLiRlbC5zaG93KCk7XG4gICAgfVxuXG4vLyBgaGlkZSgpYFxuLy9cbi8vIFJldmVhbHMgdGhlIGRvbSBlbGVtZW50LiBDdXJyZW50bHkgdXRpbGl6ZXMgalF1ZXJ5J3Mgb3duIGhpZGUoKSBtZXRob2QuXG5cbiAgICBoaWRlKCkge1xuICAgICAgdGhpcy4kZWwuaGlkZSgpO1xuICAgIH1cblxuLy8gYGJvdW5kcygpYFxuLy9cbi8vIFJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGJvdW5kcyBvZiB0aGUgZWxlbWVudCwgaW4gdGhlIGZvbGxvd2luZyBmb3JtOlxuXG4vLyAgICAge1xuLy8gICAgICAgbGVmdDogKGZsb2F0KVxuLy8gICAgICAgdG9wOiAoZmxvYXQpXG4vLyAgICAgICB3aWR0aDogKGZsb2F0KVxuLy8gICAgICAgaGVpZ2h0OiAoZmxvYXQpXG4vLyAgICAgfVxuICAgIGJvdW5kcygpIHtcbiAgICAgIGxldCBib3VuZHMgPSB0aGlzLiRlbC5vZmZzZXQoKTtcbiAgICAgIGJvdW5kcy53aWR0aCA9IHRoaXMuJGVsLm91dGVyV2lkdGgoKTtcbiAgICAgIGJvdW5kcy5oZWlnaHQgPSB0aGlzLiRlbC5vdXRlckhlaWdodCgpO1xuICAgICAgcmV0dXJuIGJvdW5kcztcbiAgICB9XG4gIH07XG59KTsiXX0=
