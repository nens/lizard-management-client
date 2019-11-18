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
        return (
          <NavLink to={to} key={to} className={this.uuidRegex.test(sp) ? styles.NavLinkUuid : null}>
            {" "}
            <span
              className={this.uuidRegex.test(sp) ? styles.NavLinkTextUuid : styles.NavLinkText}
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
        <NavLink to="/" style={{ overflowX: "hidden" }}>
          Management
        </NavLink>
        {breadcrumbs}
      </div>
    );
  }
}

export default Breadcrumbs;
