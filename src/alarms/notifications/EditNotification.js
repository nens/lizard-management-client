import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";

import { NotificationForm } from "./NotificationForm";

// Component's props include match and alarmType
// "match" props comes from react-router-dom and contains
// id of the alarm from the URL
// "alarmType" comes from Redux store and can be "RASTERS" or "TIMESERIES"

class EditNotificationModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentNotification: null
        };
        const { match, alarmType } = props;
        (async () => {
            const url = (alarmType === "RASTERS") ? (
                `/api/v4/rasteralarms/${match.params.id}/`
            ) : (
                `/api/v4/timeseriesalarms/${match.params.id}/`
            )

            const currentNotification = await fetch(url, {
                credentials: "same-origin"
            }).then(response => response.json());

            this.setState({ currentNotification })
        })();
    }

    render() {
        if (
            this.state.currentNotification
        ) {
            return <NotificationForm
                currentNotification={this.state.currentNotification}
                wizardStyle={false}
            />;
        } else {
            return <div
                style={{
                    position: "relative",
                    top: 50,
                    height: 300,
                    bottom: 50,
                    marginLeft: "50%"
                }}
            >
                <MDSpinner size={24} />
            </div>
        }

    }
}

const mapStateToProps = (state) => {
    return {
        alarmType: state.alarmType
    };
};

const App = withRouter(connect(mapStateToProps)(EditNotificationModel));

export { App };
