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

class GenericTextInputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: ""
    };
  }
  setLocalStateFromProps(props) {
    //if (props.parentState) {
    this.setState({ inputText: props.modelValue });
    //}
    // If this component is the "current step component", set the page focus to the components
    // input field:
    if (props.step === props.currentStep) {
      const inputElem = document.getElementById(
        this.props.titleComponent.props.id + "_input"
      );
      // inputElem.focus(); does not work outside setTimeout. Is this the right solution?
      setTimeout(function() {
        inputElem.focus();
      }, 0);
    }
  }
  resetLocalState() {
    this.setState({ inputText: "" });
  }

  validateAndSaveToParent(inputText) {
    this.setState({ inputText });
    if (this.props.validate(inputText)) {
      this.props.updateModelValue(inputText);
    }
  }
  handleEnter(event) {
    if (this.props.validate(this.state.inputText) && event.keyCode === 13) {
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
      step, // int for denoting which step it the GenericTextInputComponent refers to
      currentStep, // int for denoting which step is currently active
      setCurrentStep, // cb function for updating which step becomes active
      opened, // complete question and input fields become visible if set to true
      modelValue, // string: e.g. the name of a raster
      //updateModelValue, // cb function to *update* the value of e.g. a raster's name in the parent model
      resetModelValue, // cb function to *reset* the value of e.g. a raster's name in the parent model
      validate // function used to validate the inputText. If validate returns true the inputText passed to updateModelValue and checkmark is set.
    } = this.props;
    const active = step === currentStep;
    const showCheckMark = validate(this.state.inputText);
    const mustShowClearButton = modelValue !== "";
    const mustShowNextButton = validate(this.state.inputText) && active;

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
              {multiline ? (
                <textarea
                  id={titleComponent.props.id + "_input"}
                  rows="3"
                  tabIndex="-2"
                  type="text"
                  autoComplete="false"
                  className={formStyles.FormControl}
                  placeholder={placeholder}
                  onChange={e => this.validateAndSaveToParent(e.target.value)}
                  value={this.state.inputText}
                  // onKeyUp={e => this.handleEnter(e)}
                />
              ) : (
                <input
                  id={titleComponent.props.id + "_input"}
                  tabIndex="-2"
                  type="text"
                  autoComplete="false"
                  className={formStyles.FormControl}
                  placeholder={placeholder}
                  onChange={e => this.validateAndSaveToParent(e.target.value)}
                  value={this.state.inputText}
                  onKeyUp={e => this.handleEnter(e)}
                />
              )}
              {mustShowClearButton ? (
                <ClearInputButton
                  onClick={e => {
                    resetModelValue();
                    this.resetLocalState();
                  }}
                />
              ) : null}
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
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

GenericTextInputComponent = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GenericTextInputComponent)
);

export default GenericTextInputComponent;
