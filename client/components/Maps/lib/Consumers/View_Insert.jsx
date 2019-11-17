/// Sys - AutoForm
import React from "react";
import { Random } from "meteor/random";
import AutoForm from "uniforms-bootstrap4/AutoForm";
import AutoFields from "@imports/ui/uniforms/AutoFields";
import AutoField from "@imports/ui/uniforms/AutoField";
import ErrorsField from "uniforms-bootstrap4/ErrorsField";
import Insert from "@imports/ui/crud/Insert";
import { Session } from "meteor/session";
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

/// Application
import { MDBBtn } from "mdbreact";
/// Application --

import { Tab } from 'semantic-ui-react'

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const Maps_Consumers_View_Insert_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Consumers", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Maps/Consumers/Insert", path: "/Maps/Consumers/Insert" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Maps_Consumers_View_Insert
 * @extends {Insert}
 */
export class Maps_Consumers_View_Insert extends Insert {
  "use strict";

  /**
   *Creates an instance of Maps_Consumers_View_Insert.
   * @param {*} props
   * @memberof Maps_Consumers_View_Insert
   */
  constructor(props) {
    super(props);
    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Consumers_View_Insert_ComponentInfo;
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

    /// Application - 建物情報参照ボタン
    this.state.doc = props.doc;
    /// Application - 建物情報参照ボタン --

    this.state.activeItem = "1";

    this.submit = this.submit.bind(this);

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }

  /// Application - 選択ボタン
  /**
   *
   *
   * @param {*} nextProps
   * @memberof Maps_Consumers_View_Insert
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.formRef) {
      this.formRef.reset();
    }

    const doc = nextProps.doc;
    this.setState({ doc: doc });
  }
  /// Application - 選択ボタン --

  /// Application - Save
  /**
   *
   *
   * @param {*} doc
   * @memberof Maps_Consumers_View_Insert
   */
  submit(doc) {
    /// Sys - AutoForm - update

    /// Custom - localCollection - insert
    doc._id = Random.id(15);
    /// Custom - localCollection - insert --

    const Users_Groups_id = Session.get("Users_Groups_id");
    Persister.call(
      this.Form_name + ".insert",
      Users_Groups_id,
      doc,
      /// Sys - ApplicationError - init
      {
        methodCall: "create",
        proc: this.ComponentInfo("create").title,
        record: this.Collection.dispTitle(doc),
        callAt: Date.now()
        /// Sys - ApplicationError - init --
      },
      this.updateCallbackPersister
    );
    /// Sys - AutoForm - update --

    /// Custom - localCollection - insert
    this.Collection.docs[doc._id] = doc;
    /// Custom - localCollection - insert --

    Bert.alert({
      type: "success",
      hideDelay: 10000,
      message: "情報を更新しました"
    });

    this.props.closeUserModal();
  }
  /// Application - Save --

  /**
   *
   *
   * @returns
   * @memberof Maps_Consumers_View_Insert
   */
  render() {
    let simpleSchema;
    if (typeof this.Collection.simpleSchema == "function") {
      simpleSchema = this.Collection.simpleSchema();
    } else {
      simpleSchema = this.Collection.simpleSchema;
    }


    const panes = [
      { menuItem: 'Tab 1', render: () => <AutoFields fields={["identity"]} /> },
      { menuItem: 'Tab 2', render: () => <AutoField name={"residenceAddress.address"} /> },
      { menuItem: 'Tab 3', render: () => <AutoField name={"contact"} /> },
      { menuItem: 'Tab 4', render: () => <AutoField name={"tags"} /> },
    ]
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
          showInlineError={true}
        >

          <AutoField name={"identity.name"} />

          <MDBBtn
            color="info"
            onClick={() => {
              this.setState({ activeItem: "1" });
            }}
            className="btnfont"
          >
            氏名等
          </MDBBtn>

          <MDBBtn
            color="info"
            onClick={() => {
              this.setState({ activeItem: "2" });
            }}
            className="btnfont"
          >
            住所
          </MDBBtn>

          <MDBBtn
            color="info"
            onClick={() => {
              this.setState({ activeItem: "3" });
            }}
            className="btnfont"
          >
            連絡先
          </MDBBtn>

          <MDBBtn
            color="info"
            onClick={() => {
              this.setState({ activeItem: "4" });
            }}
            className="btnfont"
          >
            タグ
          </MDBBtn>

          <Tab menu={{ secondary: true, pointing: true }} panes={panes} />


          <ErrorsField />
          {this.InsertFormButtons()}
        </AutoForm>
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
