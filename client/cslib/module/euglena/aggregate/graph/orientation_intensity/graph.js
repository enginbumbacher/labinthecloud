'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view');

  var OrientationIntensityGraph = function (_Component) {
    _inherits(OrientationIntensityGraph, _Component);

    function OrientationIntensityGraph(settings) {
      _classCallCheck(this, OrientationIntensityGraph);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      return _possibleConstructorReturn(this, (OrientationIntensityGraph.__proto__ || Object.getPrototypeOf(OrientationIntensityGraph)).call(this, settings));
    }

    _createClass(OrientationIntensityGraph, [{
      key: 'update',
      value: function update(datasets) {
        this._model.update(datasets);
      }
    }, {
      key: 'label',
      value: function label() {
        return this._model.get('label');
      }
    }, {
      key: 'toggleResult',
      value: function toggleResult(resId, shown) {
        this.view().toggleResult(resId, shown);
      }
    }]);

    return OrientationIntensityGraph;
  }(Component);

  OrientationIntensityGraph.create = function (data) {
    return new OrientationIntensityGraph({ modelData: data });
  };

  return OrientationIntensityGraph;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl9pbnRlbnNpdHkvZ3JhcGguanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiT3JpZW50YXRpb25JbnRlbnNpdHlHcmFwaCIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImRhdGFzZXRzIiwiX21vZGVsIiwidXBkYXRlIiwiZ2V0IiwicmVzSWQiLCJzaG93biIsInZpZXciLCJ0b2dnbGVSZXN1bHQiLCJjcmVhdGUiLCJkYXRhIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxZQUFZSixRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUssUUFBUUwsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFTSxPQUFPTixRQUFRLFFBQVIsQ0FGVDs7QUFMa0IsTUFTWk8seUJBVFk7QUFBQTs7QUFVaEIsdUNBQVlDLFFBQVosRUFBc0I7QUFBQTs7QUFDcEJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJKLEtBQTdDO0FBQ0FHLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JKLElBQTNDO0FBRm9CLG1KQUdkRSxRQUhjO0FBSXJCOztBQWRlO0FBQUE7QUFBQSw2QkFnQlRHLFFBaEJTLEVBZ0JDO0FBQ2YsYUFBS0MsTUFBTCxDQUFZQyxNQUFaLENBQW1CRixRQUFuQjtBQUNEO0FBbEJlO0FBQUE7QUFBQSw4QkFvQlI7QUFDTixlQUFPLEtBQUtDLE1BQUwsQ0FBWUUsR0FBWixDQUFnQixPQUFoQixDQUFQO0FBQ0Q7QUF0QmU7QUFBQTtBQUFBLG1DQXdCSEMsS0F4QkcsRUF3QklDLEtBeEJKLEVBd0JXO0FBQ3pCLGFBQUtDLElBQUwsR0FBWUMsWUFBWixDQUF5QkgsS0FBekIsRUFBZ0NDLEtBQWhDO0FBQ0Q7QUExQmU7O0FBQUE7QUFBQSxJQVNzQlosU0FUdEI7O0FBNEJsQkcsNEJBQTBCWSxNQUExQixHQUFtQyxVQUFDQyxJQUFELEVBQVU7QUFDM0MsV0FBTyxJQUFJYix5QkFBSixDQUE4QixFQUFFYyxXQUFXRCxJQUFiLEVBQTlCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9iLHlCQUFQO0FBQ0QsQ0FqQ0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL2dyYXBoL29yaWVudGF0aW9uX2ludGVuc2l0eS9ncmFwaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJylcblxuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3Jyk7XG5cbiAgY2xhc3MgT3JpZW50YXRpb25JbnRlbnNpdHlHcmFwaCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgdXBkYXRlKGRhdGFzZXRzKSB7XG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGUoZGF0YXNldHMpO1xuICAgIH1cblxuICAgIGxhYmVsKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnbGFiZWwnKTtcbiAgICB9XG5cbiAgICB0b2dnbGVSZXN1bHQocmVzSWQsIHNob3duKSB7XG4gICAgICB0aGlzLnZpZXcoKS50b2dnbGVSZXN1bHQocmVzSWQsIHNob3duKVxuICAgIH1cbiAgfVxuICBPcmllbnRhdGlvbkludGVuc2l0eUdyYXBoLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBPcmllbnRhdGlvbkludGVuc2l0eUdyYXBoKHsgbW9kZWxEYXRhOiBkYXRhIH0pXG4gIH1cblxuICByZXR1cm4gT3JpZW50YXRpb25JbnRlbnNpdHlHcmFwaDtcbn0pIl19
