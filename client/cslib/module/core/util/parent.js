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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Parent).call(this));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3V0aWwvcGFyZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sa0JBQWtCLFFBQVEsdUJBQVIsQ0FBeEI7O0FBRUE7QUFBQTs7QUFDRSxzQkFBYztBQUFBOztBQUFBOztBQUVaLFlBQUssU0FBTCxHQUFpQixFQUFqQjtBQUZZO0FBR2I7Ozs7Ozs7Ozs7QUFKSDtBQUFBO0FBQUEsK0JBZVcsS0FmWCxFQWVrQjtBQUNkLFlBQUksQ0FBQyxLQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXdCLEtBQXhCLENBQUwsRUFBcUM7QUFDbkMsY0FBSSxNQUFNLE1BQVYsRUFBa0IsTUFBTSxNQUFOLENBQWEsV0FBYixDQUF5QixLQUF6QjtBQUNsQixnQkFBTSxNQUFOLEdBQWUsSUFBZjtBQUNBLGdCQUFNLGdCQUFOLENBQXVCLEdBQXZCLEVBQTRCLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUE1QjtBQUNBLGVBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsS0FBcEI7QUFDQSxlQUFLLGFBQUwsQ0FBbUIsbUJBQW5CLEVBQXdDLEVBQUUsT0FBTyxLQUFULEVBQXhDLEVBQTBELElBQTFEO0FBQ0Q7QUFDRCxlQUFPLElBQVA7QUFDRDs7Ozs7OztBQXhCSDtBQUFBO0FBQUEsa0NBZ0NjLEtBaENkLEVBZ0NxQjtBQUNqQixZQUFJLEtBQUssU0FBTCxDQUFlLFFBQWYsQ0FBd0IsS0FBeEIsQ0FBSixFQUFvQztBQUNsQyxnQkFBTSxNQUFOLEdBQWUsSUFBZjtBQUNBLGdCQUFNLG1CQUFOLENBQTBCLEdBQTFCLEVBQStCLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUEvQjtBQUNBLGVBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsS0FBSyxTQUFMLENBQWUsT0FBZixDQUF1QixLQUF2QixDQUF0QixFQUFxRCxDQUFyRDtBQUNBLGVBQUssYUFBTCxDQUFtQixxQkFBbkIsRUFBMEMsRUFBRSxPQUFPLEtBQVQsRUFBMUMsRUFBNEQsSUFBNUQ7QUFDRDtBQUNELGVBQU8sSUFBUDtBQUNEOzs7Ozs7Ozs7Ozs7OztBQXhDSDs7QUFBQTtBQUFBLElBQTRCLGVBQTVCO0FBdURELENBMUREIiwiZmlsZSI6Im1vZHVsZS9jb3JlL3V0aWwvcGFyZW50LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
