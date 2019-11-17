/// Sys - View
import React from "react";
import { Random } from "meteor/random";
import { ViewLocalCollection } from "@imports/ui/crud/ViewLocalCollection";
/// Sys - View --

/// Sys - Network
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

/// Sys - Collection - insert
import { Session } from "meteor/session";
/// Sys - Collection - insert --

/// Sys - Excel
import { ExcelView } from "@imports/ui/utils/ExcelView";
const XLSX = require("xlsx");
import { Excels_Collection } from "@imports/api/lib/Excels_Collection";
/// Sys - Excel --

/// Application
import _ from "lodash";
/// Application --

/**
 *
 *
 * @class _Maps_Consumers_ExcelImportView
 * @extends {ViewLocalCollection}
 */
export class ExcelImportView extends ViewLocalCollection {
  /**
   *Creates an instance of _Maps_Consumers_ExcelImportView.
   * @param {*} props
   * @memberof _Maps_Consumers_ExcelImportView
   */
  constructor(props) {
    super(props);

    /// Custom - LocalStorage
    /** @type {any[]} */
    this.CollectionList = [];
    /// Custom - LocalStorage --

    this.loadData = this.loadData.bind(this);

    this.onChange = this.onChange.bind(this);
    this.updateCallback = this.updateCallback.bind(this);

    this.excelId = null;

    this.state = {
      messageStep1: "",
      messageStep2: "",
      messageStep3: "",
      messageStep4: "",
      messageStep5: "",
    };
  }

  /**
   *
   *
   * @memberof _Maps_Consumers_ExcelImportView
   */
  componentDidMount() {
    console.log(new Date().getTime(), "ExcelImportView componentDidMount");

    super.componentDidMount();

    /// Custom - LocalStorage - update
    this.localCollection_redrawProc = this.loadData;
    /// Custom - LocalStorage - update --
  }

  /// Sys - LocalStorage - update
  /**
   *
   *
   * @memberof _Maps_Consumers_ExcelImportView
   */
  loadData() {
    console.log(new Date().getTime(), "loadData", this.Collection._name);

    this.Collection.docs = window.$GLOBAL$.Collection[this.Collection._name];

    this.CollectionList = [];
    for (let key in this.Collection.docs) {
      this.CollectionList.push(this.Collection.docs[key]);
    }
  }
  /// Sys - LocalStorage - update --

  /**
   *
   *
   * @memberof _Maps_Consumers_View
   */
  onChange = _id => {

    this.setState({ messageStep1: "Excelアップロード受付" });

    Excels_Collection.readExcelFile({ _id: _id }, (err, excelData) => {
      if (err) {
        console.log("onChange", err);
        return;
      }

      const workbook = XLSX.read(excelData);

      workbook.SheetNames.forEach(function (sheetName) {
        console.log("sheetName", sheetName);
      });

      const sheetNames = workbook.SheetNames;
      const sheetName = sheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const range = worksheet["!ref"];
      const rangeVal = XLSX.utils.decode_range(range);

      const colList = [];
      const errorList = [];

      // Header validate
      for (let c = rangeVal.s.c; c <= rangeVal.e.c; c++) {
        const adr = XLSX.utils.encode_cell({ c: c, r: 0 });
        const cell = worksheet[adr];
        const field = this.fieldDefList.filter((f) => {
          return f.title === cell.w;
        })[0];

        if (field) {
          colList[c] = field;
        } else {
          errorList.push({
            lineNo: 0,
            column: cell.w,
            errorCode: 1001,
            errorStr: "項目名が不正 "
          });
        }
      }

      // Header validate
      for (let i in this.fieldDefList) {
        if (this.fieldDefList[i].required) {
          const tmp = colList.filter((c) => { return c.fieldName == this.fieldDefList[i].fieldName });
          if (tmp.length == 0) {
            errorList.push({
              lineNo: 0,
              column: "",
              errorCode: 1002,
              errorStr: "必須項目名: " + this.fieldDefList[i].title
            });
          }
        }
      }

      // Body validate
      this.validateBody(worksheet, rangeVal, colList, errorList);

      // error
      if (errorList.length > 0) {
        const c = rangeVal.e.c;
        for (let i in errorList) {
          const e = errorList[i];
          const adr1 = XLSX.utils.encode_cell({ c: c + 1, r: e.lineNo });
          const adr2 = XLSX.utils.encode_cell({ c: c + 2, r: e.lineNo });
          const adr3 = XLSX.utils.encode_cell({ c: c + 3, r: e.lineNo });
          worksheet[adr1] = { t: "s", v: e.column, w: e.column };
          worksheet[adr2] = { t: "s", v: e.errorCode, w: e.errorCode };
          worksheet[adr3] = { t: "s", v: e.errorStr, w: e.errorStr };
        }

        const adr = XLSX.utils.encode_cell({ c: rangeVal.e.c + 3, r: rangeVal.e.r });
        worksheet["!ref"] = "A1" + ":" + adr;
        workbook.Sheets[sheetName] = worksheet;
        XLSX.writeFile(workbook, "aaa.xlsx");

        this.setState({ messageStep3: "エラーが " + errorList.length + "件あったため処理を中断します" });

        return;
      }

      // update
      const Users_Groups_id = Session.get("Users_Groups_id");

      for (let r = rangeVal.s.r + 1; r <= rangeVal.e.r; r++) {

        this.setState({ messageStep4: "DB更新中: " + r + "/" + rangeVal.e.r });

        const doc = {};
        for (let c = rangeVal.s.c; c <= rangeVal.e.c; c++) {
          if (colList[c].fieldName == "d") {
            continue;
          }
          if (colList[c].fieldName == "u") {
            continue;
          }

          const adr = XLSX.utils.encode_cell({ c: c, r: r });
          let cell = worksheet[adr];
          if (!cell) {
            cell = { w: "", t: "", v: "" };
          }
          _.set(doc, colList[c].fieldName, cell.w);
        }

        /// Custom - localCollection - insert
        doc._id = Random.id(15);
        /// Custom - localCollection - insert --

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

        /// Custom - localCollection - insert
        this.Collection.docs[doc._id] = doc;
        /// Custom - localCollection - insert --
      }
      this.setState({ messageStep4: "DB更新完了: " + rangeVal.e.r + "/" + rangeVal.e.r });

    });
  };

  /**
   *
   *
   * @param {*} error
   * @memberof _Maps_Consumers_ExcelImportView
   */
  updateCallback(error) {
    /// Sys - AutoForm - update
    if (error) {
      Bert.alert({
        type: "danger",
        hideDelay: 10000,
        message: `Add failed: ${ error.message }`
      });
    }
    /// Sys - AutoForm - update --
  }

  /**
   *
   *
   * @memberof _Maps_Consumers_ExcelImportView
   */
  closeUserModal() {
    this.setState({
      showUserListModal: false
    });
  }

  /// Custom - ExcelImportView - layout
  /**
   *
   *
   * @returns
   * @memberof _Maps_Consumers_ExcelImportView
   */
  render() {
    console.log(new Date().getTime(), "ExcelImportView render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    return (
      <React.Fragment>
        <ExcelView
          value={this.excelId}
          disabled={false}
          style={{}}
          onChange={this.onChange}
        />
        <p>{this.state.messageStep1}</p>
        <p>{this.state.messageStep2}</p>
        <p>{this.state.messageStep3}</p>
        <p>{this.state.messageStep4}</p>
        <p>{this.state.messageStep5}</p>

      </React.Fragment>
    );
  }
  /// Custom - ExcelImportView - layout --
}
