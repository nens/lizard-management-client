import buttonStyles from "../../styles/Buttons.css";
import React, { Component } from "react";
import styles from "./AlarmRow.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter, NavLink } from "react-router-dom";
import StepIndicator from "../../components/StepIndicator";
import formStyles from "../../styles/Forms.css";

class NewRasterName extends Component {
  constructor(props) {
    super(props);
    ///*
    this.state = {
      isFetching: true,
      isActive: true //props.alarm.active
    };
    //*/
    //this.activateAlarm = this.activateAlarm.bind(this);
    //this.deActivateAlarm = this.deActivateAlarm.bind(this);
  }

  render() {
    //const { alarm } = this.props;
    //const { isActive } = this.state;
    //const numberOfThresholds = 1; //threshold not defined on raster remove feature later, but hardcode now just to test page //alarm.thresholds.length;
    //const numberOfRecipients = 1; // iem // alarm.messages.length;
    // const step = 1;
    // const rasterName = 'dummie';
    let {
      step,
      currentStep,
      rasterName,
      setRasterName,
      setCurrentStep
    } = this.props;
    return (
      <div className={styles.Step} id="Step">
        <div className="media">
          <StepIndicator
            indicator={step}
            active={step === currentStep}
            handleClick={() => setCurrentStep(step)}
          />
          <div
            style={{
              width: "calc(100% - 90px)",
              marginLeft: 90
            }}
          >
            <h3
              className={`mt-0 ${step === currentStep ? "text-muted" : null}`}
            >
              <FormattedMessage
                id="rasters.raster"
                defaultMessage="Name of this raster"
              />
            </h3>
            {step === currentStep ? (
              <div>
                <p className="text-muted">
                  <FormattedMessage
                    id="notifications_app.name_will_be_used_in_alerts"
                    defaultMessage="The name of the raster will be used in e-mail and SMS alerts"
                  />
                </p>
                <div className={formStyles.FormGroup}>
                  <input
                    id="rasterName"
                    tabIndex="-2"
                    type="text"
                    autoComplete="false"
                    className={formStyles.FormControl}
                    placeholder="Name of this alarm"
                    onChange={e => setRasterName(e.target.value)}
                    value={rasterName}
                  />
                  {rasterName.length > 1 && rasterName ? (
                    <button
                      type="button"
                      className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                      style={{ marginTop: 10 }}
                      onClick={() => {
                        /*
                                  this.setState({
                                    step: 2
                                  });
                                  //*/
                        setCurrentStep(step + 1);
                      }}
                    >
                      <FormattedMessage
                        id="notifications_app.next_step"
                        defaultMessage="Next step"
                      />
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    bootstrap: state.bootstrap
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

NewRasterName = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewRasterName)
);

export { NewRasterName };
