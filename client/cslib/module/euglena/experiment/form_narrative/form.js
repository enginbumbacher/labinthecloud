'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals');
  var Form = require('core/component/form/form'),
      Button = require('core/component/button/field'),
      ExpProtocol = require('./expprotocol/field'),
      Utils = require('core/util/utils');

  return function (_Form) {
    _inherits(ExperimentForm, _Form);

    function ExperimentForm() {
      _classCallCheck(this, ExperimentForm);

      var buttons = [Button.create({
        id: 'submit',
        label: 'Submit',
        classes: ['form__experiment__submit'],
        eventName: 'Experiment.Submit'
      }), Button.create({
        id: 'aggregate',
        label: 'Add Results to Aggregate',
        classes: ['form__experiment__aggregate'],
        eventName: 'Experiment.AddToAggregate'
      })];
      if (Globals.get('AppConfig.system.experimentModality').match('create')) {
        buttons.splice(2, 0, Button.create({
          id: 'new',
          label: 'New Experiment',
          classes: ['form__experiment__new'],
          eventName: 'Experiment.NewRequest'
        }));
      }

      var _this = _possibleConstructorReturn(this, (ExperimentForm.__proto__ || Object.getPrototypeOf(ExperimentForm)).call(this, {
        modelData: {
          id: "experiment",
          classes: ["form__experiment"],
          fields: [ExpProtocol.create({
            id: "exp_category",
            description: "1. Variable to be changed:",
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'brightness': 'Brightness of the light', 'direction': 'Direction of the light' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_procedure",
            description: { 'default_choice': '2. Decide on the previous questions first.', 'brightness': "2. Procedure for changing the brightness:",
              'direction': "2. Procedure for changing the direction:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'brightness_increase': 'Gradually increase the brightness', 'brightness_decrease': 'Gradually decrease the brightness',
              'direction_around': 'Make the light go around', 'direction_hold': 'Keep one direction', 'direction_alternate': 'Alternate between two directions' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_holdconstant",
            description: { 'default_choice': '3. Decide on the previous questions first.', 'brightness': "3. Fix the direction of light to:",
              'direction': "3. Fix the brightness of light to:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? { 'direction_brightness_default_choice': 'please choose one', 'direction_25': 'dim', 'direction_50': 'medium', 'direction_100': 'bright',
              'brightness_alldir': 'from all directions', 'brightness_left': 'from the left', 'brightness_top': 'from the top', 'brightness_right': 'from the right', 'brightness_bottom': 'from the bottom' } : { 'direction_brightness_default_choice': 'please choose one', 'direction_25': 'dim', 'direction_50': 'medium', 'direction_100': 'bright',
              'brightness_left': 'from the left', 'brightness_top': 'from the top', 'brightness_right': 'from the right', 'brightness_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_firstlight",
            description: { 'default_choice': '4. Decide on the previous questions first.', 'brightness': "4. Brightness start setting:",
              'direction': "4. Direction start setting:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? { 'direction_brightness_default_choice': 'please choose one', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
              'direction_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_topleft': 'from the top-left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' } : { 'direction_brightness_default_choice': 'please choose one', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright', 'direction_left': 'from the left', 'direction_top': 'from the top',
              'direction_right': 'from the right', 'direction_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_secondlight",
            description: { 'default_choice': '5. Decide on the previous questions first.', 'brightness': "5. Brightness second setting:", 'direction': "5. Direction second setting:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
              'direction_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' } : { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
              'direction_left': 'from the left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_lightduration",
            description: { 'default_choice': '6. Decide on the previous questions first.', 'brightness': "6. Time per setting:", 'direction': "6. Time per setting:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'brightness_direction_15on': 'alternate 15 seconds on' }, //'brightness_direction_30on': 'each 30 seconds on'
            validation: {}
          })],
          buttons: buttons
        }
      }));

      _this.chainOfActivation = {
        'fullChainOfActivation': { "exp_category": "exp_procedure", "exp_procedure": "exp_holdconstant", "exp_holdconstant": "exp_firstlight", "exp_firstlight": "exp_secondlight", "exp_secondlight": "exp_lightduration" },
        'partialChainOfActivation': { "exp_category": "exp_procedure", "exp_procedure": "exp_holdconstant", "exp_holdconstant": "exp_firstlight" }
      };
      _this.chainState = 'fullChainOfActivation';

      Utils.bindMethods(_this, ['_updateFormViews', 'setState', 'validate', 'getLightConfiguration']);
      _this.addEventListener('Form.FieldChanged', _this._updateFormViews);
      _this.setState('new');
      return _this;
    }

    _createClass(ExperimentForm, [{
      key: 'validate',
      value: function validate() {

        switch (this.chainState) {
          case 'fullChainOfActivation':
            this._model._data.regions.default.forEach(function (field, index) {
              field.updateValidation({ custom: {
                  test: 'custom',
                  fn: function fn(val) {
                    if (val.match('default')) {
                      return Promise.resolve(false);
                    } else {
                      return Promise.resolve(true);
                    }
                  },
                  errorMessage: "You have to choose valid options for the " + (1 + index) + "th field."
                } });
            });
            break;
          case 'partialChainOfActivation':
            this._model._data.regions.default.forEach(function (field, index) {
              if (field.id() != 'exp_secondlight' & field.id() != 'exp_lightduration') {
                field.updateValidation({ custom: {
                    test: 'custom',
                    fn: function fn(val) {
                      if (val.match('default')) {
                        return Promise.resolve(false);
                      } else {
                        return Promise.resolve(true);
                      }
                    },
                    errorMessage: "You have to choose valid options for the " + (1 + index) + "th field."
                  } });
              } else {
                field.updateValidation({});
              }
            });
            break;
        }

        return this._model.validate();
      }
    }, {
      key: 'export',
      value: function _export() {
        var lightConfig = this.getLightConfiguration();
        return { lights: lightConfig['lights'], expForm: _get(ExperimentForm.prototype.__proto__ || Object.getPrototypeOf(ExperimentForm.prototype), 'export', this).call(this) };
      }
    }, {
      key: 'import',
      value: function _import(data) {
        var _this2 = this;

        return this.clear().then(function () {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = _this2._model.getFields()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var field = _step.value;

              if (data[field.id()] !== undefined) {
                field.setValue(data[field.id()]);
                if (data[field.id()] == 'direction_brightness_default_choice') {
                  field.setVisibility('hidden', 0);
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        });
      }
    }, {
      key: 'setState',
      value: function setState(state) {
        switch (state) {
          case "historical":
            this.state = 'historical';
            switch (Globals.get('AppConfig.system.experimentModality').toLowerCase()) {
              case "observe":
                this._model._data.regions.default.forEach(function (field) {
                  field.disable();
                });
                this.getButton('submit').view().hide();
                if (Globals.get('State.experiment.allowNew')) {
                  this.getButton('new').view().hide();
                }
                this.getButton('aggregate').view().hide();
                break;
              case "explore":
                this._model._data.regions.default.forEach(function (field) {
                  field.disable();
                });
                this.getButton('submit').view().hide();
                if (Globals.get('State.experiment.allowNew')) {
                  this.getButton('new').view().hide();
                }
                this.getButton('aggregate').view().hide();
                break;
              case "create":
              case "createandhistory":
                this._model._data.regions.default.forEach(function (field) {
                  field.disable();
                });
                this.getButton('submit').view().hide();
                if (Globals.get('State.experiment.allowNew')) {
                  this.getButton('new').view().show();
                }
                if (Globals.get('AppConfig.aggregate')) {
                  this.getButton('aggregate').view().show();
                } else {
                  this.getButton('aggregate').view().hide();
                }
                break;
            }
            break;
          case "new":
            this.state = 'new';
            this._model._data.regions.default.forEach(function (field) {
              if (field.id() == 'exp_category') {
                field.enable();
                field.setVisibility('visible');
                field.setDefault();
              } else {
                field.disable();
                field.setVisibility('hidden', 0);
                field.setDefault();
              }
            });
            this.getButton('submit').view().show();
            if (Globals.get('State.experiment.allowNew')) {
              this.getButton('new').view().hide();
            }
            this.getButton('aggregate').view().hide();
            break;
        }
      }
    }, {
      key: 'disableNew',
      value: function disableNew() {
        var newBtn = this.getButton('new');
        if (newBtn) {
          newBtn.disable();
        }
      }
    }, {
      key: 'enableNew',
      value: function enableNew() {
        var newBtn = this.getButton('new');
        if (newBtn) {
          newBtn.enable();
        }
      }
    }, {
      key: 'getLightConfiguration',
      value: function getLightConfiguration() {
        var _this3 = this;

        // Translate fields into [{"left": 100, "right": 0, "top": 0, "bottom": 100, "duration": 15}, ...]
        var defaultCounter = 0;
        this.expProtocol = {};
        this._model._data.regions.default.forEach(function (field, index) {
          _this3.expProtocol[field.id()] = field.value();
          defaultCounter = field.value() == 'direction_brightness_default_choice' ? defaultCounter + 1 : defaultCounter;
        });

        var configState = false;
        if (defaultCounter < 3) {
          configState = true;
        }

        var lightConfig = {};
        lightConfig['brightness'] = Array(4).fill(-1);
        lightConfig['lights'] = [];
        for (var panel = 0; panel < 4; panel++) {
          lightConfig['lights'].push({ 'left': 0, 'top': 0, 'right': 0, 'bottom': 0, 'duration': 15 });
        }

        if (configState) {
          var lightDirections = ['left', 'top', 'right', 'bottom'];

          // Extract the fixed value
          if (this.expProtocol['exp_holdconstant'] == 'direction_brightness_default_choice') {
            console.log('there is a problem');
          }
          if (this.expProtocol['exp_holdconstant'].match('direction')) {
            lightConfig['brightness'] = Array(4).fill().map(function () {
              return parseInt(this.expProtocol['exp_holdconstant'].match(/\d+/)[0]);
            }, this);
          } else if (this.expProtocol['exp_holdconstant'].match('brightness')) {
            (function () {
              var substr = _this3.expProtocol['exp_holdconstant'].lastIndexOf('_');
              substr = _this3.expProtocol['exp_holdconstant'].substr(substr + 1);

              var _loop = function _loop(_panel) {
                lightDirections.forEach(function (direction) {
                  return lightConfig['lights'][_panel][direction] = substr.match('alldir|' + direction) ? 100 : 0;
                });
              };

              for (var _panel = 0; _panel < 4; _panel++) {
                _loop(_panel);
              }
            })();
          }

          // Modify all panels
          var lightSuccessions = { 'left': 'top', 'top': 'right', 'right': 'bottom', 'bottom': 'left', 'topleft': 'topright', 'topright': 'bottomright', 'bottomright': 'bottomleft', 'bottomleft': 'topleft' };
          var firstBrightness = null;
          var secondBrightness = null;

          if (this.chainState == 'partialChainOfActivation' & !(this.expProtocol['exp_firstlight'] == 'direction_brightness_default_choice')) {

            switch (this.expProtocol['exp_procedure']) {
              case 'brightness_increase':
                firstBrightness = parseInt(this.expProtocol['exp_firstlight'].match(/\d+/)[0]);

                var _loop2 = function _loop2(_panel2) {
                  lightConfig['brightness'][_panel2] = firstBrightness + 25 * _panel2;
                  lightDirections.forEach(function (direction) {
                    return lightConfig['lights'][_panel2][direction] = lightConfig['lights'][_panel2][direction] > 0 ? lightConfig['brightness'][_panel2] : 0;
                  });
                };

                for (var _panel2 = 0; _panel2 < 4; _panel2++) {
                  _loop2(_panel2);
                }
                break;
              case 'brightness_decrease':
                firstBrightness = parseInt(this.expProtocol['exp_firstlight'].match(/\d+/)[0]);

                var _loop3 = function _loop3(_panel3) {
                  lightConfig['brightness'][_panel3] = firstBrightness - 25 * _panel3;
                  lightDirections.forEach(function (direction) {
                    return lightConfig['lights'][_panel3][direction] = lightConfig['lights'][_panel3][direction] > 0 ? lightConfig['brightness'][_panel3] : 0;
                  });
                };

                for (var _panel3 = 0; _panel3 < 4; _panel3++) {
                  _loop3(_panel3);
                }
                break;
              case 'brightness_hold':
                firstBrightness = parseInt(this.expProtocol['exp_firstlight'].match(/\d+/)[0]);

                var _loop4 = function _loop4(_panel4) {
                  lightConfig['brightness'][_panel4] = firstBrightness;
                  lightDirections.forEach(function (direction) {
                    return lightConfig['lights'][_panel4][direction] = lightConfig['lights'][_panel4][direction] > 0 ? lightConfig['brightness'][_panel4] : 0;
                  });
                };

                for (var _panel4 = 0; _panel4 < 4; _panel4++) {
                  _loop4(_panel4);
                }
                break;
              case 'direction_around':
                var currLight = this.expProtocol['exp_firstlight'].lastIndexOf('_');
                currLight = this.expProtocol['exp_firstlight'].substr(currLight + 1);

                var _loop5 = function _loop5(_panel5) {
                  lightDirections.forEach(function (direction) {
                    return lightConfig['lights'][_panel5][direction] = currLight.match(direction) ? lightConfig['brightness'][_panel5] : 0;
                  });
                  currLight = lightSuccessions[currLight];
                };

                for (var _panel5 = 0; _panel5 < 4; _panel5++) {
                  _loop5(_panel5);
                }
                break;
              case 'direction_hold':
                var currLight = this.expProtocol['exp_firstlight'].lastIndexOf('_');
                currLight = this.expProtocol['exp_firstlight'].substr(currLight + 1);

                var _loop6 = function _loop6(_panel6) {
                  lightDirections.forEach(function (direction) {
                    return lightConfig['lights'][_panel6][direction] = currLight.match('alldir|' + direction) ? lightConfig['brightness'][_panel6] : 0;
                  });
                  if (currLight == '0') lightConfig['brightness'][_panel6] = 0;
                };

                for (var _panel6 = 0; _panel6 < 4; _panel6++) {
                  _loop6(_panel6);
                }
                break;
            }
          } else {
            // if is alternating

            // Modify the first panel
            if (!(this.expProtocol['exp_firstlight'] == 'direction_brightness_default_choice')) {
              if (this.expProtocol['exp_firstlight'].match('brightness')) {
                lightConfig['brightness'][0] = parseInt(this.expProtocol['exp_firstlight'].match(/\d+/)[0]);
                lightDirections.forEach(function (direction) {
                  return lightConfig['lights'][0][direction] = lightConfig['lights'][0][direction] > 0 ? lightConfig['brightness'][0] : 0;
                });
              } else if (this.expProtocol['exp_firstlight'].match('direction')) {
                lightDirections.forEach(function (direction) {
                  return lightConfig['lights'][0][direction] = _this3.expProtocol['exp_firstlight'].match('alldir|' + direction) ? lightConfig['brightness'][0] : 0;
                });
              }
            }

            // Modify the remaining panels
            if (!(this.expProtocol['exp_secondlight'] == 'direction_brightness_default_choice') & !(this.expProtocol['exp_lightduration'] == 'direction_brightness_default_choice')) {
              var modifySecondLight = [];
              switch (this.expProtocol['exp_lightduration']) {
                case 'brightness_direction_15on':
                  lightConfig['lights'][2] = lightConfig['lights'][0];
                  lightConfig['brightness'][2] = lightConfig['brightness'][0];
                  modifySecondLight = [1, 3];
                  break;
                case 'brightness_direction_15onoff':
                  var lights = { 'duration': 15 };
                  lightDirections.forEach(function (direction) {
                    return lights[direction] = 0;
                  });
                  lightConfig['lights'][1] = lights;
                  lightConfig['brightness'][1] = 0;
                  lightConfig['lights'][3] = lightConfig['lights'][1];
                  lightConfig['brightness'][3] = lightConfig['brightness'][1];
                  modifySecondLight = [2];
                  break;
                case 'brightness_direction_30on':
                  lightConfig['lights'][1] = lightConfig['lights'][0];
                  lightConfig['brightness'][1] = lightConfig['brightness'][0];
                  modifySecondLight = [2, 3];
                  break;
              }

              if (this.expProtocol['exp_secondlight'].match('brightness')) {
                lightConfig['brightness'][modifySecondLight[0]] = parseInt(this.expProtocol['exp_secondlight'].match(/\d+/)[0]);
                lightDirections.forEach(function (direction) {
                  return lightConfig['lights'][modifySecondLight[0]][direction] = lightConfig['lights'][modifySecondLight[0]][direction] > 0 ? lightConfig['brightness'][modifySecondLight[0]] : 0;
                });
              } else if (this.expProtocol['exp_secondlight'].match('direction')) {
                lightDirections.forEach(function (direction) {
                  return lightConfig['lights'][modifySecondLight[0]][direction] = _this3.expProtocol['exp_secondlight'].match('alldir|' + direction) ? lightConfig['brightness'][modifySecondLight[0]] : 0;
                });
              }

              if (modifySecondLight.length > 1) {
                lightConfig['lights'][modifySecondLight[1]] = lightConfig['lights'][modifySecondLight[0]];
                lightConfig['brightness'][modifySecondLight[1]] = lightConfig['brightness'][modifySecondLight[0]];
              }
            }
          }
        }
        return lightConfig;
      }
    }, {
      key: '_updateFormViews',
      value: function _updateFormViews(evt) {
        var _this4 = this;

        if (evt.data.field._model._data.id == 'exp_category') {
          this._model._data.regions.default.forEach(function (field, index) {
            if (field.id() != 'exp_category') {
              field.showDescription(evt.data.delta.value.match('default_choice') ? 'default_choice' : evt.data.delta.value);
              if (_this4.state == 'new') {
                field.disable();
                field.setVisibility('hidden', 0);
                field.setDefault();
              }

              _this4._modifyOptions(field, evt.data.delta.value);
            } else {
              // if it is exp_category
              field.showDescription();
            }
          });

          this.chainState = 'fullChainOfActivation';
        } else if (evt.data.field._model._data.id == 'exp_procedure') {
          // The chosen procedure determines what fields to show

          //Disable options of exp_firstlight depending on what has been chose
          var field_firstlight = this._findField('exp_firstlight');
          switch (evt.data.delta.value) {
            case 'brightness_decrease':
              this._modifyOptions(field_firstlight, 'brightness_100');
              this.chainState = 'partialChainOfActivation';
              break;
            case 'brightness_increase':
              this._modifyOptions(field_firstlight, 'brightness_25');
              this.chainState = 'partialChainOfActivation';
              break;
            case 'direction_around':
              this._modifyOptions(field_firstlight, '_left|_topleft');
              this.chainState = 'partialChainOfActivation';
              break;
            case 'brightness_alternate':
              this._modifyOptions(field_firstlight, 'brightness');
              this.chainState = 'fullChainOfActivation';
              break;
            case 'brightness_hold':
              this._modifyOptions(field_firstlight, 'brightness');
              this.chainState = 'partialChainOfActivation';
              break;
            case 'direction_alternate':
              this._modifyOptions(field_firstlight, 'direction');
              this.chainState = 'fullChainOfActivation';
              break;
            case 'direction_hold':
              this._modifyOptions(field_firstlight, 'direction', '_topleft');
              this.chainState = 'partialChainOfActivation';
              break;
          }

          // Re-initialize successive fields
          this._model._data.regions.default.forEach(function (field, index) {
            if (field.id() != 'exp_category' & field.id() != 'exp_procedure' & _this4.state == 'new') {
              field.disable();
              field.setVisibility('hidden', 0);
              field.setDefault();
            }
          });
        }
        // Is the next field activated?
        var nextField = this._findField(this.chainOfActivation[this.chainState][evt.data.field._model._data.id]);
        if (nextField ? !nextField.isVisible() : false) {
          nextField.setVisibility('visible');
          nextField.enable();

          var nextnextField = this._findField(this.chainOfActivation[this.chainState][nextField.id()]);
          if (nextnextField) {
            nextnextField.setVisibility('hidden', 0.3);
          }
        }
      }
    }, {
      key: '_findField',
      value: function _findField(fieldId) {
        var field = null;
        for (var cntr = 0; cntr < this._model._data.regions.default.length; cntr++) {
          if (this._model._data.regions.default[cntr].id() == fieldId) {
            field = this._model._data.regions.default[cntr];
            break;
          }
        }
        return field;
      }
    }, {
      key: '_modifyOptions',
      value: function _modifyOptions(field, criteria) {
        var additionallyDisable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        Object.keys(field.getOptions()).forEach(function (choice) {
          if ((choice.match(additionallyDisable) || !choice.match(criteria)) && !choice.match('direction_brightness_default_choice')) {
            field.disableOption(choice);
          } else {
            field.enableOption(choice);
          }
        });
      }
    }]);

    return ExperimentForm;
  }(Form);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkZvcm0iLCJCdXR0b24iLCJFeHBQcm90b2NvbCIsIlV0aWxzIiwiYnV0dG9ucyIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiZ2V0IiwibWF0Y2giLCJzcGxpY2UiLCJtb2RlbERhdGEiLCJmaWVsZHMiLCJkZXNjcmlwdGlvbiIsImRlZmF1bHRWYWx1ZSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uIiwiY2hhaW5PZkFjdGl2YXRpb24iLCJjaGFpblN0YXRlIiwiYmluZE1ldGhvZHMiLCJhZGRFdmVudExpc3RlbmVyIiwiX3VwZGF0ZUZvcm1WaWV3cyIsInNldFN0YXRlIiwiX21vZGVsIiwiX2RhdGEiLCJyZWdpb25zIiwiZGVmYXVsdCIsImZvckVhY2giLCJmaWVsZCIsImluZGV4IiwidXBkYXRlVmFsaWRhdGlvbiIsImN1c3RvbSIsInRlc3QiLCJmbiIsInZhbCIsIlByb21pc2UiLCJyZXNvbHZlIiwiZXJyb3JNZXNzYWdlIiwidmFsaWRhdGUiLCJsaWdodENvbmZpZyIsImdldExpZ2h0Q29uZmlndXJhdGlvbiIsImxpZ2h0cyIsImV4cEZvcm0iLCJkYXRhIiwiY2xlYXIiLCJ0aGVuIiwiZ2V0RmllbGRzIiwidW5kZWZpbmVkIiwic2V0VmFsdWUiLCJzZXRWaXNpYmlsaXR5Iiwic3RhdGUiLCJ0b0xvd2VyQ2FzZSIsImRpc2FibGUiLCJnZXRCdXR0b24iLCJ2aWV3IiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJzZXREZWZhdWx0IiwibmV3QnRuIiwiZGVmYXVsdENvdW50ZXIiLCJleHBQcm90b2NvbCIsInZhbHVlIiwiY29uZmlnU3RhdGUiLCJBcnJheSIsImZpbGwiLCJwYW5lbCIsInB1c2giLCJsaWdodERpcmVjdGlvbnMiLCJjb25zb2xlIiwibG9nIiwibWFwIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImRpcmVjdGlvbiIsImxpZ2h0U3VjY2Vzc2lvbnMiLCJmaXJzdEJyaWdodG5lc3MiLCJzZWNvbmRCcmlnaHRuZXNzIiwiY3VyckxpZ2h0IiwibW9kaWZ5U2Vjb25kTGlnaHQiLCJsZW5ndGgiLCJldnQiLCJzaG93RGVzY3JpcHRpb24iLCJkZWx0YSIsIl9tb2RpZnlPcHRpb25zIiwiZmllbGRfZmlyc3RsaWdodCIsIl9maW5kRmllbGQiLCJuZXh0RmllbGQiLCJpc1Zpc2libGUiLCJuZXh0bmV4dEZpZWxkIiwiZmllbGRJZCIsImNudHIiLCJjcml0ZXJpYSIsImFkZGl0aW9uYWxseURpc2FibGUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsImNob2ljZSIsImRpc2FibGVPcHRpb24iLCJlbmFibGVPcHRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQ0EsTUFBTUUsT0FBT0YsUUFBUSwwQkFBUixDQUFiO0FBQUEsTUFDRUcsU0FBU0gsUUFBUSw2QkFBUixDQURYO0FBQUEsTUFFRUksY0FBY0osUUFBUSxxQkFBUixDQUZoQjtBQUFBLE1BR0VLLFFBQVFMLFFBQVEsaUJBQVIsQ0FIVjs7QUFNQTtBQUFBOztBQUNFLDhCQUFjO0FBQUE7O0FBQ1osVUFBTU0sVUFBVSxDQUFDSCxPQUFPSSxNQUFQLENBQWM7QUFDN0JDLFlBQUksUUFEeUI7QUFFN0JDLGVBQU8sUUFGc0I7QUFHN0JDLGlCQUFTLENBQUMsMEJBQUQsQ0FIb0I7QUFJN0JDLG1CQUFXO0FBSmtCLE9BQWQsQ0FBRCxFQUtaUixPQUFPSSxNQUFQLENBQWM7QUFDaEJDLFlBQUksV0FEWTtBQUVoQkMsZUFBTywwQkFGUztBQUdoQkMsaUJBQVMsQ0FBQyw2QkFBRCxDQUhPO0FBSWhCQyxtQkFBVztBQUpLLE9BQWQsQ0FMWSxDQUFoQjtBQVdBLFVBQUlWLFFB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ZW50L2Zvcm1fbmFycmF0aXZlL2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuICBjb25zdCBGb3JtID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9mb3JtJyksXG4gICAgQnV0dG9uID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkJyksXG4gICAgRXhwUHJvdG9jb2wgPSByZXF1aXJlKCcuL2V4cHByb3RvY29sL2ZpZWxkJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIEV4cGVyaW1lbnRGb3JtIGV4dGVuZHMgRm9ybSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBjb25zdCBidXR0b25zID0gW0J1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ3N1Ym1pdCcsXG4gICAgICAgIGxhYmVsOiAnU3VibWl0JyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19leHBlcmltZW50X19zdWJtaXQnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5TdWJtaXQnXG4gICAgICB9KSwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnYWdncmVnYXRlJyxcbiAgICAgICAgbGFiZWw6ICdBZGQgUmVzdWx0cyB0byBBZ2dyZWdhdGUnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX2FnZ3JlZ2F0ZSddLFxuICAgICAgICBldmVudE5hbWU6ICdFeHBlcmltZW50LkFkZFRvQWdncmVnYXRlJ1xuICAgICAgfSldO1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpLm1hdGNoKCdjcmVhdGUnKSkge1xuICAgICAgICBidXR0b25zLnNwbGljZSgyLCAwLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgICBpZDogJ25ldycsXG4gICAgICAgICAgbGFiZWw6ICdOZXcgRXhwZXJpbWVudCcsXG4gICAgICAgICAgY2xhc3NlczogWydmb3JtX19leHBlcmltZW50X19uZXcnXSxcbiAgICAgICAgICBldmVudE5hbWU6ICdFeHBlcmltZW50Lk5ld1JlcXVlc3QnXG4gICAgICAgIH0pKTtcbiAgICAgIH1cblxuICAgICAgc3VwZXIoe1xuICAgICAgICBtb2RlbERhdGE6IHtcbiAgICAgICAgICBpZDogXCJleHBlcmltZW50XCIsXG4gICAgICAgICAgY2xhc3NlczogW1wiZm9ybV9fZXhwZXJpbWVudFwiXSxcbiAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9jYXRlZ29yeVwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCIxLiBWYXJpYWJsZSB0byBiZSBjaGFuZ2VkOlwiLFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2JyaWdodG5lc3MnOiAnQnJpZ2h0bmVzcyBvZiB0aGUgbGlnaHQnLCAnZGlyZWN0aW9uJzogJ0RpcmVjdGlvbiBvZiB0aGUgbGlnaHQnfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX3Byb2NlZHVyZVwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICcyLiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiMi4gUHJvY2VkdXJlIGZvciBjaGFuZ2luZyB0aGUgYnJpZ2h0bmVzczpcIixcbiAgICAgICAgICAgICAgJ2RpcmVjdGlvbic6IFwiMi4gUHJvY2VkdXJlIGZvciBjaGFuZ2luZyB0aGUgZGlyZWN0aW9uOlwifSxcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdicmlnaHRuZXNzX2luY3JlYXNlJzogJ0dyYWR1YWxseSBpbmNyZWFzZSB0aGUgYnJpZ2h0bmVzcycsICdicmlnaHRuZXNzX2RlY3JlYXNlJzogJ0dyYWR1YWxseSBkZWNyZWFzZSB0aGUgYnJpZ2h0bmVzcycsXG4gICAgICAgICAgICAgICdkaXJlY3Rpb25fYXJvdW5kJzogJ01ha2UgdGhlIGxpZ2h0IGdvIGFyb3VuZCcsICdkaXJlY3Rpb25faG9sZCc6ICdLZWVwIG9uZSBkaXJlY3Rpb24nLCAnZGlyZWN0aW9uX2FsdGVybmF0ZSc6ICdBbHRlcm5hdGUgYmV0d2VlbiB0d28gZGlyZWN0aW9ucyd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfaG9sZGNvbnN0YW50XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7J2RlZmF1bHRfY2hvaWNlJzogJzMuIERlY2lkZSBvbiB0aGUgcHJldmlvdXMgcXVlc3Rpb25zIGZpcnN0LicsICdicmlnaHRuZXNzJzogXCIzLiBGaXggdGhlIGRpcmVjdGlvbiBvZiBsaWdodCB0bzpcIixcbiAgICAgICAgICAgICAgJ2RpcmVjdGlvbic6IFwiMy4gRml4IHRoZSBicmlnaHRuZXNzIG9mIGxpZ2h0IHRvOlwifSxcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmZvcm1PcHRpb25zJykgPT0gJ2NvbXBsZXRlJyA/IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnZGlyZWN0aW9uXzI1JzogJ2RpbScsICdkaXJlY3Rpb25fNTAnOiAnbWVkaXVtJywgJ2RpcmVjdGlvbl8xMDAnOiAnYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdicmlnaHRuZXNzX2FsbGRpcic6ICdmcm9tIGFsbCBkaXJlY3Rpb25zJywgJ2JyaWdodG5lc3NfbGVmdCc6ICdmcm9tIHRoZSBsZWZ0JywgJ2JyaWdodG5lc3NfdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdicmlnaHRuZXNzX3JpZ2h0JzogJ2Zyb20gdGhlIHJpZ2h0JywnYnJpZ2h0bmVzc19ib3R0b20nOiAnZnJvbSB0aGUgYm90dG9tJ30gOlxuICAgICAgICAgICAgICAgICAgICAgICAgeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdkaXJlY3Rpb25fMjUnOiAnZGltJywgJ2RpcmVjdGlvbl81MCc6ICdtZWRpdW0nLCAnZGlyZWN0aW9uXzEwMCc6ICdicmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JyaWdodG5lc3NfbGVmdCc6ICdmcm9tIHRoZSBsZWZ0JywgJ2JyaWdodG5lc3NfdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdicmlnaHRuZXNzX3JpZ2h0JzogJ2Zyb20gdGhlIHJpZ2h0JywnYnJpZ2h0bmVzc19ib3R0b20nOiAnZnJvbSB0aGUgYm90dG9tJ30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9maXJzdGxpZ2h0XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7J2RlZmF1bHRfY2hvaWNlJzogJzQuIERlY2lkZSBvbiB0aGUgcHJldmlvdXMgcXVlc3Rpb25zIGZpcnN0LicsICdicmlnaHRuZXNzJzogXCI0LiBCcmlnaHRuZXNzIHN0YXJ0IHNldHRpbmc6XCIsXG4gICAgICAgICAgICAgICdkaXJlY3Rpb24nOiBcIjQuIERpcmVjdGlvbiBzdGFydCBzZXR0aW5nOlwifSxcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmZvcm1PcHRpb25zJykgPT0gJ2NvbXBsZXRlJyA/IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzc18yNSc6ICdkaW0nLCAnYnJpZ2h0bmVzc181MCc6ICdtZWRpdW0nLCAnYnJpZ2h0bmVzc18xMDAnOiAnYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fYWxsZGlyJzogJ2Zyb20gYWxsIGRpcmVjdGlvbnMnLCAnZGlyZWN0aW9uX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdkaXJlY3Rpb25fdG9wbGVmdCc6ICdmcm9tIHRoZSB0b3AtbGVmdCcsICdkaXJlY3Rpb25fdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdkaXJlY3Rpb25fcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCAnZGlyZWN0aW9uX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2JyaWdodG5lc3NfMjUnOiAnZGltJywgJ2JyaWdodG5lc3NfNTAnOiAnbWVkaXVtJywgJ2JyaWdodG5lc3NfMTAwJzogJ2JyaWdodCcsICdkaXJlY3Rpb25fbGVmdCc6ICdmcm9tIHRoZSBsZWZ0JywgJ2RpcmVjdGlvbl90b3AnOiAnZnJvbSB0aGUgdG9wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCAnZGlyZWN0aW9uX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX3NlY29uZGxpZ2h0XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7J2RlZmF1bHRfY2hvaWNlJzogJzUuIERlY2lkZSBvbiB0aGUgcHJldmlvdXMgcXVlc3Rpb25zIGZpcnN0LicsICdicmlnaHRuZXNzJzogXCI1LiBCcmlnaHRuZXNzIHNlY29uZCBzZXR0aW5nOlwiLCAnZGlyZWN0aW9uJzogXCI1LiBEaXJlY3Rpb24gc2Vjb25kIHNldHRpbmc6XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZm9ybU9wdGlvbnMnKSA9PSAnY29tcGxldGUnID8geydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdkaXJlY3Rpb25fYnJpZ2h0bmVzc18wJzogJ25vIGxpZ2h0JywgJ2JyaWdodG5lc3NfMjUnOiAnZGltJywgJ2JyaWdodG5lc3NfNTAnOiAnbWVkaXVtJywgJ2JyaWdodG5lc3NfMTAwJzogJ2JyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlyZWN0aW9uX2FsbGRpcic6ICdmcm9tIGFsbCBkaXJlY3Rpb25zJywgJ2RpcmVjdGlvbl9sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnZGlyZWN0aW9uX3RvcCc6ICdmcm9tIHRoZSB0b3AnLCAnZGlyZWN0aW9uX3JpZ2h0JzogJ2Zyb20gdGhlIHJpZ2h0JywgJ2RpcmVjdGlvbl9ib3R0b20nOiAnZnJvbSB0aGUgYm90dG9tJ30gOlxuICAgICAgICAgICAgICAgICAgICAgICAgeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdkaXJlY3Rpb25fYnJpZ2h0bmVzc18wJzogJ25vIGxpZ2h0JywgJ2JyaWdodG5lc3NfMjUnOiAnZGltJywgJ2JyaWdodG5lc3NfNTAnOiAnbWVkaXVtJywgJ2JyaWdodG5lc3NfMTAwJzogJ2JyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlyZWN0aW9uX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdkaXJlY3Rpb25fdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdkaXJlY3Rpb25fcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCAnZGlyZWN0aW9uX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2xpZ2h0ZHVyYXRpb25cIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnNi4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjYuIFRpbWUgcGVyIHNldHRpbmc6XCIsICdkaXJlY3Rpb24nOiBcIjYuIFRpbWUgcGVyIHNldHRpbmc6XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzE1b24nOiAnYWx0ZXJuYXRlIDE1IHNlY29uZHMgb24nfSwgLy8nYnJpZ2h0bmVzc19kaXJlY3Rpb25fMzBvbic6ICdlYWNoIDMwIHNlY29uZHMgb24nXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF0sXG4gICAgICAgICAgYnV0dG9uczogYnV0dG9uc1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0aGlzLmNoYWluT2ZBY3RpdmF0aW9uID0ge1xuICAgICAgICAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJzoge1wiZXhwX2NhdGVnb3J5XCI6IFwiZXhwX3Byb2NlZHVyZVwiLCBcImV4cF9wcm9jZWR1cmVcIjogXCJleHBfaG9sZGNvbnN0YW50XCIsIFwiZXhwX2hvbGRjb25zdGFudFwiOiBcImV4cF9maXJzdGxpZ2h0XCIsIFwiZXhwX2ZpcnN0bGlnaHRcIjogXCJleHBfc2Vjb25kbGlnaHRcIiwgXCJleHBfc2Vjb25kbGlnaHRcIjogXCJleHBfbGlnaHRkdXJhdGlvblwifSxcbiAgICAgICAgJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic6IHtcImV4cF9jYXRlZ29yeVwiOiBcImV4cF9wcm9jZWR1cmVcIiwgXCJleHBfcHJvY2VkdXJlXCI6IFwiZXhwX2hvbGRjb25zdGFudFwiLCBcImV4cF9ob2xkY29uc3RhbnRcIjogXCJleHBfZmlyc3RsaWdodFwifVxuICAgICAgfTtcbiAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuXG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ191cGRhdGVGb3JtVmlld3MnLCdzZXRTdGF0ZScsICd2YWxpZGF0ZScsICdnZXRMaWdodENvbmZpZ3VyYXRpb24nXSlcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl91cGRhdGVGb3JtVmlld3MpXG4gICAgICB0aGlzLnNldFN0YXRlKCduZXcnKTtcbiAgICB9XG5cblxuICAgIHZhbGlkYXRlKCkge1xuXG4gICAgICBzd2l0Y2ggKHRoaXMuY2hhaW5TdGF0ZSkge1xuICAgICAgICBjYXNlICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nOlxuICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgICAgZmllbGQudXBkYXRlVmFsaWRhdGlvbih7Y3VzdG9tOiB7XG4gICAgICAgICAgICAgIHRlc3Q6ICdjdXN0b20nLFxuICAgICAgICAgICAgICBmbjogKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWwubWF0Y2goJ2RlZmF1bHQnKSkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKSB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSkgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IFwiWW91IGhhdmUgdG8gY2hvb3NlIHZhbGlkIG9wdGlvbnMgZm9yIHRoZSBcIiArICgxICsgaW5kZXgpICsgXCJ0aCBmaWVsZC5cIlxuICAgICAgICAgICAgfX0pXG4gICAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nOlxuICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmlkKCkgIT0gJ2V4cF9zZWNvbmRsaWdodCcgJiBmaWVsZC5pZCgpICE9ICdleHBfbGlnaHRkdXJhdGlvbicpIHtcbiAgICAgICAgICAgICAgZmllbGQudXBkYXRlVmFsaWRhdGlvbih7Y3VzdG9tOiB7XG4gICAgICAgICAgICAgICAgdGVzdDogJ2N1c3RvbScsXG4gICAgICAgICAgICAgICAgZm46ICh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmICh2YWwubWF0Y2goJ2RlZmF1bHQnKSkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKSB9XG4gICAgICAgICAgICAgICAgICBlbHNlIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKSB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IFwiWW91IGhhdmUgdG8gY2hvb3NlIHZhbGlkIG9wdGlvbnMgZm9yIHRoZSBcIiArICgxICsgaW5kZXgpICsgXCJ0aCBmaWVsZC5cIlxuICAgICAgICAgICAgICB9fSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZpZWxkLnVwZGF0ZVZhbGlkYXRpb24oe30pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLnZhbGlkYXRlKCk7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgdmFyIGxpZ2h0Q29uZmlnID0gdGhpcy5nZXRMaWdodENvbmZpZ3VyYXRpb24oKTtcbiAgICAgIHJldHVybiB7bGlnaHRzOiBsaWdodENvbmZpZ1snbGlnaHRzJ10sIGV4cEZvcm06IHN1cGVyLmV4cG9ydCgpfTtcbiAgICB9XG5cbiAgICBpbXBvcnQoZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xlYXIoKS50aGVuKCgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5fbW9kZWwuZ2V0RmllbGRzKCkpIHtcbiAgICAgICAgICBpZiAoZGF0YVtmaWVsZC5pZCgpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmaWVsZC5zZXRWYWx1ZShkYXRhW2ZpZWxkLmlkKCldKTtcbiAgICAgICAgICAgIGlmIChkYXRhW2ZpZWxkLmlkKCldID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpIHtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImhpc3RvcmljYWxcIjpcbiAgICAgICAgICB0aGlzLnN0YXRlID0gJ2hpc3RvcmljYWwnXG4gICAgICAgICAgc3dpdGNoIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTt9XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXhwbG9yZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTt9XG4gICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJjcmVhdGVcIjpcbiAgICAgICAgICAgIGNhc2UgXCJjcmVhdGVhbmRoaXN0b3J5XCI6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuc2hvdygpO31cbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuYWdncmVnYXRlJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLnNob3coKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm5ld1wiOlxuICAgICAgICAgIHRoaXMuc3RhdGUgPSAnbmV3JztcbiAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5pZCgpID09ICdleHBfY2F0ZWdvcnknKSB7XG4gICAgICAgICAgICAgIGZpZWxkLmVuYWJsZSgpXG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDApO1xuICAgICAgICAgICAgICBmaWVsZC5zZXREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7fVxuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNhYmxlTmV3KCkge1xuICAgICAgY29uc3QgbmV3QnRuID0gdGhpcy5nZXRCdXR0b24oJ25ldycpXG4gICAgICBpZiAobmV3QnRuKSB7XG4gICAgICAgIG5ld0J0bi5kaXNhYmxlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZW5hYmxlTmV3KCkge1xuICAgICAgY29uc3QgbmV3QnRuID0gdGhpcy5nZXRCdXR0b24oJ25ldycpXG4gICAgICBpZiAobmV3QnRuKSB7XG4gICAgICAgIG5ld0J0bi5lbmFibGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMaWdodENvbmZpZ3VyYXRpb24oKSB7XG4gICAgICAvLyBUcmFuc2xhdGUgZmllbGRzIGludG8gW3tcImxlZnRcIjogMTAwLCBcInJpZ2h0XCI6IDAsIFwidG9wXCI6IDAsIFwiYm90dG9tXCI6IDEwMCwgXCJkdXJhdGlvblwiOiAxNX0sIC4uLl1cbiAgICAgIGxldCBkZWZhdWx0Q291bnRlciA9IDA7XG4gICAgICB0aGlzLmV4cFByb3RvY29sID0ge31cbiAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICB0aGlzLmV4cFByb3RvY29sW2ZpZWxkLmlkKCldID0gZmllbGQudmFsdWUoKVxuICAgICAgICBkZWZhdWx0Q291bnRlciA9IGZpZWxkLnZhbHVlKCkgPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJz8gZGVmYXVsdENvdW50ZXIgKyAxIDogZGVmYXVsdENvdW50ZXI7XG4gICAgICB9KVxuXG4gICAgICBsZXQgY29uZmlnU3RhdGUgPSBmYWxzZTtcbiAgICAgIGlmIChkZWZhdWx0Q291bnRlciA8IDMpIHsgY29uZmlnU3RhdGUgPSB0cnVlOyB9XG5cbiAgICAgIHZhciBsaWdodENvbmZpZyA9IHt9XG4gICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddID0gQXJyYXkoNCkuZmlsbCgtMSk7XG4gICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ10gPSBbXTtcbiAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7IGxpZ2h0Q29uZmlnWydsaWdodHMnXS5wdXNoKHsnbGVmdCc6IDAsICd0b3AnOiAwLCAncmlnaHQnOiAwLCAnYm90dG9tJzogMCwgJ2R1cmF0aW9uJzogMTV9KSB9XG5cbiAgICAgIGlmIChjb25maWdTdGF0ZSkge1xuICAgICAgICB2YXIgbGlnaHREaXJlY3Rpb25zID0gWydsZWZ0JywgJ3RvcCcsICdyaWdodCcsICdib3R0b20nXTtcblxuICAgICAgICAvLyBFeHRyYWN0IHRoZSBmaXhlZCB2YWx1ZVxuICAgICAgICBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpIHtjb25zb2xlLmxvZygndGhlcmUgaXMgYSBwcm9ibGVtJyl9XG4gICAgICAgIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10ubWF0Y2goJ2RpcmVjdGlvbicpKSB7XG4gICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXSA9IEFycmF5KDQpLmZpbGwoKS5tYXAoZnVuY3Rpb24oKSB7IHJldHVybiBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10ubWF0Y2goL1xcZCsvKVswXSkgfSx0aGlzKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10ubWF0Y2goJ2JyaWdodG5lc3MnKSkge1xuICAgICAgICAgIGxldCBzdWJzdHIgPSB0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10ubGFzdEluZGV4T2YoJ18nKTtcbiAgICAgICAgICBzdWJzdHIgPSB0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10uc3Vic3RyKHN1YnN0cisxKTtcbiAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IHN1YnN0ci5tYXRjaCgnYWxsZGlyfCcgKyBkaXJlY3Rpb24pID8gMTAwIDogMCApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1vZGlmeSBhbGwgcGFuZWxzXG4gICAgICAgIHZhciBsaWdodFN1Y2Nlc3Npb25zID0geydsZWZ0JzogJ3RvcCcsICd0b3AnOiAncmlnaHQnLCAncmlnaHQnOiAnYm90dG9tJywgJ2JvdHRvbSc6ICdsZWZ0JywgJ3RvcGxlZnQnOiAndG9wcmlnaHQnLCAndG9wcmlnaHQnOiAnYm90dG9tcmlnaHQnLCAnYm90dG9tcmlnaHQnOiAnYm90dG9tbGVmdCcsICdib3R0b21sZWZ0JzogJ3RvcGxlZnQnfTtcbiAgICAgICAgdmFyIGZpcnN0QnJpZ2h0bmVzcyA9IG51bGw7XG4gICAgICAgIHZhciBzZWNvbmRCcmlnaHRuZXNzID0gbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5jaGFpblN0YXRlID09ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nICYgISh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddID09J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykpIHtcblxuICAgICAgICAgIHN3aXRjaCAodGhpcy5leHBQcm90b2NvbFsnZXhwX3Byb2NlZHVyZSddKSB7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2luY3JlYXNlJzpcbiAgICAgICAgICAgICAgZmlyc3RCcmlnaHRuZXNzID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA9IGZpcnN0QnJpZ2h0bmVzcyAgKyAyNSAqIHBhbmVsO1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kZWNyZWFzZSc6XG4gICAgICAgICAgICAgIGZpcnN0QnJpZ2h0bmVzcyA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSBmaXJzdEJyaWdodG5lc3MgLSAyNSAqIHBhbmVsO1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19ob2xkJzpcbiAgICAgICAgICAgICAgZmlyc3RCcmlnaHRuZXNzID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA9IGZpcnN0QnJpZ2h0bmVzcztcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9hcm91bmQnOlxuICAgICAgICAgICAgICB2YXIgY3VyckxpZ2h0ID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5sYXN0SW5kZXhPZignXycpO1xuICAgICAgICAgICAgICBjdXJyTGlnaHQgPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLnN1YnN0cihjdXJyTGlnaHQrMSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGN1cnJMaWdodC5tYXRjaChkaXJlY3Rpb24pID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgICAgY3VyckxpZ2h0ID0gbGlnaHRTdWNjZXNzaW9uc1tjdXJyTGlnaHRdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9ob2xkJzpcbiAgICAgICAgICAgICAgdmFyIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubGFzdEluZGV4T2YoJ18nKTtcbiAgICAgICAgICAgICAgY3VyckxpZ2h0ID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5zdWJzdHIoY3VyckxpZ2h0KzEpO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBjdXJyTGlnaHQubWF0Y2goJ2FsbGRpcnwnICsgZGlyZWN0aW9uKSA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyTGlnaHQgPT0gJzAnKSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA9IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7IC8vIGlmIGlzIGFsdGVybmF0aW5nXG5cbiAgICAgICAgICAvLyBNb2RpZnkgdGhlIGZpcnN0IHBhbmVsXG4gICAgICAgICAgaWYgKCEodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goJ2JyaWdodG5lc3MnKSkge1xuICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKTtcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXSA6IDAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgnZGlyZWN0aW9uJykpIHtcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXVtkaXJlY3Rpb25dID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgnYWxsZGlyfCcgKyBkaXJlY3Rpb24pID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXSA6IDAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBNb2RpZnkgdGhlIHJlbWFpbmluZyBwYW5lbHNcbiAgICAgICAgICBpZiAoISh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSAmICEodGhpcy5leHBQcm90b2NvbFsnZXhwX2xpZ2h0ZHVyYXRpb24nXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSkge1xuICAgICAgICAgICAgdmFyIG1vZGlmeVNlY29uZExpZ2h0ID0gW107XG4gICAgICAgICAgICBzd2l0Y2godGhpcy5leHBQcm90b2NvbFsnZXhwX2xpZ2h0ZHVyYXRpb24nXSkge1xuICAgICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RpcmVjdGlvbl8xNW9uJzpcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bMl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF1cbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzJdID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXVxuICAgICAgICAgICAgICAgIG1vZGlmeVNlY29uZExpZ2h0ID0gWzEsM11cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzE1b25vZmYnOlxuICAgICAgICAgICAgICAgIGxldCBsaWdodHMgPSB7J2R1cmF0aW9uJzogMTV9O1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKChkaXJlY3Rpb24pID0+IGxpZ2h0c1tkaXJlY3Rpb25dID0gMCk7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzFdID0gbGlnaHRzXG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVsxXSA9IDBcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bM10gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bMV1cbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzNdID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVsxXVxuICAgICAgICAgICAgICAgIG1vZGlmeVNlY29uZExpZ2h0ID0gWzJdXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RpcmVjdGlvbl8zMG9uJzpcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bMV0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF07XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVsxXSA9IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF1cbiAgICAgICAgICAgICAgICBtb2RpZnlTZWNvbmRMaWdodCA9IFsyLDNdXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10ubWF0Y2goJ2JyaWdodG5lc3MnKSkge1xuICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzBdXSA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pXG4gICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV0gOiAwICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddLm1hdGNoKCdkaXJlY3Rpb24nKSkge1xuICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzBdXVtkaXJlY3Rpb25dID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10ubWF0Y2goJ2FsbGRpcnwnICsgZGlyZWN0aW9uKSA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dIDogMCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobW9kaWZ5U2Vjb25kTGlnaHQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMV1dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzBdXTtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFsxXV0gPSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzBdXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxpZ2h0Q29uZmlnXG4gICAgfVxuXG4gICAgX3VwZGF0ZUZvcm1WaWV3cyhldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEuaWQgPT0gJ2V4cF9jYXRlZ29yeScpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGZpZWxkLmlkKCkgIT0gJ2V4cF9jYXRlZ29yeScpe1xuICAgICAgICAgICAgZmllbGQuc2hvd0Rlc2NyaXB0aW9uKGV2dC5kYXRhLmRlbHRhLnZhbHVlLm1hdGNoKCdkZWZhdWx0X2Nob2ljZScpID8gJ2RlZmF1bHRfY2hvaWNlJyA6IGV2dC5kYXRhLmRlbHRhLnZhbHVlKVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT0gJ25ldycpIHtcbiAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDApO1xuICAgICAgICAgICAgICBmaWVsZC5zZXREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGQsIGV2dC5kYXRhLmRlbHRhLnZhbHVlKVxuXG4gICAgICAgICAgfSBlbHNlIHsgLy8gaWYgaXQgaXMgZXhwX2NhdGVnb3J5XG4gICAgICAgICAgICBmaWVsZC5zaG93RGVzY3JpcHRpb24oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZCA9PSAnZXhwX3Byb2NlZHVyZScpIHsgLy8gVGhlIGNob3NlbiBwcm9jZWR1cmUgZGV0ZXJtaW5lcyB3aGF0IGZpZWxkcyB0byBzaG93XG5cbiAgICAgICAgICAvL0Rpc2FibGUgb3B0aW9ucyBvZiBleHBfZmlyc3RsaWdodCBkZXBlbmRpbmcgb24gd2hhdCBoYXMgYmVlbiBjaG9zZVxuICAgICAgICAgIHZhciBmaWVsZF9maXJzdGxpZ2h0ID0gdGhpcy5fZmluZEZpZWxkKCdleHBfZmlyc3RsaWdodCcpO1xuICAgICAgICAgIHN3aXRjaCAoZXZ0LmRhdGEuZGVsdGEudmFsdWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGVjcmVhc2UnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdicmlnaHRuZXNzXzEwMCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19pbmNyZWFzZSc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2JyaWdodG5lc3NfMjUnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9hcm91bmQnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdfbGVmdHxfdG9wbGVmdCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19hbHRlcm5hdGUnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdicmlnaHRuZXNzJyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2hvbGQnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsJ2JyaWdodG5lc3MnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9hbHRlcm5hdGUnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdkaXJlY3Rpb24nKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9ob2xkJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnZGlyZWN0aW9uJywgJ190b3BsZWZ0Jyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUmUtaW5pdGlhbGl6ZSBzdWNjZXNzaXZlIGZpZWxkc1xuICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmlkKCkgIT0gJ2V4cF9jYXRlZ29yeScgJiBmaWVsZC5pZCgpICE9ICdleHBfcHJvY2VkdXJlJyAmIHRoaXMuc3RhdGUgPT0gJ25ldycpIHtcbiAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDApO1xuICAgICAgICAgICAgICBmaWVsZC5zZXREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBJcyB0aGUgbmV4dCBmaWVsZCBhY3RpdmF0ZWQ/XG4gICAgICB2YXIgbmV4dEZpZWxkID0gdGhpcy5fZmluZEZpZWxkKHRoaXMuY2hhaW5PZkFjdGl2YXRpb25bdGhpcy5jaGFpblN0YXRlXVtldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEuaWRdKTtcbiAgICAgIGlmIChuZXh0RmllbGQgPyAhbmV4dEZpZWxkLmlzVmlzaWJsZSgpIDogZmFsc2UpIHtcbiAgICAgICAgICBuZXh0RmllbGQuc2V0VmlzaWJpbGl0eSgndmlzaWJsZScpO1xuICAgICAgICAgIG5leHRGaWVsZC5lbmFibGUoKTtcblxuICAgICAgICAgIHZhciBuZXh0bmV4dEZpZWxkID0gdGhpcy5fZmluZEZpZWxkKHRoaXMuY2hhaW5PZkFjdGl2YXRpb25bdGhpcy5jaGFpblN0YXRlXVtuZXh0RmllbGQuaWQoKV0pO1xuICAgICAgICAgIGlmIChuZXh0bmV4dEZpZWxkKSB7bmV4dG5leHRGaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDAuMyl9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZpbmRGaWVsZChmaWVsZElkKSB7XG4gICAgICB2YXIgZmllbGQgPSBudWxsO1xuICAgICAgZm9yICh2YXIgY250ciA9IDA7IGNudHI8dGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0Lmxlbmd0aDsgY250cisrKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHRbY250cl0uaWQoKT09ZmllbGRJZCkge1xuICAgICAgICAgIGZpZWxkID0gdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0W2NudHJdXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmaWVsZFxuICAgIH1cblxuICAgIF9tb2RpZnlPcHRpb25zKGZpZWxkLCBjcml0ZXJpYSwgYWRkaXRpb25hbGx5RGlzYWJsZSA9IG51bGwpIHtcbiAgICAgIE9iamVjdC5rZXlzKGZpZWxkLmdldE9wdGlvbnMoKSkuZm9yRWFjaCgoY2hvaWNlKSA9PiB7XG4gICAgICAgIGlmICgoY2hvaWNlLm1hdGNoKGFkZGl0aW9uYWxseURpc2FibGUpIHx8ICFjaG9pY2UubWF0Y2goY3JpdGVyaWEpKSAmJiAhY2hvaWNlLm1hdGNoKCdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG4gICAgICAgICAgZmllbGQuZGlzYWJsZU9wdGlvbihjaG9pY2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmllbGQuZW5hYmxlT3B0aW9uKGNob2ljZSlcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9XG4gIH1cbn0pXG4iXX0=
