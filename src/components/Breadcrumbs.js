import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";
import gridStyles from "./../styles/Grid.module.css";


class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  }
  computeBreadcrumb() {
    const currentRelativeUrl = this.props.location.pathname;
    // Split the currentRelativeUrl on /.
    const splitPathnames = currentRelativeUrl.slice().split("/");
    return currentRelativeUrl === "/"
      ? null
      : splitPathnames.map((sp, i) => {
        // Slice from 1 and not from 0, because 0 is an empty string caused by
        // splitting on /.
        const navLinkRelativeUrl = `/${splitPathnames.slice(1, i + 1).join("/")}`;
        let title = sp.replace(/_/g, ' ');
        return (
          <NavLink to={navLinkRelativeUrl} key={navLinkRelativeUrl} className={this.uuidRegex.test(sp) ? styles.NavLinkUuid : null}>
            {" "}
            <span
              className={this.uuidRegex.test(sp) ? styles.NavLinkTextUuid : styles.NavLinkText}
              // Show 'uuid' upon hovering over uuid key, to make it apparent
              // for users that it is the uuid.
              title={this.uuidRegex.test(sp) ? "uuid" : ""}
            >
              {title}
              {i === splitPathnames.length - 1 ? null : <span style={{ margin: 5 }}>&#062;</span>}
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
