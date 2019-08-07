import React, {Component} from 'react';

class Scenarios extends Component {
    state = {
        isFetching: false,
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
        return <h1>3Di Scenariosssssssssssssssss</h1>
    };
};

export { Scenarios };