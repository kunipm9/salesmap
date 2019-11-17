/// Sys - AutoForm
import { Session } from "meteor/session";
import React from "react";
import AutoField from "@imports/ui/uniforms-material/AutoField";
import ListFieldStyled from "@imports/ui/uniforms-material/styled/ListField";
import ListItemFieldStyled from "@imports/ui/uniforms-material/styled/ListItemField";
import ErrorsField from "uniforms-bootstrap4/ErrorsField";
import { Add_Base } from "../lib/Add_Base";
/// Sys - AutoForm --

import { MapsSP_Consumers_Detail_ComponentInfo } from "./Detail";

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Sys - Network
import { Random } from "meteor/random";
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

/**
 *
 *
 * @export
 * @class Add_Family
 * @extends {Update}
 */
export class Add_Family extends Add_Base {
  "use strict";

  /**
   *Creates an instance of Add_Family.
   * @param {*} props
   * @memberof Add_Family
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
    this.Form_name = this.Collection._name + "_ext_Family";
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
    /// Sys - AutoForm - rebuild field --

    this.newDoc = null;

    this.state.doc.rank = "";
    this.state.doc.residenceAddress = this.props.doc.residenceAddress;
  }

  /// Application - Save
  /**
   *
   *
   * @param {*} doc
   * @memberof Add_Family
   */
  submit(doc) {
    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

    doc._id = Random.id(15);
    this.newDoc = doc;

    Persister.call(
      //this.Form_name + ".insert",
      "Maps_Consumers.insert",
      Users_Groups_id,
      doc,
      /// Sys - ApplicationError - init
      {
        methodCall: "create",
        proc: this.ComponentInfo("create").title,
        record: this.Collection.dispTitle(doc),
        callAt: Date.now()
      },
      /// Sys - ApplicationError - init --
      this.addFamily
    );
    /// Sys - AutoForm - update --

    window.$GLOBAL$.Collection[this.Collection._name][doc._id] = doc;
  }
  /// Application - Save --

  /**
   *
   *
   * @memberof _Sel_Family
   */
  addFamily = () => {
    Bert.alert({
      type: "success",
      hideDelay: 10000,
      message: "情報を更新しました"
    });

    this.props.close(this.newDoc);
  };
  /// Application - Save --

  /**
   *
   *
   * @returns
   * @memberof Add_Family
   */
  render() {
    let simpleSchema;
    if (typeof this.Collection.simpleSchema == "function") {
      simpleSchema = this.Collection.simpleSchema();
    } else {
      simpleSchema = this.Collection.simpleSchema;
    }

    return super.render(
      simpleSchema,
      <React.Fragment>
        <AutoField name="rank" />

        <AutoField name="identity.name" />
        <AutoField name="identity.kana" />

        <AutoField name="identity.sex" />

        <ListFieldStyled name="contact.tels">
          <ListItemFieldStyled name="$">
            <AutoField name="tel" />
          </ListItemFieldStyled>
        </ListFieldStyled>

        <ListFieldStyled name="contact.faxs">
          <ListItemFieldStyled name="$">
            <AutoField name="fax" />
          </ListItemFieldStyled>
        </ListFieldStyled>

        <ListFieldStyled name="contact.emails">
          <ListItemFieldStyled name="$">
            <AutoField name="address" />
          </ListItemFieldStyled>
        </ListFieldStyled>

        <AutoField name="identity.birthDay" />

        <ErrorsField />
      </React.Fragment>
    );
  }
}
