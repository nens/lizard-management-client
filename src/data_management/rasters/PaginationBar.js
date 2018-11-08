import React, { Component } from "react";
import styles from "./PaginationBar.css";

class PaginationBar extends Component {
  constructor(props) {
    super(props);
    this.state = { navigatorInError: false };
  }

  renderLinks(links, page, loadRastersOnPage) {
    return links.map(link => {
      if (page === link) {
        return <div key={link}>{link}</div>;
      } else {
        return (
          <div
            style={{ cursor: "pointer", color: "#007bff" }}
            key={link}
            onClick={() => {
              loadRastersOnPage(link);
            }}
          >
            <a>{link}</a>
          </div>
        );
      }
    });
  }

  renderNavigator(links, page, loadRastersOnPage) {
    return (
      <div>
        <span>Page: </span>
        <input
          className={
            styles.FormControl +
            " " +
            (this.state.navigatorInError ? styles.FormControlError : "")
          }
          placeholder={page}
          onChange={e => {
            const value = e.target.value;
            if (parseInt(value) > 0 && parseInt(value) <= links.length) {
              loadRastersOnPage(parseInt(value));
              this.setState({ navigatorInError: false });
            } else {
              this.setState({ navigatorInError: true });
            }
          }}
          maxlength={(links.length + "").length}
          size={(links.length + "").length}
        />
        <span> of {links.length}</span>
      </div>
    );
  }

  render() {
    const { pages, page, loadRastersOnPage } = this.props;

    if (!page && !pages) {
      return null;
    }

    // have not found out yet why this is wrapped in try catch block ..
    try {
      const showPagesAhead = 3; // amount of pages to show ahead
      const links = Array(pages)
        .fill(0)
        .map((e, indexx) => indexx + 1);
      const linksStart = Array(showPagesAhead)
        .fill(0)
        .map((e, indexx) => indexx + 1);
      const linksCenter = links.slice(
        page - (showPagesAhead + 1),
        page + showPagesAhead
      );
      const linkEnd = links.slice(-showPagesAhead);
      const linksFromStartToCurrentPage = links.slice(0, page + showPagesAhead);
      const linksFromCurrentPageToEnd = links.slice(
        page - (showPagesAhead + 1),
        links.length
      );
      const pagesShownWithoutEllipsis = showPagesAhead * 4 + 3; // begin1+ellipsis+ before current page2+page itself+aftercurrentpage3+ellipsis+end4
      const noEllipseBeforeOrAfterCurrentPage = showPagesAhead * 2 + 2;

      if (
        links.length > pagesShownWithoutEllipsis &&
        page <= noEllipseBeforeOrAfterCurrentPage
      ) {
        return (
          <div>
            <div className={styles.PaginationBar}>
              {this.renderLinks(
                linksFromStartToCurrentPage,
                page,
                loadRastersOnPage
              )}
              {this.renderLinks(["..."], page, loadRastersOnPage)}
              {this.renderLinks(linkEnd, page, loadRastersOnPage)}
            </div>
            <div className={styles.NavigatorBar}>
              {this.renderNavigator(links, page, loadRastersOnPage)}
            </div>
          </div>
        );
      } else if (
        links.length > pagesShownWithoutEllipsis &&
        page >= links.length - noEllipseBeforeOrAfterCurrentPage
      ) {
        return (
          <div>
            <div className={styles.PaginationBar}>
              {this.renderLinks(linksStart, page, loadRastersOnPage)}
              {this.renderLinks(["..."], page, loadRastersOnPage)}
              {this.renderLinks(
                linksFromCurrentPageToEnd,
                page,
                loadRastersOnPage
              )}
            </div>
            <div className={styles.NavigatorBar}>
              {this.renderNavigator(links, page, loadRastersOnPage)}
            </div>
          </div>
        );
      } else if (links.length > pagesShownWithoutEllipsis) {
        return (
          <div>
            <div className={styles.PaginationBar}>
              {this.renderLinks(linksStart, page, loadRastersOnPage)}
              {this.renderLinks(["..."], page, loadRastersOnPage)}
              {this.renderLinks(linksCenter, page, loadRastersOnPage)}
              {this.renderLinks(["..."], page, loadRastersOnPage)}
              {this.renderLinks(linkEnd, page, loadRastersOnPage)}
            </div>
            <div className={styles.NavigatorBar}>
              {this.renderNavigator(links, page, loadRastersOnPage)}
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div className={styles.PaginationBar}>
              {this.renderLinks(links, page, loadRastersOnPage)}
            </div>
            <div className={styles.NavigatorBar}>
              {this.renderNavigator(links, page, loadRastersOnPage)}
            </div>
          </div>
        );
      }
    } catch (e) {
      return <div />;
    }
  }
}

export default PaginationBar;
