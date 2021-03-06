"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectField;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = require("react");

var _BaseField = _interopRequireDefault(require("./BaseField"));

var identity = function identity(x) {
  return x;
};

function connectField(component) {
  var _class, _temp;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$baseField = _ref.baseField,
      baseField = _ref$baseField === void 0 ? _BaseField.default : _ref$baseField,
      _ref$mapProps = _ref.mapProps,
      mapProps = _ref$mapProps === void 0 ? identity : _ref$mapProps,
      ensureValue = _ref.ensureValue,
      includeInChain = _ref.includeInChain,
      includeParent = _ref.includeParent,
      initialValue = _ref.initialValue;

  return _temp = _class =
  /*#__PURE__*/
  function (_baseField) {
    (0, _inherits2.default)(_class, _baseField);

    function _class() {
      var _this;

      (0, _classCallCheck2.default)(this, _class);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).apply(this, arguments));
      _this.options.includeInChain = includeInChain === undefined ? true : includeInChain;
      _this.options.initialValue = initialValue === undefined ? true : initialValue;
      if (ensureValue !== undefined) _this.options.ensureValue = ensureValue;
      if (includeParent !== undefined) _this.options.includeParent = includeParent;
      return _this;
    }

    (0, _createClass2.default)(_class, [{
      key: "getChildContextName",
      value: function getChildContextName() {
        return this.options.includeInChain ? (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "getChildContextName", this).call(this) : this.context.uniforms.name;
      }
    }, {
      key: "componentWillMount",
      value: function componentWillMount() {
        if (this.options.initialValue) {
          var props = this.getFieldProps(undefined, {
            ensureValue: false,
            explicitInitialValue: true,
            includeParent: false
          }); // https://github.com/vazco/uniforms/issues/52
          // If field is initially rendered with value, we treat it as an initial value.

          /// Sys - AutoForm - rebuild field
          var Form_name = this.context.uniforms.model.__Form_name;
          window.$GLOBAL$.fields[Form_name + ':' + props.name] = props;
          /// Sys - AutoForm - rebuild field

          if (this.props.value !== undefined && this.props.value !== props.value) {
            props.onChange(this.props.value);
            return;
          }

          if (props.required && props.initialValue !== undefined && props.value === undefined) {
            props.onChange(props.initialValue);
          }
        }
      }
    }, {
      key: "render",
      value: function render() {
        return (0, _react.createElement)(component, mapProps(this.getFieldProps()));
      }
    }]);
    return _class;
  }(baseField), _class.displayName = "".concat(component.displayName || component.name).concat(baseField.displayName || baseField.name), _temp;
}
