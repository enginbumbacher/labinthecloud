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
  baseUrl: '/cslib',
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
    d3: "thirdparty/d3/d3",
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
  }).then(function () {
    return $('.loader').remove();
  });
  window.App = main;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXQuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvcmUiLCJldWdsZW5hIiwidGV4dCIsImxpbmsiLCJqcXVlcnkiLCJ0aHJlZSIsIm1vZGVybml6ciIsInJlbWFya2FibGUiLCJkMyIsInNvY2tldGlvIiwiYmFiZWxQb2x5IiwidXNlWGhyIiwiJCIsIk1haW4iLCJtYWluIiwibG9hZCIsInRoZW4iLCJpbml0IiwicnVuIiwicmVtb3ZlIiwid2luZG93IiwiQXBwIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsUUFESTtBQUViQyxTQUFPO0FBQ0xDLFVBQU0sYUFERDtBQUVMQyxhQUFTLGdCQUZKO0FBR1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLFVBQU0saUNBYkQ7QUFjTEMsVUFBTSxpQ0FkRDtBQWVUOztBQUVBO0FBQ0E7QUFDSUMsWUFBUSxvQ0FuQkg7QUFvQlQ7QUFDSUMsV0FBTyw0QkFyQkY7QUFzQlQ7QUFDSUMsZUFBVyxzQ0F2Qk47QUF3QkxDLGdCQUFZLHNDQXhCUDtBQXlCTEMsUUFBSSxrQkF6QkM7QUEwQkxDLGNBQVUsc0NBMUJMO0FBMkJMQyxlQUFXO0FBM0JOLEdBRk07QUErQmI7QUFDQTtBQUNBO0FBQ0FiLFVBQVE7QUFDTkssVUFBTTtBQUNKUyxZQURJLG9CQUNLO0FBQ1AsZUFBTyxJQUFQO0FBQ0Q7QUFIRztBQURBO0FBbENLLENBQWY7O0FBMkNBZixRQUFRLENBQUMsUUFBRCxFQUFXLEtBQVgsRUFBa0IsV0FBbEIsQ0FBUixFQUF3QyxVQUFDZ0IsQ0FBRCxFQUFJQyxJQUFKLEVBQWE7QUFDbkQsTUFBSUMsT0FBTyxJQUFJRCxJQUFKLENBQVNELEVBQUUsTUFBRixDQUFULENBQVg7QUFDQUUsT0FBS0MsSUFBTCxHQUNHQyxJQURILENBQ1M7QUFBQSxXQUFNRixLQUFLRyxJQUFMLEVBQU47QUFBQSxHQURULEVBRUdELElBRkgsQ0FFUztBQUFBLFdBQU1GLEtBQUtJLEdBQUwsRUFBTjtBQUFBLEdBRlQsRUFHR0YsSUFISCxDQUdTO0FBQUEsV0FBTUosRUFBRSxTQUFGLEVBQWFPLE1BQWIsRUFBTjtBQUFBLEdBSFQ7QUFJQUMsU0FBT0MsR0FBUCxHQUFhUCxJQUFiO0FBQ0QsQ0FQRCIsImZpbGUiOiJpbml0LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
