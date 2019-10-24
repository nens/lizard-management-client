
import React, { Component } from "react";

import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import ErrorOverlay from "../../data_management/rasters/ErrorOverlay.js";

import ManagementForm from "../../forms/ManagementForm";
import TextInput from "../../forms/TextInput";
import { minLength, required } from "../../forms/validators";
import SelectBox from "../../forms/SelectBox";
import TimeseriesSelection from "../../forms/TimeseriesSelection";
import ThresholdsSelection from "../../forms/ThresholdsSelection";
import Snoozing from "../../forms/Snoozing";
import Recipients from "../../forms/Recipients";
import DurationField, { durationValidator } from "../../forms/DurationField";

class NotificationFormModel extends Component {
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
          <SelectBox
            name="typeSelection"
            title="Source type selection"
            subtitle="Which data type is the alarm for?"
            choices={[
                [
                    "Rasters",
                    "Rasters",
                    "Put an alarm on raster data"
                ],
                [
                    "Timeseries",
                    "Timeseries",
                    "Put an alarm on Timeseries data"
                ]
            ]}
            validators={[required("Please select a data type for the alarm.")]}
            showSearchField={false}
            initial={
                (
                    currentNotification &&
                    currentNotification.sourceType &&
                    currentNotification.sourceType.display
                ) || "Rasters"
            }
          />
          <TextInput
          name="rasterSelection"
          title="Raster selection"
          />
          <TimeseriesSelection
            name="timeseriesSelection"
            title="Timeseries selection"
            subtitle="Select timeseries via asset"
          />
          <DurationField
            name="relativeStart"
            title="Relative start"
            subtitle="Optional: Select the relative start of the simulation period"
            validators={[durationValidator()]}
          />
          <DurationField
            name="relativeEnd"
            title="Relative end"
            subtitle="Optional: Select the relative end of the simulation period"
            validators={[durationValidator()]}
          />
          <ThresholdsSelection
            name="thresholds"
            title="Alarm thresholds"
            subtitle="The alarm will be triggered whenever a threshold is exceeded."
          />
          <Snoozing
            name="snoozing"
            title="Snoozing"
          />
          <Recipients
            name="recipients"
            title="Recipients"
            subtitle="When an alarm is triggered, these groups of recipients will be notified."
            selectedOrganisation={this.props.selectedOrganisation}
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

const NotificationForm = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(NotificationFormModel))
);

export { NotificationForm };
