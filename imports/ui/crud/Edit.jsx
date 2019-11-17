/// Sys - AutoForm
import React from "react";
import { Overlay, Popover } from "react-bootstrap";
import SubmitField from "@imports/ui/uniforms/SubmitField";
import Update from "@imports/ui/crud/Update";
/// Sys - AutoForm --

/// Sys - AutoForm - collection
import { Session } from "meteor/session";
/// Sys - AutoForm - collection --

/// Sys - AutoForm - layout
import { MDBBtn } from "mdbreact";
/// Sys - AutoForm - layout --

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
 * @class Edit
 * @extends {Update}
 */
export default class Edit extends Update {
  "use strict";

  /**
   *
   *
   * @returns
   * @memberof Edit
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

    let doc = this.Collection.findOne(this.singleRecordKey);
    if (doc) {
      /// Sys - AutoForm - rebuild field
      doc.__Form_name = this.Form_name;
      this.setState({ doc: doc });
      /// Sys - AutoForm - rebuild field --
    } else {
      console.assert(
        this.ComponentInfo("create"),
        "ComponentInfo('create') is undefined"
      );
      if (!this.ComponentInfo("create")) {
        this.props.history.replace("/");
        return;
      }

      if (
        (this.Collection && "docs" in this.Collection) ||
        "_persisters" in this.Collection
      ) {
        /// Sys - Persister
        const Users_Groups_id = Session.get("Users_Groups_id");
        doc = this.initialValue || this.formRef.props.schema.clean({});
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
          },
          /// Sys - ApplicationError - init --
          (error, insertId) => {
            doc._id = insertId;

            /// Sys - AutoForm - rebuild field
            doc.__Form_name = this.Form_name;
            this.setState({ doc: doc });
            /// Sys - AutoForm - rebuild field --
          }
        );
        /// Sys - Persister --
      } else {
        const Users_Groups_id = Session.get("Users_Groups_id");
        doc = this.initialValue || this.formRef.props.schema.clean({});
        Meteor.call(
          this.Form_name + ".insert",
          Users_Groups_id,
          doc,
          (error, insertId) => {
            doc._id = insertId;

            /// Sys - AutoForm - rebuild field
            doc.__Form_name = this.Form_name;
            this.setState({ doc: doc });
            /// Sys - AutoForm - rebuild field --
          }
        );
      }
    }
    /// Sys - AutoForm - load data --
  }

  /**
   *
   *
   * @memberof Edit
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

        {this.state.disabled && this.ComponentInfo("update") && (
          <MDBBtn
            className="btnfont"
            onClick={() => {
              this.setState({ disabled: false });
            }}
          >
            修正
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
}
