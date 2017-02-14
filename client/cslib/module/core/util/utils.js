'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// Utilities
// =========

// Provides generic utility functions.

define(function (require) {
  var $ = require('jquery');

  return {

    // `ensureDefaults(data, defaults)`

    // Merges `defaults` into `data` and returns the result. Neither object is
    // modified in the process.

    ensureDefaults: function ensureDefaults(data, defaults) {
      return $.extend(true, {}, defaults, data);
    },


    // `validateString(string, validaiton)`

    // Tests a string against the provided validation. Validation can be of three
    // types:

    validateString: function validateString(string, validation) {
      // if (typeof string !== 'string') throw new Error('Object to be validated is not a string.');
      if (typeof string !== 'string') return false;

      switch (typeof validation === 'undefined' ? 'undefined' : _typeof(validation)) {
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

    guid4: function guid4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.floor(Math.random() * 16);
        var v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    },


    // `guidReString()`

    // Returns a string for use in regular expressions to match a guid.
    // A regular expression itself is not returned, as the string may be needed
    // in conjunction with other components of a RegExp.

    guidReString: function guidReString() {
      return "[A-Fa-f0-9]{8}-(?:[A-Fa-f0-9]{4}-){3}[A-Fa-f0-9]{12}";
    },


    // `slugify(str)`

    // Converts a string to a slug format, replacing whitespace with underscores
    // and removing any non-alphanumeric characters

    slugify: function slugify(str) {
      return str.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
    },


    // `promiseErrorHandler(Error e)`

    // Provides a uniform way of handling errors that arise from promises.

    promiseErrorHandler: function promiseErrorHandler(e) {
      console.log(e.message, e.stack);
    },
    promiseAjax: function promiseAjax(url) {
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: url,
          success: function success(data, status, xhr) {
            resolve(data);
          },
          error: function error(xhr, status, err) {
            reject(err);
          }
        });
      });
    },
    promiseRequire: function promiseRequire(paths) {
      if (!(paths instanceof Array)) paths = [paths];
      return new Promise(function (resolve, reject) {
        require(paths, function () {
          for (var _len = arguments.length, reqs = Array(_len), _key = 0; _key < _len; _key++) {
            reqs[_key] = arguments[_key];
          }

          resolve(reqs);
        }, function (err) {
          reject(err);
        });
      });
    },


    // `posMod(x, n)`

    // Mathematical mod is always positive, and the value of -1 % 5 should be 4.
    // JavaScript (and most other programming languages) return a negative number
    // (in the previous example, -1 % 5 = -1). Often times, particularly when
    // cycling through an array of items, you want to use the positive mod value,
    // which this method provides.

    posMod: function posMod(x, n) {
      while (x < 0) {
        x += n;
      }return x % n;
    },
    isEmpty: function isEmpty(a) {
      return !a || a instanceof Array && a.length == 0 || (typeof a == "string" || a instanceof String) && a == '';
    },


    // `sortValue(a, b, ascending = true)`

    // Provides a default numeric value for use in sort callbacks. Note that a and
    // b need to be comparable via the default `<` and `>` interpretations.

    sortValue: function sortValue(a, b) {
      var ascending = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var val = void 0;
      if ((a == undefined || a == null) && (b == undefined || b == null)) {
        val = 0;
      } else if (a == undefined || a == null) {
        val = 1;
      } else if (b == undefined || b == null) {
        val = -1;
      } else {
        val = a > b ? 1 : a < b ? -1 : 0;
      }
      if (!ascending) {
        val = val * -1;
      }
      return val;
    },


    // `sortValueIgnoreArticles(a, b, ascending = true)`

    // Provides a default numeric value for use in sort callbacks. Unlike
    // `Utils.sortValue`, this method will detect strings and will ignore initial
    // "the" or "a" in the strings, allowing for easy comparison of titles.

    sortValueIgnoreArticles: function sortValueIgnoreArticles(a, b) {
      var ascending = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      if (typeof a == "string" || a instanceof String) {
        a = a.replace(/^((the)|a)\s+/i, "");
      }
      if (typeof b == "string" || b instanceof String) {
        b = b.replace(/^((the)|a)\s+/i, "");
      }
      return Utils.sortValue(a, b, ascending);
    },
    zeropad: function zeropad(str, size) {
      var s = str + "";
      while (s.length < size) {
        s = "0" + s;
      }return s;
    },
    isString: function isString(s) {
      return s instanceof String || typeof s == "string";
    },
    isArray: function isArray(a) {
      return a instanceof Array;
    },
    isNumeric: function isNumeric(x) {
      return $.isNumeric(x);
    },
    isJSON: function isJSON(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    ensureArray: function ensureArray(a) {
      if (Utils.isArray(a)) {
        return a;
      } else {
        return [a];
      }
    },
    clearTextSelection: function clearTextSelection() {
      if (document.selection) {
        document.selection.empty();
      } else if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    },
    md5: function (_md) {
      function md5(_x3) {
        return _md.apply(this, arguments);
      }

      md5.toString = function () {
        return _md.toString();
      };

      return md5;
    }(function (str) {
      md5(str);
    }),
    objectValues: function objectValues(obj) {
      if (Object.values) {
        return Object.values(obj);
      } else {
        var vals = [];
        for (var k in obj) {
          vals.push(obj[k]);
        }
        return vals;
      }
    },
    exists: function exists(val) {
      return typeof val !== "undefined" && val !== null;
    },
    bindMethods: function bindMethods(obj, methods) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var method = _step.value;

          obj[method] = obj[method].bind(obj);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    bindAllMethods: function bindAllMethods(obj) {
      this.bindMethods(obj, Object.keys(obj).filter(function (key) {
        return typeof obj[key] == "function";
      }));
    },
    secondsToTimeString: function secondsToTimeString(seconds) {
      var hour = Math.floor(seconds / (60 * 60));
      var min = Math.floor(seconds % (60 * 60) / 60);
      var sec = Math.floor(seconds % 60);
      if (min < 10) min = "0" + min;
      if (sec < 10) sec = "0" + sec;
      return hour + ':' + min + ':' + sec;
    },
    urlParam: function urlParam(key) {
      // http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
      var urlSearch = window.location.search.substring(1);
      var urlVars = urlSearch.split('&');
      for (var i = 0; i < urlVars.length; i++) {
        var varPair = urlVars[i].split('=');
        if (varPair[0] == key) return varPair[1];
      }
      return null;
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3V0aWwvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBS0EsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLElBQUksUUFBUSxRQUFSLENBQVY7O0FBRUEsU0FBTzs7Ozs7OztBQU9MLGtCQVBLLDBCQU9VLElBUFYsRUFPZ0IsUUFQaEIsRUFPMEI7QUFDN0IsYUFBTyxFQUFFLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixRQUFuQixFQUE2QixJQUE3QixDQUFQO0FBQ0QsS0FUSTs7Ozs7Ozs7QUFpQkwsa0JBakJLLDBCQWlCVSxNQWpCVixFQWlCa0IsVUFqQmxCLEVBaUI4Qjs7QUFFakMsVUFBSSxPQUFPLE1BQVAsS0FBa0IsUUFBdEIsRUFBZ0MsT0FBTyxLQUFQOztBQUVoQyxxQkFBZSxVQUFmLHlDQUFlLFVBQWY7O0FBRUUsYUFBSyxRQUFMO0FBQ0UsaUJBQU8sVUFBVSxVQUFqQjs7OztBQUlGLGFBQUssVUFBTDtBQUNFLGlCQUFPLFdBQVcsTUFBWCxDQUFQOzs7QUFHRixhQUFLLFFBQUw7QUFDRSxjQUFJLHNCQUFzQixNQUExQixFQUFrQyxPQUFPLFdBQVcsSUFBWCxDQUFnQixNQUFoQixDQUFQO0FBQ2xDO0FBYko7Ozs7O0FBbUJBLFlBQU0sSUFBSSxLQUFKLENBQVUsb0NBQVYsQ0FBTjtBQUNELEtBekNJOzs7Ozs7O0FBZ0RMLFNBaERLLG1CQWdERztBQUNOLGFBQU8sdUNBQXVDLE9BQXZDLENBQStDLE9BQS9DLEVBQXdELFVBQUMsQ0FBRCxFQUFPO0FBQ3BFLFlBQU0sSUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBYyxFQUF6QixDQUFWO0FBQ0EsWUFBTSxJQUFJLEtBQUssR0FBTCxHQUFXLENBQVgsR0FBZ0IsSUFBSSxHQUFKLEdBQVUsR0FBcEM7QUFDQSxlQUFPLEVBQUUsUUFBRixDQUFXLEVBQVgsQ0FBUDtBQUNELE9BSk0sQ0FBUDtBQUtELEtBdERJOzs7Ozs7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
