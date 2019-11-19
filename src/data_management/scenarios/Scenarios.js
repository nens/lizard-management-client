import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";
import { Scrollbars } from "react-custom-scrollbars";
import { FormattedMessage } from "react-intl";
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
        ordering: "",
        checkboxes: [],
        usage: 0
    };

    fetchScenariosFromApi = (organisationUUID, page, searchContains, ordering) => {
        const url = `/api/v4/scenarios/?writable=true&page_size=${this.state.pageSize}&organisation__uuid=${organisationUUID}&page=${page}&search=${searchContains}&ordering=${ordering}`;

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
                    total: data.count,
                    checkboxes: []
                });
            });
    };

    fetchScenarioUuidsWithOptions(uuids, fetchOptions) {
        const url = "/api/v4/scenarios/"
        //Array to store all fetches to later resolve all promises
        const fetches = uuids.map(scenarioUuid => {
            return (fetch(url + scenarioUuid + "/", fetchOptions));
        });
        Promise.all(fetches).then(values => {
            //Refresh the page so that the removed scenarios are no longer visible
            this.fetchScenariosFromApi(
                this.props.selectedOrganisation.uuid,
                this.state.page,
                this.state.searchTerms,
                this.state.ordering
            );
            // Update the scenario usage when a scenario is deleted.
            this.fetchScenariosUsageFromAPI(this.props.selectedOrganisation.uuid);
        });
    };

    fetchScenariosUsageFromAPI = (organisationUUID) => {
        const url = `/api/v4/organisations/${organisationUUID}/usage/`;
        fetch(url, {
            credentials: "same-origin"
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                usage: data.scenario_total_size
            });
        });
    };

    updatePageAndFetchScenariosFromApi(organisationUUID, page, searchedTerms, ordering) {
        this.setState(
            {
                page: page
            },
            this.fetchScenariosFromApi(
                organisationUUID,
                page,
                searchedTerms,
                ordering
            )
        );
    }

    handleUpdatePage(page) {
        this.setState({
            page: page
        });
    };
    handleUpdateSearchTerms(searchTerms) {
        this.setState({
            searchTerms: searchTerms
        });
    };
    handleUpdateSearchedTermsEnter() {
        this.setState({
            searchedTerms: this.state.searchTerms
        });
    };
    handleUpdateSearchedTermsOnBlur() {
        this.setState({
            searchedTerms: this.state.searchTerms
        });
    };
    handleUpdateSearchedTermsClear() {
        this.setState({
            searchTerms: "",
            searchedTerms: ""
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

    handleOrdering(orderingName) {
        if (orderingName !== this.state.ordering) {
            this.setState({
                ordering: orderingName
            });
        } else {
            this.setState({
                ordering: `-${orderingName}`
            });
        };
    };

    componentDidMount() {
        this.fetchScenariosFromApi(
            this.props.selectedOrganisation.uuid,
            this.state.page,
            this.state.searchTerms,
            this.state.ordering
        );
        this.fetchScenariosUsageFromAPI(this.props.selectedOrganisation.uuid);
    };

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.selectedOrganisation.uuid !== this.props.selectedOrganisation.uuid) {
            this.updatePageAndFetchScenariosFromApi(
                nextProps.selectedOrganisation.uuid,
                1,
                this.state.searchTerms,
                this.state.ordering
            );
            this.fetchScenariosUsageFromAPI(nextProps.selectedOrganisation.uuid);
        };
        if (nextState.searchedTerms !== this.state.searchedTerms) {
            this.updatePageAndFetchScenariosFromApi(
                this.props.selectedOrganisation.uuid,
                1,
                nextState.searchedTerms,
                this.state.ordering
            );
        } else if (nextState.ordering !== this.state.ordering) {
            this.updatePageAndFetchScenariosFromApi(
                this.props.selectedOrganisation.uuid,
                1,
                this.state.searchTerms,
                nextState.ordering
            );
        } else if (nextState.page !== this.state.page) {
            this.fetchScenariosFromApi(
                this.props.selectedOrganisation.uuid,
                nextState.page,
                this.state.searchedTerms,
                this.state.ordering
            );
        };
    };

    render() {
        const { scenarios, total, page, pageSize, isFetching, checkboxes, usage } = this.state;

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
                            checked={(checkboxes.length === scenarios.length && checkboxes.length !== 0) ? true : false}
                        />
                    </div>
                    <div className={scenartioStyle.tableScenario}>
                        <FormattedMessage id="scenario.scenario" defaultMessage="Scenario" />
                        <i className="fa fa-sort" onClick={() => this.handleOrdering("name")} />
                    </div>
                    <div className={scenartioStyle.tableModel}>
                        <FormattedMessage id="scenario.model" defaultMessage="Model" />
                        <i className="fa fa-sort" onClick={() => this.handleOrdering("model_name")} />
                    </div>
                    <div className={scenartioStyle.tableUser}>
                        <FormattedMessage id="scenario.user" defaultMessage="User" />
                        <i className="fa fa-sort" onClick={() => this.handleOrdering("username")} />
                    </div>
                    <div className={scenartioStyle.tableDate}>
                        <FormattedMessage id="scenario.date" defaultMessage="Date" />
                        <i className="fa fa-sort" onClick={() => this.handleOrdering("created")} />
                    </div>
                    <div className={scenartioStyle.tableSize}>
                        <FormattedMessage id="scenario.size" defaultMessage="Size" />
                        <i className="fa fa-sort" onClick={() => this.handleOrdering("total_size")} />
                    </div>
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
                            <span className={scenartioStyle.TotalStorage}>
                                <FormattedMessage id="scenario.total_storage" defaultMessage="Total Storage" />
                            </span>
                            <br />
                            <span className={scenartioStyle.TotalNumber}>{convertBytesToGb(usage)}</span>
                            <span className={scenartioStyle.Gb}> Gb</span>
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
                                {Math.ceil(total / pageSize)} Pages ({total} Scenarios) 
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
                            <FormattedMessage 
                                id="scenario.delete_scenario" 
                                defaultMessage={
                                    checkboxes.length === 0 
                                    ? "Delete" 
                                    : `Delete ({clickedCheckboxes, number})`
                                }
                                values={{
                                    clickedCheckboxes: checkboxes.length
                                }}
                            />
                        </button>
                    </div>
                </div>
            </div>
        )
    };
};

const mapStateToProps = (state) => ({
    selectedOrganisation: state.organisations.selected,
});

Scenarios = withRouter(connect(mapStateToProps)(Scenarios));

export { Scenarios };