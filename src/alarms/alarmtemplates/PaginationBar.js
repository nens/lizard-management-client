import React, { Component } from "react";
import styles from "./PaginationBar.css";

class PaginationBar extends Component {
  render() {
    const { pages, page, loadTemplatesOnPage } = this.props;

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
                style={{ cursor: "pointer", color: "#007bff" }}
                key={i}
                onClick={() => {
                  loadTemplatesOnPage(linkPlusOne);
                }}
              >
                <a>{linkPlusOne}</a>
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

export default PaginationBar;
