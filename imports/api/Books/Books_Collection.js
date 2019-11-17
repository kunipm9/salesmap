console.log("Books_Books_Collection");

/// Sys - AutoForm - collection
import { Tracker } from "meteor/tracker";
import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import {
  displayTitle,
  checkFormState,
  generateFieldName,
  getFieldValue
} from "@imports/api/lib/CollectionUtils";
/// Sys - AutoForm - collection --

/// Custom - AutoForm - collection excel
import ExcelField from "@imports/ui/uniforms/ExcelField";
/// Custom - AutoForm - collection excel --

/// Custom - AutoForm - validation
import { customValidatorCheckDuplicateValueInArrayField } from "@imports/api/customValidator";
import { customValidatorCheckExistsRecordInUserGroup } from "@imports/api/customValidator";
/// Custom - AutoForm - validation --

/// Custom - AutoForm - rebuild field
const _ = require("lodash"); // eslint-disable-line no-unused-vars
/// Custom - AutoForm - rebuild field --

/// Custom - AutoForm - layout
import NullField from "@imports/ui/uniforms/NullField";
/// Custom - AutoForm - layout --

/// Custom - AutoForm - relation
import { Books_Categorys_Collection } from "@imports/api/Books/Categorys_Collection";
/// Custom - AutoForm - relation --

/// Custom - Collection - filter
import { Session } from "meteor/session";
/// Custom - Collection - filter --

/// Custom - Collection
export const Books_Books_Collection = new Mongo.Collection("Books_Books");
Books_Books_Collection.defaultCollectionHooks();
/// Custom - Collection --

/// Custom - Persister
if (Meteor.isClient) {
  Books_Books_Collection.attachPersister();
}
/// Custom - Persister --

/// Custom - AutoForm - schema
const Books_Books_Schema = new SimpleSchema({
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
  Books_Categorys_id: {
    type: String,
    label: "Category",
    uniforms: {
      className: "col col-12",

      /// Custom - AutoForm - relation
      options: function(formField) {
        /// Custom - Collection - soft delete
        let selector = { _deleted: null };
        if (formField.disabled) {
          selector = {};
        }
        /// Custom - Collection - soft delete --

        return Books_Categorys_Collection.find(selector).map(function(c) {
          return {
            label: c.disp_title(),
            value: c._id
          };
        });
      }
      /// Custom - AutoForm - relation --
    }
  },
  Books_Categorys_id2: {
    type: String,
    label: "Category2",
    uniforms: {
      className: "col col-12",

      /// Custom - AutoForm - rebuild field
      triggerField: ["title"],
      options: thisFormField => {
        const formName = Books_Books_Collection._name;
        if (!checkFormState(formName)) return [];

        const thisFieldName = thisFormField.name;
        const titleFieldName = generateFieldName(
          formName,
          thisFieldName,
          0,
          "title"
        );
        const titleFieldValue = getFieldValue(formName, titleFieldName);

        return [
          { label: titleFieldValue, value: "xs" },
          { label: titleFieldName, value: "s" },
          { label: titleFieldValue, value: "m" },
          { label: titleFieldName, value: "l" },
          { label: titleFieldValue, value: "xl" }
        ];
      }
      /// Custom - AutoForm - rebuild field --
    }
  },
  title: {
    type: String,
    label: "Title",
    regEx: SimpleSchema.RegEx.Email,
    max: 200,

    /// Custom - AutoForm - validation
    custom: function() {
      return customValidatorCheckExistsRecordInUserGroup(
        Books_Books_Collection,
        "title",
        this
      );
    },
    /// Custom - AutoForm - validation --

    uniforms: {
      className: "col col-12"
    }
  },
  author: {
    type: String,
    label: "Author",
    uniforms: {
      className: "col col-6"
    }
  },
  copies: {
    type: Number,
    label: "Number of copies",
    min: 0,
    max: 5,
    uniforms: {
      className: "col col-6"
    }
  },
  items: {
    type: [Object],
    optional: true,
    minCount: 0,
    maxCount: 5,
    uniforms: {
      sortable: true,
      collapsable: "init",
      className: "col col-12"

      //    /// Custom - AutoForm - fixed lines
      //    fixed: true,
      //    /// Custom - AutoForm - fixed lines --

      //    /// Custom - AutoForm - generate value by function
      //    value: (formField) => {
      //
      //      const formName = Menus_Menus_Collection._name;
      //      if (! checkFormState(formName)) return [];
      //
      //      const fieldName = formField.name;
      //      const fieldValue = getFieldValue(formName, fieldName) || [];
      //      if (getSchemaFieldName(fieldName) !== 'items') {
      //        return fieldValue;
      //      }
      //
      //      const langsRec = Menus_Languages_Collection.findOne({});
      //      if (! langsRec) return [];
      //
      //      const langs = langsRec.languages.map(lng => lng.language);
      //      const defaultValue = [];
      //      for(lno in langs) {
      //        const entry = fieldValue.filter(entry=>entry.lang===langs[lno])[0] || {desc: ''};
      //        defaultValue.push({ lang: langs[lno], desc: entry.desc });
      //      }
      //      return defaultValue;
      //    },
      //    /// Custom - AutoForm - generate value by function --
    }
  },
  "items.$.name": {
    type: String,
    max: 3,

    /// Custom - AutoForm - validation
    custom: function() {
      return customValidatorCheckDuplicateValueInArrayField(this);
    },
    /// Custom - AutoForm - validation --
    uniforms: {
      className: "col col-12"
    }
  },
  "items.$.quantity": {
    type: Number,
    max: 3,
    uniforms: {
      className: "col col-12"
    }
  },
  "items.$.name2": {
    type: String,
    max: 3,
    uniforms: {
      className: "col col-12",

      /// Custom - AutoForm - rebuild field
      // items.$.name が変化したら items.$.name の値を items.$.name2 に設定する
      triggerField: ["items.$.name"],
      calc: thisFormField => {
        const formName = Books_Books_Collection._name;
        if (!checkFormState(formName)) return [];

        const thisFieldName = thisFormField.name;
        const nameFieldName = generateFieldName(
          formName,
          thisFieldName,
          0,
          "name"
        );
        const nameFieldValue = getFieldValue(formName, nameFieldName);
        thisFormField.onChange(nameFieldValue);
      }
      /// Custom - AutoForm - rebuild field --
    }
  },
  "items.$.size": {
    type: [String],
    defaultValue: "m",
    allowedValues: ["xs", "s", "m", "l", "xl"],
    uniforms: {
      className: "col col-12",

      /// Custom - AutoForm - select style
      checkboxes: true,
      /// Custom - AutoForm - select style --

      /// Custom - AutoForm - inline
      inline: true,
      wrapClassName: "col col-12",
      /// Custom - AutoForm - inline

      /// Custom - AutoForm - rebuild field
      triggerField: ["items.$.name"],
      options: thisFormField => {
        const formName = Books_Books_Collection._name;
        if (!checkFormState(formName)) return [];

        const thisFieldName = thisFormField.name;
        const nameFieldName = generateFieldName(
          formName,
          thisFieldName,
          0,
          "name"
        );
        const nameFieldValue = getFieldValue(formName, nameFieldName);

        return [
          { label: "all", value: "all", type: "all" },
          { label: nameFieldValue, value: "xs" },
          { label: nameFieldName, value: "s" },
          { label: nameFieldValue, value: "m" },
          { label: nameFieldName, value: "l" },
          { label: nameFieldValue, value: "xl" }
        ];
      }
      /// Custom - AutoForm - rebuild field --
    }
  },
  "items.$.form": {
    type: String,
    defaultValue: "m",
    allowedValues: ["xs", "s", "m", "l", "xl"],
    uniforms: {
      className: "col col-6",

      /// Custom - AutoForm - rebuild field
      triggerField: ["items.$.name"],
      options: thisFormField => {
        const formName = Books_Books_Collection._name;
        if (!checkFormState(formName)) return [];

        const thisFieldName = thisFormField.name;
        const nameFieldName = generateFieldName(
          formName,
          thisFieldName,
          0,
          "name"
        );
        const nameFieldValue = getFieldValue(formName, nameFieldName);

        return [
          { label: nameFieldValue, value: "xs" },
          { label: nameFieldName, value: "s" },
          { label: nameFieldValue, value: "m" },
          { label: nameFieldName, value: "l" },
          { label: nameFieldValue, value: "xl" }
        ];
      }
      /// Custom - AutoForm - rebuild field --
    }
  },
  "items.$.formh": {
    type: String,
    defaultValue: "m",
    allowedValues: ["xs", "s", "m", "l", "xl"],
    uniforms: {
      className: "col col-12",

      /// Custom - AutoForm - select style
      checkboxes: true,
      /// Custom - AutoForm - select style --

      /// Custom - AutoForm - inline
      inline: true,
      wrapClassName: "col col-12",
      /// Custom - AutoForm - inline

      /// Custom - AutoForm - rebuild field
      triggerField: ["items.$.name"],
      options: thisFormField => {
        const formName = Books_Books_Collection._name;
        if (!checkFormState(formName)) return [];

        const thisFieldName = thisFormField.name;
        const nameFieldName = generateFieldName(
          formName,
          thisFieldName,
          0,
          "name"
        );
        const nameFieldValue = getFieldValue(formName, nameFieldName);

        return [
          { label: nameFieldValue, value: "xs" },
          { label: nameFieldName, value: "s" },
          { label: nameFieldValue, value: "m" },
          { label: nameFieldName, value: "l" },
          { label: nameFieldValue, value: "xl" }
        ];
      }
      /// Custom - AutoForm - rebuild field --
    }
  },
  lastCheckedOut: {
    type: Date,
    label: "Last date this book was checked out",
    optional: true,

    uniforms: {
      className: "col col-6"
    }
  },
  summary: {
    type: String,
    label: "Brief summary",
    optional: true,
    max: 1000,

    uniforms: {
      className: "col col-6"
    }
  },
  /// Custom - AutoForm - collection excel
  Excels_id: {
    optional: true,
    type: String,
    uniforms: {
      className: "col col-12",
      component: ExcelField
    }
  }
  /// Custom - AutoForm - collection excel --
});
Books_Books_Collection.attachSchema(Books_Books_Schema, { tracker: Tracker });
/// Custom - AutoForm - schema --

/// Custom - Collection - helpers
Books_Books_Collection.dispTitle = function(doc) {
  /// System - Collection - soft delete
  return displayTitle(doc._deleted, doc.title);
  /// System - Collection - soft delete --
};
Books_Books_Collection.helpers({
  disp_title() {
    return Books_Books_Collection.dispTitle(this);
  }
});
/// Custom - Collection - helpers --

/// Custom - Collection - method
Meteor.methods({
  "Books_Books.insert": function(Users_Groups_id, data) {
    "use strict";

    data.Users_Groups_id = Users_Groups_id;
    return Books_Books_Collection.insert(data);
  },

  "Books_Books.update": function(Users_Groups_id, _id, data) {
    "use strict";

    /// Custom - Collection - optimistic lock
    const tmp = Books_Books_Collection.findOne({ _id: _id });
    if (tmp.modifiedAt != data.modifiedAt) {
      console.log(
        "Books_Books.update tmp.modifiedAt != data.modifiedAt",
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
    Books_Books_Collection.update(_id, { $set: data });
  },

  "Books_Books.remove": function(Users_Groups_id, _id, data) {
    "use strict";

    /// Custom - Collection - optimistic lock
    const tmp = Books_Books_Collection.findOne({ _id: _id });
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
    // Books_Books_Collection.remove({Users_Groups_id: Users_Groups_id, _id: _id});
    Books_Books_Collection.update(_id, { $set: { _deleted: _id } });
    /// Custom - Collection - soft delete --
  },

  // eslint-disable-next-line no-unused-vars
  "Books_Books.recover": function(Users_Groups_id, _id, editData) {
    "use strict";

    /// Custom - Collection - soft delete
    Books_Books_Collection.update(_id, { $set: { _deleted: null } });
    /// Custom - Collection - soft delete --
  }
});
/// Custom - Collection - method --

/// Custom - Server - start up
if (Meteor.isServer) {
  Meteor.publish("Books_Books", function(Users_Groups_id) {
    "use strict";

    console.log("### Meteor.publish('Books_Books')", Users_Groups_id);
    return Books_Books_Collection.find({ Users_Groups_id: Users_Groups_id });
  });

  Meteor.startup(function() {
    /// Custom - Collection - collection uniq key
    /// Custom - Collection - soft delete
    console.log(
      "Books_Books_Collection._ensureIndex({ Users_Groups_id: 1, title: 1, _deleted: 1 }, { unique: true });"
    );
    Books_Books_Collection._ensureIndex(
      { Users_Groups_id: 1, title: 1, _deleted: 1 },
      { unique: true }
    );
    /// Custom - Collection - soft delete --
    /// Custom - Collection - collection uniq key --
  });
}

if (Meteor.isClient) {
  Tracker.autorun(() => {
    "use strict";

    Meteor.subscribe("Books_Books", Session.get("Users_Groups_id"));
    console.log(
      "### Meteor.subscribe('Books_Books');",
      Session.get("Users_Groups_id")
    );
  });
}
/// Custom - Server - start up --
