/// Custom - AutoForm - collection
import NullField from "@imports/ui/uniforms/NullField";
/// Custom - AutoForm - collection --

/// Custom - AutoForm - schema
import { AppRolesSchema } from "../../AppRolesSchema";
import { UserProfileSchema } from "@imports/api/Users/Users_Collection";
/// Custom - AutoForm - schema =-

/// Custom - AutoForm - schema

export const Form_name = "Users_Users";

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
  organization_roles: {
    optional: true,
    type: [String],
    uniforms: {
      className: "col col-12",

      /// Custom - AutoForm - select style
      checkboxes: true,
      /// Custom - AutoForm - select style --

      /// Custom - AutoForm - inline
      inline: true,
      wrapClassName: "col-12",
      /// Custom - AutoForm - inline

      options: [{ label: "admin", value: "admin" }]
    }
  },
  approles: {
    type: AppRolesSchema,
    uniforms: {
      className: "col col-12",
      label: ""
    }
  },
  Images_id: UserProfileSchema._schema["Images_id"]
};
/// Custom - AutoForm - schema --
