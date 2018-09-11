import $ from 'jquery';
import Main from 'euglena/app';

let app = new Main($('body'));
app.load()
  .then( () => app.init() )
  .then( () => app.run() )
  .then( () => $('.loader').remove() );
window.App = app;
