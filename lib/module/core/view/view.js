// View
// ====

// A base class for all views, regardless of rendering method (e.g. html vs
// canvas).

define((require) => {
  const Parent = require('core/util/parent');

  return class View extends Parent {};
});