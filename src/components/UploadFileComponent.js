import gridStyles from "../styles/Grid.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CheckMark from "./CheckMark";
import StepIndicator from "./StepIndicator";
import { FormattedMessage } from "react-intl";
import ClearInputButton from "./ClearInputButton.js";

import styles from "./GenericTextInputComponent.css";
import formStyles from "../styles/Forms.css";
import buttonStyles from "../styles/Buttons.css";
import inputStyles from "../styles/Input.css";

class UploadFileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: ""
    };
  }
  setLocalStateFromProps(props) {
    //if (props.parentState) {
    this.setState({ fileName: props.modelValue });
    //}
    // If this component is the "current step component", set the page focus to the components
    // input field:
    if (props.step === props.currentStep && !this.props.formUpdate) {
      const inputElem = document.getElementById(
        this.props.titleComponent.props.id + "_input"
      );
      // inputElem.focus(); does not work outside setTimeout. Is this the right solution?
      // setTimeout(function() {
      //   inputElem.focus();
      // }, 0);
    }
  }
  resetLocalState() {
    this.setState({ fileName: "" });
  }

  validateAndSaveToParent(fileName) {
    this.setState({ fileName });
    // this validationstep before updating the parent seems like over engineering :(
    // I comment it out
    //if (this.props.validate(fileName)) {
    this.props.updateModelValue(fileName);
    //}
  }
  handleEnter(event) {
    if (this.props.validate(this.state.fileName) && event.keyCode === 13) {
      // 13 is keycode 'enter' (works only when current input validates)
      this.props.setCurrentStep(this.props.step + 1);
    }
  }

  componentWillReceiveProps(newProps) {
    this.setLocalStateFromProps(newProps);
  }

  componentDidMount() {
    this.setLocalStateFromProps(this.props);
  }

  render() {
    const {
      titleComponent, // <FormatText ... //>
      subtitleComponent, // <FormatText ... />
      placeholder,
      multiline, // boolean for which input elem to use: text OR textarea
      step, // int for denoting which step it the UploadFileComponent refers to
      currentStep, // int for denoting which step is currently active
      setCurrentStep, // cb function for updating which step becomes active
      opened, // complete question and input fields become visible if set to true
      modelValue, // string: e.g. the name of a raster
      //updateModelValue, // cb function to *update* the value of e.g. a raster's name in the parent model
      resetModelValue, // cb function to *reset* the value of e.g. a raster's name in the parent model
      validate, // function used to validate the inputText. If validate returns true the inputText passed to updateModelValue and checkmark is set.
      formUpdate,
      readonly
    } = this.props;
    const active = step === currentStep || (formUpdate && !readonly);
    const showCheckMark = validate(this.state.fileName);
    const mustShowClearButton = modelValue !== "";
    const mustShowNextButton =
      validate(this.state.fileName) && active && !formUpdate;

    return (
      <div className={styles.Step} id={"Step-" + step}>
        <StepIndicator
          indicator={step}
          active={active}
          handleClick={() => {
            setCurrentStep(step);
          }}
        />
        <div className={inputStyles.InputContainer}>
          <h3 className={`mt-0 ${active ? "text-muted" : null}`}>
            {titleComponent}
            {showCheckMark ? <CheckMark /> : null}
          </h3>
          <div style={{ display: opened ? "block" : "none" }}>
            <p className="text-muted">{subtitleComponent}</p>
            <div
              className={
                formStyles.FormGroup + " " + inputStyles.PositionRelative
              }
            >
              <div>
                <input
                  type="file"
                  id="upload-raster-button"
                  onChange={e => this.validateAndSaveToParent(e.target.value)}
                  value={this.state.fileName}
                  accept=".tiff,.tif,.geotiff,.geotiff"
                />
                {mustShowClearButton ? (
                  <ClearInputButton
                    style={{ float: "left" }}
                    onClick={e => {
                      resetModelValue();
                      this.resetLocalState();
                    }}
                  />
                ) : null}
              </div>
              <div>
                {mustShowNextButton ? (
                  <button
                    className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                    style={{ marginTop: 10 }}
                    onClick={() => {
                      setCurrentStep(step + 1);
                    }}
                  >
                    <FormattedMessage
                      id="rasters.next_step"
                      defaultMessage="Next Step"
                    />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

UploadFileComponent = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UploadFileComponent)
);

export default UploadFileComponent;
