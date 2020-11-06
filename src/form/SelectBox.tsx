import React, { useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars";

import ClearInputButton from "./../components/ClearInputButton";

import styles from "./SelectBox.module.css";
import formStyles from "../styles/Forms.module.css";

type displayStringsT = {[key: string]: string};
type choiceT = [string|number, string] | [string|number, string, string | JSX.Element]
export type choicesT = choiceT[];

interface SelectBoxProps {
  title: string,
  name: string,
  value: string,
  choices: choicesT,
  valueChanged: (value: string) => void,
  validated: boolean,
  errorMessage?: string | false,
  placeholder?: string,
  showSearchField?: boolean,
  triedToSubmit?: boolean,
  readOnly?: boolean
};

export const SelectBox: React.FC<SelectBoxProps> = (props) => {
  const {
    title,
    name,
    value,
    valueChanged,
    choices,
    placeholder,
    validated,
    errorMessage,
    showSearchField,
    triedToSubmit,
    readOnly
  } = props;

  const [showChoices, setShowChoices] = useState<boolean>(false);
  const [displayStrings, setDisplayStrings] = useState<displayStringsT>({});
  const [searchString, setSearchString] = useState<string>('');

  useEffect(() => {
    // The 'choices' prop is an array of [key, displayString] pairs;
    // optionally a third element containing a description may be present.
    // Here we create an object to be able to translate keys to displayStrings.
    // Choice keys may be numbers, but they must map to strings uniquely!
    const displayStrings: displayStringsT = {};
    choices.forEach(choice => {
      const [key, displayString] = choice;
      displayStrings[key] = displayString;
    });
    setDisplayStrings(displayStrings);
  }, [name, choices]);

  const handleKeyUp = (e: any) => {
    if (e.key === "Escape") {
      setShowChoices(false);
    }
  }

  const toggleChoices = () => {
    setShowChoices(!showChoices);
    setSearchString('');
  };

  const clearInput = () => {
    // Clear input and close choices
    props.valueChanged('');
    setShowChoices(false);
  };

  // Set validity of the input field
  const myInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (myInput && myInput.current) {
      if (validated) {
        myInput.current.setCustomValidity('');
      } else {
        myInput.current.setCustomValidity(errorMessage || '');
      };
    };
  });

  return (
    <label
      htmlFor={name}
      style={{width: '100%'}}
    >
      <span>{title}</span>
      <div className={`${styles.SelectGeneralClass} form-input`}>
        <input
          ref={myInput}
          style={{ caretColor: "transparent" }}
          id={`selectbox-${name}`}
          tabIndex={-1}
          type="text"
          autoComplete="false"
          className={`${formStyles.FormControl} ${triedToSubmit ? formStyles.FormSubmitted : ''}`}
          placeholder={placeholder}
          value={value ? (displayStrings[value] || "") : ""}
          onClick={() => !readOnly &&  toggleChoices()}
          onKeyUp={par => !readOnly && handleKeyUp(par)}
          onChange={() => {}}
          readOnly={readOnly}
          disabled={readOnly}
        />
        { 
        !readOnly ?
          value !== null ? (
            <ClearInputButton onClick={() => clearInput()}/>
            ) : (
            <ClearInputButton
              icon="arrow_drop_down"
              onClick={() => toggleChoices()}/>
          )
        :
        null
        }
      {showChoices ? (
        <div className={styles.Results}>
  
          {showSearchField ? (
            <span style={{fontSize: "smaller"}}>
              <input
                id={`searchbox-${name}`}
                name={`searchbox-${name}`}
                type="text"
                autoComplete="false"
                autoFocus={true}
                value={searchString}
                onChange={e => setSearchString(e.target.value)}
                onKeyUp={handleKeyUp}
              />
              <i style={{verticalAlign: "middle"}} className="material-icons">search</i>
            </span>
          ) : null}
  
          <Scrollbars autoHeight autoHeightMin={50} autoHeightMax={400}>
            {choices.map((choice, i) => {
              const choiceValue = choice[0]+'';
              const choiceDisplay = choice[1];
              const choiceDescription = (
                choice.length === 3 ? choice[2] : "");
              const isSelected = choiceValue === value;
  
              if (searchString &&
                  choiceDisplay.toLowerCase().indexOf(
                    searchString.toLowerCase()) === -1) {
                return null; // Hide
              }
  
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start"
                  }}
                  tabIndex={i + 1}
                  key={"" + choiceValue + i}
                  className={`${styles.ResultRow} ${isSelected
                ? styles.Active
                : styles.Inactive}`}
                  onMouseDown={e => {
                    setShowChoices(false);
                    valueChanged(choiceValue);
                  }}
                >
                  <div style={{ flex: "1" }}>{choiceDisplay}</div>
                  <div
                    style={{
                      flex: "2",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap"
                    }}
                  >
                    <i>{choiceDescription}</i>
                  </div>
                </div>
              );
            })}
          </Scrollbars>
        </div>
      ) : null}
      </div>
    </label>
  );
}
