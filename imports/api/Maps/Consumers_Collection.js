console.log("Maps_Consumers_Collection");

/// Sys - AutoForm - collection
import { Tracker } from "meteor/tracker";
import { Session } from "meteor/session";
import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import {
  displayTitle,
  checkFormState,
  getCurrentFormName,
  getFieldValue
} from "@imports/api/lib/CollectionUtils";

const moji = require("moji");
/// Sys - AutoForm - collection --

/// Custom - AutoForm - relation
import { Maps_Ranks_Collection } from "@imports/api/Maps/Ranks_Collection";
import { Maps_Companys_Collection } from "@imports/api/Maps/Companys_Collection";
import { Maps_Associations_Collection } from "@imports/api/Maps/Associations_Collection";
/// Custom - AutoForm - relation --

/// Custom - AutoForm - common schema
import { Humans_Identity_Schema } from "@imports/api/Commons/Human_Schema";
import { Commons_ContactInformation_Schema } from "@imports/api/Commons/Commons_Schema";
import {
  Commons_AddressUnrefined_Schema,
  Commons_Address_Schema,
  Commons_MapLocation_Schema
} from "@imports/api/Commons/Commons_Schema";
/// Custom - AutoForm - common schema --

/// Custom - AutoForm - layout
import ImageField from "@imports/ui/uniforms/ImageField";
/// Custom - AutoForm - layout --

/// Custom - AutoForm - rebuild field
const _ = require("lodash"); // eslint-disable-line no-unused-vars
/// Custom - AutoForm - rebuild field --

/// Custom - AutoForm - layout
import NullField from "@imports/ui/uniforms/NullField";
import NestField from "@imports/ui/uniforms/NestField";
import MapField from "@imports/ui/uniforms/MapField";
import MapTagField from "@imports/ui/app/MapTagField";
import MapAddressField from "@imports/ui/app/MapAddressField";
/// Custom - AutoForm - layout --

/// Custom - localCollection - update trigger
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";
/// Custom - localCollection - update trigger --

/// Custom - Collection
export const Maps_Consumers_Collection = new Mongo.Collection("Maps_Consumers");

/// Custom - localCollection - update trigger
Maps_Consumers_Collection.before.insert(function (userId, doc) {
  doc.createdAt = Date.now();
  doc.createdBy = userId;
  doc._modifiedAt = doc.createdAt;
});

Maps_Consumers_Collection.before.update(function (
  userId,
  doc,
  fieldNames,
  modifier
) {
  modifier.$set = modifier.$set || {};
  modifier.$set.modifiedAt = Date.now();
  modifier.$set.modifiedBy = userId;
  modifier.$set._modifiedAt = modifier.$set.modifiedAt;

console.log("---- UPD", doc._id, _.get(doc, "identity.name"), modifier.$set.modifiedAt);
});
/// Custom - localCollection - update trigger --

/// Custom - localCollection - versioning
Maps_Consumers_Collection._schemaVersion = 20191007;
/// Custom - localCollection - versioning --
/// Custom - Collection --

/// Custom - Persister
if (Meteor.isClient) {
  Maps_Consumers_Collection.attachPersister();
}
/// Custom - Persister --

/// Custom - AutoForm - schema
const Maps_Consumers_Schema = new SimpleSchema({
  _id: {
    optional: true,
    type: String,
    uniforms: {
      component: NullField
    }
  },
  /// Custom - Collection - soft delete
  _deleted: {
    optional: true,
    type: String,
    defaultValue: null,
    uniforms: {
      component: NullField
    }
  },
  /// Custom - Collection - soft delete --
  /// Custom - Collection - optimistic lock
  modifiedAt: {
    optional: true,
    type: Number,
    defaultValue: null,
    uniforms: {
      component: NullField
    }
  },
  /// Custom - Collection - optimistic lock --
  Users_Groups_id: {
    optional: true,
    type: String,
    label: "User Group",
    uniforms: {
      component: NullField
    }
  },
  identity: {
    optional: true,
    type: Humans_Identity_Schema,
    uniforms: {
      component: NestField,
      className: "col col-12",
      collapsable: true,
      frameset: "card"
    }
  },
  residenceAddress: {
    optional: true,
    type: Object,
    uniforms: {
      label: "住所",
      placeholder: "未入力",
      component: NestField,
      className: "col col-12",
      collapsable: true,
      frameset: "card"
    }
  },
  "residenceAddress.addressUnrefined": {
    optional: true,
    type: Commons_AddressUnrefined_Schema,
    uniforms: {
      className: "col col-12",
      component: NestField,
      frameset: "hr"
    }
  },
  "residenceAddress.refine": {
    optional: true,
    type: Boolean,
    uniforms: {
      className: "col col-12",
      component: MapAddressField,

      onCallback: thisField => {
        console.assert(thisField, "thisField is null");

        const formName = getCurrentFormName();
        const address1 =
          getFieldValue(
            formName,
            "residenceAddress.addressUnrefined.address1"
          ) || "";
        const address2 =
          getFieldValue(
            formName,
            "residenceAddress.addressUnrefined.address2"
          ) || "";
        const name = getFieldValue(formName, "identity.name") || "";
        window.$GLOBAL$.__MapView__.getAddressByString(
          123,
          address1 + address2,
          name
        );
      }
    }
  },
  "residenceAddress.address": {
    optional: true,
    type: Commons_Address_Schema,
    uniforms: {
      label: "住所",
      placeholder: "未入力",
      className: "col col-12",
      component: NestField,
      frameset: "hr"
    }
  },
  "residenceAddress.location": {
    optional: true,
    type: Commons_MapLocation_Schema,
    uniforms: {
      className: "col col-9",
      component: MapField,
      style: {
        width: "100%",
        height: "400px",
        boxShadow:
          "0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15)"
      },

      onMounted: function (thisField) {
        console.assert(thisField, "thisField is null");

        window.$GLOBAL$.__HumanIdentityNameField__setNameByInputField__ = true;
      },

      onCallback: (thisField, event, data) => {
        console.assert(thisField, "thisField is null");
        console.assert(event, "envet is null");
        console.assert(data, "data is null");

        /// Sys - Map - Address
        switch (event) {
          case "getAddressCallback":
            console.log("getAddressCallback", data);

            if (!data) {
              return;
            }

            // identity
            const formName = getCurrentFormName(); // eslint-disable-line no-case-declarations
            const name = getFieldValue(formName, "identity.name") || ""; // eslint-disable-line no-case-declarations

            // 空白または以前地図クリックによる名前の設定が発生した場合は、名前項目を上書き
            if (
              (!name ||
                !window.$GLOBAL$
                  .__HumanIdentityNameField__setNameByInputField__) &&
              data.rooms.length > 0
            ) {
              window.$GLOBAL$.__HumanIdentityNameField__setNameByInputField__ = false;
              thisField.onChange(data.rooms[0].lastName, "identity.name");
            }

            thisField.onChange(
              data.address.postalCode,
              "residenceAddress.address.postalCode"
            );
            thisField.onChange(
              data.address.prefecture,
              "residenceAddress.address.prefecture"
            );
            thisField.onChange(
              data.address.addressCity,
              "residenceAddress.address.addressCity"
            );
            thisField.onChange(
              data.address.addressTown,
              "residenceAddress.address.addressTown"
            );
            thisField.onChange(
              data.address.addressNumber,
              "residenceAddress.address.addressNumber"
            );
            thisField.onChange(
              data.address.addressbuilding,
              "residenceAddress.address.addressBuilding"
            );
            thisField.onChange(
              data.rooms[0].shopName,
              "residenceAddress.address.shopName"
            );
            thisField.onChange(
              data.rooms[0].roomNo,
              "residenceAddress.address.roomNo"
            );

            thisField.onChange(data.message, "residenceAddress.refine");

            break;
        }
        /// Sys - Map - Address --
      }
    }
  },

  contact: {
    optional: true,
    type: Commons_ContactInformation_Schema,
    uniforms: {
      label: "連絡先",
      placeholder: "未入力",
      component: NestField,
      className: "col col-12",
      collapsable: "init",
      frameset: "card"
    }
  },

  rank: {
    optional: true,
    type: String,
    uniforms: {
      label: "ランク",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",

      /// Custom - AutoForm - relation
      options: function () {
        const Users_Groups_id = Session.get("Users_Groups_id");
        const rec = Maps_Ranks_Collection.findOne({
          Users_Groups_id: Users_Groups_id
        }) || { ranks: [] };
        return rec.ranks
          .map((r, i) => { if (r) { r.id = String(i) }; return r; } )
          .filter(r => r && r.rank)
          .map(rank => { return { label: rank.rank, value: rank.id } }
        );
      }
      /// Custom - AutoForm - relation --
    }
  },

  tags: {
    optional: true,
    type: [[String]],
    blackbox: true,
    uniforms: {
      label: "タグ",
      placeholder: "未入力",
      component: NullField,
      className: "col col-12"
    }
  },

  communications: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "訪問",
      placeholder: "未入力",
      className: "col col-12"
    }
  },
  "communications.$.communication": {
    optional: true,
    type: Object
  },
  "communications.$.communication.type": {
    type: String,
    uniforms: {
      label: "訪問ステータス",
      className: "col col-12 col-lg-3 col-xl-3",
      options: [
        { label: "本人", value: "meet" },
        { label: "留守", value: "absences" },
        { label: "在宅", value: "athome" },
        { label: "面会", value: "visit" }
      ]
    }
  },
  "communications.$.communication.staff": {
    optional: true,
    type: String,
    uniforms: {
      label: "担当者",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "communications.$.communication.modifiedAt": {
    optional: true,
    type: Date,
    uniforms: {
      label: "訪問日",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "communications.$.communication.memo": {
    optional: true,
    type: String,
    uniforms: {
      label: "コメント",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "communications.$.communication.petition": {
    optional: true,
    type: String,
    uniforms: {
      label: "陳情",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "communications.$.communication.contents": {
    optional: true,
    type: Object,
    blackbox: true
  },

  communicationsLast: {
    optional: true,
    type: Object,
    uniforms: {
      className: "col col-12"
    }
  },
  "communicationsLast.type": {
    optional: true,
    type: String,
    uniforms: {
      label: "訪問ステータス",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
      options: [
        { label: "本人", value: "meet" },
        { label: "面会", value: "visit" },
        { label: "在宅", value: "athome" },
        { label: "留守", value: "absences" },
      ]
    }
  },
  "communicationsLast.staff": {
    optional: true,
    type: String,
    uniforms: {
      label: "担当者",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "communicationsLast.modifiedAt": {
    optional: true,
    type: Date,
    uniforms: {
      label: "訪問日",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "communicationsLast.memo": {
    optional: true,
    type: String,
    uniforms: {
      label: "コメント",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "communicationsLast.petition": {
    optional: true,
    type: String,
    uniforms: {
      label: "陳情",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "communicationsLast.contents": {
    optional: true,
    type: Object,
    blackbox: true
  },

  getDonations: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "献金",
      placeholder: "未入力",
      className: "col col-12"
    }
  },
  "getDonations.$.donation": {
    optional: true,
    type: Object
  },
  "getDonations.$.donation.modifiedAt": {
    optional: true,
    type: Date,
    uniforms: {
      label: "献金日",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "getDonations.$.donation.amount": {
    optional: true,
    type: Number,
    uniforms: {
      label: "献金額",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "getDonations.$.donation.memo": {
    optional: true,
    type: String,
    uniforms: {
      label: "備考",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },

  getGifts: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "頂き物",
      placeholder: "未入力",
      className: "col col-12"
    }
  },
  "getGifts.$.gift": {
    optional: true,
    type: Object
  },
  "getGifts.$.gift.modifiedAt": {
    optional: true,
    type: Date,
    uniforms: {
      label: "頂いた日付",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "getGifts.$.gift.itemName": {
    optional: true,
    type: String,
    uniforms: {
      label: "品名",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "getGifts.$.gift.memo": {
    optional: true,
    type: String,
    uniforms: {
      label: "備考",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },

  companys: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "所属企業",
      placeholder: "未入力",
      className: "col col-12"
    }
  },
  "companys.$.company": {
    optional: true,
    type: Object
  },
  "companys.$.company.Maps_Company_id": {
    optional: true,
    type: String,
    uniforms: {
      label: "所属企業",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "companys.$.company.title": {
    optional: true,
    type: String,
    uniforms: {
      label: "役職",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },

  associations: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "所属団体",
      placeholder: "未入力",
      className: "col col-12"
    }
  },
  "associations.$.association": {
    optional: true,
    type: Object
  },
  "associations.$.association.Maps_Association_id": {
    optional: true,
    type: String,
    uniforms: {
      label: "所属団体",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "associations.$.association.title": {
    optional: true,
    type: String,
    uniforms: {
      label: "役職",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },

  familys: {
    optional: true,
    type: [Object],
    uniforms: {
      className: "col col-12"
    }
  },
  "familys.$.family": {
    optional: true,
    type: Object
  },
  "familys.$.family.Maps_Consumers_id": {
    optional: true,
    type: String
  },
  "familys.$.family.relationship": {
    optional: true,
    type: String,
    uniforms: {
      label: "続柄",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "familyRelationship": {
    optional: true,
    type: String,
    uniforms: {
      label: "続柄",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "familyPrimary": {
    optional: true,
    type: Boolean,
    uniforms: {
      label: "家主",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },

  introducers: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "紹介した人",
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "introducers.$.introducer": {
    optional: true,
    type: Object,
    uniforms: {
      label: "紹介した人",
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "introducers.$.introducer.Maps_Consumers_id": {
    optional: true,
    type: String,
    uniforms: {
      label: "紹介した人",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",

      /// Custom - AutoForm - relation
      options: function (formField) {
        /// Custom - Collection - soft delete
        let selector = { _deleted: null };
        if (formField.disabled) {
          selector = {};
        }
        /// Custom - Collection - soft delete --

        const list = window.$GLOBAL$.Collection["Maps_Consumers"];
        return Object.keys(list).map(function (li) {
          const c = list[li];
          return {
            label: _.get(c, "identity.name"),
            value: c._id
          };
        });
      }
      /// Custom - AutoForm - relation --
    }
  },
  "introducers.$.introducer.relationship": {
    optional: true,
    type: String,
    uniforms: {
      label: "関係",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "introducers.$.introducer.weakLink": {
    optional: true,
    type: Boolean,
  },

  introductions: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "紹介された人",
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "introductions.$.introduction": {
    optional: true,
    type: Object,
    uniforms: {
      label: "紹介された人",
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "introductions.$.introduction.Maps_Consumers_id": {
    optional: true,
    type: String,
    uniforms: {
      label: "紹介された人",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",

      /// Custom - AutoForm - relation
      options: function (formField) {
        /// Custom - Collection - soft delete
        let selector = { _deleted: null };
        if (formField.disabled) {
          selector = {};
        }
        /// Custom - Collection - soft delete --

        const list = window.$GLOBAL$.Collection["Maps_Consumers"];
        return Object.keys(list).map(function (li) {
          const c = list[li];
          return {
            label: _.get(c, "identity.name"),
            value: c._id
          };
        });
      }
      /// Custom - AutoForm - relation --
    }
  },
  "introductions.$.introduction.relationship": {
    optional: true,
    type: String,
    uniforms: {
      label: "関係",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },
  "introductions.$.introduction.weakLink": {
    optional: true,
    type: Boolean,
  },

  /// Custom - AutoForm - collection image
  images: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "画像",
      placeholder: "未入力",
      className: "col col-12"
    }
  },
  "images.$.Images_id": {
    optional: true,
    type: String,
    uniforms: {
      className: "col col-12",
      component: ImageField,
      style: { width: "64px" }
    }
  },
  /// Custom - AutoForm - collection image --

  /// Custom - AutoForm - collection files
  files: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "ファイル",
      placeholder: "未入力",
      className: "col col-12"
    }
  },
  "files.$.Images_id": {
    optional: true,
    type: String,
    uniforms: {
      className: "col col-12",
      component: ImageField,
      style: { width: "64px" }
    }
  },
  /// Custom - AutoForm - collection files --

  mailDestination: {
    optional: true,
    type: String,
    uniforms: {
      label: "送付先",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      className: "col col-12 col-lg-3 col-xl-3",
      options: function (formField) {

        const formName = Maps_Consumers_Collection._name; // eslint-disable-line no-case-declarations
        if (! checkFormState(formName)) return [];

        const list1 = [
          { label: "", value: "" },
          { label: "個人", value: getFieldValue(formName, "_id") },
        ];

        const formCompanys = getFieldValue(formName, "companys") || []; // eslint-disable-line no-case-declarations
        const companyList = formCompanys.map(c => c.company.Maps_Company_id);
        const companys = Maps_Companys_Collection.find({_id: {$in: companyList}}).map(c=>c);
        const list2 = Object.keys(companys).map(function (li) {
          const c = companys[li];
          return {
            label: _.get(c, "name"),
            value: c._id
          };
        });

        const formAssociations = getFieldValue(formName, "associations") || []; // eslint-disable-line no-case-declarations
        const associationList = formAssociations.map(c => c.association.Maps_Association_id);
        const associations = Maps_Associations_Collection.find({_id: {$in: associationList}}).map(c=>c);
        const list3 = Object.keys(associations).map(function (li) {
          const c = associations[li];
          return {
            label: _.get(c, "name"),
            value: c._id
          };
        });

        return list1.concat(list2).concat(list3);
      }
    }
  },

  memo: {
    optional: true,
    type: String,
    uniforms: {
      label: "メモ",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12"
    }
  },

  keyword: {
    optional: true,
    type: String,
    uniforms: {
      component: NullField
    }
  }
  /// Custom - AutoForm - collection image --
});
Maps_Consumers_Collection.attachSchema(Maps_Consumers_Schema, {
  tracker: Tracker
});
/// Custom - AutoForm - schema --

/// Custom - Collection - helpers
Maps_Consumers_Collection.dispTitle = function (doc) {
  /// System - Collection - soft delete
  if (doc.identity) {
    return displayTitle(doc._deleted, doc.identity.name || "");
  } else {
    return "";
  }
  /// System - Collection - soft delete --
};

Maps_Consumers_Collection.helpers({
  disp_title() {
    return Maps_Consumers_Collection.dispTitle(this);
  }
});
/// Custom - Collection - helpers --

/// Custom - localCollection - update trigger
const updateMaps_ConsumersSum = Users_Groups_id => {
  const sum =
    Maps_ConsumersSum_Collection.findOne({
      Users_Groups_id: Users_Groups_id
    }) || {};

  sum.Users_Groups_id = Users_Groups_id;
  sum.modifiedAt = new Date().getTime();

  Maps_ConsumersSum_Collection.upsert(
    { Users_Groups_id: Users_Groups_id },
    { $set: sum }
  );
};
/// Custom - localCollection - update trigger --

/// Custom - Collection - method
Meteor.methods({
  "Maps_Consumers.read_all_count": function (
    Users_Groups_id,
    _schemaVersion,
    _modifiedAt
  ) {
    "use strict";

    console.log(
      "Maps_Consumers.read_all_count START server",
      _schemaVersion,
      _modifiedAt
    );

    if (Maps_Consumers_Collection._schemaVersion != _schemaVersion) {
      _modifiedAt = -1;
    }

    let allCollectionCount = Maps_Consumers_Collection.find().count();
    let docsCount = Maps_Consumers_Collection.find({
      _modifiedAt: { $gt: _modifiedAt }
    }).count();

    console.log(
      "Maps_Consumers.read_all_count END server",
      _modifiedAt,
      docsCount,
      allCollectionCount
    );

    return {
      _schemaVersion: Maps_Consumers_Collection._schemaVersion,
      _modifiedAt: _modifiedAt,
      collectionCount: docsCount,
      allCollectionCount: allCollectionCount
    };
  },
  "Maps_Consumers.read_all": function (
    Users_Groups_id,
    _schemaVersion,
    _modifiedAt
  ) {
    "use strict";

    console.log(
      "Maps_Consumers.read_all START server",
      _schemaVersion,
      _modifiedAt
    );

    if (Maps_Consumers_Collection._schemaVersion != _schemaVersion) {
      _modifiedAt = -1;
    }

    let allCollectionCount = Maps_Consumers_Collection.find().count();
    let docs = Maps_Consumers_Collection.find(
      { _modifiedAt: { $gt: _modifiedAt } },
      { sort: { _modifiedAt: 1 } }
    ).map(p => {
//console.log("=== REA", p._id, _.get(p, "identity.name"), p.modifiedAt);
      return p;
    });

    console.log(
      "Maps_Consumers.read_all END server",
      docs.length,
      allCollectionCount
    );

    return { collection: docs, allCollectionCount: allCollectionCount };
  },
  "Maps_Consumers.insert": function (Users_Groups_id, data) {
    "use strict";

    setIntroduce(data);
    setCommunicationLast(data);
    setKeyword(data);
    setFamilys(data);
    setContact(data);

    data.Users_Groups_id = Users_Groups_id;
    const ret = Maps_Consumers_Collection.insert(data);

    /// Custom - localCollection - update trigger
    updateMaps_ConsumersSum(Users_Groups_id);
    /// Custom - localCollection - update trigger --

    return ret;
  },

  "Maps_Consumers.update": function (Users_Groups_id, _id, data) {
    "use strict";

console.log("Maps_Consumers.update -----------", data);

    setIntroduce(data);
    setCommunicationLast(data);
    setKeyword(data);
    setFamilys(data);
    setContact(data);

    /// Custom - Collection - optimistic lock
    let tmp = Maps_Consumers_Collection.findOne({ _id: _id });

    /// Custom - Persister
    if (Meteor.isClient) {
      tmp = window.$GLOBAL$.Collection["Maps_Consumers"][_id] || {};
    }
    /// Custom - Persister --

//TODO ModifiedAt
tmp = data;

    if (tmp.modifiedAt != data.modifiedAt) {
      console.log("Maps_Consumers.update tmp.modifiedAt != data.modifiedAt");
      const otherUser = Meteor.users.findOne({ _id: tmp.modifiedBy });
      if (otherUser) {
        throw new Meteor.Error(
          "lock",
          `modified by ${ otherUser.profile.username }`
        );
      } else {
        throw new Meteor.Error("lock", `modified by other`);
      }
    }
    /// Custom - Collection - optimistic lock --
data.modifiedAt = new Date().getTime();

    /// Custom - Persister
    if (Meteor.isClient) {
      window.$GLOBAL$.Collection["Maps_Consumers"][_id] = data;
    }
    /// Custom - Persister --
    data.Users_Groups_id = Users_Groups_id;
    Maps_Consumers_Collection.update(_id, { $set: data });

console.log("---- UPD", data._id, _.get(data, "identity.name"), data.modifiedAt, data.modifiedBy);

    /// Custom - localCollection - update trigger
    updateMaps_ConsumersSum(Users_Groups_id);
    /// Custom - localCollection - update trigger --
  },

  "Maps_Consumers.remove": function (Users_Groups_id, _id, data) {
    "use strict";

    /// Custom - Collection - optimistic lock
    let tmp = Maps_Consumers_Collection.findOne({ _id: _id });

    /// Custom - Persister
    if (Meteor.isClient) {
      tmp = window.$GLOBAL$.Collection["Maps_Consumers"][_id] || {};
    }
    /// Custom - Persister --

    if (tmp.modifiedAt != data.modifiedAt) {
      console.log("Maps_Consumers.delete tmp.modifiedAt != data.modifiedAt");
      const otherUser = Meteor.users.findOne({ _id: tmp.modifiedBy });
      if (otherUser) {
        throw new Meteor.Error(
          "lock",
          `modified by ${ otherUser.profile.username }`
        );
      } else {
        throw new Meteor.Error("lock", `modified by other`);
      }
    }
    /// Custom - Collection - optimistic lock --

    /// Custom - Collection - soft delete

    /// Custom - Persister
    if (Meteor.isClient) {
      window.$GLOBAL$.Collection["Maps_Consumers"][_id]._deleted = _id;
    }
    /// Custom - Persister --

    // Maps_Consumers_Collection.remove({Users_Groups_id: Users_Groups_id, _id: _id});
    Maps_Consumers_Collection.update(_id, { $set: { _deleted: _id } });
    /// Custom - Collection - soft delete --

    /// Custom - localCollection - update trigger
    updateMaps_ConsumersSum(Users_Groups_id);
    /// Custom - localCollection - update trigger --
  },

  // eslint-disable-next-line no-unused-vars
  "Maps_Consumers.recover": function (Users_Groups_id, _id, editData) {
    "use strict";

    /// Custom - Collection - soft delete
    Maps_Consumers_Collection.update(_id, { $set: { _deleted: null } });
    /// Custom - Collection - soft delete --

    /// Custom - localCollection - update trigger
    Maps_ConsumersSum_Collection.upsert(
      { Users_Groups_id: Users_Groups_id },
      { $set: {} }
    );
    /// Custom - localCollection - update trigger --
  }
});
/// Custom - Collection - method --

/// Custom - Server - start up
if (Meteor.isServer) {
  Meteor.publish("Maps_Consumers", function (Users_Groups_id) {
    "use strict";

    console.log("### Meteor.publish('Maps_Consumers')", Users_Groups_id);
    return Maps_Consumers_Collection.find(
      { Users_Groups_id: Users_Groups_id },
      { limit: 2 }
    );
  });

  Meteor.startup(function () {
    /// Custom - Collection - collection uniq key
    /// Custom - Collection - soft delete
    console.log(
      "Maps_Consumers_Collection._ensureIndex({ Users_Groups_id: 1, title: 1, _deleted: 1 }, { unique: false, name: 'idx1' });"
    );
    // TODO
    Maps_Consumers_Collection._ensureIndex(
      { Users_Groups_id: 1, title: 1, _deleted: 1 },
      { unique: false, name: "idx1" }
    );
    /// Custom - Collection - soft delete --
    /// Custom - Collection - collection uniq key --
  });
}

//if (Meteor.isClient) {
//  Tracker.autorun(() => {
//    "use strict";
//
//    Meteor.subscribe('Maps_Consumers', Session.get('Users_Groups_id'));
//console.log("### Meteor.subscribe('Maps_Consumers');", Session.get('Users_Groups_id'));
//  });
//}
/// Custom - Server - start up --

function setKeyword(doc) {
  let keyword = "";

  if (doc.identity) {
    keyword += _.get(doc, "identity.name", "");
    keyword += ",";
    keyword += _.get(doc, "identity.kana", "");
    keyword += ",";
  }

  if (doc.residenceAddress && doc.residenceAddress.addressUnrefined) {
    keyword +=
      _.get(doc, "residenceAddress.addressUnrefined.address1", "") +
      _.get(doc, "residenceAddress.addressUnrefined.address2", "") +
      _.get(doc, "residenceAddress.addressUnrefined.shopName", "");
    keyword += ",";
  }

  if (doc.residenceAddress && doc.residenceAddress.address) {
    keyword +=
      _.get(doc, "residenceAddress.address.prefecture", "") +
      _.get(doc, "residenceAddress.address.addressTown", "") +
      _.get(doc, "residenceAddress.address.addressNumber", "") +
      _.get(doc, "residenceAddress.address.addressBuilding", "") +
      _.get(doc, "residenceAddress.address.addressRoomNo", "") +
      _.get(doc, "residenceAddress.address.shopName", "");
    keyword += ",";
  }

  if (doc.companys) {
    const companys = [];
    for (let i in companys) {
      const company = Maps_Companys_Collection.findOne({
        _id: doc.companys[i].company.Maps_Company_id
      });
      companys.push(_.get(company, "name", ""));
    }
    keyword += companys.join(",");
  }

  if (doc.associations) {
    const associations = [];
    for (let i in associations) {
      const association = Maps_Associations_Collection.findOne({
        _id: doc.associations[i].association.Maps_Association_id
      });
      associations.push(_.get(association, "name", ""));
    }
    keyword += associations.join(",");
  }

  if (doc.introducer) {
    const introducer = Maps_Consumers_Collection.findOne({
      _id: doc.introducer.Maps_Consumers_id
    });
    if (introducer) {
      keyword += _.get(introducer, "identity.name", "");
    }
  }

  if (doc.memo) {
    keyword += doc.memo;
  }

  keyword = moji(keyword).convert("HG", "KK").convert("HK", "ZK").convert("ZE", "HE").toString();

  doc.keyword = keyword;
}

/**
 *
 *
 */
function setIntroduce(doc) {
/**
  const introducers = doc.introducers || [];
  for (let i in introducers) {
    const introducer = introducers[i].introducer;
    const _id = introducer.Maps_Consumers_id;
    const docs = Maps_Consumers_Collection.find({
      introducers: { $elemMatch: { "introducer.Maps_Consumers_id": _id } }
    }).map(c=>c);
//////    Maps_Consumers_Collection.update(_id, { $set: {introduceNum: docs.length} });
  }
**/

  // 紹介してくれた人 に対して 反対側のLinkを 作成する
  const introducers = doc.introducers || [];
  for (let i in introducers) {
    const introducer = introducers[i].introducer;
    const _id = introducer.Maps_Consumers_id;
    const doc_introducer = Maps_Consumers_Collection.findOne({ _id: _id });
    if ((doc_introducer.introductions || []).filter(i => i.introduction.Maps_Consumers_id == doc._id).length == 0) {
      if (!doc_introducer.introductions) {
        doc_introducer.introductions = [];
      }
      doc_introducer.introductions.push({ introduction: {Maps_Consumers_id: doc._id, relationship: introducer.relationship, weakLink: true}});
      Maps_Consumers_Collection.update(doc_introducer._id, { $set: {introductions: doc_introducer.introductions} });
    }
  }

  // 紹介した人 に対して 反対側のLinkを 作成する
  const introductions = doc.introductions || [];
  for (let i in introductions) {
    const introduction = introductions[i].introduction;
    const _id = introduction.Maps_Consumers_id;
    const doc_introduction = Maps_Consumers_Collection.findOne({ _id: _id });
    if ((doc_introduction.introducers || []).filter(i => i.introducer.Maps_Consumers_id == doc._id).length == 0) {
      if (!doc_introduction.introducers) {
        doc_introduction.introducers = [];
      }
      doc_introduction.introducers.push({ introducer: {Maps_Consumers_id: doc._id, relationship: introduction.relationship, weakLink: true}});
      Maps_Consumers_Collection.update(doc_introduction._id, { $set: {introducers: doc_introduction.introducers} });
    }
  }

  // 紹介してくれた人 の 反対側のLink を持つが こちらは参照がないとき Link を削除する
  const docs_introducer = Maps_Consumers_Collection.find({
    introductions: { $elemMatch: { "introduction.Maps_Consumers_id": doc._id, "introduction.weakLink": true } }
  }).map(c=>c);
  for (let i=0; i<docs_introducer; i++) {
    const doc_introducer = docs_introducer[i];
    if ((doc.introducers || []).filter(i => i.introducer.Maps_Consumers_id == doc_introducer._id).length == 0) {
      if (doc_introducer.introductions) {
        doc_introducer.introductions = doc_introducer.introductions.filter(i => i.introduction.Maps_Consumers_id != doc._id);
        Maps_Consumers_Collection.update(doc_introducer._id, { $set: {introductions: doc_introducer.introductions} });
      }
    }
  }

  // 紹介した人 の 反対側のLink を持つが こちらは参照がないとき Link を削除する
  const docs_introduction = Maps_Consumers_Collection.find({
    introducers: { $elemMatch: { "introducer.Maps_Consumers_id": doc._id, "introducer.weakLink": true } }
  }).map(c=>c);
  for (let i=0; i<docs_introduction; i++) {
    const doc_introduction = docs_introduction[i];
    if ((doc.introductions || []).filter(i => i.introduction.Maps_Consumers_id == doc_introduction._id).length == 0) {
      if (doc_introduction.introducers) {
        doc_introduction.introducers = doc_introduction.introducers.filter(i => i.introducer.Maps_Consumers_id != doc._id);
        Maps_Consumers_Collection.update(doc_introduction._id, { $set: {introducers: doc_introduction.introducers} });
      }
    }
  }

}

/**
 *
 *
 */
function setCommunicationLast(doc) {
  if (doc.communications && doc.communications.length > 0) {
    const last = doc.communications.length - 1;
    doc.communicationsLast = doc.communications[last].communication;
  }
}

/**
 *
 *
 */
function setFamilys(doc) {
  if (Meteor.isClient) {
    return;
  }

  if (! doc.familys || ! doc.familys.length) {
    return;
  }

  const familys = doc.familys || [];
  if (familys.filter(f=>f.family.Maps_Consumers_id == doc._id).length == 0) {
    familys.push({family: {Maps_Consumers_id: doc._id, relationship: doc.familyRelationship}});
  }

  for(let i in familys) {
    const _id = familys[i].family.Maps_Consumers_id;
//    const familys2 = familys.filter(f=>f.family.Maps_Consumers_id != _id);
    Maps_Consumers_Collection.update(_id, { $set: {familys: familys} });
  }
}

/**
 *
 *
 */
function setContact(doc) {
  if (Meteor.isClient) {
    return;
  }

  if (! doc.contact) {
    return;
  }

  if (doc.contact.tels && doc.contact.tels.length) {
    doc.contact.tels = doc.contact.tels.filter(t => t.tel);
  }
  if (doc.contact.faxs && doc.contact.faxs.length) {
    doc.contact.faxs = doc.contact.faxs.filter(t => t.fax);
  }
  if (doc.contact.emails && doc.contact.emails.length) {
    doc.contact.emails = doc.contact.emails.filter(t => t.address);
  }
}

/**
 *
 *
 */
export function Maps_Consumers_getCommunicationTypeLabel(communication) {
  let tlabel = "";
  let color = "gray";

  if (!communication) {
    return { tlabel: tlabel, color: color };
  }

  const schema = Maps_Consumers_Collection.simpleSchema()._schema;
  const ty = communication.type;
  const ts = schema[
    "communications.$.communication.type"
  ].uniforms.options.filter(o => o.value == ty);
  if (ts.length > 0) {
    tlabel = ts[0].label;
    switch (ty) {
      case "meet":
        color = "#4A4AEE";
        break;
      case "absences":
        color = "#D93C54";
        break;
      case "athome":
        color = "#EF991F";
        break;
      case "visit":
        color = "#3B73DD";
        break;

    }
  }
  return { tlabel: tlabel, color: color };
}
