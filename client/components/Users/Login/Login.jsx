/// Sys - AutoForm
import React from "react";
import AutoForm from "uniforms-bootstrap4/AutoForm";
import AutoFields from "@imports/ui/uniforms/AutoFields";
import ErrorsField from "uniforms-bootstrap4/ErrorsField";
import Insert from "@imports/ui/crud/Insert";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import SubmitField from "@imports/ui/uniforms/SubmitField";
/// Custom - AutoForm - collection --

/// Custom - Layout
import { MDBBtn } from "mdbreact";
/// Custom - Layout --

/// Custom - Role - check permission
/**
 *
 *
 * @returns
 */
const Users_Login_Login_ComponentInfo = () => {
  const loggedInUser = Meteor.user();
  if (loggedInUser) {
    return null;
  }
  return { title: "Login", path: "/Users/Login/Login" };
};
/// Custom - Role - check permission --

/// Custom - Role - insert button
/**
 *
 *
 * @param {*} {history}
 * @returns
 */
export const Users_Login_Login_Button = ({ history }) => {
  if (!Users_Login_Login_ComponentInfo()) {
    return <span />;
  }
  return (
    <MDBBtn
      color="primary"
      className="btnfont"
      onClick={() => {
        setTimeout(
          () => history.push("/Users/Login/Login"),
          window.$GLOBAL$.transitionDuration
        );
      }}
    >
      Login
    </MDBBtn>
  );
};
/// Custom - Role - insert button --

/// Custom - Role - check permission
import { Users_Groups_Collection } from "@imports/api/Users/Groups_Collection";
/// Custom - Role - check permission --

/// Custom AutoForm - schema
const Form_name = "Users_Login";

const LoginSchema = new SimpleSchema({
  email: {
    label: "Username (Email)",
    type: String,
    uniforms: {
      placeholder: "Please enter your username (email)."
    }
  },
  password: {
    label: "Password",
    type: String,
    uniforms: {
      type: "password",
      placeholder: "Please enter password."
    }
  }
});
/// Custom AutoForm - schema --

/**
 *
 *
 * @export
 * @class Users_Login_Login
 * @extends {Insert}
 */
export class Users_Login_Login extends Insert {
  "use strict";

  /**
   *Creates an instance of Users_Login_Login.
   * @param {*} props
   * @memberof Users_Login_Login
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Users_Login_Login_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - submit
    this.submit = this.submit.bind(this);
    this.submitSuccess = this.submitSuccess.bind(this);
    this.submitFailure = this.submitFailure.bind(this);
    this.submit = this.submit.bind(this);

    this.state = {
      loginError: null
    };
    /// Custom - AutoForm - submit --

    /// Custom - AutoForm - rebuild field
    this.Collection = null;
    this.Form_name = Form_name;
    this.state.doc = { __Form_name: this.Form_name };
    /// Custom - AutoForm - rebuild field --
  }

  /// Custom - AutoForm - validation
  /**
   *
   *
   * @param {*} key
   * @param {*} value
   * @memberof Users_Login_Login
   */
  change(key, value) {
    if (this.state.loginError) {
      this.setState({ loginError: null });
    }

    super.change(key, value);
  }
  /// Custom - AutoForm - validation --

  /// Custom - AutoForm - submit
  /**
   *
   *
   * @param {*} doc
   * @returns
   * @memberof Users_Login_Login
   */
  submit(doc) {
    return new Promise((resolve, reject) =>
      Meteor.loginWithPassword(doc.email, doc.password, error =>
        error ? reject(error) : resolve()
      )
    );
  }
  /// Custom - AutoForm - submit --

  /// Custom - AutoForm - validation
  /**
   *
   *
   * @memberof Users_Login_Login
   */
  submitSuccess() {
    console.log("submitSuccess");

    /// System - Role - check permission
    const loggedInUser = Meteor.user();
    if (Object.keys(loggedInUser.roles).length < 2) {
      if (Object.keys(loggedInUser.roles).length == 1) {
        console.log("loggedInUser", loggedInUser);
        const userGroupId = Object.keys(loggedInUser.roles)[0];
        console.log("userGroupId", userGroupId);
        let userGroupTitle = null;
        if (userGroupId == Roles.GLOBAL_GROUP) {
          userGroupTitle = "System";
        } else {
          const userGroup = Users_Groups_Collection.findOne({
            _id: userGroupId
          });
          console.log("userGroup", userGroup);
          userGroupTitle = userGroup.title;
        }

        Session.setPersistent("Users_Groups_id", userGroupId);
        Session.setPersistent("Users_Groups_title", userGroupTitle);
      }
      this.props.history.replace("/");
    } else {
      this.props.history.replace("/Users/Login/SelectUserGroup");
    }
    /// System - Role - check permission --
  }
  /// Custom - AutoForm - validation --

  /// Custom - AutoForm - validation
  /**
   *
   *
   * @param {*} error
   * @memberof Users_Login_Login
   */
  submitFailure(error) {
    console.log("submitFailure", error);
    this.setState({ loginError: error });
  }
  /// Custom - AutoForm - validation --

  /**
   *
   *
   * @returns
   * @memberof Users_Login_Login
   */
  render() {
    /// Custom - AutoForm - layout
    return (
      <React.Fragment>
        <h1>Users</h1>

        <AutoForm
          schema={LoginSchema}
          ref={ref => this.ready(ref)}
          onChange={this.change}
          onSubmit={this.submit}
          onSubmitFailure={this.submitFailure}
          onSubmitSuccess={this.submitSuccess}
          error={this.state.loginError}
          model={this.state.doc}
          placeholder={true}
          showInlineError={true}
        >
          <AutoFields />
          <SubmitField className="d-inline-block" value="Login" />
          <ErrorsField />
        </AutoForm>
      </React.Fragment>
    );
    /// Custom - AutoForm - layout --
  }
}
