//@ts-check

/// Sys - AutoForm - collection
import { Tracker } from "meteor/tracker";
import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { getCurrentFormName } from "@imports/api/lib/CollectionUtils";
/* eslint-disable no-unused-vars */
import {
  displayTitle,
  checkFormState,
  generateFieldName,
  getFieldValue,
  getSchemaFieldName
} from "@imports/api/lib/CollectionUtils";

/* eslint-enable no-unused-vars */
/// Sys - AutoForm - collection --

/// Custom - AutoForm - common schema
import { Commons_ContactInformation_Schema } from "@imports/api/Commons/Commons_Schema";
import {
  Commons_AddressUnrefined_Schema,
  Commons_Address_Schema,
  Commons_MapLocation_Schema
} from "@imports/api/Commons/Commons_Schema";
/// Custom - AutoForm - common schema --

/// Custom - AutoForm - input
let AutoKana;
const moji = require("moji");
if (Meteor.isClient) {
  AutoKana = require("vanilla-autokana");
}
let autokana;
/// Custom - AutoForm - input --

/// Custom - AutoForm - rebuild field
const _ = require("lodash"); // eslint-disable-line no-unused-vars
/// Custom - AutoForm - rebuild field --

/// Custom - AutoForm - layout
import NullField from "@imports/ui/uniforms/NullField";
import NestField from "@imports/ui/uniforms/NestField";
import MapField from "@imports/ui/uniforms/MapField";
import MapAddressField from "@imports/ui/app/MapAddressField";
/// Custom - AutoForm - layout --

/// Custom - Collection - filter
import { Session } from "meteor/session";
/// Custom - Collection - filter --

/// Custom - Collection
export const Maps_Companys_Collection = new Mongo.Collection("Maps_Companys");
Maps_Companys_Collection.defaultCollectionHooks();
/// Custom - Collection --

/// Custom - Persister
if (Meteor.isClient) {
  Maps_Companys_Collection.attachPersister();
}
/// Custom - Persister --

const Maps_Companys_Schema = new SimpleSchema({
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
  name: {
    optional: true,
    type: String,
    uniforms: {
      label: "会社名",
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

  representative: {
    optional: true,
    type: Object,
  },
  "representative.Maps_Consumers_id": {
    optional: true,
    type: String,
    uniforms: {
      label: "代表者",
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

  contact: {
    optional: true,
    type: Commons_ContactInformation_Schema,
    uniforms: {
      component: NestField,
      className: "col col-12",
      collapsable: "init",
      frameset: "card"
    }
  },

  url: {
    optional: true,
    type: String,
    uniforms: {
      label: "URL",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3"
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
      label: "住所",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
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
        const name = getFieldValue(formName, "name") || "";
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
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
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

      onMounted: function(thisField) {
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
            const name = getFieldValue(formName, "name") || ""; // eslint-disable-line no-case-declarations

            // 空白または以前地図クリックによる名前の設定が発生した場合は、名前項目を上書き
            if (
              (!name ||
                !window.$GLOBAL$
                  .__HumanIdentityNameField__setNameByInputField__) &&
              data.rooms.length > 0
            ) {
              window.$GLOBAL$.__HumanIdentityNameField__setNameByInputField__ = false;
              thisField.onChange(data.rooms[0].lastName, "name");
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
});
Maps_Companys_Collection.attachSchema(Maps_Companys_Schema, {
  tracker: Tracker
});
/// Custom - AutoForm - schema --

/// Custom - Collection - helpers
Maps_Companys_Collection.dispTitle = function(doc) {
  /// System - Collection - soft delete
  return displayTitle(doc._deleted, doc.name);
  /// System - Collection - soft delete --
};

Maps_Companys_Collection.helpers({
  disp_title() {
    return Maps_Companys_Collection.dispTitle(this);
  }
});
/// Custom - Collection - helpers --

/// Custom - Collection - method
Meteor.methods({
  "Maps_Companys.insert": function(Users_Groups_id, data) {
    "use strict";

    setKeyword(data);

    data.Users_Groups_id = Users_Groups_id;
    return Maps_Companys_Collection.insert(data);
  },

  "Maps_Companys.update": function(Users_Groups_id, _id, data) {
    "use strict";

    setKeyword(data);

    /// Custom - Collection - optimistic lock
    let tmp = Maps_Companys_Collection.findOne({ _id: _id });

//TODO ModifiedAt
tmp = data;

    if (tmp.modifiedAt != data.modifiedAt) {
      console.log(
        "Maps_Companys.update tmp.modifiedAt != data.modifiedAt",
        tmp,
        data
      );
      const otherUser = Meteor.users.findOne({ _id: tmp.modifiedBy });
      if (otherUser) {
        throw new Meteor.Error(
          "lock",
          `modified by ${otherUser.profile.username}`
        );
      } else {
        throw new Meteor.Error("lock", `modified by other`);
      }
    }
    /// Custom - Collection - optimistic lock --

    data.Users_Groups_id = Users_Groups_id;
    Maps_Companys_Collection.update(_id, { $set: data });
  },

  "Maps_Companys.remove": function(Users_Groups_id, _id, data) {
    "use strict";

    /// Custom - Collection - optimistic lock
    const tmp = Maps_Companys_Collection.findOne({ _id: _id });
    if (tmp.modifiedAt != data.modifiedAt) {
      const otherUser = Meteor.users.findOne({ _id: tmp.modifiedBy });
      if (otherUser) {
        throw new Meteor.Error(
          "lock",
          `modified by ${otherUser.profile.username}`
        );
      } else {
        throw new Meteor.Error("lock", `modified by other`);
      }
    }
    /// Custom - Collection - optimistic lock --

    /// Custom - Collection - soft delete
    // Maps_Companys_Collection.remove({Users_Groups_id: Users_Groups_id, _id: _id});
    Maps_Companys_Collection.update(_id, { $set: { _deleted: _id } });
    /// Custom - Collection - soft delete --
  },

  // eslint-disable-next-line no-unused-vars
  "Maps_Companys.recover": function(Users_Groups_id, _id, editData) {
    "use strict";

    /// Custom - Collection - soft delete
    Maps_Companys_Collection.update(_id, { $set: { _deleted: null } });
    /// Custom - Collection - soft delete --
  }
});
/// Custom - Collection - method

/// Custom - Server - start up
if (Meteor.isServer) {
  Meteor.publish("Maps_Companys", function(Users_Groups_id) {
    "use strict";

    console.log("### Meteor.publish('Maps_Companys')", Users_Groups_id);
    return Maps_Companys_Collection.find({ Users_Groups_id: Users_Groups_id });
  });

  Meteor.startup(function() {
    /// Custom - Collection - collection uniq key
    /// Custom - Collection - soft delete
    console.log(
      "Maps_Companys_Collection._ensureIndex({ Users_Groups_id: 1, name: 1, _deleted: 1 }, { unique: true });"
    );
    Maps_Companys_Collection._ensureIndex(
      { Users_Groups_id: 1, name: 1, _deleted: 1 },
      { unique: true }
    );
    /// Custom - Collection - soft delete --
    /// Custom - Collection - collection uniq key --
  });
}

if (Meteor.isClient) {
  Tracker.autorun(() => {
    "use strict";

    Meteor.subscribe("Maps_Companys", Session.get("Users_Groups_id"));
    console.log(
      "### Meteor.subscribe('Maps_Companys');",
      Session.get("Users_Groups_id")
    );
  });
}
/// Custom - Server - start up --

function setKeyword(doc) {
  let keyword = "";

  if (doc.name) {
    keyword += _.get(doc, "name", "");
  }

  keyword = moji(keyword).convert("HG", "KK").convert("HK", "ZK").convert("ZE", "HE").toString();

  doc.keyword = keyword;
}
