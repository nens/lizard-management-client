import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl.macro";

import Scrollbars from "react-custom-scrollbars";
import ClearButton from "../components/ClearButton";

import styles from "./SlushBucket.module.css";
import formStyles from "../styles/Forms.module.css";

type choiceT = {value: string, display: string};
export type choicesT = choiceT[];

interface MyProps {
  title: string,
  name: string,
  placeholder?: string,
  readOnly?: boolean,
  value: string[],
  choices: choicesT,
  validators?: Function[],
  validated: boolean,
  valueChanged: Function,
  form?: string,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
};

export const SlushBucket: React.FC<MyProps> = (props) => {
  const [searchString, setSearchString] = useState<string>('');

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setSearchString('');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  useEffect(() => {
    if (props.value === undefined || props.value === null) {
      props.valueChanged([]);
    };
  });

  const {
    title,
    name,
    choices,
    value,
    placeholder,
    valueChanged,
    form,
    onFocus,
    onBlur,
    readOnly
  } = props;

  const selected = value || [];

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div className={`${styles.SelectChoice} form-input`}>
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <input
            id={name}
            name={name}
            type="text"
            autoComplete="off"
            className={formStyles.FormControl}
            placeholder={placeholder}
            onChange={handleInput}
            onKeyUp={handleKeyUp}
            value={searchString}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
            form={form}
          />
          <div
            style={{
              transform: "translateX(-33px)",
              display: "flex",
              alignItems: "center",
              visibility: searchString === "" ? "hidden" : "visible"
            }}
          >
            <ClearButton
              onClick={() => setSearchString('')}
            />
          </div>
        </div>
  
        <div
          style={{
            display: "flex"
          }}
        >
          <div
            className={styles.Results}
            style={{
              marginRight: "20px"
            }}
          >
            <div className={`${styles.SelectedRow}`}>
              <b>{0?<FormattedMessage id="available" defaultMessage="Available" />:null}Available</b>
            </div>
            <Scrollbars autoHeight autoHeightMin={400} autoHeightMax={400}>
              {choices
                .filter(choiceItem => {
                  if (readOnly) {
                    return false;
                  }
                  if (searchString === "") {
                    // if nothing is typed show all results
                    return true;
                  } else {
                    // if user typed search string only show those that contain string
                    // TODO sort by search string ?
                    return choiceItem
                      .display
                      .toLowerCase()
                      .includes(searchString.toLowerCase());
                  }
                })
                .map(({value, display}, i) => {
                  return (
                    <div
                      tabIndex={i + 1}
                      key={value + '_' + i}
                      className={`${styles.ResultRow} ${selected.includes(
                        value
                      )
                        ? styles.Active
                        : ""}`}
                      onMouseDown={e => {
                        e.preventDefault();
                        if (
                          selected.filter(item => item === value).length === 0
                        ) {
                          const updatedSelected = selected.concat([value]);
                          valueChanged(updatedSelected);
                        } else {
                          valueChanged(
                            selected.filter(e => e !== value)
                          );
                        }
                      }}
                    >
                      {display}
                    </div>
                  );
                })}
            </Scrollbars>
          </div>
          <div
            className={styles.Results}
            style={{
              marginLeft: "20px"
            }}
          >
            <div className={`${styles.SelectedRow}`}>
              <b>{0?<FormattedMessage id="selected" defaultMessage="Selected" />:null}Selected</b>
            </div>
            <Scrollbars autoHeight autoHeightMin={400} autoHeightMax={400} key={selected.join()}>
              {selected
                .map((selectedItem) => {
                  // lookup complete { value, display} object in choices array
                  return choices.filter(choice => choice.value === selectedItem)[0];
                })
                // filter out unfound choices. This could happen on uuid of organisations that are sometimes with sometimes without dashes
                .filter((choiceItem) => choiceItem)
                .map((choiceItem,i) => {
                  return (
                    <div
                      className={`${styles.SelectedRow} ${readOnly
                        ? styles.SelectedRowReadonly
                        : ""}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                      key={choiceItem.value + '_' + i}
                    >
                      <div>{choiceItem.display}</div>
                      <ClearButton
                        onClick={() => {
                          valueChanged(
                            selected.filter(e => e !== choiceItem.value)
                          );
                        }}
                        styles={{
                          visibility: readOnly ? "hidden" : "visible"
                        }}
                      />
                    </div>
                  );
                })}
            </Scrollbars>
          </div>
        </div>
      </div>
    </label>
  );
}
