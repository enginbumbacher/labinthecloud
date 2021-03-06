'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager'),
      Utils = require('core/util/utils');

  var Model = require('core/model/model'),
      defaults = {
    id: null,
    alive: false,
    type: 'note',
    message: '',
    autoExpire: null,
    expireLabel: 'OK',
    classes: []
  };

  return function (_Model) {
    _inherits(NoteModel, _Model);

    function NoteModel(config) {
      _classCallCheck(this, NoteModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);

      var _this = _possibleConstructorReturn(this, (NoteModel.__proto__ || Object.getPrototypeOf(NoteModel)).call(this, config));

      if (!_this.get('id')) _this.set('id', Utils.guid4());
      _this.get('classes').push('note__' + _this.get('type'));
      return _this;
    }

    return NoteModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ub3RpZmljYXRpb25zL25vdGUvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJITSIsIlV0aWxzIiwiTW9kZWwiLCJkZWZhdWx0cyIsImlkIiwiYWxpdmUiLCJ0eXBlIiwibWVzc2FnZSIsImF1dG9FeHBpcmUiLCJleHBpcmVMYWJlbCIsImNsYXNzZXMiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImdldCIsInNldCIsImd1aWQ0IiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLEtBQUtGLFFBQVEseUJBQVIsQ0FEUDtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjs7QUFJQSxNQUFNSSxRQUFRSixRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFSyxXQUFXO0FBQ1RDLFFBQUksSUFESztBQUVUQyxXQUFPLEtBRkU7QUFHVEMsVUFBTSxNQUhHO0FBSVRDLGFBQVMsRUFKQTtBQUtUQyxnQkFBWSxJQUxIO0FBTVRDLGlCQUFhLElBTko7QUFPVEMsYUFBUztBQVBBLEdBRGI7O0FBV0E7QUFBQTs7QUFDRSx1QkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT1IsUUFBUCxHQUFrQkYsTUFBTVcsY0FBTixDQUFxQkQsT0FBT1IsUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCOztBQURrQix3SEFFWlEsTUFGWTs7QUFHbEIsVUFBSSxDQUFDLE1BQUtFLEdBQUwsQ0FBUyxJQUFULENBQUwsRUFBcUIsTUFBS0MsR0FBTCxDQUFTLElBQVQsRUFBZWIsTUFBTWMsS0FBTixFQUFmO0FBQ3JCLFlBQUtGLEdBQUwsQ0FBUyxTQUFULEVBQW9CRyxJQUFwQixZQUFrQyxNQUFLSCxHQUFMLENBQVMsTUFBVCxDQUFsQztBQUprQjtBQUtuQjs7QUFOSDtBQUFBLElBQStCWCxLQUEvQjtBQVFELENBeEJEIiwiZmlsZSI6Im1vZHVsZS9ub3RpZmljYXRpb25zL25vdGUvbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpO1xuICBcbiAgY29uc3QgTW9kZWwgPSByZXF1aXJlKCdjb3JlL21vZGVsL21vZGVsJyksXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBpZDogbnVsbCxcbiAgICAgIGFsaXZlOiBmYWxzZSxcbiAgICAgIHR5cGU6ICdub3RlJyxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgYXV0b0V4cGlyZTogbnVsbCxcbiAgICAgIGV4cGlyZUxhYmVsOiAnT0snLFxuICAgICAgY2xhc3NlczogW11cbiAgICB9O1xuXG4gIHJldHVybiBjbGFzcyBOb3RlTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICBjb25maWcuZGVmYXVsdHMgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhjb25maWcuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgICBpZiAoIXRoaXMuZ2V0KCdpZCcpKSB0aGlzLnNldCgnaWQnLCBVdGlscy5ndWlkNCgpKTtcbiAgICAgIHRoaXMuZ2V0KCdjbGFzc2VzJykucHVzaChgbm90ZV9fJHt0aGlzLmdldCgndHlwZScpfWApO1xuICAgIH1cbiAgfVxufSkiXX0=
