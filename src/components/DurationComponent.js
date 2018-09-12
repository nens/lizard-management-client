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
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     days: 1,
  //     hours: 0,
  //     minutes: 0,
  //     seconds: 0,
  //   };
  // }
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
    const showCheckMark = validate(this.props.modelValue);
    const mustShowClearButton = modelValue !== "";
    const mustShowNextButton = validate(this.props) && active;

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
                class={
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
                    formStyles.FormControl + " " + styles.TextAlignRight
                  }
                  maxLength="2"
                  size="4"
                  placeholder={placeholder}
                  onChange={e =>
                    this.props.updateModelValueDays(e.target.value)}
                  value={modelValueDays}
                  //onKeyUp={e => this.handleEnter(e)}
                />
              </div>
              <div
                class={styles.DurationInputFields + " " + styles.TextAlignRight}
              >
                <label>Hours</label>
                <input
                  id={titleComponent.props.id + "_input"}
                  tabIndex="-2"
                  type="text"
                  autoComplete="false"
                  className={
                    formStyles.FormControl + " " + styles.TextAlignRight
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
              <div class={styles.DurationInputHourSecondSeperator}>:</div>
              <div class={styles.DurationInputFields}>
                <label>Mins</label>
                <input
                  id={titleComponent.props.id + "_input"}
                  tabIndex="-2"
                  type="text"
                  autoComplete="false"
                  className={formStyles.FormControl}
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
                class={
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
                  className={formStyles.FormControl}
                  maxLength="2"
                  size="4"
                  placeholder={placeholder}
                  onChange={e =>
                    this.props.updateModelValueSeconds(e.target.value)}
                  value={modelValueSeconds}
                  //onKeyUp={e => this.handleEnter(e)}
                />
              </div>

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
