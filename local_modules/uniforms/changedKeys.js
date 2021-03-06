"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = changedKeys;

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _xorWith = _interopRequireDefault(require("lodash/xorWith"));

var _joinName = _interopRequireDefault(require("./joinName"));

function changedKeys(root, valueA, valueB) {
  if (valueA === Object(valueA) && !(valueA instanceof Date)) {
    if (valueB) {
      var pairsA;
      var pairsB;

      if (Array.isArray(valueA)) {
        pairsA = valueA.map(function (value, index) {
          return [value, index];
        });
        pairsB = valueB.map(function (value, index) {
          return [value, index];
        });
      } else {
        pairsA = Object.keys(valueA).map(function (key) {
          return [valueA[key], key];
        });
        pairsB = Object.keys(valueB).map(function (key) {
          return [valueB[key], key];
        });
      }

      var changed = (0, _xorWith.default)(pairsA, pairsB, _isEqual.default).map(function (pair) {
        return (0, _joinName.default)(root, pair[1]);
      });

      if (changed.length) {
        changed.unshift(root);
      }

      return changed;
    }

    return [root].concat(Object.keys(valueA).map(function (key) {
      return (0, _joinName.default)(root, key);
    }));
  }

  return (0, _isEqual.default)(valueA, valueB) ? [] : [root];
}