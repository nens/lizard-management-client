import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CheckMark from "./CheckMark";
import StepIndicator from "./StepIndicator";
import FormatMessage from "../utils/FormatMessage.js";
import ClearInputButton from "./ClearInputButton.js";

import styles from "./DurationComponent.css";
import formStyles from "../styles/Forms.css";
import buttonStyles from "../styles/Buttons.css";
import inputStyles from "../styles/Input.css";

class DurationComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wasEverOpen: false // holds if the question was ever opened by the user. If not no checkmark should be shown
    };
  }
  componentWillReceiveProps(newProps) {
    console.log(
      "[F] componentWillReceiveProps",
      newProps.step,
      newProps.currentStep
    );
    //this.setLocalStateFromProps(newProps);
    const active = newProps.step === newProps.currentStep;

    if (active === true && this.state.wasEverOpen === false) {
      console.log("[F] componentWillReceiveProps 2");
      this.setState({ wasEverOpen: true });
    }
  }

  setLocalStateFromProps(props) {
    // if (props.parentState) {
    //   this.setState({ inputText: props.modelValue });
    // }

    // If this component is the "current step component", set the page focus to the components
    // input field:
    if (props.step === props.currentStep) {
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

  // // return /^[1-9][0-9]*$/.test(temporalIntervalAmount);
  // validateDays(days){
  //   return /^[1-9][0-9]*$/.test(days);
  // }
  // validateHours(hours) {
  //   // return /^[0-9][0-9]$/.test(hours) && parseInt(hours) < 24;
  //   return /^[0-9]{1,2}$/.test(hours) && parseInt(hours) < 24;
  // }
  // validateMinutes(minutes) {
  //   // return /^[0-9][0-9]$/.test(minutes) && parseInt(minutes) < 60;
  //   return /^[0-9]{1,2}$/.test(minutes) && parseInt(minutes) < 60;
  // }
  // validateSeconds(seconds) {
  //   // return /^[0-9][0-9]$/.test(seconds) && parseInt(seconds) < 60;
  //   return /^[0-9]{1,2}$/.test(seconds) && parseInt(seconds) < 60;
  // }

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
      modelValueDays,
      modelValueHours,
      modelValueMinutes,
      modelValueSeconds,
      //updateModelValue, // cb function to *update* the value of e.g. a raster's name in the parent model
      resetModelValue, // cb function to *reset* the value of e.g. a raster's name in the parent model
      validate // function used to validate the inputText. If validate returns true the inputText passed to updateModelValue and checkmark is set.
    } = this.props;
    const active = step === currentStep;
    // const showCheckMark = validate(this.state.inputText);
    const valid = validate(
      modelValueDays,
      modelValueHours,
      modelValueMinutes,
      modelValueSeconds
    );
    const showCheckMark = valid;
    const mustShowClearButton = modelValue !== "";
    const mustShowNextButton = valid && active;

    console.log("wasEverOpen", this.state.wasEverOpen);

    const daysValid = this.props.validateDays(modelValueDays);
    const hoursValid = this.props.validateHours(modelValueHours);
    const minutesValid = this.props.validateMinutes(modelValueMinutes);
    const secondsValid = this.props.validateSeconds(modelValueSeconds);

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
              <div
                className={
                  styles.DurationInputFields +
                  " " +
                  styles.DurationInputFieldDays +
                  " " +
                  styles.TextAlignRight
                }
              >
                <label>Days</label>
                <input
                  id={titleComponent.props.id + "_input"}
                  tabIndex="-2"
                  type="text"
                  autoComplete="false"
                  className={
                    formStyles.FormControl +
                    " " +
                    styles.TextAlignRight +
                    (!daysValid ? " " + styles.Invalid : "")
                  }
                  maxLength="4"
                  size="4"
                  placeholder={placeholder}
                  onChange={e =>
                    this.props.updateModelValueDays(e.target.value)}
                  value={modelValueDays}
                  //onKeyUp={e => this.handleEnter(e)}
                />
              </div>
              <div
                className={
                  styles.DurationInputFields + " " + styles.TextAlignRight
                }
              >
                <label>Hours</label>
                <input
                  id={titleComponent.props.id + "_input"}
                  tabIndex="-2"
                  type="text"
                  autoComplete="false"
                  className={
                    formStyles.FormControl +
                    " " +
                    styles.TextAlignRight +
                    (!hoursValid ? " " + styles.Invalid : "")
                  }
                  maxLength="2"
                  size="2"
                  placeholder={placeholder}
                  onChange={e =>
                    this.props.updateModelValueHours(e.target.value)}
                  value={modelValueHours}
                  //onKeyUp={e => this.handleEnter(e)}
                />
              </div>
              <div className={styles.DurationInputHourSecondSeperator}>:</div>
              <div className={styles.DurationInputFields}>
                <label>Mins</label>
                <input
                  id={titleComponent.props.id + "_input"}
                  tabIndex="-2"
                  type="text"
                  autoComplete="false"
                  className={
                    formStyles.FormControl +
                    (!minutesValid ? " " + styles.Invalid : "")
                  }
                  maxLength="2"
                  size="2"
                  placeholder={placeholder}
                  onChange={e =>
                    this.props.updateModelValueMinutes(e.target.value)}
                  value={modelValueMinutes}
                  //onKeyUp={e => this.handleEnter(e)}
                />
              </div>
              <div
                className={
                  styles.DurationInputFields +
                  " " +
                  styles.DurationInputFieldSeconds
                }
              >
                <label>Seconds</label>
                <input
                  id={titleComponent.props.id + "_input"}
                  tabIndex="-2"
                  type="text"
                  autoComplete="false"
                  className={
                    formStyles.FormControl +
                    (!secondsValid ? " " + styles.Invalid : "")
                  }
                  maxLength="2"
                  size="4"
                  placeholder={placeholder}
                  onChange={e =>
                    this.props.updateModelValueSeconds(e.target.value)}
                  value={modelValueSeconds}
                  //onKeyUp={e => this.handleEnter(e)}
                />
              </div>
              <div />
              {/* above div to make layout newline */}
              {mustShowNextButton ? (
                <button
                  className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                  style={{ marginTop: 10 }}
                  onClick={() => {
                    setCurrentStep(step + 1);
                  }}
                >
                  <FormatMessage id="notifications_app.next_step" />
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

DurationComponent = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DurationComponent)
);

export default DurationComponent;
