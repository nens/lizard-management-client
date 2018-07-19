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
      inputText: ""
    };
  }
  resetLocalState() {
    this.setState({ inputText: "" });
  }

  validateAndSaveToParent(inputText) {
    this.setState({ inputText });
    if (this.props.validate(inputText)) {
      this.props.setParentState(inputText);
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.parentState)
      this.setState({ inputText: newProps.parentState });
  }
  render() {
    const {
      step,
      currentStep,
      setCurrentStep,
      validate,
      setParentState,
      resetParentState
    } = this.props;
    const { inputText } = this.state;
    const active = step === currentStep;
    const showCheckMark = validate(inputText);
    const showClearButton = inputText !== "";
    const showNextButton = validate(inputText);

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
            <FormatMessage id="rasters.name_of_this_raster" />
            {showCheckMark ? <CheckMark /> : null}
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
                  onChange={e => this.validateAndSaveToParent(e.target.value)}
                  value={inputText}
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
                      setParentState(inputText);
                      //this.resetLocalState();
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
