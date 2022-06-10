import React from "react";
import { ClearInputButton } from "./ClearInputButton";
import formStyles from "../styles/Forms.module.css";

import moment from "moment";
import "moment/locale/nl";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import './DateTimeInput.css';

interface MyProps {
  title: string;
  name: string;
  value: string;
  form?: string;
  valueChanged: (value: string) => void;
  clearInput: (name: string) => void;
}

export const DateTimeInput: React.FC<MyProps> = (props) => {
  const {
    title,
    name,
    value,
    form,
    valueChanged,
    clearInput,
  } = props;

  return (
    <label htmlFor={name} className={formStyles.Label}>
      <span className={formStyles.LabelTitle}>{title}</span>
      <div style={{ position: "relative" }}>
        <Datetime
          value={moment(value)}
          onChange={event => valueChanged(moment(event).format("YYYY-MM-DDTHH:mm:ss") + "Z")}
          inputProps={{
            className: `${formStyles.FormControl} ${formStyles.FormSubmitted}`
          }}
          renderInput={(props) => (
            <div>
              <input {...props} value={value ? props.value : ''} form={form} />
              <ClearInputButton onClick={() => clearInput(name)} />
            </div>
          )}
          timeFormat={"HH:mm:ss"}
          utc
        />
      </div>
    </label>
  );
};
