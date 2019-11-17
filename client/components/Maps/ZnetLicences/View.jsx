//@ts-check

/// Sys - Layout
import React from "react";
import View from "@imports/ui/crud/View";
import { withTracker } from "meteor/react-meteor-data";
/// Sys - Layout --

/// Custom - Tabular - collection
import { Maps_ZnetLicences_Collection } from "@imports/api/Maps/ZnetLicences_Collection";
console.assert(
  Maps_ZnetLicences_Collection,
  "Maps_ZnetLicences_Collection is undefined."
);
/// Custom - Tabular - collection --

/// Sys - Network
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Application
import { ReactTabulator } from "react-tabulator"; // for React 15.x
import { Session } from "meteor/session";
import { MDBBtn } from "mdbreact";
import _ from "lodash";
import moment from "moment";
moment.locale("ja");
/// Application --

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
// eslint-disable-next-line no-unused-vars
export const Maps_ZnetLicences_View_ComponentInfo = mode => {
  if (!checkAppRole("Maps.ZnetLicences", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  /// Application
  return { title: "Maps/ZnetLicences/View", path: "/Maps/ZnetLicences/View" };
  /// Application --
};
/// Custom - Role - check permission --

/**
 *
 *
 * @param {*} cell
 * @param {*} onRendered
 * @param {*} success
 * @param {*} cancel
 * @param {*} editorParams
 * @returns
 */
// eslint-disable-next-line no-unused-vars
const dateEditor = function (cell, onRendered, success, cancel, editorParams) {
  //create and style editor
  var editor = document.createElement("input");

  editor.setAttribute("type", "date");

  //create and style input
  editor.style.padding = "3px";
  editor.style.width = "100%";
  editor.style.boxSizing = "border-box";

  //Set value of editor to the current value of the cell
  editor.value = moment(cell.getValue(), "DD/MM/YYYY").format("YYYY-MM-DD")

  //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
  onRendered(function () {
    editor.focus();
    editor.style.css = "100%";
  });

  //when the value has been set, trigger the cell to update
  function successFunc() {
    success(moment(editor.value, "YYYY-MM-DD").format("YYYY-MM-DD"));
  }

  editor.addEventListener("change", successFunc);
  editor.addEventListener("blur", successFunc);

  //return the editor element
  return editor;
};

/**
 *
 *
 * @param {*} cell
 * @param {*} formatterParams
 * @returns
 */
// eslint-disable-next-line no-unused-vars
const dateFormatter = function (cell, formatterParams) {
  var value = cell.getValue();

  if (value) {
    value = moment(value, "YYYY-MM-DD").format("YYYY-MM-DD");
  }

  return value;
}

/**
 *
 *
 * @class _Maps_ZnetLicences_View
 * @extends {View}
 */
class _Maps_ZnetLicences_View extends View {
  "use strict";

  /**
   *Creates an instance of _Maps_Consumers_View.
   * @param {*} props
   * @memberof _Maps_ZnetLicences_View
   */
  constructor(props) {
    super(props);
    console.log(new Date().getTime(), "_Maps_ZnetLicences_View constructor");

    /// Custom - Role - check permission
    this.ComponentInfo = Maps_ZnetLicences_View_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_ZnetLicences_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    this.state = {
      users: [],
      edit: false,
    }
    this.datas = [];

    this.updateCallback = this.updateCallback.bind(this);
    this.save = this.save.bind(this);
  }

  /**
   *
   *
   * @memberof _Maps_ZnetLicences_View
   */
  componentDidMount() {
    console.log(new Date().getTime(), "View componentDidMount");

    super.componentDidMount();

    const Users_Groups_id = Session.get("Users_Groups_id");
    Meteor.call("Users_Users.find", Users_Groups_id, (error, result) => {
      if (error) {
        console.log("Maps_ZnetLicences_View Meteor.call", error);
      }
      this.setState({ users: result });
    });
  }

  /**
   *
   *
   * @param {*} error
   * @memberof _Maps_ZnetLicences_View
   */
  updateCallback(error) {
    console.log(
      new Date().getTime(),
      "_Maps_ZnetLicences_View updateCallback"
    );
    /// Sys - AutoForm - update
    if (error) {
      Bert.alert({
        type: "danger",
        hideDelay: 10000,
        message: `Add failed: ${ error.message }`
      });
    } else {
      Bert.alert({
        type: "success",
        hideDelay: 10000,
        message: "情報を更新しました"
      });

      setTimeout(() => {
        console.log(
          new Date().getTime(),
          "_Maps_ZnetLicences_View updateCallback /Maps/ZnetLicences/View"
        );
        this.props.history.replace("/Maps/ZnetLicences/View");
      }, window.$GLOBAL$.transitionDuration);
    }
    /// Sys - AutoForm - update --
  }

  /**
   *
   *
   * @memberof _Maps_ZnetLicences_View
   */
  save() {
    console.log("save ===================", this.datas);
    for (let i in this.datas) {
      const data = this.datas[i];
      const doc = {
        _id: data._id,
        modifiedAt: data.modifiedAt,
        licenceKey: data.licenceKey,
        limitAt: data.limitAt,
      };

      const Users_Groups_id = Session.get("Users_Groups_id");
      const rec = Maps_ZnetLicences_Collection.findOne({ _id: data._id });
      if (rec) {
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
      } else {
        /// Sys - AutoForm - update
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
          this.updateCallback
        );
        /// Sys - AutoForm - update --
      }
    }

    this.setState({ edit: false });
  }

  /// Custom - View - layout
  /**
   *
   *
   * @returns
   * @memberof _Maps_ZnetLicences_View
   */
  render() {
    console.log(new Date().getTime(), "_Maps_ZnetLicences_View render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    const column = [
      { title: "氏名", field: "username" },
      { title: "", field: "_id", visible: false },
      { title: "", field: "modifiedAt", visible: false },
      { title: "ライセンスキー", field: "licenceKey" },
      { title: "ライセンス期限", field: "limitAt", formatter: dateFormatter },
    ];

    const columnEditable = [
      { title: "氏名", field: "username" },
      { title: "", field: "_id", visible: false },
      { title: "", field: "modifiedAt", visible: false },
      { title: "ライセンスキー", field: "licenceKey", editor: "input", },
      { title: "ライセンス期限", field: "limitAt", editor: dateEditor, },
    ];

    this.datas = [];
    for (let i in this.state.users) {
      const user = this.state.users[i];
      const licence = Maps_ZnetLicences_Collection.findOne({ _id: user._id });
      const data = {
        username: user.username,
        _id: user._id,
        modifiedAt: _.get(licence, "modifiedAt", null),
        licenceKey: _.get(licence, "licenceKey", ""),
        limitAt: _.get(licence, "limitAt", null),
      };
      this.datas.push(data);
    }

    return (
      <React.Fragment>
        {
          <If condition={!this.state.edit}>
            <ReactTabulator
              columns={column}
              data={this.datas}
              rowClick={this.rowClick}
              options={{}}
              data-custom-attr="test-custom-attribute"
              className="custom-css-class"
            />
          </If>
        }

        {
          <If condition={this.state.edit}>
            <ReactTabulator
              ref={ref => (this.ref = ref)}
              columns={columnEditable}
              data={this.datas}
              rowClick={this.rowClick}
              options={{}}
              data-custom-attr="test-custom-attribute"
              className="custom-css-class"
            />
          </If>
        }

        {
          <If condition={!this.state.edit}>
            <MDBBtn
              size="sm"
              floating
              color="info"
              onClick={() => { this.setState({ edit: true }) }}
            >修正</MDBBtn>
          </If>
        }

        {
          <If condition={this.state.edit}>
            <MDBBtn
              size="sm"
              floating
              color="danger"
              onClick={this.save}
            >確定</MDBBtn>
          </If>
        }
      </React.Fragment>
    );
  }
  /// Custom - View - layout --
}

/// Custom - View - tracker
export const Maps_ZnetLicences_View = withTracker(() => {
  console.log(new Date().getTime(), "Maps_ZnetLicences_View withTracker");

  /// Custom - Collection - subscribe
  const handles = [
    Meteor.subscribe(
      Maps_ZnetLicences_Collection._name,
      Session.get("Users_Groups_id")
    ),
  ];
  const loading = handles.some(handle => !handle.ready());
  console.log("Maps_ZnetLicences_View loading", loading);

  if (loading) {
    return {
      loading: loading,
      ComponentInfo: Maps_ZnetLicences_View_ComponentInfo
    };
  }
  /// Custom - Collection - subscribe --

  return {
    loading: loading,
    ComponentInfo: Maps_ZnetLicences_View_ComponentInfo
  };
})(_Maps_ZnetLicences_View);
/// Custom - View - tracker --
