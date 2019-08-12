import React, { Component } from 'react';
import MDSpinner from "react-md-spinner";
import { Scrollbars } from "react-custom-scrollbars";
import { FormattedMessage, injectIntl } from "react-intl";
import SearchBox from "../../components/SearchBox";
import PaginationBar from "./../rasters/PaginationBar";
import buttonStyles from "../../styles/Buttons.css";
import scenartioStyle from './Scenarios.css';

class Scenarios extends Component {
    state = {
        isFetching: true,
        scenarios: []
    };

    getScenariosFromApi = () => {
        const url = "/api/v3/scenarios";

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
                    isFetching: false
                });
            });
    };

    componentDidMount() {
        this.getScenariosFromApi();
    };

    render() {
        const scenarios = this.state.scenarios;

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
                    <div className={scenartioStyle.tableScenario}>
                        <FormattedMessage id="scenario.scenario" defaultMessage="Scenario" />
                    </div>
                    <div className={scenartioStyle.tableModel}>
                        <FormattedMessage id="scenario.model" defaultMessage="Model" />
                    </div>
                    <div className={scenartioStyle.tableUser}>
                        <FormattedMessage id="scenario.user" defaultMessage="User" />
                    </div>
                    <div className={scenartioStyle.tableDate}>
                        <FormattedMessage id="scenario.date" defaultMessage="Date" />
                    </div>
                    <div className={scenartioStyle.tableSize}>
                        <FormattedMessage id="scenario.size" defaultMessage="Size" />
                    </div>
                </div>
            );
        };

        const scenarioTableBody = (scenarios) => {
            return scenarios.map(scenario =>
                (
                    <div
                        className={scenartioStyle.tableRow} key={scenario.uuid}
                        style={{ visibility: this.state.isFetching ? "hidden" : "visible" }}
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
                            <span className={scenartioStyle.TotalStorage}>
                                <FormattedMessage id="scenario.total_storage" defaultMessage="Total Storage" />
                            </span>
                            <br />
                            <span className={scenartioStyle.TotalNumber}>20.1</span>
                            <span className={scenartioStyle.Gb}>Gb</span>
                        </div>
                    </div>
                </div>
                <div className={scenartioStyle.Main}>
                    <div className={scenartioStyle.Search}>
                        <SearchBox />
                    </div>
                    <Scrollbars
                        autoHeight
                        autoHeightMin={551}
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
                                page={3}
                                pages={5}
                            />
                        </div>
                        <button
                            className={`${scenartioStyle.DeleteButton} ${buttonStyles.Button} ${buttonStyles.Inactive}`}
                            style={{ maxHeight: "36px" }}
                        >
                            <FormattedMessage id="scenario.delete_scenario" defaultMessage="Delete Selection" />
                        </button>
                    </div>
                </div>
            </div>
        )
    };
};

export { Scenarios };