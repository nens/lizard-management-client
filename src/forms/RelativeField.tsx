// The main Form class

import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./DurationField.css";
import formStyles from "../styles/Forms.css";
import inputStyles from "../styles/Input.css";

import {toISOValue, durationObject} from "../utils/isoUtils"
import { convertDurationObjToSeconds, convertSecondsToDurationObject } from "../utils/dateUtils";
import SelectBoxForRelativeFields from "./SelectBoxForRelativeFields";

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
  isNegativeDuration: boolean | null
};

interface FormValues {
  // Only interested in form values for relative fields.
  relativeStartSelection: "Before" | "After",
  relativeStart: string | null,
  relativeEndSelection: "Before" | "After",
  relativeEnd: string | null
};



// export const fromISOValue = (value: string): durationObject => {
//   // Translate a string of the form 'P1DT10H20M50S' to an object.
//   const isoRegex = /^P(\d*)DT(\d*)H(\d*)M(\d*)S$/;

//   if (value) {
//     const match = value.match(isoRegex);

//     if (match) {
//       return {
//         days: parseFloat(match[1]) || 0,
//         hours: parseFloat(match[2]) || 0,
//         minutes: parseFloat(match[3]) || 0,
//         seconds: parseFloat(match[4]) || 0,
//       }
//     }
//   }

//   return {
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   }
// }



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

// export const relativeEndValidator = (fieldValue: string, formValues: FormValues) => {
//   const relativeEnd = fieldValue;
//   const {
//     relativeStartSelection,
//     relativeEndSelection,
//     relativeStart
//   } = formValues;

  // Convert relative start and end to seconds.
  // let relativeStartInSeconds;
  // let relativeEndInSeconds;

  // if (relativeStart) {
  //   relativeStartInSeconds = convertDurationObjToSeconds(fromISOValue(relativeStart));

  //   if (relativeStartSelection === "Before") relativeStartInSeconds = -relativeStartInSeconds;
  // };

  // if (relativeEnd) {
  //   relativeEndInSeconds = convertDurationObjToSeconds(fromISOValue(relativeEnd));

  //   if (relativeEndSelection === "Before") relativeEndInSeconds = -relativeEndInSeconds;
  // };
  // // Compare and ensure relative end is always after relative start.
  // if (
  //   relativeStartInSeconds &&
  //   relativeEndInSeconds &&
  //   relativeStartInSeconds > relativeEndInSeconds
  // ) {
  //   return "Relative end can only be after relative start"
  // } else {
  //   return false;
  // };
// };

export default class RelativeField extends Component<RelativeFieldProps, RelativeFieldState> {
  constructor(props: RelativeFieldProps) {
    super(props);
    console.log(props)

    this.state = {
      isNegativeDuration: null
    };
  }

  updateDurationSign = (input: string) => {
    if (input === "Before") {
      this.setState({
        isNegativeDuration: true
      });
    } else if (input === "After") {
      this.setState({
        isNegativeDuration: false
      });
    } else {
      this.setState({
        isNegativeDuration: null
      })
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

    if (this.state.isNegativeDuration) durationInSeconds = -durationInSeconds;

    // console.log(durationInSeconds)
    // console.log(convertSecondsToDurationObject(durationInSeconds))

    this.props.valueChanged(durationInSeconds);
  }

  componentDidMount() {
    const value = this.props.value;
    if (value && value < 0) {
      this.setState({
        isNegativeDuration: true
      });
    } else if (value && value >= 0) {
      this.setState({
        isNegativeDuration: false
      });
    };
  }

  shouldComponentUpdate(prevProps: RelativeFieldProps, prevState: RelativeFieldState) {
    if (prevState.isNegativeDuration !== this.state.isNegativeDuration) {
      return true;
    } else {
      return false;
    };
  }

  render() {
    const {
      name,
      placeholder,
      value,
      validated,
      valueChanged,
      handleEnter,
      readOnly
    } = this.props;
    console.log(value)

    const { isNegativeDuration } = this.state;
    console.log(isNegativeDuration)

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

    // console.log(isNegativeDuration);

    return (
      <div>
        <div>
          <p>Choose relative field duration relatively to current moment (now)?</p>
          <SelectBoxForRelativeFields
            updateDurationSign={this.updateDurationSign}
          />
        </div>
        <div
          className={
            formStyles.FormGroup + " " + inputStyles.PositionRelative
          }
          style={{
            display: isNegativeDuration === null ? "none" : "block"
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
