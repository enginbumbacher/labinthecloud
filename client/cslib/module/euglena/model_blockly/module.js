'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Module = require('core/app/module'),
      ModelingDataTab = require('./blocklytab/tab'),
      SymSliderField = require('core/component/symsliderfield/field'),
      SliderField = require('core/component/sliderfield/field'),
      SelectField = require('core/component/selectfield/field'),
      ModelView = require('./threeview');

  var ModelingDataModule = function (_Module) {
    _inherits(ModelingDataModule, _Module);

    function ModelingDataModule() {
      _classCallCheck(this, ModelingDataModule);

      var _this = _possibleConstructorReturn(this, (ModelingDataModule.__proto__ || Object.getPrototypeOf(ModelingDataModule)).call(this));

      if (Globals.get('AppConfig.modeling')) {
        Utils.bindMethods(_this, ['_onPhaseChange', '_onExperimentCountChange', '_hookModelFields', '_hookModifyExport', '_hookModifyImport', '_hook3dView']);

        _this.tab = new ModelingDataTab();

        Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
        Globals.get('Relay').addEventListener('ExperimentCount.Change', _this._onExperimentCountChange);

        HM.hook('ModelForm.Fields', _this._hookModelFields);
        HM.hook('ModelForm.ModifyExport', _this._hookModifyExport);
        HM.hook('ModelForm.ModifyImport', _this._hookModifyImport);
        HM.hook('Euglena.3dView', _this._hook3dView);
      }
      return _this;
    }

    _createClass(ModelingDataModule, [{
      key: 'run',
      value: function run() {
        if (this.tab) Globals.get('Layout').getPanel('result').addContent(this.tab.view());
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
          this.tab.hide();
        }
      }
    }, {
      key: '_onExperimentCountChange',
      value: function _onExperimentCountChange(evt) {
        if (evt.data.count && !evt.data.old) {
          this.tab.show();
        } else if (!evt.data.count) {
          this.tab.hide();
        }
      }
    }, {
      key: '_hookModelFields',
      value: function _hookModelFields(fields, meta) {
        if (meta.type == "blockly") {
          fields = fields.concat([SelectField.create({
            id: "body_configuration",
            label: 'body configuration',
            value: "one_eye",
            classes: [],
            options: { "one_eye": "With one eye", "two_eye": "With two eyes" }
          }), SymSliderField.create({
            id: 'k',
            label: meta.config.K.label,
            min: meta.config.K.range[0],
            max: meta.config.K.range[1],
            steps: Math.round((meta.config.K.range[1] - meta.config.K.range[0]) / meta.config.K.resolution),
            defaultValue: meta.config.K.initialValue
          }), SymSliderField.create({
            id: 'v',
            label: meta.config.v.label,
            min: meta.config.v.range[0],
            max: meta.config.v.range[1],
            steps: Math.round((meta.config.v.range[1] - meta.config.v.range[0]) / meta.config.v.resolution),
            defaultValue: meta.config.v.initialValue
          }), SymSliderField.create({
            id: 'omega',
            label: meta.config.omega.label,
            min: meta.config.omega.range[0],
            max: meta.config.omega.range[1],
            steps: Math.round((meta.config.omega.range[1] - meta.config.omega.range[0]) / meta.config.omega.resolution),
            defaultValue: meta.config.omega.initialValue
          }), SliderField.create({
            id: 'randomness',
            label: meta.config.randomness.label,
            min: meta.config.randomness.range[0],
            max: meta.config.randomness.range[1],
            steps: Math.round((meta.config.randomness.range[1] - meta.config.randomness.range[0]) / meta.config.randomness.resolution),
            defaultValue: meta.config.randomness.initialValue
          })]);
        }
        return fields;
      }
    }, {
      key: '_hookModifyExport',
      value: function _hookModifyExport(exp, meta) {
        if (meta.type == "blockly") {
          ['k', 'v', 'omega'].forEach(function (key) {
            exp[key + '_delta'] = exp[key].delta;
            exp[key] = exp[key].base;
          });
        }
        return exp;
      }
    }, {
      key: '_hookModifyImport',
      value: function _hookModifyImport(data, meta) {
        if (meta.type == "blockly") {
          ['k', 'v', 'omega'].forEach(function (key) {
            data[key] = {
              base: data[key],
              delta: data[key + '_delta']
            };
            delete data[key + '_delta'];
          });
        }
        return data;
      }
    }, {
      key: '_hook3dView',
      value: function _hook3dView(view, meta) {
        if (meta.config.modelType == "blockly") {
          return new ModelView({ baseColor: meta.color }).view();
        }
        return view;
      }
    }]);

    return ModelingDataModule;
  }(Module);

  return ModelingDataModule;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZHVsZSIsIk1vZGVsaW5nRGF0YVRhYiIsIlN5bVNsaWRlckZpZWxkIiwiU2xpZGVyRmllbGQiLCJTZWxlY3RGaWVsZCIsIk1vZGVsVmlldyIsIk1vZGVsaW5nRGF0YU1vZHVsZSIsImdldCIsImJpbmRNZXRob2RzIiwidGFiIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsIl9ob29rTW9kZWxGaWVsZHMiLCJfaG9va01vZGlmeUV4cG9ydCIsIl9ob29rTW9kaWZ5SW1wb3J0IiwiX2hvb2szZFZpZXciLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyIsImZpZWxkcyIsIm1ldGEiLCJ0eXBlIiwiY29uY2F0IiwiY3JlYXRlIiwiaWQiLCJsYWJlbCIsInZhbHVlIiwiY2xhc3NlcyIsIm9wdGlvbnMiLCJjb25maWciLCJLIiwibWluIiwicmFuZ2UiLCJtYXgiLCJzdGVwcyIsIk1hdGgiLCJyb3VuZCIsInJlc29sdXRpb24iLCJkZWZhdWx0VmFsdWUiLCJpbml0aWFsVmFsdWUiLCJ2Iiwib21lZ2EiLCJyYW5kb21uZXNzIiwiZXhwIiwiZm9yRWFjaCIsImtleSIsImRlbHRhIiwiYmFzZSIsIm1vZGVsVHlwZSIsImJhc2VDb2xvciIsImNvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJ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anMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIE1vZGVsaW5nRGF0YVRhYiA9IHJlcXVpcmUoJy4vYmxvY2tseXRhYi90YWInKSxcbiAgICBTeW1TbGlkZXJGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3N5bXNsaWRlcmZpZWxkL2ZpZWxkJyksXG4gICAgU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZCcpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKSxcbiAgICBNb2RlbFZpZXcgPSByZXF1aXJlKCcuL3RocmVldmlldycpO1xuXG4gIGNsYXNzIE1vZGVsaW5nRGF0YU1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWxpbmcnKSkge1xuICAgICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblBoYXNlQ2hhbmdlJywgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZScsXG4gICAgICAnX2hvb2tNb2RlbEZpZWxkcycsICdfaG9va01vZGlmeUV4cG9ydCcsICdfaG9va01vZGlmeUltcG9ydCcsICdfaG9vazNkVmlldyddKVxuXG4gICAgICAgIHRoaXMudGFiID0gbmV3IE1vZGVsaW5nRGF0YVRhYigpO1xuXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB0aGlzLl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSlcblxuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uRmllbGRzJywgdGhpcy5faG9va01vZGVsRmllbGRzKTtcbiAgICAgICAgSE0uaG9vaygnTW9kZWxGb3JtLk1vZGlmeUV4cG9ydCcsIHRoaXMuX2hvb2tNb2RpZnlFeHBvcnQpO1xuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uTW9kaWZ5SW1wb3J0JywgdGhpcy5faG9va01vZGlmeUltcG9ydCk7XG4gICAgICAgIEhNLmhvb2soJ0V1Z2xlbmEuM2RWaWV3JywgdGhpcy5faG9vazNkVmlldylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBydW4oKSB7XG4gICAgICBpZiAodGhpcy50YWIpIEdsb2JhbHMuZ2V0KCdMYXlvdXQnKS5nZXRQYW5lbCgncmVzdWx0JykuYWRkQ29udGVudCh0aGlzLnRhYi52aWV3KCkpXG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy50YWIuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRDb3VudENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5jb3VudCAmJiAhZXZ0LmRhdGEub2xkKSB7XG4gICAgICAgIHRoaXMudGFiLnNob3coKTtcbiAgICAgIH0gZWxzZSBpZiAoIWV2dC5kYXRhLmNvdW50KSB7XG4gICAgICAgIHRoaXMudGFiLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaG9va01vZGVsRmllbGRzKGZpZWxkcywgbWV0YSkge1xuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICBmaWVsZHMgPSBmaWVsZHMuY29uY2F0KFtTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgIGlkOiBcImJvZHlfY29uZmlndXJhdGlvblwiLFxuICAgICAgICAgIGxhYmVsOiAnYm9keSBjb25maWd1cmF0aW9uJyxcbiAgICAgICAgICB2YWx1ZTogXCJvbmVfZXllXCIsXG4gICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgb3B0aW9uczogeyBcIm9uZV9leWVcIjogXCJXaXRoIG9uZSBleWVcIiwgXCJ0d29fZXllXCI6IFwiV2l0aCB0d28gZXllc1wiIH1cbiAgICAgICAgfSksIFN5bVNsaWRlckZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICdrJyxcbiAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcuSy5sYWJlbCxcbiAgICAgICAgICBtaW46IG1ldGEuY29uZmlnLksucmFuZ2VbMF0sXG4gICAgICAgICAgbWF4OiBtZXRhLmNvbmZpZy5LLnJhbmdlWzFdLFxuICAgICAgICAgIHN0ZXBzOiBNYXRoLnJvdW5kKChtZXRhLmNvbmZpZy5LLnJhbmdlWzFdIC0gbWV0YS5jb25maWcuSy5yYW5nZVswXSkgLyBtZXRhLmNvbmZpZy5LLnJlc29sdXRpb24pLFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZTogbWV0YS5jb25maWcuSy5pbml0aWFsVmFsdWVcbiAgICAgICAgfSksIFN5bVNsaWRlckZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICd2JyxcbiAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcudi5sYWJlbCxcbiAgICAgICAgICBtaW46IG1ldGEuY29uZmlnLnYucmFuZ2VbMF0sXG4gICAgICAgICAgbWF4OiBtZXRhLmNvbmZpZy52LnJhbmdlWzFdLFxuICAgICAgICAgIHN0ZXBzOiBNYXRoLnJvdW5kKChtZXRhLmNvbmZpZy52LnJhbmdlWzFdIC0gbWV0YS5jb25maWcudi5yYW5nZVswXSkgLyBtZXRhLmNvbmZpZy52LnJlc29sdXRpb24pLFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZTogbWV0YS5jb25maWcudi5pbml0aWFsVmFsdWVcbiAgICAgICAgfSksIFN5bVNsaWRlckZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICdvbWVnYScsXG4gICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLm9tZWdhLmxhYmVsLFxuICAgICAgICAgIG1pbjogbWV0YS5jb25maWcub21lZ2EucmFuZ2VbMF0sXG4gICAgICAgICAgbWF4OiBtZXRhLmNvbmZpZy5vbWVnYS5yYW5nZVsxXSxcbiAgICAgICAgICBzdGVwczogTWF0aC5yb3VuZCgobWV0YS5jb25maWcub21lZ2EucmFuZ2VbMV0gLSBtZXRhLmNvbmZpZy5vbWVnYS5yYW5nZVswXSkgLyBtZXRhLmNvbmZpZy5vbWVnYS5yZXNvbHV0aW9uKSxcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6IG1ldGEuY29uZmlnLm9tZWdhLmluaXRpYWxWYWx1ZVxuICAgICAgICB9KSwgU2xpZGVyRmllbGQuY3JlYXRlKHtcbiAgICAgICAgICBpZDogJ3JhbmRvbW5lc3MnLFxuICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5yYW5kb21uZXNzLmxhYmVsLFxuICAgICAgICAgIG1pbjogbWV0YS5jb25maWcucmFuZG9tbmVzcy5yYW5nZVswXSxcbiAgICAgICAgICBtYXg6IG1ldGEuY29uZmlnLnJhbmRvbW5lc3MucmFuZ2VbMV0sXG4gICAgICAgICAgc3RlcHM6IE1hdGgucm91bmQoKG1ldGEuY29uZmlnLnJhbmRvbW5lc3MucmFuZ2VbMV0gLSBtZXRhLmNvbmZpZy5yYW5kb21uZXNzLnJhbmdlWzBdKSAvIG1ldGEuY29uZmlnLnJhbmRvbW5lc3MucmVzb2x1dGlvbiksXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiBtZXRhLmNvbmZpZy5yYW5kb21uZXNzLmluaXRpYWxWYWx1ZVxuICAgICAgICB9KV0pXG4gICAgICB9XG4gICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cblxuICAgIF9ob29rTW9kaWZ5RXhwb3J0KGV4cCwgbWV0YSkge1xuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICBbJ2snLCAndicsICdvbWVnYSddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGV4cFtgJHtrZXl9X2RlbHRhYF0gPSBleHBba2V5XS5kZWx0YTtcbiAgICAgICAgICBleHBba2V5XSA9IGV4cFtrZXldLmJhc2U7XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gZXhwXG4gICAgfVxuXG4gICAgX2hvb2tNb2RpZnlJbXBvcnQoZGF0YSwgbWV0YSkge1xuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICBbJ2snLCAndicsICdvbWVnYSddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGRhdGFba2V5XSA9IHtcbiAgICAgICAgICAgIGJhc2U6IGRhdGFba2V5XSxcbiAgICAgICAgICAgIGRlbHRhOiBkYXRhW2Ake2tleX1fZGVsdGFgXVxuICAgICAgICAgIH07XG4gICAgICAgICAgZGVsZXRlIGRhdGFbYCR7a2V5fV9kZWx0YWBdO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgX2hvb2szZFZpZXcodmlldywgbWV0YSkge1xuICAgICAgaWYgKG1ldGEuY29uZmlnLm1vZGVsVHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICByZXR1cm4gKG5ldyBNb2RlbFZpZXcoeyBiYXNlQ29sb3I6IG1ldGEuY29sb3IgfSkpLnZpZXcoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE1vZGVsaW5nRGF0YU1vZHVsZTtcbn0pXG4iXX0=
