// Utilities
// =========

// Provides generic utility functions.

define((require) => {
  const $ = require('jquery');

  return {
    
// `ensureDefaults(data, defaults)`

// Merges `defaults` into `data` and returns the result. Neither object is
// modified in the process.
    
    ensureDefaults(data, defaults) {
      return $.extend(true, {}, defaults, data)
    },

    
// `validateString(string, validaiton)`

// Tests a string against the provided validation. Validation can be of three
// types:
    
    validateString(string, validation) {
      // if (typeof string !== 'string') throw new Error('Object to be validated is not a string.');
      if (typeof string !== 'string') return false;

      switch (typeof validation) {
// * string: basic equality is used to test the string.
        case 'string':
          return string == validation;

// * function: the function is called, with the test string passed as
//   the only argument.
        case 'function':
          return validation(string);

// * regex: the regex test method is run on the test string.
        case 'object':
          if (validation instanceof RegExp) return validation.test(string);
          break;
      }

// If the validation is none of these, or if the test string itself is not
// actually a string, then the validation will return `null`.
      
      throw new Error('Validation is not acceptable type.');
    },

    
// `guid4()`

// Generates a random uuid.
    
    guid4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.floor(Math.random()*16);
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16)
      });
    },

    
// `guidReString()`

// Returns a string for use in regular expressions to match a guid.
// A regular expression itself is not returned, as the string may be needed
// in conjunction with other components of a RegExp.
    
    guidReString() {
      return "[A-Fa-f0-9]{8}-(?:[A-Fa-f0-9]{4}-){3}[A-Fa-f0-9]{12}"
    },

    
// `slugify(str)`

// Converts a string to a slug format, replacing whitespace with underscores
// and removing any non-alphanumeric characters
    
    slugify(str) {
      return str.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
    },

    
// `promiseErrorHandler(Error e)`

// Provides a uniform way of handling errors that arise from promises.
    
    promiseErrorHandler(e) {
      console.log(e.message, e.stack);
    },

    promiseRequire(paths) {
      if (!(paths instanceof Array)) paths = [paths];
      return new Promise((resolve, reject) => {
        require(paths, (...reqs) => { resolve(reqs); }, (err) => { reject(err); });
      });
    },
    
// `posMod(x, n)`

// Mathematical mod is always positive, and the value of -1 % 5 should be 4.
// JavaScript (and most other programming languages) return a negative number
// (in the previous example, -1 % 5 = -1). Often times, particularly when
// cycling through an array of items, you want to use the positive mod value,
// which this method provides.
    
    posMod(x, n) {
      while (x < 0) x += n;
      return x % n;
    },

    isEmpty(a) {
      return !a ||
        (a instanceof Array && a.length == 0) ||
        ((typeof a == "string" || a instanceof String) && a == '')
    },

    
// `sortValue(a, b, ascending = true)`

// Provides a default numeric value for use in sort callbacks. Note that a and
// b need to be comparable via the default `<` and `>` interpretations.
    
    sortValue(a, b, ascending = true) {
      let val;
      if ((a == undefined || a == null) && (b == undefined || b == null)) {
        val = 0
      } else if (a == undefined || a == null) {
        val = 1
      } else if (b == undefined || b == null) {
        val = -1
      } else {
        val = a > b ? 1 : (a < b ? -1 : 0)
      }
      if (!ascending) {
        val = val * -1
      }
      return val
    },

// `sortValueIgnoreArticles(a, b, ascending = true)`

// Provides a default numeric value for use in sort callbacks. Unlike
// `Utils.sortValue`, this method will detect strings and will ignore initial
// "the" or "a" in the strings, allowing for easy comparison of titles.
    
    sortValueIgnoreArticles(a, b, ascending = true) {
      if (typeof a == "string" || a instanceof String) {
        a = a.replace(/^((the)|a)\s+/i, "");
      }
      if (typeof b == "string" || b instanceof String) {
        b = b.replace(/^((the)|a)\s+/i, "");
      }
      return Utils.sortValue(a, b, ascending);
    },

    zeropad(str, size) {
      let s = str + "";
      while (s.length < size) s = "0" + s;
      return s;
    },

    exists(val) {
      return typeof val !== "undefined" && val !== null;
    }
  };
});