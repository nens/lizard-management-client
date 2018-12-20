import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CheckMark from "./CheckMark";
import StepIndicator from "./StepIndicator";
import { FormattedMessage } from "react-intl";
import ClearInputButton from "./ClearInputButton.js";

import styles from "./GenericWizardStep.css";
import formStyles from "../styles/Forms.css";
import buttonStyles from "../styles/Buttons.css";
import displayStyles from "../styles/Display.css";

class GenericWizardStep extends Component {
  render() {
    const {
      titleComponent, // <FormatText ... //>
      inputComponent,
      step, //  which step it the GenericTextInputComponent refers to
      active, // which step is currently active
      opened,
      setCurrentStep, // cb function for updating which step becomes active
      modelValue, // string: e.g. the name of a raster
      validate
    } = this.props;
    const showCheckMark = validate(modelValue);
    const showNextButton = validate(modelValue);

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
          {/* <div style={{ display: opened ? "block" : "none" }}> */}
          <div className={opened ? displayStyles.Block : displayStyles.None}>
            <div
              className={formStyles.FormGroup + " " + styles.PositionRelative}
            >
              {inputComponent}

              {showNextButton ? (
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
                  ;
                </button>
              ) : null}
            </div>
          </div>
          {/* </div> */}
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

GenericWizardStep = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GenericWizardStep)
);

export default GenericWizardStep;
