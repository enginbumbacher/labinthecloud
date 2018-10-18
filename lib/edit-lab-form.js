import $ from 'jquery';
import Main from 'admin/lab/app';

let app = new Main($('.edit-lab-form__container'));
app.load()
  .then( () => app.init() )
  .then( () => app.run() );
window.App = app;
