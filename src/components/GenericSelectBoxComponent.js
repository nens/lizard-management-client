import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CheckMark from "./CheckMark";
import StepIndicator from "./StepIndicator";
import { FormattedMessage } from "react-intl";
import SelectBoxSimple from "./SelectBoxSimple.js";
import SelectBoxSearch from "./SelectBoxSearch.js";

import styles from "./GenericSelectBoxComponent.css";
import formStyles from "../styles/Forms.css";
import buttonStyles from "../styles/Buttons.css";
import inputStyles from "../styles/Input.css";

class GenericSelectBoxComponent extends Component {
  setLocalStateFromProps(props) {
    // If this component is the "current step component", set the page focus to the components
    // input field:
    if (props.step === props.currentStep && !this.props.formUpdate) {
      const inputElem = document.getElementById(
        this.props.titleComponent.props.id + "_input"
      );
      // inputElem.focus(); does not work outside setTimeout. Is this the right solution?
      setTimeout(function() {
        inputElem.focus();
      }, 0);
    }
  }
  handleEnter(event) {
    if (this.props.validate(this.props.modelValue) && event.keyCode === 13) {
      // 13 is keycode 'enter' (works only when current input validates)
      this.props.setCurrentStep(this.props.step + 1);
    }
  }
  componentWillReceiveProps(newProps) {
    this.setLocalStateFromProps(newProps);
  }
  componentDidMount() {
    this.setLocalStateFromProps(this.props);
  }
  render() {
    const {
      titleComponent, // <FormatText ... //>
      subtitleComponent, // <FormatText ... />
      step, // int for denoting which step it this GenericSelectBoxComponent refers to
      currentStep, // int for denoting which step is currently active
      setCurrentStep, // cb function for updating which step becomes active
      opened, // complete question and input fields become visible if set to true
      choices, // list of choices in select box. Depending on transformChoiceToDisplayValue,transformChoiceToDescription, transformChoiceToOption
      transformChoiceToDisplayValue, // optional parameter if choices are objects, which field contains the displayvalue, default item itself is displayvalue
      transformChoiceToDescription, // now only possible if choicesSearchable == false
      transformChoiceToInfo, // // now only possible if choicesSearchable == false
      isFetching, // is the component still waiting for data from server?
      modelValue, // string: e.g. the name of a raster
      updateModelValue, // cb function to *update* the value of e.g. a raster's name in the parent model
      resetModelValue, // cb function to *reset* the value of e.g. a raster's name in the parent model
      validate, // function used to validate the props.modelValue. If validate returns true the props.modelValue passed to updateModelValue and checkmark is set.
      choicesSearchable,
      placeholder,
      formUpdate,
      readonly
    } = this.props;
    const active = step === currentStep || (formUpdate && !readonly);
    const showCheckMark = validate(modelValue);
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
              {choicesSearchable ? (
                <SelectBoxSearch
                  choices={choices}
                  choice={modelValue}
                  transformChoiceToDisplayValue={transformChoiceToDisplayValue}
                  isFetching={isFetching}
                  updateModelValue={e => {
                    // console.log("updateModelValue", e);
                    updateModelValue(e);
                  }}
                  onKeyUp={e => this.handleEnter(e)}
                  inputId={titleComponent.props.id + "_input"}
                  placeholder={placeholder}
                  validate={validate}
                  resetModelValue={resetModelValue}
                  readonly={readonly}
                />
              ) : (
                <SelectBoxSimple
                  choices={choices}
                  choice={modelValue}
                  isFetching={isFetching}
                  transformChoiceToDisplayValue={transformChoiceToDisplayValue}
                  updateModelValue={updateModelValue}
                  onKeyUp={e => this.handleEnter(e)}
                  inputId={titleComponent.props.id + "_input"}
                  placeholder={placeholder}
                  // validate={validate}
                  transformChoiceToDescription={transformChoiceToDescription}
                  transformChoiceToInfo={transformChoiceToInfo}
                />
              )}
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

GenericSelectBoxComponent = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GenericSelectBoxComponent)
);

export default GenericSelectBoxComponent;
