
import React, { Component } from "react";

import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import ErrorOverlay from "../../data_management/rasters/ErrorOverlay.js";

import ManagementForm from "../../forms/ManagementForm";
import TextInput from "../../forms/TextInput";
import { minLength } from "../../forms/validators";

class NewNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      openOverlay: false,
      modalErrorMessage: "",
      createdNotification: null,
    };
  }

  handleResponse(response) {
    this.setState({
      modalErrorMessage: response,
      isFetching: false,
      handlingDone: true
    });
  }

  onSubmit = (validatedData, currentNotification, alarmType) => {
    this.setState({ isFetching: true, openOverlay: true });

    const url = `/api/v4/${alarmType}`;
  }
  
  render() {
    const position = [52.1858, 5.2677];
    const { currentNotification } = this.props;

    return (
      <div>
        {this.state.openOverlay ? (
          <ErrorOverlay
            isFetching={this.state.isFetching}
            history={this.props.history}
            errorMessage={this.state.modalErrorMessage}
            handleClose={() =>
              this.setState({ handlingDone: false, openOverlay: false })}
            currentNotification={this.props.currentNotification || this.state.createdNotification}
          />
        ) : null}
        <ManagementForm
          wizardStyle={this.props.wizardStyle}
        >
          <TextInput
          name="notificationName"
          title="Name of this alarm"
          subtitle="The name of the raster will be used in e-mail and SMS alerts"
          placeholder="Name of this alarm"
          validators={[minLength(1)]}
          initial={currentNotification && currentNotification.name}
          />
          <TextInput
          name="typeSelection"
          title="Source type selection"
          />
          <TextInput
          name="rasterSelection"
          title="Raster selection"
          />
          <TextInput
          name="timeseriesSelection"
          title="Timeseries selection"
          />
          <TextInput
          name="relativeStart"
          title="Relative start"
          />
          <TextInput
          name="relativeEnd"
          title="Relative end"
          />
          <TextInput
          name="thresholds"
          title="Alarm thresholds"
          />
          <TextInput
          name="snoozing"
          title="Snoozing"
          />
          <TextInput
          name="recipients"
          title="Recipients"
          />
        </ManagementForm>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectedOrganisation: state.organisations.selected,
    organisations: state.organisations,
    bootstrap: state.bootstrap,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

const App = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(NewNotification))
);

export { App };
