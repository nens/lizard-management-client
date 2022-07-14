import React, { useState } from "react";
import { TextInput } from "../form/TextInput";
import { FloatInput } from "./FloatInput";
import formStyles from "../styles/Forms.module.css";
import buttonStyles from "../styles/Buttons.module.css";

interface Threshold {
  value: number;
  warning_level: string;
}

interface MyProps {
  title: string;
  name: string;
  comparison: string;
  thresholds: Threshold[];
  valueChanged: (threshold: Threshold) => void;
  valueRemoved: (thresholds: Threshold[]) => void;
  clearInput?: (name: string) => void;
  validated: boolean;
  errorMessage?: string | false;
  placeholder?: string;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement | HTMLButtonElement>) => void;
  onBlur?: () => void;
  triedToSubmit?: boolean;
  readOnly?: boolean;
}

export function AlarmThresholds(props: MyProps) {
  const {
    title,
    name,
    comparison,
    thresholds,
    valueChanged,
    valueRemoved,
    validated,
    errorMessage,
    triedToSubmit,
    onFocus,
    onBlur,
    readOnly,
  } = props;

  const [threshold, setThreshold] = useState<Threshold>({ value: 0, warning_level: "" });

  return (
    <label htmlFor={name} className={formStyles.Label}>
      <span className={formStyles.LabelTitle}>{title}</span>
      <div className={formStyles.GridContainer}>
        <div className={formStyles.SecondLabel}>Value</div>
        <div className={formStyles.SecondLabel}>Name</div>
        <div />
        {thresholds
          .sort(
            (a, b) =>
              // sort threshold value from low to high
              a.value - b.value
          )
          .map((threshold, i) => (
            <React.Fragment key={i}>
              <div>
                {comparison} {threshold.value}
              </div>
              <div>{threshold.warning_level}</div>
              <button
                className={`${buttonStyles.Button} ${buttonStyles.Link}`}
                onClick={(e) => {
                  e.preventDefault();
                  valueRemoved(thresholds.filter((_, idx) => idx !== i));
                }}
              >
                REMOVE
              </button>
            </React.Fragment>
          ))}
        <FloatInput
          title={""}
          name={"thresholdValue"}
          value={threshold.value}
          valueChanged={(value) => {
            setThreshold({
              ...threshold,
              value,
            });
          }}
          validated
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={readOnly}
        />
        <TextInput
          title={""}
          name={"thresholdLevel"}
          value={threshold.warning_level}
          valueChanged={(e) => {
            const thresholdLevel = e.target.value;
            setThreshold({
              ...threshold,
              warning_level: thresholdLevel,
            });
          }}
          clearInput={() => setThreshold({ ...threshold, warning_level: "" })}
          validated={validated}
          errorMessage={errorMessage}
          triedToSubmit={triedToSubmit}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={readOnly}
        />
        <div />
        <button
          id={"addNewThreshold"}
          className={buttonStyles.NewButton}
          title={!threshold.warning_level ? "Please enter a name for the new threshold" : undefined}
          onClick={(e) => {
            e.preventDefault();
            valueChanged(threshold);
            setThreshold({
              value: 0,
              warning_level: "",
            });
          }}
          disabled={!threshold.warning_level}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          Add threshold
        </button>
      </div>
    </label>
  );
}
