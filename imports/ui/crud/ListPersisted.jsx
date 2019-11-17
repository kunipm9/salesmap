/// Sys - Tabular
import React from "react";
import { ReactTabulator } from "react-tabulator";
import List from "@imports/ui/crud/List";
const react_dom_1 = require("react-dom");
/// Sys - Tabular --

/// Custom - Layout
import { MDBBtn } from "mdbreact";
/// Custom - Layout --

/**
 *
 *
 * @export
 * @class ListPersisted
 * @extends {List}
 */
export class ListPersisted extends List {
  "use strict";

  /**
   *Creates an instance of ListPersisted.
   * @param {*} props
   * @memberof ListPersisted
   */
  constructor(props) {
    super(props);

    this.state = {
      showNormal: true, // Sys - Tabular - filter, soft delete
      loading: true // Sys - Collection - subscribe
    };

    /// Sys - ReactTabulator
    this.options = {
      pagination: "local",
      paginationSize: 10,
      virtualDom: false,
      responsiveLayout: true,
      movableColumns: true
    };
    /// Sys - ReactTabulator --

    this.securityCheck = this.securityCheck.bind(this);
    this.ShowNormalSwitch = this.ShowNormalSwitch.bind(this);
  }

  /**
   *
   *
   * @memberof ListPersisted
   */
  componentDidMount() {
    /// Custom - Role - check permission
    this.securityCheck(this);
    /// Custom - Role - check permission --
  }

  /// Sys - ReactTabulator
  /**
   *
   *
   * @memberof ListPersisted
   */
  reactFormatter = JSX => {
    return function customFormatter(cell, formatterParams, onRendered) {
      onRendered(function() {
        const cellEl = cell.getElement();
        const CompWithMoreProps = React.cloneElement(JSX, { cell: cell });
        react_dom_1.render(
          CompWithMoreProps,
          cellEl.querySelector(".formatterCell")
        );
      });
      return '<div class="formatterCell"></div>';
    };
  };
  /// Sys - ReactTabulator --

  /// Sys - Tabular - link button
  /**
   *
   *
   * @memberof ListPersisted
   */
  UpdateButton = props => {
    const cellData = props.cell._cell.row.data;

    if (cellData._deleted) {
      return (
        <MDBBtn
          color="blue"
          className="btnfont-tabular btn-sm edit"
          onClick={() => {
            this.props.history.push(this.updatePath + cellData._id);
          }}
        >
          復旧
        </MDBBtn>
      );
    } else {
      return (
        <MDBBtn
          color="purple"
          className="btnfont-tabular btn-sm edit"
          onClick={() => {
            this.props.history.push(this.updatePath + cellData._id);
          }}
        >
          詳細
        </MDBBtn>
      );
    }
  };
  /// Sys - Tabular - link button --

  /**
   *
   *
   * @returns
   * @memberof ListPersisted
   */
  render() {
    let data = [];
    if (this.state.showNormal) {
      data = this.Collection.find({ _deleted: null }).map(b => {
        return b;
      });
    } else {
      data = this.Collection.find().map(b => {
        return b;
      });
    }
    /// Custom - Tabular - layout
    return (
      <React.Fragment>
        {this.Insert_ComponentInfo &&
          this.InsertButtons(this.Insert_ComponentInfo("create"))}

        <ReactTabulator
          data={data}
          columns={this.columns}
          options={this.options}
        />

        {this.ShowNormalSwitch()}
      </React.Fragment>
    );
    /// Custom - Tabular - layout --
  }
}
