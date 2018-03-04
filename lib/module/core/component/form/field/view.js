define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./field.html');

  return class FieldView extends DomView {
    constructor(model, tmpl) {
      super(tmpl ? tmpl : Template);
      this._onModelChange = this._onModelChange.bind(this);

      model.addEventListener('Model.Change', this._onModelChange);
      this.$el.addClass(model.get('classes').join(' '));

      if (model.get('description')) {
        var description_style = {
          'display': 'none',
          'position': 'absolute',
          'min-width': '150px',
          'max-width': '300px',
          'min-height': '25px',
          'background-color': 'white',
          'border': '1px solid black',
          'opacity': '0.95',
          'z-index': '10',
          'text-align': 'left',
          'font-size': '12px',
          'padding': '5px'
        }


        var description = document.createElement('div');
        description.className = 'description';
        description.innerHTML = model.get('description');
        //description.innerHTML = 'test';

        this.$el[0].appendChild(description);
        this.$el.find('.description').css(description_style);


        this.$el.find('label').hover( function(e) {
                                        let posX = $(this).position().left;
                                        let posY = $(this).position().top;
                                        let height = $(this).height();
                                        let width = $(this).width();
                                        $(this).parent().find('.description').css({display:'block',
                                                                                    left: posX + width / 2,
                                                                                      top: posY + height + 5});
                                      },
                                      function(){
                                        $(this).parent().find('.description').css({'display':'none'});
                                      }
                                    ).bind(this);
      }


    }

    _displayMessage(activate) {
      console.log('here')
    }


    _onModelChange(evt) {
      switch (evt.data.path) {
        case "disabled":
          if (evt.data.value) {
            this.disable()
          } else {
            this.enable()
          }
          break;
      }
    }

    focus() {}

    disable() {}

    enable() {}
  }
});
