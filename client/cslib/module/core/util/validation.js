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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3V0aWwvdmFsaWRhdGlvbi5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJWYWxpZGF0aW9ucyIsImV4aXN0cyIsInZhbCIsInNwZWMiLCJfdmFsaWRhdGUiLCJpc0VtcHR5IiwiZW1haWwiLCJyZSIsInJlZ2V4IiwidGVzdCIsImxlc3NUaGFuIiwiY29tcGFyaXRvciIsImx0IiwibGVzc1RoYW5FcXVhbCIsImx0ZSIsImdyZWF0ZXJUaGFuIiwiZ3QiLCJncmVhdGVyVGhhbkVxdWFsIiwiZ3RlIiwibWluTGVuZ3RoIiwibGVuZ3RoIiwibWF4TGVuZ3RoIiwibnVtZXJpYyIsImlzTnVtZXJpYyIsImN1c3RvbSIsImZuIiwidGhlbiIsImlzVmFsaWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsImVycm9yIiwiZXJyb3JNZXNzYWdlIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7O0FBRUEsTUFBTUUsY0FBYztBQUNsQkMsWUFBUSxnQkFBQ0MsR0FBRCxFQUFNQyxJQUFOO0FBQUEsYUFBZUgsWUFBWUksU0FBWixDQUFzQkQsSUFBdEIsRUFBNEIsQ0FBQ0osTUFBTU0sT0FBTixDQUFjSCxHQUFkLENBQTdCLENBQWY7QUFBQSxLQURVOztBQUdsQkksV0FBTyxlQUFDSixHQUFELEVBQU1DLElBQU4sRUFBZTtBQUNwQjtBQUNBQSxXQUFLSSxFQUFMLEdBQVUsR0FBVjtBQUNBLGFBQU9QLFlBQVlRLEtBQVosQ0FBa0JOLEdBQWxCLEVBQXVCQyxJQUF2QixDQUFQO0FBQ0QsS0FQaUI7O0FBU2xCSyxXQUFPLGVBQUNOLEdBQUQsRUFBTUMsSUFBTixFQUFlO0FBQ3BCLGFBQU9ILFlBQVlJLFNBQVosQ0FBc0JELElBQXRCLEVBQTRCQSxLQUFLSSxFQUFMLENBQVFFLElBQVIsQ0FBYVAsR0FBYixDQUE1QixDQUFQO0FBQ0QsS0FYaUI7O0FB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
