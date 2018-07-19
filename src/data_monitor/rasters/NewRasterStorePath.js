import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CheckMark from "../../components/CheckMark";
import StepIndicator from "../../components/StepIndicator";
import FormatMessage from "../../utils/FormatMessage.js";
import ClearInputButton from "../../components/ClearInputButton.js";

import styles from "./NewRasterStorePath.css";
import formStyles from "../../styles/Forms.css";
import buttonStyles from "../../styles/Buttons.css";

class NewRasterStorePath extends Component {
  render() {
    const {
      step,
      currentStep,
      setCurrentStep,
      isValid,
      value,
      setParentState,
      resetParentState
    } = this.props;
    const active = step === currentStep;
    const showClearButton = value && value.length > 1;
    const showNextButton = value && value.length > 1;

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
            <FormatMessage id="rasters.store_path" />
            {isValid ? <CheckMark /> : null}
          </h3>
          {active ? (
            <div>
              <p className="text-muted">
                <FormatMessage
                  id="rasters.path_on_disk"
                  defaultMessage="Relative path of raster store. Should be unique within organisation. Multiple, comma-separated paths allowed."
                />
              </p>
              <div
                className={formStyles.FormGroup + " " + styles.PositionRelative}
              >
                <input
                  id="rasterName"
                  tabIndex="-2"
                  type="text"
                  autoComplete="false"
                  className={formStyles.FormControl}
                  placeholder="path/to/store"
                  onChange={e => setParentState(e.target.value)}
                  value={value}
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

NewRasterStorePath = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewRasterStorePath)
);

export default NewRasterStorePath;
