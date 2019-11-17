import { Tracker } from "meteor/tracker";
import _ from "lodash";

SimpleSchema.messages({
  alreadyExists: "[value] is already exists",
  duplicate: "[value] is duplicated",
  required: "[label] is required",
  minString: "[label] must be at least [min] characters",
  maxString: "[label] cannot exceed [max] characters",
  minNumber: "[label] must be at least [min]",
  maxNumber: "[label] cannot exceed [max]",
  minDate: "[label] must be on or after [min]",
  maxDate: "[label] cannot be after [max]",
  badDate: "[label] is not a valid date",
  minCount: "You must specify at least [minCount] values",
  maxCount: "You cannot specify more than [maxCount] values",
  noDecimal: "[label] must be an integer",
  notAllowed: "[value] is not an allowed value",
  expectedString: "[label] must be a string",
  expectedNumber: "[label] must be a number",
  expectedBoolean: "[label] must be a boolean",
  expectedArray: "[label] must be an array",
  expectedObject: "[label] must be an object",
  expectedConstructor: "[label] must be a [type]",
  regEx: [
    { msg: "[label] failed regular expression validation" },
    {
      exp: SimpleSchema.RegEx.Email,
      msg: "[label] must be a valid e-mail address"
    },
    {
      exp: SimpleSchema.RegEx.WeakEmail,
      msg: "[label] must be a valid e-mail address"
    },
    { exp: SimpleSchema.RegEx.Domain, msg: "[label] must be a valid domain" },
    {
      exp: SimpleSchema.RegEx.WeakDomain,
      msg: "[label] must be a valid domain"
    },
    {
      exp: SimpleSchema.RegEx.IP,
      msg: "[label] must be a valid IPv4 or IPv6 address"
    },
    {
      exp: SimpleSchema.RegEx.IPv4,
      msg: "[label] must be a valid IPv4 address"
    },
    {
      exp: SimpleSchema.RegEx.IPv6,
      msg: "[label] must be a valid IPv6 address"
    },
    { exp: SimpleSchema.RegEx.Url, msg: "[label] must be a valid URL" },
    {
      exp: SimpleSchema.RegEx.Id,
      msg: "[label] must be a valid alphanumeric ID"
    }
  ],
  keyNotInSchema: "[key] is not allowed by the schema"
});

Tracker.autorun(function() {
  const lang = TAPi18n.getLanguage(); // eslint-disable-line no-unused-vars
  const localMessages = TAPi18n.__("simpleschema.messages", {
    returnObjectTrees: true
  });
  localMessages.regEx = _.map(localMessages.regEx, function(item) {
    if (item.exp) {
      let obj = window;
      const path = item.exp.split(".");
      for (let i = 0; i < path.length; i++) {
        obj = obj[path[i]];
      }
      item.exp = obj;
    }
    return item;
  });
  const messages = _.extend(
    _.clone(SimpleSchema._globalMessages),
    localMessages
  );
  SimpleSchema.messages(messages);
});
