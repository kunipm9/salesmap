/// Application - Router - router
import React from "react";
import { withRouter } from "react-router-dom";
import { ContentSwitch } from "./ContentSwitch";
import ScrollMemory from "react-router-scroll-memory";
import { Session } from "meteor/session";
/// Application - Router - router --

/// Application - Role
import { AccountDisplayWrapper } from "./AccountDisplay";
/// Application - Role --

/// Sys - Transition - wrapper
const ContentSwitchWrapper = withRouter(ContentSwitch);
/// Sys - Transition - wrapper --

import { isMobile } from "@imports/ui/utils/util";

/// Application - Layout
import { MDBCard, MDBCardBody } from "mdbreact";
import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBIcon,
  MDBBtn,
  MDBSideNavItem,
  MDBSideNavCat,
  MDBSideNavNav,
  MDBSideNav,
  MDBSideNavLink,
  MDBContainer
} from "mdbreact";
/// Application - Layout --

/// Application - Router - menu
import { MapsSP_List_List_ComponentInfo } from "./MapsSP/List/List";
console.assert(
  MapsSP_List_List_ComponentInfo,
  "MapsSP_List_List_ComponentInfo is undefined."
);

import { MapsSP_Consumers_List_ComponentInfo } from "./MapsSP/Consumers/List";
console.assert(
  MapsSP_Consumers_List_ComponentInfo,
  "MapsSP_Consumers_List_ComponentInfo is undefined."
);

import { Maps_Consumers_List_ComponentInfo } from "./Maps/Consumers/List";
console.assert(
  Maps_Consumers_List_ComponentInfo,
  "Maps_Consumers_List_ComponentInfo is undefined."
);
import { Maps_Consumers_ExcelExportList_ComponentInfo } from "./Maps/Consumers/ExcelExportList";
console.assert(
  Maps_Consumers_ExcelExportList_ComponentInfo,
  "Maps_Consumers_ExcelExportList_ComponentInfo is undefined."
);
import { Maps_Consumers_ExcelImportView_ComponentInfo } from "./Maps/Consumers/ExcelImportView";
console.assert(
  Maps_Consumers_ExcelImportView_ComponentInfo,
  "Maps_Consumers_ExcelImportView_ComponentInfo is undefined."
);
import { Maps_Consumers_AutoMapView_ComponentInfo } from "./Maps/Consumers/AutoMapView";
console.assert(
  Maps_Consumers_AutoMapView_ComponentInfo,
  "Maps_Consumers_AutoMapView_ComponentInfo is undefined."
);

import { Maps_Maps_View_ComponentInfo } from "./Maps/Maps/View";
console.assert(
  Maps_Maps_View_ComponentInfo,
  "Maps_Maps_View_ComponentInfo is undefined."
);
import { MapsSP_Maps_View_ComponentInfo } from "./MapsSP/Maps/View";
console.assert(
  MapsSP_Maps_View_ComponentInfo,
  "MapsSP_Maps_View_ComponentInfo is undefined."
);

import { MapsSP_Companys_List_ComponentInfo } from "./MapsSP/Companys/List";
console.assert(
  MapsSP_Companys_List_ComponentInfo,
  "MapsSP_Companys_List_ComponentInfo is undefined."
);

import { MapsSP_Associations_List_ComponentInfo } from "./MapsSP/Associations/List";
console.assert(
  MapsSP_Associations_List_ComponentInfo,
  "MapsSP_Associations_List_ComponentInfo is undefined."
);

import { Maps_Pins_List_ComponentInfo } from "./Maps/Pins/List";
console.assert(
  Maps_Pins_List_ComponentInfo,
  "Maps_Pins_List_ComponentInfo is undefined."
);
import { Maps_Pins_View_ComponentInfo } from "./Maps/Pins/View";
console.assert(
  Maps_Pins_View_ComponentInfo,
  "Maps_Pins_View_ComponentInfo is undefined."
);
import { MapsSP_Pins_View_ComponentInfo } from "./MapsSP/Pins/View";
console.assert(
  MapsSP_Pins_View_ComponentInfo,
  "MapsSP_Pins_View_ComponentInfo is undefined."
);
import { Maps_Companys_List_ComponentInfo } from "./Maps/Companys/List";
console.assert(
  Maps_Companys_List_ComponentInfo,
  "Maps_Companys_List_ComponentInfo is undefined."
);
import { Maps_Associations_List_ComponentInfo } from "./Maps/Associations/List";
console.assert(
  Maps_Associations_List_ComponentInfo,
  "Maps_Associations_List_ComponentInfo is undefined."
);
import { Maps_Ranks_Edit_ComponentInfo } from "./Maps/Ranks/Edit";
console.assert(
  Maps_Ranks_Edit_ComponentInfo,
  "Maps_Ranks_Edit_ComponentInfo is undefined."
);
import { Maps_Tags_List_ComponentInfo } from "./Maps/Tags/List";
console.assert(
  Maps_Tags_List_ComponentInfo,
  "Maps_Tags_List_ComponentInfo is undefined."
);
import { Maps_ZnetLicences_View_ComponentInfo } from "./Maps/ZnetLicences/View";
console.assert(
  Maps_ZnetLicences_View_ComponentInfo,
  "Maps_ZnetLicences_View_ComponentInfo is undefined."
);
import { Books_Books_List_ComponentInfo } from "./Books/Books/List";
console.assert(
  Books_Books_List_ComponentInfo,
  "Books_Books_List_ComponentInfo is undefined."
);
import { Books_Categorys_List_ComponentInfo } from "./Books/Categorys/List";
console.assert(
  Books_Categorys_List_ComponentInfo,
  "Books_Categorys_List_ComponentInfo is undefined."
);
import { Books_Languages_Edit_ComponentInfo } from "./Books/Languages/Edit";
console.assert(
  Books_Languages_Edit_ComponentInfo,
  "Books_Languages_Edit_ComponentInfo is undefined."
);
import { Users_Users_List_ComponentInfo } from "./Users/Users/List";
console.assert(
  Users_Users_List_ComponentInfo,
  "Users_Users_List_ComponentInfo is undefined."
);
import { Users_Groups_List_ComponentInfo } from "./Users/Groups/List";
console.assert(
  Users_Groups_List_ComponentInfo,
  "Users_Groups_List_ComponentInfo is undefined."
);
import { Users_Admins_List_ComponentInfo } from "./Users/Admins/List";
console.assert(
  Users_Admins_List_ComponentInfo,
  "Users_Admins_List_ComponentInfo is undefined."
);
/// Application - Router - menu --

/**
 *
 *
 * @param {*} props
 * @returns
 */
const SideNavLink = props => {
  const tmp = props.componentInfo;

  if (tmp) {
    return (
      <MDBSideNavLink
        to={tmp.path}
        onMouseUp={() => {
          props.refs.sideNav.setState({
            isOpen: false,
            isThere: false,
            showOverlay: false
          });
        }}
      >
        {tmp.title}
      </MDBSideNavLink>
    );
  } else {
    return <span />;
  }
};

/**
 *
 *
 * @class NavBar
 * @extends {React.Component}
 */
class NavBar extends React.Component {
  /**
   *Creates an instance of NavBar.
   * @param {*} props
   * @memberof NavBar
   */
  constructor(props) {
    super(props);
    this.state = {
      toggleStateA: false,
      mobile: isMobile()
    };
  }

  /**
   *
   *
   * @memberof NavBar
   */
  handleToggleClickA = () => {
    this.setState({
      toggleStateA: !this.state.toggleStateA
    });
  };

  /**
   *
   *
   * @returns
   * @memberof NavBar
   */
  renderPC() {
    const mainStyle = {
      paddingTop: "2rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingBottom: "1rem"
    };

    const specialCaseNavbarStyles = {
      WebkitBoxOrient: "horizontal",
      flexDirection: "row"
    };

    /* eslint-disable react/no-string-refs */
    return (
      <div className="mdb-skin">
        <MDBSideNav
          logo="https://mdbootstrap.com/img/logo/mdb-transparent.png"
          triggerOpening={this.state.toggleStateA}
          bg="https://mdbootstrap.com/img/Photos/Others/sidenav4.jpg"
          mask="strong"
          hidden
          ref="sideNav"
        >
          <MDBSideNavNav>
            <MDBSideNavCat name="Books" id="Books-cat" icon="chevron-right">
              <SideNavLink
                componentInfo={Books_Books_List_ComponentInfo("read")}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Books_Categorys_List_ComponentInfo("read")}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Books_Languages_Edit_ComponentInfo("update")}
                refs={this.refs}
              />
            </MDBSideNavCat>

            <MDBSideNavCat name="Maps" id="Maps-cat" icon="chevron-right">
              <SideNavLink
                componentInfo={Maps_Consumers_List_ComponentInfo("read")}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Maps_Consumers_ExcelExportList_ComponentInfo(
                  "read"
                )}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Maps_Consumers_ExcelImportView_ComponentInfo(
                  "update"
                )}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Maps_Consumers_AutoMapView_ComponentInfo(
                  "update"
                )}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Maps_Pins_List_ComponentInfo("read")}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Maps_Pins_View_ComponentInfo("read")}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Maps_Companys_List_ComponentInfo("read")}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Maps_Associations_List_ComponentInfo("read")}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Maps_Ranks_Edit_ComponentInfo("read")}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Maps_Tags_List_ComponentInfo("read")}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Maps_ZnetLicences_View_ComponentInfo("update")}
                refs={this.refs}
              />
            </MDBSideNavCat>

            <MDBSideNavCat
              name="Maps View"
              id="Maps-view-cat"
              icon="chevron-right"
            >
              <SideNavLink
                componentInfo={Maps_Maps_View_ComponentInfo("read")}
                refs={this.refs}
              />
            </MDBSideNavCat>

            <MDBSideNavCat name="Maps SP" id="Maps-cat" icon="chevron-right">
              <SideNavLink
                componentInfo={MapsSP_List_List_ComponentInfo("read")}
                refs={this.refs}
              />
            </MDBSideNavCat>

            <MDBSideNavCat
              name="MapsSP View"
              id="MapsSP-view-cat"
              icon="chevron-right"
            >
              <SideNavLink
                componentInfo={MapsSP_Maps_View_ComponentInfo("read")}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={MapsSP_Pins_View_ComponentInfo("read")}
                refs={this.refs}
              />
            </MDBSideNavCat>

            <MDBSideNavCat name="Users" id="Users-cat" icon="hand-pointer">
              <SideNavLink
                componentInfo={Users_Users_List_ComponentInfo("read")}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Users_Groups_List_ComponentInfo("read")}
                refs={this.refs}
              />
              <SideNavLink
                componentInfo={Users_Admins_List_ComponentInfo("read")}
                refs={this.refs}
              />
            </MDBSideNavCat>

            <MDBSideNavCat name="About" id="about-cat" icon="eye">
              <MDBSideNavItem>Instruction</MDBSideNavItem>
              <MDBSideNavItem>Monthly meetings</MDBSideNavItem>
            </MDBSideNavCat>

            <MDBSideNavCat
              name="Contact me"
              id="contact-me-cat"
              icon="envelope"
            >
              <MDBSideNavItem>FAQ</MDBSideNavItem>
              <MDBSideNavItem>Write a message</MDBSideNavItem>
            </MDBSideNavCat>
          </MDBSideNavNav>
        </MDBSideNav>

        <MDBNavbar double expand="md" fixed="top" scrolling>
          <MDBNavbarNav left>
            <MDBNavItem>
              <div
                onClick={this.handleToggleClickA}
                key="sideNavToggleA"
                style={{
                  lineHeight: "32px",
                  marginRight: "1em",
                  verticalAlign: "middle"
                }}
              >
                <MDBIcon icon="bars" color="white" size="2x" />
              </div>
            </MDBNavItem>

            <MDBNavItem
              className="d-none d-md-inline"
              style={{ paddingTop: 5 }}
            >
              Material Design for Bootstrap
            </MDBNavItem>
          </MDBNavbarNav>

          <MDBNavbarNav right style={specialCaseNavbarStyles}>
            <MDBNavItem active>
              <MDBNavLink to="#!">
                <MDBIcon icon="envelope" className="d-inline-inline" />{" "}
                <div className="d-none d-md-inline">Contact</div>
              </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="#!">
                <MDBIcon icon="comments" className="d-inline-inline" />{" "}
                <div className="d-none d-md-inline">Support</div>
              </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <div className="d-inline">
                <AccountDisplayWrapper />
              </div>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBNavbar>

        <main style={mainStyle}>
          <MDBContainer
            fluid
            style={{ height: "fit-content" }}
            className="mt-5"
          >
            <MDBCard>
              <MDBCardBody>
                <ScrollMemory />
                <ContentSwitchWrapper />

                <MDBBtn
                  tag="a"
                  size="sm"
                  floating
                  gradient="white"
                  style={{ position: "absolute", right: 0, bottom: 0 }}
                  onClick={() => {
                    this.setState({ mobile: !this.state.mobile });
                  }}
                >
                  <MDBIcon icon="star" />
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBContainer>
        </main>
      </div>
    );
    /* eslint-enable react/no-string-refs */
  }

  /**
   *
   *
   * @returns
   * @memberof NavBar
   */
  renderSP() {
    const mainStyle = {
      paddingTop: "0",
      paddingLeft: "0",
      paddingRight: "0",
      paddingBottom: "0"
    };

    /* eslint-disable react/no-string-refs */
    return (
      <main style={mainStyle}>
        <ContentSwitchWrapper />
        {/*
        <MDBBtn tag="a" size="sm" floating gradient="white" style={{ position: 'absolute', right: 0, bottom: 0 }} onClick={() => { this.setState({ mobile: !this.state.mobile }) }}>
          <MDBIcon icon="star" />
        </MDBBtn>
*/}
      </main>
    );
    /* eslint-enable react/no-string-refs */
  }

  /**
   *
   *
   * @returns
   * @memberof NavBar
   */
  render() {
    if (this.state.mobile) {
      return this.renderSP();
    }
    return this.renderPC();
  }
}

export const NavBarWrapper = withRouter(NavBar);
