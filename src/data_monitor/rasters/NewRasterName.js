import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CheckMark from "../../components/CheckMark";
import StepIndicator from "../../components/StepIndicator";
import FormatMessage from "../../utils/FormatMessage.js";
import ClearInputButton from "../../components/ClearInputButton.js";

import styles from "./NewRasterName.css";
import formStyles from "../../styles/Forms.css";
import buttonStyles from "../../styles/Buttons.css";

class NewRasterName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localState: ""
    };
  }
  resetLocalState() {
    this.setState({ localState: "" });
  }
  componentWillReceiveProps(newProps) {
    if (newProps.parentState)
      this.setState({ localState: newProps.parentState });
  }
  render() {
    const {
      step,
      currentStep,
      setCurrentStep,
      isValid,
      setParentState,
      resetParentState
    } = this.props;
    const { localState } = this.state;
    const active = step === currentStep;
    const showClearButton = localState.length > 0;
    const showNextButton = localState.length > 1;

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
            <FormatMessage id="rasters.name_of_this_raster" />
            {isValid ? <CheckMark /> : null}
          </h3>
          {active ? (
            <div>
              <p className="text-muted">
                <FormatMessage
                  id="notifications_app.name_will_be_used_in_alerts"
                  defaultMessage="The name of the raster will be used in e-mail and SMS alerts"
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
                  placeholder="Name of this alarm"
                  onChange={e => this.setState({ localState: e.target.value })}
                  value={localState}
                />
                {showClearButton > 0 ? (
                  <ClearInputButton
                    onClick={() => {
                      resetParentState();
                      this.resetLocalState();
                    }}
                  />
                ) : null}
                {showNextButton ? (
                  <button
                    className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                    style={{ marginTop: 10 }}
                    onClick={() => {
                      setParentState(localState);
                      this.resetLocalState();
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

NewRasterName = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewRasterName)
);

export default NewRasterName;
