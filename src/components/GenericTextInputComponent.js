import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CheckMark from "./CheckMark";
import StepIndicator from "./StepIndicator";
import FormatMessage from "../utils/FormatMessage.js";
import ClearInputButton from "./ClearInputButton.js";

import styles from "./GenericTextInputComponent.css";
import formStyles from "../styles/Forms.css";
import buttonStyles from "../styles/Buttons.css";

class GenericTextInputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: ""
    };
  }
  setLocalStateFromProps(prop) {
    if (prop.parentState) {
      this.setState({ inputText: prop.modelValue });
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
  componentWillReceiveProps(newProps) {
    this.setLocalStateFromProps(newProps.modelValue);
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
      modelValue, // string: e.g. the name of a raster
      updateModelValue, // cb function to *update* the value of e.g. a raster's name in the parent model
      resetModelValue, // cb function to *reset* the value of e.g. a raster's name in the parent model
      validate
    } = this.props;
    const active = step === currentStep;
    const opened = currentStep >= step;
    const showCheckMark = validate(this.state.inputText);
    const showClearButton = modelValue !== "";
    const showNextButton = validate(this.state.inputText);

    return (
      <div className={styles.Step} id="Step">
        <StepIndicator
          indicator={step}
          active={active}
          handleClick={() => {
            setCurrentStep(step);
          }}
        />
        <div className={styles.InputContainer}>
          <h3 className={`mt-0 ${active ? "text-muted" : null}`}>
            {titleComponent}
            {showCheckMark ? <CheckMark /> : null}
          </h3>
          <div style={{ display: opened ? "block" : "none" }}>
            <p className="text-muted">{subtitleComponent}</p>
            <div
              className={formStyles.FormGroup + " " + styles.PositionRelative}
            >
              {multiline ? (
                <textarea
                  id="rasterName"
                  rows="3"
                  tabIndex="-2"
                  type="text"
                  autoComplete="false"
                  className={formStyles.FormControl}
                  placeholder={placeholder}
                  onChange={e => this.validateAndSaveToParent(e.target.value)}
                  value={this.state.inputText}
                />
              ) : (
                <input
                  id="rasterName"
                  tabIndex="-2"
                  type="text"
                  autoComplete="false"
                  className={formStyles.FormControl}
                  placeholder={placeholder}
                  onChange={e => this.validateAndSaveToParent(e.target.value)}
                  value={this.state.inputText}
                />
              )}
              {showClearButton ? (
                <ClearInputButton
                  onClick={e => {
                    resetModelValue();
                    this.resetLocalState();
                  }}
                />
              ) : null}
              {showNextButton ? (
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

GenericTextInputComponent = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GenericTextInputComponent)
);

export default GenericTextInputComponent;
