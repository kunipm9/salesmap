
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React from 'react';


import { GroupsCollection } from '@imports/api/GroupsCollection';


import { Accounts } from 'meteor/std:accounts-ui';


import "./social-buttons.css";


T9n.setLanguage('ja')

Accounts.config({
  sendVerificationEmail: false,
  forbidClientAccountCreation: false
});


/**
 *
 *
 * @export
 * @class Login
 * @extends {React.Component}
 */
export default class Login extends React.Component {

  "use strict";
  
  /**
   *
   *
   * @returns
   * @memberof Login
   */
  render() {
    Accounts.ui.config({
      // passwordSignupFields: 'EMAIL_ONLY_NO_PASSWORD',
      passwordSignupFields: 'EMAIL_ONLY',
      requireEmailVerification: false,
      // onSignedInHook: () => this.props.history.push('/'),
      onSignedInHook: () => {

        const loggedInUser = Meteor.user();
        if (Object.keys(loggedInUser.roles).length < 2) {
          if (Object.keys(loggedInUser.roles).length == 1) {

console.log("loggedInUser", loggedInUser);
            const userGroupId = Object.keys(loggedInUser.roles)[0];
console.log("userGroupId", userGroupId);
            let userGroupTitle = null;
            if (userGroupId == Roles.GLOBAL_GROUP) {
              userGroupTitle = 'System';
            } else {
              const userGroup = GroupsCollection.findOne({_id: userGroupId});
console.log("userGroup", userGroup);
              userGroupTitle = userGroup.title;
            }

            Session.setPersistent('Users_Groups_id', userGroupId);
            Session.setPersistent('Users_Groups_title', userGroupTitle);
          }
          this.props.history.replace('/');
        } else {
          this.props.history.replace('/SelectUserGroup');
        }
      },
      onSignedOutHook: () => {
        Session.setPersistent('Users_Groups_id', null);
        Session.setPersistent('Users_Groups_title', null);

        this.props.history.replace('/');
      },
    });

    return (
      <div>
        <h1>Log In!</h1>
        <Accounts.ui.LoginForm />
      </div>
    );
  }

}
