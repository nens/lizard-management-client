import gridStyles from "../../styles/Grid.css";
import "./NewRaster.css";
import React, { Component } from "react";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import moment from "moment";
// import InputMoment from "input-moment";
//import "../../../node_modules/input-moment/dist/input-moment.css";
//import "https://unpkg.com/ionicons@4.2.2/dist/css/ionicons.min.css";
import { withRouter } from "react-router-dom";
import FormatMessage from "../../utils/FormatMessage.js";
import GenericTextInputComponent from "../../components/GenericTextInputComponent";
import GenericSelectBoxComponent from "../../components/GenericSelectBoxComponent";
import GenericCheckBoxComponent from "../../components/GenericCheckBoxComponent";
import GenericDateComponent from "../../components/GenericDateComponent";

// import NewRasterName from "./NewRasterName";
// import { NewRasterOrganisation } from "./NewRasterOrganisation";
// import NewRasterStorePath from "./NewRasterStorePath";
// import NewRasterDescription from "./NewRasterDescription";
// import bindReactFunctions from "../../utils/BindReactFunctions.js";
// import GenericWizardStep from "../../components/GenericWizardStep";
// import formStyles from "../../styles/Forms.css";
// import displayStyles from "../../styles/Display.css";
// import ClearInputButton from "../../components/ClearInputButton.js";

class NewRasterModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      rasterName: "",

      selectedOrganisation: {
        name: "",
        unique_id: ""
      },
      storePathName: "",
      slug: "",
      description: "",
      // temporal: {
      //   bool: false,
      //   origin: "2000-01-01T00:00:00",
      //   // interval will eventually be saved in seconds so intervalUnit * intervalAmount
      //   intervalUnit: 'seconds', // one of [seconds minutes hours days weeks] no months years because those are not a static amount of seconds..
      //   intervalAmount: 0, // positive integer
      //   optimizer: true
      // },
      // new temporal structure:
      temporalBool: false,
      temporalOrigin: moment(), //"2000-01-01T00:00:00Z",
      temporalIntervalUnit: "seconds", // for now assume seconds// one of [seconds minutes hours days weeks] no months years because those are not a static amount of seconds..
      temporalIntervalAmount: "", //60*60, //minutes times seconds = hour // positive integer. amount of temporalIntervalUnit
      temporalOptimizer: true, // default true, not set by the user for first iteration
      // TODO let colormap have min and max as below with styles
      colorMap: "",
      // styles: {
      //   choice: "",
      //   min: 0,
      //   max: 10,
      // },
      aggregationType: "", // choice: none | counts | curve | histogram | sum | average
      supplierId: "",
      supplierCode: "",
      observationType: "",
      sharedWith: [],
      validSteps: {
        step1: false,
        step2: false,
        step3: false,
        step4: false
      }
    };

    // Experiment: TODO!

    // const BINDABLE_FUNCTIONS = [
    //   "setCurrentStep",
    //   "setRasterName",
    //   "setRasterOrganisation"
    // ];

    // const that = this;

    // BINDABLE_FUNCTIONS.forEach(fnName =>
    //   that[fnName] = that[fnName].bind(that)
    // );
    //
    // bindReactFunctions(this);
    // this.goBackToStep = this.goBackToStep.bind(this); // TO BE REPLACED BY this.setCurrentStep

    // old:

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
    this.setObservationType = this.setObservationType.bind(this);
    this.setColorMap = this.setColorMap.bind(this);
    this.setSupplierId = this.setSupplierId.bind(this);
    this.setSupplierCode = this.setSupplierCode.bind(this);
    this.setTemporalBool = this.setTemporalBool.bind(this);
    this.setTemporalIntervalAmount = this.setTemporalIntervalAmount.bind(this);
    this.setTemporalOrigin = this.setTemporalOrigin.bind(this);
  }

  setCurrentStep(currentStep) {
    this.setState({ currentStep });
    // Also, set focus to the new currentstep:
  }
  setRasterName(rasterName) {
    this.setState({ rasterName });
  }
  resetRasterName() {
    this.setState({ rasterName: "" });
  }
  setSelectedOrganisation(selectedOrganisation) {
    this.setState({ selectedOrganisation });
  }
  resetSelectedOrganisation() {
    this.setState({ selectedOrganisation: { name: "", unique_id: "" } });
  }
  setStorePathName(storePathName) {
    this.setState({ storePathName, slug: storePathName.replace(/\//g, ":") });
  }
  setDescription(description) {
    this.setState({ description });
  }
  setAggregationType(aggregationType) {
    this.setState({ aggregationType });
  }
  setObservationType(observationTypeObj) {
    this.setState({ observationType: observationTypeObj.code });
  }
  setColorMap(colorMapObj) {
    this.setState({ colorMap: colorMapObj.name });
  }
  setSupplierId(supplierIdObj) {
    this.setState({ supplierId: supplierIdObj.username });
  }
  setSupplierCode(supplierCode) {
    this.setState({ supplierCode });
  }
  goBackToStep(toStep) {
    if (toStep < this.state.currentStep) {
      this.setState({ currentStep: toStep });
    }
  }
  setTemporalBool(temporalBool) {
    this.setState({ temporalBool });
  }
  setTemporalIntervalAmount(temporalIntervalAmount) {
    this.setState({ temporalIntervalAmount });
  }
  setTemporalOrigin(temporalOrigin) {
    this.setState({ temporalOrigin });
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      this.setState({ currentStep: this.state.currentStep + 1 });
    }
  }

  componentDidMount() {
    // TODO fix original focus
    // const firstElement = document.getElementById(
    //   "rasters.name_of_this_raster_input"
    // );
    // firstElement.focus();
    // commented out because this component does not have an easy way to validate,
    // therefore it does not know if going to the next step should be required
    //document.addEventListener("keydown", this.handleKeyDown, false);
  }
  validateNewRasterName(str) {
    return str.length > 1;
  }
  validateNewRasterOrganisation(obj) {
    const { unique_id, name } = obj;
    return unique_id && name;
  }
  validateNewRasterStorePath(str) {
    // regex..
  }
  validateNewRasterDescription(str) {
    return str.length > 1;
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
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${
                gridStyles.colSm12
              } ${gridStyles.colXs12}`}
            >
              <div id="steps" style={{ margin: "20px 0 0 20px" }}>
                {/* <NewRasterName
                  step={1}
                  currentStep={currentStep}
                  setCurrentStep={this.setCurrentStep}
                  validate={this.validateNewRasterName}

                  parentState={rasterName}
                  setParentState={this.setRasterName}
                  resetParentState={this.resetRasterName}
                /> */}

                <GenericTextInputComponent
                  titleComponent={
                    <FormatMessage id="rasters.name_of_this_raster" />
                  } // <FormatText ... //>
                  subtitleComponent={
                    <FormatMessage
                      id="rasters.name_will_be_used_in_alerts"
                      defaultMessage="The name of the raster will be used in e-mail and SMS alerts"
                    />
                  } // <FormatText ... />
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
                  titleComponent={<FormatMessage id="rasters.store_path" />} // <FormatText ... //>
                  subtitleComponent={
                    <FormatMessage
                      id="rasters.path_on_disk"
                      defaultMessage="Relative path of raster store. Should be unique within organisation. Multiple, comma-separated paths allowed."
                    />
                  } // <FormatText ... />
                  placeholder="path/to/store"
                  multiline={false} // boolean for which input elem to use: text OR textarea
                  step={2} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 2}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  modelValue={storePathName} // string: e.g. the name of a raster
                  updateModelValue={this.setStorePathName} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setStorePathName("")} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={storePathName => {
                    // one or more alphanumerical or "-" or "_" plus one "/" , this hole combination one or more time
                    // after this again one or more alphanumerical or "-" or "_"
                    const reg = /^([-_a-zA-Z0-9]+\/)+[-_a-zA-Z0-9]+$/g;
                    return reg.test(storePathName);
                  }} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericTextInputComponent
                  titleComponent={<FormatMessage id="rasters.description" />} // <FormatText ... //>
                  subtitleComponent={
                    <FormatMessage id="rasters.please_describe_the_new_raster" />
                  } // <FormatText ... />
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
                    <FormatMessage id="rasters.aggregation_type" />
                  } // <FormatText ... //>
                  subtitleComponent={
                    <FormatMessage id="rasters.please_select_type_of_aggregation" />
                  } // <FormatText ... />
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
                  modelValue={aggregationType} // string: e.g. the name of a raster
                  updateModelValue={this.setAggregationType} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setAggregationType("")} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={() => this.state.aggregationType} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericSelectBoxComponent
                  titleComponent={
                    <FormatMessage id="rasters.observation_type" />
                  } // <FormatText ... //>
                  subtitleComponent={
                    <FormatMessage id="rasters.please_select_type_of_observation" />
                  } // <FormatText ... />
                  placeholder="click to select observation type"
                  step={5} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 5}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  choices={this.props.observationTypes.available}
                  choicesDisplayField="code" // optional parameter if choices are objects, which field contains the displayvalue, default item itself is displayvalue
                  isFetching={this.props.observationTypes.isFetching}
                  choicesSearchable={true}
                  modelValue={this.state.observationType} // string: e.g. the name of a raster
                  updateModelValue={this.setObservationType} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setObservationType({ code: "" })} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={() => this.state.observationType !== ""} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericSelectBoxComponent
                  titleComponent={<FormatMessage id="rasters.colormap" />} // <FormatText ... //>
                  subtitleComponent={
                    <FormatMessage id="rasters.please_select_colormap" />
                  } // <FormatText ... />
                  placeholder="click to select colormap"
                  step={6} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 6}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  choices={this.props.colorMaps.available}
                  choicesDisplayField="name" // optional parameter if choices are objects, which field contains the displayvalue, default item itself is displayvalue
                  isFetching={this.props.colorMaps.isFetching}
                  choicesSearchable={true}
                  modelValue={this.state.colorMap} // string: e.g. the name of a raster
                  updateModelValue={this.setColorMap} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setColorMap({ name: "" })} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={() => this.state.colorMap !== ""} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericSelectBoxComponent
                  titleComponent={<FormatMessage id="rasters.supplier_id" />} // <FormatText ... //>
                  subtitleComponent={
                    <FormatMessage id="rasters.please_select_supplier_id" />
                  } // <FormatText ... />
                  placeholder="click to select supplier id"
                  step={7} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 7}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  choices={this.props.supplierIds.available}
                  choicesDisplayField="username" // optional parameter if choices are objects, which field contains the displayvalue, default item itself is displayvalue
                  isFetching={this.props.supplierIds.isFetching}
                  choicesSearchable={true}
                  modelValue={this.state.supplierId} // string: e.g. the name of a raster
                  updateModelValue={this.setSupplierId} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setSupplierId({ username: "" })} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={() => this.state.supplierId !== ""} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericTextInputComponent
                  titleComponent={<FormatMessage id="rasters.supplier_code" />} // <FormatText ... //>
                  subtitleComponent={
                    <FormatMessage
                      id="rasters.unique_supplier_code"
                      defaultMessage="The combination supplier name and supplier code should be unique"
                    />
                  } // <FormatText ... />
                  placeholder="type supplier code here"
                  multiline={false} // boolean for which input elem to use: text OR textarea
                  step={8} // int for denoting which step it the GenericTextInputComponent refers to
                  opened={currentStep === 8}
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  modelValue={this.state.supplierCode} // string: e.g. the name of a raster
                  updateModelValue={this.setSupplierCode} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setSupplierCode("")} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={supplierCode => supplierCode.length > 1} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                {/* <label>
                  <Checkbox
                    //className="custom_rc_checkbox_class"
                    //className={styles.custom_rc_checkbox_class}
                    onChange={() => console.log("Checkbox change detected!")}
                    disabled={false}
                  />
                  &nbsp;checking our checkbox
                </label> */}
                {/* <GenericCheckBox
                  titleComponent={<FormatMessage id="rasters.supplier_code" />} // <FormatText ... //>
                  modelValue={this.state.temporal.bool}
                  label={"test own checkbox"}
                  updateModelValue={this.setTemporalBool}
                /> */}
                <GenericCheckBoxComponent
                  titleComponent={
                    <FormatMessage id="rasters.raster_is_temporal" />
                  } // <FormatText ... //>
                  step={9}
                  opened={currentStep === 9}
                  currentStep={currentStep}
                  setCurrentStep={this.setCurrentStep}
                  modelValue={this.state.temporalBool}
                  label={
                    "Check if Raster is a temporal raster: it changes over time"
                  }
                  updateModelValue={this.setTemporalBool}
                  yesCheckedComponent={
                    <FormatMessage id="rasters.yes_the_raster_is_temporal" />
                  }
                  noNotCheckedComponent={
                    <FormatMessage id="rasters.no_the_raster_is_not_temporal" />
                  }
                />
                <GenericDateComponent
                  titleComponent={
                    <FormatMessage id="rasters.temporal_raster_origin" />
                  } // <FormatText ... //>
                  subtitleComponent={"Frequency of temporal raster in seconds"}
                  multiline={false} // boolean for which input elem to use: text OR textarea
                  step={10}
                  opened={currentStep === 10}
                  currentStep={currentStep}
                  setCurrentStep={this.setCurrentStep}
                  modelValue={this.state.temporalOrigin} // for now always in seconds
                  updateModelValue={e => this.setTemporalOrigin(e)}
                  //resetModelValue={() => this.setTemporalIntervalAmount("")}
                  validate={value => true}
                />
                <GenericTextInputComponent
                  titleComponent={
                    <FormatMessage id="rasters.temporal_raster_frequency" />
                  } // <FormatText ... //>
                  subtitleComponent={"Frequency of temporal raster in seconds"}
                  multiline={false} // boolean for which input elem to use: text OR textarea
                  step={11}
                  opened={currentStep === 11}
                  currentStep={currentStep}
                  setCurrentStep={this.setCurrentStep}
                  modelValue={this.state.temporalIntervalAmount} // for now always in seconds
                  updateModelValue={this.setTemporalIntervalAmount}
                  resetModelValue={() => this.setTemporalIntervalAmount("")}
                  validate={value => /^[1-9][0-9]*$/.test(value)}
                />
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

const NewRaster = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NewRasterModel)
);

export { NewRaster };
