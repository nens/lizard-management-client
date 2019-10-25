
import React, { Component } from "react";

import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";
import ErrorOverlay from "../../data_management/rasters/ErrorOverlay.js";

import ManagementForm from "../../forms/ManagementForm";
import TextInput from "../../forms/TextInput";
import { minLength, required } from "../../forms/validators";
import SelectBox from "../../forms/SelectBox";
import TimeseriesSelection, { timeseriesChosen } from "../../forms/TimeseriesSelection";
import ThresholdsSelection from "../../forms/ThresholdsSelection";
import Snoozing from "../../forms/Snoozing";
import Recipients from "../../forms/Recipients";
import RelativeField, { durationValidator } from "../../forms/RelativeField";
import RasterPointSelection, { rasterAndPointChosen } from "../../forms/RasterPointSelection";

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

  onSubmit = (validatedData, currentNotification) => {
    this.setState({ isFetching: true, openOverlay: true });

    const {
      notificationName,
      typeSelection,
      rasterSelection,
      timeseriesSelection,
      relativeStart,
      relativeEnd,
      thresholds,
      snoozing,
      recipients
    } = validatedData;

    let url = "";
    let body = {
      name: notificationName,
      active: true,
      organisation: this.props.selectedOrganisation.uuid,
      relative_start: relativeStart,
      relative_end: relativeEnd,
      comparison: thresholds.comparison,
      thresholds: thresholds.thresholds,
      snooze_sign_on: snoozing.snooze_sign_on,
      snooze_sign_off: snoozing.snooze_sign_off,
      messages: recipients.messages.map(message => {
        return {
          contact_group: message.groupId,
          message: message.messageId
        };
      }),
    };
    if (typeSelection === "Rasters") {
      const { raster, point } = rasterSelection;
      url = "/api/v4/rasteralarms/"
      body.raster = raster;
      body.geometry = {
        type: "Point",
        coordinates: [point.lon, point.lat, 0.0]
      }
    } else {
      url = "/api/v4/timeseriesalarms/";
      body.timeseries = timeseriesSelection;
    }

    if (!currentNotification) {
      const opts = {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };

      fetch(url, opts)
        .then(responseParsed => {
          this.handleResponse(responseParsed);
          return responseParsed.json();
        })
        .then(parsedBody => {
          console.log("parsedBody", parsedBody);
          this.setState({ createdRaster: parsedBody });
        });
    } else {
      const opts = {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      };
      const uuid = typeSelection === "Rasters" ? rasterSelection.raster : timeseriesSelection;

      fetch(url + "uuid:" + uuid + "/", opts)
        .then(responseParsed => {
          console.log("responseParsed put", responseParsed);
          this.handleResponse(responseParsed);
          return responseParsed.json();
        })
        .then(parsedBody => {
          console.log("parsedBody", parsedBody);
          this.setState({ createdRaster: parsedBody });
        });
    };
  };

  render() {
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
          onSubmit={formData => this.onSubmit(formData, currentNotification)}
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
          <RasterPointSelection
            name="rasterSelection"
            title="Raster selection"
            validators={[rasterAndPointChosen]}
            disabled={(formValues) => formValues.typeSelection === "Timeseries"}
          />
          <TimeseriesSelection
            name="timeseriesSelection"
            title="Timeseries selection"
            subtitle="Select timeseries via asset"
            validators={[timeseriesChosen]}
            disabled={(formValues) => formValues.typeSelection === "Rasters"}
          />
          <RelativeField
            name="relativeStart"
            title="Relative start"
            subtitle="Optional: Select the relative start of the simulation period"
            validators={[durationValidator()]}
          />
          <RelativeField
            name="relativeEnd"
            title="Relative end"
            subtitle="Optional: Select the relative end of the simulation period"
            validators={[durationValidator()]}
          />
          <ThresholdsSelection
            name="thresholds"
            title="Alarm thresholds"
            subtitle="The alarm will be triggered whenever a threshold is exceeded."
            initial={
              (
                currentNotification &&
                currentNotification.thresholds
              ) || {
                comparison: null,
                thresholds: []
              }
            }
          />
          <Snoozing
            name="snoozing"
            title="Snoozing"
            initial={
              (
                currentNotification &&
                currentNotification.snoozing
              ) || {
                snooze_sign_on: 1,
                snooze_sign_off: 1
              }
            }
          />
          <Recipients
            name="recipients"
            title="Recipients"
            subtitle="When an alarm is triggered, these groups of recipients will be notified."
            selectedOrganisation={this.props.selectedOrganisation}
            initial={
              (
                currentNotification &&
                currentNotification.recipients
              ) || {
                messages: []
              }
            }
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
