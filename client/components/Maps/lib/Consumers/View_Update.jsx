/// Sys - AutoForm
import { Session } from "meteor/session";
import React from "react";
import AutoForm from "uniforms-bootstrap4/AutoForm";
import AutoFields from "@imports/ui/uniforms/AutoFields";
import ErrorsField from "uniforms-bootstrap4/ErrorsField";
import Update from "@imports/ui/crud/Update";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Custom - LocalStorage
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";
/// Custom - LocalStorage --

/// Sys - Network
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const Maps_Consumers_View_Update_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Consumers", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Maps/Consumers/Update", path: "/Maps/Consumers/Update" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Maps_Consumers_View_Update
 * @extends {Update}
 */
export class Maps_Consumers_View_Update extends Update {
  "use strict";

  /**
   *Creates an instance of Maps_Consumers_View_Update.
   * @param {*} props
   * @memberof Maps_Consumers_View_Update
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Consumers_View_Update_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Consumers",
      docs: {},
      simpleSchema: Maps_Consumers_Collection.simpleSchema(),
      dispTitle: Maps_Consumers_Collection.dispTitle
    };
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --
    this.SumCollection = Maps_ConsumersSum_Collection;
    /** @type {any[]} */
    this.CollectionList = [];
    /// Custom - LocalStorage --

    /// Sys - AutoForm - rebuild field !!!!!!!!!!
    this.postConstructor();
    /// Sys - AutoForm - rebuild field !!!!!!!!!! --

    this.submit = this.submit.bind(this);
    const doc = this.Collection.docs[this.props.match.params._id];
    if (!doc.residenceAddress) {
      doc.residenceAddress = {};
    }
    doc.residenceAddress.address = this.props.address;
    doc.residenceAddress.location = this.props.location;
    this.state.doc = doc;

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }

  /// Application - 選択ボタン
  /**
   *
   *
   * @param {*} nextProps
   * @memberof Maps_Consumers_View_Update
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.formRef) {
      this.formRef.reset();
    }

    const doc = this.Collection.docs[nextProps.match.params._id];
    doc.residenceAddress.address = this.props.address;
    doc.residenceAddress.location = this.props.location;
    this.setState({ doc: doc });
  }
  /// Application - 選択ボタン --

  /// Application - Save
  /**
   *
   *
   * @param {*} doc
   * @memberof Maps_Consumers_View_Update
   */
  submit(doc) {
    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

    Persister.call(
      this.Form_name + ".update",
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
      this.updateCallbackPersister
    );
    /// Sys - AutoForm - update --

    /// Custom - localCollection - update
    this.Collection.docs[doc._id] = doc;
    /// Custom - localCollection - update --

    Bert.alert({
      type: "success",
      hideDelay: 10000,
      message: "情報を更新しました"
    });
    this.props.setState({ updateDocState: false });
  }
  /// Application - Save --

  /**
   *
   *
   * @returns
   * @memberof Maps_Consumers_View_Update
   */
  render() {
    let simpleSchema;
    if (typeof this.Collection.simpleSchema == "function") {
      simpleSchema = this.Collection.simpleSchema();
    } else {
      simpleSchema = this.Collection.simpleSchema;
    }
    /// Sys - AutoForm - layout
    return (
      <React.Fragment>
        <AutoForm
          schema={simpleSchema}
          ref={ref => this.ready(ref)}
          onChange={this.change}
          onSubmit={this.submit}
          model={this.state.doc}
          placeholder={true}
          disabled={this.state.disabled}
          showInlineError={true}
        >
          <AutoFields
            className="no-gutters row"
            fields={["identity", "residenceAddress.address", "contact", "tags"]}
          />
          <ErrorsField />
          {this.UpdateFormButtons()}
        </AutoForm>
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
