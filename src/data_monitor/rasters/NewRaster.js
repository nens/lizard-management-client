import gridStyles from "../../styles/Grid.css";
import React, { Component } from "react";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import NewRasterName from "./NewRasterName";
import { NewRasterOrganisation } from "./NewRasterOrganisation";
import NewStorePathName from "./NewStorePathName";
import NewDescription from "./NewDescription";
import bindReactFunctions from "../../utils/BindReactFunctions.js";

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
      aggregationType: "",
      supplierId: "",
      supplierCode: "",
      observationType: "",
      sharedWith: []
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
  hasSelectedOrganisation() {
    const { unique_id, name } = this.state.selectedOrganisation;
    return unique_id && name;
  }
  setSelectedOrganisation(selectedOrganisation) {
    this.setState({ selectedOrganisation });
  }
  resetSelectedOrganisation() {
    this.setState({ selectedOrganisation: { name: "", unique_id: "" } });
  }
  setStorePathName(storePathName) {
    this.setState({ storePathName });
  }
  setDescription(description) {
    this.setState({ description });
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
  componentDidMount() {
    document.getElementById("rasterName").focus();
  }
  componentWillUnmount() {}
  render() {
    const {
      rasterName,
      selectedOrganisation,
      currentStep,
      storePathName,
      description
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
                <NewRasterName
                  step={1}
                  currentStep={currentStep}
                  setCurrentStep={this.setCurrentStep}
                  isValid={rasterName.length > 1}
                  parentState={rasterName}
                  setParentState={this.setRasterName}
                  resetParentState={this.resetRasterName}
                />
                <NewRasterOrganisation
                  step={2}
                  currentStep={currentStep}
                  handleNextStepClick={() => this.setCurrentStep(3)}
                  isValid={this.hasSelectedOrganisation()}
                  allOrganisations={organisations}
                  hasSelectedOrganisation={this.hasSelectedOrganisation()}
                  setSelectedOrganisation={this.setSelectedOrganisation}
                  selectedOrganisation={selectedOrganisation}
                  resetSelectedOrganisation={this.resetSelectedOrganisation}
                  setCurrentStep={this.setCurrentStep}
                />
                <NewStorePathName
                  step={3}
                  currentStep={currentStep}
                  setCurrentStep={this.setCurrentStep}
                  isValid={storePathName.length > 1}
                  value={storePathName}
                  setParentState={this.setStorePathName}
                  resetParentState={() => this.setStorePathName("")}
                />
                <NewDescription
                  step={4}
                  currentStep={currentStep}
                  setCurrentStep={this.setCurrentStep}
                  isValid={description.length > 1}
                  value={description}
                  setParentState={this.setDescription}
                  resetParentState={() => this.setDescription("")}
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
