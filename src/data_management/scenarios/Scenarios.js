import React, { Component } from 'react';
import MDSpinner from "react-md-spinner";
import { Scrollbars } from "react-custom-scrollbars";
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

        if (this.state.isFetching) return <h1>Loading</h1>

        const scenarios = this.state.scenarios;

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
                    <div className={scenartioStyle.tableRow} key={scenario.uuid}>
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
                            {/*Get the Date in local format of DD/MM/YYYY*/}
                            {new Date(scenario.created).toLocaleDateString()}
                        </div>
                        <div className={scenartioStyle.tableSize}>
                            {/*Convert bytes to Gb with [gb = bytes/(1024^3)] and round it to 2 decimal point*/}
                            {Math.round(scenario.total_size / Math.pow(1024, 3) * 100) / 100} Gb
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
                            <span className={scenartioStyle.TotalStorage}>Total storage</span><br/>
                            <span className={scenartioStyle.TotalNumber}>20.1</span>
                            <span className={scenartioStyle.Gb}>Gb</span>
                        </div>
                    </div>
                </div>
                <div className={scenartioStyle.Main}>
                    <div className={scenartioStyle.Search}>
                        <SearchBox />
                    </div>
                    <div className={scenartioStyle.Table}>
                        {scenarioTableHeader()}
                        <Scrollbars
                            autoHeight
                            autoHeightMin={500}
                            autoHeightMax={500}
                            style={{ width: "100%" }}
                        >
                            {scenarioTableBody(scenarios)}
                        </Scrollbars>
                    </div>
                    <div className={scenartioStyle.Footer}>
                        <div className={scenartioStyle.Pagination}>
                            <PaginationBar 
                                page={3}
                                pages={5}
                            />
                        </div>
                        <button 
                            className={`${scenartioStyle.DeleteButton} ${buttonStyles.Button} ${buttonStyles.Danger}`}
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