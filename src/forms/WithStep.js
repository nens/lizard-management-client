import React, { Component } from "react";
import { connect } from "react-redux";

import CheckMark from "../components/CheckMark";
import StepIndicator from "../components/StepIndicator";
import { FormattedMessage } from "react-intl";
import ClearInputButton from "../components/ClearInputButton.js";

import formStyles from "../styles/Forms.css";
import inputStyles from "../styles/Input.css";
import buttonStyles from "../styles/Buttons.css";


class WithStep extends Component {
  render() {
    const {
      title,
      step,
      /* titleComponent, // <FormatText ... //>
       * subtitleComponent, // <FormatText ... />
       * placeholder,
       * step, // which step of the TextInputField it refers to
       * showCheckMark,
       * mustShowNextButton,
       * active,
       * currentStep, // which step is currently active
       * //  setCurrentStep, // cb function for updating which step becomes active
       * opened, // complete question and input fields become visible if set to true
       * modelValue, // string: e.g. the name of a raster
       * //updateModelValue, // cb function to *update* the value of e.g. a raster's name in the parent model
       * resetModelValue, // cb function to *reset* the value of e.g. a raster's name in the parent model
       * validate, // function used to validate the inputText. If validate returns true the inputText passed to updateModelValue and checkmark is set.
       * formUpdate,
       * readonly */
    } = this.props;
    /* const mustShowClearButton = modelValue !== ""; */

    const setCurrentStep = (step) => null;

    const active = true;
    const showCheckMark = true;
    const opened = true;
    const subtitleComponent = "Subtitle";
    const mustShowClearButton = true;
    const resetModelValue = () => null;
    const mustShowNextButton = true;

    return (
      <div id={"Step-" + step}>
      <StepIndicator
      indicator={step}
          active={active}
          handleClick={() => null}
        />
        <div className={inputStyles.InputContainer}>
          <h3 className={`mt-0 ${active ? "text-muted" : null}`}>
            {title}
            {showCheckMark ? <CheckMark /> : null}
          </h3>
          <div style={{ display: opened ? "block" : "none" }}>
            <p className="text-muted">{subtitleComponent}</p>
            <div
              className={
              formStyles.FormGroup + " " + inputStyles.PositionRelative
              }
            >
              {this.props.children}
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


export default WithStep;
