import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CheckMark from "./CheckMark";
import StepIndicator from "./StepIndicator";
import { FormattedMessage } from "react-intl";
import SelectBoxSearch from "./SelectBoxSearch.js";

import styles from "./GenericSelectBoxComponent.css";
import formStyles from "../styles/Forms.css";
import buttonStyles from "../styles/Buttons.css";
import inputStyles from "../styles/Input.css";

class ColorMapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewColor: null
    };
  }
  setLocalStateFromProps(props) {
    this.getRGBAGradient(props.modelValue);
    // If this component is the "current step component", set the page focus to the components
    // input field:
    // TODO: implement autofocus of inpput element for colormap
    // not clear yet what we need to do with below solution.
    // for colormaps this might work
    // if (props.step === props.currentStep && !this.props.formUpdate) {
    //   const inputElem = document.getElementById(
    //     this.props.titleComponent.props.id + "_input"
    //   );
    //   // inputElem.focus(); does not work outside setTimeout. Is this the right solution?
    //   setTimeout(function() {
    //     // inputElem.focus();
    //   }, 0);
    // }
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

  getRGBAGradient(modelValue) {
    if (modelValue.colorMap) {
      fetch(
        "/wms/?request=getlegend&style=" +
          modelValue.colorMap +
          "&steps=100&format=json",
        {
          credentials: "same-origin",
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      )
        .then(response => response.json())
        .then(responseData => {
          this.setState({ previewColor: responseData });
        });
    }
  }

  render() {
    const {
      titleComponent, // <FormatText ... //>
      subtitleComponent, // <FormatText ... />
      minTitleComponent,
      maxTitleComponent,
      step, // int for denoting which step it this GenericSelectBoxComponent refers to
      currentStep, // int for denoting which step is currently active
      setCurrentStep, // cb function for updating which step becomes active
      opened, // complete question and input fields become visible if set to true
      choices, // list of choices in select box. Depending on transformChoiceToDisplayValue,transformChoiceToDescription, transformChoiceToOption
      transformChoiceToDisplayValue, // optional parameter if choices are objects, which field contains the displayvalue, default item itself is displayvalue
      isFetching, // is the component still waiting for data from server?
      modelValue, // string: e.g. the name of a raster
      updateModelValue, // cb function to *update* the value of e.g. a raster's name in the parent model
      validate, // function used to validate the props.modelValue. If validate returns true the props.modelValue passed to updateModelValue and checkmark is set.
      placeholder,
      formUpdate,
      readonly,
      readOnlyReason
    } = this.props;
    const active = step === currentStep || (formUpdate && !readonly);
    const showCheckMark = validate(modelValue);
    const showNextButton = validate(modelValue) && !formUpdate;

    if (this.state.previewColor != null) {
      var colors = this.state.previewColor.legend.map(obj => {
        return <div style={{ flex: 1, backgroundColor: obj.color }} />;
      });
      var minValue = this.state.previewColor.limits[0];
      var maxValue = this.state.previewColor.limits[1];
    }

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
            {readOnlyReason ? (
              <p className="text-muted">{readOnlyReason}</p>
            ) : (
              <p className="text-muted">{subtitleComponent}</p>
            )}
            <div
              className={
                formStyles.FormGroup + " " + inputStyles.PositionRelative
              }
            >
              <div>
                <div className={styles.previewColorContainer}>{colors}</div>
                <div className={styles.MinMaxValues}>
                  <div>{minValue}</div>
                  <div>{maxValue}</div>
                </div>
                <SelectBoxSearch
                  choices={choices}
                  choice={{ name: modelValue.colorMap }}
                  transformChoiceToDisplayValue={transformChoiceToDisplayValue}
                  isFetching={isFetching}
                  updateModelValue={e => {
                    updateModelValue({ colorMap: e.name });
                    if (validate({ colorMap: e.name })) {
                      this.getRGBAGradient({ colorMap: e.name });
                    }
                  }}
                  onKeyUp={e => this.handleEnter(e)}
                  inputId={titleComponent.props.id + "_input"}
                  placeholder={placeholder}
                  validate={e => {
                    return e.name !== "";
                  }}
                  resetModelValue={e => {
                    updateModelValue({ colorMap: "" });
                  }}
                  readonly={readonly}
                />

                <br />
                <span className="text-muted">{minTitleComponent}</span>
                <br />
                {modelValue.max &&
                modelValue.max !== "" &&
                (modelValue.min === "" || !modelValue.min) ? (
                  <span style={{ color: "red" }}>
                    <FormattedMessage
                      id="rasters.colormap_min_mandatory"
                      defaultMessage="Mandatory if a maximum is given"
                    />
                  </span>
                ) : null}

                {parseFloat(modelValue.min) &&
                parseFloat(modelValue.max) &&
                parseFloat(modelValue.min) > parseFloat(modelValue.max) ? (
                  <span style={{ color: "red" }}>
                    <FormattedMessage
                      id="rasters.colormap_max>min"
                      defaultMessage="Max should be Greater then Min"
                    />
                  </span>
                ) : null}
                <input
                  autoComplete="false"
                  className={`${formStyles.FormControl} ${readonly
                    ? inputStyles.ReadOnly
                    : null}`}
                  onChange={e => updateModelValue({ min: e.target.value })}
                  value={modelValue.min}
                  placeholder="optional minimum of range"
                  readOnly={readonly}
                  disabled={readonly}
                />
                <br />
                <span className="text-muted">{maxTitleComponent}</span>
                <input
                  autoComplete="false"
                  className={`${formStyles.FormControl} ${readonly
                    ? inputStyles.ReadOnly
                    : null}`}
                  value={modelValue.max}
                  onChange={e => updateModelValue({ max: e.target.value })}
                  placeholder="optional maximum of range"
                  readOnly={readonly}
                  disabled={readonly}
                />
              </div>
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

ColorMapComponent = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ColorMapComponent)
);

export default ColorMapComponent;
