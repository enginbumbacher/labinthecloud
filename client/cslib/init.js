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
  });
  window.App = main;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXQuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvcmUiLCJldWdsZW5hIiwidGV4dCIsImxpbmsiLCJqcXVlcnkiLCJ0aHJlZSIsIm1vZGVybml6ciIsInJlbWFya2FibGUiLCJkMyIsInNvY2tldGlvIiwiYmFiZWxQb2x5IiwidXNlWGhyIiwiJCIsIk1haW4iLCJtYWluIiwibG9hZCIsInRoZW4iLCJpbml0IiwicnVuIiwid2luZG93IiwiQXBwIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsUUFESTtBQUViQyxTQUFPO0FBQ0xDLFVBQU0sYUFERDtBQUVMQyxhQUFTLGdCQUZKO0FBR1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLFVBQU0saUNBYkQ7QUFjTEMsVUFBTSxpQ0FkRDtBQWVUOztBQUVBO0FBQ0E7QUFDSUMsWUFBUSxvQ0FuQkg7QUFvQlQ7QUFDSUMsV0FBTyw0QkFyQkY7QUFzQlQ7QUFDSUMsZUFBVyxzQ0F2Qk47QUF3QkxDLGdCQUFZLHNDQXhCUDtBQXlCTEMsUUFBSSxrQkF6QkM7QUEwQkxDLGNBQVUsc0NBMUJMO0FBMkJMQyxlQUFXO0FBM0JOLEdBRk07QUErQmI7QUFDQTtBQUNBO0FBQ0FiLFVBQVE7QUFDTkssVUFBTTtBQUNKUyxZQURJLG9CQUNLO0FBQ1AsZUFBTyxJQUFQO0FBQ0Q7QUFIRztBQURBO0FBbENLLENBQWY7O0FBMkNBZixRQUFRLENBQUMsUUFBRCxFQUFXLEtBQVgsRUFBa0IsV0FBbEIsQ0FBUixFQUF3QyxVQUFDZ0IsQ0FBRCxFQUFJQyxJQUFKLEVBQWE7QUFDbkQsTUFBSUMsT0FBTyxJQUFJRCxJQUFKLENBQVNELEVBQUUsTUFBRixDQUFULENBQVg7QUFDQUUsT0FBS0MsSUFBTCxHQUNHQyxJQURILENBQ1M7QUFBQSxXQUFNRixLQUFLRyxJQUFMLEVBQU47QUFBQSxHQURULEVBRUdELElBRkgsQ0FFUztBQUFBLFdBQU1GLEtBQUtJLEdBQUwsRUFBTjtBQUFBLEdBRlQ7QUFHQUMsU0FBT0MsR0FBUCxHQUFhTixJQUFiO0FBQ0QsQ0FORCIsImZpbGUiOiJpbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW5pdGlhbGl6YXRpb25cbi8vID09PT09PT09PT09PT09XG4vL1xuLy8gVGhpcyBmaWxlIHJ1bnMgdGhlIGluaXRpYWxpemF0aW9uIG9mIHJlcXVpcmUsIGFuZCBsb2FkcyBhbmQgcnVucyB0aGUgbWFpblxuLy8gZW50cnkgcG9pbnQgb2YgdGhlIGFwcGxpY2F0aW9uLlxuLy9cbi8vIFJlcXVpcmUgQ29uZmlndXJhdGlvblxuLy8gPT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gRm9yIGluLWRlcHRoIGRldGFpbHMgYWJvdXQgdGhlIGNvbmZpZ3VyYXRpb24gc3BlY3MsIHBsZWFzZSBzZWUgUmVxdWlyZUpTJ3Ncbi8vIFtjb25maWd1cmF0aW9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9yZXF1aXJlanMub3JnL2RvY3MvYXBpLmh0bWwjY29uZmlnKS5cbi8vIEZvciB0aGUgY3VycmVudCBwdXJwb3NlLCB3ZSB3aWxsIG9ubHkgcG9pbnQgb3V0IGl0ZW1zIG9mIGludGVyZXN0LlxuXG5yZXF1aXJlLmNvbmZpZyh7XG4gIGJhc2VVcmw6ICcvY3NsaWInLFxuICBwYXRoczoge1xuICAgIGNvcmU6IFwibW9kdWxlL2NvcmVcIixcbiAgICBldWdsZW5hOiBcIm1vZHVsZS9ldWdsZW5hXCIsXG4vLyAqIFJlcXVpcmVKUyBwbHVnaW5zXG4gICAgXG4vLyAgIGB0ZXh0YCBpcyBhIHN1cHBvcnRlZCBwbHVnaW4gZm9yIFJlcXVpcmVKUyB0aGF0IGFsbG93cyB0aGUgbG9hZGluZyBvZiB0ZXh0XG4vLyAgIGZpbGVzIGFzIGEgcmVxdWlyZW1lbnQgZm9yIEpTIGNvZGUuXG5cbi8vICAgYGxpbmtgIGlzIG5vdCBzdXBwb3J0ZWQsIGJ1dCBmdW5jdGlvbnMgc2ltaWxhcmx5IGZvciBDU1MgZmlsZXMuIE5vdGUsXG4vLyAgIGhvd2V2ZXIsIHRoYXQgdGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgQ1NTIGZpbGVzIHdpbGwgYmUgbG9hZGVkIHdoZW4gdGhlXG4vLyAgIEpTIGNvZGUgaXMgcnVuLiBGb3IgZGV0YWlscyBvbiB0aGlzLCBzZWUgdGhlXG4vLyAgIFtSZXF1aXJlSlMgRkFRXShodHRwOi8vcmVxdWlyZWpzLm9yZy9kb2NzL2ZhcS1hZHZhbmNlZC5odG1sI2Nzcykgb24gdGhlXG4vLyAgIHRvcGljLlxuICAgIHRleHQ6IFwidGhpcmRwYXJ0eS9yZXF1aXJlL3BsdWdpbnMvdGV4dFwiLFxuICAgIGxpbms6IFwidGhpcmRwYXJ0eS9yZXF1aXJlL3BsdWdpbnMvbGlua1wiLFxuLy8gKiBganF1ZXJ5YFxuICAgIFxuLy8gICBUaGUgbmFtZSBganF1ZXJ5YCAoYWxsIGxvd2VyIGNhc2UpIGlzIG1hbmRhdGVkIGJ5IGpRdWVyeSBpdHNlbGYsIGFzIGl0XG4vLyAgIHByb3ZpZGVzIGl0cyBvd24gQU1EIHdyYXBwaW5nLlxuICAgIGpxdWVyeTogXCJ0aGlyZHBhcnR5L2pxdWVyeS9qcXVlcnktMy4wLjAubWluXCIsXG4vLyAqIGB0aHJlZWBcbiAgICB0aHJlZTogXCJ0aGlyZHBhcnR5L3RocmVlL3RocmVlLm1pblwiLFxuLy8gKiBgTW9kZXJuaXpyYFxuICAgIG1vZGVybml6cjogXCJ0aGlyZHBhcnR5L21vZGVybml6ci9tb2Rlcm5penItMy4zLjFcIixcbiAgICByZW1hcmthYmxlOiBcInRoaXJkcGFydHkvcmVtYXJrYWJsZS9yZW1hcmthYmxlLm1pblwiLFxuICAgIGQzOiBcInRoaXJkcGFydHkvZDMvZDNcIixcbiAgICBzb2NrZXRpbzogXCJ0aGlyZHBhcnR5L3NvY2tldF9pby9zb2NrZXQuaW8tMS40LjVcIixcbiAgICBiYWJlbFBvbHk6IFwidGhpcmRwYXJ0eS9iYWJlbC9wb2x5ZmlsbC5taW5cIlxuICB9LFxuICAvLyBzaGltOlxuICAvLyAgIFwidGhpcmRwYXJ0eS9tb2Rlcm5penIvbW9kZXJuaXpyLTMuMy4xXCI6XG4gIC8vICAgICBleHBvcnRzOiBcIk1vZGVybml6clwiXG4gIGNvbmZpZzoge1xuICAgIHRleHQ6IHtcbiAgICAgIHVzZVhocigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxucmVxdWlyZShbJ2pxdWVyeScsICdhcHAnLCAnYmFiZWxQb2x5J10sICgkLCBNYWluKSA9PiB7XG4gIGxldCBtYWluID0gbmV3IE1haW4oJCgnYm9keScpKTtcbiAgbWFpbi5sb2FkKClcbiAgICAudGhlbiggKCkgPT4gbWFpbi5pbml0KCkgKVxuICAgIC50aGVuKCAoKSA9PiBtYWluLnJ1bigpICk7XG4gIHdpbmRvdy5BcHAgPSBtYWluO1xufSk7Il19
