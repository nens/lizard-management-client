import React, { Component } from "react";
import styles from "./PaginationBar.css";

class PaginationBar extends Component {
  constructor(props) {
    super(props);
    this.state = { navigatorInError: false };
  }

  // render all the page numbers of the list of links
  // par=loadRastersOnPage is optional
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
              loadRastersOnPage && loadRastersOnPage(link);
            }}
          >
            <a>{link}</a>
          </div>
        );
      }
    });
  }

  // input field to fill in desired page
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
            // navigates to page
            const value = e.target.value;
            // only navigate if page is valid
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
      // links = array [1, ... pages]
      const links = Array(pages)
        .fill(0)
        .map((e, indexx) => indexx + 1);
      // linksStart = array [1, ... showPagesAhead]
      const linksStart = Array(showPagesAhead)
        .fill(0)
        .map((e, indexx) => indexx + 1);
      // linksCenter = [ 11,12,13,14,15,16,17] given that 14 is current page
      const linksCenter = links.slice(
        page - (showPagesAhead + 1),
        page + showPagesAhead
      );
      // linkEnd = [29,30,31,32] given that links.length =32
      const linkEnd = links.slice(-showPagesAhead);
      const linksFromStartToCurrentPage = links.slice(0, page + showPagesAhead);
      const linksFromCurrentPageToEnd = links.slice(
        page - (showPagesAhead + 1),
        links.length
      );
      // holds maximum links that do not benefit from ellipsis
      const pagesShownWithoutEllipsis = showPagesAhead * 4 + 3; // begin1+ellipsis+ before current page2+page itself+aftercurrentpage3+ellipsis+end4
      // holds maximum distance that page is from start or end so ellipsis is not needed
      const noEllipseBeforeOrAfterCurrentPage = showPagesAhead * 2 + 2;

      // case [1,2,3,4,5,currentpage,7,8,9 .. 45,46,47]
      // ellepsis right of current page
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
              {this.renderLinks(["..."], page)}
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
        // case [1,2,3, .. 45,46,47,currentpage,48,49,50]
        // ellepsis left of current page
        return (
          <div>
            <div className={styles.PaginationBar}>
              {this.renderLinks(linksStart, page, loadRastersOnPage)}
              {this.renderLinks(["..."], page)}
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
        //case [1,2,3..19,20,21,currentpage,23,24,25..45,46,47]
        // ellepsis both sides of current page
        return (
          <div>
            <div className={styles.PaginationBar}>
              {this.renderLinks(linksStart, page, loadRastersOnPage)}
              {this.renderLinks(["..."], page)}
              {this.renderLinks(linksCenter, page, loadRastersOnPage)}
              {this.renderLinks(["..."], page)}
              {this.renderLinks(linkEnd, page, loadRastersOnPage)}
            </div>
            <div className={styles.NavigatorBar}>
              {this.renderNavigator(links, page, loadRastersOnPage)}
            </div>
          </div>
        );
      } else {
        // case [1,2,3,4,currentpage,6,7,8]
        // no ellipsis needed for so few pages
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
