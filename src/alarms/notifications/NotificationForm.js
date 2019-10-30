
import React, { Component } from "react";

import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import ErrorOverlay from "./ErrorOverlay.js";

import ManagementForm from "../../forms/ManagementForm";
import TextInput from "../../forms/TextInput";
import { minLength, required } from "../../forms/validators";
import SelectBox from "../../forms/SelectBox";
import TimeseriesSelection, { timeseriesChosen } from "../../forms/TimeseriesSelection";
import ThresholdsSelection from "../../forms/ThresholdsSelection";
import Snoozing from "../../forms/Snoozing";
import Recipients, { recipeintsValidator } from "../../forms/Recipients";
import RelativeField, { durationValidator, fromISOValue, relativeEndValidator } from "../../forms/RelativeField";
import RasterPointSelection, { rasterAndPointChosen } from "../../forms/RasterPointSelection";
import { toISOValue, rasterIntervalStringServerToDurationObject } from "../../utils/isoUtils";
import { convertNegativeDuration, convertDurationObjToSeconds } from "../../utils/dateUtils";

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
      relativeStartSelection,
      relativeStart,
      relativeEndSelection,
      relativeEnd,
      thresholds,
      snoozing,
      recipients
    } = validatedData;

    // Convert relative start and relative end in format of 'P1DT10H20M50S'
    // to an object and then calculate them in seconds
    // Send values of relative start and relative end in seconds in the API request

    let relativeStartInSeconds;
    let relativeEndInSeconds;

    if (relativeStart) {
      const durationObject = fromISOValue(relativeStart);
      relativeStartInSeconds = convertDurationObjToSeconds(durationObject);

      if (relativeStartSelection === "Before") relativeStartInSeconds = -relativeStartInSeconds 
    } else {
      relativeStartInSeconds = null;
    };

    if (relativeEnd) {
      const durationObject = fromISOValue(relativeEnd);
      relativeEndInSeconds = convertDurationObjToSeconds(durationObject);

      if (relativeEndSelection === "Before") relativeEndInSeconds = -relativeEndInSeconds 
    } else {
      relativeEndInSeconds = null;
    };

    let url = "";
    let body = {
      name: notificationName,
      active: true,
      organisation: this.props.selectedOrganisation.uuid,
      relative_start: relativeStartInSeconds,
      relative_end: relativeEndInSeconds,
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
          this.setState({ createdNotification: parsedBody });
        });
    } else {
      const opts = {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      };
      const alarmUuid = this.props.match.params.id;
      fetch(url + alarmUuid + "/", opts)
        .then(responseParsed => {
          console.log("responseParsed put", responseParsed);
          this.handleResponse(responseParsed);
          return responseParsed.json();
        })
        .then(parsedBody => {
          console.log("parsedBody", parsedBody);
          this.setState({ createdNotification: parsedBody });
        });
    };
  };

  updateUrlToUuid = (url) => {
    if (url.includes("/api/v4/rasters/")) {
      const uuid = url.replace(
        "https://nxt3.staging.lizard.net/api/v4/rasters/" ||
        "https://demo.lizard.net/api/v4/rasters/",
        ""
      );
      return uuid.replace("/", "")
    };
    if (url.includes("/api/v4/messages/")) {
      const id = url.replace(
        "https://nxt3.staging.lizard.net/api/v4/messages/" ||
        "https://demo.lizard.net/api/v4/messages/",
        ""
      );
      return parseFloat(id.replace("/", ""))
    };
    if (url.includes("/api/v4/contactgroups/")) {
      const id = url.replace(
        "https://nxt3.staging.lizard.net/api/v4/contactgroups/" ||
        "https://demo.lizard.net/api/v4/contactgroups/",
        ""
      );
      return parseFloat(id.replace("/", ""))
    };
  }

  render() {
    const { currentNotification, intl } = this.props;

    //Format message for placeholder in the input form for translation
    const placeholderNotificationName = intl.formatMessage({ id: "notifications_app.name_of_alarm" })

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
            title={<FormattedMessage id="notifications_app.name_of_alarm" />}
            subtitle={<FormattedMessage id="notifications_app.name_of_alarm" />}
            placeholder={placeholderNotificationName}
            validators={[minLength(1)]}
            initial={currentNotification && currentNotification.name}
          />
          <SelectBox
            name="typeSelection"
            title={<FormattedMessage id="notifications_app.source_type_selection" />}
            subtitle={<FormattedMessage id="notifications_app.which_data_type" />}
            choices={[
              [
                "Rasters",
                "Rasters",
                <FormattedMessage id="notifications_app.raster_alarm_selection" />
              ],
              [
                "Timeseries",
                "Timeseries",
                <FormattedMessage id="notifications_app.timeseries_alarm_selection" />
              ]
            ]}
            validators={[required("Please select a data type for the alarm.")]}
            showSearchField={false}
            initial={
              (
                currentNotification &&
                (currentNotification.raster ? "Rasters" : "Timeseries")
              ) || "Rasters"
            }
          />
          <RasterPointSelection
            name="rasterSelection"
            title={<FormattedMessage id="notifications_app.raster_selection" />}
            validators={[rasterAndPointChosen]}
            disabled={(formValues) => formValues.typeSelection === "Timeseries"}
            initial={
              (
                currentNotification &&
                currentNotification.raster &&
                currentNotification.geometry && {
                  raster: this.updateUrlToUuid(currentNotification.raster),
                  point: {
                    lat: currentNotification.geometry.coordinates[1],
                    lon: currentNotification.geometry.coordinates[0]
                  }
                }
              ) || null
            }
          />
          <TimeseriesSelection
            name="timeseriesSelection"
            title={<FormattedMessage id="notifications_app.timeseries_selection" />}
            subtitle={<FormattedMessage id="notifications_app.select_timeserie_via_asset" />}
            validators={[timeseriesChosen]}
            disabled={(formValues) => formValues.typeSelection === "Rasters"}
            initial={
              (
                currentNotification &&
                currentNotification.timeseries
              ) || null
            }
          />
          <SelectBox
            name="relativeStartSelection"
            title={<FormattedMessage id="notifications_app.relative_start_selection" />}
            subtitle={<FormattedMessage id="notifications_app.relative_start_selection_subtitle" />}
            choices={[
              [
                "Before",
                "Before",
                <FormattedMessage id="notifications_app.relative_start_before" />
              ],
              [
                "After",
                "After",
                <FormattedMessage id="notifications_app.relative_start_after" />
              ]
            ]}
            validators={[required("Please select an option.")]}
            showSearchField={false}
            initial={
              (
                currentNotification &&
                currentNotification.relative_start &&
                currentNotification.relative_start.includes("-") &&
                "Before"
              ) || "After"
            }
          />
          <RelativeField
            name="relativeStart"
            title={<FormattedMessage id="notifications_app.relative_start" />}
            subtitle={<FormattedMessage id="notifications_app.relative_start_subtitle" />}
            validators={[durationValidator()]}
            initial={
              (
                currentNotification &&
                currentNotification.relative_start &&
                convertNegativeDuration(toISOValue(rasterIntervalStringServerToDurationObject(currentNotification.relative_start)))
              ) || null
            }
          />
          <SelectBox
            name="relativeEndSelection"
            title={<FormattedMessage id="notifications_app.relative_end_selection" />}
            subtitle={<FormattedMessage id="notifications_app.relative_end_selection_subtitle" />}
            choices={[
              [
                "Before",
                "Before",
                <FormattedMessage id="notifications_app.relative_end_before" />
              ],
              [
                "After",
                "After",
                <FormattedMessage id="notifications_app.relative_end_after" />
              ]
            ]}
            validators={[required("Please select an option.")]}
            showSearchField={false}
            initial={
              (
                currentNotification &&
                currentNotification.relative_end &&
                currentNotification.relative_end.includes("-") &&
                "Before"
              ) || "After"
            }
          />
          <RelativeField
            name="relativeEnd"
            title={<FormattedMessage id="notifications_app.relative_end" />}
            subtitle={<FormattedMessage id="notifications_app.relative_end_subtitle" />}
            validators={[
              durationValidator(),
              (fieldValue, formValues) => relativeEndValidator(fieldValue, formValues)
            ]}
            initial={
              (
                currentNotification &&
                currentNotification.relative_end &&
                convertNegativeDuration(toISOValue(rasterIntervalStringServerToDurationObject(currentNotification.relative_end)))
              ) || null
            }
          />
          <ThresholdsSelection
            name="thresholds"
            title={<FormattedMessage id="notifications_app.newnotification_thresholds" />}
            subtitle={<FormattedMessage id="notifications_app.this_alarm_will_be_triggered" />}
            initial={
              (
                currentNotification &&
                {
                  comparison: currentNotification.comparison,
                  thresholds: currentNotification.thresholds
                }
              ) || {
                comparison: ">",
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
                {
                  snooze_sign_on: currentNotification.snooze_sign_on,
                  snooze_sign_off: currentNotification.snooze_sign_off
                }
              ) || {
                snooze_sign_on: 1,
                snooze_sign_off: 1
              }
            }
          />
          <Recipients
            name="recipients"
            title={<FormattedMessage id="notifications_app.recipients" />}
            subtitle={<FormattedMessage id="notifications_app.when_an_alarm_is_triggered" />}
            selectedOrganisation={this.props.selectedOrganisation}
            validators={[recipeintsValidator]}
            initial={
              (
                currentNotification &&
                {
                  messages: currentNotification.messages
                    .map(message => {
                      return {
                        messageId: this.updateUrlToUuid(message.message),
                        groupId: this.updateUrlToUuid(message.contact_group)
                      }
                    })
                }
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
