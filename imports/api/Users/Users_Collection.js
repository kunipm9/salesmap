console.log("Users_Users_Collection");

/// Sys - AutoForm - collection
import { SimpleSchema } from "meteor/aldeed:simple-schema";
/// Sys - AutoForm - collection --

/// Custom - AutoForm - collection
import { Random } from "meteor/random";
import { Roles } from "meteor/alanning:roles";
/// Custom - AutoForm - collection --

/// Custom - AutoForm - layout
import ImageField from "@imports/ui/uniforms/ImageField";
/// Custom - AutoForm - layout --

/// Custom - AutoForm - validation
import { Users_Groups_Collection } from "@imports/api/Users/Groups_Collection";
/// Custom - AutoForm - validation --

/// Custom - AutoForm - schema
export const UserProfileSchema = new SimpleSchema({
  username: {
    type: String,
    uniforms: {
      className: "col col-12"
    }
  },
  roles: {
    type: [Object]
  },
  "roles.$.organization": {
    type: String
  },
  "roles.$.roles": {
    type: [String]
  },
  "roles.$.approles": {
    optional: true,
    type: Object,
    blackbox: true
  },
  emails: {
    type: [Object],
    minCount: 1,
    uniforms: {
      sortable: true,
      className: "col col-12"
    }
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    uniforms: {
      className: "col col-12"
    }
  },
  "emails.$.verified": {
    optional: true,
    type: Boolean,
    uniforms: {
      className: "col col-12"
    }
  },
  /// Custom - AutoForm - collection image
  Images_id: {
    optional: true,
    type: String,
    uniforms: {
      className: "col col-12",
      component: ImageField,
      style: {
        width: "64px",
        boxShadow:
          "0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15)"
      }
    }
  }
  /// Custom - AutoForm - collection image --
});

export const UserSchema = new SimpleSchema({
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/
  },
  emails: {
    optional: true,
    type: [Object]
  },
  "emails.$.address": {
    optional: true,
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    optional: true,
    type: Boolean
  },
  createdAt: {
    optional: true,
    type: Date
  },
  profile: {
    optional: true,
    type: UserProfileSchema
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

Meteor.users.attachSchema(UserSchema);
/// Custom - AutoForm - schema --

/// Application -- user management
function checkOtherEmails(Users_Groups_id, _id, address) {
  "use strict";

  let users;
  if (_id) {
    // Update時は自レコード以外同一Mailを許さない
    users = Meteor.users
      .find({
        _id: { $ne: _id },
        "profile.emails": { $elemMatch: { address: address } }
      })
      .fetch();
  } else {
    // Update時はMergeすることを前提に他のUserGroupに同一Mailがあることを許す
    users = Meteor.users
      .find({
        "profile.emails": { $elemMatch: { address: address } },
        "profile.roles": { $elemMatch: { organization: Users_Groups_id } }
      })
      .fetch();
  }
  return users;
}

function checkExistsUsersRecord(_id, emails) {
  "use strict";

  console.log("checkExistsUsersRecord", _id, emails);

  let userRecord;
  const otherId = {};
  const userEmailAddress = [];
  for (let i = 0; i < emails.length; i++) {
    const address = emails[i].address;
    userRecord = Meteor.users.findOne({
      "profile.emails": { $elemMatch: { address: address } }
    });
    if (userRecord && userRecord._id != _id) {
      otherId[userRecord._id] = true;
    }
    if (userRecord) {
      userEmailAddress.push(address);
    }
  }

  if (_id) {
    // Update処理の場合
    if (Object.keys(otherId).length > 0) {
      // 編集中のメールアドレスが他のレコードに存在する場合
      const errAddress = userEmailAddress.join(", ");
      throw new Meteor.Error("dup.mail", errAddress);
    }
  } else {
    // Insert処理の場合
    if (Object.keys(otherId).length > 1) {
      // 編集中のメールアドレスが他の複数レコードに存在する場合(Merge不可能)
      const errAddress = userEmailAddress.join(", "); // eslint-disable-line no-redeclare
      throw new Meteor.Error("dup.mail", errAddress);
    }
  }

  if (userEmailAddress.length > 0) {
    return userRecord;
  }

  return null;
}

function mergeAdminRoles(Users_Groups_id, orgProfile, organizations) {
  // eslint-disable-line no-unused-vars
  "use strict";

  // Users_Groups一覧
  /// Sys - Collection - soft delete
  const group_ids = Users_Groups_Collection.find({ _deleted: null }).map(
    function(c) {
      return c._id;
    }
  );
  /// Sys - Collection - soft delete --
  group_ids.push(Roles.GLOBAL_GROUP);

  // 登録されたいるUsers_Groups_Collectionレコードの順に処理を行う
  const newRoles = [];
  for (const group_id of group_ids) {
    let f_exist = false;
    let tmpRole = {};

    // 元々Users_Usersに登録されているRoles情報の保存
    for (const orgRole of orgProfile.roles) {
      if (orgRole.organization == group_id) {
        // 一旦adminを除外
        tmpRole = {
          organization: orgRole.organization,
          roles: orgRole.roles.filter(role => role != "admin"),
          approles: orgRole.approles
        };

        f_exist = true;
      }
    }

    if (organizations.indexOf(group_id) >= 0) {
      // 元々Users_Usersに登録されているUsers_Groups?
      if (f_exist) {
        // admin の追加
        if (!tmpRole.roles.includes("admin")) {
          tmpRole.roles.push("admin");
        }
      } else {
        // adminを持つRoleを新規作成
        f_exist = true;
        tmpRole = {
          organization: group_id,
          roles: ["admin"],
          approles: {}
        };
      }
      newRoles.push(tmpRole);
    }
  }
  orgProfile.roles = newRoles;
}

function mergeRoles(Users_Groups_id, orgProfile, organization_roles, approles) {
  "use strict";

  let f_exist = false;
  for (let i = 0; i < orgProfile.roles.length; i++) {
    if (orgProfile.roles[i].organization == Users_Groups_id) {
      orgProfile.roles[i].roles = organization_roles;
      orgProfile.roles[i].approles = approles;
      f_exist = true;
    }
  }
  if (!f_exist) {
    const newRole = {
      organization: Users_Groups_id,
      roles: organization_roles,
      approles: approles
    };
    orgProfile.roles.push(newRole);
  }
}

function removeRoles(Users_Groups_id, profile) {
  "use strict";

  profile.roles = profile.roles.filter(
    role => role.organization != Users_Groups_id
  );
}

function mergeEmails(orgProfile, emails) {
  "use strict";

  for (let i = 0; i < emails.length; i++) {
    const editDataEmail = emails[i];
    const otherEmail = orgProfile.emails.filter(
      email => email.address == editDataEmail.address
    );
    if (otherEmail.length == 0) {
      orgProfile.emails.push(editDataEmail);
    }
  }
}

function mergePicture(orgProfile, Images_id) {
  "use strict";

  orgProfile.Images_id = Images_id;
}

function createAdminRoles(Users_Groups_id, organizations) {
  "use strict";

  // Users_Groups一覧
  /// Sys - Collection - soft delete
  const group_ids = Users_Groups_Collection.find({ _deleted: null }).map(
    function(c) {
      return c._id;
    }
  );
  /// Sys - Collection - soft delete --
  group_ids.push(Roles.GLOBAL_GROUP);

  // 登録されているUsers_Groups_Collectionレコードの順にroleを作成していく
  const newRoles = [];
  for (const group_id of group_ids) {
    if (organizations.includes(group_id)) {
      const tmpRole = {
        organization: group_id,
        roles: ["admin"],
        approles: {}
      };
      newRoles.push(tmpRole);
    }
  }
  return newRoles;
}

function createRoles(Users_Groups_id, organization_roles, approles) {
  "use strict";

  const tmpRole = {
    organization: Users_Groups_id,
    roles: organization_roles,
    approles: approles
  };
  return [tmpRole];
}

function updateUser(Users_Groups_id, _id, editData) {
  "use strict";

  // Check
  const loggedInUser = Meteor.user();
  if (
    !loggedInUser ||
    !Roles.userIsInRole(loggedInUser, ["admin"], Users_Groups_id)
  ) {
    throw new Meteor.Error(403, "Access denied");
  }

  const data = {
    username: editData.username_org,
    roles: {},
    emails: editData.emails,
    profile: {
      username: editData.username,
      roles: editData.roles,
      emails: editData.emails,
      approles: editData.approles,
      Images_id: editData.Images_id
    }
  };

  if (_id) {
    Meteor.users.update(_id, { $set: data });
  } else {
    _id = Meteor.users.insert(data);
  }

  // Roles
  for (let i = 0; i < editData.roles.length; i++) {
    Roles.addUsersToRoles(
      _id,
      editData.roles[i].roles,
      editData.roles[i].organization
    );
  }

  // Password
  if (editData.password) {
    Accounts.setPassword(_id, editData.password);
  }

  return _id;
}
/// Application -- user management --

/// Custom - AutoForm - methods
if (Meteor.isServer) {
  Meteor.methods({
    "Users_Users.findOne": function(Users_Groups_id, _id) {
      "use strict";

      const doc = Meteor.users.findOne(_id);

      if (Users_Groups_id == Roles.GLOBAL_GROUP) {
        return doc;
      }

      const roles = doc.profile.roles.filter(
        role => role.organization == Users_Groups_id
      );
      if (roles.length == 0) {
        throw new Meteor.Error(403, "Access denied");
      }

      return doc;
    },

    "Users_Users.find": function(Users_Groups_id) {
      "use strict";

      const docs = Meteor.users.find({ ["roles." + Users_Groups_id]: {$exists: true} }).map((user)=>{return {_id: user._id, username: user.profile.username}});

      return docs;
    },

    "Users_Users.checkOtherEmails": function(Users_Groups_id, _id, address) {
      "use strict";

      return checkOtherEmails(Users_Groups_id, _id, address);
    },

    "Users_Users.update": function(Users_Groups_id, _id, editData) {
      "use strict";

      /// Application -- user management
      // 入力されたメールアドレスが他のユーザレコード上に既にし、Mergeが不可能な場合
      for (let email of editData.emails) {
        if (checkOtherEmails(Users_Groups_id, _id, email.address).length > 0) {
          throw new Meteor.Error("dup.mail", email.address);
        }
      }

      const otherData = checkExistsUsersRecord(_id, editData.emails);
      if (otherData) {
        // Insert時で入力されたメールアドレスが他のユーザレコード上に既にする場合
        _id = otherData._id;

        // 既存のユーザレコードに対して入力データをMergeする
        mergeRoles(
          Users_Groups_id,
          otherData.profile,
          editData.organization_roles,
          editData.approles
        );
        mergeEmails(otherData.profile, editData.emails);
        mergePicture(otherData.profile, editData.Images_id);

        editData = {
          username_org: otherData.username,
          username: editData.username,
          password: editData.password,
          roles: otherData.profile.roles,
          emails: otherData.profile.emails,
          approles: otherData.profile.approles,
          Images_id: otherData.profile.Images_id
        };
      } else if (_id) {
        // Updateの場合、既存のレコードに対しRole情報をMerge、その他は上書きする
        const orgData = Meteor.users.findOne({ _id: _id });
        mergeRoles(
          Users_Groups_id,
          orgData.profile,
          editData.organization_roles,
          editData.approles
        );
        editData = {
          username_org: orgData.username,
          username: editData.username,
          password: editData.password,
          roles: orgData.profile.roles,
          emails: editData.emails,
          approles: editData.approles,
          Images_id: editData.Images_id
        };
      } else {
        // Insert
        const roles = createRoles(
          Users_Groups_id,
          editData.organization_roles,
          editData.approles
        );
        editData = {
          username_org: Random.id(15),
          username: editData.username,
          password: editData.password,
          roles: roles,
          emails: editData.emails,
          approles: editData.approles,
          Images_id: editData.Images_id
        };
      }
      /// Application -- user management --

      const _id2 = updateUser(Users_Groups_id, _id, editData);
      return _id2;
    },

    "Users_Users.remove": function(Users_Groups_id, _id, editData) {
      "use strict";

      /// Application -- user management
      const orgData = Meteor.users.findOne({ _id: _id });

      // Remove時は、Role情報のみ削除する
      removeRoles(Users_Groups_id, orgData.profile);

      editData = {
        username_org: orgData.username,
        username: editData.username,
        password: null,
        roles: orgData.profile.roles,
        emails: editData.emails,
        approles: editData.approles,
        Images_id: editData.Images_id
      };
      /// Application -- user management --

      const _id2 = updateUser(Users_Groups_id, _id, editData);
      return _id2;
    },

    "Users_Admins.update": function(Users_Groups_id, _id, editData) {
      "use strict";

      /// Application -- user management
      const userRecord = checkExistsUsersRecord(_id, editData.emails);
      if (userRecord) {
        // Insert時で入力されたメールアドレスが他のユーザレコード上に既にする場合
        // 通常のUpdate時
        _id = userRecord._id;

        // 既存のレコードに対して入力データをMergeする
        mergeAdminRoles(
          Users_Groups_id,
          userRecord.profile,
          editData.organizations
        );
        mergeEmails(userRecord.profile, editData.emails);

        editData = {
          username_org: userRecord.username,
          username: editData.username,
          password: editData.password,
          roles: userRecord.profile.roles,
          emails: userRecord.profile.emails,
          Images_id: editData.Images_id
        };
      } else {
        // 通所のInsert時
        const roles = createAdminRoles(Users_Groups_id, editData.organizations);
        editData = {
          username_org: Random.id(15),
          username: editData.username,
          password: editData.password,
          roles: roles,
          emails: editData.emails,
          Images_id: editData.Images_id
        };
      }
      /// Application -- user management --

      const _id2 = updateUser(Users_Groups_id, _id, editData);
      return _id2;
    },

    // eslint-disable-next-line no-unused-vars
    "Users_Admins.remove": function(Users_Groups_id, _id, editData) {
      "use strict";

      /// Application -- user management
      // remove時

      const exceptAddress = "admin@pm9.com";
      const user = Meteor.users.findOne({
        _id: _id,
        "profile.emails": { $elemMatch: { address: exceptAddress } }
      });
      if (user) {
        return;
      }

      // Meteor.users.remove({_id: _id});
      // if (Images_id) {
      //   Images_Collection.remove({ _id: editData.Images_id });
      // }
      /// Application -- user management --

      // role情報を削除するのみ
      Meteor.users.update(_id, { $set: { roles: {}, "profile.roles": [] } });
    }
  });
}
/// Custom - AutoForm - methods --

/// Custom - Server - start up
if (Meteor.isServer) {
  ("use strict");

  if (!Meteor.users.find().count()) {
    const _id = Accounts.createUser({
      username: "admin",
      email: "admin@pm9.com",
      profile: {
        username: "admin",
        emails: [{ address: "admin@pm9.com", verified: true }],
        roles: [{ roles: ["admin"], organization: Roles.GLOBAL_GROUP }]
      }
    });
    Accounts.setPassword(_id, "adminadmin");
    Roles.addUsersToRoles(_id, ["admin"], Roles.GLOBAL_GROUP);
  }
}
/// Custom - Server - start up --
