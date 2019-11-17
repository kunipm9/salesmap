
/// Sys - Network
import { checkNetwork } from '@imports/ui/crud/checkNetwork';
/// Sys - Network --

import { Session } from 'meteor/session';
import React from 'react';

import {
  MDBBtn,
} from "mdbreact";


import { GroupsCollection } from '@imports/api/GroupsCollection';


/**
 *
 *
 * @export
 * @class Home
 * @extends {React.Component}
 */
export default class Home extends React.Component {

  "use strict";

  /**
   *
   *
   * @param {*} d
   * @memberof Home
   */
  setUserGroup(d) {
     Session.setPersistent('Users_Groups_id', d._id);
     Session.setPersistent('Users_Groups_title', d.title);
  }

  /**
   *
   *
   * @returns
   * @memberof Home
   */
  render() {
    /// Sys - Network - check
    checkNetwork();
    /// Sys - Network - check --
    const items = [];
    const loggedInUser = Meteor.user();
    for (const userGroupId in loggedInUser.roles) {
      if (userGroupId == Roles.GLOBAL_GROUP) {
        items.push({_id: userGroupId, title: 'System'});
      } else {
        const userGroup = GroupsCollection.findOne({_id: userGroupId});
        items.push({_id: userGroupId, title: userGroup.title});
      }
    }

    return (
      <React.Fragment>
        <div>
          <h1>Select UserGroup</h1>

          { items.map(d => {
            return <MDBBtn
              key={d._id}
              color="primary"
              className="btnfont"
              onClick={() => {
                this.setUserGroup(d);
                setTimeout(() => this.props.history.goBack(), window.$GLOBAL$.transitionDuration);
              }}>{d.title}</MDBBtn>
          }) }

        </div>
      </React.Fragment>
    );
  }

}
