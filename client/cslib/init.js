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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXQuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvcmUiLCJldWdsZW5hIiwidGV4dCIsImxpbmsiLCJqcXVlcnkiLCJ0aHJlZSIsIm1vZGVybml6ciIsInJlbWFya2FibGUiLCJkMyIsInNvY2tldGlvIiwiYmFiZWxQb2x5IiwiZ2Jsb2NrbHkiLCJnYmxvY2tzIiwidXNlWGhyIiwiJCIsIk1haW4iLCJtYWluIiwibG9hZCIsInRoZW4iLCJpbml0IiwicnVuIiwicmVtb3ZlIiwid2luZG93IiwiQXBwIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsUUFESTtBQUViQyxTQUFPO0FBQ0xDLFVBQU0sYUFERDtBQUVMQyxhQUFTLGdCQUZKO0FBR1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLFVBQU0saUNBYkQ7QUFjTEMsVUFBTSxpQ0FkRDtBQWVUOztBQUVBO0FBQ0E7QUFDSUMsWUFBUSxvQ0FuQkg7QUFvQlQ7QUFDSUMsV0FBTyw0QkFyQkY7QUFzQlQ7QUFDSUMsZUFBVyxzQ0F2Qk47QUF3QkxDLGdCQUFZLHNDQXhCUDtBQXlCTEMsUUFBSSxrQkF6QkM7QUEwQkxDLGNBQVUsc0NBMUJMO0FBMkJMQyxlQUFXLCtCQTNCTjtBQTRCTEMsY0FBVSwwQ0E1Qkw7QUE2QkxDLGFBQVM7QUE3QkosR0FGTTtBQWlDYjtBQUNBO0FBQ0E7QUFDQWYsVUFBUTtBQUNOSyxVQUFNO0FBQ0pXLFlBREksb0JBQ0s7QUFDUCxlQUFPLElBQVA7QUFDRDtBQUhHO0FBREE7QUFwQ0ssQ0FBZjs7QUE2Q0FqQixRQUFRLENBQUMsUUFBRCxFQUFXLEtBQVgsRUFBa0IsV0FBbEIsQ0FBUixFQUF3QyxVQUFDa0IsQ0FBRCxFQUFJQyxJQUFKLEVBQWE7QUFDbkQsTUFBSUMsT0FBTyxJQUFJRCxJQUFKLENBQVNELEVBQUUsTUFBRixDQUFULENBQVg7QUFDQUUsT0FBS0MsSUFBTCxHQUNHQyxJQURILENBQ1M7QUFBQSxXQUFNRixLQUFLRyxJQUFMLEVBQU47QUFBQSxHQURULEVBRUdELElBRkgsQ0FFUztBQUFBLFdBQU1GLEtBQUtJLEdBQUwsRUFBTjtBQUFBLEdBRlQsRUFHR0YsSUFISCxDQUdTO0FBQUEsV0FBTUosRUFBRSxTQUFGLEVBQWFPLE1BQWIsRUFBTjtBQUFBLEdBSFQ7QUFJQUMsU0FBT0MsR0FBUCxHQUFhUCxJQUFiO0FBQ0QsQ0FQRCIsImZpbGUiOiJpbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW5pdGlhbGl6YXRpb25cbi8vID09PT09PT09PT09PT09XG4vL1xuLy8gVGhpcyBmaWxlIHJ1bnMgdGhlIGluaXRpYWxpemF0aW9uIG9mIHJlcXVpcmUsIGFuZCBsb2FkcyBhbmQgcnVucyB0aGUgbWFpblxuLy8gZW50cnkgcG9pbnQgb2YgdGhlIGFwcGxpY2F0aW9uLlxuLy9cbi8vIFJlcXVpcmUgQ29uZmlndXJhdGlvblxuLy8gPT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gRm9yIGluLWRlcHRoIGRldGFpbHMgYWJvdXQgdGhlIGNvbmZpZ3VyYXRpb24gc3BlY3MsIHBsZWFzZSBzZWUgUmVxdWlyZUpTJ3Ncbi8vIFtjb25maWd1cmF0aW9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9yZXF1aXJlanMub3JnL2RvY3MvYXBpLmh0bWwjY29uZmlnKS5cbi8vIEZvciB0aGUgY3VycmVudCBwdXJwb3NlLCB3ZSB3aWxsIG9ubHkgcG9pbnQgb3V0IGl0ZW1zIG9mIGludGVyZXN0LlxuXG5yZXF1aXJlLmNvbmZpZyh7XG4gIGJhc2VVcmw6ICcvY3NsaWInLFxuICBwYXRoczoge1xuICAgIGNvcmU6IFwibW9kdWxlL2NvcmVcIixcbiAgICBldWdsZW5hOiBcIm1vZHVsZS9ldWdsZW5hXCIsXG4vLyAqIFJlcXVpcmVKUyBwbHVnaW5zXG5cbi8vICAgYHRleHRgIGlzIGEgc3VwcG9ydGVkIHBsdWdpbiBmb3IgUmVxdWlyZUpTIHRoYXQgYWxsb3dzIHRoZSBsb2FkaW5nIG9mIHRleHRcbi8vICAgZmlsZXMgYXMgYSByZXF1aXJlbWVudCBmb3IgSlMgY29kZS5cblxuLy8gICBgbGlua2AgaXMgbm90IHN1cHBvcnRlZCwgYnV0IGZ1bmN0aW9ucyBzaW1pbGFybHkgZm9yIENTUyBmaWxlcy4gTm90ZSxcbi8vICAgaG93ZXZlciwgdGhhdCB0aGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBDU1MgZmlsZXMgd2lsbCBiZSBsb2FkZWQgd2hlbiB0aGVcbi8vICAgSlMgY29kZSBpcyBydW4uIEZvciBkZXRhaWxzIG9uIHRoaXMsIHNlZSB0aGVcbi8vICAgW1JlcXVpcmVKUyBGQVFdKGh0dHA6Ly9yZXF1aXJlanMub3JnL2RvY3MvZmFxLWFkdmFuY2VkLmh0bWwjY3NzKSBvbiB0aGVcbi8vICAgdG9waWMuXG4gICAgdGV4dDogXCJ0aGlyZHBhcnR5L3JlcXVpcmUvcGx1Z2lucy90ZXh0XCIsXG4gICAgbGluazogXCJ0aGlyZHBhcnR5L3JlcXVpcmUvcGx1Z2lucy9saW5rXCIsXG4vLyAqIGBqcXVlcnlgXG5cbi8vICAgVGhlIG5hbWUgYGpxdWVyeWAgKGFsbCBsb3dlciBjYXNlKSBpcyBtYW5kYXRlZCBieSBqUXVlcnkgaXRzZWxmLCBhcyBpdFxuLy8gICBwcm92aWRlcyBpdHMgb3duIEFNRCB3cmFwcGluZy5cbiAgICBqcXVlcnk6IFwidGhpcmRwYXJ0eS9qcXVlcnkvanF1ZXJ5LTMuMC4wLm1pblwiLFxuLy8gKiBgdGhyZWVgXG4gICAgdGhyZWU6IFwidGhpcmRwYXJ0eS90aHJlZS90aHJlZS5taW5cIixcbi8vICogYE1vZGVybml6cmBcbiAgICBtb2Rlcm5penI6IFwidGhpcmRwYXJ0eS9tb2Rlcm5penIvbW9kZXJuaXpyLTMuMy4xXCIsXG4gICAgcmVtYXJrYWJsZTogXCJ0aGlyZHBhcnR5L3JlbWFya2FibGUvcmVtYXJrYWJsZS5taW5cIixcbiAgICBkMzogXCJ0aGlyZHBhcnR5L2QzL2QzXCIsXG4gICAgc29ja2V0aW86IFwidGhpcmRwYXJ0eS9zb2NrZXRfaW8vc29ja2V0LmlvLTEuNC41XCIsXG4gICAgYmFiZWxQb2x5OiBcInRoaXJkcGFydHkvYmFiZWwvcG9seWZpbGwubWluXCIsXG4gICAgZ2Jsb2NrbHk6IFwidGhpcmRwYXJ0eS9ibG9ja2x5L2Jsb2NrbHlfY29tcHJlc3NlZC5qc1wiLFxuICAgIGdibG9ja3M6IFwidGhpcmRwYXJ0eS9ibG9ja2x5L2Jsb2Nrc19jb21wcmVzc2VkLmpzXCJcbiAgfSxcbiAgLy8gc2hpbTpcbiAgLy8gICBcInRoaXJkcGFydHkvbW9kZXJuaXpyL21vZGVybml6ci0zLjMuMVwiOlxuICAvLyAgICAgZXhwb3J0czogXCJNb2Rlcm5penJcIlxuICBjb25maWc6IHtcbiAgICB0ZXh0OiB7XG4gICAgICB1c2VYaHIoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbnJlcXVpcmUoWydqcXVlcnknLCAnYXBwJywgJ2JhYmVsUG9seSddLCAoJCwgTWFpbikgPT4ge1xuICBsZXQgbWFpbiA9IG5ldyBNYWluKCQoJ2JvZHknKSk7XG4gIG1haW4ubG9hZCgpXG4gICAgLnRoZW4oICgpID0+IG1haW4uaW5pdCgpIClcbiAgICAudGhlbiggKCkgPT4gbWFpbi5ydW4oKSApXG4gICAgLnRoZW4oICgpID0+ICQoJy5sb2FkZXInKS5yZW1vdmUoKSApXG4gIHdpbmRvdy5BcHAgPSBtYWluO1xufSk7XG4iXX0=
