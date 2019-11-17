/// Sys - Tabular
import React from "react";
import { Session } from "meteor/session";
import List from "@imports/ui/crud/List";
import _ from "lodash";
/// Sys - Tabular --

/// Custom - Layout
import { MDBBtn } from "mdbreact";
/// Custom - Layout --

/**
 *
 *
 * @export
 * @class ListPersistedScroll
 * @extends {List}
 */
export class ListPersistedScroll extends List {
  "use strict";

  /**
   *Creates an instance of ListPersistedScroll.
   * @param {*} props
   * @memberof ListPersistedScroll
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
    this.UpdateButton = this.UpdateButton.bind(this);

    this.myRef = React.createRef();
  }

  /**
   *
   *
   * @memberof ListPersistedScroll
   */
  postConstructor() {
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
   * @memberof ListPersistedScroll
   */
  componentDidMount() {
    console.log(
      new Date().getTime(),
      "ListPersistedScroll componentDidMount",
      this.Collection._name
    );

    /// Custom - Role - check permission
    this.securityCheck(this);
    /// Custom - Role - check permission --
  }

  /**
   *
   *
   * @memberof ListPersistedScroll
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
   * @memberof ListPersistedScroll
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
   * @memberof ListPersistedScroll
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
   * @memberof ListPersistedScroll
   */
  updateSelector = (key, value) => {
    console.log(new Date().getTime(), "List updateSelector", key, value);
    this.state.selector[key] = value; // eslint-disable-line react/no-direct-mutation-state
    this.setState({
      selector: this.state.selector,
      componentUpdater: this.state.componentUpdater + 1
    });

    Session.setPersistent(
      this.Collection._name + "_scrollListSelector",
      this.state.selector
    );

    this.queryDocs();
  };

  /**
   *
   *
   * @memberof ListPersistedScroll
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

    Session.setPersistent(
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
  componentDidMount() {}

  /**
   *
   *
   * @memberof UnsavedIndicator
   */
  componentWillUnmount() {}

  /**
   *
   *
   * @returns
   * @memberof UnsavedIndicator
   */
  render() {
    return (
      <React.Fragment>
        <div></div>
      </React.Fragment>
    );
    /// Custom - Tabular - layout --
  }
}
