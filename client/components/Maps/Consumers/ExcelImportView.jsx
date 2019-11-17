/// Sys - View
import { withTracker } from "meteor/react-meteor-data";
/// Sys - View --

import { ExcelImportView } from "../lib/ExcelImportView";

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

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Sys - Collection - insert
import { Session } from "meteor/session";
/// Sys - Collection - insert --

/// Sys - Excel
const XLSX = require("xlsx");
/// Sys - Excel --

/// Application
import { fieldDefList, excelTitleList } from "./Excel_defines";
import _ from "lodash";
/// Application --

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const Maps_Consumers_ExcelImportView_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Consumers", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  /// Application
  return {
    title: "Maps/Consumers/ExcelImportView",
    path: "/Maps/Consumers/ExcelImportView"
  };
  /// Application --
};
/// Custom - Role - check permission --

/**
 *
 *
 * @class _Maps_Consumers_ExcelImportView
 * @extends {ViewLocalCollection}
 */
class _Maps_Consumers_ExcelImportView extends ExcelImportView {
  /**
   *Creates an instance of _Maps_Consumers_ExcelImportView.
   * @param {*} props
   * @memberof _Maps_Consumers_ExcelImportView
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Consumers_ExcelImportView_ComponentInfo;
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

    /// Sys - Excel
    this.fieldDefList = fieldDefList;
    this.excelTitleList = excelTitleList;
    /// Sys - Excel --

    this.postConstructor();
  }

  /**
   *
   *
   * @memberof _Maps_Consumers_View
   */
  validateBody = (worksheet, rangeVal, colList, errorList) => {
    // Body validate
    for (let r = rangeVal.s.r + 1; r <= rangeVal.e.r; r++) {

      this.setState({ messageStep2: "チェック中: " + r + "/" + rangeVal.e.r });

      for (let c = rangeVal.s.c; c <= rangeVal.e.c; c++) {
        const adr = XLSX.utils.encode_cell({ c: c, r: r });
        let cell = worksheet[adr];
        if (!cell) {
          cell = { w: "", t: "", v: "" };
        }
        colList[c].validator(colList[c], r, cell.w, errorList);
      }
    }
    this.setState({ messageStep2: "チェック完了: " + rangeVal.e.r + "/" + rangeVal.e.r });

    let colName;
    let colPostalCode;
    let colAddress;
    for (let c = rangeVal.s.c; c <= rangeVal.e.c; c++) {
      if (colList[c].fieldName == "identity.name") {
        colName = c;
      }
      if (
        colList[c].fieldName == "residenceAddress.addressUnrefined.postalCode"
      ) {
        colPostalCode = c;
      }
      if (
        colList[c].fieldName == "residenceAddress.addressUnrefined.address1"
      ) {
        colAddress = c;
      }
    }
    const existingData = [];
    for (let i in this.CollectionList) {
      const doc = this.CollectionList[i];
      existingData.push({
        name: _.get(doc, colList[colName].fieldName, ""),
        postalCode: _.get(doc, colList[colPostalCode].fieldName, ""),
        address: _.get(doc, colList[colAddress].fieldName, "")
      });
    }

    /** @type {{ lineNo: any; name: any; postalCode: any; address: any; }[]} */
    const importValidationData = [];
    for (let r = rangeVal.s.r + 1; r <= rangeVal.e.r; r++) {
      const adrName = XLSX.utils.encode_cell({ c: colName, r: r });
      const adrPostalCode = XLSX.utils.encode_cell({
        c: colPostalCode,
        r: r
      });
      const adrAddress = XLSX.utils.encode_cell({ c: colAddress, r: r });
      importValidationData.push({
        lineNo: r,
        name: worksheet[adrName].w,
        postalCode: worksheet[adrPostalCode].w,
        address: worksheet[adrAddress].w
      });
    }

    // Body validate duplicate
    for (let r in importValidationData) {
      const tlist = existingData.filter(db => {
        return importValidationData[r].name == db.name;
      });
      for (let j in tlist) {
        if (tlist[j].postalCode == importValidationData[r].postalCode) {
          errorList.push({
            lineNo: r,
            column: "氏名/郵便番号",
            errorCode: 3001,
            errorStr: "重複の可能性"
          });
        }
        if (
          tlist[j].address.indexOf(importValidationData[r].address) >= 0 ||
          importValidationData[r].address.indexOf(tlist[j].address) >= 0
        ) {
          errorList.push({
            lineNo: r,
            column: "氏名/住所",
            errorCode: 3001,
            errorStr: "重複の可能性"
          });
        }
      }

      const ilist = importValidationData.filter(db => {
        return importValidationData[r].name == db.name;
      });
      for (let j in ilist) {
        if (r == j) {
          continue;
        }
        if (ilist[j].postalCode == importValidationData[r].postalCode) {
          errorList.push({
            lineNo: r,
            column: "氏名/郵便番号",
            errorCode: 3001,
            errorStr: "重複の可能性"
          });
        }
        if (
          ilist[j].address.indexOf(importValidationData[r].address) >= 0 ||
          importValidationData[r].address.indexOf(ilist[j].address) >= 0
        ) {
          errorList.push({
            lineNo: r,
            column: "氏名/住所",
            errorCode: 3001,
            errorStr: "重複の可能性"
          });
        }
      }
    }
  }

}

/// Custom - ExcelImportView - tracker
export const Maps_Consumers_ExcelImportView = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    Meteor.subscribe(Maps_ConsumersSum_Collection._name, Session.get('Users_Groups_id')),
  ];
  const loading = handles.some(handle => !handle.ready());
  console.log(
    new Date().getTime(),
    "Maps_Consumers_ExcelImportView loading",
    loading
  );

  return {
    ComponentInfo: Maps_Consumers_ExcelImportView_ComponentInfo,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_Maps_Consumers_ExcelImportView);
/// Custom - ExcelImportView - tracker --
