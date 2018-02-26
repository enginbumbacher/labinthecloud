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

  //SymSliderField = require('core/component/symsliderfield/field'),
  //SliderField = require('core/component/sliderfield/field'),
  SelectField = require('core/component/selectfield/field'),
      SymSelectField = require('core/component/symselectfield/field'),
      ModelView = require('./threeview');

  var defaultConfigs = require('./bodyConfigurations/bodyconfigs/listofconfigs');

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
        var _this2 = this;

        if (meta.type == "blockly") {
          var bodyConfigs = Array.apply(null, { length: Object.keys(defaultConfigs).length }).map(function (number, ind) {
            return 'sensorConfig_' + (ind + 1);
          });
          // Filter out the options that are not in allowedConfigs
          if (meta.config.allowedConfigs.length) {
            for (var idx = bodyConfigs.length - 1; idx >= 0; idx--) {
              if (meta.config.allowedConfigs.indexOf(defaultConfigs[bodyConfigs[idx]].id.toLowerCase()) == -1) {
                bodyConfigs.splice(idx, 1);
              }
            }
          }
          this.bodyConfigOptions = {};
          bodyConfigs.map(function (bodyconfig) {
            return _this2.bodyConfigOptions[bodyconfig] = defaultConfigs[bodyconfig]['id'];
          });
          fields = fields.concat([SelectField.create({
            id: "bodyConfigurationName",
            inverse_order: true,
            color: meta.config.bodyConfiguration.color ? meta.config.bodyConfiguration.color : null,
            label: meta.config.bodyConfiguration.label,
            value: meta.config.bodyConfiguration.initialValue,
            min_width: meta.config.bodyConfiguration.min_width,
            classes: [],
            options: this.bodyConfigOptions
          }), SymSelectField.create({
            id: 'v',
            inverse_order: true,
            includeVariation: meta.config.variation ? true : false,
            label: meta.config.v.label,
            color: meta.config.v.color ? meta.config.v.color : null,
            value: meta.config.v.initialValue,
            maxValue: meta.config.v.maxValue,
            classes: [],
            options: meta.config.v.options
          }), SymSelectField.create({
            id: 'k',
            inverse_order: true,
            includeVariation: meta.config.variation ? true : false,
            label: meta.config.K.label,
            color: meta.config.K.color ? meta.config.K.color : null,
            value: meta.config.K.initialValue,
            maxValue: meta.config.K.maxValue,
            classes: [],
            options: meta.config.K.options
          })]);

          // Add either roll or motion type option
          if (meta.config.modelRepresentation === 'functional') {
            fields.splice(3, 0, SymSelectField.create({
              id: 'omega',
              inverse_order: true,
              includeVariation: meta.config.variation ? true : false,
              label: meta.config.omega.label,
              color: meta.config.omega.color ? meta.config.omega.color : null,
              value: meta.config.omega.initialValue,
              maxValue: meta.config.omega.maxValue,
              classes: [],
              options: meta.config.omega.options
            }));
          } else if (meta.config.modelRepresentation === 'mechanistic') {
            fields.splice(3, 0, SymSelectField.create({
              id: 'motion',
              inverse_order: true,
              includeVariation: false,
              label: meta.config.motion.label,
              color: meta.config.motion.color ? meta.config.motion.color : null,
              value: meta.config.motion.initialValue,
              maxValue: meta.config.motion.maxValue,
              classes: [],
              options: meta.config.motion.options
            }));
          }

          // Add opacity
          if (meta.config.opacity) {
            fields.splice(1, 0, SymSelectField.create({
              id: 'opacity',
              inverse_order: true,
              includeVariation: meta.config.variation ? true : false,
              label: meta.config.opacity.label,
              color: meta.config.opacity.color ? meta.config.opacity.color : null,
              value: meta.config.opacity.initialValue,
              maxValue: meta.config.opacity.maxValue,
              classes: [],
              options: meta.config.opacity.options
            }));
          }

          // Add variation
          if (meta.config.variation) {
            fields.push(SymSelectField.create({
              id: 'variation',
              includeVariation: false,
              label: meta.config.variation.label,
              color: meta.config.variation.color ? meta.config.variation.color : null,
              value: meta.config.variation.initialValue,
              maxValue: meta.config.variation.maxValue,
              classes: [],
              options: meta.config.variation.options
            }));
          }
        }
        return fields;
      }
    }, {
      key: '_hookModifyExport',
      value: function _hookModifyExport(exp, meta) {

        if (meta.type == "blockly") {
          ['k', 'v', 'omega', 'opacity', 'variation', 'motion'].forEach(function (key) {
            if (Object.keys(exp).indexOf(key) > -1) {
              exp[key + '_numeric'] = exp[key].numericValue;
              exp[key + '_variation'] = exp[key].variation;
              exp[key] = exp[key].qualitativeValue;
            }
          });
        }

        return exp;
      }
    }, {
      key: '_hookModifyImport',
      value: function _hookModifyImport(data, meta) {
        if (meta.type == "blockly") {
          ['k', 'v', 'omega', 'opacity', 'variation', 'motion'].forEach(function (key) {
            if (Object.keys(data).indexOf(key) > -1) {
              data[key] = {
                qualitativeValue: data[key],
                numericValue: data[key + '_numeric'],
                variation: data[key + '_variation']
              };
              delete data[key + '_numeric'];
              delete data[key + '_variation'];
            }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZHVsZSIsIk1vZGVsaW5nRGF0YVRhYiIsIlNlbGVjdEZpZWxkIiwiU3ltU2VsZWN0RmllbGQiLCJNb2RlbFZpZXciLCJkZWZhdWx0Q29uZmlncyIsIk1vZGVsaW5nRGF0YU1vZHVsZSIsImdldCIsImJpbmRNZXRob2RzIiwidGFiIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsIl9ob29rTW9kZWxGaWVsZHMiLCJfaG9va01vZGlmeUV4cG9ydCIsIl9ob29rTW9kaWZ5SW1wb3J0IiwiX2hvb2szZFZpZXciLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyIsImZpZWxkcyIsIm1ldGEiLCJ0eXBlIiwiYm9keUNvbmZpZ3MiLCJBcnJheSIsImFwcGx5IiwibGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsIm51bWJlciIsImluZCIsImNvbmZpZyIsImFsbG93ZWRDb25maWdzIiwiaWR4IiwiaW5kZXhPZiIsImlkIiwidG9Mb3dlckNhc2UiLCJzcGxpY2UiLCJib2R5Q29uZmlnT3B0aW9ucyIsImJvZHljb25maWciLCJjb25jYXQiLCJjcmVhdGUiLCJpbnZlcnNlX29yZGVyIiwiY29sb3IiLCJib2R5Q29uZmlndXJhdGlvbiIsImxhYmVsIiwidmFsdWUiLCJpbml0aWFsVmFsdWUiLCJtaW5fd2lkdGgiLCJjbGFzc2VzIiwib3B0aW9ucyIsImluY2x1ZGVWYXJpYXRpb24iLCJ2YXJpYXRpb24iLCJ2IiwibWF4VmFsdWUiLCJLIiwibW9kZWxSZXByZXNlbnRhdGlvbiIsIm9tZWdhIiwibW90aW9uIiwib3BhY2l0eSIsInB1c2giLCJleHAiLCJmb3JFYWNoIiwia2V5IiwibnVtZXJpY1ZhbHVlIiwicXVhbGl0YXRpdmVWYWx1ZSIsIm1vZGVsVHlwZSIsImJhc2VDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssa0JBQWtCTCxRQUFRLGtCQUFSLENBRHBCOztBQUVFO0FBQ0E7QUFDQU0sZ0JBQWNOLFFBQVEsa0NBQVIsQ0FKaEI7QUFBQSxNQUtFTyxpQkFBaUJQLFFBQVEscUNBQVIsQ0FMbkI7QUFBQSxNQU1FUSxZQUFZUixRQUFRLGFBQVIsQ0FOZDs7QUFRQSxNQUFNUyxpQkFBaUJULFFBQVEsZ0RBQVIsQ0FBdkI7O0FBYmtCLE1BZ0JaVSxrQkFoQlk7QUFBQTs7QUFpQmhCLGtDQUFjO0FBQUE7O0FBQUE7O0FBRVosVUFBSVIsUUFBUVMsR0FBUixDQUFZLG9CQUFaLENBQUosRUFBdUM7QUFDckNWLGNBQU1XLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQiwwQkFBbkIsRUFDMUIsa0JBRDBCLEVBQ04sbUJBRE0sRUFDZSxtQkFEZixFQUNvQyxhQURwQyxDQUF4Qjs7QUFHQSxjQUFLQyxHQUFMLEdBQVcsSUFBSVIsZUFBSixFQUFYOztBQUVBSCxnQkFBUVMsR0FBUixDQUFZLE9BQVosRUFBcUJHLGdCQUFyQixDQUFzQyxpQkFBdEMsRUFBeUQsTUFBS0MsY0FBOUQ7QUFDQWIsZ0JBQVFTLEdBQVIsQ0FBWSxPQUFaLEVBQXFCRyxnQkFBckIsQ0FBc0Msd0JBQXRDLEVBQWdFLE1BQUtFLHdCQUFyRTs7QUFFQWIsV0FBR2MsSUFBSCxDQUFRLGtCQUFSLEVBQTRCLE1BQUtDLGdCQUFqQztBQUNBZixXQUFHYyxJQUFI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QU5EO0FBT0Q7O0FBRUQsZUFBT0osR0FBUDtBQUNEO0FBM0tlO0FBQUE7QUFBQSx3Q0E2S0VoRCxJQTdLRixFQTZLUU8sSUE3S1IsRUE2S2M7QUFDNUIsWUFBSUEsS0FBS0MsSUFBTCxJQUFhLFNBQWpCLEVBQTRCO0FBQzFCLFdBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxPQUFYLEVBQW1CLFNBQW5CLEVBQTZCLFdBQTdCLEVBQXlDLFFBQXpDLEVBQW1EeUMsT0FBbkQsQ0FBMkQsVUFBQ0MsR0FBRCxFQUFTO0FBQ2xFLGdCQUFJckMsT0FBT0MsSUFBUCxDQUFZZCxJQUFaLEVBQWtCcUIsT0FBbEIsQ0FBMEI2QixHQUExQixJQUFpQyxDQUFDLENBQXRDLEVBQXlDO0FBQ3ZDbEQsbUJBQUtrRCxHQUFMLElBQVk7QUFDVkUsa0NBQWtCcEQsS0FBS2tELEdBQUwsQ0FEUjtBQUVWQyw4QkFBY25ELEtBQVFrRCxHQUFSLGNBRko7QUFHVlgsMkJBQVd2QyxLQUFRa0QsR0FBUjtBQUhELGVBQVo7QUFLQSxxQkFBT2xELEtBQVFrRCxHQUFSLGNBQVA7QUFDQSxxQkFBT2xELEtBQVFrRCxHQUFSLGdCQUFQO0FBQ0Q7QUFDRixXQVZEO0FBV0Q7QUFDRCxlQUFPbEQsSUFBUDtBQUNEO0FBNUxlO0FBQUE7QUFBQSxrQ0E4TEpGLElBOUxJLEVBOExFUyxJQTlMRixFQThMUTtBQUN0QixZQUFJQSxLQUFLVyxNQUFMLENBQVltQyxTQUFaLElBQXlCLFNBQTdCLEVBQXdDO0FBQ3RDLGlCQUFRLElBQUl2RSxTQUFKLENBQWMsRUFBRXdFLFdBQVcvQyxLQUFLdUIsS0FBbEIsRUFBZCxDQUFELENBQTJDaEMsSUFBM0MsRUFBUDtBQUNEO0FBQ0QsZUFBT0EsSUFBUDtBQUNEO0FBbk1lOztBQUFBO0FBQUEsSUFnQmVwQixNQWhCZjs7QUFzTWxCLFNBQU9NLGtCQUFQO0FBQ0QsQ0F2TUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIE1vZGVsaW5nRGF0YVRhYiA9IHJlcXVpcmUoJy4vYmxvY2tseXRhYi90YWInKSxcbiAgICAvL1N5bVNsaWRlckZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc3ltc2xpZGVyZmllbGQvZmllbGQnKSxcbiAgICAvL1NsaWRlckZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2xpZGVyZmllbGQvZmllbGQnKSxcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJyksXG4gICAgU3ltU2VsZWN0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC9maWVsZCcpLFxuICAgIE1vZGVsVmlldyA9IHJlcXVpcmUoJy4vdGhyZWV2aWV3Jyk7XG5cbiAgY29uc3QgZGVmYXVsdENvbmZpZ3MgPSByZXF1aXJlKCcuL2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy9saXN0b2Zjb25maWdzJylcblxuXG4gIGNsYXNzIE1vZGVsaW5nRGF0YU1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWxpbmcnKSkge1xuICAgICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblBoYXNlQ2hhbmdlJywgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZScsXG4gICAgICAnX2hvb2tNb2RlbEZpZWxkcycsICdfaG9va01vZGlmeUV4cG9ydCcsICdfaG9va01vZGlmeUltcG9ydCcsICdfaG9vazNkVmlldyddKVxuXG4gICAgICAgIHRoaXMudGFiID0gbmV3IE1vZGVsaW5nRGF0YVRhYigpO1xuXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB0aGlzLl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSlcblxuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uRmllbGRzJywgdGhpcy5faG9va01vZGVsRmllbGRzKTtcbiAgICAgICAgSE0uaG9vaygnTW9kZWxGb3JtLk1vZGlmeUV4cG9ydCcsIHRoaXMuX2hvb2tNb2RpZnlFeHBvcnQpO1xuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uTW9kaWZ5SW1wb3J0JywgdGhpcy5faG9va01vZGlmeUltcG9ydCk7XG4gICAgICAgIEhNLmhvb2soJ0V1Z2xlbmEuM2RWaWV3JywgdGhpcy5faG9vazNkVmlldylcblxuICAgICAgfVxuICAgIH1cblxuICAgIHJ1bigpIHtcbiAgICAgIGlmICh0aGlzLnRhYikgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdyZXN1bHQnKS5hZGRDb250ZW50KHRoaXMudGFiLnZpZXcoKSlcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLnRhYi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmNvdW50ICYmICFldnQuZGF0YS5vbGQpIHtcbiAgICAgICAgdGhpcy50YWIuc2hvdygpO1xuICAgICAgfSBlbHNlIGlmICghZXZ0LmRhdGEuY291bnQpIHtcbiAgICAgICAgdGhpcy50YWIuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9ob29rTW9kZWxGaWVsZHMoZmllbGRzLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIHZhciBib2R5Q29uZmlncyA9IEFycmF5LmFwcGx5KG51bGwsIHtsZW5ndGg6T2JqZWN0LmtleXMoZGVmYXVsdENvbmZpZ3MpLmxlbmd0aH0pLm1hcCgobnVtYmVyLGluZCkgPT4gJ3NlbnNvckNvbmZpZ18nICsgKGluZCsxKSk7XG4gICAgICAgIC8vIEZpbHRlciBvdXQgdGhlIG9wdGlvbnMgdGhhdCBhcmUgbm90IGluIGFsbG93ZWRDb25maWdzXG4gICAgICAgIGlmIChtZXRhLmNvbmZpZy5hbGxvd2VkQ29uZmlncy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKGxldCBpZHggPSBib2R5Q29uZmlncy5sZW5ndGggLSAxOyBpZHggPj0gMDsgaWR4LS0pIHtcbiAgICAgICAgICAgIGlmICgobWV0YS5jb25maWcuYWxsb3dlZENvbmZpZ3MuaW5kZXhPZihkZWZhdWx0Q29uZmlnc1tib2R5Q29uZmlnc1tpZHhdXS5pZC50b0xvd2VyQ2FzZSgpKSA9PSAtMSkpIHtcbiAgICAgICAgICAgICAgYm9keUNvbmZpZ3Muc3BsaWNlKGlkeCwxKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvZHlDb25maWdPcHRpb25zID0ge31cbiAgICAgICAgYm9keUNvbmZpZ3MubWFwKGJvZHljb25maWcgPT4gdGhpcy5ib2R5Q29uZmlnT3B0aW9uc1tib2R5Y29uZmlnXSA9IGRlZmF1bHRDb25maWdzW2JvZHljb25maWddWydpZCddKVxuICAgICAgICBmaWVsZHMgPSBmaWVsZHMuY29uY2F0KFtTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6IFwiYm9keUNvbmZpZ3VyYXRpb25OYW1lXCIsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmNvbG9yID8gbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1pbl93aWR0aDogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24ubWluX3dpZHRoLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLmJvZHlDb25maWdPcHRpb25zXG4gICAgICAgICAgfSksIFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ3YnLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IG1ldGEuY29uZmlnLnZhcmlhdGlvbiA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy52LmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLnYuY29sb3IgPyBtZXRhLmNvbmZpZy52LmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy52LmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy52Lm1heFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy52Lm9wdGlvbnNcbiAgICAgICAgICB9KSwgU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnaycsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogbWV0YS5jb25maWcudmFyaWF0aW9uID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLksubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcuSy5jb2xvciA/IG1ldGEuY29uZmlnLksuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLksuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLksubWF4VmFsdWUsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLksub3B0aW9uc1xuICAgICAgICAgIH0pXG4gICAgICAgIF0pXG5cbiAgICAgICAgLy8gQWRkIGVpdGhlciByb2xsIG9yIG1vdGlvbiB0eXBlIG9wdGlvblxuICAgICAgICBpZiAobWV0YS5jb25maWcubW9kZWxSZXByZXNlbnRhdGlvbiA9PT0gJ2Z1bmN0aW9uYWwnKSB7XG4gICAgICAgICAgZmllbGRzLnNwbGljZSgzLDAsU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnb21lZ2EnLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IG1ldGEuY29uZmlnLnZhcmlhdGlvbiA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5vbWVnYS5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5vbWVnYS5jb2xvciA/IG1ldGEuY29uZmlnLm9tZWdhLmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy5vbWVnYS5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcub21lZ2EubWF4VmFsdWUsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLm9tZWdhLm9wdGlvbnNcbiAgICAgICAgICB9KSlcbiAgICAgICAgfSBlbHNlIGlmIChtZXRhLmNvbmZpZy5tb2RlbFJlcHJlc2VudGF0aW9uID09PSAnbWVjaGFuaXN0aWMnKSB7XG4gICAgICAgICAgZmllbGRzLnNwbGljZSgzLDAsU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnbW90aW9uJyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICBpbmNsdWRlVmFyaWF0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5tb3Rpb24ubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcubW90aW9uLmNvbG9yID8gbWV0YS5jb25maWcubW90aW9uLmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy5tb3Rpb24uaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLm1vdGlvbi5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcubW90aW9uLm9wdGlvbnNcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBvcGFjaXR5XG4gICAgICAgIGlmIChtZXRhLmNvbmZpZy5vcGFjaXR5KSB7XG4gICAgICAgICAgZmllbGRzLnNwbGljZSgxLDAsU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnb3BhY2l0eScsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogbWV0YS5jb25maWcudmFyaWF0aW9uID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLm9wYWNpdHkubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcub3BhY2l0eS5jb2xvciA/IG1ldGEuY29uZmlnLm9wYWNpdHkuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLm9wYWNpdHkuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLm9wYWNpdHkubWF4VmFsdWUsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLm9wYWNpdHkub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHZhcmlhdGlvblxuICAgICAgICBpZiAobWV0YS5jb25maWcudmFyaWF0aW9uKSB7XG4gICAgICAgICAgZmllbGRzLnB1c2goU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAndmFyaWF0aW9uJyxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLnZhcmlhdGlvbi5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy52YXJpYXRpb24uY29sb3IgPyBtZXRhLmNvbmZpZy52YXJpYXRpb24uY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLnZhcmlhdGlvbi5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcudmFyaWF0aW9uLm1heFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy52YXJpYXRpb24ub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cblxuICAgIF9ob29rTW9kaWZ5RXhwb3J0KGV4cCwgbWV0YSkge1xuXG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIFsnaycsICd2JywgJ29tZWdhJywnb3BhY2l0eScsJ3ZhcmlhdGlvbicsJ21vdGlvbiddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhleHApLmluZGV4T2Yoa2V5KSA+LTEpIHtcbiAgICAgICAgICAgIGV4cFtgJHtrZXl9X251bWVyaWNgXSA9IGV4cFtrZXldLm51bWVyaWNWYWx1ZTtcbiAgICAgICAgICAgIGV4cFtgJHtrZXl9X3ZhcmlhdGlvbmBdID0gZXhwW2tleV0udmFyaWF0aW9uO1xuICAgICAgICAgICAgZXhwW2tleV0gPSBleHBba2V5XS5xdWFsaXRhdGl2ZVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGV4cFxuICAgIH1cblxuICAgIF9ob29rTW9kaWZ5SW1wb3J0KGRhdGEsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLnR5cGUgPT0gXCJibG9ja2x5XCIpIHtcbiAgICAgICAgWydrJywgJ3YnLCAnb21lZ2EnLCdvcGFjaXR5JywndmFyaWF0aW9uJywnbW90aW9uJ10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRhdGEpLmluZGV4T2Yoa2V5KSA+IC0xKSB7XG4gICAgICAgICAgICBkYXRhW2tleV0gPSB7XG4gICAgICAgICAgICAgIHF1YWxpdGF0aXZlVmFsdWU6IGRhdGFba2V5XSxcbiAgICAgICAgICAgICAgbnVtZXJpY1ZhbHVlOiBkYXRhW2Ake2tleX1fbnVtZXJpY2BdLFxuICAgICAgICAgICAgICB2YXJpYXRpb246IGRhdGFbYCR7a2V5fV92YXJpYXRpb25gXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhW2Ake2tleX1fbnVtZXJpY2BdO1xuICAgICAgICAgICAgZGVsZXRlIGRhdGFbYCR7a2V5fV92YXJpYXRpb25gXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBfaG9vazNkVmlldyh2aWV3LCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS5jb25maWcubW9kZWxUeXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIHJldHVybiAobmV3IE1vZGVsVmlldyh7IGJhc2VDb2xvcjogbWV0YS5jb2xvciB9KSkudmlldygpXG4gICAgICB9XG4gICAgICByZXR1cm4gdmlldztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTW9kZWxpbmdEYXRhTW9kdWxlO1xufSlcbiJdfQ==
