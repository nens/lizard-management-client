import React, { Component } from "react";
import styles from "./PaginationBar.css";

class PaginationBar extends Component {
    state = {
        inputPage: ""
    }

    componentDidMount() {
        //On startup keep state in sync with props
        this.setState({
            inputPage: this.props.page
        });
    }

    componentWillReceiveProps(newProps) {
        //if page changes from parent then update inputPage
        if (
            newProps.currentPage !== this.props.currentPage &&
            this.state.inputPage + "" !== newProps.currentPage + ""
        ) {
            this.setState({
                inputPage: newProps.currentPage
            });
        };
    }

    render() {
        const { currentPage, totalPages, loadItemsOnPage } = this.props;

        if (!currentPage && !totalPages) {
            return null;
        };

        //number of pages displayed in the pagination bar stored in an array with 5 pages
        const paginatedPages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];

        return (
            <div className={styles.PaginationContainer}>
                <button
                    onClick={() => loadItemsOnPage(currentPage - 1)}
                    disabled={currentPage > 1 ? false : true}
                    className={styles.PaginationButton}
                    style={{
                        cursor: currentPage > 1 ? "pointer" : "not-allowed"
                    }}
                >
                    &lsaquo;
                </button>
                <div className={styles.NumberContainer}>
                    {paginatedPages.map(page => {
                        if (page > 0 && page <= totalPages) {
                            return (
                                <span
                                    key={page}
                                    onClick={() => loadItemsOnPage(page)}
                                    className={page === currentPage ? `${styles.CurrentPage}` : `${styles.PageNumber}`}
                                >
                                    {page}
                                </span>
                            )
                        }
                        return null;
                    })}
                </div>
                <button
                    onClick={() => loadItemsOnPage(currentPage + 1)}
                    disabled={currentPage < totalPages ? false : true}
                    className={styles.PaginationButton}
                    style={{
                        cursor: currentPage < totalPages ? "pointer" : "not-allowed"
                    }}
                >
                    &rsaquo;
                </button>
            </div>
        )
    }
}

export default PaginationBar;