import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CheckMark from "./CheckMark";
import StepIndicator from "./StepIndicator";
import { FormattedMessage } from "react-intl";

import styles from "./GenericStep.css";
import formStyles from "../styles/Forms.css";
import buttonStyles from "../styles/Buttons.css";
import inputStyles from "../styles/Input.css";

class GenericStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wasEverOpen: false // holds if the question was ever opened by the user. If not no checkmark should be shown
    };
  }

  // this is currently not working properly !
  handleEnter(event) {
    if (
      /*this.props.validate(this.props.modelValue) && */ event.keyCode === 13
    ) {
      // 13 is keycode 'enter' (works only when current input validates)
      this.props.setCurrentStep(this.props.step + 1);
    }
  }
  componentWillReceiveProps(newProps) {
    //this.setLocalStateFromProps(newProps);
    const active = newProps.step === newProps.currentStep;

    if (active === true && this.state.wasEverOpen === false) {
      this.setState({ wasEverOpen: true });
    }
  }

  render() {
    const {
      titleComponent, // <FormatText ... //>
      subtitleComponent, // <FormatText ... />
      step, // which step of this GenericSelectBoxComponent it refers to
      currentStep, // which step is currently active
      setCurrentStep, // cb function for updating which step becomes active
      opened, // complete question and input fields become visible if set to true
      readonly,
      showCheckMark,
      showNextButton,
      fields
    } = this.props;
    const active = opened;

    return (
      <div>
        <StepIndicator
          indicator={step}
          active={active}
          handleClick={() => {
            !readonly && setCurrentStep(step);
          }}
        />

        <div className={inputStyles.InputContainer}>
          <h3 className={`mt-0 ${active ? "text-muted" : null}`}>
            {titleComponent}
            {showCheckMark ? <CheckMark /> : null}
          </h3>

          <div style={{ display: opened ? "block" : "none" }}>
            <p className="text-muted">{subtitleComponent}</p>
            <div
              className={
                formStyles.FormGroup + " " + inputStyles.PositionRelative
              }
            >
              {fields}

              {/* add div to force next button to newline. 
              Probably should use styling instead */}
              <div />

              {showNextButton ? (
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

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

GenericStep = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GenericStep)
);

export default GenericStep;
