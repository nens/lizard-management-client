import React, { useEffect, useState } from 'react';
import { DurationField } from './DurationField';
import { SelectDropdown, Value } from './SelectDropdown';
import { fromISOValue, toISOValue } from '../utils/isoUtils';
import { convertDurationObjToSeconds, convertSecondsToDurationObject } from '../utils/dateUtils';
import { convertToSelectObject } from '../utils/convertToSelectObject';
import formStyles from "../styles/Forms.module.css";

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

  // Selection state can be "Before", "After" or null
  const [selection, setSelection] = useState<Value | null>(null);

  useEffect(() => {
    if (value !== null && value < 0) {
      setSelection(convertToSelectObject('Before'));
    } else if (value !== null && value >= 0) {
      setSelection(convertToSelectObject('After'));
    } else {
      setSelection(null);
    };
  }, [value]);

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.SecondLabel}>
        {title}
      </span>
      <div>
        <SelectDropdown
          title={''}
          name={name}
          value={selection}
          valueChanged={e => {
            const event = e as Value | null;
            setSelection(event);
            if (!event) {
              valueChanged(null);
            } else if (value === null) {
              valueChanged(0);
            } else if (event.value === 'Before') {
              valueChanged(-Math.abs(value));
            } else if (event.value === 'After') {
              valueChanged(Math.abs(value));
            };
          }}
          options={options}
          validated={validated}
          isSearchable={false}
          triedToSubmit={triedToSubmit}
          errorMessage={errorMessage}
          readOnly={readOnly}
        />
        <DurationField
          title={''}
          name={name}
          value={value ? toISOValue(convertSecondsToDurationObject(value)) : null}
          valueChanged={e => {
            if (!selection) {
              valueChanged(null);
            } else if (selection.value === 'Before') {
              valueChanged(-convertDurationObjToSeconds(fromISOValue(e)));
            } else if (selection.value === 'After')  {
              valueChanged(convertDurationObjToSeconds(fromISOValue(e)));
            };
          }}
          validated={validated}
          readOnly={readOnly || !selection}
        />
      </div>
    </label>
  )
};