import React, { Component } from "react";
import { NavLink } from "react-router-dom";
// import onClickOutside from "react-onclickoutside";
// import styles from "./Breadcrumbs.css";
import styles from "./Breadcrumbs.css";
import gridStyles from "./../styles/Grid.css";


class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  }
  computeBreadcrumb() {
    const { pathname } = this.props.location;
    const splitPathnames = pathname.slice().split("/");
    return pathname === "/"
      ? null
      : splitPathnames.map((sp, i) => {
        const to = `/${splitPathnames.slice(1, i + 1).join("/")}`;
        let title = sp.replace("_", " ");
        let styleNavLink = {};
        let styleSpan = {};
        // Show the uuid as lowercase
        if (this.uuidRegex && this.uuidRegex.test(sp)) {
          // Make sure that the whole uuid is visible
          styleNavLink = {
            minWidth: "0px",
            overflow: "hidden"
          };
          styleSpan = {
            // Show uuid in lowercase
            textTransform: "lowercase",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden"
          };
        } else {
          styleSpan = {
            textTransform: "uppercase"
          };
        }
        console.log("still there");
        return (
          <NavLink to={to} key={to} style={styleNavLink}>
            {" "}
            <span
              style={styleSpan}
              // Show 'uuid' upon hovering over uuid key, to make it apparent
              // for users that it is the uuid.
              title={this.uuidRegex.test(sp) ? "uuid" : ""}
            >
              &nbsp;
                {title}
              {i === splitPathnames.length - 1 ? null : " /"}
            </span>
          </NavLink>
        );
      });
  }
  render() {
    const breadcrumbs = this.computeBreadcrumb();
    return (
      <div
        className={`${styles.BreadcrumbsContainer} ${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            overflowX: "hidden,"
          }}
        >
          <NavLink to="/" style={{ overflowX: "hidden" }}>
            Management
          </NavLink>
          <div style={{textTransform: "uppercase"}}>
            {breadcrumbs}
          </div>
        </div>
      </div>
    );
  }
}

export default Breadcrumbs;
