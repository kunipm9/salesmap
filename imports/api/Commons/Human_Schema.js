console.log("Commons_Human_Schema");

/// Sys - AutoForm - collection
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import {
  getCurrentFormName,
  checkFormState,
  generateFieldName,
  getFieldValue
} from "@imports/api/lib/CollectionUtils";
/// Sys - AutoForm - collection --

/// Sys - Schema - common
import { Commons_Sex_Schema } from "@imports/api/Commons/Commons_Schema";
/// Sys - Schema - common --

/// Custom - AutoForm - layout
import ImageField from "@imports/ui/uniforms/ImageField";
/// Custom - AutoForm - layout --

/// Custom - AutoForm - input
let AutoKana;
let moji;
if (Meteor.isClient) {
  AutoKana = require("vanilla-autokana");
  moji = require("moji");
}
let autokana;

import moment from "moment";
moment.locale("ja");
/// Custom - AutoForm - input --

/// Custom - AutoForm - schema
const _ = require("lodash"); // eslint-disable-line no-unused-vars
/// Custom - AutoForm - schema --

/// Sys - AutoForm - schema
export const Humans_Identity_Schema = new SimpleSchema({
  name: {
    optional: true,
    type: String,
    uniforms: {
      label: "氏名",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
      onMounted: function(nameFormField) {
        setTimeout(() => {
          autokana = AutoKana.bind("#" + nameFormField.id, "", {
            katakana: true
          });
        });
      },
      onBlur: function(nameFormField) {
        const formName = getCurrentFormName();
        if (!checkFormState(formName)) return;

        const nameFormFieldName = nameFormField.name;
        const kanaFormFieldName = generateFieldName(
          formName,
          nameFormFieldName,
          0,
          "kana"
        );
        const furigana = autokana.getFurigana();
        nameFormField.onChange(furigana, kanaFormFieldName);

        window.$GLOBAL$.__HumanIdentityNameField__setNameByInputField__ = true;

        autokana.initializeValues();
      }
    }
  },
  kana: {
    optional: true,
    type: String,
    uniforms: {
      label: "カナ",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
      onBlur: function(kanaFormField) {
        const formName = getCurrentFormName();
        if (!checkFormState(formName)) return;

        const kanaFormFieldName = kanaFormField.name;
        const value = getFieldValue(formName, kanaFormFieldName) || "";
        const furigana = moji(value)
          .convert("HG", "KK")
          .convert("HK", "ZK")
          .toString();
        kanaFormField.onChange(furigana);
      }
    }
  },
  birthDay: {
    optional: true,
    type: Date,
    custom: function() {
      var myMaxDate = new Date();
      if(myMaxDate < this.value) {
          return 'maxDate';  //Error string according to the docs.
      } else {
          return true;
      }
    },
    uniforms: {
      label: "生年月日",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
      max: moment(new Date()).format('YYYY-MM-DD')
    }
  },
  age: {
    optional: true,
    type: String,
    uniforms: {
      label: "年齢",
      type: "number",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "生年月日が不明な場合、こちらに見た目年齢を入力",
      className: "col col-12 col-lg-3 col-xl-3",
      triggerField: ["birthDay"],
      calc: function(thisFormField) {
        const formName = getCurrentFormName();
        if (!checkFormState(formName)) return;

        const thisFieldName = thisFormField.name;
        const birthFieldName = generateFieldName(
          formName,
          thisFieldName,
          0,
          "birthDay"
        );

        const birthFieldValue = getFieldValue(formName, birthFieldName);
        if (birthFieldValue) {
          const age = moment().diff(birthFieldValue, 'years');
          thisFormField.onChange(age, thisFieldName);
        }
      }
    }
  },
  dateOfDeath: {
    optional: true,
    type: Object,
    uniforms: {
      label: "物故日",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      wrapClass: "row mui-Row-custom"
    }
  },
  "dateOfDeath.y": {
    optional: true,
    type: Number,
    uniforms: {
      label: null,
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "年",
      className: "col col-3 col-lg-3 col-xl-3"
    }
  },
  "dateOfDeath.m": {
    optional: true,
    type: Number,
    uniforms: {
      label: null,
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "月",
      className: "col col-2 col-lg-2 col-xl-2"
    }
  },
  "dateOfDeath.d": {
    optional: true,
    type: Number,
    uniforms: {
      label: null,
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "日",
      className: "col col-2 col-lg-2 col-xl-2"
    }
  },
  sex: _.merge(true, Commons_Sex_Schema._schema.sex, {optional: true}),
  /// Custom - AutoForm - collection image
  Images_id: {
    optional: true,
    type: String,
    uniforms: {
      label: "写真",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12",
      component: ImageField,
      style: { width: "64px" }
    }
  }
  /// Custom - AutoForm - collection image --
});

export const Humans_Belongs_Schema = new SimpleSchema({});
