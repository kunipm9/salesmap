/// Sys - AutoForm
import React from "react";
import { Random } from "meteor/random";
import AutoForm from "uniforms-bootstrap4/AutoForm";
import AutoFields from "@imports/ui/uniforms/AutoFields";
import ErrorsField from "uniforms-bootstrap4/ErrorsField";
import SubmitField from "@imports/ui/uniforms/SubmitField";
import { rebuildField, rebuildForm } from "@imports/ui/uniforms/rebuildField";
import { Overlay, Popover } from "react-bootstrap";
/// Sys - AutoForm --

/// Sys - AutoForm - collection
import { Session } from "meteor/session";
/// Sys - AutoForm - collection --

/// Sys - AutoForm - layout
import { MDBBtn } from "mdbreact";
/// Sys - AutoForm - layout --

/// Sys - AutoForm - info
import { Bert } from "meteor/themeteorchef:bert";
/// Sys - AutoForm - info --

/// Sys - Network
import { checkNetwork } from "@imports/ui/crud/checkNetwork";
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

/**
 *
 *
 * @export
 * @class Insert
 * @extends {React.Component}
 */
export default class Insert extends React.PureComponent {
  "use strict";

  /**
   *Creates an instance of Insert.
   * @param {*} props
   * @memberof Insert
   */
  constructor(props) {
    super(props);

    /// Sys - AutoForm
    this.initialValue = {};

    this.securityCheck = this.securityCheck.bind(this);
    this.ready = this.ready.bind(this);
    this.isReady = false;
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
    this.updateCallbackPersister = this.updateCallbackPersister.bind(this);
    this.updateCallback = this.updateCallback.bind(this);
    this.formRef = null;
    this.dirty = true;
    this.state = {
      doc: this.initialValue,
      confirmTarget: null,
      confirmCancel: false
    };
    this.onClickCancelButton = ({ target }) => {
      this.setState({ confirmTarget: target, confirmCancel: true });
    };
    /// Sys - AutoForm --

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof Insert
   */
  postConstructor() {
    /// Sys - AutoForm - rebuild field
    console.assert(this.Form_name, "this.Form_name is undefined.");
    window.$GLOBAL$.formRef[this.Form_name] = "init";
    this.state.doc.__Form_name = this.Form_name; // eslint-disable-line react/no-direct-mutation-state
    /// Sys - AutoForm - rebuild field --

    /// Sys - Collection - LocalStorage
    if (this.Collection && "docs" in this.Collection) {
      this.Collection.docs = window.$GLOBAL$.Collection[this.Collection._name];
    }
    /// Sys - Collection - LocalStorage --
  }

  /**
   *
   *
   * @memberof Insert
   */
  componentWillUnmount() {
    /// Sys - AutoForm - rebuild field
    for (let fieldName in window.$GLOBAL$.fields) {
      if (fieldName.split(":")[0] == this.Form_name) {
        delete window.$GLOBAL$.fields[fieldName];
      }
    }
    delete window.$GLOBAL$.formRef[this.Form_name];
    /// Sys - AutoForm - rebuild field --
  }

  /**
   *
   *
   * @memberof Insert
   */
  securityCheck() {
    if (this.ComponentInfo) {
      if (!this.ComponentInfo("create")) {
        console.error(`Security check.`);
        if (this.props.history) {
          this.props.history.replace("/");
        } else {
          window.location.href = "/";
        }
      }
    }
  }

  /**
   *
   *
   * @memberof Insert
   */
  componentDidMount() {
    /// Sys - Network - check
    const networkStatus = checkNetwork();
    /// Sys - Network - check --

    /// Custom - Role - check permission
    if (networkStatus) {
      this.securityCheck(this);
    } else {
      setTimeout(() => {
        this.securityCheck(this);
      }, 500);
    }
    /// Custom - Role - check permission --
  }

  /// Sys - Persister
  /**
   *
   *
   * @param {*} error
   * @memberof Insert
   */
  updateCallbackPersister(error) {
    /// Sys - AutoForm - update
    if (error) {
      Bert.alert({
        type: "danger",
        hideDelay: 10000,
        message: `Add failed: ${error.message}`
      });
    } else {
      Bert.alert({
        type: "success",
        hideDelay: 10000,
        message: "情報を更新しました"
      });
    }
    /// Sys - AutoForm - update --
  }
  /// Sys - Persister --

  /**
   *
   *
   * @param {*} error
   * @memberof Insert
   */
  updateCallback(error) {
    /// Sys - AutoForm - update
    if (error) {
      Bert.alert({
        type: "danger",
        hideDelay: 10000,
        message: `Add failed: ${error.message}`
      });
    } else {
      Bert.alert({
        type: "success",
        hideDelay: 10000,
        message: "情報を更新しました"
      });

      setTimeout(() => {
        this.props.history.goBack();
      }, window.$GLOBAL$.transitionDuration);
    }
    /// Sys - AutoForm - update --
  }

  /**
   *
   *
   * @param {*} formRef
   * @memberof Insert
   */
  ready(formRef) {
    /// Sys - AutoForm - initialize form state
    window.$GLOBAL$.formRef[this.Form_name] = this.formRef = formRef;
    window.$GLOBAL$.changingFormMode = "insert";

    if (formRef && !this.isReady) {
      this.isReady = true;

      /// Sys - AutoForm - rebuild field
      formRef.props.model.__Form_name = this.Form_name;
      /// Sys - AutoForm - rebuild field --

      /// Sys - AutoForm - rebuild form
      setTimeout(() => {
        rebuildForm(this.Form_name, formRef.props.model);
      }, 20);
      /// Sys - AutoForm - rebuild form --

      /// Sys - AutoForm - dirty form
      setTimeout(() => {
        this.dirty = false;
      }, 100);
      /// Sys - AutoForm - dirty form --
    }
    /// Sys - AutoForm - initialize form state --
  }

  /**
   *
   *
   * @param {string} key
   * @param {*} value
   * @memberof Insert
   */
  // eslint-disable-next-line no-unused-vars
  change(key, value) {
    /// Sys - AutoForm - initialize form state

    /// Sys - AutoForm - rebuild form
    window.$GLOBAL$.changingFormName = this.Form_name;
    window.$GLOBAL$.formRef[this.Form_name] = this.formRef;
    rebuildField(this.Form_name, key);
    /// Sys - AutoForm - rebuild form --

    /// Sys - AutoForm - dirty form
    // Set Confirm Buttons
    if (!this.dirty) {
      /*
      $('.confirmation.dirty').confirmation({
        rootSelector: '.confirmation.dirty',
        title: '変更を破棄しますか？',
        btnOkClass: 'mdb-color danger-color-dark',
        btnCancelClass: 'mdb-color stylish-color',
      });
*/
    }
    /// Sys - AutoForm - dirty form --

    /// Sys - AutoForm - initialize form state --
  }

  /**
   *
   *
   * @param {*} doc
   * @returns
   * @memberof Insert
   */
  submit(doc) {
    if (
      (this.Collection && "docs" in this.Collection) ||
      "_persisters" in this.Collection
    ) {
      /// Sys - Persister

      /// Sys - AutoForm - update

      /// Custom - localCollection - insert
      if (this.Collection && "docs" in this.Collection) {
        doc._id = Random.id(15);
      }
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
      if (this.Collection && "docs" in this.Collection) {
        this.Collection.docs[doc._id] = doc;
      }
      /// Custom - localCollection - insert --

      Bert.alert({
        type: "success",
        hideDelay: 10000,
        message: "情報を更新しました"
      });
      setTimeout(() => {
        this.props.history.goBack();
      }, window.$GLOBAL$.transitionDuration);
      /// Sys - Persister --
    } else {
      /// Sys - Network - check
      if (!checkNetwork()) {
        return;
      }
      /// Sys - Network - check --

      /// Sys - AutoForm - update
      const Users_Groups_id = Session.get("Users_Groups_id"); // eslint-disable-line no-redeclare
      Meteor.call(
        this.Form_name + ".insert",
        Users_Groups_id,
        doc,
        this.updateCallback
      );
      /// Sys - AutoForm - update --
    }
  }

  /**
   *
   *
   * @memberof Insert
   */
  InsertFormButtons = () => {
    /// Sys - AutoForm - layout
    return (
      <React.Fragment>
        <MDBBtn
          color="danger"
          className="btnfont"
          onClick={this.onClickCancelButton}
        >
          キャンセル
        </MDBBtn>
        <SubmitField
          className="d-inline-block"
          inputClassName="btnfont btn btn-primary"
          value="保存"
        />

        <Overlay
          show={this.state.confirmCancel}
          target={this.state.confirmTarget}
          placement="right"
          container={this}
          containerPadding={0}
        >
          <Popover id="top" title="キャンセルしますか?">
            <MDBBtn
              color="info"
              onClick={() => {
                this.setState({ confirmCancel: false });
              }}
              className="btnfont"
            >
              取消
            </MDBBtn>
            <MDBBtn
              color="danger"
              onClick={() => {
                this.props.history.goBack();
              }}
              className="btnfont"
            >
              キャンセル
            </MDBBtn>
          </Popover>
        </Overlay>
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  };

  /**
   *
   *
   * @returns
   * @memberof Insert
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
          showInlineError={true}
        >
          <AutoFields className="no-gutters row" />
          <ErrorsField />
          {this.InsertFormButtons()}
        </AutoForm>
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
