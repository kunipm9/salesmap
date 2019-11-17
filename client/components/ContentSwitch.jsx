/// Sys - Router
import { Meteor } from "meteor/meteor";
import React from "react";
import { Route, Switch } from "react-router-dom";
import _ from "lodash";
/// Sys - Router --

/// Sys - ApplicationError
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";
import moment from "moment";
moment.locale("ja");
import { MDBModal, MDBModalHeader, MDBModalBody, MDBBtn } from "mdbreact";
/// Sys - ApplicationError --

/// Custom - Menu
import Home from "./Home";
/// Custom - Menu --

/// Application - Router - menu
import { Users_Login_Login } from "./Users/Login/Login";
console.assert(Users_Login_Login, "Users_Login_Login is undefined.");
import { Users_Login_Login_Button } from "./Users/Login/Login";
console.assert(
  Users_Login_Login_Button,
  "Users_Login_Login_Button is undefined."
);
import { Users_Login_SelectUserGroup } from "./Users/Login/SelectUserGroup";
console.assert(
  Users_Login_SelectUserGroup,
  "Users_Login_SelectUserGroup is undefined."
);
import { Users_Login_SelectUserGroup_Button } from "./Users/Login/SelectUserGroup";
console.assert(
  Users_Login_SelectUserGroup_Button,
  "Users_Login_SelectUserGroup_Button is undefined."
);

import { Users_Groups_List } from "./Users/Groups/List";
console.assert(Users_Groups_List, "Users_Groups_List is undefined.");
import { Users_Groups_Insert } from "./Users/Groups/Insert";
console.assert(Users_Groups_Insert, "Users_Groups_Insert is undefined.");
import { Users_Groups_Update } from "./Users/Groups/Update";
console.assert(Users_Groups_Update, "Users_Groups_Update is undefined.");

import { Users_Admins_List } from "./Users/Admins/List";
console.assert(Users_Admins_List, "Users_Admins_List is undefined.");
import { Users_Admins_Insert } from "./Users/Admins/Insert";
console.assert(Users_Admins_Insert, "Users_Admins_Insert is undefined.");
import { Users_Admins_Update } from "./Users/Admins/Update";
console.assert(Users_Admins_Update, "Users_Admins_Update is undefined.");

import { Users_Users_List } from "./Users/Users/List";
console.assert(Users_Users_List, "Users_Users_List is undefined.");
import { Users_Users_Insert } from "./Users/Users/Insert";
console.assert(Users_Users_Insert, "Users_Users_Insert is undefined.");
import { Users_Users_Update } from "./Users/Users/Update";
console.assert(Users_Users_Update, "Users_Users_Update is undefined.");

import { Books_Categorys_List } from "./Books/Categorys/List";
console.assert(Books_Categorys_List, "Books_Categorys_List is undefined.");
import { Books_Categorys_Insert } from "./Books/Categorys/Insert";
console.assert(Books_Categorys_Insert, "Books_Categorys_Insert is undefined.");
import { Books_Categorys_Update } from "./Books/Categorys/Update";
console.assert(Books_Categorys_Update, "Books_Categorys_Update is undefined.");

import { Books_Books_List } from "./Books/Books/List";
console.assert(Books_Books_List, "Books_Books_List is undefined.");
import { Books_Books_Insert } from "./Books/Books/Insert";
console.assert(Books_Books_Insert, "Books_Books_Insert is undefined.");
import { Books_Books_Update } from "./Books/Books/Update";
console.assert(Books_Books_Update, "Books_Books_Update is undefined.");

import { Maps_Consumers_List } from "./Maps/Consumers/List";
console.assert(Maps_Consumers_List, "Maps_Consumers_List is undefined.");
import { Maps_Consumers_ExcelExportList } from "./Maps/Consumers/ExcelExportList";
console.assert(
  Maps_Consumers_ExcelExportList,
  "Maps_Consumers_ExcelExportList is undefined."
);
import { Maps_Consumers_ExcelImportView } from "./Maps/Consumers/ExcelImportView";
console.assert(
  Maps_Consumers_ExcelImportView,
  "Maps_Consumers_ExcelImportView is undefined."
);
import { Maps_Consumers_AutoMapView } from "./Maps/Consumers/AutoMapView";
console.assert(
  Maps_Consumers_AutoMapView,
  "Maps_Consumers_AutoMapView is undefined."
);
import { Maps_Consumers_Insert } from "./Maps/Consumers/Insert";
console.assert(Maps_Consumers_Insert, "Maps_Consumers_Insert is undefined.");
import { Maps_Consumers_Update } from "./Maps/Consumers/Update";
console.assert(Maps_Consumers_Update, "Maps_Consumers_Update is undefined.");

import { Maps_Maps_View } from "./Maps/Maps/View";
console.assert(Maps_Maps_View, "Maps_Maps_View is undefined.");

import { MapsSP_Home_View } from "./MapsSP/Home/View";
console.assert(MapsSP_Home_View, "MapsSP_Home_View is undefined.");

import { MapsSP_List_List } from "./MapsSP/List/List";
console.assert(MapsSP_List_List, "MapsSP_List_List is undefined.");
import { MapsSP_Consumers_List } from "./MapsSP/Consumers/List";
console.assert(MapsSP_Consumers_List, "MapsSP_Consumers_List is undefined.");
import { MapsSP_Consumers_Detail } from "./MapsSP/Consumers/Detail";
console.assert(
  MapsSP_Consumers_Detail,
  "MapsSP_Consumers_Detail is undefined."
);

import { MapsSP_Maps_View } from "./MapsSP/Maps/View";
console.assert(MapsSP_Maps_View, "MapsSP_Maps_View is undefined.");

import { MapsSP_Pins_View } from "./MapsSP/Pins/View";
console.assert(MapsSP_Pins_View, "MapsSP_Pins_View is undefined.");

import { MapsSP_Companys_List } from "./MapsSP/Companys/List";
console.assert(MapsSP_Companys_List, "MapsSP_Companys_List is undefined.");
import { MapsSP_Companys_Detail } from "./MapsSP/Companys/Detail";
console.assert(MapsSP_Companys_Detail, "MapsSP_Companys_Detail is undefined.");

import { MapsSP_Associations_List } from "./MapsSP/Associations/List";
console.assert(
  MapsSP_Associations_List,
  "MapsSP_Associations_List is undefined."
);
import { MapsSP_Associations_Detail } from "./MapsSP/Associations/Detail";
console.assert(
  MapsSP_Associations_Detail,
  "MapsSP_Associations_Detail is undefined."
);

import { Maps_Pins_List } from "./Maps/Pins/List";
console.assert(Maps_Pins_List, "Maps_Pins_List is undefined.");
import { Maps_Pins_View } from "./Maps/Pins/View";
console.assert(Maps_Pins_View, "Maps_Pins_View is undefined.");
import { Maps_Pins_Insert } from "./Maps/Pins/Insert";
console.assert(Maps_Pins_Insert, "Maps_Pins_Insert is undefined.");
import { Maps_Pins_Update } from "./Maps/Pins/Update";
console.assert(Maps_Pins_Update, "Maps_Pins_Update is undefined.");

import { Maps_Companys_List } from "./Maps/Companys/List";
console.assert(Maps_Companys_List, "Maps_Companys_List is undefined.");
import { Maps_Companys_Insert } from "./Maps/Companys/Insert";
console.assert(Maps_Companys_Insert, "Maps_Companys_Insert is undefined.");
import { Maps_Companys_Update } from "./Maps/Companys/Update";
console.assert(Maps_Companys_Update, "Maps_Companys_Update is undefined.");

import { Maps_Associations_List } from "./Maps/Associations/List";
console.assert(Maps_Associations_List, "Maps_Associations_List is undefined.");
import { Maps_Associations_Insert } from "./Maps/Associations/Insert";
console.assert(
  Maps_Associations_Insert,
  "Maps_Associations_Insert is undefined."
);
import { Maps_Associations_Update } from "./Maps/Associations/Update";
console.assert(
  Maps_Associations_Update,
  "Maps_Associations_Update is undefined."
);

import { Maps_Ranks_Edit } from "./Maps/Ranks/Edit";
console.assert(Maps_Ranks_Edit, "Maps_Ranks_Edit is undefined.");

import { Maps_Tags_List } from "./Maps/Tags/List";
console.assert(Maps_Tags_List, "Maps_Tags_List is undefined.");
import { Maps_Tags_Insert } from "./Maps/Tags/Insert";
console.assert(Maps_Tags_Insert, "Maps_Tags_Insert is undefined.");
import { Maps_Tags_Update } from "./Maps/Tags/Update";
console.assert(Maps_Tags_Update, "Maps_Tags_Update is undefined.");

import { Maps_ZnetLicences_View } from "./Maps/ZnetLicences/View";
console.assert(Maps_ZnetLicences_View, "Maps_ZnetLicences_View is undefined.");

import { Books_Languages_Edit } from "./Books/Languages/Edit";
console.assert(Books_Languages_Edit, "Books_Languages_Edit is undefined.");

// for logged in users
import Profile from "./Users/Login/Profile";
/// Application - Router - menu --

/// Application
/**
 *
 *
 * @param {*} { component: Component, layout: Layout, mode: mode, ...rest }
 * @returns
 */
export let AppRoute = ({
  component: Component,
  layout: Layout,
  mode: mode,
  ...rest
}) => {
  console.assert(Component, "Component is undefined.");
  console.assert(Layout, "Layout is undefined.");

  let componentInfo = null;
  const componentInfoFunc = new Component().ComponentInfo;
  if (componentInfoFunc) {
    /// Sys - CRUD - component info
    componentInfo = componentInfoFunc(mode);
    /// Sys - CRUD - component info --
  } else {
    /// Sys - View - component info
    if (new Component().getMeteorData) {
      const data = new Component().getMeteorData();
      if (data && data.ComponentInfo) {
        componentInfo = data.ComponentInfo(mode);
      }
    }
    /// Sys - View - component info --
  }
  if (componentInfo) {
    return (
      <Route
        {...rest}
        render={props => (
          <Layout title={componentInfo.title}>
            <Component {...props} />
          </Layout>
        )}
      />
    );
  } else {
    return (
      <Route
        {...rest}
        render={props => (
          <Layout>
            <Component {...props} />
          </Layout>
        )}
      />
    );
  }
};
/// Application --

/// Application - Role - layout
class PublicLayout extends React.Component {
  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}
/// Application - Role - layout --

/// Application - Role - layout
class AuthenticatedLayout extends React.Component {
  render() {
    if (window.ZntAuth) {
      window.ZntAuth.logout();
    }

    // definitely no user
    if (!Meteor.user() || Meteor.user().profile._deleted) {
      if (_.get(this, "props.children.props.history")) {
        this.props.children.props.history.replace("/Users/Login/Login");
      } else if (_.get(this, "props.history")) {
        this.props.history.replace("/Users/Login/Login");
      } else {
        window.location.pathname = "/Users/Login/Login";
      }
      return (
        <React.Fragment>
          <p>Redirecting to login...</p>
        </React.Fragment>
      );
    }

    // if user
    if (Meteor.user()) {
      if (this.props.title) {
        return (
          <React.Fragment>
            <ApplicationStatus />

            <h2>{this.props.title}</h2>

            {this.props.children}
          </React.Fragment>
        );
      } else {
        return <React.Fragment>{this.props.children}</React.Fragment>;
      }
    }

    // maybe still loading the user
    return (
      <React.Fragment>
        <p>loading...</p>
      </React.Fragment>
    );
  }
}
/// Application - Role - layout --

/// Application - Role - layout
class AuthenticatedSPLayout extends React.Component {
  render() {
    if (window.ZntAuth) {
      window.ZntAuth.logout();
    }

    // definitely no user
    if (!Meteor.user() || Meteor.user().profile._deleted) {
      if (_.get(this, "props.children.props.history")) {
        this.props.children.props.history.replace("/Users/Login/Login");
      } else if (_.get(this, "props.history")) {
        this.props.history.replace("/Users/Login/Login");
      } else {
        window.location.pathname = "/Users/Login/Login";
      }
      return (
        <React.Fragment>
          <p>Redirecting to login...</p>
        </React.Fragment>
      );
    }

    // if user
    if (Meteor.user()) {
      if (this.props.title) {
        return <React.Fragment>{this.props.children}</React.Fragment>;
      } else {
        return <React.Fragment>{this.props.children}</React.Fragment>;
      }
    }

    // maybe still loading the user
    return (
      <React.Fragment>
        <p>loading...</p>
      </React.Fragment>
    );
  }
}
/// Application - Role - layout --

/// Application - Role - layout
class AuthenticatedSPMapLayout extends React.Component {
  render() {
    // definitely no user
    if (!Meteor.user() || Meteor.user().profile._deleted) {
      if (_.get(this, "props.children.props.history")) {
        this.props.children.props.history.replace("/Users/Login/Login");
      } else if (_.get(this, "props.history")) {
        this.props.history.replace("/Users/Login/Login");
      } else {
        window.location.pathname = "/Users/Login/Login";
      }
      return (
        <React.Fragment>
          <p>Redirecting to login...</p>
        </React.Fragment>
      );
    }

    // if user
    if (Meteor.user()) {
      if (this.props.title) {
        return <React.Fragment>{this.props.children}</React.Fragment>;
      } else {
        return <React.Fragment>{this.props.children}</React.Fragment>;
      }
    }

    // maybe still loading the user
    return (
      <React.Fragment>
        <p>loading...</p>
      </React.Fragment>
    );
  }
}
/// Application - Role - layout --

/// Sys - ApplicationError - display
/**
 *
 *
 * @class ApplicationStatus
 * @extends {React.Component}
 */
class ApplicationStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      networkError: false,
      hasError: false,
      showError: false
    };
    this.errorDispList = [];
    this.collectErrorInfo = this.collectErrorInfo.bind(this);
  }

  /**
   *
   *
   * @memberof ApplicationStatus
   */
  collectErrorInfo() {
    const errorList = Session.get("method.call.error") || [];
    this.errorDispList = [];
    for (let i = 0; i < errorList.length; i++) {
      const error = errorList[i];
      const errorArg = error.method.args.filter(arg => {
        console.log("arg", arg);
        return arg && typeof arg == "object" && "methodCall" in arg;
      });
      let tmp;
      if (errorArg.length) {
        tmp = {
          i: i,
          callAt: moment(errorArg[0].callAt).format("YYYY/MM/DD HH:mm"),
          proc: errorArg[0].proc,
          record: errorArg[0].record,
          message: error.error.message
        };
      } else {
        tmp = {
          i: i,
          callAt: "--",
          proc: "--",
          record: "--",
          message: error.error.message
        };
      }
      this.errorDispList.push(tmp);
    }

    if (this.errorDispList.length) {
      this.setState({ hasError: true });
    } else {
      this.setState({ hasError: false });
    }
  }

  /**
   *
   *
   * @memberof ApplicationStatus
   */
  componentDidMount() {
    setTimeout(() => {
      Tracker.autorun(() => {
        this.setState({ networkError: Meteor.status().status !== "connected" });
        this.collectErrorInfo();
      });
    }, 0);

    this.collectErrorInfo();
  }

  /**
   *
   *
   * @param {*} error
   * @memberof ApplicationStatus
   */
  confirm(error) {
    const errorList = Session.get("method.call.error") || [];
    errorList.splice(error.i, 1);
    Session.setPersistent("method.call.error", errorList);
  }

  /* global index */
  /* global error */

  /**
   *
   *
   * @returns
   * @memberof ApplicationStatus
   */
  render() {
    return (
      <React.Fragment>
        {<If condition={this.state.networkError}>NetworkError</If>}

        {
          <If condition={this.state.hasError}>
            <MDBBtn
              color="danger"
              onClick={() => {
                this.setState({ showError: true });
              }}
              className="btnfont"
            >
              エラー
            </MDBBtn>
          </If>
        }

        <MDBModal
          isOpen={this.state.showError}
          toggle={() => {
            this.setState({ showError: false });
          }}
        >
          <MDBModalHeader
            toggle={() => {
              this.setState({ showError: false });
            }}
          >
            エラー情報
          </MDBModalHeader>
          <MDBModalBody>
            {
              <For each="error" index="index" of={this.errorDispList}>
                <div key={index}>
                  {error.callAt} {error.proc} {error.record} {error.message}
                  <MDBBtn
                    color="info"
                    onClick={() => {
                      this.confirm(error);
                    }}
                    className="btnfont"
                  >
                    確認
                  </MDBBtn>
                </div>
              </For>
            }
          </MDBModalBody>
        </MDBModal>
      </React.Fragment>
    );
  }
}
/// Sys - ApplicationError - display --

/// Application - Router - contents
/**
 *
 *
 * @returns
 */
export const ContentSwitch = () => {
  return (
    <Switch>
      {/* routes */}
      <AppRoute exact path="/" layout={PublicLayout} component={Home} />
      <AppRoute
        exact
        path="/Users/Login/Login"
        layout={PublicLayout}
        component={Users_Login_Login}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Users/Login/SelectUserGroup"
        layout={AuthenticatedLayout}
        component={Users_Login_SelectUserGroup}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Users/Groups/List"
        layout={AuthenticatedLayout}
        component={Users_Groups_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/Users/Groups/Update/:_id"
        layout={AuthenticatedLayout}
        component={Users_Groups_Update}
        mode="read"
      />
      <AppRoute
        exact
        path="/Users/Groups/Insert"
        layout={AuthenticatedLayout}
        component={Users_Groups_Insert}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Users/Admins/List"
        layout={AuthenticatedLayout}
        component={Users_Admins_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/Users/Admins/Update/:_id"
        layout={AuthenticatedLayout}
        component={Users_Admins_Update}
        mode="read"
      />
      <AppRoute
        exact
        path="/Users/Admins/Insert"
        layout={AuthenticatedLayout}
        component={Users_Admins_Insert}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Users/Users/List"
        layout={AuthenticatedLayout}
        component={Users_Users_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/Users/Users/Update/:_id"
        layout={AuthenticatedLayout}
        component={Users_Users_Update}
        mode="read"
      />
      <AppRoute
        exact
        path="/Users/Users/Insert"
        layout={AuthenticatedLayout}
        component={Users_Users_Insert}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Books/Categorys/List"
        layout={AuthenticatedLayout}
        component={Books_Categorys_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/Books/Categorys/Update/:_id"
        layout={AuthenticatedLayout}
        component={Books_Categorys_Update}
        mode="read"
      />
      <AppRoute
        exact
        path="/Books/Categorys/Insert"
        layout={AuthenticatedLayout}
        component={Books_Categorys_Insert}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Books/Books/List"
        layout={AuthenticatedLayout}
        component={Books_Books_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/Books/Books/Update/:_id"
        layout={AuthenticatedLayout}
        component={Books_Books_Update}
        mode="read"
      />
      <AppRoute
        exact
        path="/Books/Books/Insert"
        layout={AuthenticatedLayout}
        component={Books_Books_Insert}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Books/Languages/Edit"
        layout={AuthenticatedLayout}
        component={Books_Languages_Edit}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Maps/Consumers/List"
        layout={AuthenticatedLayout}
        component={Maps_Consumers_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/Maps/Consumers/ExcelExportList"
        layout={AuthenticatedLayout}
        component={Maps_Consumers_ExcelExportList}
        mode="read"
      />
      <AppRoute
        exact
        path="/Maps/Consumers/ExcelImportView"
        layout={AuthenticatedLayout}
        component={Maps_Consumers_ExcelImportView}
        mode="update"
      />
      <AppRoute
        exact
        path="/Maps/Consumers/AutoMapView"
        layout={AuthenticatedLayout}
        component={Maps_Consumers_AutoMapView}
        mode="update"
      />
      <AppRoute
        exact
        path="/Maps/Consumers/Update/:_id"
        layout={AuthenticatedLayout}
        component={Maps_Consumers_Update}
        mode="read"
      />
      <AppRoute
        exact
        path="/Maps/Consumers/Insert"
        layout={AuthenticatedLayout}
        component={Maps_Consumers_Insert}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/MapsSP/Home/View"
        layout={AuthenticatedSPLayout}
        component={MapsSP_Home_View}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/MapsSP/List/List"
        layout={AuthenticatedSPLayout}
        component={MapsSP_List_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/MapsSP/Consumers/List"
        layout={AuthenticatedSPLayout}
        component={MapsSP_Consumers_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/MapsSP/Consumers/Detail/:_id"
        layout={AuthenticatedSPLayout}
        component={MapsSP_Consumers_Detail}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/MapsSP/Companys/List"
        layout={AuthenticatedSPLayout}
        component={MapsSP_Companys_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/MapsSP/Companys/Detail/:_id"
        layout={AuthenticatedSPLayout}
        component={MapsSP_Companys_Detail}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/MapsSP/Associations/List"
        layout={AuthenticatedSPLayout}
        component={MapsSP_Associations_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/MapsSP/Associations/Detail/:_id"
        layout={AuthenticatedSPLayout}
        component={MapsSP_Associations_Detail}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Maps/Maps/View"
        layout={AuthenticatedSPMapLayout}
        component={Maps_Maps_View}
        mode="read"
      />
      <AppRoute
        exact
        path="/MapsSP/Maps/View"
        layout={AuthenticatedSPMapLayout}
        component={MapsSP_Maps_View}
        mode="read"
      />
      <AppRoute
        exact
        path="/MapsSP/Maps/ViewPos/:center"
        layout={AuthenticatedSPMapLayout}
        component={MapsSP_Maps_View}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Maps/Pins/List"
        layout={AuthenticatedLayout}
        component={Maps_Pins_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/Maps/Pins/View"
        layout={AuthenticatedLayout}
        component={Maps_Pins_View}
        mode="read"
      />
      <AppRoute
        exact
        path="/Maps/Pins/Update/:_id"
        layout={AuthenticatedLayout}
        component={Maps_Pins_Update}
        mode="read"
      />
      <AppRoute
        exact
        path="/Maps/Pins/Insert"
        layout={AuthenticatedLayout}
        component={Maps_Pins_Insert}
        mode="read"
      />
      <AppRoute
        exact
        path="/MapsSP/Pins/View"
        layout={AuthenticatedSPLayout}
        component={MapsSP_Pins_View}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Maps/Companys/List"
        layout={AuthenticatedLayout}
        component={Maps_Companys_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/Maps/Companys/Update/:_id"
        layout={AuthenticatedLayout}
        component={Maps_Companys_Update}
        mode="read"
      />
      <AppRoute
        exact
        path="/Maps/Companys/Insert"
        layout={AuthenticatedLayout}
        component={Maps_Companys_Insert}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Maps/Associations/List"
        layout={AuthenticatedLayout}
        component={Maps_Associations_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/Maps/Associations/Update/:_id"
        layout={AuthenticatedLayout}
        component={Maps_Associations_Update}
        mode="read"
      />
      <AppRoute
        exact
        path="/Maps/Associations/Insert"
        layout={AuthenticatedLayout}
        component={Maps_Associations_Insert}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Maps/Ranks/Edit"
        layout={AuthenticatedLayout}
        component={Maps_Ranks_Edit}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Maps/Tags/List"
        layout={AuthenticatedLayout}
        component={Maps_Tags_List}
        mode="read"
      />
      <AppRoute
        exact
        path="/Maps/Tags/Update/:_id"
        layout={AuthenticatedLayout}
        component={Maps_Tags_Update}
        mode="read"
      />
      <AppRoute
        exact
        path="/Maps/Tags/Insert"
        layout={AuthenticatedLayout}
        component={Maps_Tags_Insert}
        mode="read"
      />

      <AppRoute
        exact
        path="/Maps/ZnetLicences/View"
        layout={AuthenticatedLayout}
        component={Maps_ZnetLicences_View}
        mode="read"
      />

      {/* in routes */}
      <AppRoute
        exact
        path="/Users/Login/Profile"
        layout={AuthenticatedLayout}
        component={Profile}
        mode="read"
      />
    </Switch>
  );
};
/// Application - Router - contents --
