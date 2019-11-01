import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./DurationField.css";
import formStyles from "../styles/Forms.css";
import inputStyles from "../styles/Input.css";

import { convertDurationObjToSeconds, convertSecondsToDurationObject } from "../utils/dateUtils";
import SelectBoxForRelativeFields from "./SelectBoxForRelativeFields";

// Type

interface RelativeFieldProps {
  name: string,
  value: number,
  placeholder?: string,
  validators?: Function[],
  validated: boolean,
  handleEnter: (e: any) => void,
  valueChanged: Function,
  wizardStyle: boolean,
  readOnly: boolean,
};

interface RelativeFieldState {
  currentSelection: "Before" | "After" | null
};

interface FormValues {
  // Only interested in form values for relative fields.
  relativeStart: string | number | null,
  relativeEnd: string | number | null
};

// Validators

const validPerField = (value: number) => {
  const duration = convertSecondsToDurationObject(value);
  const {
    days,
    hours,
    minutes,
    seconds
  } = duration;

  const daysValid = Number.isInteger(days) && days >= 0;
  const hoursValid = Number.isInteger(hours) && hours >= 0 && hours < 24;
  const minutesValid = Number.isInteger(minutes) && minutes >= 0 && minutes < 60;
  const secondsValid = Number.isInteger(seconds) && seconds >= 0 && seconds < 60;

  return {
    daysValid,
    hoursValid,
    minutesValid,
    secondsValid,
    allValid: daysValid && hoursValid && minutesValid && secondsValid
  }
};

export const durationValidator = (required: boolean) => (value: number | null) => {
  if (!value) {
    if (required) {
      return "Please enter a duration.";
    } else {
      return false;
    }
  }

  const validities = validPerField(value);
  if (!validities.allValid) {
    return "Please enter a correct duration.";
  } else {
    return false;
  }
};

export const relativeEndValidator = (fieldValue: string | number | null, formValues: FormValues) => {
  const relativeStart = formValues.relativeStart && Number(formValues.relativeStart);
  const relativeEnd = fieldValue && Number(fieldValue);

  if (
    (relativeStart !== null) &&
    (relativeEnd !== null) &&
    relativeStart > relativeEnd
  ) {
    return "Relative end must be relatively after relative start"
  } else {
    return false
  };
};

export default class RelativeField extends Component<RelativeFieldProps, RelativeFieldState> {
  state = {
    currentSelection: null
  };
  updateCurrentSelection = (input: RelativeFieldState['currentSelection']) => {
    const { value, valueChanged } = this.props;

    if (input === "Before") {
      this.setState({
        currentSelection: "Before"
      });
      valueChanged(-Math.abs(value));
    } else if (input === "After") {
      this.setState({
        currentSelection: "After"
      });
      valueChanged(Math.abs(value));
    } else {
      // input === null
      this.setState({
        currentSelection: null
      });
      valueChanged(null);
    };
  }  
  updateValue(key: string, value: string) {
    const duration = convertSecondsToDurationObject(this.props.value);
    const newValue = parseFloat(value) || 0;

    const newDuration = {
      ...duration,
      [key]: newValue
    };

    let durationInSeconds = convertDurationObjToSeconds(newDuration);

    if (this.state.currentSelection === "Before") durationInSeconds = -durationInSeconds;

    this.props.valueChanged(durationInSeconds);
  }
  componentDidMount() {
    const value = Number(this.props.value);
    
    if (value && value < 0) {
      this.setState({
        currentSelection: "Before"
      });
    } else if (value && value >= 0) {
      this.setState({
        currentSelection: "After"
      });
    };
  }
  render() {
    const {
      name,
      value,
      readOnly
    } = this.props;

    const {
      currentSelection
    } = this.state;

    const duration = convertSecondsToDurationObject(value);
    const {
      days,
      hours,
      minutes,
      seconds
    } = duration;

    const {
      daysValid, hoursValid, minutesValid, secondsValid
    } = validPerField(value);

    return (
      <div>
        <div>
          <p>Select relative field as of Before or After current moment?</p>
          <SelectBoxForRelativeFields
            updateCurrentSelection={this.updateCurrentSelection}
            currentSelection={currentSelection}
          />
        </div>
        <br/>
        <div
          className={
            formStyles.FormGroup + " " + inputStyles.PositionRelative
          }
          style={{
            display: currentSelection ? "block" : "none"
          }}
        >
          <div
            className={
              styles.DurationInputFields +
              " " +
              styles.DurationInputFieldDays +
              " " +
              styles.TextAlignRight
            }
          >
            <label><FormattedMessage id="duration.days" /></label>
            <input
              id={name + "days_input"}
              tabIndex={-2}
              type="text"
              autoComplete="false"
              className={
                formStyles.FormControl +
                " " +
                styles.TextAlignRight +
                (!daysValid ? " " + styles.Invalid : "") +
                (readOnly ? " " + inputStyles.ReadOnly : "")
              }
              maxLength={3}
              size={4}
              onChange={e => this.updateValue('days', e.target.value)}
              value={days}
              readOnly={readOnly}
              disabled={readOnly}
            />
          </div>
          <div
            className={
            styles.DurationInputFields + " " + styles.TextAlignRight
            }
          >
            <label><FormattedMessage id="duration.hours" /></label>
            <input
              id={name + "hours_input"}
              tabIndex={-2}
              type="text"
              autoComplete="false"
              className={
                formStyles.FormControl +
                " " +
                styles.TextAlignRight +
                (!hoursValid ? " " + styles.Invalid : "") +
                (readOnly ? " " + inputStyles.ReadOnly : "")
              }
              maxLength={2}
              size={2}
              onChange={e => this.updateValue('hours', e.target.value)}
              value={hours}
              readOnly={readOnly}
              disabled={readOnly}
            />
          </div>
          <div className={styles.DurationInputHourSecondSeperator}>:</div>
          <div className={styles.DurationInputFields}>
            <label><FormattedMessage id="duration.mins" /></label>
            <input
              id={name + "minutes_input"}
              tabIndex={-2}
              type="text"
              autoComplete="false"
              className={
                formStyles.FormControl +
                (!minutesValid ? " " + styles.Invalid : "") +
                (readOnly ? " " + inputStyles.ReadOnly : "")
              }
              maxLength={2}
              size={2}
              onChange={e => this.updateValue('minutes', e.target.value)}
              value={minutes}
              readOnly={readOnly}
              disabled={readOnly}
            />
          </div>
          <div
            className={
              styles.DurationInputFields +
              " " +
              styles.DurationInputFieldSeconds
            }
          >
            <label><FormattedMessage id="duration.seconds" /></label>
            <input
              id={name + "seconds_input"}
              tabIndex={-2}
              type="text"
              autoComplete="false"
              className={
                formStyles.FormControl +
                (!secondsValid ? " " + styles.Invalid : "") +
                (readOnly ? " " + inputStyles.ReadOnly : "")
              }
              maxLength={2}
              size={4}
              onChange={e => this.updateValue('seconds', e.target.value)}
              value={seconds}
              readOnly={readOnly}
              disabled={readOnly}
            />
          </div>
          <div />
        </div>
      </div>
    );
  }
}