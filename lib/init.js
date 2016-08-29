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
    remarkable: "thirdparty/remarkable/remarkable.min"
  },
  // shim:
  //   "thirdparty/modernizr/modernizr-3.3.1":
  //     exports: "Modernizr"
  config: {
    text: {
      useXhr() {
        return true;
      }
    }
  }
});

require(['jquery', 'app'], ($, Main) => {
  let main = new Main($('body'));
  main.load()
    .then( () => main.init() )
    .then( () => main.run() );
  window.App = main;
});