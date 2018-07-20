import gridStyles from "../../styles/Grid.css";
import React, { Component } from "react";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import FormatMessage from "../../utils/FormatMessage.js";
import GenericTextInputComponent from "../../components/GenericTextInputComponent";
import NewRasterName from "./NewRasterName";
import { NewRasterOrganisation } from "./NewRasterOrganisation";
import NewRasterStorePath from "./NewRasterStorePath";
import NewRasterDescription from "./NewRasterDescription";
import bindReactFunctions from "../../utils/BindReactFunctions.js";
import GenericWizardStep from "../../components/GenericWizardStep";
import formStyles from "../../styles/Forms.css";
import displayStyles from "../../styles/Display.css";
import ClearInputButton from "../../components/ClearInputButton.js";

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
      temporal: {
        bool: false,
        origin: "2000-01-01T00:00:00",
        intervalInSeconds: 60,
        optimizer: true
      },
      styles: {
        choice: "",
        min: 0,
        max: 10
      },
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
  }

  setCurrentStep(currentStep) {
    this.setState({ currentStep });
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
  // handleInputNotificationName(e) {
  //   if (e.key === "Enter" && this.state.name) {
  //     this.setState({
  //       currentStep: 2
  //     });
  //   }
  // }
  goBackToStep(toStep) {
    if (toStep < this.state.currentStep) {
      this.setState({
        currentStep: toStep
      });
    }
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      this.setState({
        currentStep: this.state.currentStep + 1
      });
    }
  }

  componentDidMount() {
    document.getElementById("rasterName").focus();
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
      selectedOrganisation,
      currentStep,
      storePathName,
      description,
      aggregationType
    } = this.state;

    const { organisations } = this.props.bootstrap;

    return (
      <div>
        <div className={gridStyles.Container}>
          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
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
                      id="notifications_app.name_will_be_used_in_alerts"
                      defaultMessage="The name of the raster will be used in e-mail and SMS alerts"
                    />
                  } // <FormatText ... />
                  placeholder="name of this raster"
                  multiline={false} // boolean for which input elem to use: text OR textarea
                  step={1} // int for denoting which step it the GenericTextInputComponent refers to
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  modelValue={rasterName} // string: e.g. the name of a raster
                  updateModelValue={this.setRasterName} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={this.resetRasterName} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateNewRasterName} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />

                <NewRasterOrganisation
                  step={2}
                  currentStep={currentStep}
                  handleNextStepClick={() => this.setCurrentStep(3)}
                  allOrganisations={organisations}
                  isValid={this.validateNewRasterOrganisation(
                    this.state.selectedOrganisation
                  )}
                  setSelectedOrganisation={this.setSelectedOrganisation}
                  selectedOrganisation={selectedOrganisation}
                  resetSelectedOrganisation={this.resetSelectedOrganisation}
                  setCurrentStep={this.setCurrentStep}
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
                  step={3} // int for denoting which step it the GenericTextInputComponent refers to
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  modelValue={storePathName} // string: e.g. the name of a raster
                  updateModelValue={this.setStorePathName} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setStorePathName("")} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={storePathName => storePathName.length > 1} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                {/* <NewRasterStorePath
                  step={3}
                  currentStep={currentStep}
                  setCurrentStep={this.setCurrentStep}
                  isValid={storePathName.length > 1}
                  value={storePathName}
                  setParentState={this.setStorePathName}
                  resetParentState={() => this.setStorePathName("")}
                /> */}
                <GenericTextInputComponent
                  titleComponent={<FormatMessage id="rasters.description" />} // <FormatText ... //>
                  subtitleComponent={
                    <FormatMessage id="rasters.please_describe_the_new_raster" />
                  } // <FormatText ... />
                  placeholder="description here"
                  multiline={false} // boolean for which input elem to use: text OR textarea
                  step={4} // int for denoting which step it the GenericTextInputComponent refers to
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  modelValue={description} // string: e.g. the name of a raster
                  updateModelValue={this.setDescription} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setDescription("")} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={this.validateNewRasterDescription} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                {/* <NewRasterDescription
                  step={4}
                  currentStep={currentStep}
                  setCurrentStep={this.setCurrentStep}
                  //isValid={description.length > 1}
                  validate={this.validateNewRasterDescription}
                  value={description}
                  setParentState={this.setDescription}
                  resetParentState={() => this.setDescription("")}
                /> */}
                <GenericTextInputComponent
                  titleComponent={
                    <FormatMessage id="rasters.aggregation_type" />
                  } // <FormatText ... //>
                  subtitleComponent={
                    <FormatMessage id="rasters.please_select_type_of_aggregation" />
                  } // <FormatText ... />
                  placeholder="aggregation type"
                  multiline={false} // boolean for which input elem to use: text OR textarea
                  step={5} // int for denoting which step it the GenericTextInputComponent refers to
                  currentStep={currentStep} // int for denoting which step is currently active
                  setCurrentStep={this.setCurrentStep} // cb function for updating which step becomes active
                  modelValue={aggregationType} // string: e.g. the name of a raster
                  updateModelValue={this.setAggregationType} // cb function to *update* the value of e.g. a raster's name in the parent model
                  resetModelValue={() => this.setAggregationType("")} // cb function to *reset* the value of e.g. a raster's name in the parent model
                  validate={() => true} // cb function to validate the value of e.g. a raster's name in both the parent model as the child compoennt itself.
                />
                <GenericWizardStep
                  titleComponent={
                    <FormatMessage id="rasters.aggregation_type" />
                  }
                  inputComponent={
                    <div>
                      <input
                        id="rasterName"
                        tabIndex="-2"
                        type="text"
                        autoComplete="false"
                        className={formStyles.FormControl}
                        placeholder={"select aggregation"}
                        onChange={e => this.setAggregationType(e.target.value)}
                        value={aggregationType}
                      />
                      <ClearInputButton
                        className={
                          (value => value != "")(aggregationType)
                            ? displayStyles.Block
                            : displayStyles.None
                        }
                        onClick={e => {
                          this.setAggregationType("");
                        }}
                      />
                    </div>
                  }
                  step={6}
                  active={currentStep === 6}
                  opened={currentStep >= 6}
                  setCurrentStep={this.setCurrentStep}
                  modelValue={aggregationType}
                  validate={value => value != ""}
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
    bootstrap: state.bootstrap
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
  connect(mapStateToProps, mapDispatchToProps)(NewRasterModel)
);

export { NewRaster };
