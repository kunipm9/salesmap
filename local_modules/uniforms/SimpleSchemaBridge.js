"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _invariant = _interopRequireDefault(require("invariant"));

var _Bridge2 = _interopRequireDefault(require("./Bridge"));

var _joinName = _interopRequireDefault(require("./joinName"));

var _filterDOMProps = _interopRequireDefault(require("./filterDOMProps"));

/* global Package */
var Match = ((typeof global === "undefined" ? "undefined" : (0, _typeof2.default)(global)) === 'object' ? global : window).Match;
var SimpleSchema = ((typeof global === "undefined" ? "undefined" : (0, _typeof2.default)(global)) === 'object' ? global : window).SimpleSchema;
/* istanbul ignore next */

try {
  if (Match === undefined && (typeof Package === "undefined" ? "undefined" : (0, _typeof2.default)(Package)) === 'object') {
    Match = Package['check'].Match;
  }

  if (SimpleSchema === undefined && (typeof Package === "undefined" ? "undefined" : (0, _typeof2.default)(Package)) === 'object') {
    SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
  }
} catch (_) {
  /* Ignore it. */
}

try {
  var r = require; // Silence Meteor missing module warning

  if (Match === undefined) {
    Match = r('meteor/check').Match;
  }

  if (SimpleSchema === undefined) {
    SimpleSchema = r('meteor/aldeed:simple-schema').SimpleSchema;
  }
} catch (_) {
  /* Ignore it. */
}

if (SimpleSchema && Match) {
  SimpleSchema.extendOptions({
    uniforms: Match.Optional(Match.OneOf(String, Function, Match.ObjectIncluding({
      component: Match.Optional(Match.OneOf(String, Function))
    })))
  }); // There's no possibility to retrieve them at runtime

  _filterDOMProps.default.register('allowedValues', 'autoValue', 'blackbox', 'custom', 'decimal', 'defaultValue', 'exclusiveMax', 'exclusiveMin', 'label', 'max', 'maxCount', 'min', 'minCount', 'optional', 'regEx', 'trim', 'type');
}

var SimpleSchemaBridge =
/*#__PURE__*/
function (_Bridge) {
  (0, _inherits2.default)(SimpleSchemaBridge, _Bridge);

  function SimpleSchemaBridge(schema) {
    var _this;

    (0, _classCallCheck2.default)(this, SimpleSchemaBridge);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SimpleSchemaBridge).call(this));
    _this.schema = schema;
    return _this;
  }

  (0, _createClass2.default)(SimpleSchemaBridge, [{
    key: "getError",
    value: function getError(name, error) {
      return error && error.details && error.details.find && error.details.find(function (error) {
        return error.name === name;
      }) || null;
    }
  }, {
    key: "getErrorMessage",
    value: function getErrorMessage(name, error) {
      var scopedError = this.getError(name, error);
      return !scopedError ? '' : this.schema.messageForError(scopedError.type, scopedError.name, null, scopedError.details && scopedError.details.value);
    }
  }, {
    key: "getErrorMessages",
    value: function getErrorMessages(error) {
      var _this2 = this;

      if (error) {
        if (Array.isArray(error.details)) {
          return error.details.map(function (error) {
            return _this2.schema.messageForError(error.type, error.name, null, error.details && error.details.value);
          });
        }

        if (error.message) {
          return [error.message];
        }
      }

      if (error !== undefined) {
        return [error];
      }

      return [];
    }
  }, {
    key: "getField",
    value: function getField(name) {
      var definition = this.schema.getDefinition(name);
      (0, _invariant.default)(definition, 'Field not found in schema: "%s"', name);
      return definition;
    }
  }, {
    key: "getInitialValue",
    value: function getInitialValue(name) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var field = this.getField(name);

      if (field.type === Array) {
        var item = this.getInitialValue((0, _joinName.default)(name, '0'));
        var items = Math.max(props.initialCount || 0, field.minCount || 0);
        return (0, _toConsumableArray2.default)(Array(items)).map(function () {
          return item;
        });
      }

      if (field.type === Object) {
        return {};
      }

      return field.defaultValue;
    } // eslint-disable-next-line complexity

  }, {
    key: "getProps",
    value: function getProps(name) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      // Type should be omitted.
      // eslint-disable-next-line no-unused-vars, prefer-const
      var _this$getField = this.getField(name),
          optional = _this$getField.optional,
          type = _this$getField.type,
          uniforms = _this$getField.uniforms,
          field = (0, _objectWithoutProperties2.default)(_this$getField, ["optional", "type", "uniforms"]);

      field = (0, _objectSpread2.default)({}, field, {
        required: !optional
      });

      if (uniforms) {
        if (typeof uniforms === 'string' || typeof uniforms === 'function') {
          field = (0, _objectSpread2.default)({}, field, {
            component: uniforms
          });
        } else {
          field = (0, _objectSpread2.default)({}, field, uniforms);
        }
      }

      if (type === Array) {
        try {
          var itemProps = this.getProps("".concat(name, ".$"), props);

          if (itemProps.allowedValues && !props.allowedValues) {
            field.allowedValues = itemProps.allowedValues;
          }

          if (itemProps.transform && !props.transform) {
            field.transform = itemProps.transform;
          }
        } catch (_) {
          /* ignore it */
        }
      }

      /// Sys - AutoForm - rebuild field
      var value = props.value || field.value;
      if (value) {
        if (typeof value === 'function') {
          value = value(props);
          field.value = value;
        }
      }
      /// Sys - AutoForm - rebuild field --

      /// Sys - AutoForm - rebuild field
      var onMounted = props.onMounted || field.onMounted;
      if (onMounted) {
        if (typeof onMounted === 'function') {
          const formName = window.$GLOBAL$.changingFormName;
          if (window.$GLOBAL$.fields[formName + ':' + props.name] && ! window.$GLOBAL$.fields[formName + ':' + props.name].isMounted) {
            window.$GLOBAL$.fields[formName + ':' + props.name].isMounted = true;
            onMounted(window.$GLOBAL$.fields[formName + ':' + props.name]);
          }
        }
      }
      /// Sys - AutoForm - rebuild field --

      var options = props.options || field.options;

      if (options) {
        /// Sys - AutoForm - rebuild field
        if (typeof options === 'function') {
          options = options(props);
        }
        /// Sys - AutoForm - rebuild field --

        if (!Array.isArray(options)) {
          field = (0, _objectSpread2.default)({}, field, {
            transform: function transform(value) {
              return options[value];
            },
            allowedValues: Object.keys(options)
          });
        } else {
          field = (0, _objectSpread2.default)({}, field, {
            transform: function transform(value) {
              return options.find(function (option) {
                return option.value === value;
              }).label;
            },
            allowedValues: options.map(function (option) {
              return option.value;
            })
          });
        }
      }

      return field;
    }
  }, {
    key: "getSubfields",
    value: function getSubfields(name) {
      return this.schema.objectKeys(SimpleSchema._makeGeneric(name));
    }
  }, {
    key: "getType",
    value: function getType(name) {
      return this.getField(name).type;
    }
  }, {
    key: "getValidator",
    value: function getValidator() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        clean: true
      };
      var validator = this.schema.validator(options); // Clean mutate its argument.

      if (options.clean) {
        return function (model) {
          return validator((0, _cloneDeep.default)((0, _objectSpread2.default)({}, model)));
        };
      }

      return validator;
    }
  }], [{
    key: "check",
    value: function check(schema) {
      return SimpleSchema && schema && schema.getDefinition && schema.messageForError && schema.objectKeys && schema.validator && schema.version !== 2;
    }
  }]);
  return SimpleSchemaBridge;
}(_Bridge2.default);

exports.default = SimpleSchemaBridge;
