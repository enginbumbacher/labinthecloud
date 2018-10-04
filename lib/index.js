import $ from 'jquery';
import Main from 'euglena/app';
import "./lab.scss";

let app = new Main($('.litc-lab'));
app.load()
  .then( () => app.init() )
  .then( () => app.run() )
  .then( () => $('.loader').remove() );
window.App = app;
