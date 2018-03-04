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

        if (Globals.get('AppConfig.model.tabs').length) {
          _this.tab = new ModelingDataTab();
          Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
          Globals.get('Relay').addEventListener('ExperimentCount.Change', _this._onExperimentCountChange);
        }

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
            description: meta.config.bodyConfiguration.description,
            classes: [],
            options: this.bodyConfigOptions
          }), SymSelectField.create({
            id: 'v',
            inverse_order: true,
            varOptions: meta.config.v.varOptions,
            label: meta.config.v.label,
            color: meta.config.v.color ? meta.config.v.color : null,
            value: meta.config.v.initialValue,
            maxValue: meta.config.v.maxValue,
            description: meta.config.v.description,
            classes: [],
            options: meta.config.v.options
          }), SymSelectField.create({
            id: 'k',
            inverse_order: true,
            varOptions: meta.config.K.varOptions,
            label: meta.config.K.label,
            color: meta.config.K.color ? meta.config.K.color : null,
            value: meta.config.K.initialValue,
            maxValue: meta.config.K.maxValue,
            description: meta.config.K.description,
            classes: [],
            options: meta.config.K.options
          })]);

          // Add either roll or motion type option
          if (meta.config.omega) {
            fields.splice(3, 0, SymSelectField.create({
              id: 'omega',
              inverse_order: true,
              varOptions: meta.config.omega.varOptions,
              label: meta.config.omega.label,
              color: meta.config.omega.color ? meta.config.omega.color : null,
              value: meta.config.omega.initialValue,
              maxValue: meta.config.omega.maxValue,
              description: meta.config.omega.description,
              classes: [],
              options: meta.config.omega.options
            }));
          } else if (meta.config.motion) {
            fields.splice(3, 0, SymSelectField.create({
              id: 'motion',
              inverse_order: true,
              label: meta.config.motion.label,
              color: meta.config.motion.color ? meta.config.motion.color : null,
              value: meta.config.motion.initialValue,
              maxValue: meta.config.motion.maxValue,
              description: meta.config.motion.description,
              classes: [],
              options: meta.config.motion.options
            }));
          }

          // Add opacity
          if (meta.config.opacity) {
            fields.splice(1, 0, SymSelectField.create({
              id: 'opacity',
              inverse_order: true,
              varOptions: meta.config.opacity.varOptions,
              label: meta.config.opacity.label,
              color: meta.config.opacity.color ? meta.config.opacity.color : null,
              value: meta.config.opacity.initialValue,
              maxValue: meta.config.opacity.maxValue,
              description: meta.config.opacity.description,
              classes: [],
              options: meta.config.opacity.options
            }));
          }
        }
        return fields;
      }
    }, {
      key: '_hookModifyExport',
      value: function _hookModifyExport(exp, meta) {

        if (meta.type == "blockly") {
          ['k', 'v', 'omega', 'opacity', 'motion'].forEach(function (key) {
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
          ['k', 'v', 'omega', 'opacity', 'motion'].forEach(function (key) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZHVsZSIsIk1vZGVsaW5nRGF0YVRhYiIsIlNlbGVjdEZpZWxkIiwiU3ltU2VsZWN0RmllbGQiLCJNb2RlbFZpZXciLCJkZWZhdWx0Q29uZmlncyIsIk1vZGVsaW5nRGF0YU1vZHVsZSIsImdldCIsImJpbmRNZXRob2RzIiwibGVuZ3RoIiwidGFiIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsIl9ob29rTW9kZWxGaWVsZHMiLCJfaG9va01vZGlmeUV4cG9ydCIsIl9ob29rTW9kaWZ5SW1wb3J0IiwiX2hvb2szZFZpZXciLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyIsImZpZWxkcyIsIm1ldGEiLCJ0eXBlIiwiYm9keUNvbmZpZ3MiLCJBcnJheSIsImFwcGx5IiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsIm51bWJlciIsImluZCIsImNvbmZpZyIsImFsbG93ZWRDb25maWdzIiwiaWR4IiwiaW5kZXhPZiIsImlkIiwidG9Mb3dlckNhc2UiLCJzcGxpY2UiLCJib2R5Q29uZmlnT3B0aW9ucyIsImJvZHljb25maWciLCJjb25jYXQiLCJjcmVhdGUiLCJpbnZlcnNlX29yZGVyIiwiY29sb3IiLCJib2R5Q29uZmlndXJhdGlvbiIsImxhYmVsIiwidmFsdWUiLCJpbml0aWFsVmFsdWUiLCJtaW5fd2lkdGgiLCJkZXNjcmlwdGlvbiIsImNsYXNzZXMiLCJvcHRpb25zIiwidmFyT3B0aW9ucyIsInYiLCJtYXhWYWx1ZSIsIksiLCJvbWVnYSIsIm1vdGlvbiIsIm9wYWNpdHkiLCJleHAiLCJmb3JFYWNoIiwia2V5IiwibnVtZXJpY1ZhbHVlIiwidmFyaWF0aW9uIiwicXVhbGl0YXRpdmVWYWx1ZSIsIm1vZGVsVHlwZSIsImJhc2VDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssa0JBQWtCTCxRQUFRLGtCQUFSLENBRHBCOztBQUVFO0FBQ0E7QUFDQU0sZ0JBQWNOLFFBQVEsa0NBQVIsQ0FKaEI7QUFBQSxNQUtFTyxpQkFBaUJQLFFBQVEscUNBQVIsQ0FMbkI7QUFBQSxNQU1FUSxZQUFZUixRQUFRLGFBQVIsQ0FOZDs7QUFRQSxNQUFNUyxpQkFBaUJULFFBQVEsZ0RBQVIsQ0FBdkI7O0FBYmtCLE1BZ0JaVSxrQkFoQlk7QUFBQTs7QUFpQmhCLGtDQUFjO0FBQUE7O0FBQUE7O0FBRVosVUFBSVIsUUFBUVMsR0FBUixDQUFZLG9CQUFaLENBQUosRUFBdUM7QUFDbkNWLGNBQU1XLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQiwwQkFBbkIsRUFDMUIsa0JBRDBCLEVBQ04sbUJBRE0sRUFDZSxtQkFEZixFQUNvQyxhQURwQyxDQUF4Qjs7QUFHRixZQUFJVixRQUFRUyxHQUFSLENBQVksc0JBQVosRUFBb0NFLE1BQXhDLEVBQWdEO0FBQzlDLGdCQUFLQyxHQUFMLEdBQVcsSUFBSVQsZUFBSixFQUFYO0FBQ0FILGtCQUFRUyxHQUFSLENBQVksT0FBWixFQUFxQkksZ0JBQXJCLENBQXNDLGlCQUF0QyxFQUF5RCxNQUFLQyxjQUE5RDtBQUNBZCxrQkFBUVMsR0FBUixDQUFZLE9BQVosRUFBcUJJLGdCQUFyQixDQUFzQyx3QkFBdEMsRUFBZ0UsTUFBS0Usd0JBQXJFO0FBRUQ7O0FBRURkLFdBQUdlLElBQUgsQ0FBUSxrQkFB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QVliLElBQVosRUFBa0JvQixPQUFsQixDQUEwQjJCLEdBQTFCLElBQWlDLENBQUMsQ0FBdEMsRUFBeUM7QUFDdkMvQyxtQkFBSytDLEdBQUwsSUFBWTtBQUNWRyxrQ0FBa0JsRCxLQUFLK0MsR0FBTCxDQURSO0FBRVZDLDhCQUFjaEQsS0FBUStDLEdBQVIsY0FGSjtBQUdWRSwyQkFBV2pELEtBQVErQyxHQUFSO0FBSEQsZUFBWjtBQUtBLHFCQUFPL0MsS0FBUStDLEdBQVIsY0FBUDtBQUNBLHFCQUFPL0MsS0FBUStDLEdBQVIsZ0JBQVA7QUFDRDtBQUNGLFdBVkQ7QUFXRDtBQUNELGVBQU8vQyxJQUFQO0FBQ0Q7QUFyTGU7QUFBQTtBQUFBLGtDQXVMSkYsSUF2TEksRUF1TEVTLElBdkxGLEVBdUxRO0FBQ3RCLFlBQUlBLEtBQUtVLE1BQUwsQ0FBWWtDLFNBQVosSUFBeUIsU0FBN0IsRUFBd0M7QUFDdEMsaUJBQVEsSUFBSXRFLFNBQUosQ0FBYyxFQUFFdUUsV0FBVzdDLEtBQUtzQixLQUFsQixFQUFkLENBQUQsQ0FBMkMvQixJQUEzQyxFQUFQO0FBQ0Q7QUFDRCxlQUFPQSxJQUFQO0FBQ0Q7QUE1TGU7O0FBQUE7QUFBQSxJQWdCZXJCLE1BaEJmOztBQStMbEIsU0FBT00sa0JBQVA7QUFDRCxDQWhNRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgTW9kZWxpbmdEYXRhVGFiID0gcmVxdWlyZSgnLi9ibG9ja2x5dGFiL3RhYicpLFxuICAgIC8vU3ltU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zeW1zbGlkZXJmaWVsZC9maWVsZCcpLFxuICAgIC8vU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZCcpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKSxcbiAgICBTeW1TZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3N5bXNlbGVjdGZpZWxkL2ZpZWxkJyksXG4gICAgTW9kZWxWaWV3ID0gcmVxdWlyZSgnLi90aHJlZXZpZXcnKTtcblxuICBjb25zdCBkZWZhdWx0Q29uZmlncyA9IHJlcXVpcmUoJy4vYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2xpc3RvZmNvbmZpZ3MnKVxuXG5cbiAgY2xhc3MgTW9kZWxpbmdEYXRhTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbGluZycpKSB7XG4gICAgICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25QaGFzZUNoYW5nZScsICdfb25FeHBlcmltZW50Q291bnRDaGFuZ2UnLFxuICAgICAgICAnX2hvb2tNb2RlbEZpZWxkcycsICdfaG9va01vZGlmeUV4cG9ydCcsICdfaG9va01vZGlmeUltcG9ydCcsICdfaG9vazNkVmlldyddKVxuXG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnRhYnMnKS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLnRhYiA9IG5ldyBNb2RlbGluZ0RhdGFUYWIoKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKVxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB0aGlzLl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSlcblxuICAgICAgICB9XG5cbiAgICAgICAgSE0uaG9vaygnTW9kZWxGb3JtLkZpZWxkcycsIHRoaXMuX2hvb2tNb2RlbEZpZWxkcyk7XG4gICAgICAgIEhNLmhvb2soJ01vZGVsRm9ybS5Nb2RpZnlFeHBvcnQnLCB0aGlzLl9ob29rTW9kaWZ5RXhwb3J0KTtcbiAgICAgICAgSE0uaG9vaygnTW9kZWxGb3JtLk1vZGlmeUltcG9ydCcsIHRoaXMuX2hvb2tNb2RpZnlJbXBvcnQpO1xuICAgICAgICBITS5ob29rKCdFdWdsZW5hLjNkVmlldycsIHRoaXMuX2hvb2szZFZpZXcpXG5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBydW4oKSB7XG4gICAgICBpZiAodGhpcy50YWIpIEdsb2JhbHMuZ2V0KCdMYXlvdXQnKS5nZXRQYW5lbCgncmVzdWx0JykuYWRkQ29udGVudCh0aGlzLnRhYi52aWV3KCkpXG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy50YWIuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRDb3VudENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5jb3VudCAmJiAhZXZ0LmRhdGEub2xkKSB7XG4gICAgICAgIHRoaXMudGFiLnNob3coKTtcbiAgICAgIH0gZWxzZSBpZiAoIWV2dC5kYXRhLmNvdW50KSB7XG4gICAgICAgIHRoaXMudGFiLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaG9va01vZGVsRmllbGRzKGZpZWxkcywgbWV0YSkge1xuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICB2YXIgYm9keUNvbmZpZ3MgPSBBcnJheS5hcHBseShudWxsLCB7bGVuZ3RoOk9iamVjdC5rZXlzKGRlZmF1bHRDb25maWdzKS5sZW5ndGh9KS5tYXAoKG51bWJlcixpbmQpID0+ICdzZW5zb3JDb25maWdfJyArIChpbmQrMSkpO1xuICAgICAgICAvLyBGaWx0ZXIgb3V0IHRoZSBvcHRpb25zIHRoYXQgYXJlIG5vdCBpbiBhbGxvd2VkQ29uZmlnc1xuICAgICAgICBpZiAobWV0YS5jb25maWcuYWxsb3dlZENvbmZpZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgZm9yIChsZXQgaWR4ID0gYm9keUNvbmZpZ3MubGVuZ3RoIC0gMTsgaWR4ID49IDA7IGlkeC0tKSB7XG4gICAgICAgICAgICBpZiAoKG1ldGEuY29uZmlnLmFsbG93ZWRDb25maWdzLmluZGV4T2YoZGVmYXVsdENvbmZpZ3NbYm9keUNvbmZpZ3NbaWR4XV0uaWQudG9Mb3dlckNhc2UoKSkgPT0gLTEpKSB7XG4gICAgICAgICAgICAgIGJvZHlDb25maWdzLnNwbGljZShpZHgsMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib2R5Q29uZmlnT3B0aW9ucyA9IHt9XG4gICAgICAgIGJvZHlDb25maWdzLm1hcChib2R5Y29uZmlnID0+IHRoaXMuYm9keUNvbmZpZ09wdGlvbnNbYm9keWNvbmZpZ10gPSBkZWZhdWx0Q29uZmlnc1tib2R5Y29uZmlnXVsnaWQnXSlcbiAgICAgICAgZmllbGRzID0gZmllbGRzLmNvbmNhdChbU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiBcImJvZHlDb25maWd1cmF0aW9uTmFtZVwiLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5ib2R5Q29uZmlndXJhdGlvbi5jb2xvciA/IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5ib2R5Q29uZmlndXJhdGlvbi5sYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy5ib2R5Q29uZmlndXJhdGlvbi5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtaW5fd2lkdGg6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLm1pbl93aWR0aCxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXRhLmNvbmZpZy5ib2R5Q29uZmlndXJhdGlvbi5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogdGhpcy5ib2R5Q29uZmlnT3B0aW9uc1xuICAgICAgICAgIH0pLCBTeW1TZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICd2JyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICB2YXJPcHRpb25zOiBtZXRhLmNvbmZpZy52LnZhck9wdGlvbnMsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcudi5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy52LmNvbG9yID8gbWV0YS5jb25maWcudi5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcudi5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcudi5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXRhLmNvbmZpZy52LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy52Lm9wdGlvbnNcbiAgICAgICAgICB9KSwgU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnaycsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgdmFyT3B0aW9uczogbWV0YS5jb25maWcuSy52YXJPcHRpb25zLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLksubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcuSy5jb2xvciA/IG1ldGEuY29uZmlnLksuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLksuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLksubWF4VmFsdWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogbWV0YS5jb25maWcuSy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcuSy5vcHRpb25zXG4gICAgICAgICAgfSlcbiAgICAgICAgXSlcblxuICAgICAgICAvLyBBZGQgZWl0aGVyIHJvbGwgb3IgbW90aW9uIHR5cGUgb3B0aW9uXG4gICAgICAgIGlmIChtZXRhLmNvbmZpZy5vbWVnYSkge1xuICAgICAgICAgIGZpZWxkcy5zcGxpY2UoMywwLFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ29tZWdhJyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICB2YXJPcHRpb25zOiBtZXRhLmNvbmZpZy5vbWVnYS52YXJPcHRpb25zLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLm9tZWdhLmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm9tZWdhLmNvbG9yID8gbWV0YS5jb25maWcub21lZ2EuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLm9tZWdhLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy5vbWVnYS5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXRhLmNvbmZpZy5vbWVnYS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcub21lZ2Eub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGEuY29uZmlnLm1vdGlvbikge1xuICAgICAgICAgIGZpZWxkcy5zcGxpY2UoMywwLFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ21vdGlvbicsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLm1vdGlvbi5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5tb3Rpb24uY29sb3IgPyBtZXRhLmNvbmZpZy5tb3Rpb24uY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLm1vdGlvbi5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcubW90aW9uLm1heFZhbHVlLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IG1ldGEuY29uZmlnLm1vdGlvbi5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcubW90aW9uLm9wdGlvbnNcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBvcGFjaXR5XG4gICAgICAgIGlmIChtZXRhLmNvbmZpZy5vcGFjaXR5KSB7XG4gICAgICAgICAgZmllbGRzLnNwbGljZSgxLDAsU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnb3BhY2l0eScsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgdmFyT3B0aW9uczogbWV0YS5jb25maWcub3BhY2l0eS52YXJPcHRpb25zLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLm9wYWNpdHkubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcub3BhY2l0eS5jb2xvciA/IG1ldGEuY29uZmlnLm9wYWNpdHkuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLm9wYWNpdHkuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLm9wYWNpdHkubWF4VmFsdWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogbWV0YS5jb25maWcub3BhY2l0eS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcub3BhY2l0eS5vcHRpb25zXG4gICAgICAgICAgfSkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgfVxuXG4gICAgX2hvb2tNb2RpZnlFeHBvcnQoZXhwLCBtZXRhKSB7XG5cbiAgICAgIGlmIChtZXRhLnR5cGUgPT0gXCJibG9ja2x5XCIpIHtcbiAgICAgICAgWydrJywgJ3YnLCAnb21lZ2EnLCdvcGFjaXR5JywnbW90aW9uJ10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGV4cCkuaW5kZXhPZihrZXkpID4tMSkge1xuICAgICAgICAgICAgZXhwW2Ake2tleX1fbnVtZXJpY2BdID0gZXhwW2tleV0ubnVtZXJpY1ZhbHVlO1xuICAgICAgICAgICAgZXhwW2Ake2tleX1fdmFyaWF0aW9uYF0gPSBleHBba2V5XS52YXJpYXRpb247XG4gICAgICAgICAgICBleHBba2V5XSA9IGV4cFtrZXldLnF1YWxpdGF0aXZlVmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZXhwXG4gICAgfVxuXG4gICAgX2hvb2tNb2RpZnlJbXBvcnQoZGF0YSwgbWV0YSkge1xuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICBbJ2snLCAndicsICdvbWVnYScsJ29wYWNpdHknLCdtb3Rpb24nXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YSkuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgICAgIGRhdGFba2V5XSA9IHtcbiAgICAgICAgICAgICAgcXVhbGl0YXRpdmVWYWx1ZTogZGF0YVtrZXldLFxuICAgICAgICAgICAgICBudW1lcmljVmFsdWU6IGRhdGFbYCR7a2V5fV9udW1lcmljYF0sXG4gICAgICAgICAgICAgIHZhcmlhdGlvbjogZGF0YVtgJHtrZXl9X3ZhcmlhdGlvbmBdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGVsZXRlIGRhdGFbYCR7a2V5fV9udW1lcmljYF07XG4gICAgICAgICAgICBkZWxldGUgZGF0YVtgJHtrZXl9X3ZhcmlhdGlvbmBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIF9ob29rM2RWaWV3KHZpZXcsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLmNvbmZpZy5tb2RlbFR5cGUgPT0gXCJibG9ja2x5XCIpIHtcbiAgICAgICAgcmV0dXJuIChuZXcgTW9kZWxWaWV3KHsgYmFzZUNvbG9yOiBtZXRhLmNvbG9yIH0pKS52aWV3KClcbiAgICAgIH1cbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBNb2RlbGluZ0RhdGFNb2R1bGU7XG59KVxuIl19
