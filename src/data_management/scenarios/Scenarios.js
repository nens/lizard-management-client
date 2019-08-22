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
        checkboxes: []
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

    fetchScenarioUuidsWithOptions(uuids, fetchOptions) {
        const url = "/api/v3/scenarios/"
        //Array to store all fetches to later resolve all promises
        const fetches = uuids.map(scenarioUuid => {
            return (fetch(url + scenarioUuid + "/", fetchOptions));
        });
        Promise.all(fetches).then(values => {
            //Refresh the page so that the removed scenarios are no longer visible
            this.fetchScenariosFromApi(
                this.state.page,
                this.state.searchTerms
            );
        });
    };

    updatePageAndFetchScenariosFromApi(page, searchedTerms) {
        this.setState(
            {
                page: page
            },
            this.fetchScenariosFromApi(
                page,
                searchedTerms
            )
        );
    }

    handleUpdatePage(page) {
        this.setState({
            page: page,
            checkboxes: []
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

    handleClickOnCheckbox = (scenarioUuid) => {
        //Check if the scenario has already been selected or not
        const selectedUuid = this.state.checkboxes.filter(id => id === scenarioUuid)

        //If not yet selected then add this new uuid into the basket
        if (selectedUuid.length === 0) {
            this.setState({
                checkboxes: [...this.state.checkboxes, scenarioUuid]
            });
        } else {
            //If already selected then remove this uuid from the basket
            this.setState({
                checkboxes: this.state.checkboxes.filter(id => id !== scenarioUuid)
            });
        };
    };

    handleAllCheckboxes = (scenarios) => {
        if (this.state.checkboxes.length < scenarios.length) {
            this.setState({
                checkboxes: scenarios.map(scenario => scenario.uuid)
            })
        } else {
            this.setState({
                checkboxes: []
            })
        };
    }

    handleDeleteScenario(scenarios) {
        if (
            window.confirm(
                "Are you sure you want to delete the next scenario(s)? \n  \n "
                +
                this.state.checkboxes.map(uuid => scenarios
                    .filter(scenario => scenario.uuid === uuid)
                    .map(scenario => scenario.name)
                ).join(" \n")
            )
        ) {
            const checkedUuids = this.state.checkboxes;
            const opts = {
                //Not permanently deleted, this will be implemented in backend
                credentials: "same-origin",
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            };
            this.fetchScenarioUuidsWithOptions(checkedUuids, opts);
            //Remove all items from the checkboxes after the deletion
            this.setState({
                checkboxes: []
            });
        };
    };

    componentDidMount() {
        this.fetchScenariosFromApi(
            this.state.page,
            this.state.searchTerms
        );
    };

    componentWillUpdate(nextProps, nextState) {
        if (nextState.searchedTerms !== this.state.searchedTerms) {
            this.updatePageAndFetchScenariosFromApi(
                1,
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
        const { scenarios, total, page, pageSize, isFetching, checkboxes } = this.state;

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
                        <input 
                            type="checkbox"
                            onChange={() => this.handleAllCheckboxes(scenarios)}
                            checked={checkboxes.length === scenarios.length ? true : false}
                        />
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
                            <input
                                type="checkbox"
                                onChange={() => this.handleClickOnCheckbox(scenario.uuid)}
                                checked={checkboxes.filter(id => id === scenario.uuid).length === 0 ? false : true}
                                id={scenario.uuid}
                            />
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
                            handleSearchEnter={() => this.handleUpdateSearchedTermsEnter()}
                            handleSearchOnBlur={() => this.handleUpdateSearchedTermsOnBlur()}
                            handleSearchClear={() => this.handleUpdateSearchedTermsClear()}
                            searchTerms={this.state.searchTerms}
                            setSearchTerms={searchTerms => this.handleUpdateSearchTerms(searchTerms)}
                        />
                    </div>
                    <Scrollbars
                        autoHeight
                        autoHeightMin={551}
                        //Hide vertical scrollbar of this component to use the vertical scrollbar of the table body only
                        renderTrackVertical={props => <div {...props} style={{ display: 'none' }} className="track-vertical" />}
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
                                        visibility: isFetching ? "visible" : "hidden"
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
                                loadItemsOnPage={page => this.handleUpdatePage(page)}
                                currentPage={page}
                                totalPages={Math.ceil(total / pageSize)}
                            />
                            <div className={scenartioStyle.numberOfScenarios}>
                                {total} Scenarios
                            </div>
                        </div>
                        <button
                            className={
                                checkboxes.length > 0 ?
                                    `${scenartioStyle.DeleteButton} ${buttonStyles.Button} ${buttonStyles.Danger}`
                                    :
                                    `${scenartioStyle.DeleteButton} ${buttonStyles.Button} ${buttonStyles.Inactive}`
                            }
                            onClick={() => this.handleDeleteScenario(scenarios)}
                            style={{ maxHeight: "36px" }}
                            disabled={checkboxes.length === 0 ? true : false}
                        >
                            Delete {checkboxes.length === 0 ? null : `(${checkboxes.length})`}
                        </button>
                    </div>
                </div>
            </div>
        )
    };
};

export { Scenarios };