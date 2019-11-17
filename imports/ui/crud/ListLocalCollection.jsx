/// Sys - Tabular
import React from "react";
import { Session } from "meteor/session";
import List from "@imports/ui/crud/List";
import { Tracker } from "meteor/tracker";
import _ from "lodash";
/// Sys - Tabular --

/// Sys - LocalStorage
import { localCollection_ComponentDidMount } from "@imports/api/lib/localCollection";
import { localCollection_ComponentWillUnmount } from "@imports/api/lib/localCollection";
/// Sys - LocalStorage --

/// Custom - Layout
import { MDBBtn } from "mdbreact";
/// Custom - Layout --

/**
 *
 *
 * @export
 * @class ListLocalCollection
 * @extends {List}
 */
export class ListLocalCollection extends List {
  "use strict";

  /**
   *Creates an instance of ListLocalCollection.
   * @param {*} props
   * @memberof ListLocalCollection
   */
  constructor(props) {
    super(props);

    /// Sys - Collection
    this.CollectionList = [];
    /// Sys - Collection --

    /// Sys - InfiniteScroll
    this.state = {
      showNormal: true, // Sys - Tabular - filter, soft delete
      loading: true, // Sys - Collection - subscribe

      hasMore: true, // Sys - InfiniteScroll
      componentUpdater: 0, // Sys - InfiniteScroll
      listItems: [], // Sys - InfiniteScroll
      dataLength: 0
    };
    this.listLastPage = 100;
    /// Sys - InfiniteScroll --

    this.securityCheck = this.securityCheck.bind(this);
    this.postConstructor = this.postConstructor.bind(this);
    this.securityCheck = this.securityCheck.bind(this);
    this.loadData = this.loadData.bind(this);
    this.UpdateButton = this.UpdateButton.bind(this);

    this.myRef = React.createRef();
  }

  /**
   *
   *
   * @memberof ListLocalCollection
   */
  postConstructor() {
    /// Sys - LocalStorage
    this.Collection.docs = window.$GLOBAL$.Collection[this.Collection._name];
    /// Sys - LocalStorage --

    /// Sys - Collection - selector
    const tmpSelector =
      Session.get(this.Collection._name + "_scrollListSelector") || null;
    if (tmpSelector) {
      this.state.selector = tmpSelector;
    }
    /// Sys - Collection - selector --
  }

  /**
   *
   *
   * @memberof ListLocalCollection
   */
  componentDidMount() {
    console.log(
      new Date().getTime(),
      "ListLocalCollection componentDidMount",
      this.Collection._name
    );

    /// Custom - Role - check permission
    this.securityCheck(this);
    /// Custom - Role - check permission --

    /// Sys - LocalStorage
    this.localCollection_redrawProc = this.loadData;
    localCollection_ComponentDidMount(this);
    /// Sys - LocalStorage --

    /// Sys - LocalStorage - update
    this.loadData();
    /// Sys - LocalStorage - update --
  }

  /**
   *
   *
   * @memberof ListLocalCollection
   */
  componentWillUnmount() {
    /// Sys - InfiniteScroll
    if (_.get(this, "myRef.current.el.scrollTop")) {
      const scrollTop = this.myRef.current.el.scrollTop;
      Session.setPersistent(this.Collection._name + "_scrollTop", scrollTop);
      Session.setPersistent(
        this.Collection._name + "_scrollLastPage",
        this.state.listItems.length
      );
    }
    /// Sys - InfiniteScroll --

    /// Sys - LocalStorage
    localCollection_ComponentWillUnmount(this);
    /// Sys - LocalStorage --
  }

  /**
   *
   *
   * @memberof ListLocalCollection
   */
  saveScrollPos = () => {
    /// Sys - InfiniteScroll
    let scrollTop = 0;
    if (_.get(this, "myRef.current.el.scrollTop")) {
      scrollTop = this.myRef.current.el.scrollTop;
    }

    Session.set(this.Collection._name + "_scrollTop", scrollTop);
    Session.set(
      this.Collection._name + "_scrollLastPage",
      this.state.listItems.length
    );
    /// Sys - InfiniteScroll --
  };

  /// Sys - LocalStorage - update
  /**
   *
   *
   * @memberof ListLocalCollection
   */
  loadData = () => {
    console.log(new Date().getTime(), "loadData", this.Collection._name);

    this.Collection.docs = window.$GLOBAL$.Collection[this.Collection._name];

    this.CollectionList = [];
    for (let key in this.Collection.docs) {
      this.CollectionList.push(this.Collection.docs[key]);
    }

    this.Collection.len = Object.keys(this.Collection.docs).length;

    /// Sys - InfiniteScroll
    this.listLastPage =
      Session.get(this.Collection._name + "_scrollLastPage") || 100;
    if (this.listLastPage < 100) {
      this.listLastPage = 100;
    }

    /// Sys - Collection - query
    this.queryDocs();
    /// Sys - Collection - query --

    const scrollTop = Session.get(this.Collection._name + "_scrollTop") || 0;
    setTimeout(() => {
      if (this.state.listItems.length >= this.listLastPage && scrollTop > 0) {
        if (this.myRef.current && this.myRef.current.el) {
          this.myRef.current.el.scrollTo(0, scrollTop);
        }
      }
    }, 200);
    /// Sys - InfiniteScroll
  };
  /// Sys - LocalStorage - update --

  /// Sys - Tabular - link button
  /**
   *
   *
   * @memberof ListLocalCollection
   */
  UpdateButton = doc => {
    if (doc._deleted) {
      return (
        <MDBBtn
          color="blue"
          className="btnfont-tabular btn-sm edit"
          onClick={() => {
            this.props.history.push(this.updatePath + doc._id);
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
            this.props.history.push(this.updatePath + doc._id);
          }}
        >
          詳細
        </MDBBtn>
      );
    }
  };
  /// Sys - Tabular - link button --

  /// Sys - Collection - selector
  /**
   *
   *
   * @memberof ListLocalCollection
   */
  updateSelector = (key, value) => {
    console.log(new Date().getTime(), "List updateSelector", key, value);
    this.state.selector[key] = value; // eslint-disable-line react/no-direct-mutation-state
    this.setState({
      selector: this.state.selector,
      componentUpdater: this.state.componentUpdater + 1
    });

    Session.set(
      this.Collection._name + "_scrollListSelector",
      this.state.selector
    );

    this.queryDocs();
  };

  /**
   *
   *
   * @memberof ListLocalCollection
   */
  updateSelectors = arr => {
    console.log(new Date().getTime(), "List updateSelectors", arr);
    for (let key in arr) {
      const value = arr[key];
      this.state.selector[key] = value; // eslint-disable-line react/no-direct-mutation-state
    }
    this.setState({
      selector: this.state.selector,
      componentUpdater: this.state.componentUpdater + 1
    });

    Session.set(
      this.Collection._name + "_scrollListSelector",
      this.state.selector
    );

    this.queryDocs();
  };
  /// Sys - Collection - selector --
}

/**
 *
 *
 * @export
 * @class UnsavedIndicator
 * @extends {React.Component}
 */
export class UnsavedIndicator extends React.PureComponent {
  "use strict";

  /**
   *Creates an instance of UnsavedIndicator.
   * @param {*} props
   * @memberof UnsavedIndicator
   */
  constructor(props) {
    super(props);

    this.state = {
      unsavedCount: 0,
      totalCount: 0,
      percent: 0
    };
  }

  /**
   *
   *
   * @memberof UnsavedIndicator
   */
  componentDidMount() {
    setTimeout(() => {
      this.localCollection_tracker = Tracker.autorun(() => {
        const unsavedCount = Session.get(
          this.props.collectionName + "_Collection__unsavedCount"
        );
        const totalCount = Session.get(
          this.props.collectionName + "_Collection__totalCount"
        );
        const percent = Math.floor((unsavedCount / totalCount) * 100);
        this.setState({
          unsavedCount: unsavedCount,
          totalCount: totalCount,
          percent: percent
        });
      });
    }, 0);
  }

  /**
   *
   *
   * @memberof UnsavedIndicator
   */
  componentWillUnmount() {
    if (this.localCollection_tracker) {
      this.localCollection_tracker.stop();
    }
  }

  /**
   *
   *
   * @returns
   * @memberof UnsavedIndicator
   */
  render() {
    return (
      <React.Fragment>
        <div>
          未Save: {this.state.unsavedCount} / {this.state.totalCount} (
          {this.state.percent}%)
        </div>
      </React.Fragment>
    );
    /// Custom - Tabular - layout --
  }
}
