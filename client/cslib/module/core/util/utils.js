'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Utilities
// =========

// Provides generic utility functions.

define(function (require) {
  var $ = require('jquery');

  var Utils = {

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
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return new Promise(function (resolve, reject) {
        options.url = url;
        options.success = function (data, status, xhr) {
          resolve(data);
        };
        options.error = function (xhr, status, err) {
          var e = new Error();
          e.statusCode = status;
          e.message = err;
          reject(e);
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
      var ascending = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

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
      var ascending = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

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
    },
    mouseTouchPosition: function mouseTouchPosition(jqevt) {
      if (jqevt.pageX) {
        return {
          x: jqevt.pageX,
          y: jqevt.pageY
        };
      } else if (jqevt.type.match(/^touch/)) {
        return {
          x: jqevt.touches[0].pageX,
          y: jqevt.touches[0].pageY
        };
      } else {
        return {
          x: 0,
          y: 0
        };
      }
      return pos;
    },


    // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
    decimalAdjust: function decimalAdjust(type, value, exp) {
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
      }
      value = +value;
      exp = +exp;
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
      }
      if (value < 0) {
        return -Utils.decimalAdjust(type, -value, exp);
      }
      value = value.toString().split('e');
      value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
      value = value.toString().split('e');
      return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
    },
    roundDecimal: function roundDecimal(value, exp) {
      return Utils.decimalAdjust('round', value, exp);
    },
    ceilDecimal: function ceilDecimal(value, exp) {
      return Utils.decimalAdjust('ceil', value, exp);
    },
    floorDecimal: function floorDecimal(value, exp) {
      return Utils.decimalAdjust('floor', value, exp);
    },


    TAU: 2 * Math.PI
  };

  return Utils;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3V0aWwvdXRpbHMuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJVdGlscyIsImVuc3VyZURlZmF1bHRzIiwiZGF0YSIsImRlZmF1bHRzIiwiZXh0ZW5kIiwidmFsaWRhdGVTdHJpbmciLCJzdHJpbmciLCJ2YWxpZGF0aW9uIiwiUmVnRXhwIiwidGVzdCIsIkVycm9yIiwiZ3VpZDQiLCJyZXBsYWNlIiwiYyIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJ2IiwidG9TdHJpbmciLCJndWlkUmVTdHJpbmciLCJzbHVnaWZ5Iiwic3RyIiwidG9Mb3dlckNhc2UiLCJwcm9taXNlRXJyb3JIYW5kbGVyIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJtZXNzYWdlIiwic3RhY2siLCJwcm9taXNlQWpheCIsInVybCIsIm9wdGlvbnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInN1Y2Nlc3MiLCJzdGF0dXMiLCJ4aHIiLCJlcnJvciIsImVyciIsInN0YXR1c0NvZGUiLCJhamF4IiwicHJvbWlzZVJlcXVpcmUiLCJwYXRocyIsIkFycmF5IiwicmVxcyIsInBvc01vZCIsIngiLCJuIiwiaXNFbXB0eSIsImEiLCJsZW5ndGgiLCJTdHJpbmciLCJzb3J0VmFsdWUiLCJiIiwiYXNjZW5kaW5nIiwidmFsIiwidW5kZWZpbmVkIiwic29ydFZhbHVlSWdub3JlQXJ0aWNsZXMiLCJ6ZXJvcGFkIiwic2l6ZSIsInMiLCJpc1N0cmluZyIsImlzQXJyYXkiLCJpc051bWVyaWMiLCJpc0pTT04iLCJKU09OIiwicGFyc2UiLCJlbnN1cmVBcnJheSIsImNsZWFyVGV4dFNlbGVjdGlvbiIsImRvY3VtZW50Iiwic2VsZWN0aW9uIiwiZW1wdHkiLCJ3aW5kb3ciLCJnZXRTZWxlY3Rpb24iLCJyZW1vdmVBbGxSYW5nZXMiLCJtZDUiLCJvYmplY3RWYWx1ZXMiLCJvYmoiLCJPYmplY3QiLCJ2YWx1ZXMiLCJ2YWxzIiwiayIsInB1c2giLCJleGlzdHMiLCJiaW5kTWV0aG9kcyIsIm1ldGhvZHMiLCJtZXRob2QiLCJiaW5kIiwiYmluZEFsbE1ldGhvZHMiLCJrZXlzIiwiZmlsdGVyIiwia2V5Iiwic2Vjb25kc1RvVGltZVN0cmluZyIsInNlY29uZHMiLCJob3VyIiwibWluIiwic2VjIiwidXJsUGFyYW0iLCJ1cmxTZWFyY2giLCJsb2NhdGlvbiIsInNlYXJjaCIsInN1YnN0cmluZyIsInVybFZhcnMiLCJzcGxpdCIsImkiLCJ2YXJQYWlyIiwibW91c2VUb3VjaFBvc2l0aW9uIiwianFldnQiLCJwYWdlWCIsInkiLCJwYWdlWSIsInR5cGUiLCJtYXRjaCIsInRvdWNoZXMiLCJwb3MiLCJkZWNpbWFsQWRqdXN0IiwidmFsdWUiLCJleHAiLCJpc05hTiIsIk5hTiIsInJvdW5kRGVjaW1hbCIsImNlaWxEZWNpbWFsIiwiZmxvb3JEZWNpbWFsIiwiVEFVIiwiUEkiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBOztBQUVBOztBQUVBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxJQUFJRCxRQUFRLFFBQVIsQ0FBVjs7QUFFQSxNQUFNRSxRQUFROztBQUVoQjs7QUFFQTtBQUNBOztBQUVJQyxrQkFQWSwwQkFPR0MsSUFQSCxFQU9TQyxRQVBULEVBT21CO0FBQzdCLGFBQU9KLEVBQUVLLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkQsUUFBbkIsRUFBNkJELElBQTdCLENBQVA7QUFDRCxLQVRXOzs7QUFZaEI7O0FBRUE7QUFDQTs7QUFFSUcsa0JBakJZLDBCQWlCR0MsTUFqQkgsRUFpQldDLFVBakJYLEVBaUJ1QjtBQUNqQztBQUNBLFVBQUksT0FBT0QsTUFBUCxLQUFrQixRQUF0QixFQUFnQyxPQUFPLEtBQVA7O0FBRWhDLHFCQUFlQyxVQUFmLHlDQUFlQSxVQUFmO0FBQ047QUFDUSxhQUFLLFFBQUw7QUFDRSxpQkFBT0QsVUFBVUMsVUFBakI7O0FBRVY7QUFDQTtBQUNRLGFBQUssVUFBTDtBQUNFLGlCQUFPQSxXQUFXRCxN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Ly8gPT09PT09PT09XG5cbi8vIFByb3ZpZGVzIGdlbmVyaWMgdXRpbGl0eSBmdW5jdGlvbnMuXG5cbmRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgY29uc3QgVXRpbHMgPSB7XG4gICAgXG4vLyBgZW5zdXJlRGVmYXVsdHMoZGF0YSwgZGVmYXVsdHMpYFxuXG4vLyBNZXJnZXMgYGRlZmF1bHRzYCBpbnRvIGBkYXRhYCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LiBOZWl0aGVyIG9iamVjdCBpc1xuLy8gbW9kaWZpZWQgaW4gdGhlIHByb2Nlc3MuXG4gICAgXG4gICAgZW5zdXJlRGVmYXVsdHMoZGF0YSwgZGVmYXVsdHMpIHtcbiAgICAgIHJldHVybiAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpXG4gICAgfSxcblxuICAgIFxuLy8gYHZhbGlkYXRlU3RyaW5nKHN0cmluZywgdmFsaWRhaXRvbilgXG5cbi8vIFRlc3RzIGEgc3RyaW5nIGFnYWluc3QgdGhlIHByb3ZpZGVkIHZhbGlkYXRpb24uIFZhbGlkYXRpb24gY2FuIGJlIG9mIHRocmVlXG4vLyB0eXBlczpcbiAgICBcbiAgICB2YWxpZGF0ZVN0cmluZyhzdHJpbmcsIHZhbGlkYXRpb24pIHtcbiAgICAgIC8vIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykgdGhyb3cgbmV3IEVycm9yKCdPYmplY3QgdG8gYmUgdmFsaWRhdGVkIGlzIG5vdCBhIHN0cmluZy4nKTtcbiAgICAgIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICBzd2l0Y2ggKHR5cGVvZiB2YWxpZGF0aW9uKSB7XG4vLyAqIHN0cmluZzogYmFzaWMgZXF1YWxpdHkgaXMgdXNlZCB0byB0ZXN0IHRoZSBzdHJpbmcuXG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgcmV0dXJuIHN0cmluZyA9PSB2YWxpZGF0aW9uO1xuXG4vLyAqIGZ1bmN0aW9uOiB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkLCB3aXRoIHRoZSB0ZXN0IHN0cmluZyBwYXNzZWQgYXNcbi8vICAgdGhlIG9ubHkgYXJndW1lbnQuXG4gICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICByZXR1cm4gdmFsaWRhdGlvbihzdHJpbmcpO1xuXG4vLyAqIHJlZ2V4OiB0aGUgcmVnZXggdGVzdCBtZXRob2QgaXMgcnVuIG9uIHRoZSB0ZXN0IHN0cmluZy5cbiAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICBpZiAodmFsaWRhdGlvbiBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHZhbGlkYXRpb24udGVzdChzdHJpbmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4vLyBJZiB0aGUgdmFsaWRhdGlvbiBpcyBub25lIG9mIHRoZXNlLCBvciBpZiB0aGUgdGVzdCBzdHJpbmcgaXRzZWxmIGlzIG5vdFxuLy8gYWN0dWFsbHkgYSBzdHJpbmcsIHRoZW4gdGhlIHZhbGlkYXRpb24gd2lsbCByZXR1cm4gYG51bGxgLlxuICAgICAgXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbGlkYXRpb24gaXMgbm90IGFjY2VwdGFibGUgdHlwZS4nKTtcbiAgICB9LFxuXG4gICAgXG4vLyBgZ3VpZDQoKWBcblxuLy8gR2VuZXJhdGVzIGEgcmFuZG9tIHV1aWQuXG4gICAgXG4gICAgZ3VpZDQoKSB7XG4gICAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCAoYykgPT4ge1xuICAgICAgICBjb25zdCByID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjE2KTtcbiAgICAgICAgY29uc3QgdiA9IGMgPT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KTtcbiAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpXG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgXG4vLyBgZ3VpZFJlU3RyaW5nKClgXG5cbi8vIFJldHVybnMgYSBzdHJpbmcgZm9yIHVzZSBpbiByZWd1bGFyIGV4cHJlc3Npb25zIHRvIG1hdGNoIGEgZ3VpZC5cbi8vIEEgcmVndWxhciBleHByZXNzaW9uIGl0c2VsZiBpcyBub3QgcmV0dXJuZWQsIGFzIHRoZSBzdHJpbmcgbWF5IGJlIG5lZWRlZFxuLy8gaW4gY29uanVuY3Rpb24gd2l0aCBvdGhlciBjb21wb25lbnRzIG9mIGEgUmVnRXhwLlxuICAgIFxuICAgIGd1aWRSZVN0cmluZygpIHtcbiAgICAgIHJldHVybiBcIltBLUZhLWYwLTldezh9LSg/OltBLUZhLWYwLTldezR9LSl7M31bQS1GYS1mMC05XXsxMn1cIlxuICAgIH0sXG5cbiAgICBcbi8vIGBzbHVnaWZ5KHN0cilgXG5cbi8vIENvbnZlcnRzIGEgc3RyaW5nIHRvIGEgc2x1ZyBmb3JtYXQsIHJlcGxhY2luZyB3aGl0ZXNwYWNlIHdpdGggdW5kZXJzY29yZXNcbi8vIGFuZCByZW1vdmluZyBhbnkgbm9uLWFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzXG4gICAgXG4gICAgc2x1Z2lmeShzdHIpIHtcbiAgICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csICdfJykucmVwbGFjZSgvW15cXHddL2csICcnKTtcbiAgICB9LFxuXG4gICAgXG4vLyBgcHJvbWlzZUVycm9ySGFuZGxlcihFcnJvciBlKWBcblxuLy8gUHJvdmlkZXMgYSB1bmlmb3JtIHdheSBvZiBoYW5kbGluZyBlcnJvcnMgdGhhdCBhcmlzZSBmcm9tIHByb21pc2VzLlxuICAgIFxuICAgIHByb21pc2VFcnJvckhhbmRsZXIoZSkge1xuICAgICAgY29uc29sZS5sb2coZS5tZXNzYWdlLCBlLnN0YWNrKTtcbiAgICB9LFxuXG4gICAgcHJvbWlzZUFqYXgodXJsLCBvcHRpb25zID0ge30pIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgICAgICBvcHRpb25zLnN1Y2Nlc3MgPSAoZGF0YSwgc3RhdHVzLCB4aHIpID0+IHtcbiAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICBvcHRpb25zLmVycm9yID0gKHhociwgc3RhdHVzLCBlcnIpID0+IHtcbiAgICAgICAgICBsZXQgZSA9IG5ldyBFcnJvcigpO1xuICAgICAgICAgIGUuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgICAgICAgICBlLm1lc3NhZ2UgPSBlcnI7XG4gICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG4gICAgICAgICQuYWpheChvcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBwcm9taXNlUmVxdWlyZShwYXRocykge1xuICAgICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHBhdGhzID0gW3BhdGhzXTtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlcXVpcmUocGF0aHMsICguLi5yZXFzKSA9PiB7IHJlc29sdmUocmVxcyk7IH0sIChlcnIpID0+IHsgcmVqZWN0KGVycik7IH0pO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBcbi8vIGBwb3NNb2QoeCwgbilgXG5cbi8vIE1hdGhlbWF0aWNhbCBtb2QgaXMgYWx3YXlzIHBvc2l0aXZlLCBhbmQgdGhlIHZhbHVlIG9mIC0xICUgNSBzaG91bGQgYmUgNC5cbi8vIEphdmFTY3JpcHQgKGFuZCBtb3N0IG90aGVyIHByb2dyYW1taW5nIGxhbmd1YWdlcykgcmV0dXJuIGEgbmVnYXRpdmUgbnVtYmVyXG4vLyAoaW4gdGhlIHByZXZpb3VzIGV4YW1wbGUsIC0xICUgNSA9IC0xKS4gT2Z0ZW4gdGltZXMsIHBhcnRpY3VsYXJseSB3aGVuXG4vLyBjeWNsaW5nIHRocm91Z2ggYW4gYXJyYXkgb2YgaXRlbXMsIHlvdSB3YW50IHRvIHVzZSB0aGUgcG9zaXRpdmUgbW9kIHZhbHVlLFxuLy8gd2hpY2ggdGhpcyBtZXRob2QgcHJvdmlkZXMuXG4gICAgXG4gICAgcG9zTW9kKHgsIG4pIHtcbiAgICAgIHdoaWxlICh4IDwgMCkgeCArPSBuO1xuICAgICAgcmV0dXJuIHggJSBuO1xuICAgIH0sXG5cbiAgICBpc0VtcHR5KGEpIHtcbiAgICAgIHJldHVybiAhYSB8fFxuICAgICAgICAoYSBpbnN0YW5jZW9mIEFycmF5ICYmIGEubGVuZ3RoID09IDApIHx8XG4gICAgICAgICgodHlwZW9mIGEgPT0gXCJzdHJpbmdcIiB8fCBhIGluc3RhbmNlb2YgU3RyaW5nKSAmJiBhID09ICcnKVxuICAgIH0sXG5cbiAgICBcbi8vIGBzb3J0VmFsdWUoYSwgYiwgYXNjZW5kaW5nID0gdHJ1ZSlgXG5cbi8vIFByb3ZpZGVzIGEgZGVmYXVsdCBudW1lcmljIHZhbHVlIGZvciB1c2UgaW4gc29ydCBjYWxsYmFja3MuIE5vdGUgdGhhdCBhIGFuZFxuLy8gYiBuZWVkIHRvIGJlIGNvbXBhcmFibGUgdmlhIHRoZSBkZWZhdWx0IGA8YCBhbmQgYD5gIGludGVycHJldGF0aW9ucy5cbiAgICBcbiAgICBzb3J0VmFsdWUoYSwgYiwgYXNjZW5kaW5nID0gdHJ1ZSkge1xuICAgICAgbGV0IHZhbDtcbiAgICAgIGlmICgoYSA9PSB1bmRlZmluZWQgfHwgYSA9PSBudWxsKSAmJiAoYiA9PSB1bmRlZmluZWQgfHwgYiA9PSBudWxsKSkge1xuICAgICAgICB2YWwgPSAwXG4gICAgICB9IGVsc2UgaWYgKGEgPT0gdW5kZWZpbmVkIHx8IGEgPT0gbnVsbCkge1xuICAgICAgICB2YWwgPSAxXG4gICAgICB9IGVsc2UgaWYgKGIgPT0gdW5kZWZpbmVkIHx8IGIgPT0gbnVsbCkge1xuICAgICAgICB2YWwgPSAtMVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gYSA+IGIgPyAxIDogKGEgPCBiID8gLTEgOiAwKVxuICAgICAgfVxuICAgICAgaWYgKCFhc2NlbmRpbmcpIHtcbiAgICAgICAgdmFsID0gdmFsICogLTFcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWxcbiAgICB9LFxuXG4vLyBgc29ydFZhbHVlSWdub3JlQXJ0aWNsZXMoYSwgYiwgYXNjZW5kaW5nID0gdHJ1ZSlgXG5cbi8vIFByb3ZpZGVzIGEgZGVmYXVsdCBudW1lcmljIHZhbHVlIGZvciB1c2UgaW4gc29ydCBjYWxsYmFja3MuIFVubGlrZVxuLy8gYFV0aWxzLnNvcnRWYWx1ZWAsIHRoaXMgbWV0aG9kIHdpbGwgZGV0ZWN0IHN0cmluZ3MgYW5kIHdpbGwgaWdub3JlIGluaXRpYWxcbi8vIFwidGhlXCIgb3IgXCJhXCIgaW4gdGhlIHN0cmluZ3MsIGFsbG93aW5nIGZvciBlYXN5IGNvbXBhcmlzb24gb2YgdGl0bGVzLlxuICAgIFxuICAgIHNvcnRWYWx1ZUlnbm9yZUFydGljbGVzKGEsIGIsIGFzY2VuZGluZyA9IHRydWUpIHtcbiAgICAgIGlmICh0eXBlb2YgYSA9PSBcInN0cmluZ1wiIHx8IGEgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgICAgYSA9IGEucmVwbGFjZSgvXigodGhlKXxhKVxccysvaSwgXCJcIik7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGIgPT0gXCJzdHJpbmdcIiB8fCBiIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICAgIGIgPSBiLnJlcGxhY2UoL14oKHRoZSl8YSlcXHMrL2ksIFwiXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFV0aWxzLnNvcnRWYWx1ZShhLCBiLCBhc2NlbmRpbmcpO1xuICAgIH0sXG5cbiAgICB6ZXJvcGFkKHN0ciwgc2l6ZSkge1xuICAgICAgbGV0IHMgPSBzdHIgKyBcIlwiO1xuICAgICAgd2hpbGUgKHMubGVuZ3RoIDwgc2l6ZSkgcyA9IFwiMFwiICsgcztcbiAgICAgIHJldHVybiBzO1xuICAgIH0sXG5cbiAgICBpc1N0cmluZyhzKSB7XG4gICAgICByZXR1cm4gcyBpbnN0YW5jZW9mIFN0cmluZyB8fCB0eXBlb2YgcyA9PSBcInN0cmluZ1wiO1xuICAgIH0sXG5cbiAgICBpc0FycmF5KGEpIHtcbiAgICAgIHJldHVybiBhIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgfSxcblxuICAgIGlzTnVtZXJpYyh4KSB7XG4gICAgICByZXR1cm4gJC5pc051bWVyaWMoeCk7XG4gICAgfSxcblxuICAgIGlzSlNPTihzdHIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIEpTT04ucGFyc2Uoc3RyKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIGVuc3VyZUFycmF5KGEpIHtcbiAgICAgIGlmIChVdGlscy5pc0FycmF5KGEpKSB7XG4gICAgICAgIHJldHVybiBhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFthXTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xlYXJUZXh0U2VsZWN0aW9uKCkge1xuICAgICAgaWYgKGRvY3VtZW50LnNlbGVjdGlvbikge1xuICAgICAgICBkb2N1bWVudC5zZWxlY3Rpb24uZW1wdHkoKVxuICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XG4gICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBtZDUoc3RyKSB7XG4gICAgICBtZDUoc3RyKTtcbiAgICB9LFxuXG4gICAgb2JqZWN0VmFsdWVzKG9iaikge1xuICAgICAgaWYgKE9iamVjdC52YWx1ZXMpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMob2JqKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB2YWxzID0gW107XG4gICAgICAgIGZvciAobGV0IGsgaW4gb2JqKSB7XG4gICAgICAgICAgdmFscy5wdXNoKG9ialtrXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHM7XG4gICAgICB9XG4gICAgfSxcbiAgICBcbiAgICBleGlzdHModmFsKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB2YWwgIT09IG51bGw7XG4gICAgfSxcblxuICAgIGJpbmRNZXRob2RzKG9iaiwgbWV0aG9kcykge1xuICAgICAgZm9yICh2YXIgbWV0aG9kIG9mIG1ldGhvZHMpIHtcbiAgICAgICAgb2JqW21ldGhvZF0gPSBvYmpbbWV0aG9kXS5iaW5kKG9iaik7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGJpbmRBbGxNZXRob2RzKG9iaikge1xuICAgICAgdGhpcy5iaW5kTWV0aG9kcyhvYmosIE9iamVjdC5rZXlzKG9iaikuZmlsdGVyKChrZXkpID0+IHR5cGVvZiBvYmpba2V5XSA9PSBcImZ1bmN0aW9uXCIpKTtcbiAgICB9LFxuXG4gICAgc2Vjb25kc1RvVGltZVN0cmluZyhzZWNvbmRzKSB7XG4gICAgICBjb25zdCBob3VyID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gKDYwKjYwKSk7XG4gICAgICBsZXQgbWluID0gTWF0aC5mbG9vcigoc2Vjb25kcyAlICg2MCo2MCkpIC8gNjApO1xuICAgICAgbGV0IHNlYyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAlIDYwKTtcbiAgICAgIGlmIChtaW4gPCAxMCkgbWluID0gXCIwXCIgKyBtaW47XG4gICAgICBpZiAoc2VjIDwgMTApIHNlYyA9IFwiMFwiICsgc2VjO1xuICAgICAgcmV0dXJuIGAke2hvdXJ9OiR7bWlufToke3NlY31gO1xuICAgIH0sXG5cbiAgICB1cmxQYXJhbShrZXkpIHtcbiAgICAgIC8vIGh0dHA6Ly93d3cuanF1ZXJ5YnlleGFtcGxlLm5ldC8yMDEyLzA2L2dldC11cmwtcGFyYW1ldGVycy11c2luZy1qcXVlcnkuaHRtbFxuICAgICAgY29uc3QgdXJsU2VhcmNoID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7XG4gICAgICBjb25zdCB1cmxWYXJzID0gdXJsU2VhcmNoLnNwbGl0KCcmJyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVybFZhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgdmFyUGFpciA9IHVybFZhcnNbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgaWYgKHZhclBhaXJbMF0gPT0ga2V5KSByZXR1cm4gdmFyUGFpclsxXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICBtb3VzZVRvdWNoUG9zaXRpb24oanFldnQpIHtcbiAgICAgIGlmIChqcWV2dC5wYWdlWCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHg6IGpxZXZ0LnBhZ2VYLFxuICAgICAgICAgIHk6IGpxZXZ0LnBhZ2VZXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoanFldnQudHlwZS5tYXRjaCgvXnRvdWNoLykpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB4OiBqcWV2dC50b3VjaGVzWzBdLnBhZ2VYLFxuICAgICAgICAgIHk6IGpxZXZ0LnRvdWNoZXNbMF0ucGFnZVlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB4OiAwLFxuICAgICAgICAgIHk6IDBcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBvcztcbiAgICB9LFxuXG4vLyBmcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hdGgvcm91bmRcbiAgICBkZWNpbWFsQWRqdXN0KHR5cGUsIHZhbHVlLCBleHApIHtcbiAgICAgIGlmICh0eXBlb2YgZXhwID09PSAndW5kZWZpbmVkJyB8fCArZXhwID09PSAwKSB7XG4gICAgICAgIHJldHVybiBNYXRoW3R5cGVdKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHZhbHVlID0gK3ZhbHVlO1xuICAgICAgZXhwID0gK2V4cDtcbiAgICAgIGlmIChpc05hTih2YWx1ZSkgfHwgISh0eXBlb2YgZXhwID09PSAnbnVtYmVyJyAmJiBleHAgJSAxID09PSAwKSkge1xuICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlIDwgMCkge1xuICAgICAgICByZXR1cm4gLVV0aWxzLmRlY2ltYWxBZGp1c3QodHlwZSwgLXZhbHVlLCBleHApO1xuICAgICAgfVxuICAgICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnNwbGl0KCdlJyk7XG4gICAgICB2YWx1ZSA9IE1hdGhbdHlwZV0oKyh2YWx1ZVswXSArICdlJyArICh2YWx1ZVsxXSA/ICgrdmFsdWVbMV0gLSBleHApIDogLWV4cCkpKTtcbiAgICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKS5zcGxpdCgnZScpO1xuICAgICAgcmV0dXJuICsodmFsdWVbMF0gKyAnZScgKyAodmFsdWVbMV0gPyAoK3ZhbHVlWzFdICsgZXhwKSA6IGV4cCkpO1xuICAgIH0sXG5cbiAgICByb3VuZERlY2ltYWwodmFsdWUsIGV4cCkge1xuICAgICAgcmV0dXJuIFV0aWxzLmRlY2ltYWxBZGp1c3QoJ3JvdW5kJywgdmFsdWUsIGV4cCk7XG4gICAgfSxcbiAgICBjZWlsRGVjaW1hbCh2YWx1ZSwgZXhwKSB7XG4gICAgICByZXR1cm4gVXRpbHMuZGVjaW1hbEFkanVzdCgnY2VpbCcsIHZhbHVlLCBleHApO1xuICAgIH0sXG4gICAgZmxvb3JEZWNpbWFsKHZhbHVlLCBleHApIHtcbiAgICAgIHJldHVybiBVdGlscy5kZWNpbWFsQWRqdXN0KCdmbG9vcicsIHZhbHVlLCBleHApO1xuICAgIH0sXG5cbiAgICBUQVU6IDIgKiBNYXRoLlBJXG4gIH1cblxuICByZXR1cm4gVXRpbHM7XG59KTsiXX0=
