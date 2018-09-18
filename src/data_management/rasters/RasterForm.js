import gridStyles from "../../styles/Grid.css";
import buttonStyles from "../../styles/Buttons.css";
import "./NewRaster.css";
import React, { Component } from "react";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import GenericTextInputComponent from "../../components/GenericTextInputComponent";
import GenericSelectBoxComponent from "../../components/GenericSelectBoxComponent";
import GenericCheckBoxComponent from "../../components/GenericCheckBoxComponent";
import GenericDateComponent from "../../components/GenericDateComponent";
import DurationComponent from "../../components/DurationComponent";
import inputStyles from "../../styles/Input.css";

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
    this.setColorMap = this.setColorMap.bind(this);
    this.validateColorMap = this.validateColorMap.bind(this);
    this.setSupplierId = this.setSupplierId.bind(this);
    this.validateSupplierId = this.validateSupplierId.bind(this);
    this.setSupplierCode = this.setSupplierCode.bind(this);
    this.validateSupplierCode = this.validateSupplierCode.bind(this);
    this.setTemporalBool = this.setTemporalBool.bind(this);
    this.validateTemporalBool = this.validateTemporalBool.bind(this);
    this.setTemporalIntervalAmount = this.setTemporalIntervalAmount.bind(this);
    this.validateTemporalIntervalAmount = this.validateTemporalIntervalAmount.bind(
      this
    );
    this.setTemporalOrigin = this.setTemporalOrigin.bind(this);
    this.validateTemporalOrigin = this.validateTemporalOrigin.bind(this);
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
    // The steps "raster is temporal" (9) and "temporal origin" (10) need to be flagged if they are opened once.
    if (currentStep === 9) {
      this.setState({ temporalBoolComponentWasEverOpenedByUser: true });
    } else if (currentStep === 10) {
      this.setState({ temporalOriginComponentWasEverOpenedByUser: true });
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
    this.setState({ selectedOrganisation: { name: "", unique_id: "" } });
  }
  validateNewRasterOrganisation(obj) {
    const { unique_id, name } = obj;
    return unique_id && name;
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
    return str.length > 1;
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
    return (
      observationType &&
      observationType.url !== "" &&
      observationType.code !== ""
    );
  }
  // Colormap
  setColorMap(colorMap) {
    this.setState({ colorMap });
  }
  validateColorMap(colorMap) {
    return colorMap && colorMap.name !== "";
  }
  // SupplierId
  setSupplierId(supplierId) {
    this.setState({ supplierId });
  }
  resetSupplierId() {
    this.setSupplierId(null);
  }
  validateSupplierId(supplierId) {
    return supplierId && supplierId.username !== "";
  }
  // SupplierCode
  setSupplierCode(supplierCode) {
    this.setState({ supplierCode });
  }
  validateSupplierCode(supplierCode) {
    return supplierCode.length > 1;
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
      this.state.temporalIntervalWasEverOpenedByUser
    );
  }
  // return /^[1-9][0-9]*$/.test(temporalIntervalAmount);
  validateDaysTemporalInterval(days) {
    return /^[1-9][0-9]*$/.test(days) || days === 0;
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
  // temporal origin
  setTemporalOrigin(temporalOrigin) {
    this.setState({ temporalOrigin });
  }
  validateTemporalOrigin(_temporalOrigin) {
    return this.state.temporalOriginComponentWasEverOpenedByUser;
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      this.setState({ currentStep: this.state.currentStep + 1 });
    }
  }

  // if this function returns true, then the user should be able to submit the raster
  validateAll() {
    //return (
    const normalFields =
      this.validateNewRasterName(this.state.rasterName) &&
      // organisation is currently taken from the organisation picker in the header, but we might change this
      //this.validateNewRasterOrganisation(this.state.selectedOrganisation) &&
      this.validateNewRasterStorePath(this.state.storePathName) &&
      this.validateNewRasterDescription(this.state.description) &&
      this.validateAggregationType(this.state.aggregationType) &&
      this.validateObservationType(this.state.observationType) &&
      this.validateColorMap(this.state.colorMap) &&
      this.validateSupplierId(this.state.supplierId) &&
      this.validateSupplierCode(this.state.supplierCode) &&
      this.validateTemporalBool(this.state.temporalBool);

    const temporalFields =
      !this.state.temporalBool ||
      (this.state.temporalBool &&
        this.validateTemporalIntervalAmount(
          this.state.temporalIntervalDays,
          this.state.temporalIntervalHours,
          this.state.temporalIntervalMinutes,
          this.state.temporalIntervalSeconds
        ) &&
        this.validateTemporalOrigin(this.state.temporalOrigin));
    return normalFields && temporalFields;
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

  setInitialState(props) {
    return {
      currentStep: 1,
      rasterName: "",
      selectedOrganisation: {
        name: "",
        unique_id: ""
      },
      storePathName: "",
      slug: "",
      description: "",
      temporalBool: false,
      temporalBoolComponentWasEverOpenedByUser: false, // a checkbbox is always valid, but we should only mark it as valid if the user has actualy opened the question
      temporalOrigin: moment(), //"2000-01-01T00:00:00Z",
      temporalOriginComponentWasEverOpenedByUser: false, // the data is valid since it is created with momentJS, but should only be marked as such when the date component was actually opened once
      temporalIntervalUnit: "seconds", // for now assume seconds// one of [seconds minutes hours days weeks] no months years because those are not a static amount of seconds..
      temporalIntervalAmount: "", //60*60, //minutes times seconds = hour // positive integer. amount of temporalIntervalUnit
      temporalIntervalWasEverOpenedByUser: false,
      temporalIntervalDays: 1,
      temporalIntervalHours: "00",
      temporalIntervalMinutes: "00",
      temporalIntervalSeconds: "00",
      temporalOptimizer: true, // default true, not set by the user for first iteration
      // TODO let colormap have min and max as below with styles
      colorMap: "",
      // colorMapMin: 0,
      // colorMapMax: 100, // what are reasonable defaults?
      aggregationType: "", // choice: none | counts | curve | histogram | sum | average
      supplierId: "",
      supplierCode: "",
      // observationType: {
      //   code: "",
      //   url: ""
      // },
      observationType: null,
      sharedWith: []
    };
  }

  currentRasterToState(currentRaster) {
    // is there the possibility that available supplier id is not yet retrieved from server?
    const selectedSupplierId = this.props.supplierIds.available.filter(
      e => e.url === currentRaster.supplier
    )[0];
    const intervalObj = this.getIntervalToDaysHoursMinutesSeconds(
      currentRaster.interval
    );

    return {
      currentStep: 1,
      rasterName: currentRaster.name,
      selectedOrganisation: {
        name: currentRaster.organisation.name,
        unique_id: currentRaster.organisation.unique_id
      },
      storePathName: currentRaster.slug.replace(/:/g, "/"),
      slug: currentRaster.slug,
      description: currentRaster.description,
      temporalBool: currentRaster.temporal,
      temporalBoolComponentWasEverOpenedByUser: true, // a checkbbox is always valid, but we should only mark it as valid if the user has actualy opened the question
      temporalOrigin: moment(currentRaster.origin), //"2000-01-01T00:00:00Z",
      temporalOriginComponentWasEverOpenedByUser: true, // the data is valid since it is created with momentJS, but should only be marked as such when the date component was actually opened once
      temporalIntervalUnit: "seconds", // for now assume seconds// one of [seconds minutes hours days weeks] no months years because those are not a static amount of seconds..
      temporalIntervalAmount: "", //60*60, //minutes times seconds = hour // positive integer. amount of temporalIntervalUnit
      temporalIntervalWasEverOpenedByUser: true,
      temporalIntervalDays: intervalObj.days,
      temporalIntervalHours: intervalObj.hours,
      temporalIntervalMinutes: intervalObj.minutes,
      temporalIntervalSeconds: intervalObj.seconds,
      temporalOptimizer: true, // default true, not set by the user for first iteration
      colorMap: { name: currentRaster.options.styles },
      aggregationType: currentRaster.aggregation_type, // choice: none | counts | curve | histogram | sum | average
      supplierId: selectedSupplierId,
      supplierCode: currentRaster.supplier_code,
      observationType: currentRaster.observation_type,
      sharedWith: []
    };
  }

  handleClickCreateRaster() {
    const url = "/api/v3/rasters/";
    const observationTypeId = this.parseObservationTypeIdFromUrl(
      this.state.observationType.url
    );
    const intAggregationType = this.aggregationTypeStringToInteger(
      this.state.aggregationType
    );

    const isoIntervalDuration = this.intervalToISODuration(
      this.state.temporalIntervalDays,
      this.state.temporalIntervalHours,
      this.state.temporalIntervalMinutes,
      this.state.temporalIntervalSeconds
    );

    const opts = {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: this.state.rasterName,
        organisation: this.props.organisations.selected.unique_id, //"61f5a464c35044c19bc7d4b42d7f58cb",
        access_modifier: 200, // private to organisation
        observation_type: observationTypeId, //this.state.observationType,
        description: this.state.description,
        supplier: this.state.supplierId.username,
        supplier_code: this.state.supplierCode,
        temporal: this.state.temporalBool,
        origin: this.state.temporalOrigin.toISOString(), // toISOString = momentJS function
        interval: isoIntervalDuration, //'P1D', // P1D is default, = ISO 8601 datetime for 1 day",
        rescalable: false,
        optimizer: false, // default
        aggregation_type: intAggregationType,
        options: {
          styles: this.state.colorMap.name
        }
      })
    };

    fetch(url, opts)
      .then(response => response.json()) // TODO: kan dit weg?
      .then(responseParsed => {
        console.log("[PROMISE] responseParsed", responseParsed);
        // what shall we do with history?
        //history.push("/alarms/templates/");
      });
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
      storePathName,
      description,
      aggregationType
    } = this.state;

    return (
      <div>
        <div className={gridStyles.Container}>
          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <div id="steps" style={{ margin: "20px 0 0 20px" }}>
                <GenericTextInputComponent
                  titleComponent={
                    <FormattedMessage
                      id="rasters.name_of_this_raster"
                      defaultMessage="Name of this Raster"
                    />
                  }
                  subtitleComponent={
                    <FormattedMessage
                      id="rasters.choose_descriptive_name"
                      defaultMessage="The name of the raster will be used in e-mail and SMS alerts"
                    />
                  }
                  placeholder="name of this raster"
                  multiline={false} // boolean for which input elem to use: text OR textarea
                  step={1} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 1}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  modelValue={rasterName} // string: e.g. the name of a raster
                  updateModelValue={this.setRasterName} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={this.resetRasterName} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateNewRasterName} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericTextInputComponent
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
                  step={2} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 2}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  modelValue={storePathName} // string: e.g. the name of a raster
                  updateModelValue={this.setStorePathName} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setStorePathName("")} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateNewRasterStorePath}
                />
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
                      defaultMessage="Please describe the new Raster"
                    />
                  }
                  placeholder="description here"
                  multiline={true} // boolean for which input elem to use: text OR textarea
                  step={3} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 3}
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
                      defaultMessage="Please select type of aggregation"
                    />
                  }
                  placeholder="click to select aggregation type"
                  step={4} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 4}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  choices={[
                    "none",
                    "counts",
                    "curve",
                    "histogram",
                    "sum",
                    "average"
                  ]}
                  transformChoiceToDisplayValue={id => id}
                  modelValue={aggregationType} // string: e.g. the name of a raster
                  updateModelValue={this.setAggregationType} // cb function to *update* the value of e.g. a raster's name in the parent model
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
                  step={5} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 5}
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
                <GenericSelectBoxComponent
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
                  placeholder="click to select colormap"
                  step={6} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 6}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  choices={this.props.colorMaps.available}
                  transformChoiceToDisplayValue={e => (e && e.name) || ""} // optional parameter if choices are objects, which field contains the displayvalue, default item itself is displayvalue
                  isFetching={this.props.colorMaps.isFetching}
                  choicesSearchable={true}
                  modelValue={this.state.colorMap} // string: e.g. the name of a raster
                  updateModelValue={this.setColorMap} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setColorMap({ name: "" })} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateColorMap} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericSelectBoxComponent
                  titleComponent={
                    <FormattedMessage
                      id="rasters.supplier_id"
                      defaultMessage="Supplier ID"
                    />
                  }
                  subtitleComponent={
                    <FormattedMessage
                      id="rasters.please_select_supplier_id"
                      defaultMessage="Please select Supplier ID"
                    />
                  }
                  placeholder="click to select supplier id"
                  step={7} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 7}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  choices={this.props.supplierIds.available}
                  transformChoiceToDisplayValue={e => (e && e.username) || ""} // optional parameter if choices are objects, which field contains the displayvalue, default item itself is displayvalue
                  isFetching={this.props.supplierIds.isFetching}
                  choicesSearchable={true}
                  modelValue={this.state.supplierId} // string: e.g. the name of a raster
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
                      defaultMessage="The combination supplier name and supplier code should be unique"
                    />
                  }
                  placeholder="type supplier code here"
                  multiline={false} // boolean for which input elem to use: text OR textarea
                  step={8} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 8}
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
                      defaultMessage="Raster is Temporal"
                    />
                  }
                  step={9}
                  opened={currentStep === 9}
                  currentStep={currentStep}
                  setCurrentStep={this.setCurrentStep}
                  modelValue={this.state.temporalBool}
                  label={
                    <FormattedMessage
                      id="rasters.check_if_raster_is_temporal"
                      defaultMessage="Check if Raster is a temporal raster: it changes over time"
                    />
                  }
                  updateModelValue={this.setTemporalBool}
                  yesCheckedComponent={
                    <FormattedMessage
                      id="rasters.yes_the_raster_is_temporal"
                      defaultMessage="Yes, the raster is temporal"
                    />
                  }
                  noNotCheckedComponent={
                    <FormattedMessage
                      id="rasters.no_the_raster_is_not_temporal"
                      defaultMessage="No, the raster is not temporal"
                    />
                  }
                  validate={this.validateTemporalBool}
                />
                {this.state.temporalBool ? (
                  <div>
                    <GenericDateComponent
                      titleComponent={
                        <FormattedMessage
                          id="rasters.temporal_raster_origin"
                          defaultMessage="Temporal Raster Origin"
                        />
                      } // <FormatText ... //>
                      subtitleComponent={
                        <FormattedMessage
                          id="rasters.temporal_raster_origin_description"
                          defaultMessage="First possible measurement off the temporal raster"
                        />
                      }
                      multiline={false} // boolean for which input elem to use: text OR textarea
                      step={10}
                      opened={currentStep === 10}
                      currentStep={currentStep}
                      setCurrentStep={this.setCurrentStep}
                      modelValue={this.state.temporalOrigin} // for now always in seconds
                      updateModelValue={e => this.setTemporalOrigin(e)}
                      //resetModelValue={() => this.setTemporalIntervalAmount("")}
                      validate={this.validateTemporalOrigin}
                    />
                    <DurationComponent
                      titleComponent={
                        <FormattedMessage
                          id="rasters.temporal_raster_frequency"
                          defaultMessage="Temporal Raster Frequency"
                        />
                      }
                      subtitleComponent={
                        <FormattedMessage
                          id="rasters.temporal_raster_frequency_description"
                          defaultMessage="Frequency of temporal raster"
                        />
                      }
                      multiline={false} // boolean for which input elem to use: text OR textarea
                      step={11}
                      opened={currentStep === 11}
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
                    <FormattedMessage
                      id="rasters.please complete the form before submitting"
                      defaultMessage="Please complete the form for submitting"
                    />
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
