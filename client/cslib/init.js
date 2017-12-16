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
  /* shim:{
      "thirdparty/blockly/blockly_compressed": {
        exports: "Blockly"
      },
      "thirdparty/blockly/blocks_compressed": {
        deps: ["thirdparty/blockly/blockly_compressed"]
        exports: "Blocks"
      }
    }*/
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXQuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvcmUiLCJldWdsZW5hIiwidGV4dCIsImxpbmsiLCJqcXVlcnkiLCJ0aHJlZSIsIm1vZGVybml6ciIsInJlbWFya2FibGUiLCJkMyIsInNvY2tldGlvIiwiYmFiZWxQb2x5IiwidXNlWGhyIiwiJCIsIk1haW4iLCJtYWluIiwibG9hZCIsInRoZW4iLCJpbml0IiwicnVuIiwicmVtb3ZlIiwid2luZG93IiwiQXBwIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsUUFESTtBQUViQyxTQUFPO0FBQ0xDLFVBQU0sYUFERDtBQUVMQyxhQUFTLGdCQUZKO0FBR1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lDLFVBQU0saUNBYkQ7QUFjTEMsVUFBTSxpQ0FkRDtBQWVUOztBQUVBO0FBQ0E7QUFDSUMsWUFBUSxvQ0FuQkg7QUFvQlQ7QUFDSUMsV0FBTyw0QkFyQkY7QUFzQlQ7QUFDSUMsZUFBVyxzQ0F2Qk47QUF3QkxDLGdCQUFZLHNDQXhCUDtBQXlCTEMsUUFBSSxrQkF6QkM7QUEwQkxDLGNBQVUsc0NBMUJMO0FBMkJMQyxlQUFXO0FBM0JOLEdBRk07QUErQmI7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQWIsVUFBUTtBQUNOSyxVQUFNO0FBQ0pTLFlBREksb0JBQ0s7QUFDUCxlQUFPLElBQVA7QUFDRDtBQUhHO0FBREE7QUExQ0ssQ0FBZjs7QUFtREFmLFFBQVEsQ0FBQyxRQUFELEVBQVcsS0FBWCxFQUFrQixXQUFsQixDQUFSLEVBQXdDLFVBQUNnQixDQUFELEVBQUlDLElBQUosRUFBYTtBQUNuRCxNQUFJQyxPQUFPLElBQUlELElBQUosQ0FBU0QsRUFBRSxNQUFGLENBQVQsQ0FBWDtBQUNBRSxPQUFLQyxJQUFMLEdBQ0dDLElBREgsQ0FDUztBQUFBLFdBQU1GLEtBQUtHLElBQUwsRUFBTjtBQUFBLEdBRFQsRUFFR0QsSUFGSCxDQUVTO0FBQUEsV0FBTUYsS0FBS0ksR0FBTCxFQUFOO0FBQUEsR0FGVCxFQUdHRixJQUhILENBR1M7QUFBQSxXQUFNSixFQUFFLFNBQUYsRUFBYU8sTUFBYixFQUFOO0FBQUEsR0FIVDtBQUlBQyxTQUFPQyxHQUFQLEdBQWFQLElBQWI7QUFDRCxDQVBEIiwiZmlsZSI6ImluaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbml0aWFsaXphdGlvblxuLy8gPT09PT09PT09PT09PT1cbi8vXG4vLyBUaGlzIGZpbGUgcnVucyB0aGUgaW5pdGlhbGl6YXRpb24gb2YgcmVxdWlyZSwgYW5kIGxvYWRzIGFuZCBydW5zIHRoZSBtYWluXG4vLyBlbnRyeSBwb2ludCBvZiB0aGUgYXBwbGljYXRpb24uXG4vL1xuLy8gUmVxdWlyZSBDb25maWd1cmF0aW9uXG4vLyA9PT09PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBGb3IgaW4tZGVwdGggZGV0YWlscyBhYm91dCB0aGUgY29uZmlndXJhdGlvbiBzcGVjcywgcGxlYXNlIHNlZSBSZXF1aXJlSlMnc1xuLy8gW2NvbmZpZ3VyYXRpb24gZG9jdW1lbnRhdGlvbl0oaHR0cDovL3JlcXVpcmVqcy5vcmcvZG9jcy9hcGkuaHRtbCNjb25maWcpLlxuLy8gRm9yIHRoZSBjdXJyZW50IHB1cnBvc2UsIHdlIHdpbGwgb25seSBwb2ludCBvdXQgaXRlbXMgb2YgaW50ZXJlc3QuXG5cbnJlcXVpcmUuY29uZmlnKHtcbiAgYmFzZVVybDogJy9jc2xpYicsXG4gIHBhdGhzOiB7XG4gICAgY29yZTogXCJtb2R1bGUvY29yZVwiLFxuICAgIGV1Z2xlbmE6IFwibW9kdWxlL2V1Z2xlbmFcIixcbi8vICogUmVxdWlyZUpTIHBsdWdpbnNcblxuLy8gICBgdGV4dGAgaXMgYSBzdXBwb3J0ZWQgcGx1Z2luIGZvciBSZXF1aXJlSlMgdGhhdCBhbGxvd3MgdGhlIGxvYWRpbmcgb2YgdGV4dFxuLy8gICBmaWxlcyBhcyBhIHJlcXVpcmVtZW50IGZvciBKUyBjb2RlLlxuXG4vLyAgIGBsaW5rYCBpcyBub3Qgc3VwcG9ydGVkLCBidXQgZnVuY3Rpb25zIHNpbWlsYXJseSBmb3IgQ1NTIGZpbGVzLiBOb3RlLFxuLy8gICBob3dldmVyLCB0aGF0IHRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IENTUyBmaWxlcyB3aWxsIGJlIGxvYWRlZCB3aGVuIHRoZVxuLy8gICBKUyBjb2RlIGlzIHJ1bi4gRm9yIGRldGFpbHMgb24gdGhpcywgc2VlIHRoZVxuLy8gICBbUmVxdWlyZUpTIEZBUV0oaHR0cDovL3JlcXVpcmVqcy5vcmcvZG9jcy9mYXEtYWR2YW5jZWQuaHRtbCNjc3MpIG9uIHRoZVxuLy8gICB0b3BpYy5cbiAgICB0ZXh0OiBcInRoaXJkcGFydHkvcmVxdWlyZS9wbHVnaW5zL3RleHRcIixcbiAgICBsaW5rOiBcInRoaXJkcGFydHkvcmVxdWlyZS9wbHVnaW5zL2xpbmtcIixcbi8vICogYGpxdWVyeWBcblxuLy8gICBUaGUgbmFtZSBganF1ZXJ5YCAoYWxsIGxvd2VyIGNhc2UpIGlzIG1hbmRhdGVkIGJ5IGpRdWVyeSBpdHNlbGYsIGFzIGl0XG4vLyAgIHByb3ZpZGVzIGl0cyBvd24gQU1EIHdyYXBwaW5nLlxuICAgIGpxdWVyeTogXCJ0aGlyZHBhcnR5L2pxdWVyeS9qcXVlcnktMy4wLjAubWluXCIsXG4vLyAqIGB0aHJlZWBcbiAgICB0aHJlZTogXCJ0aGlyZHBhcnR5L3RocmVlL3RocmVlLm1pblwiLFxuLy8gKiBgTW9kZXJuaXpyYFxuICAgIG1vZGVybml6cjogXCJ0aGlyZHBhcnR5L21vZGVybml6ci9tb2Rlcm5penItMy4zLjFcIixcbiAgICByZW1hcmthYmxlOiBcInRoaXJkcGFydHkvcmVtYXJrYWJsZS9yZW1hcmthYmxlLm1pblwiLFxuICAgIGQzOiBcInRoaXJkcGFydHkvZDMvZDNcIixcbiAgICBzb2NrZXRpbzogXCJ0aGlyZHBhcnR5L3NvY2tldF9pby9zb2NrZXQuaW8tMS40LjVcIixcbiAgICBiYWJlbFBvbHk6IFwidGhpcmRwYXJ0eS9iYWJlbC9wb2x5ZmlsbC5taW5cIlxuICB9LFxuICAvKiBzaGltOntcbiAgICAgIFwidGhpcmRwYXJ0eS9ibG9ja2x5L2Jsb2NrbHlfY29tcHJlc3NlZFwiOiB7XG4gICAgICAgIGV4cG9ydHM6IFwiQmxvY2tseVwiXG4gICAgICB9LFxuICAgICAgXCJ0aGlyZHBhcnR5L2Jsb2NrbHkvYmxvY2tzX2NvbXByZXNzZWRcIjoge1xuICAgICAgICBkZXBzOiBbXCJ0aGlyZHBhcnR5L2Jsb2NrbHkvYmxvY2tseV9jb21wcmVzc2VkXCJdXG4gICAgICAgIGV4cG9ydHM6IFwiQmxvY2tzXCJcbiAgICAgIH1cbiAgICB9Ki9cbiAgLy8gICBcInRoaXJkcGFydHkvbW9kZXJuaXpyL21vZGVybml6ci0zLjMuMVwiOlxuICAvLyAgICAgZXhwb3J0czogXCJNb2Rlcm5penJcIlxuICBjb25maWc6IHtcbiAgICB0ZXh0OiB7XG4gICAgICB1c2VYaHIoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbnJlcXVpcmUoWydqcXVlcnknLCAnYXBwJywgJ2JhYmVsUG9seSddLCAoJCwgTWFpbikgPT4ge1xuICBsZXQgbWFpbiA9IG5ldyBNYWluKCQoJ2JvZHknKSk7XG4gIG1haW4ubG9hZCgpXG4gICAgLnRoZW4oICgpID0+IG1haW4uaW5pdCgpIClcbiAgICAudGhlbiggKCkgPT4gbWFpbi5ydW4oKSApXG4gICAgLnRoZW4oICgpID0+ICQoJy5sb2FkZXInKS5yZW1vdmUoKSApXG4gIHdpbmRvdy5BcHAgPSBtYWluO1xufSk7XG4iXX0=
