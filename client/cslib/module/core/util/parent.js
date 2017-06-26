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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3V0aWwvcGFyZW50LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJFdmVudERpc3BhdGNoZXIiLCJfY2hpbGRyZW4iLCJjaGlsZCIsImluY2x1ZGVzIiwicGFyZW50IiwicmVtb3ZlQ2hpbGQiLCJhZGRFdmVudExpc3RlbmVyIiwiYnViYmxlRXZlbnQiLCJiaW5kIiwicHVzaCIsImRpc3BhdGNoRXZlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic3BsaWNlIiwiaW5kZXhPZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsa0JBQWtCRCxRQUFRLHVCQUFSLENBQXhCOztBQUVBO0FBQUE7O0FBQ0Usc0JBQWM7QUFBQTs7QUFBQTs7QUFFWixZQUFLRSxTQUFMLEdBQWlCLEVBQWpCO0FBRlk7QUFHYjs7QUFHTDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBYkU7QUFBQTtBQUFBLCtCQWVXQyxLQWZYLEVBZWtCO0FBQ2QsWUFBSSxDQUFDLEtBQUtELFNBQUwsQ0FBZUUsUUFBZixDQUF3QkQsS0FBeEIsQ0FBTCxFQUFxQztBQUNuQyxjQUFJQSxNQUFNRSxNQUFWLEVBQWtCRixNQUFNRSxNQUFOLENBQWFDLFdBQWIsQ0FBeUJILEtBQXpCO0FBQ2xCQSxnQkFBTUUsTUFBTixHQUFlLElBQWY7QUFDQUYsZ0JBQU1JLGdCQUFOLENBQXVCLEdBQXZCLEVBQTRCLEtBQUtDLFdBQUwsQ0FBaUJDLElBQWpCLENBQXNCLElBQXRCLENBQTVCO0FBQ0EsZUFBS1AsU0FBTCxDQUFlUSxJQUFmLENBQW9CUCxLQUFwQjtBQUNBLGVBQUtRLGFBQUwsQ0FBbUIsbUJBQW5CLEVBQXdDLEVBQUVSLE9BQU9BLEtBQVQsRUFBeEMsRUFBMEQsSUFBMUQ7QUFDRDtBQUNELGVBQU8sSUFBUDtBQUNEOztBQUdMOztBQUVBO0FBQ0E7O0FBOUJFO0FBQUE7QUFBQSxrQ0FnQ2NBLEtBaENkLEVBZ0NxQjtBQUNqQixZQUFJLEtBQUtELFNBQUwsQ0FBZUUsUUFBZixDQUF3QkQsS0FBeEIsQ0FBSixFQUFvQztBQUNsQ0EsZ0JBQU1FLE1BQU4sR0FBZSxJQUFmO0FBQ0FGLGdCQUFNUyxtQkFBTixDQUEwQixHQUExQixFQUErQixLQUFLSixXQUFMLENBQWlCQyxJQUFqQixDQUFzQixJQUF0QixDQUEvQjtBQUNBLGVBQUtQLFNBQUwsQ0FBZVcsTUFBZixDQUFzQixLQUFLWCxTQUFMLENBQWVZLE9BQWYsQ0FBdUJYLEtBQXZCLENBQXRCLEVBQXFELENBQXJEO0FBQ0EsZUFBS1EsYUFBTCxDQUFtQixxQkFBbkIsRUFBMEMsRUFBRVIsT0FBT0EsS0FBVCxFQUExQyxFQUE0RCxJQUE1RDtBQUNEO0FBQ0QsZUFBTyxJQUFQO0FBQ0Q7O0FBR0w7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQXJERTs7QUFBQTtBQUFBLElBQTRCRixlQUE1QjtBQXVERCxDQTFERCIsImZpbGUiOiJtb2R1bGUvY29yZS91dGlsL3BhcmVudC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
