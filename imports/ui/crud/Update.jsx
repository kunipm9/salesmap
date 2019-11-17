/// Sys - AutoForm
import React from "react";
import AutoForm from "uniforms-bootstrap4/AutoForm";
import AutoFields from "@imports/ui/uniforms/AutoFields";
import ErrorsField from "uniforms-bootstrap4/ErrorsField";
import { rebuildField, rebuildForm } from "@imports/ui/uniforms/rebuildField";
import { Overlay, Popover } from "react-bootstrap";
import SubmitField from "@imports/ui/uniforms/SubmitField";
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

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole"; // eslint-disable-line no-unused-vars
/// Sys - Role --

/// Sys - Network
import { checkNetwork } from "@imports/ui/crud/checkNetwork";
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

/**
 *
 *
 * @export
 * @class Update
 * @extends {React.Component}
 */
export default class Update extends React.PureComponent {
  "use strict";

  /**
   *Creates an instance of Update.
   * @param {*} props
   * @memberof Update
   */
  constructor(props) {
    super(props);

    /// Sys - AutoForm
    this.initialValue = {};

    this.securityCheck = this.securityCheck.bind(this);
    this.ready = this.ready.bind(this);
    this.isReadyOnDisabled = false;
    this.isReady = false;
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
    this.updateCallbackPersister = this.updateCallbackPersister.bind(this);
    this.updateCallback = this.updateCallback.bind(this);
    this.formRef = null;
    this.dirty = true;
    this.state = {
      doc: this.initialValue,
      disabled: true,
      confirmTarget: null,
      confirmRecover: false,
      confirmCancel: false,
      confirmDelete: false
    };
    this.onClickRecoverButton = ({ target }) => {
      console.log("this.onClickRecoverButton", target);
      this.setState({ confirmTarget: target, confirmRecover: true });
    };
    this.onClickCancelButton = ({ target }) => {
      console.log("this.onClickCancelButton", target);
      this.setState({ confirmTarget: target, confirmCancel: true });
    };
    this.onClickDeleteButton = ({ target }) => {
      console.log("onClickDeleteButton", target);
      this.setState({ confirmTarget: target, confirmDelete: true });
    };
    /// Sys - AutoForm --

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof Update
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
   * @memberof Update
   */
  securityCheck() {
    if (this.ComponentInfo) {
      if (!this.ComponentInfo("read")) {
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
   * @returns
   * @memberof Update
   */
  componentDidMount() {
    /// Sys - Network - check
    if (Meteor.status().status == "connecting") {
      setTimeout(() => {
        this.componentDidMount();
      }, 500);
      return;
    }

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

    /// Sys - AutoForm - load data
    const { _id } = this.props.match.params;
    let doc; // eslint-disable-line no-redeclare
    if (_id) {
      /// Sys - Collection - LocalStotage
      if (this.Collection && "docs" in this.Collection) {
        doc = this.Collection.docs[_id] || null;
      } else {
        doc = this.Collection.findOne({ _id: _id });
      }
      /// Sys - Collection - LocalStotage --

      if (doc) {
        /// Sys - AutoForm - rebuild field
        doc.__Form_name = this.Form_name;
        /// Sys - AutoForm - rebuild field --
      } else {
        console.log(`Data not found. ${this.ComponentInfo("update")["path"]}`);

        doc = {};
        doc._id = "";
        this.props.history.replace("/");
      }
      this.setState({ doc: doc });
    }
    /// Sys - AutoForm - load data --
  }

  /**
   *
   *
   * @memberof Update
   */
  componentWillUnmount() {
console.log("componentWillUnmount ---------------------", this.Form_name);
    for (let fieldName in window.$GLOBAL$.fields) {
      if (fieldName.split(":")[0] == this.Form_name) {
        delete window.$GLOBAL$.fields[fieldName];
      }
    }
    delete window.$GLOBAL$.formRef[this.Form_name];
  }

  /// Sys - Persister
  /**
   *
   *
   * @param {*} error
   * @memberof Update
   */
  updateCallbackPersister(error) {
    /// Sys - AutoForm - update
    if (error) {
      Bert.alert({
        type: "danger",
        hideDelay: 10000,
        message: `Update failed: ${error.message}`
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
   * @memberof Update
   */
  updateCallback(error) {
    /// Sys - AutoForm - update
    if (error) {
      Bert.alert({
        type: "danger",
        hideDelay: 10000,
        message: `Update failed: ${error.message}`
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
   * @memberof Update
   */
  ready(formRef) {
    /// Sys - AutoForm - initialize form state
    window.$GLOBAL$.formRef[this.Form_name] = this.formRef = formRef;
    window.$GLOBAL$.changingFormMode = "update";

    if (formRef && this.state.disabled && !this.isReadyOnDisabled) {
      this.isReadyOnDisabled = true;

      /// Sys - AutoForm - rebuild form
      setTimeout(() => {
        rebuildForm(this.Form_name, formRef.props.model);
      }, 20);
      /// Sys - AutoForm - rebuild form --
    }

    if (formRef && !this.state.disabled && !this.isReady) {
      this.isReady = true;

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
  /// AutoForm --

  /// AutoForm
  /**
   *
   *
   * @param {string} key
   * @param {*} value
   * @memberof Update
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
      this.dirty = true;
    }
    /// Sys - AutoForm - dirty form --

    /// Sys - AutoForm - initialize form state --
  }

  /**
   *
   *
   * @param {*} doc
   * @returns
   * @memberof Update
   */
  submit(doc, afterCommit) {
    if (!afterCommit) {
      afterCommit = this.props.history.goBack;
    }

    if (
      (this.Collection && "docs" in this.Collection) ||
      "_persisters" in this.Collection
    ) {
      /// Sys - Persister

      /// Sys - AutoForm - update
      const Users_Groups_id = Session.get("Users_Groups_id");

      console.assert(
        this.ComponentInfo("update"),
        "ComponentInfo('update') is undefined"
      );
      if (!this.ComponentInfo("update")) {
        this.props.history.replace("/");
        return;
      }

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
      if (this.Collection && "docs" in this.Collection) {
        this.Collection.docs[doc._id] = doc;
      }
      /// Custom - localCollection - update --

      Bert.alert({
        type: "success",
        hideDelay: 10000,
        message: "情報を更新しました"
      });
      setTimeout(() => {
        afterCommit();
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
        this.Form_name + ".update",
        Users_Groups_id,
        doc._id,
        doc,
        this.updateCallback
      );
      /// Sys - AutoForm - update --
    }
  }

  /**
   *
   *
   * @returns
   * @memberof Update
   */
  remove() {
    if (
      (this.Collection && "docs" in this.Collection) ||
      "_persisters" in this.Collection
    ) {
      /// Sys - Persister

      /// Sys - AutoForm - remove
      const Users_Groups_id = Session.get("Users_Groups_id");
      Persister.call(
        this.Form_name + ".remove",
        Users_Groups_id,
        this.formRef.props.model._id,
        this.formRef.props.model,
        /// Sys - ApplicationError - init
        {
          methodCall: "delete",
          proc: this.ComponentInfo("delete").title,
          record: this.Collection.dispTitle(this.formRef.props.model),
          callAt: Date.now()
        },
        /// Sys - ApplicationError - init --
        this.updateCallbackPersister
      );
      /// Sys - AutoForm - remove --

      /// Custom - localCollection - remove
      if (this.Collection && "docs" in this.Collection) {
        this.Collection.docs[this.formRef.props.model._id]._deleted = true;
      }
      /// Custom - localCollection - remove --

      Bert.alert({
        type: "success",
        hideDelay: 10000,
        message: "情報を更新しました"
      });

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

      /// Sys - AutoForm - remove
      const Users_Groups_id = Session.get("Users_Groups_id"); // eslint-disable-line no-redeclare
      Persister.call(
        this.Form_name + ".remove",
        Users_Groups_id,
        this.formRef.props.model._id,
        this.formRef.props.model,
        this.updateCallback
      );
      /// Sys - AutoForm - remove --
    }
  }

  /**
   *
   *
   * @returns
   * @memberof Update
   */
  recover() {
    if (
      (this.Collection && "docs" in this.Collection) ||
      "_persisters" in this.Collection
    ) {
      /// Sys - Persister

      /// Sys - AutoForm - recover
      const Users_Groups_id = Session.get("Users_Groups_id");
      Persister.call(
        this.Form_name + ".recover",
        Users_Groups_id,
        this.formRef.props.model._id,
        this.formRef.props.model,
        /// Sys - ApplicationError - init
        {
          methodCall: "recover",
          proc: this.ComponentInfo("delete").title,
          record: this.Collection.dispTitle(this.formRef.props.model),
          callAt: Date.now()
        },
        /// Sys - ApplicationError - init --
        this.updateCallbackPersister
      );
      /// Sys - AutoForm - recover --

      /// Custom - localCollection - recover
      if (this.Collection && "docs" in this.Collection) {
        this.Collection.docs[this.formRef.props.model._id]._deleted = null;
      }
      /// Custom - localCollection - recover --

      Bert.alert({
        type: "success",
        hideDelay: 10000,
        message: "情報を更新しました"
      });
      setTimeout(() => {
        this.props.history.goBack();
      }, window.$GLOBAL$.transitionDuration);
      /// Sys - Persister --

      /// Sys - Persister --
    } else {
      /// Sys - Network - check
      if (!checkNetwork()) {
        return;
      }
      /// Sys - Network - check --

      /// Sys - AutoForm - recover
      const Users_Groups_id = Session.get("Users_Groups_id"); // eslint-disable-line no-redeclare
      Meteor.call(
        this.Form_name + ".recover",
        Users_Groups_id,
        this.formRef.props.model._id,
        this.formRef.props.model,
        this.updateCallback
      );
      /// Sys - AutoForm - recover --
    }
  }

  /**
   *
   *
   * @memberof Update
   */
  UpdateFormButtons = () => {
    /// Sys - AutoForm - layout
    return (
      <React.Fragment>
        {this.state.disabled && (
          <React.Fragment>
            <MDBBtn
              color="info"
              className="btnfont"
              onClick={() => {
                setTimeout(
                  () => this.props.history.goBack(),
                  window.$GLOBAL$.transitionDuration
                );
              }}
            >
              戻る
            </MDBBtn>
          </React.Fragment>
        )}

        {this.state.disabled &&
          !this.state.doc._deleted &&
          this.ComponentInfo("update") && (
            <MDBBtn
              className="btnfont"
              onClick={() => {
                this.setState({ disabled: false });
              }}
            >
              修正
            </MDBBtn>
          )}

        {this.state.disabled &&
          this.state.doc._deleted &&
          this.ComponentInfo("delete") && (
            <MDBBtn className="btnfont" onClick={this.onClickRecoverButton}>
              復旧
            </MDBBtn>
          )}

        {!this.state.disabled && (
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
          </React.Fragment>
        )}

        {!this.state.disabled && this.ComponentInfo("delete") && (
          <MDBBtn
            color="danger"
            className="btnfont"
            onClick={this.onClickDeleteButton}
          >
            削除
          </MDBBtn>
        )}

        <Overlay
          show={this.state.confirmRecover}
          target={this.state.confirmTarget}
          placement="right"
          container={this}
          containerPadding={0}
        >
          <Popover id="top" title="復元しますか?">
            <MDBBtn
              color="info"
              onClick={() => {
                this.setState({ confirmRecover: false });
              }}
              className="btnfont"
            >
              取消
            </MDBBtn>
            <MDBBtn
              color="danger"
              onClick={() => {
                this.recover();
              }}
              className="btnfont"
            >
              復元
            </MDBBtn>
          </Popover>
        </Overlay>

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

        <Overlay
          show={this.state.confirmDelete}
          target={this.state.confirmTarget}
          placement="right"
          container={this}
          containerPadding={0}
        >
          <Popover id="top" title="削除しますか?">
            <MDBBtn
              color="info"
              onClick={() => {
                this.setState({ confirmDelete: false });
              }}
              className="btnfont"
            >
              取消
            </MDBBtn>
            <MDBBtn
              color="danger"
              onClick={() => {
                this.remove();
              }}
              className="btnfont"
            >
              削除
            </MDBBtn>
          </Popover>
        </Overlay>
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  };

  /**
   *s
   *
   * @returns
   * @memberof Update
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
          <AutoFields className="no-gutters row" />
          <ErrorsField />
          {this.UpdateFormButtons()}
        </AutoForm>
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
