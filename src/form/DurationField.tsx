// The main Form class

import React from "react";
// import { FormattedMessage } from "react-intl";

import styles from "../forms/DurationField.module.css";
import formStyles from "../styles/Forms.module.css";
import inputStyles from "../styles/Input.module.css";

import {toISOValue, durationObject} from "../utils/isoUtils"

interface DurationFieldProps {
  title: string,
  name: string,
  value: string,
  valueChanged: (value: string | null) => void,
  validated: boolean,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
  handleEnter?: (e: any) => void,
  readOnly?: boolean,
};

const fromISOValue = (value: string): durationObject => {
  // Translate a string of the form 'P1DT10H20M50S' to an object.
  const isoRegex = /^P(\d*)DT(\d*)H(\d*)M(\d*)S$/;

  if (value) {
    const match = value.match(isoRegex);

    if (match) {
      return {
        days: parseFloat(match[1]) || 0,
        hours: parseFloat(match[2]) || 0,
        minutes: parseFloat(match[3]) || 0,
        seconds: parseFloat(match[4]) || 0,
      }
    }
  }

  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }
}

const validPerField = (value: string) => {
  const duration = fromISOValue(value);
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

export const durationValidator = (required: boolean) => (value: string | null) => {
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

export const DurationField: React.FC<DurationFieldProps> = (props) => {
  const updateValue = (key: string, value: string) => {
    const duration = fromISOValue(props.value);
    const newValue = parseFloat(value) || 0;

    const newDuration = {
      ...duration,
      [key]: newValue
    };

    props.valueChanged(toISOValue(newDuration));
  }
  
  const {
    title,
    name,
    value,
    onFocus,
    onBlur,
    readOnly
  } = props;

  const duration = fromISOValue(value);
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
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div
        className={
        formStyles.FormGroup + " " + inputStyles.PositionRelative
        }
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
          {/* <label><FormattedMessage id="duration.days" /></label> */}
          <label>Days</label>
          <input
            id={name}
            // tabIndex={-2}
            type="text"
            autoComplete="off"
            className={
            formStyles.FormControl +
                        " " +
                        styles.TextAlignRight +
                          (!daysValid ? " " + styles.Invalid : "") +
                          (readOnly ? " " + inputStyles.ReadOnly : "")
            }
            maxLength={3}
            size={4}
            onChange={e => updateValue('days', e.target.value)}
            value={days}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
            // disabled={readOnly}
          />
        </div>
        <div
          className={
          styles.DurationInputFields + " " + styles.TextAlignRight
          }
        >
          {/* <label><FormattedMessage id="duration.hours" /></label> */}
          <label>Hours</label>
          <input
            id={name}
            // tabIndex={-2}
            type="text"
            autoComplete="off"
            className={
            formStyles.FormControl +
                        " " +
                        styles.TextAlignRight +
                          (!hoursValid ? " " + styles.Invalid : "") +
                          (readOnly ? " " + inputStyles.ReadOnly : "")
            }
            maxLength={2}
            size={2}
            onChange={e => updateValue('hours', e.target.value)}
            value={hours}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
            // disabled={readOnly}
          />
        </div>
        <div className={styles.DurationInputHourSecondSeperator}>:</div>
        <div className={styles.DurationInputFields}>
          {/* <label><FormattedMessage id="duration.mins" /></label> */}
          <label>Mins</label>
          <input
            id={name}
            // tabIndex={-2}
            type="text"
            autoComplete="off"
            className={
            formStyles.FormControl +
                          (!minutesValid ? " " + styles.Invalid : "") +
                          (readOnly ? " " + inputStyles.ReadOnly : "")
            }
            maxLength={2}
            size={2}
            onChange={e => updateValue('minutes', e.target.value)}
            value={minutes}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
            // disabled={readOnly}
          />
        </div>
        <div
          className={
          styles.DurationInputFields +
                      " " +
                      styles.DurationInputFieldSeconds
          }
        >
          {/* <label><FormattedMessage id="duration.seconds" /></label> */}
          <label>Seconds</label>
          <input
            id={name}
            // tabIndex={-2}
            type="text"
            autoComplete="off"
            className={
            formStyles.FormControl +
                          (!secondsValid ? " " + styles.Invalid : "") +
                          (readOnly ? " " + inputStyles.ReadOnly : "")
            }
            maxLength={2}
            size={4}
            onChange={e => updateValue('seconds', e.target.value)}
            value={seconds}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
            // disabled={readOnly}
          />
        </div>
        <div />
      </div>
    </label>
  );
}
