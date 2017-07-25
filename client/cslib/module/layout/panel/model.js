'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseModel = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    contents: []
  };

  return function (_BaseModel) {
    _inherits(LayoutPanelModel, _BaseModel);

    function LayoutPanelModel(config) {
      _classCallCheck(this, LayoutPanelModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      if (!config.data.id) config.data.id = Utils.guid4();
      return _possibleConstructorReturn(this, (LayoutPanelModel.__proto__ || Object.getPrototypeOf(LayoutPanelModel)).call(this, config));
    }

    _createClass(LayoutPanelModel, [{
      key: 'addContent',
      value: function addContent(content) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var contents = this.get('contents');
        if (index === null || index >= contents.length) {
          contents.push(content);
        } else {
          contents.splice(index, 0, content);
        }
        this.set('contents', contents);
      }
    }, {
      key: 'removeContent',
      value: function removeContent(content) {
        var contents = this.get('contents');
        if (contents.includes(content)) {
          contents.splice(contents.indexOf(content), 1);
          this.set('contents', contents);
        }
      }
    }]);

    return LayoutPanelModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9sYXlvdXQvcGFuZWwvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkJhc2VNb2RlbCIsIlV0aWxzIiwiZGVmYXVsdHMiLCJjb250ZW50cyIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwiZGF0YSIsImlkIiwiZ3VpZDQiLCJjb250ZW50IiwiaW5kZXgiLCJnZXQiLCJsZW5ndGgiLCJwdXNoIiwic3BsaWNlIiwic2V0IiwiaW5jbHVkZXMiLCJpbmRleE9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsa0JBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxXQUFXO0FBQ1RDLGNBQVU7QUFERCxHQUZiOztBQU1BO0FBQUE7O0FBQ0UsOEJBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEJBLGFBQU9GLFFBQVAsR0FBa0JELE1BQU1JLGNBQU4sQ0FBcUJELE9BQU9GLFFBQTVCLEVBQXNDQSxRQUF0QyxDQUFsQjtBQUNBLFVBQUksQ0FBQ0UsT0FBT0UsSUFBUCxDQUFZQyxFQUFqQixFQUFxQkgsT0FBT0UsSUFBUCxDQUFZQyxFQUFaLEdBQWlCTixNQUFNTyxLQUFOLEVBQWpCO0FBRkgsaUlBR1pKLE1BSFk7QUFJbkI7O0FBTEg7QUFBQTtBQUFBLGlDQU9hSyxPQVBiLEVBT29DO0FBQUEsWUFBZEMsS0FBYyx1RUFBTixJQUFNOztBQUNoQyxZQUFNUCxXQUFXLEtBQUtRLEdBQUwsQ0FBUyxVQUFULENBQWpCO0FBQ0EsWUFBSUQsVUFBVSxJQUFWLElBQWtCQSxTQUFTUCxTQUFTUyxNQUF4QyxFQUFnRDtBQUM5Q1QsbUJBQVNVLElBQVQsQ0FBY0osT0FBZDtBQUNELFNBRkQsTUFFTztBQUNMTixtQkFBU1csTUFBVCxDQUFnQkosS0FBaEIsRUFBdUIsQ0FBdkIsRUFBMEJELE9BQTFCO0FBQ0Q7QUFDRCxhQUFLTSxHQUFMLENBQVMsVUFBVCxFQUFxQlosUUFBckI7QUFDRDtBQWZIO0FBQUE7QUFBQSxvQ0FpQmdCTSxPQWpCaEIsRUFpQnlCO0FBQ3JCLFlBQU1OLFdBQVcsS0FBS1EsR0FBTCxDQUFTLFVBQVQsQ0FBakI7QUFDQSxZQUFJUixTQUFTYSxRQUFULENBQWtCUCxPQUFsQixDQUFKLEVBQWdDO0FBQzlCTixtQkFBU1csTUFBVCxDQUFnQlgsU0FBU2MsT0FBVCxDQUFpQlIsT0FBakIsQ0FBaEIsRUFBMkMsQ0FBM0M7QUFDQSxlQUFLTSxHQUFMLENBQVMsVUFBVCxFQUFxQlosUUFBckI7QUFDRDtBQUNGO0FBdkJIOztBQUFBO0FBQUEsSUFBc0NILFNBQXRDO0FBeUJELENBaENEIiwiZmlsZSI6Im1vZHVsZS9sYXlvdXQvcGFuZWwvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
