import React from "react";
// import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string,
  name: string,
  value: boolean,
  valueChanged: Function,
  handleEnter?: (e: any) => void,
  readOnly?: boolean
};

export const CheckBox: React.FC<MyProps> = (props) => {  
  const {
    title,
    name,
    value,
    valueChanged,
    handleEnter,
    readOnly
  } = props;

  return (
    <label htmlFor={name}>
      <span>{title}</span>
      <div style={{position: 'relative'}}>
        <input
          name={name}
          id={name}
          type="checkbox"
          autoComplete="off"
          // className={formStyles.FormControl}
          onChange={e => valueChanged(e)}
          checked={value}
          onKeyUp={handleEnter}
          readOnly={!!readOnly}
          disabled={!!readOnly}
        />
      </div>
    </label>
  );
}