import gridStyles from "../../styles/Grid.css";
import React, { Component } from "react";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import NewRasterName from "./NewRasterName";
import { NewRasterOrganisation } from "./NewRasterOrganisation";

class NewRasterModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      rasterName: "",

      selectedOrganisation: {
        name: "",
        unique_id: ""
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

    // old:

    this.setCurrentStep = this.setCurrentStep.bind(this);
    this.setRasterName = this.setRasterName.bind(this);
    this.setSelectedOrganisation = this.setSelectedOrganisation.bind(this);
    this.resetSelectedOrganisation = this.resetSelectedOrganisation.bind(this);

    // this.goBackToStep = this.goBackToStep.bind(this); // TO BE REPLACED BY this.setCurrentStep
  }
  hasSelectedOrganisation() {
    const { unique_id, name } = this.state.selectedOrganisation;
    return unique_id && name;
  }
  setCurrentStep(currentStep) {
    this.setState({ currentStep });
  }
  setRasterName(rasterName) {
    this.setState({ rasterName });
  }
  setSelectedOrganisation(selectedOrganisation) {
    this.setState({ selectedOrganisation });
  }
  resetSelectedOrganisation() {
    this.setState({ selectedOrganisation: { name: "", unique_id: "" } });
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
    const { rasterName, selectedOrganisation, currentStep } = this.state;

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
                  rasterName={rasterName}
                  setRasterName={this.setRasterName}
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
