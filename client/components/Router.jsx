/// Sys - Router
import { Meteor } from "meteor/meteor";
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { BrowserRouter } from "react-router-dom";
import { NavBarWrapper } from "./NavBar";
/// Sys - Router --

/// Sys - Router
/**
 *
 *
 * @class Router
 * @extends {React.Component}
 */
class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.errorInfo) {
      // eslint-disable-next-line no-undef
      if (process.env.NODE_ENV !== "development") {
        console.log(this.state.error, this.state.errorInfo);
        window.location.pathname = "/MapsSP/List/List";
        return <React.Fragment />;
      }
    }

    return (
      <BrowserRouter>
        <NavBarWrapper />
      </BrowserRouter>
    );
  }
}
/// Sys - Router --

// withTrackerによって作成されたコンテナコンポーネントは、提供された関数の内部からアクセスされる無効なデータソースの変更に応じて、ラップされたコンポーネントを反応的に再描画します。
// 使い方としては、withTrackerの引数にオブジェクトを与えると、それがAppのpropsとして参照できるようになります。
export default withTracker(() => {
  return {
    user: Meteor.user()
  };
})(Router);
