import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CheckMark from "../../components/CheckMark";
import StepIndicator from "../../components/StepIndicator";
import FormatMessage from "../../utils/FormatMessage.js";
import ClearInputButton from "../../components/ClearInputButton.js";

import styles from "./NewStorePathName.css";
import formStyles from "../../styles/Forms.css";
import buttonStyles from "../../styles/Buttons.css";

class NewStorePathName extends Component {
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
            // currently we can only allow to go to steps backwards because
            // going forward can only be allowed with the 'next step' button,
            // since this is the only way that local state is written to parent state
            if (currentStep > step) setCurrentStep(step);
          }}
        />
        <div className={styles.InputContainer}>
          <h3 className={`mt-0 ${active ? "text-muted" : null}`}>
            <FormatMessage id="rasters.url_name" />
            {isValid ? <CheckMark /> : null}
          </h3>
          {active ? (
            <div>
              <p className="text-muted">
                <FormatMessage
                  id="notifications_app.url_name_to_retrieve"
                  defaultMessage="URL name to retrieve raster"
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
                  placeholder="pathname/of/url"
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

NewStorePathName = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewStorePathName)
);

export default NewStorePathName;
