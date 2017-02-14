'use strict';

define(function (require) {
  var Utils = require('core/util/utils');

  var Validations = {
    exists: function exists(val, spec) {
      return Validations._validate(spec, !Utils.isEmpty(val));
    },

    email: function email(val, spec) {
      // As per this article: https://davidcel.is/posts/stop-validating-email-addresses-with-regex/
      spec.re = /@/;
      return Validations.regex(val, spec);
    },

    regex: function regex(val, spec) {
      return Validations._validate(spec, spec.re.test(val));
    },

    lessThan: function lessThan(val, spec) {
      return Validations._validate(spec, val < spec.comparitor);
    },

    lt: function lt(val, spec) {
      return Validations.lessThan(val, spec);
    },

    lessThanEqual: function lessThanEqual(val, spec) {
      return Validations._validate(spec, val <= spec.comparitor);
    },

    lte: function lte(val, spec) {
      return Validations.lessThanEqual(val, spec);
    },

    greaterThan: function greaterThan(val, spec) {
      return Validations._validate(spec, val > spec.comparitor);
    },

    gt: function gt(val, spec) {
      return Validations.greaterThan(val, spec);
    },

    greaterThanEqual: function greaterThanEqual(val, spec) {
      return Validations._validate(spec, val >= spec.comparitor);
    },

    gte: function gte(val, spec) {
      return Validations.greaterThanEqual(val, spec);
    },

    minLength: function minLength(val, spec) {
      return Validations._validate(spec, val.length >= spec.length);
    },

    maxLength: function maxLength(val, spec) {
      return Validations._validate(spec, val.length <= spec.length);
    },

    numeric: function numeric(val, spec) {
      return Validations._validate(spec, Utils.isNumeric(val));
    },

    custom: function custom(val, spec) {
      return spec.fn(val, spec).then(function (isValid) {
        return Validations._validate(spec, isValid);
      });
    },

    _validate: function _validate(spec, isValid) {
      return Promise.resolve({
        isValid: isValid,
        error: isValid ? null : spec.errorMessage
      });
    }
  };
  return Validations;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3V0aWwvdmFsaWRhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxRQUFRLFFBQVEsaUJBQVIsQ0FBZDs7QUFFQSxNQUFNLGNBQWM7QUFDbEIsWUFBUSxnQkFBQyxHQUFELEVBQU0sSUFBTjtBQUFBLGFBQWUsWUFBWSxTQUFaLENBQXNCLElBQXRCLEVBQTRCLENBQUMsTUFBTSxPQUFOLENBQWMsR0FBZCxDQUE3QixDQUFmO0FBQUEsS0FEVTs7QUFHbEIsV0FBTyxlQUFDLEdBQUQsRUFBTSxJQUFOLEVBQWU7O0FBRXBCLFdBQUssRUFBTCxHQUFVLEdBQVY7QUFDQSxhQUFPLFlBQVksS0FBWixDQUFrQixHQUFsQixFQUF1QixJQUF2QixDQUFQO0FBQ0QsS0FQaUI7O0FBU2xCLFdBQU8sZUFBQyxHQUFELEVBQU0sSUFBTixFQUFlO0FBQ3BCLGFBQU8sWUFBWSxTQUFaLENBQXNCLElBQXRCLEVBQTRCLEtBQUssRUFBTCxDQUFRLElBQVIsQ0FBYSxHQUFiLENBQTVCLENBQVA7QUFDRCxLQVhpQjs7QUFhbEIsY0FBVSxrQkFBQyxHQUFELEVBQU0sSUFBTixFQUFlO0FBQ3ZCLGFBQU8sWUFBWSxTQUFaLENBQXNCLElBQXRCLEVBQTRCLE1BQU0sS0FBSyxVQUF2QyxDQUFQO0FBQ0QsS0FmaUI7O0FBaUJsQixRQUFJLFlBQUMsR0FBRCxFQUFNLElBQU4sRUFBZTtBQUNqQixhQUFPLFlBQVksUUFBWixDQUFxQixHQUFyQixFQUEwQixJQUExQixDQUFQO0FBQ0QsS0FuQmlCOztBQXFCbEIsbUJBQWUsdUJBQUMsR0FBRCxFQUFNLElBQU4sRUFBZTtBQUM1QixhQUFPLFlBQVksU0FBWixDQUFzQixJQUF0QixFQUE0QixPQUFPLEtBQUssVUFBeEMsQ0FBUDtBQUNELEtBdkJpQjs7QUF5QmxCLFNBQUssYUFBQyxHQUFELEVBQU0sSUFBTixFQUFlO0FBQ2xCLGFBQU8sWUFBWSxhQUFaLENBQTBCLEdBQTFCLEVBQStCLElBQS9CLENBQVA7QUFDRCxLQTNCaUI7O0FBNkJsQixpQkFBYSxxQkFBQyxHQUFELEVBQU0sSUFBTixFQUFlO0FBQzFCLGFBQU8sWUFBWSxTQUFaLENBQXNCLElBQXRCLEVBQTRCLE1BQU0sS0FBSyxVQUF2QyxDQUFQO0FBQ0QsS0EvQmlCOztBQWlDbEIsUUFBSSxZQUFDLEdBQUQsRUFBTSxJQUFOLEVBQWU7QUFDakIsYUFBTyxZQUFZLFdBQVosQ0FBd0IsR0FBeEIsRUFBNkIsSUFBN0IsQ0FBUDtBQUNELEtBbkNpQjs7QUFxQ2xCLHNCQUFrQiwwQkFBQyxHQUFELEVBQU0sSUFBTixFQUFlO0FBQy9CLGFBQU8sWUFBWSxTQUFaLENBQXNCLElBQXRCLEVBQTRCLE9BQU8sS0FBSyxVQUF4QyxDQUFQO0FBQ0QsS0F2Q2lCOztBQXlDbEIsU0FBSyxhQUFDLEdBQUQsRUFBTSxJQUFOLEVBQWU7QUFDbEIsYUFBTyxZQUFZLGdCQUFaLENBQTZCLEdBQTdCLEVBQWtDLElBQWxDLENBQVA7QUFDRCxLQTNDaUI7O0FBNkNsQixlQUFXLG1CQUFDLEdBQUQsRUFBTSxJQUFOLEVBQWU7QUFDeEIsYUFBTyxZQUFZLFNBQVosQ0FBc0IsSUFBdEIsRUFBNEIsSUFBSSxNQUFKLElBQWMsS0FBSyxNQUEvQyxDQUFQO0FBQ0QsS0EvQ2lCOztBQWlEbEIsZUFBVyxtQkFBQyxHQUFELEVBQU0sSUFBTixFQUFlO0FBQ3hCLGFBQU8sWUFBWSxTQUFaLENBQXNCLElBQXRCLEVBQTRCLElBQUksTUFBSixJQUFjLEtBQUssTUFBL0MsQ0FBUDtBQUNELEtBbkRpQjs7QUFxRGxCLGFBQVMsaUJBQUMsR0FBRCxFQUFNLElBQU4sRUFBZTtBQUN0QixhQUFPLFlBQVksU0FBWixDQUFzQixJQUF0QixFQUE0QixNQUFNLFNBQU4sQ0FBZ0IsR0FBaEIsQ0FBNUIsQ0FBUDtBQUNELEtBdkRpQjs7QUF5RGxCLFlBQVEsZ0JBQUMsR0FBRCxFQUFNLElBQU4sRUFBZTtBQUNyQixhQUFPLEtBQUssRUFBTCxDQUFRLEdBQVIsRUFBYSxJQUFiLEVBQ0osSUFESSxDQUNDLFVBQUMsT0FBRCxFQUFhO0FBQ2pCLGVBQU8sWUFBWSxTQUFaLENBQXNCLElBQXRCLEVBQTRCLE9BQTVCLENBQVA7QUFDRCxPQUhJLENBQVA7QUFJRCxLQTlEaUI7O0FBZ0VsQixlQUFXLG1CQUFDLElBQUQsRUFBTyxPQUFQLEVBQW1CO0FBQzVCLGFBQU8sUUFBUSxPQUFSLENBQWdCO0FBQ3JCLGlCQUFTLE9BRFk7QUFFckIsZUFBTyxVQUFVLElBQVYsR0FBaUIsS0FBSztBQUZSLE9BQWhCLENBQVA7QUFJRDtBQXJFaUIsR0FBcEI7QUF1RUEsU0FBTyxXQUFQO0FBQ0QsQ0EzRUQiLCJmaWxlIjoibW9kdWxlL2NvcmUvdXRpbC92YWxpZGF0aW9uLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
