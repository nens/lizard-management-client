import React, { useEffect, useState } from 'react';
import { DurationField } from './DurationField';
import { SelectDropdown, Value } from './SelectDropdown';
import { fromISOValue, toISOValue } from '../utils/isoUtils';
import { convertDurationObjToSeconds, convertSecondsToDurationObject } from '../utils/dateUtils';
import { convertToSelectObject } from '../utils/convertToSelectObject';
import formStyles from "../styles/Forms.module.css";
import styles from './RelativeField.module.css';

interface Props {
  title: string,
  name: string,
  value: number | null,
  valueChanged: (value: number | null) => void,
  validated: boolean,
  errorMessage?: string | false,
  triedToSubmit?: boolean,
  readOnly?: boolean,
}

const options = [
  convertToSelectObject('Before'),
  convertToSelectObject('After')
];

export function RelativeField (props: Props) {
  const {
    title,
    name,
    value,
    valueChanged,
    validated,
    errorMessage,
    triedToSubmit,
    readOnly
  } = props;

  const [selection, setSelection] = useState<Value>(convertToSelectObject('Before'));
  useEffect(() => {
    if (value && value < 0) {
      setSelection(convertToSelectObject('Before'));
    } else if (value && value > 0) {
      setSelection(convertToSelectObject('After'));
    };
  }, [value]);

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div className={styles.RelativeFieldContainer}>
        <div className={styles.SelectionContainer}>
          <SelectDropdown
            title={''}
            name={name}
            value={selection}
            valueChanged={e => {
              if (!e) return;
              // @ts-ignore
              setSelection(e);
              if (value) {
                // @ts-ignore
                if (e.value === 'Before') {
                  valueChanged(-Math.abs(value));
                  // @ts-ignore
                } else if (e.value === 'After') {
                  valueChanged(Math.abs(value));
                };
              };
            }}
            options={options}
            validated={validated}
            isSearchable={false}
            isClearable={false}
            triedToSubmit={triedToSubmit}
            errorMessage={errorMessage}
            readOnly={readOnly}
          />
        </div>
        <DurationField
          title={''}
          name={name}
          value={value ? toISOValue(convertSecondsToDurationObject(value)) : null}
          valueChanged={e => {
            if (selection.value === 'Before') {
              valueChanged(-convertDurationObjToSeconds(fromISOValue(e)));
            } else if (selection.value === 'After')  {
              valueChanged(convertDurationObjToSeconds(fromISOValue(e)));
            };
          }}
          validated={validated}
          readOnly={readOnly}
        />
      </div>
    </label>
  )
};