/// Sys - AutoForm
import { Session } from "meteor/session";
import React from "react";
import AutoFields from "@imports/ui/uniforms-material/AutoFields";
import ErrorsField from "uniforms-bootstrap4/ErrorsField";
import { Update_Base } from "../lib/Update_Base";
import _ from "lodash";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Sys - Network
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

import { MapsSP_Consumers_Detail_ComponentInfo } from "./Detail";

/**
 *
 *
 * @export
 * @class Add_Communication
 * @extends {Update}
 */
export class Add_Communication extends Update_Base {
  "use strict";

  /**
   *Creates an instance of Add_Communication.
   * @param {*} props
   * @memberof Add_Communication
   */
  constructor(props) {
    super(props);

    if (!props) {
      return;
    }

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Consumers_Detail_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Consumers",
      docs: {},
      simpleSchema: Maps_Consumers_Collection.simpleSchema(),
      dispTitle: Maps_Consumers_Collection.dispTitle
    };
    this.Form_name = this.Collection._name + "_ext_Communication";
    /// Custom - AutoForm - rebuild field --
    this.CollectionList = [];
    /// Custom - LocalStorage --

    /// Sys - AutoForm - rebuild field !!!!!!!!!!
    this.postConstructor();
    /// Sys - AutoForm - rebuild field !!!!!!!!!! --

    this.submit = this.submit.bind(this);
    this.securityCheck = this.securityCheck.bind(this);

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    this.state.disabled = false;
    /// Sys - AutoForm - rebuild field --

    this.state.doc = _.cloneDeep(this.props.doc);

    if (!this.state.doc.communications) {
      this.state.doc.communications = [];
    }
    this.state.index = this.state.doc.communications.length;
    this.state.doc.communications[this.state.index] = {
      communication: {
        staff: Meteor.user().profile.username
      }
    };
  }

  /// Application - Save
  /**
   *
   *
   * @param {*} doc
   * @memberof Add_Communication
   */
  submit(doc) {
    console.log("submit========================================");
    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

    Persister.call(
      //this.Form_name + ".update",
      "Maps_Consumers.update",
      Users_Groups_id,
      doc._id,
      doc,
      /// Sys - ApplicationError - init
      {
        methodCall: "update",
        proc: this.ComponentInfo("update").title,
        record: this.Collection.dispTitle(doc),
        callAt: Date.now()
      },
      /// Sys - ApplicationError - init --
      this.props.close
    );
    /// Sys - AutoForm - update --

    window.$GLOBAL$.Collection[this.Collection._name][doc._id] = doc;
    this.props.updateDoc(doc);

    Bert.alert({
      type: "success",
      hideDelay: 10000,
      message: "情報を更新しました"
    });
  }
  /// Application - Save --

  /**
   *
   *
   * @returns
   * @memberof Add_Communication
   */
  render() {
    if (!this.state.doc || !this.state.doc._id) {
      this.props.close();
    }

    let simpleSchema;
    if (typeof this.Collection.simpleSchema == "function") {
      simpleSchema = this.Collection.simpleSchema();
    } else {
      simpleSchema = this.Collection.simpleSchema;
    }

    return super.render(
      simpleSchema,
      <React.Fragment>
        <AutoFields
          fields={simpleSchema._schemaKeys
            .filter(
              f =>
                f.startsWith("communications.$.communication.") &&
                f != "communications.$.communication.contents"
            )
            .map(f => {
              if (f.startsWith("communications.$.communication.")) {
                return f.replace("$", String(this.state.index));
              }
            })}
        />
        <ErrorsField />
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
