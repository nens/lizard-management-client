import React, { useEffect, useRef } from "react";
// import { FormattedMessage } from "react-intl.macro";

import styles from "../form/DurationField.module.css";
import formStyles from "../styles/Forms.module.css";
import inputStyles from "../styles/Input.module.css";

import {toISOValue, fromISOValue} from "../utils/isoUtils"

interface DurationFieldProps {
  title: string,
  name: string,
  value: string | null,
  valueChanged: (value: string | null) => void,
  validated: boolean,
  errorMessage?: string | false,
  triedToSubmit?: boolean,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
  readOnly?: boolean,
};

const validPerField = (value: string | null) => {
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

export const durationValidator = (value: string | null, required: boolean) => {
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
    validated,
    errorMessage,
    triedToSubmit,
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

  // Set validity of the input field
  const myDayInput = useRef<HTMLInputElement>(null);
  const myHourInput = useRef<HTMLInputElement>(null);
  const myMinInput = useRef<HTMLInputElement>(null);
  const mySecInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (
      myDayInput && myDayInput.current &&
      myHourInput && myHourInput.current &&
      myMinInput && myMinInput.current &&
      mySecInput && mySecInput.current
    ) {
      if (validated) {
        myDayInput.current.setCustomValidity('');
        myHourInput.current.setCustomValidity('');
        myMinInput.current.setCustomValidity('');
        mySecInput.current.setCustomValidity('');
      } else {
        myDayInput.current.setCustomValidity(errorMessage || 'Invalid');
        myHourInput.current.setCustomValidity(errorMessage || 'Invalid');
        myMinInput.current.setCustomValidity(errorMessage || 'Invalid');
        mySecInput.current.setCustomValidity(errorMessage || 'Invalid');
      };
    };
  })

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div className={formStyles.FormGroup + " " + inputStyles.PositionRelative}>
        <div
          className={
            styles.DurationInputFields + " " +
            styles.DurationInputFieldDays + " " +
            styles.TextAlignRight
          }
        >
          {/* <label><FormattedMessage id="duration.days" /></label> */}
          <label>Days</label>
          <input
            ref={myDayInput}
            id={name}
            type="text"
            autoComplete="off"
            className={
              formStyles.FormControl + " " + styles.TextAlignRight +
              (triedToSubmit ? " " + formStyles.FormSubmitted : "") +
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
          />
        </div>
        <div className={styles.DurationInputFields + " " + styles.TextAlignRight}>
          {/* <label><FormattedMessage id="duration.hours" /></label> */}
          <label>Hours</label>
          <input
            ref={myHourInput}
            id={name}
            type="text"
            autoComplete="off"
            className={
              formStyles.FormControl + " " + styles.TextAlignRight +
              (triedToSubmit ? " " + formStyles.FormSubmitted : "") +
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
          />
        </div>
        <div className={styles.DurationInputHourSecondSeperator}>:</div>
        <div className={styles.DurationInputFields}>
          {/* <label><FormattedMessage id="duration.mins" /></label> */}
          <label>Mins</label>
          <input
            ref={myMinInput}
            id={name}
            type="text"
            autoComplete="off"
            className={
              formStyles.FormControl +
              (triedToSubmit ? " " + formStyles.FormSubmitted : "") +
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
          />
        </div>
        <div className={styles.DurationInputFields + " " + styles.DurationInputFieldSeconds}>
          {/* <label><FormattedMessage id="duration.seconds" /></label> */}
          <label>Seconds</label>
          <input
            ref={mySecInput}
            id={name}
            type="text"
            autoComplete="off"
            className={
              formStyles.FormControl +
              (triedToSubmit ? " " + formStyles.FormSubmitted : "") +
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
          />
        </div>
        <div />
      </div>
    </label>
  );
}
