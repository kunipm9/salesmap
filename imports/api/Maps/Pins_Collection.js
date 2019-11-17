console.log("Maps_Pins_Collection");

/// Sys - AutoForm - collection
import { Tracker } from "meteor/tracker";
import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import {
  displayTitle,
  checkFormState,
  generateFieldName,
  getFieldValue,
} from "@imports/api/lib/CollectionUtils";
const moji = require("moji");
/// Sys - AutoForm - collection --

/// Custom - AutoForm - common schema
import {
  Commons_MapLocation_Schema
} from "@imports/api/Commons/Commons_Schema";
/// Custom - AutoForm - common schema --

/// Custom - AutoForm - rebuild field
const _ = require("lodash"); // eslint-disable-line no-unused-vars
/// Custom - AutoForm - rebuild field --

/// Custom - AutoForm - layout
import NullField from "@imports/ui/uniforms/NullField";
import NestField from "@imports/ui/uniforms/NestField";
import ImageField from "@imports/ui/uniforms/ImageField";
/// Custom - AutoForm - layout --

/// Custom - AutoForm - map
import MapField from "@imports/ui/uniforms/MapField";
/// Custom - AutoForm - map

/// Custom - localCollection - update trigger
import { Maps_PinsSum_Collection } from "@imports/api/Maps/PinsSum_Collection";
/// Custom - localCollection - update trigger --

/// Custom - Collection
export const Maps_Pins_Collection = new Mongo.Collection("Maps_Pins");

/// Custom - localCollection - update trigger
Maps_Pins_Collection.before.insert(function(userId, doc) {
  doc.createdAt = Date.now();
  doc.createdBy = userId;
  doc._modifiedAt = doc.createdAt;
});

Maps_Pins_Collection.before.update(function(userId, doc, fieldNames, modifier) {
  modifier.$set = modifier.$set || {};
  modifier.$set.modifiedAt = Date.now();
  modifier.$set.modifiedBy = userId;
  modifier.$set._modifiedAt = modifier.$set.modifiedAt;
});
/// Custom - localCollection - update trigger --

/// Custom - localCollection - versioning
Maps_Pins_Collection._schemaVersion = 20191007;
/// Custom - localCollection - versioning --
/// Custom - Collection --

/// Custom - Persister
if (Meteor.isClient) {
  Maps_Pins_Collection.attachPersister();
}
/// Custom - Persister --

/// Custom - AutoForm - schema
const Maps_Pins_Schema = new SimpleSchema({
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
  title: {
    optional: true,
    type: String,
    uniforms: {
      label: "名称",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-6"
    }
  },
  no: {
    optional: true,
    type: Number,
    uniforms: {
      label: "No",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-6"
    }
  },
  cat1: {
    type: String,
    uniforms: {
      className: "col col-12",
      label: "大カテゴリ",

      /// Custom - AutoForm - relation
      options: function (formField) {

//        const cat = Maps_PinCategorys_Collection.findOne(selector);
        const cat = window.$GLOBAL$.__ConsumersView__.pinCategorys;
        let cat1 = [];
        if (cat) {
          cat1 = cat.cat1 || [];
        }
        return cat1.map(function (c) {
          return {
            label: c.title,
            value: c.id
          };
        });
      }
      /// Custom - AutoForm - relation --
    }
  },
  cat2: {
    type: String,
    uniforms: {
      className: "col col-12",
      label: "小カテゴリ",

      /// Custom - AutoForm - relation
      triggerField: ["cat1"],
      options: thisFormField => {
        const formName = Maps_Pins_Collection._name;
        if (!checkFormState(formName)) return [];

        const thisFieldName = thisFormField.name;
        const cat1FieldName = generateFieldName(
          formName,
          thisFieldName,
          0,
          "cat1"
        );
        const cat1FieldValue = getFieldValue(formName, cat1FieldName);

//        const cat = Maps_PinCategorys_Collection.findOne(selector);
        const cat = window.$GLOBAL$.__ConsumersView__.pinCategorys;
        let cat2 = [];
        if (cat) {
          const cat1 = cat.cat1 || [];
          const tmp = cat1.filter(c=>c.id==cat1FieldValue);
          if (tmp && tmp.length) {
            cat2 = tmp[0].cat2;
          }
        }
        return cat2.filter(c => c).map(function (c) {
          return {
            label: c.title,
            value: c.id
          };
        });
      }
      /// Custom - AutoForm - relation --
    }
  },
  residenceAddress: {
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
    }
  },
  images: {
    optional: true,
    type: [Object],
    uniforms: {
      label: "画像",
      placeholder: "未入力",
      className: "col col-12"
    }
  },
  /// Custom - AutoForm - collection image
  "images.$.Images_id": {
    optional: true,
    type: String,
    uniforms: {
      className: "col col-12",
      component: ImageField,
      style: { width: "64px" }
    }
  },

  num: {
    optional: true,
    type: Number,
    uniforms: {
      label: "枚数",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12"
    }
  },

  executedAt: {
    optional: true,
    type: Date,
    uniforms: {
      label: "貼付日",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
    }
  },

  staff: {
    optional: true,
    type: String,
    uniforms: {
      label: "担当者",
      InputLabelProps: {shrink: true, className: "mui-Label-custom"},
      placeholder: "未入力",
      className: "col col-12 col-lg-3 col-xl-3",
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
Maps_Pins_Collection.attachSchema(Maps_Pins_Schema, { tracker: Tracker });
/// Custom - AutoForm - schema --

/// Custom - Collection - helpers
Maps_Pins_Collection.dispTitle = function(doc) {
  /// System - Collection - soft delete
  return displayTitle(doc._deleted, doc.title);
  /// System - Collection - soft delete --
};

Maps_Pins_Collection.helpers({
  disp_title() {
    return Maps_Pins_Collection.dispTitle(this);
  }
});
/// Custom - Collection - helpers --

/// Custom - localCollection - update trigger
const updateMaps_PinsSum = Users_Groups_id => {
  const sum =
    Maps_PinsSum_Collection.findOne({ Users_Groups_id: Users_Groups_id }) || {};
  sum.Users_Groups_id = Users_Groups_id;
  sum.modifiedAt = new Date().getTime();
  Maps_PinsSum_Collection.upsert(
    { Users_Groups_id: Users_Groups_id },
    { $set: sum }
  );
};
/// Custom - localCollection - update trigger --

/// Custom - Collection - method
Meteor.methods({
  "Maps_Pins.read_all_count": function(
    Users_Groups_id,
    _schemaVersion,
    _modifiedAt
  ) {
    "use strict";

    console.log(
      "Maps_Pins.read_all_count START server",
      _schemaVersion,
      _modifiedAt
    );

    let allCollectionCount = Maps_Pins_Collection.find().count();
    let docsCount = Maps_Pins_Collection.find({
      _modifiedAt: { $gt: _modifiedAt }
    }).count();

    console.log(
      "Maps_Pins.read_all_count END server",
      docsCount,
      allCollectionCount
    );

    if (Maps_Pins_Collection._schemaVersion != _schemaVersion) {
      _modifiedAt = -1;
    }

    return {
      _schemaVersion: Maps_Pins_Collection._schemaVersion,
      _modifiedAt: _modifiedAt,
      collectionCount: docsCount,
      allCollectionCount: allCollectionCount
    };
  },
  "Maps_Pins.read_all": function(Users_Groups_id, _schemaVersion, _modifiedAt) {
    "use strict";

    console.log("Maps_Pins.read_all START server", _schemaVersion, _modifiedAt);

    if (Maps_Pins_Collection._schemaVersion != _schemaVersion) {
      _modifiedAt = -1;
    }

    let allCollectionCount = Maps_Pins_Collection.find().count();
    let docs = Maps_Pins_Collection.find(
      { _modifiedAt: { $gt: _modifiedAt } },
      { sort: { _modifiedAt: 1 } }
    ).map(p => {
      return p;
    });

    console.log(
      "Maps_Pins.read_all END server",
      docs.length,
      allCollectionCount
    );

    return { collection: docs, allCollectionCount: allCollectionCount };
  },

  "Maps_Pins.insert": function(Users_Groups_id, data) {
    "use strict";

    setKeyword(data);

    data.Users_Groups_id = Users_Groups_id;
    const ret = Maps_Pins_Collection.insert(data);

    /// Custom - localCollection - update trigger
    updateMaps_PinsSum(Users_Groups_id);
    /// Custom - localCollection - update trigger --

    return ret;
  },

  "Maps_Pins.update": function(Users_Groups_id, _id, data) {
    "use strict";

    setKeyword(data);

    /// Custom - Collection - optimistic lock
    let tmp = Maps_Pins_Collection.findOne({ _id: _id });

    /// Custom - Persister
    if (Meteor.isClient) {
      tmp = window.$GLOBAL$.Collection["Maps_Pins"][_id] || {};
    }
    /// Custom - Persister --

//TODO ModifiedAt
tmp = data;

    if (tmp.modifiedAt != data.modifiedAt) {
      console.log(
        "Maps_Pins.update tmp.modifiedAt != data.modifiedAt",
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

    /// Custom - Persister
    if (Meteor.isClient) {
      window.$GLOBAL$.Collection["Maps_Pins"][_id] = data;
    }
    /// Custom - Persister --

    data.Users_Groups_id = Users_Groups_id;
    Maps_Pins_Collection.update(_id, { $set: data });

    /// Custom - localCollection - update trigger
    updateMaps_PinsSum(Users_Groups_id);
    /// Custom - localCollection - update trigger --
  },

  "Maps_Pins.remove": function(Users_Groups_id, _id, data) {
    "use strict";

    /// Custom - Collection - optimistic lock
    let tmp = Maps_Pins_Collection.findOne({ _id: _id });

    /// Custom - Persister
    if (Meteor.isClient) {
      tmp = window.$GLOBAL$.Collection["Maps_Pins"][_id] || {};
    }
    /// Custom - Persister --

    if (tmp.modifiedAt != data.modifiedAt) {
      console.log("Maps_Pins.delete tmp.modifiedAt != data.modifiedAt");
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

    /// Custom - Persister
    if (Meteor.isClient) {
      window.$GLOBAL$.Collection["Maps_Pins"][_id]._deleted = _id;
    }
    /// Custom - Persister --

    // Maps_Pins_Collection.remove({Users_Groups_id: Users_Groups_id, _id: _id});
    Maps_Pins_Collection.update(_id, { $set: { _deleted: _id } });
    /// Custom - Collection - soft delete --

    /// Custom - localCollection - update trigger
    updateMaps_PinsSum(Users_Groups_id);
    /// Custom - localCollection - update trigger --
  },

  // eslint-disable-next-line no-unused-vars
  "Maps_Pins.recover": function(Users_Groups_id, _id, editData) {
    "use strict";

    /// Custom - Collection - soft delete
    Maps_Pins_Collection.update(_id, { $set: { _deleted: null } });
    /// Custom - Collection - soft delete --

    /// Custom - localCollection - update trigger
    Maps_PinsSum_Collection.upsert(
      { Users_Groups_id: Users_Groups_id },
      { $set: {} }
    );
    /// Custom - localCollection - update trigger --
  }
});
/// Custom - Collection - method --

/// Custom - Server - start up
if (Meteor.isServer) {
  Meteor.publish("Maps_Pins", function(Users_Groups_id) {
    "use strict";

    console.log("### Meteor.publish('Maps_Pins')", Users_Groups_id);
    return Maps_Pins_Collection.find(
      { Users_Groups_id: Users_Groups_id },
      { limit: 2 }
    );
  });

  Meteor.startup(function() {
    /// Custom - Collection - collection uniq key
    /// Custom - Collection - soft delete
    console.log(
      "Maps_Pins_Collection._ensureIndex({ Users_Groups_id: 1, title: 1, _deleted: 1 }, { unique: false });"
    );
    Maps_Pins_Collection._ensureIndex(
      { Users_Groups_id: 1, title: 1, _deleted: 1 },
      { unique: false }
    );
    /// Custom - Collection - soft delete --
    /// Custom - Collection - collection uniq key --
  });
}

//if (Meteor.isClient) {
//  Tracker.autorun(() => {
//    "use strict";
//
//    Meteor.subscribe('Maps_Pins', Session.get('Users_Groups_id'));
//  });
//}
/// Custom - Server - start up --

function setKeyword(doc) {
  let keyword = "";

  if (doc.identity) {
    keyword += _.get(doc, "title", "");
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

  if (doc.memo) {
    keyword += doc.memo;
  }

  keyword = moji(keyword).convert("HG", "KK").convert("HK", "ZK").convert("ZE", "HE").toString();

  doc.keyword = keyword;
}
