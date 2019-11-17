/// Sys - Tabular
import { withTracker } from "meteor/react-meteor-data";
import mingo from "mingo";
require("jquery.nicescroll");
/// Sys - Tabular --

import { Maps_List } from "../lib/List";

/// Custom - Collection - selector
import { List_Selector } from "./List_Selector";
/// Custom - Collection - selector --

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";
console.assert(Maps_Tags_Collection, "Maps_Tags_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Custom - LocalStorage
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";
/// Custom - LocalStorage --

/// Custom - Tabular - insert button
import { Session } from "meteor/session";
import { Maps_Consumers_Insert_ComponentInfo } from "./Insert";
console.assert(
  Maps_Consumers_Insert_ComponentInfo,
  "Maps_Consumers_Insert_ComponentInfo is undefined."
);
/// Custom - Tabular - insert button --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const Maps_Consumers_List_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Consumers", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Maps/Consumers/List", path: "/Maps/Consumers/List" };
};
/// Custom - Role - check permission --

export class _Maps_Consumers_List extends Maps_List {
  "use strict";

  /**
   *Creates an instance of _Maps_Consumers_List.
   * @param {*} props
   * @memberof _Maps_Consumers_List
   */
  constructor(props) {
    super(props);

    /// Custom - Tabular - link button
    this.updatePath = "/Maps/Consumers/Update/";
    /// Custom - Tabular - link button --

    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Consumers_List_ComponentInfo;
    this.Insert_ComponentInfo = Maps_Consumers_Insert_ComponentInfo;
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

    /// Custom - Collection - selector
    this.state.selector = {
      name: "",
      address: "",
      tags: {
        or: [],
        not: [],
        and: []
      }
    };
    this.listCursor = null;
    /// Custom - Collection - selector --

    /// Sys - List
    this.List_Selector = List_Selector;
    /// Sys - List --

    this.postConstructor();
  }

  /**
   *
   *
   * @memberof _Maps_Consumers_List
   */
  queryDocs() {
    /// Custom - Collection - selector
    const query = {};

    if (this.state.showNormal) {
      query["_deleted"] = null;
    }

    if (this.state.selector.address) {
      const selectorAddress = new RegExp(
        ".*" + this.state.selector.address + ".*",
        "i"
      );
      query["idenceAddress.addresssUnrefined.address1"] = selectorAddress;
    }

    if (this.state.selector.name) {
      const selectorName = new RegExp(
        ".*" + this.state.selector.name + ".*",
        "i"
      );
      query["identity.name"] = selectorName;
    }

    const tags = [];
    if (
      this.state.selector.tags &&
      this.state.selector.tags.or &&
      this.state.selector.tags.or.length > 0
    ) {
      tags.push({ tags: { $in: this.state.selector.tags.or } });
    }
    if (
      this.state.selector.tags &&
      this.state.selector.tags.not &&
      this.state.selector.tags.not.length > 0
    ) {
      tags.push({ tags: { $not: { $in: this.state.selector.tags.not } } });
    }
    if (
      this.state.selector.tags &&
      this.state.selector.tags.and &&
      this.state.selector.tags.and.length > 0
    ) {
      tags.push({ tags: { $all: this.state.selector.tags.and } });
    }
    if (tags.length > 0) {
      query["$and"] = tags;
    }
    console.log("List render query", query);
    /// Custom - Collection - selector --

    /// Custom - Collection - sort
    this.CollectionList.sort((a, b) => {
      if (!a.identity || !b.identity) return 1;
      return a.identity.name < b.identity.name ? 1 : -1;
    });
    /// Custom - Collection - sort --

    /// Custom - Collection - query
    this.listCursor = mingo.find(this.CollectionList, query);
    this.state.listItems = [];
    this.state.hasMore = true;
    this.state.dataLength = 0;
    this.fetchMoreData();
    /// Custom - Collection - query --
  }
}

/// Custom - List - tracker
export const Maps_Consumers_List = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    // eslint-disable-line no-unused-vars
    Meteor.subscribe(Maps_Tags_Collection._name, Session.get("Users_Groups_id"))
  ];
  const loading = handles.some(handle => !handle.ready());

  if (!loading) {
    Maps_Tags_Collection.find().fetch();
  }

  return {
    ComponentInfo: Maps_Consumers_List_ComponentInfo,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_Maps_Consumers_List);
/// Custom - List - tracker --
