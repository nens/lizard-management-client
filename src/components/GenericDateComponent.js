import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CheckMark from "./CheckMark";
import StepIndicator from "./StepIndicator";
import { FormattedMessage } from "react-intl";
// moment is required for datepicker
import moment from "moment";
import "moment/locale/nl";
import InputMoment from "input-moment";
import "input-moment/dist/input-moment.css";

import styles from "./GenericDateComponent.css";
import "./GenericDateComponentSymbols.css";
import displayStyles from "../styles/Display.css";

import formStyles from "../styles/Forms.css";
import buttonStyles from "../styles/Buttons.css";
import inputStyles from "../styles/Input.css";

class GenericDateComponent extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     wasEverOpen: false // holds if the question was ever opened by the user. If not no checkmark should be shown
  //   };
  // }

  // this is currently not working properly !
  handleEnter(event) {
    if (
      /*this.props.validate(this.props.modelValue) && */ event.keyCode === 13
    ) {
      // 13 is keycode 'enter' (works only when current input validates)
      this.props.setCurrentStep(this.props.step + 1);
    }
  }
  // componentWillReceiveProps(newProps) {
  //   //this.setLocalStateFromProps(newProps);
  //   const active = newProps.step === newProps.currentStep;

  //   if (active === true && this.state.wasEverOpen === false) {
  //     this.setState({ wasEverOpen: true });
  //   }
  // }

  render() {
    const {
      titleComponent, // <FormatText ... //>
      subtitleComponent, // <FormatText ... />
      step, // int for denoting which step it this GenericSelectBoxComponent refers to
      currentStep, // int for denoting which step is currently active
      setCurrentStep, // cb function for updating which step becomes active
      opened, // complete question and input fields become visible if set to true
      modelValue, // momentJS obj moment()
      updateModelValue, // cb function to *update* the value
      validate, //
      readonly,
      formUpdate
    } = this.props;
    const active = step === currentStep || (formUpdate && !readonly);
    const showCheckMark = validate(modelValue) || formUpdate;
    const showNextButton = validate(modelValue) && !formUpdate;

    return (
      <div className={styles.Step} id={"Step-" + step}>
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
              {/* <input
                className="output"
                type="text"
                value={modelValue.format()}
                readOnly
              /> */}
              <span
                style={{ color: "rgb(19, 133, 229)", cursor: "not-allowed" }}
              >
                {modelValue.lang(
                  localStorage.getItem("lizard-preferred-language") || "en"
                ) && modelValue.format("LLLL")}
              </span>
              <div />
              <div className={readonly ? displayStyles.None : null}>
                <InputMoment
                  moment={modelValue}
                  onChange={e => updateModelValue(e)}
                  // onSave={e=>this.setTemporalOrigin(e)}
                  //minStep={1} // default
                  //hourStep={1} // default
                  //prevMonthIcon="ion-ios-arrow-left" // default // problem loading in these icons therefore use custom css
                  //nextMonthIcon="ion-ios-arrow-right" // default // problem loading in these icons therefore use custom css
                  prevMonthIcon="date-time-picker-month-arrow-prev"
                  nextMonthIcon="date-time-picker-month-arrow-next"
                />
              </div>
              {/* div to enforce layout nextline */}
              <div />
              {/* div to suppress moment unused vars error */}
              <div style={{ display: "none" }}>{moment().format()}</div>

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

GenericDateComponent = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GenericDateComponent)
);

export default GenericDateComponent;
