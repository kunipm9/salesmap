"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _invariant = _interopRequireDefault(require("invariant"));

var _Bridge2 = _interopRequireDefault(require("./Bridge"));

var _joinName = _interopRequireDefault(require("./joinName"));

var resolveRef = function resolveRef(referance, schema) {
  (0, _invariant.default)(referance.startsWith('#'), 'Reference is not an internal reference, and only such are allowed: "%s"', referance);
  var resolvedReference = referance.split('/').filter(function (part) {
    return part && part !== '#';
  }).reduce(function (definition, next) {
    return definition[next];
  }, schema);
  (0, _invariant.default)(resolvedReference, 'Reference not found in schema: "%s"', referance);
  return resolvedReference;
};

var distinctSchema = function distinctSchema(schema) {
  if (schema.type === 'object') {
    return schema;
  }

  if (schema.$ref) {
    return (0, _objectSpread2.default)({}, schema, resolveRef(schema.$ref, schema));
  }

  return schema;
};

var JSONSchemaBridge =
/*#__PURE__*/
function (_Bridge) {
  (0, _inherits2.default)(JSONSchemaBridge, _Bridge);

  function JSONSchemaBridge(schema, validator) {
    var _this;

    (0, _classCallCheck2.default)(this, JSONSchemaBridge);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(JSONSchemaBridge).call(this));
    _this.schema = distinctSchema(schema);
    _this._compiledSchema = {};
    _this.validator = validator;
    return _this;
  }

  (0, _createClass2.default)(JSONSchemaBridge, [{
    key: "getError",
    value: function getError(name, error) {
      return error && error.details && error.details.find && error.details.find(function (detail) {
        return detail.dataPath && detail.dataPath.substring(1) === name;
      });
    }
  }, {
    key: "getErrorMessage",
    value: function getErrorMessage(name, error) {
      var scopedError = this.getError(name, error) || {};
      return scopedError && scopedError.message || '';
    }
  }, {
    key: "getErrorMessages",
    value: function getErrorMessages(error) {
      if (error) {
        if (Array.isArray(error.details)) {
          return error.details.reduce(function (acc, _ref) {
            var message = _ref.message;
            return acc.concat(message);
          }, []);
        }

        return [error.message || error];
      }

      return [];
    }
  }, {
    key: "getField",
    value: function getField(name) {
      var _this2 = this;

      return (0, _joinName.default)(null, name).reduce(function (definition, next, nextIndex, array) {
        var previous = (0, _joinName.default)(array.slice(0, nextIndex));
        var isRequired = (definition.required || (_this2._compiledSchema[previous] || {}).required || []).includes(next);

        var _key = (0, _joinName.default)(previous, next);

        var _definition = _this2._compiledSchema[_key] || {};

        if (next === '$' || next === '' + parseInt(next, 10)) {
          (0, _invariant.default)(definition.type === 'array', 'Field not found in schema: "%s"', name);
          definition = Array.isArray(definition.items) ? definition.items[parseInt(next, 10)] : definition.items;
        } else if (definition.type === 'object') {
          (0, _invariant.default)(definition.properties, 'Field properties not found in schema: "%s"', name);
          definition = definition.properties[next];
        } else {
          var _filter$map = ['allOf', 'anyOf', 'oneOf'].filter(function (key) {
            return definition[key];
          }).map(function (key) {
            return definition[key].find(function (_ref2) {
              var _ref2$properties = _ref2.properties,
                  properties = _ref2$properties === void 0 ? {} : _ref2$properties;
              return properties[next];
            });
          }),
              _filter$map2 = (0, _slicedToArray2.default)(_filter$map, 1),
              _filter$map2$ = _filter$map2[0];

          _filter$map2$ = _filter$map2$ === void 0 ? {} : _filter$map2$;
          var _filter$map2$$propert = _filter$map2$.properties,
              combinedDefinition = _filter$map2$$propert === void 0 ? {} : _filter$map2$$propert;
          definition = combinedDefinition[next];
        }

        (0, _invariant.default)(definition, 'Field not found in schema: "%s"', name);

        if (definition.$ref) {
          definition = resolveRef(definition.$ref, _this2.schema);
        }

        ['allOf', 'anyOf', 'oneOf'].filter(function (key) {
          return definition[key];
        }).forEach(function (key) {
          _definition[key] = definition[key].map(function (def) {
            return def.$ref ? resolveRef(def.$ref, _this2.schema) : def;
          });
        }); // Naive computation of combined type, properties and required

        if (['allOf', 'anyOf', 'oneOf'].filter(function (key) {
          return definition[key];
        }).length) {
          _definition.type = ([].concat(_definition.allOf, _definition.anyOf, _definition.oneOf).filter(function (def) {
            return def;
          }).find(function (def) {
            return def.type;
          }) || {}).type;

          var _concat$filter$reduce = [].concat(_definition.allOf, _definition.anyOf, _definition.oneOf).filter(function (def) {
            return def;
          }).reduce(function (_ref3, _ref4) {
            var _ref5 = (0, _slicedToArray2.default)(_ref3, 2),
                _properties = _ref5[0],
                _required = _ref5[1];

            var properties = _ref4.properties,
                required = _ref4.required;
            return [Object.assign(_properties, properties), _required.concat(required)];
          }, [{}, []]),
              _concat$filter$reduce2 = (0, _slicedToArray2.default)(_concat$filter$reduce, 2),
              properties = _concat$filter$reduce2[0],
              required = _concat$filter$reduce2[1];

          _definition.properties = properties;
          _definition.required = required;
        }

        _this2._compiledSchema[_key] = Object.assign(_definition, {
          isRequired: isRequired
        });
        return definition;
      }, this.schema);
    }
  }, {
    key: "getInitialValue",
    value: function getInitialValue(name) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var _this$getField = this.getField(name),
          _default = _this$getField.default,
          _type = _this$getField.type;

      var _this$_compiledSchema = this._compiledSchema[name],
          _this$_compiledSchema2 = _this$_compiledSchema.default,
          defaultValue = _this$_compiledSchema2 === void 0 ? _default : _this$_compiledSchema2,
          _this$_compiledSchema3 = _this$_compiledSchema.type,
          type = _this$_compiledSchema3 === void 0 ? _type : _this$_compiledSchema3;

      if (type === 'array') {
        var item = this.getInitialValue((0, _joinName.default)(name, '0'));
        var items = props.initialCount || 0;
        return (0, _toConsumableArray2.default)(Array(items)).map(function () {
          return item;
        });
      }

      if (type === 'object') {
        return {};
      }

      return defaultValue;
    }
  }, {
    key: "getProps",
    value: function getProps(name) {
      var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref6$label = _ref6.label,
          label = _ref6$label === void 0 ? true : _ref6$label,
          opts = _ref6.options,
          placeholder = _ref6.placeholder,
          props = (0, _objectWithoutProperties2.default)(_ref6, ["label", "options", "placeholder"]);

      var _this$getField2 = this.getField(name),
          _title = _this$getField2.title,
          _enum = _this$getField2.enum,
          _type = _this$getField2.type,
          _options = _this$getField2.options,
          uniforms = _this$getField2.uniforms;

      var _this$_compiledSchema4 = this._compiledSchema[name],
          _this$_compiledSchema5 = _this$_compiledSchema4.enum,
          allowedValues = _this$_compiledSchema5 === void 0 ? _enum : _this$_compiledSchema5,
          _this$_compiledSchema6 = _this$_compiledSchema4.options,
          options = _this$_compiledSchema6 === void 0 ? _options : _this$_compiledSchema6,
          _this$_compiledSchema7 = _this$_compiledSchema4.type,
          fieldType = _this$_compiledSchema7 === void 0 ? _type : _this$_compiledSchema7,
          isRequired = _this$_compiledSchema4.isRequired;

      var _joinName$slice$map = (0, _joinName.default)(null, name).slice(-1).map(function (str) {
        return str.replace(/([A-Z])/g, ' $1');
      }),
          _joinName$slice$map2 = (0, _slicedToArray2.default)(_joinName$slice$map, 1),
          fieldName = _joinName$slice$map2[0];

      var fieldNameCapitalized = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase();
      var labelContent = _title ? _title : fieldNameCapitalized;
      var ready = (0, _objectSpread2.default)({
        allowedValues: allowedValues
      }, fieldType === 'number' ? {
        decimal: true
      } : {}, {
        options: opts || options,
        label: label === true ? labelContent : label || '',
        placeholder: placeholder === true ? labelContent : placeholder,
        required: isRequired
      });

      if (ready.options) {
        if (!Array.isArray(ready.options)) {
          ready.transform = function (value) {
            return ready.options[value];
          };

          ready.allowedValues = Object.keys(ready.options);
        } else {
          ready.transform = function (value) {
            return ready.options.find(function (option) {
              return option.value === value;
            }).label;
          };

          ready.allowedValues = ready.options.map(function (option) {
            return option.value;
          });
        }
      }

      return (0, _objectSpread2.default)({}, uniforms, ready, props);
    }
  }, {
    key: "getSubfields",
    value: function getSubfields(name) {
      if (!name) {
        if (this.schema.properties) {
          return Object.keys(this.schema.properties);
        }

        return [];
      }

      var _this$getField3 = this.getField(name),
          _type = _this$getField3.type,
          _properties = _this$getField3.properties;

      var _this$_compiledSchema8 = this._compiledSchema[name],
          _this$_compiledSchema9 = _this$_compiledSchema8.type,
          fieldType = _this$_compiledSchema9 === void 0 ? _type : _this$_compiledSchema9,
          _this$_compiledSchema10 = _this$_compiledSchema8.properties,
          fieldProperties = _this$_compiledSchema10 === void 0 ? _properties : _this$_compiledSchema10;

      if (fieldType === 'object') {
        return Object.keys(fieldProperties);
      }

      return [];
    }
  }, {
    key: "getType",
    value: function getType(name) {
      var _this$getField4 = this.getField(name),
          _type = _this$getField4.type,
          fieldFormat = _this$getField4.format;

      var _this$_compiledSchema11 = this._compiledSchema[name].type,
          fieldType = _this$_compiledSchema11 === void 0 ? _type : _this$_compiledSchema11;
      if (fieldFormat === 'date-time') return Date;
      if (fieldType === 'string') return String;
      if (fieldType === 'number') return Number;
      if (fieldType === 'integer') return Number;
      if (fieldType === 'object') return Object;
      if (fieldType === 'array') return Array;
      if (fieldType === 'boolean') return Boolean;
      (0, _invariant.default)(fieldType !== 'null', 'Field "%s" can not be represented as a type null', name);
      return fieldType;
    }
  }, {
    key: "getValidator",
    value: function getValidator() {
      return this.validator;
    }
  }], [{
    key: "check",
    value: function check() {
      return false;
    }
  }]);
  return JSONSchemaBridge;
}(_Bridge2.default);

exports.default = JSONSchemaBridge;