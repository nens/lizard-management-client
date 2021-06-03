import React from 'react';
import formStyles from "../styles/Forms.module.css";
import buttonStyles from "../styles/Buttons.module.css";

interface MyProps {
  title: string,
  name: string,
  firstLabel: string,
  secondLabel: string,
  values: any[],
  valueChanged: (value: any) => void,
  valueRemoved: (values: any[]) => void,
  clearInput?: (name: string) => void,
  validated: boolean,
  errorMessage?: string | false,
  placeholder?: string,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement | HTMLButtonElement>) => void,
  onBlur?: () => void,
  triedToSubmit?: boolean,
  readOnly?: boolean
};

export const Steps = (props: MyProps) => {
  const {
    title,
    name,
    firstLabel,
    secondLabel,
    values,
    valueRemoved
  } = props;

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div className={formStyles.GridContainer}>
        <div className={formStyles.SecondLabel}>{firstLabel}</div>
        <div className={formStyles.SecondLabel}>{secondLabel}</div>
        <div />
        {values.map((value, i) => (
          <React.Fragment key={i}>
            <div>{value.value}</div>
            <div>{value.label}</div>
            <button
              className={`${buttonStyles.Button} ${buttonStyles.Link}`}
              onClick={e => {
                e.preventDefault();
                valueRemoved(values.filter((_, idx) => idx !== i))
              }}
            >
              REMOVE
            </button>
          </React.Fragment>
        ))}
        <button
          id={'addNewValue'}
          className={buttonStyles.NewButton}
          onClick={e => console.log(e.currentTarget.value)}
        >
          Add new item
        </button>
      </div>
    </label>
  )
}