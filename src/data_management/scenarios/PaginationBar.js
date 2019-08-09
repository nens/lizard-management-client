import React, { Component } from 'react';
import styles from "./PaginationBar.css";
import buttonStyles from "../../styles/Buttons.css";

class PaginationBar extends Component {
    state = {
        inputPage: ""
    };

    componentDidMount() {
        //On startup keep state in sync with props
        this.setState({
            inputPage: this.props.page
        });
    };

    componentWillReceiveProps(newProps) {
        //if page changes from parent then update inputPage
        if (
            newProps.page !== this.props.page &&
            this.state.inputPage + "" !== newProps.page + ""
        ) {
            this.setState({
                inputPage: newProps.page
            });
        };
    };

    // render all the page numbers of the list of links
    // par=loadRastersOnPage is optional
    renderLinks(links, page, loadScenariosOnPage) {
        return links.map(link => {
            if (page === link) {
                return <div key={link}>{link}</div>
            } else if (link === "...") {
                return <div key={link}>{link}</div>
            } else {
                return (
                    <div
                        style={{ cursor: "pointer", color: "#007bff" }}
                        key={link}
                        onClick={() => {
                            loadScenariosOnPage && loadScenariosOnPage(link);
                        }}
                    >
                        <button
                            className={buttonStyles.ButtonLink}
                        >
                            {link}
                        </button>
                    </div>
                );
            };
        });
    };

    // input field to fill in desired page
    renderNavigator(links, page, loadScenariosOnPage) {
        const navigatorInError = !(
            parseInt(this.state.inputPage, 10) > 0 &&
            parseInt(this.state.inputPage, 10) <= links.length
        );

        return (
            <div>
                <span>Page: </span>
                <input
                    className={
                        styles.FormControl +
                        " " +
                        (navigatorInError ? styles.FormControlError : "")
                    }
                    value={this.state.inputPage}
                    onChange={e => {
                        // navigates to page
                        const value = e.target.value;
                        this.setState({ inputPage: value });
                        // only navigate if page is valid
                        if (
                            parseInt(value, 10) > 0 &&
                            parseInt(value, 10) <= links.length
                        ) {
                            loadScenariosOnPage(parseInt(value, 10));
                        }
                    }}
                    maxLength={(links.length + "").length}
                    size={(links.length + "").length}
                />
                <span> of {links.length}</span>
            </div>
        );
    }

    render() {
        const { pages, page, loadScenariosOnPage } = this.props;

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
            // linksEnd = [29,30,31,32] given that links.length =32
            const linksEnd = links.slice(-showPagesAhead);
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
                                loadScenariosOnPage
                            )}
                            {this.renderLinks(["..."], page)}
                            {this.renderLinks(linksEnd, page, loadScenariosOnPage)}
                        </div>
                        <div className={styles.NavigatorBar}>
                            {this.renderNavigator(links, page, loadScenariosOnPage)}
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
                            {this.renderLinks(linksStart, page, loadScenariosOnPage)}
                            {this.renderLinks(["..."], page)}
                            {this.renderLinks(
                                linksFromCurrentPageToEnd,
                                page,
                                loadScenariosOnPage
                            )}
                        </div>
                        <div className={styles.NavigatorBar}>
                            {this.renderNavigator(links, page, loadScenariosOnPage)}
                        </div>
                    </div>
                );
            } else if (links.length > pagesShownWithoutEllipsis) {
                //case [1,2,3..19,20,21,currentpage,23,24,25..45,46,47]
                // ellepsis both sides of current page
                return (
                    <div>
                        <div className={styles.PaginationBar}>
                            {this.renderLinks(linksStart, page, loadScenariosOnPage)}
                            {this.renderLinks(["..."], page)}
                            {this.renderLinks(linksCenter, page, loadScenariosOnPage)}
                            {this.renderLinks(["..."], page)}
                            {this.renderLinks(linksEnd, page, loadScenariosOnPage)}
                        </div>
                        <div className={styles.NavigatorBar}>
                            {this.renderNavigator(links, page, loadScenariosOnPage)}
                        </div>
                    </div>
                );
            } else {
                // case [1,2,3,4,currentpage,6,7,8]
                // no ellipsis needed for so few pages
                return (
                    <div>
                        <div className={styles.PaginationBar}>
                            {this.renderLinks(links, page, loadScenariosOnPage)}
                        </div>
                        <div className={styles.NavigatorBar}>
                            {this.renderNavigator(links, page, loadScenariosOnPage)}
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