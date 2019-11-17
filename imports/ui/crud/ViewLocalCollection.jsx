/// Sys - Layout
import { Session } from "meteor/session";
import View from "@imports/ui/crud/View";
/// Sys - Layout --

/// Sys - LocalStorage
import { localCollection_ComponentDidMount } from "@imports/api/lib/localCollection";
import { localCollection_ComponentWillUnmount } from "@imports/api/lib/localCollection";
/// Sys - LocalStorage --

/**
 *
 *
 * @export
 * @class ViewLocalCollection
 * @extends {View}
 */
export class ViewLocalCollection extends View {
  /**
   *Creates an instance of ViewLocalCollection.
   * @param {*} props
   * @memberof ViewLocalCollection
   */
  constructor(props) {
    super(props);

    /// Sys - Collection
    this.CollectionList = [];
    /// Sys - Collection --
  }

  /**
   *
   *
   * @memberof ViewLocalCollection
   */
  postConstructor() {
    /// Sys - LocalStorage
    this.Collection.docs = window.$GLOBAL$.Collection[this.Collection._name];
    /// Sys - LocalStorage --

    /// Sys - Collection - selector
    const tmpSelector =
      Session.get(this.Collection._name + ".List.selector") || null;
    if (tmpSelector) {
      this.state.selector = tmpSelector;
    }
    /// Sys - Collection - selector --
  }

  /**
   *
   *
   * @param {*} self
   * @memberof ViewLocalCollection
   */
  securityCheck(self) {
    if (self.ComponentInfo) {
      if (!self.ComponentInfo("read")) {
        console.error(`Security check.`);
        if (this.props.history) {
          this.props.history.replace("/");
        } else {
          window.location.href = "/";
        }
      }
    }
  }

  /**
   *
   *
   * @memberof ViewLocalCollection
   */
  componentDidMount() {
    this.securityCheck(this);

    /// Sys - LocalStorage
    localCollection_ComponentDidMount(this);
    /// Sys - LocalStorage --
  }

  /**
   *
   *
   * @memberof ViewLocalCollection
   */
  componentWillUnmount() {
    /// Sys - LocalStorage
    localCollection_ComponentWillUnmount(this);
    /// Sys - LocalStorage --
  }

  /// Sys - Collection - selector
  /**
   *
   *
   * @memberof ViewLocalCollection
   */
  updateSelector = (key, value) => {
    console.log(new Date().getTime(), "List updateSelector", key, value);
    this.state.selector[key] = value; // eslint-disable-line react/no-direct-mutation-state
    this.setState({ selector: this.state.selector });

    Session.setPersistent(
      this.Collection._name + ".List.selector",
      this.state.selector
    );
  };
  /// Sys - Collection - selector --
}
