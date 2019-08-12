import React, { Component } from 'react';
import MDSpinner from "react-md-spinner";
import { Scrollbars } from "react-custom-scrollbars";
import SearchBox from "../../components/SearchBox";
import PaginationBar from "./PaginationBar";
import buttonStyles from "../../styles/Buttons.css";
import scenartioStyle from './Scenarios.css';

class Scenarios extends Component {
    state = {
        isFetching: true,
        scenarios: [],
        total: 0,
        page: 1,
        pageSize: 10,
        searchTerms: "",
        searchedTerms: "",
    };

    fetchScenariosFromApi = (page, searchContains) => {
        const url = `/api/v3/scenarios/?writable=true&page_size=${this.state.pageSize}&page=${page}&name__icontains=${searchContains}`;

        this.setState({
            isFetching: true
        });

        fetch(url, {
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    scenarios: data.results,
                    isFetching: false,
                    total: data.count
                });
            });
    };

    handleUpdatePage(page) {
        this.setState({
            page: page
        });
    };
    handleUpdateSearchTerms(searchTerms) {
        this.setState({
            searchTerms: searchTerms,
            // page: 1 // Reset PaginationBar to page 1
        });
    };
    handleUpdateSearchedTermsEnter() {
        this.setState({
            searchedTerms: this.state.searchTerms,
            page: 1 // Reset PaginationBar to page 1
        });
    };
    handleUpdateSearchedTermsOnBlur() {
        this.setState({
            searchedTerms: this.state.searchTerms,
            // page: 1 // Reset PaginationBar to page 1
        });
    };
    handleUpdateSearchedTermsClear() {
        this.setState({
            searchTerms: "",
            searchedTerms: "",
            page: 1 // Reset PaginationBar to page 1
        });
    };

    componentDidMount() {
        this.fetchScenariosFromApi(
            this.state.page,
            this.state.searchTerms
        );
    };

    componentWillUpdate(nextProps, nextState) {
        if (nextState.searchedTerms !== this.state.searchedTerms) {
            this.handleUpdatePage(1);
            this.fetchScenariosFromApi(
                this.state.page,
                nextState.searchedTerms
            );
        } else if (nextState.page !== this.state.page) {
            this.fetchScenariosFromApi(
                nextState.page,
                this.state.searchedTerms
            );
        };
    };

    render() {
        const { scenarios, total, page, pageSize, isFetching } = this.state;

        //Method to convert UTC string to local date format of DD/MM/YYYY
        const convertUTCtoDate = (utc) => {
            return new Date(utc).toLocaleDateString();
        };

        //Method to convert bytes to Gb with [Gb = bytes/(1024^3)]
        const convertBytesToGb = (b) => {
            //Covert to Gb and round it to 2 decimal points
            return (Math.round(b / Math.pow(1024, 3) * 100) / 100);
        };

        const scenarioTableHeader = () => {
            return (
                <div className={scenartioStyle.tableHeader}>
                    <div className={scenartioStyle.tableCheckbox}>
                        <input type="checkbox" />
                    </div>
                    <div className={scenartioStyle.tableScenario}>Scenario</div>
                    <div className={scenartioStyle.tableModel}>Model</div>
                    <div className={scenartioStyle.tableUser}>User</div>
                    <div className={scenartioStyle.tableDate}>Date</div>
                    <div className={scenartioStyle.tableSize}>Size</div>
                </div>
            );
        };

        const scenarioTableBody = (scenarios) => {
            return scenarios.map(scenario =>
                (
                    <div
                        className={scenartioStyle.tableRow} key={scenario.uuid}
                        style={{ visibility: isFetching ? "hidden" : "visible" }}
                    >
                        <div className={scenartioStyle.tableCheckbox}>
                            <input type="checkbox" />
                        </div>
                        <div className={scenartioStyle.tableScenario}>
                            {scenario.name}
                        </div>
                        <div className={scenartioStyle.tableModel}>
                            {scenario.model_name}
                        </div>
                        <div className={scenartioStyle.tableUser}>
                            {scenario.username}
                        </div>
                        <div className={scenartioStyle.tableDate}>
                            {convertUTCtoDate(scenario.created)}
                        </div>
                        <div className={scenartioStyle.tableSize}>
                            {convertBytesToGb(scenario.total_size)} Gb
                        </div>
                    </div>
                )
            );
        };

        return (
            <div className={scenartioStyle.Layout}>
                <div className={scenartioStyle.SideBar}>
                    <div className={scenartioStyle.Sum}>
                        <img
                            className={scenartioStyle.DatabaseIcon}
                            src={require("../../images/database.svg")}
                            alt="database"
                        />
                        <div className={scenartioStyle.SumText}>
                            <span className={scenartioStyle.TotalStorage}>Total storage</span><br />
                            <span className={scenartioStyle.TotalNumber}>20.1</span>
                            <span className={scenartioStyle.Gb}>Gb</span>
                        </div>
                    </div>
                </div>
                <div className={scenartioStyle.Main}>
                    <div className={scenartioStyle.Search}>
                        <SearchBox
                            handleSearchEnter={searchTerms => {
                                this.handleUpdateSearchedTermsEnter();
                            }}
                            handleSearchOnBlur={searchTerms => {
                                this.handleUpdateSearchedTermsOnBlur();
                            }}
                            handleSearchClear={searchTerms => {
                                this.handleUpdateSearchedTermsClear();
                            }}
                            searchTerms={this.state.searchTerms}
                            setSearchTerms={searchTerms => {
                                this.handleUpdateSearchTerms(searchTerms);
                            }}
                        />
                    </div>
                    <Scrollbars
                        autoHeight
                        autoHeightMin={551}
                        //Hide vertical scrollbar of this component to use the vertical scrollbar of the table body only
                        renderTrackVertical={props => <div {...props} style={{display: 'none'}} className="track-vertical"/>}
                    >
                        <div className={scenartioStyle.Table}>
                            {scenarioTableHeader()}
                            <Scrollbars
                                autoHeight
                                autoHeightMin={500}
                                autoHeightMax={500}
                                style={{ minWidth: "500px" }}
                            >
                                {scenarioTableBody(scenarios)}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "45%",
                                        left: "45%",
                                        visibility: this.state.isFetching ? "visible" : "hidden"
                                    }}
                                >
                                    <MDSpinner />
                                </div>
                            </Scrollbars>
                        </div>
                    </Scrollbars>
                    <div className={scenartioStyle.Footer}>
                        <div className={scenartioStyle.Pagination}>
                            <PaginationBar
                                loadScenariosOnPage={page => this.handleUpdatePage(page)}
                                page={page}
                                pages={Math.ceil(total / pageSize)}
                            />
                        </div>
                        <button
                            className={`${scenartioStyle.DeleteButton} ${buttonStyles.Button} ${buttonStyles.Inactive}`}
                            style={{ maxHeight: "36px" }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )
    };
};

export { Scenarios };