/// Custom - AutoForm - collection
import NullField from "@imports/ui/uniforms/NullField";
/// Custom - AutoForm - collection --

/// Custom - AutoForm - schema
import { UserProfileSchema } from "@imports/api/Users/Users_Collection";
/// Custom - AutoForm - schema =-

/// Custom - AutoForm - relation
import { Users_Groups_Collection } from "@imports/api/Users/Groups_Collection";
/// Custom - AutoForm - relation --

/// Custom - AutoForm - schema

export const Form_name = "Users_Admins";

export const schema = {
  _id: {
    optional: true,
    type: String,
    uniforms: {
      component: NullField
    }
  },
  username: UserProfileSchema._schema.username,
  emails: UserProfileSchema._schema.emails,
  "emails.$": UserProfileSchema._schema["emails.$"],
  "emails.$.address": UserProfileSchema._schema["emails.$.address"],
  "emails.$.verified": UserProfileSchema._schema["emails.$.verified"],
  password: {
    optional: true,
    type: String,
    uniforms: {
      className: "col col-12",
      help: "optional"
    }
  },
  organizations: {
    type: [String],
    uniforms: {
      className: "col col-12",

      /// Custom - AutoForm - relation
      options: function(field) {
        /// Custom - Collection - soft delete
        let selector = { _deleted: null };
        if (field.disabled) {
          selector = {};
        }
        /// Custom - Collection - soft delete --

        const ret = Users_Groups_Collection.find(selector).map(function(c) {
          return {
            label: c.title,
            value: c._id
          };
        });
        ret.push({ label: "System", value: Roles.GLOBAL_GROUP });
        return ret;
      }
      /// Custom - AutoForm - relation --
    }
  },
  Images_id: UserProfileSchema._schema["Images_id"]
};
/// Custom - AutoForm - schema --
