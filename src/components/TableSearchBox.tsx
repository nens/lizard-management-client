import React from 'react';
import clearInputStyles from "./ClearInputButton.module.css";

interface Props {
  value: string;
  onChange: (event:any) => void;
  onClear: () => void;
  placeholder: string
}

const TableSearchBox: React.FC<Props> = ({value, onChange, onClear, placeholder}) => {
  return (
    <div
        style={{
          // align search button on same line as input search field
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start"
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            style={{
              minWidth: "260px",
              // make sure input field has same height as search button
              padding: "6px",
              paddingLeft: "35px",
              paddingRight: "25px"
            }}
            onChange={onChange}
          />

          <i
            id="searchBoxClearButton"
            className={`${clearInputStyles.ClearInput} material-icons`}
            style={
              value === ""
                ? { right: "6px", display: "none" }
                : { right: "6px" }
            }
            onClick={onClear}
          >
            clear
          </i>
          <i
            className={`${clearInputStyles.ClearInput} material-icons`}
            style={{ left: "6px", fontSize: "30px", pointerEvents: "none" }}
          >
            search
          </i>
        </div>
      </div>
  )
};

export default TableSearchBox;