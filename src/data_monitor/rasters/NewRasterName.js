import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
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
      textInput: ""
    };
  }
  handleNextStepClick() {
    // for parent:
    this.props.setRasterName(this.state.textInput);
    // intern:
    this.setState({ textInput: "" });
  }
  componentWillReceiveProps(newProps) {
    if (newProps.rasterName) this.setState({ textInput: newProps.rasterName });
  }
  render() {
    let { step, currentStep, setCurrentStep, isValid } = this.props;
    let { textInput } = this.state;
    const active = step === currentStep;

    return (
      <div className={styles.Step} id="Step">
        <StepIndicator
          indicator={step}
          active={active}
          handleClick={() => setCurrentStep(step)}
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
                  onChange={e => this.setState({ textInput: e.target.value })}
                  value={textInput}
                />
                {textInput.length > 1 ? (
                  <ClearInputButton
                    onClick={() => {
                      this.props.resetSelectedOrganisation();
                      this.resetQuery();
                    }}
                  />
                ) : null}
                {textInput.length > 1 ? (
                  <button
                    className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                    style={{ marginTop: 10 }}
                    onClick={() => {
                      setCurrentStep(step + 1);
                      this.handleNextStepClick();
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
