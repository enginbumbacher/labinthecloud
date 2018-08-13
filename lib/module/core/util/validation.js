import Utils from 'core/util/utils';

const Validations = {
  exists: (val, spec) => Validations._validate(spec, !Utils.isEmpty(val)),

  email: (val, spec) => {
    // As per this article: https://davidcel.is/posts/stop-validating-email-addresses-with-regex/
    spec.re = /@/;
    return Validations.regex(val, spec);
  },

  regex: (val, spec) => {
    return Validations._validate(spec, spec.re.test(val))
  },

  lessThan: (val, spec) => {
    return Validations._validate(spec, val < spec.comparitor)
  },

  lt: (val, spec) => {
    return Validations.lessThan(val, spec)
  },

  lessThanEqual: (val, spec) => {
    return Validations._validate(spec, val <= spec.comparitor)
  },

  lte: (val, spec) => {
    return Validations.lessThanEqual(val, spec)
  },

  greaterThan: (val, spec) => {
    return Validations._validate(spec, val > spec.comparitor)
  },

  gt: (val, spec) => {
    return Validations.greaterThan(val, spec)
  },

  greaterThanEqual: (val, spec) => {
    return Validations._validate(spec, val >= spec.comparitor)
  },

  gte: (val, spec) => {
    return Validations.greaterThanEqual(val, spec)
  },

  minLength: (val, spec) => {
    return Validations._validate(spec, val.length >= spec.length)
  },

  maxLength: (val, spec) => {
    return Validations._validate(spec, val.length <= spec.length)
  },

  numeric: (val, spec) => {
    return Validations._validate(spec, Utils.isNumeric(val))
  },

  custom: (val, spec) => {
    return spec.fn(val, spec)
      .then((isValid) => {
        return Validations._validate(spec, isValid)
      });
  },

  _validate: (spec, isValid) => {
    return Promise.resolve({
      isValid: isValid,
      error: isValid ? null : spec.errorMessage
    })
  }
}
export default Validations;
