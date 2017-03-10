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
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Promise(function (resolve, reject) {
        options.url = url;
        options.success = function (data, status, xhr) {
          resolve(data);
        };
        options.error = function (xhr, status, err) {
          reject(err);
        };
        $.ajax(options);
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
      function md5(_x4) {
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
