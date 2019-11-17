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

/// Custom - AutoForm - schema
const _ = require("lodash"); // eslint-disable-line no-unused-vars
/// Custom - AutoForm - schema --

/// Sys - AutoForm - schema
export const Commons_Sex_Schema = new SimpleSchema({
  sex: {
    type: String,
    uniforms: {
      label: "性別",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
      options: [
        { label: "未入力", value: "" },
        { label: "男性", value: "male" },
        { label: "女性", value: "famale" }
      ]
    }
  }
});

/// Sys - AutoForm - schema
export const Commons_Prefecture_Schema = new SimpleSchema({
  pref: {
    type: String,
    uniforms: {
      label: "都道府県",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-2 col-xl-2",
      options: [
        {
          label: "北海道・東北",
          options: [
            { label: "北海道", value: "北海道" },
            { label: "青森県", value: "青森県" },
            { label: "岩手県", value: "岩手県" },
            { label: "秋田県", value: "秋田県" },
            { label: "宮城県", value: "宮城県" },
            { label: "山形県", value: "山形県" },
            { label: "福島県", value: "福島県" }
          ]
        },
        {
          label: "関東",
          options: [
            { label: "東京都", value: "東京都" },
            { label: "神奈川県", value: "神奈川県" },
            { label: "千葉県", value: "千葉県" },
            { label: "埼玉県", value: "埼玉県" },
            { label: "茨城県", value: "茨城県" },
            { label: "栃木県", value: "栃木県" },
            { label: "群馬県", value: "群馬県" }
          ]
        },
        {
          label: "甲信越・北陸",
          options: [
            { label: "長野県", value: "長野県" },
            { label: "新潟県", value: "新潟県" },
            { label: "山梨県", value: "山梨県" },
            { label: "石川県", value: "石川県" },
            { label: "富山県", value: "富山県" },
            { label: "福井県", value: "福井県" }
          ]
        },
        {
          label: "東海",
          options: [
            { label: "愛知県", value: "愛知県" },
            { label: "岐阜県", value: "岐阜県" },
            { label: "三重県", value: "三重県" },
            { label: "静岡県", value: "静岡県" }
          ]
        },
        {
          label: "関西",
          options: [
            { label: "大阪府", value: "大阪府" },
            { label: "京都府", value: "京都府" },
            { label: "兵庫県", value: "兵庫県" },
            { label: "滋賀県", value: "滋賀県" },
            { label: "奈良県", value: "奈良県" },
            { label: "和歌山県", value: "和歌山県" }
          ]
        },
        {
          label: "中国・四国",
          options: [
            { label: "広島県", value: "広島県" },
            { label: "岡山県", value: "岡山県" },
            { label: "山口県", value: "山口県" },
            { label: "鳥取県", value: "鳥取県" },
            { label: "島根県", value: "島根県" },
            { label: "愛媛県", value: "愛媛県" },
            { label: "香川県", value: "香川県" },
            { label: "徳島県", value: "徳島県" },
            { label: "高知県", value: "高知県" }
          ]
        },
        {
          label: "九州・沖縄",
          options: [
            { label: "福岡県", value: "福岡県" },
            { label: "長崎県", value: "長崎県" },
            { label: "熊本県", value: "熊本県" },
            { label: "佐賀県", value: "佐賀県" },
            { label: "大分県", value: "大分県" },
            { label: "宮崎県", value: "宮崎県" },
            { label: "鹿児島県", value: "鹿児島県" },
            { label: "沖縄県", value: "沖縄県" }
          ]
        }
      ]
    }
  }
});

export const Commons_MapLocation_Schema = new SimpleSchema({
  pos: {
    optional: true,
    type: Object
  },
  "pos.type": {
    type: String
  },
  "pos.coordinates": {
    type: [Number],
    decimal: true,
    minCount: 2,
    maxCount: 2
  },
  shape: {
    optional: true,
    type: Object,
    blackbox: true
  }
});

export const Commons_AddressUnrefined_Schema = new SimpleSchema({
  postalCode: {
    type: String,
    uniforms: {
      label: "郵便番号",
      type: "tel",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-2 col-xl-1",
      onBlur: postalCodeFormField => {
        const formName = getCurrentFormName();
        if (!checkFormState(formName)) return;

        const postalCodeFieldName = postalCodeFormField.name;

        // get postalCode
        const postalCodeFieldValue = getFieldValue(
          formName,
          postalCodeFieldName
        );
        if (!postalCodeFieldValue || postalCodeFieldValue.length != 7) {
          return;
        }

        // get Address
        $.ajax({
          type: "get",
          cache: false,
          url: "http://zipcloud.ibsnet.co.jp/api/search",
          crossDomain: true,
          dataType: "jsonp",
          data: {
            zipcode: postalCodeFieldValue
          },
          success: function(resp) {
            if (resp.status == 200 && resp.results && resp.results.length > 0) {
              const prefecture = resp.results[0].address1; // 都道府県
              const address1 = resp.results[0].address2; // 市区町村
              const address2 = resp.results[0].address3; // 町域

              // set address1
              const address1FieldName = generateFieldName(
                formName,
                postalCodeFieldName,
                0,
                "address1"
              );
              postalCodeFormField.onChange(
                prefecture + address1 + address2,
                address1FieldName
              );
            }
          }
        });
      }
    }
  },
  address1: {
    type: String,
    uniforms: {
      label: "住所1",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-5 col-xl-5"
    }
  },
  address2: {
    optional: true,
    type: String,
    uniforms: {
      label: "住所2",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-4 col-xl-4"
    }
  },
  shopName: {
    optional: true,
    type: String,
    uniforms: {
      label: "店舗名",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-2 col-xl-2"
    }
  }
});

export const Commons_Address_Schema = new SimpleSchema({
  postalCode: {
    optional: true,
    type: String,
    uniforms: {
      label: "郵便番号",
      type: "tel",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-2 col-xl-2",
      onBlur: postalCodeFormField => {
        const formName = getCurrentFormName();
        if (!checkFormState(formName)) return;

        const postalCodeFieldName = postalCodeFormField.name;

        // get postalCode
        const postalCodeFieldValue = getFieldValue(
          formName,
          postalCodeFieldName
        );
        if (!postalCodeFieldValue || postalCodeFieldValue.length != 7) {
          return;
        }

        // get Address
        $.ajax({
          type: "get",
          cache: false,
          url: "http://zipcloud.ibsnet.co.jp/api/search",
          crossDomain: true,
          dataType: "jsonp",
          data: {
            zipcode: postalCodeFieldValue
          },
          success: function(resp) {
            if (resp.status == 200 && resp.results && resp.results.length > 0) {
              const prefecture = resp.results[0].address1; // 都道府県
              const address1 = resp.results[0].address2; // 市区町村
              const address2 = resp.results[0].address3; // 町域

              // set prefecture
              const prefectureFieldName = generateFieldName(
                formName,
                postalCodeFieldName,
                0,
                "prefecture"
              );
              postalCodeFormField.onChange(prefecture, prefectureFieldName);

              // set address1
              const address1FieldName = generateFieldName(
                formName,
                postalCodeFieldName,
                0,
                "addressCity"
              );
              postalCodeFormField.onChange(address1, address1FieldName);

              // set address2
              const address2FieldName = generateFieldName(
                formName,
                postalCodeFieldName,
                0,
                "addressTown"
              );
              postalCodeFormField.onChange(address2, address2FieldName);
            }
          }
        });
      }
    }
  },
  prefecture: _.merge(true, Commons_Prefecture_Schema._schema.pref, {optional: true}),
  addressCity: {
    optional: true,
    type: String,
    uniforms: {
      label: "市区町村",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-2 col-xl-2"
    }
  },
  addressTown: {
    optional: true,
    type: String,
    uniforms: {
      label: "大字丁目",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-2 col-xl-2"
    }
  },
  addressNumber: {
    optional: true,
    type: String,
    uniforms: {
      label: "番地・号",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-2 col-xl-2"
    }
  },
  addressBuilding: {
    optional: true,
    type: String,
    uniforms: {
      label: "建物名",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3"
    }
  },
  addressRoomNo: {
    optional: true,
    type: String,
    uniforms: {
      label: "部屋番号",
      type: "tel",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-2 col-xl-2"
    }
  },
  shopName: {
    optional: true,
    type: String,
    uniforms: {
      label: "店舗名",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-2 col-xl-2"
    }
  }
});

export const Commons_ContactInformation_Schema = new SimpleSchema({
  tels: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "TEL",
      placeholder: "未入力",
      sortable: true,
      className: "col col-12"
    }
  },
  "tels.$.tel": {
    optional: true,
    type: String,
    uniforms: {
      label: null,
      type: "tel",
      className: "col col-12"
    }
  },
  faxs: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "FAX",
      placeholder: "未入力",
      sortable: true,
      className: "col col-12"
    }
  },
  "faxs.$.fax": {
    optional: true,
    type: String,
    uniforms: {
      label: null,
      type: "tel",
      className: "col col-12"
    }
  },
  emails: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "メール",
      placeholder: "未入力",
      sortable: true,
      className: "col col-12"
    }
  },
  "emails.$.address": {
    optional: true,
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    uniforms: {
      className: "col col-12"
    }
  },
  /*
  "emails.$.verified": {
    optional: true,
    type: Boolean,
    uniforms: {
      className: 'col col-12',
    },
  },
*/
  snss: {
    optional: true,
    type: [Object],
    label: "SNS",
    uniforms: {
      sortable: true,
      className: "col col-12"
    }
  },
  "snss.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    uniforms: {
      className: "col col-12"
    }
  },
  "snss.$.verified": {
    optional: true,
    type: Boolean,
    uniforms: {
      className: "col col-12"
    }
  }
});
/// Sys - AutoForm - schema --
