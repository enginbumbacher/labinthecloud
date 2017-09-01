'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Parent
// ======

// A generic container class. Parents maintain an array of children, and they
// bubble any events that their children fire.

define(function (require) {
  var EventDispatcher = require('core/event/dispatcher');

  return function (_EventDispatcher) {
    _inherits(Parent, _EventDispatcher);

    function Parent() {
      _classCallCheck(this, Parent);

      var _this = _possibleConstructorReturn(this, (Parent.__proto__ || Object.getPrototypeOf(Parent)).call(this));

      _this._children = [];
      return _this;
    }

    // Public API
    // ----------

    // `addChild(child)`

    // Adds the provided child to the parent's list of children. If the child belonged
    // to a different parent, that relationship is dropped in favor of the new one.

    _createClass(Parent, [{
      key: 'addChild',
      value: function addChild(child) {
        if (!this._children.includes(child)) {
          if (child.parent) child.parent.removeChild(child);
          child.parent = this;
          child.addEventListener('*', this.bubbleEvent.bind(this));
          this._children.push(child);
          this.dispatchEvent('Parent.ChildAdded', { child: child }, true);
        }
        return this;
      }

      // `removeChild(child)`

      // Removes the specified child from teh parent's list of children. This also drops
      // the event bubbler.

    }, {
      key: 'removeChild',
      value: function removeChild(child) {
        if (this._children.includes(child)) {
          child.parent = null;
          child.removeEventListener('*', this.bubbleEvent.bind(this));
          this._children.splice(this._children.indexOf(child), 1);
          this.dispatchEvent('Parent.ChildRemoved', { child: child }, true);
        }
        return this;
      }

      // Events
      // ------

      // `Parent.ChildAdded`

      // Fires whenever a child is added. Data payload contains the `child` in question.

      // `Parent.ChildRemoved`

      // Fires whenever a child is removed. Data payload contains the `child` in
      // question.

    }]);

    return Parent;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3V0aWwvcGFyZW50LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJFdmVudERpc3BhdGNoZXIiLCJfY2hpbGRyZW4iLCJjaGlsZCIsImluY2x1ZGVzIiwicGFyZW50IiwicmVtb3ZlQ2hpbGQiLCJhZGRFdmVudExpc3RlbmVyIiwiYnViYmxlRXZlbnQiLCJiaW5kIiwicHVzaCIsImRpc3BhdGNoRXZlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic3BsaWNlIiwiaW5kZXhPZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsa0JBQWtCRCxRQUFRLHVCQUFSLENBQXhCOztBQUVBO0FBQUE7O0FBQ0Usc0JBQWM7QUFBQTs7QUFBQTs7QUFFWixZQUFLRSxTQUFMLEdBQWlCLEVBQWpCO0FBRlk7QUFHYjs7QUFHTDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBYkU7QUFBQTtBQUFBLCtCQWVXQyxLQWZYLEVBZWtCO0FBQ2QsWUFBSSxDQUFDLEtBQUtELFNBQUwsQ0FBZUUsUUFBZixDQUF3QkQsS0FBeEIsQ0FBTCxFQUFxQztBQUNuQyxjQUFJQSxNQUFNRSxNQUFWLEVBQWtCRixNQUFNRSxNQUFOLENBQWFDLFdBQWIsQ0FBeUJILEtBQXpCO0FBQ2xCQSxnQkFBTUUsTUFBTixHQUFlLElBQWY7QUFDQUYsZ0JBQU1JLGdCQUFOLENBQXVCLEdBQXZCLEVBQTRCLEtBQUtDLFdBQUwsQ0FBaUJDLElBQWpCLENBQXNCLElBQXRCLENBQTVCO0FBQ0EsZUFBS1AsU0FBTCxDQUFlUSxJQUFmLENBQW9CUCxLQUFwQjtBQUNBLGVBQUtRLGFBQUwsQ0FBbUIsbUJBQW5CLEVBQXdDLEVBQUVSLE9BQU9BLEtBQVQsRUFBeEMsRUFBMEQsSUFBMUQ7QUFDRDtBQUNELGVBQU8sSUFBUDtBQUNEOztBQUdMOztBQUVBO0FBQ0E7O0FBOUJFO0FBQUE7QUFBQSxrQ0FnQ2NBLEtBaENkLEVBZ0NxQjtBQUNqQixZQUFJLEtBQUtELFNBQUwsQ0FBZUUsUUFBZixDQUF3QkQsS0FBeEIsQ0FBSixFQUFvQztBQUNsQ0EsZ0JBQU1FLE1BQU4sR0FBZSxJQUFmO0FBQ0FGLGdCQUFNUyxtQkFBTixDQUEwQixHQUExQixFQUErQixLQUFLSixXQUFMLENBQWlCQyxJQUFqQixDQUFzQixJQUF0QixDQUEvQjtBQUNBLGVBQUtQLFNBQUwsQ0FBZVcsTUFBZixDQUFzQixLQUFLWCxTQUFMLENBQWVZLE9BQWYsQ0FBdUJYLEtBQXZCLENBQXRCLEVBQXFELENBQXJEO0FBQ0EsZUFBS1EsYUFBTCxDQUFtQixxQkFBbkIsRUFBMEMsRUFBRVIsT0FBT0EsS0FBVCxFQUExQyxFQUE0RCxJQUE1RDtBQUNEO0FBQ0QsZUFBTyxJQUFQO0FBQ0Q7O0FBR0w7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQXJERTs7QUFBQTtBQUFBLElBQTRCRixlQUE1QjtBQXVERCxDQTFERCIsImZpbGUiOiJtb2R1bGUvY29yZS91dGlsL3BhcmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFBhcmVudFxuLy8gPT09PT09XG5cbi8vIEEgZ2VuZXJpYyBjb250YWluZXIgY2xhc3MuIFBhcmVudHMgbWFpbnRhaW4gYW4gYXJyYXkgb2YgY2hpbGRyZW4sIGFuZCB0aGV5XG4vLyBidWJibGUgYW55IGV2ZW50cyB0aGF0IHRoZWlyIGNoaWxkcmVuIGZpcmUuXG5cbmRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdjb3JlL2V2ZW50L2Rpc3BhdGNoZXInKTtcblxuICByZXR1cm4gY2xhc3MgUGFyZW50IGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKClcbiAgICAgIHRoaXMuX2NoaWxkcmVuID0gW11cbiAgICB9XG5cbiAgICBcbi8vIFB1YmxpYyBBUElcbi8vIC0tLS0tLS0tLS1cblxuLy8gYGFkZENoaWxkKGNoaWxkKWBcblxuLy8gQWRkcyB0aGUgcHJvdmlkZWQgY2hpbGQgdG8gdGhlIHBhcmVudCdzIGxpc3Qgb2YgY2hpbGRyZW4uIElmIHRoZSBjaGlsZCBiZWxvbmdlZFxuLy8gdG8gYSBkaWZmZXJlbnQgcGFyZW50LCB0aGF0IHJlbGF0aW9uc2hpcCBpcyBkcm9wcGVkIGluIGZhdm9yIG9mIHRoZSBuZXcgb25lLlxuICAgIFxuICAgIGFkZENoaWxkKGNoaWxkKSB7XG4gICAgICBpZiAoIXRoaXMuX2NoaWxkcmVuLmluY2x1ZGVzKGNoaWxkKSkge1xuICAgICAgICBpZiAoY2hpbGQucGFyZW50KSBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICBjaGlsZC5hZGRFdmVudExpc3RlbmVyKCcqJywgdGhpcy5idWJibGVFdmVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnUGFyZW50LkNoaWxkQWRkZWQnLCB7IGNoaWxkOiBjaGlsZCB9LCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIFxuLy8gYHJlbW92ZUNoaWxkKGNoaWxkKWBcblxuLy8gUmVtb3ZlcyB0aGUgc3BlY2lmaWVkIGNoaWxkIGZyb20gdGVoIHBhcmVudCdzIGxpc3Qgb2YgY2hpbGRyZW4uIFRoaXMgYWxzbyBkcm9wc1xuLy8gdGhlIGV2ZW50IGJ1YmJsZXIuXG4gICAgXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGQpIHtcbiAgICAgIGlmICh0aGlzLl9jaGlsZHJlbi5pbmNsdWRlcyhjaGlsZCkpIHtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcbiAgICAgICAgY2hpbGQucmVtb3ZlRXZlbnRMaXN0ZW5lcignKicsIHRoaXMuYnViYmxlRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX2NoaWxkcmVuLnNwbGljZSh0aGlzLl9jaGlsZHJlbi5pbmRleE9mKGNoaWxkKSwgMSk7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnUGFyZW50LkNoaWxkUmVtb3ZlZCcsIHsgY2hpbGQ6IGNoaWxkIH0sIHRydWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgXG4vLyBFdmVudHNcbi8vIC0tLS0tLVxuXG4vLyBgUGFyZW50LkNoaWxkQWRkZWRgXG5cbi8vIEZpcmVzIHdoZW5ldmVyIGEgY2hpbGQgaXMgYWRkZWQuIERhdGEgcGF5bG9hZCBjb250YWlucyB0aGUgYGNoaWxkYCBpbiBxdWVzdGlvbi5cblxuLy8gYFBhcmVudC5DaGlsZFJlbW92ZWRgXG5cbi8vIEZpcmVzIHdoZW5ldmVyIGEgY2hpbGQgaXMgcmVtb3ZlZC4gRGF0YSBwYXlsb2FkIGNvbnRhaW5zIHRoZSBgY2hpbGRgIGluXG4vLyBxdWVzdGlvbi5cbiAgfTtcbn0pOyJdfQ==
