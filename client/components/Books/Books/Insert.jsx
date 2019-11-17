/// Sys - AutoForm
import React from "react";
import AutoForm from "uniforms-bootstrap4/AutoForm";
import AutoFields from "@imports/ui/uniforms/AutoFields";
import ErrorsField from "uniforms-bootstrap4/ErrorsField";
import Insert from "@imports/ui/crud/Insert";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Books_Books_Collection } from "@imports/api/Books/Books_Collection";
console.assert(Books_Books_Collection, "Books_Books_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Sys - Excel
const XLSX = require("xlsx");
import { Excels_Collection } from "@imports/api/lib/Excels_Collection";
console.assert(Excels_Collection, "Excels_Collection is undefined.");
import _ from "lodash";
/// Sys - Excel --

/// Custom - AutoForm - layout
import { MDBBtn } from "mdbreact";
/// Custom - AutoForm - layout --

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const Books_Books_Insert_ComponentInfo = mode => {
  if (!checkAppRole("Books.Books", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Books/Books/Insert", path: "/Books/Books/Insert" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Books_Books_Insert
 * @extends {Insert}
 */
export class Books_Books_Insert extends Insert {
  "use strict";

  /**
   *Creates an instance of Books_Books_Insert.
   * @param {*} props
   * @memberof Books_Books_Insert
   */
  constructor(props) {
    super(props);
    /// Custom - Role - check permission
    this.ComponentInfo = Books_Books_Insert_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Books_Books_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    /// Application
    this.readExcel = this.readExcel.bind(this);
    /// Application --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }

  /// Application - Excel
  /**
   *
   *
   * @memberof Books_Books_Insert
   */
  readExcel() {
    const model = this.formRef.getModel();
    const Excels_id = _.get(model, "Excels_id");
    Excels_Collection.readExcelFile({ _id: Excels_id }, (err, excelData) => {
      if (!err) {
        const workbook = XLSX.read(excelData);
        workbook.SheetNames.forEach(function(sheetName) {
          console.log("sheetName", sheetName);
        });
      }
    });
  }
  /// Application - Excel --

  /**
   *
   *
   * @returns
   * @memberof Books_Books_Insert
   */
  render() {
    /// Custom - AutoForm - layout
    return (
      <React.Fragment>
        <AutoForm
          schema={this.Collection.simpleSchema()}
          ref={ref => this.ready(ref)}
          onChange={this.change}
          onSubmit={this.submit}
          model={this.state.doc}
          placeholder={true}
          showInlineError={true}
        >
          <AutoFields className="no-gutters row" />
          <MDBBtn color="info" onClick={this.readExcel} className="btnfont">
            Read Excel
          </MDBBtn>
          <ErrorsField />
          {this.InsertFormButtons()}
        </AutoForm>
      </React.Fragment>
    );
    /// Custom - AutoForm - layout --
  }
}
