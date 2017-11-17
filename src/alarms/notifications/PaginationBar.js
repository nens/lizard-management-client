import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import styles from "./PaginationBar.css";
import { fetchPaginatedAlarms } from "../../actions";

class PaginationBar extends Component {
  render() {
    const { pages, page } = this.props;
    if (!page && !pages) {
      return null;
    }

    try {
      const links = Array.from(Array(pages).keys());
      return (
        <div className={styles.PaginationBar}>
          {links.map((link, i) => {
            const linkPlusOne = link + 1;
            if (linkPlusOne === page) {
              return <div key={i}>{linkPlusOne}</div>;
            }
            return (
              <div
                key={i}
                onClick={() => this.props.fetchPaginatedAlarms(linkPlusOne)}
              >
                <NavLink to={`/alarms/notifications?page=${linkPlusOne}`}>
                  {linkPlusOne}
                </NavLink>
              </div>
            );
          })}
        </div>
      );
    } catch (e) {
      return <div/>;
    }
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPaginatedAlarms: page => dispatch(fetchPaginatedAlarms(page))
  };
};

export default connect(null, mapDispatchToProps)(PaginationBar);
