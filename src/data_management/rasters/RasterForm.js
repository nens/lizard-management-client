import gridStyles from "../../styles/Grid.css";
import buttonStyles from "../../styles/Buttons.css";
import "./NewRaster.css";
import React, { Component } from "react";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import GenericTextInputComponent from "../../components/GenericTextInputComponent";
import GenericSelectBoxComponent from "../../components/GenericSelectBoxComponent";
import GenericCheckBoxComponent from "../../components/GenericCheckBoxComponent";
import ColorMapComponent from "../../components/ColorMapComponent";
import GenericStep from "../../components/GenericStep";
import DurationComponent from "../../components/DurationComponent";
import inputStyles from "../../styles/Input.css";
import {
  calculateNewStyleAndOptions,
  optionsHasLayers,
  getColorMapFromStyle,
  getColorMinFromStyle,
  getColorMaxFromStyle,
  getStyleFromOptions,
  validateStyleObj
} from "../../utils/rasterOptionFunctions";
import ErrorOverlay from "./ErrorOverlay.js";

import SlushBucket from "../../components/SlushBucket";

// ! important, these old component may later be used! Ther corresponding files already exist
// import bindReactFunctions from "../../utils/BindReactFunctions.js"; // currently not working. Probably needs a list with functions in which case this is probably only overcomplicating things
// import GenericWizardStep from "../../components/GenericWizardStep"; // working but is expected to create tons of overhead binding to the right objects functions

class RasterFormModel extends Component {
  constructor(props) {
    super(props);
    if (this.props.currentRaster) {
      this.state = this.currentRasterToState(this.props.currentRaster);
    } else {
      this.state = this.setInitialState(props);
    }

    this.scrollToTop = this.scrollToTop.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.setCurrentStep = this.setCurrentStep.bind(this);
    this.setRasterName = this.setRasterName.bind(this);
    this.resetRasterName = this.resetRasterName.bind(this);
    this.setSelectedOrganisation = this.setSelectedOrganisation.bind(this);
    this.resetSelectedOrganisation = this.resetSelectedOrganisation.bind(this);
    this.setStorePathName = this.setStorePathName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.validateNewRasterName = this.validateNewRasterName.bind(this);
    this.validateNewRasterOrganisation = this.validateNewRasterOrganisation.bind(
      this
    );
    this.validateNewRasterStorePath = this.validateNewRasterStorePath.bind(
      this
    );
    this.validateNewRasterDescription = this.validateNewRasterDescription.bind(
      this
    );
    this.setAggregationType = this.setAggregationType.bind(this);
    this.validateAggregationType = this.validateAggregationType.bind(this);
    this.setObservationType = this.setObservationType.bind(this);
    this.validateObservationType = this.validateObservationType.bind(this);
    this.setStyleAndOptions = this.setStyleAndOptions.bind(this);
    this.setSupplierId = this.setSupplierId.bind(this);
    this.resetSupplierId = this.resetSupplierId.bind(this);
    this.validateSupplierId = this.validateSupplierId.bind(this);
    this.setSupplierCode = this.setSupplierCode.bind(this);
    this.validateSupplierCode = this.validateSupplierCode.bind(this);
    this.setTemporalBool = this.setTemporalBool.bind(this);
    this.validateTemporalBool = this.validateTemporalBool.bind(this);
    this.setTemporalIntervalAmount = this.setTemporalIntervalAmount.bind(this);
    this.validateTemporalIntervalAmount = this.validateTemporalIntervalAmount.bind(
      this
    );
    this.handleClickCreateRaster = this.handleClickCreateRaster.bind(this);
    this.setTemporalIntervalDays = this.setTemporalIntervalDays.bind(this);
    this.setTemporalIntervalHours = this.setTemporalIntervalHours.bind(this);
    this.setTemporalIntervalMinutes = this.setTemporalIntervalMinutes.bind(
      this
    );
    this.setTemporalIntervalSeconds = this.setTemporalIntervalSeconds.bind(
      this
    );
  }
  setCurrentStep(currentStep) {
    // The steps "raster is temporal" (9) and "temporal interval" (10) need to be flagged if they are opened once.
    if (currentStep === 2) {
      this.setState({ sharedWithOrganisationsWasEverOpenedByUser: true });
    }
    if (currentStep === 10) {
      this.setState({ temporalBoolComponentWasEverOpenedByUser: true });
    } else if (currentStep === 11) {
      this.setState({ temporalIntervalWasEverOpenedByUser: true });
    }
    this.setState({ currentStep });
  }
  goBackToStep(toStep) {
    if (toStep < this.state.currentStep) {
      this.setState({ currentStep: toStep });
    }
  }

  // RasterName
  setRasterName(rasterName) {
    this.setState({ rasterName });
  }
  resetRasterName() {
    this.setState({ rasterName: "" });
  }
  validateNewRasterName(str) {
    return str.length > 1;
  }
  // Organisation
  setSelectedOrganisation(selectedOrganisation) {
    this.setState({ selectedOrganisation });
  }
  resetSelectedOrganisation() {
    this.setState({ selectedOrganisation: { name: "", uuid: "" } });
  }

  validateNewRasterOrganisation(obj) {
    if (!obj) return false;
    const { uuid, name } = obj;
    return uuid && name;
  }
  // StorepathName
  setStorePathName(storePathName) {
    this.setState({ storePathName, slug: storePathName.replace(/\//g, ":") });
  }
  // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
  validateNewRasterStorePath(storePathName) {
    // one or more alphanumerical or "-" or "_" plus one "/" , this hole combination one or more time
    // after this again one or more alphanumerical or "-" or "_"
    const reg = /^([-_a-zA-Z0-9]+\/)+[-_a-zA-Z0-9]+$/g;
    return reg.test(storePathName);
  }
  // Description
  setDescription(description) {
    this.setState({ description });
  }
  validateNewRasterDescription(str) {
    if (str && str.length > 1) {
      return true;
    } else {
      return false;
    }
  }
  setAggregationType(aggregationType) {
    this.setState({ aggregationType });
  }
  validateAggregationType(aggragationType) {
    return aggragationType !== "";
  }
  // ObservationType
  setObservationType(observationType) {
    this.setState({ observationType });
  }
  resetObservationType() {
    this.setState({ observationType: null });
  }
  validateObservationType(observationType) {
    if (observationType && observationType.url && observationType.code) {
      return true;
    } else {
      return false;
    }
  }

  // Options (contains colormaps)
  setStyleAndOptions(styleObj) {
    const oldStyle = Object.assign({}, this.state.styles);
    const oldOptions = Object.assign({}, this.state.options);
    const newStyleOptions = calculateNewStyleAndOptions(
      oldStyle,
      oldOptions,
      styleObj
    );

    this.setState({ options: newStyleOptions.options });
    this.setState({ styles: newStyleOptions.styles });
  }
  // SupplierId
  setSupplierId(supplierId) {
    if (supplierId && supplierId.username === "none") {
      this.setState({ supplierId: null });
    } else {
      this.setState({ supplierId });
    }
  }

  resetSupplierId() {
    this.setSupplierId(null);
  }
  validateSupplierId(supplierId) {
    if (supplierId && supplierId.username) {
      return true;
    } else if (supplierId === null) {
      return true;
    } else {
      return false;
    }
  }
  // SupplierCode
  setSupplierCode(supplierCode) {
    this.setState({ supplierCode });
  }
  validateSupplierCode(supplierCode) {
    if (supplierCode && supplierCode.length > 1) {
      return true;
    } else {
      return false;
    }
  }
  // TemporalBool
  setTemporalBool(temporalBool) {
    this.setState({ temporalBool });
  }
  validateTemporalBool(temporalBool) {
    return this.state.temporalBoolComponentWasEverOpenedByUser;
  }
  // TemporalInterval
  setTemporalIntervalAmount(temporalIntervalAmount) {
    this.setState({ temporalIntervalAmount });
  }
  validateTemporalIntervalAmount(days, hours, minutes, seconds) {
    // positive non-zero integers (also not starting with zero)
    // return /^[1-9][0-9]*$/.test(temporalIntervalAmount);
    return (
      this.validateDaysTemporalInterval(days) &&
      this.validateHoursTemporalInterval(hours) &&
      this.validateMinutesTemporalInterval(minutes) &&
      this.validateSecondsTemporalInterval(seconds) &&
      this.validateIfNotZero(days, hours, minutes, seconds) &&
      this.state.temporalIntervalWasEverOpenedByUser
    );
  }
  // return /^[1-9][0-9]*$/.test(temporalIntervalAmount);
  validateDaysTemporalInterval(days) {
    return /^[0-9]{1,3}$/.test(days) && parseInt(days, 10) < 365;
  }
  validateHoursTemporalInterval(hours) {
    // return /^[0-9][0-9]$/.test(hours) && parseInt(hours) < 24;
    return /^[0-9]{1,2}$/.test(hours) && parseInt(hours, 10) < 24;
  }
  validateMinutesTemporalInterval(minutes) {
    // return /^[0-9][0-9]$/.test(minutes) && parseInt(minutes) < 60;
    return /^[0-9]{1,2}$/.test(minutes) && parseInt(minutes, 10) < 60;
  }
  validateSecondsTemporalInterval(seconds) {
    // return /^[0-9][0-9]$/.test(seconds) && parseInt(seconds) < 60;
    return /^[0-9]{1,2}$/.test(seconds) && parseInt(seconds, 10) < 60;
  }

  // Validate if the user did not fill in '0' for every field
  validateIfNotZero(days, hours, minutes, seconds) {
    if (
      parseInt(days, 10) === 0 &&
      parseInt(hours, 10) === 0 &&
      parseInt(minutes, 10) === 0 &&
      parseInt(seconds, 10) === 0
    ) {
      return false;
    } else {
      return true;
    }
  }

  // temporal interval Days Hours Minutes Seconds
  setTemporalIntervalDays(temporalIntervalDays) {
    this.setState({ temporalIntervalDays });
  }
  setTemporalIntervalHours(temporalIntervalHours) {
    this.setState({ temporalIntervalHours });
  }
  setTemporalIntervalMinutes(temporalIntervalMinutes) {
    this.setState({ temporalIntervalMinutes });
  }
  setTemporalIntervalSeconds(temporalIntervalSeconds) {
    this.setState({ temporalIntervalSeconds });
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      this.setState({ currentStep: this.state.currentStep + 1 });
    }
  }

  parseObservationTypeIdFromUrl(url) {
    // parse number from url: https://api.ddsc.nl/api/v1/observationtypes/16/ -> 16
    // remove last slash /
    const trimmedUrl = url.slice(0, -1);
    // get last item after splitted on slash /
    const urlInteger = trimmedUrl.split("/").pop();
    return urlInteger;
  }

  aggregationTypeStringToInteger(str) {
    if (str === "none") return 0;
    if (str === "counts") return 1;
    if (str === "curve") return 2;
    if (str === "histogram") return 3;
    if (str === "sum") return 4;
    if (str === "average") return 5;
    return 0; // default
  }

  intervalToISODuration(days, hours, minutes, seconds) {
    if (hours[0] === "0") hours = hours[1];
    if (minutes[0] === "0") minutes = minutes[1];
    if (seconds[0] === "0") seconds = seconds[1];
    return `P${days}DT${hours}H${minutes}M${seconds}S`;
    //example: 4DT12H30M5S
    // https://www.digi.com/resources/documentation/digidocs/90001437-13/reference/r_iso_8601_duration_format.htm
  }

  // converts strings like:
  // '1 00:00:00'
  // '05:00:00'
  // to {days:10, hours:'01', minutes:'09', seconds:'51'}
  getIntervalToDaysHoursMinutesSeconds(str) {
    if (!str) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const splitColon = str.split(":");
    const splitSpace = splitColon[0].split(" ");
    let obj = {
      days: 0,
      hours: splitSpace[splitSpace.length - 1],
      minutes: splitColon[1],
      seconds: splitColon[2]
    };
    if (splitSpace.length === 2) {
      obj.days = parseInt(splitSpace[0], 10);
    }
    return obj;
  }

  // Returns an array of the steps that are not filled in or completed. Used later for displaying inactive/active button and updates about form completion
  getInvalidSteps() {
    var invalidFields = [];

    if (this.state.sharedWithOrganisationsWasEverOpenedByUser === false) {
      invalidFields.push(1);
    }
    if (!this.validateNewRasterOrganisation(this.state.selectedOrganisation)) {
      invalidFields.push(2);
    }

    if (!this.validateNewRasterName(this.state.rasterName)) {
      invalidFields.push(3);
    }
    if (!this.validateNewRasterDescription(this.state.description)) {
      invalidFields.push(4);
    }

    if (!this.validateAggregationType(this.state.aggregationType)) {
      invalidFields.push(5);
    }
    if (!this.validateObservationType(this.state.observationType)) {
      invalidFields.push(6);
    }
    if (!validateStyleObj(this.state.styles)) {
      invalidFields.push(7);
    }
    if (!this.validateSupplierId(this.state.supplierId)) {
      invalidFields.push(8);
    }
    if (!this.validateSupplierCode(this.state.supplierCode)) {
      invalidFields.push(9);
    }
    if (!this.validateTemporalBool(this.state.temporalBool)) {
      invalidFields.push(10);
    }

    if (
      !this.validateTemporalIntervalAmount(
        this.state.temporalIntervalDays,
        this.state.temporalIntervalHours,
        this.state.temporalIntervalMinutes,
        this.state.temporalIntervalSeconds
      )
    ) {
      invalidFields.push(11);
    }

    return invalidFields;
  }

  validateAll() {
    // Get invalid normal (first 9) and temporal (last 2) steps
    var invalidSteps = this.getInvalidSteps();

    // Filter arrays to get normal and temporal invalid steps
    var normal = invalidSteps.filter(function(x) {
      return x < 11;
    });
    var temporal = invalidSteps.filter(function(x) {
      return x > 10;
    });

    // If temporal bool is not checked, validate first 9 steps, else validate all 11 steps
    if (!this.state.temporalBool) {
      if (normal.length === 0) {
        return true;
      }
    } else if (this.state.temporalBool) {
      if (temporal.length === 0 && normal.length === 0) {
        return true;
      }
    } else {
      return false;
    }
  }

  // Create message for user telling which steps need to be completed
  generateInvalidMessage(step) {
    // Get invalid normal (first 9) and temporal (last 2) steps
    var invalidSteps = this.getInvalidSteps();
    // Filter arrays to get normal and temporal invalid steps
    var normal = invalidSteps.filter(function(x) {
      return x < 10;
    });
    var temporal = invalidSteps.filter(function(x) {
      return x > 9;
    });

    // Return message based on either normal or temporal raster
    if (this.state.temporalBool) {
      return (
        "Please complete steps " +
        normal +
        " " +
        temporal +
        " before submitting"
      );
    } else if (step <= 9) {
      return "Please complete steps " + normal + " before submitting";
    } else {
      return "";
    }
  }

  setInitialState(props) {
    // If user is a supplier or admin
    // let userName = props.bootstrap.bootstrap.user.username;
    // let supplierId = this.props.supplierIds.available.find(user => {
    //   return user.username === userName;
    // });
    //
    let supplierId = null;

    return {
      isFetching: false,
      openOverlay: false,
      modalErrorMessage: "",
      createdRaster: null,
      currentStep: 1,
      rasterName: "",
      selectedOrganisation: {
        name: this.props.organisations.selected.name, //"",
        uuid: this.props.organisations.selected.uuid //""
      },
      storePathName: "",
      slug: "",
      description: "",
      temporalBool: false,
      sharedWithOrganisationsWasEverOpenedByUser: false,
      temporalBoolComponentWasEverOpenedByUser: false, // a checkbbox is always valid, but we should only mark it as valid if the user has actualy opened the question
      temporalIntervalUnit: "seconds", // for now assume seconds// one of [seconds minutes hours days weeks] no months years because those are not a static amount of seconds..
      temporalIntervalAmount: "", //60*60, //minutes times seconds = hour // positive integer. amount of temporalIntervalUnit
      temporalIntervalWasEverOpenedByUser: false,
      temporalIntervalDays: 1,
      temporalIntervalHours: "00",
      temporalIntervalMinutes: "00",
      temporalIntervalSeconds: "00",
      temporalOptimizer: true, // default true, not set by the user for first iteration
      styles: {
        colorMap: "",
        min: "",
        max: ""
      },
      options: {},
      aggregationType: "", // choice: none | counts | curve | histogram | sum | average
      supplierId: supplierId,
      supplierCode: "",
      observationType: null,
      sharedWith: []
    };
  }

  currentRasterToState(currentRaster) {
    // is there the possibility that available supplier id is not yet retrieved from server?
    const selectedSupplierId =
      this.props.supplierIds.available.filter(
        e => e.username === currentRaster.supplier
      )[0] || null;
    const intervalObj = this.getIntervalToDaysHoursMinutesSeconds(
      currentRaster.interval
    );
    const styles = {
      colorMap: getColorMapFromStyle(
        getStyleFromOptions(currentRaster.options)
      ),
      min: getColorMinFromStyle(getStyleFromOptions(currentRaster.options)),
      max: getColorMaxFromStyle(getStyleFromOptions(currentRaster.options))
    };

    return {
      modalErrorMessage: "",
      createdRaster: null,
      isFetching: false,
      openOverlay: false,
      currentStep: 1,
      rasterName: currentRaster.name,
      selectedOrganisation: {
        name: currentRaster.organisation.name,
        uuid: currentRaster.organisation.uuid.replace(/-/g, "")
      },
      storePathName:
        currentRaster.slug && currentRaster.slug.replace(/:/g, "/"),
      slug: currentRaster.slug,
      description: currentRaster.description,
      temporalBool: currentRaster.temporal,
      sharedWithOrganisationsWasEverOpenedByUser: true,
      temporalBoolComponentWasEverOpenedByUser: true, // a checkbbox is always valid, but we should only mark it as valid if the user has actualy opened the question
      temporalIntervalUnit: "seconds", // for now assume seconds// one of [seconds minutes hours days weeks] no months years because those are not a static amount of seconds..
      temporalIntervalAmount: "", //60*60, //minutes times seconds = hour // positive integer. amount of temporalIntervalUnit
      temporalIntervalWasEverOpenedByUser: true,
      temporalIntervalDays: intervalObj.days,
      temporalIntervalHours: intervalObj.hours,
      temporalIntervalMinutes: intervalObj.minutes,
      temporalIntervalSeconds: intervalObj.seconds,
      temporalOptimizer: true, // default true, not set by the user for first iteration
      styles: styles,
      options: currentRaster.options,
      aggregationType: currentRaster.aggregation_type, // choice: none | counts | curve | histogram | sum | average
      supplierId: selectedSupplierId,
      supplierCode: currentRaster.supplier_code,
      observationType: currentRaster.observation_type,
      sharedWith: currentRaster.shared_with
    };
  }

  // If a screen is too long for the overlay, make sure to scroll to top
  scrollToTop() {
    if (window.pageYOffset > 0) {
      window.scroll(0, 0);
    }
  }

  handleResponse(response) {
    this.setState({ modalErrorMessage: response });
    this.setState({ isFetching: false });
    this.setState({ handlingDone: true });
  }

  handleClickCreateRaster() {
    this.scrollToTop();
    this.setState({ isFetching: true, openOverlay: true });
    const url = "/api/v4/rasters/";
    const observationTypeId =
      (this.state.observationType && this.state.observationType.code) ||
      undefined;

    const intAggregationType =
      (this.state.aggregationType &&
        this.aggregationTypeStringToInteger(this.state.aggregationType)) ||
      undefined;

    const isoIntervalDuration = this.intervalToISODuration(
      this.state.temporalIntervalDays,
      this.state.temporalIntervalHours,
      this.state.temporalIntervalMinutes,
      this.state.temporalIntervalSeconds
    );

    if (!this.props.currentRaster) {
      const opts = {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.state.rasterName,
          organisation: this.state.selectedOrganisation.uuid.replace(/-/g, ""),
          access_modifier: 200, // private to organisation
          observation_type: observationTypeId, //this.state.observationType,
          description: this.state.description,
          supplier: this.state.supplierId && this.state.supplierId.username,
          supplier_code: this.state.supplierCode,
          temporal: this.state.temporalBool,
          interval: isoIntervalDuration, //'P1D', // P1D is default, = ISO 8601 datetime for 1 day",
          rescalable: false,
          optimizer: false, // default
          aggregation_type: intAggregationType,
          options: this.state.options,
          shared_with: this.state.sharedWith.map(e => e.uuid)
        })
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
        body: JSON.stringify({
          name: this.state.rasterName,
          organisation: this.state.selectedOrganisation.uuid.replace(/-/g, ""), // required
          access_modifier: 200, // private to organisation // required
          observation_type: observationTypeId, // required

          description: this.state.description,
          supplier: this.state.supplierId && this.state.supplierId.username,
          supplier_code: this.state.supplierCode,
          aggregation_type: intAggregationType,
          options: this.state.options,
          shared_with: this.state.sharedWith.map(e => e.uuid)
        })
      };

      fetch(url + "uuid:" + this.props.currentRaster.uuid + "/", opts)
        .then(responseParsed => {
          console.log("responseParsed put", responseParsed);
          this.handleResponse(responseParsed);
          return responseParsed.json();
        })
        .then(parsedBody => {
          console.log("parsedBody", parsedBody);
          this.setState({ createdRaster: parsedBody });
        });
    }
  }

  componentDidMount() {
    // commented out because this component does not have an easy way to validate,
    // therefore it does not know if going to the next step should be required
    // document.addEventListener("keydown", this.handleKeyDown, false);
    // but currently a problem with event listeners on checkbox and date field
    // therefore maybe better to add eventlistener here
  }

  render() {
    const {
      rasterName,
      currentStep,
      description,
      aggregationType
    } = this.state;

    return (
      <div>
        {this.state.openOverlay ? (
          <ErrorOverlay
            isFetching={this.state.isFetching}
            history={this.props.history}
            errorMessage={this.state.modalErrorMessage}
            handleClose={() =>
              this.setState({ handlingDone: false, openOverlay: false })}
            currentRaster={this.props.currentRaster || this.state.createdRaster}
          />
        ) : null}
        <div className={gridStyles.Container}>
          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <div id="steps" style={{ margin: "20px 0 0 20px" }}>
                <GenericSelectBoxComponent
                  titleComponent={
                    <FormattedMessage
                      id="rasters.organisation"
                      defaultMessage="Organisation"
                    />
                  }
                  subtitleComponent={
                    <FormattedMessage
                      id="rasters.please_select_organisation"
                      defaultMessage="Which organisation owns this raster?"
                    />
                  }
                  placeholder="click to select organisation"
                  step={1} // int for denoting which step of the GenericTextInputComponent it refers to
                  opened={this.props.currentRaster || currentStep === 1}
                  formUpdate={!!this.props.currentRaster}
                  readonly={false}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  choices={this.props.organisations.available}
                  transformChoiceToDisplayValue={e => (e && e.name) || ""} // optional parameter if choices are objects, which field contains the displayvalue, default item itself is displayvalue
                  isFetching={this.props.organisations.isFetching}
                  choicesSearchable={true}
                  modelValue={this.state.selectedOrganisation} // string: e.g. the name of a raster
                  updateModelValue={this.setSelectedOrganisation} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.resetSelectedOrganisation()} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateNewRasterOrganisation} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericStep
                  titleComponent={
                    <FormattedMessage
                      id="rasters.shared_with_organisations"
                      defaultMessage="Shared with organisations"
                    />
                  }
                  subtitleComponent={
                    <FormattedMessage
                      id="rasters.which_organisations_would_you_like_to_share"
                      defaultMessage="The organisations you would like to share the raster with"
                    />
                  }
                  step={2} // int for denoting which step of the GenericTextInputComponent it refers to
                  opened={this.props.currentRaster || currentStep === 2}
                  readonly={false}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  showCheckMark={
                    this.state.sharedWithOrganisationsWasEverOpenedByUser
                  }
                  showNextButton={!this.props.currentRaster}
                  fields={
                    <SlushBucket
                      choices={this.props.organisations.availableForRasterSharedWith.map(
                        e => e.name
                      )}
                      readonly={
                        false /*!this.props.organisations.selected.roles.includes('admin')*/
                      }
                      selected={this.state.sharedWith.map(e => e.name)}
                      isFetching={this.props.organisations.isFetching}
                      placeholder={"search organisations"}
                      updateModelValue={selected => {
                        this.setState({
                          sharedWith: selected
                            .map(selectedItem => {
                              const found = this.props.organisations.availableForRasterSharedWith.find(
                                availableItem =>
                                  availableItem.name === selectedItem
                              );
                              if (found) {
                                let adaptebleFound = Object.assign({}, found);
                                adaptebleFound.roles = undefined;
                                return adaptebleFound;
                              } else {
                                return undefined;
                              }
                            })
                            .filter(e => e !== undefined)
                        });
                      }}
                    />
                  }
                />

                <GenericTextInputComponent
                  titleComponent={
                    <FormattedMessage
                      id="rasters.name_of_this_raster"
                      defaultMessage="Name of this Raster"
                    />
                  }
                  placeholder="name of this raster"
                  multiline={false} // boolean for which input elem to use: text OR textarea
                  step={3} // int for denoting which step of the GenericTextInputComponent it refers to
                  opened={this.props.currentRaster || currentStep === 3}
                  formUpdate={!!this.props.currentRaster}
                  readonly={false}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  modelValue={rasterName} // string: e.g. the name of a raster
                  updateModelValue={this.setRasterName} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={this.resetRasterName} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateNewRasterName} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                {/* <GenericTextInputComponent
                  titleComponent={
                    <FormattedMessage
                      id="rasters.store_path"
                      defaultMessage="Store Path"
                    />
                  } // <FormatText ... //>
                  subtitleComponent={
                    <FormattedMessage
                      id="rasters.path_on_disk"
                      defaultMessage="Relative path of raster store. Should be unique within organisation. Multiple, comma-separated paths allowed."
                    />
                  }
                  placeholder="path/to/store"
                  multiline={false} // boolean for which input elem to use: text OR textarea
                  step={2} // int for denoting which step of the GenericTextInputComponent it refers to
                  opened={this.props.currentRaster || currentStep === 2}
                  formUpdate={!!this.props.currentRaster}
                  readonly={!!this.props.currentRaster}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  modelValue={storePathName} // string: e.g. the name of a raster
                  updateModelValue={this.setStorePathName} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setStorePathName("")} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateNewRasterStorePath}
                /> */}
                <GenericTextInputComponent
                  titleComponent={
                    <FormattedMessage
                      id="rasters.description"
                      defaultMessage="Description"
                    />
                  } // <FormatText ... //>
                  subtitleComponent={
                    <FormattedMessage
                      id="rasters.please_describe_the_new_raster"
                      defaultMessage="Please add a clear description of this raster with reference to the data source"
                    />
                  }
                  placeholder="Fill in your description here"
                  multiline={true} // boolean for which input elem to use: text OR textarea
                  step={4} // int for denoting which step of the GenericTextInputComponent it refers to
                  opened={
                    this.props.currentRaster ||
                    this.props.currentRaster ||
                    currentStep === 4
                  }
                  formUpdate={!!this.props.currentRaster}
                  readonly={false}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  modelValue={description} // string: e.g. the name of a raster
                  updateModelValue={this.setDescription} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setDescription("")} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateNewRasterDescription} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericSelectBoxComponent
                  titleComponent={
                    <FormattedMessage
                      id="rasters.aggregation_type"
                      defaultMessage="Aggregation Type"
                    />
                  }
                  subtitleComponent={
                    <FormattedMessage
                      id="rasters.please_select_type_of_aggregation"
                      defaultMessage="Please select type of spatial aggregation if necessary"
                    />
                  }
                  placeholder="click to select aggregation type"
                  step={5} // int for denoting which step of the GenericTextInputComponent it refers to
                  opened={this.props.currentRaster || currentStep === 5}
                  formUpdate={!!this.props.currentRaster}
                  readonly={false}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  choices={[
                    {
                      display: "none",
                      description: ""
                    },
                    {
                      display: "counts",
                      description: "means percentage per category"
                    },
                    {
                      display: "curve",
                      description: "means percentile curve"
                    },
                    {
                      display: "histogram",
                      description: "means frequency per data band"
                    },
                    {
                      display: "sum",
                      description: ""
                    },
                    {
                      display: "average",
                      description: ""
                    }
                  ]}
                  transformChoiceToDisplayValue={item => item.display}
                  transformChoiceToDescription={item => item.description}
                  modelValue={aggregationType} // string: e.g. the name of a raster
                  updateModelValue={item =>
                    this.setAggregationType(item.display)} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setAggregationType("")} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateAggregationType} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericSelectBoxComponent
                  titleComponent={
                    <FormattedMessage
                      id="rasters.observation_type"
                      defaultMessage="Observation Type"
                    />
                  }
                  subtitleComponent={
                    <FormattedMessage
                      id="rasters.please_select_type_of_observation"
                      defaultMessage="Please select type of observation"
                    />
                  }
                  placeholder="click to select observation type"
                  step={6} // int for denoting which step of the GenericTextInputComponent it refers to
                  opened={this.props.currentRaster || currentStep === 6}
                  formUpdate={!!this.props.currentRaster}
                  readonly={false}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  choices={this.props.observationTypes.available}
                  transformChoiceToDisplayValue={e => (e && e.code) || ""} // optional parameter if choices are objects, which field contains the displayvalue, default item itself is displayvalue
                  isFetching={this.props.observationTypes.isFetching}
                  choicesSearchable={true}
                  modelValue={this.state.observationType} // string: e.g. the name of a raster
                  updateModelValue={this.setObservationType} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setObservationType({ code: "" })} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateObservationType} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <ColorMapComponent
                  titleComponent={
                    <FormattedMessage
                      id="rasters.colormap"
                      defaultMessage="Colormap"
                    />
                  } // <FormatText ... //>
                  subtitleComponent={
                    <FormattedMessage
                      id="rasters.please_select_colormap"
                      defaultMessage="Please select Colormap"
                    />
                  }
                  minTitleComponent={
                    <FormattedMessage
                      id="rasters.fill_colormap_min"
                      defaultMessage="Minimum"
                    />
                  }
                  maxTitleComponent={
                    <FormattedMessage
                      id="rasters.fill_colormap_max"
                      defaultMessage="Maximum"
                    />
                  }
                  placeholder="click to select colormap"
                  step={7} // int for denoting which step of the GenericTextInputComponent it refers to
                  opened={this.props.currentRaster || currentStep === 7}
                  formUpdate={!!this.props.currentRaster}
                  readonly={optionsHasLayers(this.state.options)}
                  readOnlyReason={
                    <FormattedMessage
                      id="rasters.colormap_readonly_layers"
                      defaultMessage="Please choose a colormap for your raster"
                    />
                  }
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  choices={this.props.colorMaps.available}
                  transformChoiceToDisplayValue={e => (e && e.name) || ""} // optional parameter if choices are objects, which field contains the displayvalue, default item itself is displayvalue
                  isFetching={this.props.colorMaps.isFetching}
                  choicesSearchable={true}
                  modelValue={this.state.styles}
                  updateModelValue={styles => {
                    this.setStyleAndOptions(styles);
                  }} // cb function to *update* the value of e.g. a raster's name in the parent model
                  // resetModelValue={() => this.setColorMap("")} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={styles => {
                    return styles && validateStyleObj(styles);
                  }} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericSelectBoxComponent
                  titleComponent={
                    <FormattedMessage
                      id="rasters.supplier_id"
                      defaultMessage="Supplier Name"
                    />
                  }
                  subtitleComponent={
                    <FormattedMessage
                      id="rasters.please_select_supplier_id"
                      defaultMessage="Please select Supplier Name"
                    />
                  }
                  placeholder="type to search supplier name"
                  step={8} // int for denoting which step of the GenericTextInputComponent it refers to
                  opened={this.props.currentRaster || currentStep === 8}
                  formUpdate={!!this.props.currentRaster}
                  readonly={false}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  choices={this.props.supplierIds.available}
                  noneValue={{ username: "none", value: "null" }}
                  transformChoiceToDisplayValue={e => {
                    return (e && e.username) || "";
                  }} // optional parameter if choices are objects, which field contains the displayvalue, default item itself is displayvalue
                  isFetching={this.props.supplierIds.isFetching}
                  choicesSearchable={true}
                  modelValue={
                    this.state.supplierId || { username: "none", value: "null" }
                  } // if the supplier_id is null then pass the noneValue for the selectbox component to show. The selectbox component is not aware that the real value is null
                  updateModelValue={this.setSupplierId} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={this.resetSupplierId} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateSupplierId} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericTextInputComponent
                  titleComponent={
                    <FormattedMessage
                      id="rasters.supplier_code"
                      defaultMessage="Supplier Code"
                    />
                  } // <FormatText ... //>
                  subtitleComponent={
                    <FormattedMessage
                      id="rasters.unique_supplier_code"
                      defaultMessage="Please choose a supplier code for your own administration"
                    />
                  }
                  placeholder="Fill in a supplier code here"
                  multiline={false} // boolean for which input elem to use: text OR textarea
                  step={9} // int for denoting which step of the GenericTextInputComponent it refers to
                  opened={this.props.currentRaster || currentStep === 9}
                  formUpdate={!!this.props.currentRaster}
                  readonly={false}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  modelValue={this.state.supplierCode} // string: e.g. the name of a raster
                  updateModelValue={this.setSupplierCode} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setSupplierCode("")} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateSupplierCode} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericCheckBoxComponent
                  titleComponent={
                    <FormattedMessage
                      id="rasters.raster_is_temporal"
                      defaultMessage="Raster Serie"
                    />
                  }
                  step={10} // int for denoting which step of the GenericTextInputComponent it refers to
                  opened={this.props.currentRaster || currentStep === 10}
                  formUpdate={!!this.props.currentRaster}
                  readonly={!!this.props.currentRaster}
                  currentStep={currentStep}
                  setCurrentStep={this.setCurrentStep}
                  modelValue={this.state.temporalBool}
                  label={
                    <FormattedMessage
                      id="rasters.check_if_raster_is_temporal"
                      defaultMessage="Are you creating a raster serie (a rasterstore that contains multiple rasters over time)?"
                    />
                  }
                  updateModelValue={this.setTemporalBool}
                  yesCheckedComponent={
                    <FormattedMessage
                      id="rasters.yes_the_raster_is_temporal"
                      defaultMessage="Yes, this is a raster serie"
                    />
                  }
                  noNotCheckedComponent={
                    <FormattedMessage
                      id="rasters.no_the_raster_is_not_temporal"
                      defaultMessage="No, this is not a raster serie"
                    />
                  }
                  validate={this.validateTemporalBool}
                />
                {this.state.temporalBool ? (
                  <div>
                    <DurationComponent
                      titleComponent={
                        <FormattedMessage
                          id="rasters.temporal_raster_frequency"
                          defaultMessage="Raster Serie Interval"
                        />
                      }
                      subtitleComponent={
                        <FormattedMessage
                          id="rasters.temporal_raster_frequency_description"
                          defaultMessage="Interval of raster serie"
                        />
                      }
                      multiline={false} // boolean for which input elem to use: text OR textarea
                      step={11} // int for denoting which step of the GenericTextInputComponent it refers to
                      isLastItem={true}
                      opened={this.props.currentRaster || currentStep === 11}
                      formUpdate={!!this.props.currentRaster}
                      readonly={!!this.props.currentRaster}
                      currentStep={currentStep}
                      setCurrentStep={this.setCurrentStep}
                      //modelValue={this.state.temporalIntervalAmount} // for now always in seconds
                      modelValueDays={this.state.temporalIntervalDays}
                      modelValueHours={this.state.temporalIntervalHours}
                      modelValueMinutes={this.state.temporalIntervalMinutes}
                      modelValueSeconds={this.state.temporalIntervalSeconds}
                      updateModelValue={this.setTemporalIntervalAmount}
                      //resetModelValue={() => this.setTemporalIntervalAmount("")}
                      updateModelValueDays={this.setTemporalIntervalDays}
                      updateModelValueHours={this.setTemporalIntervalHours}
                      updateModelValueMinutes={this.setTemporalIntervalMinutes}
                      updateModelValueSeconds={this.setTemporalIntervalSeconds}
                      validate={this.validateTemporalIntervalAmount}
                      validateDays={this.validateDaysTemporalInterval}
                      validateHours={this.validateHoursTemporalInterval}
                      validateMinutes={this.validateMinutesTemporalInterval}
                      validateSeconds={this.validateSecondsTemporalInterval}
                    />
                  </div>
                ) : null}
                {this.validateAll() ? (
                  <div className={inputStyles.InputContainer}>
                    <button
                      type="button"
                      className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                      style={{ marginTop: 10 }}
                      onClick={() => {
                        this.handleClickCreateRaster();
                      }}
                    >
                      <FormattedMessage
                        id="rasters.submit"
                        defaultMessage="Submit"
                      />
                    </button>
                  </div>
                ) : (
                  <div className={inputStyles.InputContainer}>
                    <button
                      type="button"
                      className={`${buttonStyles.Button} ${buttonStyles.Inactive}`}
                      style={{
                        marginTop: 10,
                        color: "grey",
                        cursor: "not-allowed"
                      }}
                    >
                      <FormattedMessage
                        id="rasters.submit"
                        defaultMessage="Submit"
                      />
                    </button>
                    <span
                      className={`${inputStyles.SubmitSpan}`}
                      style={{ paddingLeft: 20, verticalAlign: "middle" }}
                    >
                      {this.generateInvalidMessage(currentStep)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    organisations: state.organisations,
    bootstrap: state.bootstrap,
    observationTypes: state.observationTypes,
    colorMaps: state.colorMaps,
    supplierIds: state.supplierIds
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

const RasterForm = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RasterFormModel)
);

export { RasterForm };
