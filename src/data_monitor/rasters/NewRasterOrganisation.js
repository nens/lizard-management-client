import buttonStyles from "../../styles/Buttons.css";
import React, { Component } from "react";
import styles from "./AlarmRow.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter, NavLink } from "react-router-dom";
import StepIndicator from "../../components/StepIndicator";
import CheckMark from "../../components/CheckMark";

import formStyles from "../../styles/Forms.css";
import SelectOrganisation from "../../components/SelectOrganisation";

class NewRasterOrganisation extends Component {
  constructor(props) {
    super(props);
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
      setCurrentStep,
      isFetching,

      organisations,
      setSelectedOrganisation,
      hasSelectedOrganisation,
      selectedOrganisation,
      isValid
    } = this.props;

    // let {
    // 	rasterOrganisation
    // } = this.state;

    return (
      <div className={styles.Step} id="Step">
        <div className="media">
          <StepIndicator
            indicator={step}
            active={currentStep === step}
            handleClick={() => setCurrentStep(step)}
          />
          <div
            style={{
              width: "calc(100% - 90px)",
              marginLeft: 90
            }}
          >
            <h3 className={`mt-0 ${currentStep !== 2 ? "text-muted" : null}`}>
              <FormattedMessage
                id="raster.organisation_selection"
                defaultMessage="Organisation"
              />
              {isValid ? <CheckMark /> : null}
            </h3>
            {currentStep === 2 ? (
              <div>
                <p className="text-muted">
                  <FormattedMessage
                    id="notifications_app.which_temporal_raster_to_use"
                    defaultMessage="Which organsiation belongs the new raster to?"
                  />
                </p>
                <div className={formStyles.FormGroup}>
                  <SelectOrganisation
                    placeholderText="Type to search"
                    organisations={organisations}
                    loading={isFetching}
                    selected={selectedOrganisation}
                    setValue={setSelectedOrganisation}
                    resetSelectedOrganisation={
                      this.props.resetSelectedOrganisation
                    }
                  />
                  {selectedOrganisation.unique_id ? (
                    <button
                      type="button"
                      className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                      style={{ marginTop: 10 }}
                      onClick={() => this.setState({ currentStep: 3 })}
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
    organisations: state.bootstrap.organisations,
    isFetching: state.bootstrap.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

NewRasterOrganisation = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewRasterOrganisation)
);

export { NewRasterOrganisation };
