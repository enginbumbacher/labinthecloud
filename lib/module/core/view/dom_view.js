// DomView
// =======
//
// Base class for HTML templated views.

import View from './view';
import $ from 'jquery';

export default class DomView extends View {
  
// `new DomView(template)`
//
// Creates a new DomView with the provided template. The template is expected to
// be one of two formats: either an HTML string, or a jQuery object.
//
// Typical class extension is as follows:
//
//       import template from 'templates/path/to/template.html'
// 
//       class ThingView extends DomView
//         constructor: () ->
//           super template
  
  constructor(tmpl) {
    super()
    this.$el = (typeof tmpl == "string" ? $($.parseHTML(tmpl)) : $(tmpl));
  }
  
  
// Public API
// ----------

// `addChild(child, destination)`
//
// Defers to the parent class (ultimately, the Parent class) to handle general
// child management, and appends the child dom to this view's dom, at the
// destination if provided.
  
  addChild(child, destination = null, index = -1) {
    super.addChild(child);
    let target = destination ? this.$el.find(destination).first() : this.$el;
    if (index == -1 || target.children().length <= index) {
      target.append(child.$dom());
    } else {
      child.$dom().insertBefore(target.children()[index]);
    }
  }

  
// `removeChild(child)`
//
// Defers to the parent class (ultimately, the Parent class) to handle general
// child management, and removes the child dom from this view's dom.
  
  removeChild(child) {
    super.removeChild(child);
    if ($.contains(this.dom(), child.dom())) {
      
// We use jQuery's detach method in order to retain any event listeners 
// the child may have set on its own dom.
      
      child.$dom().detach()
    }
  }
  
// `$dom()`
//
// Returns the jQuery object wrapped around the view's dom. Replaced the previous,
// confusing `view()` method (there was a lot of view.view()).
  
  $dom() {
    return this.$el;
  }

  
// `dom()`
//
// Returns the core DOM object of the view.
  
  dom() {
    return this.$el[0];
  }

// `show()`
//
// Reveals the dom element. Currently utilizes jQuery's own show() method.

  show() {
    this.$el.show();
  }

// `hide()`
//
// Reveals the dom element. Currently utilizes jQuery's own hide() method.

  hide() {
    this.$el.hide();
  }

// `bounds()`
//
// Returns an object containing the bounds of the element, in the following form:

//     {
//       left: (float)
//       top: (float)
//       width: (float)
//       height: (float)
//     }
  bounds() {
    let bounds = this.$el.offset();
    bounds.width = this.$el.outerWidth();
    bounds.height = this.$el.outerHeight();
    return bounds;
  }
};
