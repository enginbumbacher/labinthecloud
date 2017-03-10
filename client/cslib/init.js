"use strict";

// Initialization
// ==============
//
// This file runs the initialization of require, and loads and runs the main
// entry point of the application.
//
// Require Configuration
// =====================
//
// For in-depth details about the configuration specs, please see RequireJS's
// [configuration documentation](http://requirejs.org/docs/api.html#config).
// For the current purpose, we will only point out items of interest.

require.config({
  baseUrl: './cslib',
  paths: {
    core: "module/core",
    euglena: "module/euglena",
    // * RequireJS plugins

    //   `text` is a supported plugin for RequireJS that allows the loading of text
    //   files as a requirement for JS code.

    //   `link` is not supported, but functions similarly for CSS files. Note,
    //   however, that there is no guarantee that CSS files will be loaded when the
    //   JS code is run. For details on this, see the
    //   [RequireJS FAQ](http://requirejs.org/docs/faq-advanced.html#css) on the
    //   topic.
    text: "thirdparty/require/plugins/text",
    link: "thirdparty/require/plugins/link",
    // * `jquery`

    //   The name `jquery` (all lower case) is mandated by jQuery itself, as it
    //   provides its own AMD wrapping.
    jquery: "thirdparty/jquery/jquery-3.0.0.min",
    // * `three`
    three: "thirdparty/three/three.min",
    // * `Modernizr`
    modernizr: "thirdparty/modernizr/modernizr-3.3.1",
    remarkable: "thirdparty/remarkable/remarkable.min",
    d3: "thirdparty/d3/d3.min",
    socketio: "thirdparty/socket_io/socket.io-1.4.5",
    babelPoly: "thirdparty/babel/polyfill.min"
  },
  // shim:
  //   "thirdparty/modernizr/modernizr-3.3.1":
  //     exports: "Modernizr"
  config: {
    text: {
      useXhr: function useXhr() {
        return true;
      }
    }
  }
});

require(['jquery', 'app', 'babelPoly'], function ($, Main) {
  var main = new Main($('body'));
  main.load().then(function () {
    return main.init();
  }).then(function () {
    return main.run();
  });
  window.App = main;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBYUEsUUFBUSxNQUFSLENBQWU7QUFDYixXQUFTLFNBREk7QUFFYixTQUFPO0FBQ0wsVUFBTSxhQUREO0FBRUwsYUFBUyxnQkFGSjs7Ozs7Ozs7Ozs7QUFhTCxVQUFNLGlDQWJEO0FBY0wsVUFBTSxpQ0FkRDs7Ozs7QUFtQkwsWUFBUSxvQ0FuQkg7O0FBcUJMLFdBQU8sNEJBckJGOztBQXVCTCxlQUFXLHNDQXZCTjtBQXdCTCxnQkFBWSxzQ0F4QlA7QUF5QkwsUUFBSSxzQkF6QkM7QUEwQkwsY0FBVSxzQ0ExQkw7QUEyQkwsZUFBVztBQTNCTixHQUZNOzs7O0FBa0NiLFVBQVE7QUFDTixVQUFNO0FBQ0osWUFESSxvQkFDSztBQUNQLGVBQU8sSUFBUDtBQUNEO0FBSEc7QUFEQTtBQWxDSyxDQUFmOztBQTJDQSxRQUFRLENBQUMsUUFBRCxFQUFXLEtBQVgsRUFBa0IsV0FBbEIsQ0FBUixFQUF3QyxVQUFDLENBQUQsRUFBSSxJQUFKLEVBQWE7QUFDbkQsTUFBSSxPQUFPLElBQUksSUFBSixDQUFTLEVBQUUsTUFBRixDQUFULENBQVg7QUFDQSxPQUFLLElBQUwsR0FDRyxJQURILENBQ1M7QUFBQSxXQUFNLEtBQUssSUFBTCxFQUFOO0FBQUEsR0FEVCxFQUVHLElBRkgsQ0FFUztBQUFBLFdBQU0sS0FBSyxHQUFMLEVBQU47QUFBQSxHQUZUO0FBR0EsU0FBTyxHQUFQLEdBQWEsSUFBYjtBQUNELENBTkQiLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
