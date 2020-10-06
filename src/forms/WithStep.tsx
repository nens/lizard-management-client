import React, { Component } from "react";
import { connect } from "react-redux";

import CheckMark from "./CheckMark";
import StepIndicator from "./StepIndicator";
import { FormattedMessage } from "react-intl";
import ClearInputButton from "./ClearInputButton";

import formStyles from "../styles/Forms.css";
import inputStyles from "../styles/Input.css";
import buttonStyles from "../styles/Buttons.css";

interface WithStepProps {
  step: number;
  title?: string;
  subtitle?: string;
  opened: boolean;
  showCheck: boolean;
  showErrors: boolean;
  wizardStyle: boolean;
  isLastStep?: boolean;
  nextStep?: () => void;
  selectStep?: ((event: any) => void);
  validated: boolean;
  errors: string[];
}

class WithStep extends Component<WithStepProps, {}> {
  render() {
    const {
      title,
      subtitle,
      step,
      opened,
      validated,
      errors,
      showCheck,
      showErrors,
      nextStep,
      selectStep,
      wizardStyle,
      isLastStep
    } = this.props;
    /* const mustShowClearButton = modelValue !== ""; */

    const mustShowClearButton = true;
    const resetModelValue = () => null;

    return (
      <div id={"Step-" + step}>
        <StepIndicator
          indicator={step}
          active={opened}
          handleClick={selectStep}
        />
        <div className={inputStyles.InputContainer}>
          <h3
            className={`mt-0 ${opened ? "text-muted" : null}`}
            onClick={selectStep}
          >
            {title}
            {validated && showCheck ? <CheckMark /> : null}
          </h3>
          <div style={{ display: opened ? "block" : "none" }}>
            <p className="text-muted">{subtitle}</p>
            <div
              className={
              formStyles.FormGroup + " " + inputStyles.PositionRelative
              }
            >
              {this.props.children}
              {wizardStyle && !isLastStep ? (
                <button
                  className={`${buttonStyles.Button} ` + (validated ? buttonStyles.Success : buttonStyles.Inactive)}
                  style={{ marginTop: 10, marginRight: 10 }}
                  onClick={this.props.nextStep}
                >
                  <FormattedMessage
                    id="rasters.next_step"
                    defaultMessage="Next Step"
                  />
                </button>
              ) : null}
              {showErrors ? (
                <span className={formStyles.Errors}>{errors}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default WithStep;
