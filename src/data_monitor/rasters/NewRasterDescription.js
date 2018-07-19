import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CheckMark from "../../components/CheckMark";
import StepIndicator from "../../components/StepIndicator";
import FormatMessage from "../../utils/FormatMessage.js";
import ClearInputButton from "../../components/ClearInputButton.js";

import styles from "./NewRasterDescription.css";
import formStyles from "../../styles/Forms.css";
import buttonStyles from "../../styles/Buttons.css";

class NewRasterDescription extends Component {
  render() {
    const {
      step,
      currentStep,
      setCurrentStep,
      // isValid,
      validate,
      value,
      setParentState,
      resetParentState
    } = this.props;
    const active = step === currentStep;
    const showCheckmark = validate(value);
    const showClearButton = value && value.length > 1;
    const showNextButton = validate(value);

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
            <FormatMessage id="rasters.description" />
            {showCheckmark ? <CheckMark /> : null}
          </h3>
          {active ? (
            <div>
              <p className="text-muted">
                <FormatMessage id="notifications_app.please_describe_the_new_raster" />
              </p>
              <div
                className={formStyles.FormGroup + " " + styles.PositionRelative}
              >
                <textarea
                  className={styles.Textarea + " " + formStyles.FormControl}
                  rows="3"
                  id="rasterName"
                  tabIndex="-2"
                  type="text"
                  autoComplete="false"
                  placeholder="description of raster"
                  onChange={e => {
                    if (validate(e.target.value)) {
                      setParentState(e.target.value);
                    }
                  }}
                  //value={value}
                />
                {showClearButton > 0 ? (
                  <ClearInputButton
                    onClick={() => {
                      resetParentState();
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
          ) : null}
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

NewRasterDescription = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewRasterDescription)
);

export default NewRasterDescription;
