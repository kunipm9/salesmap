/// Sys - Tabular
import React from "react";
import { TabularWrapper } from "@imports/ui/tabular/wrapper";
import { $ } from "meteor/jquery";
import dataTablesBootstrap from "datatables.net-bs4";
dataTablesBootstrap(window, $);
import "datatables.net-bs4/css/dataTables.bootstrap4-ext.css";
import List from "@imports/ui/crud/List";
import { Session } from "meteor/session";
/// Sys - Tabular --

/// Sys - Network
import { checkNetwork } from "@imports/ui/crud/checkNetwork";
/// Sys - Network --

/**
 *
 *
 * @export
 * @class ListTabular
 * @extends {List}
 */
export class ListTabular extends List {
  "use strict";

  /**
   *Creates an instance of ListTabular.
   * @param {*} props
   * @memberof ListTabular
   */
  constructor(props) {
    super(props);

    /// Sys - Tabular - filter, soft delete
    if (Session.get("Users_Groups_id") == Roles.GLOBAL_GROUP) {
      this.selector_org = { _deleted: null };
    } else {
      this.selector_org = {
        Users_Groups_id: Session.get("Users_Groups_id"),
        _deleted: null
      };
    }
    this.selector = this.selector_org;
    this.state = {
      showNormal: true
    };
    /// Sys - Tabular - filter, soft delete --

    this.securityCheck = this.securityCheck.bind(this);
    this.setSelector = this.setSelector.bind(this);
  }

  /**
   *
   *
   * @memberof ListTabular
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

  /// Sys - Tabular - filter, soft delete
  /**
   *
   *
   * @memberof ListTabular
   */
  setSelector() {
    if (this.refs && this.refs[this.tabular]) {
      this.selector = this.selector_org;
      if (!this.state.showNormal) {
        if (Session.get("Users_Groups_id") == Roles.GLOBAL_GROUP) {
          this.selector = {};
        } else {
          this.selector = { Users_Groups_id: Session.get("Users_Groups_id") };
        }
      }

      setTimeout(() => {
        this.refs[this.tabular].changeSelector(this.selector); // eslint-disable-line react/no-string-refs
      });
    }
  }
  /// Sys - Tabular - filter, soft delete --

  /**
   *
   *
   * @returns
   * @memberof ListTabular
   */
  render() {
    /// Sys - Tabular - filter, soft delete
    this.setSelector();
    /// Sys - Tabular - filter, soft delete --

    /// Custom - Tabular - layout
    return (
      <React.Fragment>
        {this.Insert_ComponentInfo &&
          this.InsertButtons(this.Insert_ComponentInfo("create"))}

        <TabularWrapper
          table={this.tabular}
          id={this.tabular}
          ref={this.tabular}
          selector={this.selector}
          class="table table-striped table-condensed"
        />

        {this.ShowNormalSwitch()}
      </React.Fragment>
    );
    /// Custom - Tabular - layout --
  }
}
