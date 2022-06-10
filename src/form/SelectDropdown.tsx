import React, { useEffect, useRef } from "react";
import Select, {
  components,
  createFilter,
  StylesConfig,
  ValueType,
  OptionProps,
} from "react-select";
import AsyncSelect from "react-select/async";
import { UUID_REGEX } from "../components/Breadcrumbs";
import formStyles from "../styles/Forms.module.css";

export type Value = {
  value: string | number;
  label: string;
  subLabel?: string | JSX.Element;
  subLabel2?: string | JSX.Element;
};

interface MyProps {
  title: string;
  name: string;
  id?: string;
  value?: Value | null;
  valueChanged: (value: ValueType<Value, boolean> | {}) => void;
  options: Value[];
  validated: boolean;
  errorMessage?: string | false;
  placeholder?: string;
  triedToSubmit?: boolean;
  readOnly?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  isMulti?: boolean;
  dropUp?: boolean;
  isAsync?: boolean;
  isCached?: boolean;
  loadOptions?: (inputValue: string) => Promise<any>; // loadOptions is required if isAsync === true
  onFocus?: (e: any) => void;
  onBlur?: () => void;
}

export const SelectDropdown = (props: MyProps) => {
  const {
    title,
    name,
    id,
    placeholder,
    value,
    valueChanged,
    options,
    validated,
    errorMessage,
    triedToSubmit,
    isSearchable,
    isClearable,
    isLoading,
    isMulti,
    dropUp,
    isAsync,
    isCached,
    loadOptions,
    onFocus,
    onBlur,
    readOnly,
  } = props;

  // useRef for Select component to set focus on
  const mySelect = useRef<any>(null);

  // Set validity of the input field
  const myInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (myInput && myInput.current) {
      if (validated) {
        myInput.current.setCustomValidity("");
      } else {
        myInput.current.setCustomValidity(errorMessage || "");
      }
    }
  });

  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      {props.children}
      {props.data.subInputInfo ? ` - ${props.data.subInputInfo}` : null}
    </components.SingleValue>
  );

  // Custom Option field to add sub-label
  const Option = (props: OptionProps<{}, boolean>) => (
    <components.Option {...props}>
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {props.data.label}
      </div>
      <div
        style={{
          fontStyle: "italic",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {props.data.subLabel}
      </div>
      <div
        style={{
          fontStyle: "italic",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {props.data.subLabel2}
      </div>
    </components.Option>
  );

  // Custom styling for different Select's child components
  const customStyles: StylesConfig<{}, boolean> = {
    // Custom styling for Control component
    control: (styles, { isFocused }) => {
      let borderColor: string = styles.borderColor as string;
      let boxShadow: string = styles.boxShadow as string;
      if (triedToSubmit && !validated) {
        borderColor = "var(--color-border-input-invalid)";
        boxShadow = "none";
      } else if (isFocused) {
        borderColor = "var(--color-border-input)";
        boxShadow = "0 0 1px 1px var(--color-border-input)";
      }
      return {
        ...styles,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: readOnly ? "var(--color-input-disabled)" : styles.backgroundColor,
        cursor: readOnly ? "not-allowed" : styles.cursor,
        borderColor: borderColor,
        boxShadow: boxShadow,
        ":hover": {
          borderColor: borderColor,
        },
      };
    },
    menu: (styles) => ({
      ...styles,
      zIndex: 100, // to always show the menu dropdown
    }),
    // Custom styling for Option list component
    option: (styles, { data }) => ({
      ...styles,
      display: "grid",
      gridTemplateColumns: data.subLabel2
        ? "35fr 45fr 20fr"
        : // use a different layout for the option list when the sub-label is an UUID
        UUID_REGEX.test(data.subLabel)
        ? "65fr 35fr"
        : data.subLabel
        ? "35fr 65fr"
        : "1fr",
    }),
    // Custom styling for the Indicator component
    indicatorsContainer: (styles) => ({
      ...styles,
      cursor: "pointer",
      visibility: readOnly ? "hidden" : styles.visibility,
    }),
  };

  return (
    <label htmlFor={name} className={formStyles.Label}>
      <span className={formStyles.LabelTitle}>{title}</span>
      <div style={{ position: "relative" }}>
        {isAsync ? (
          <AsyncSelect
            ref={mySelect}
            inputId={id || name}
            name={name}
            components={{ Option, SingleValue }}
            styles={customStyles}
            placeholder={placeholder}
            cacheOptions={isCached}
            defaultOptions
            loadOptions={loadOptions}
            value={value}
            onChange={(option) => valueChanged(option)}
            isClearable={!readOnly && isClearable === undefined ? true : false}
            isSearchable={!readOnly && isSearchable}
            menuIsOpen={readOnly ? false : undefined}
            isMulti={isMulti}
            menuPlacement={dropUp ? "top" : undefined}
            onFocus={onFocus}
            onBlur={onBlur}
            filterOption={createFilter({ ignoreAccents: false })}
          />
        ) : (
          <Select
            ref={mySelect}
            inputId={id || name}
            name={name}
            components={{ Option, SingleValue }}
            styles={customStyles}
            placeholder={placeholder}
            options={options}
            value={value}
            onChange={(option) => valueChanged(option)}
            isLoading={isLoading}
            isClearable={!readOnly && isClearable === undefined ? true : false}
            isSearchable={!readOnly && isSearchable}
            menuIsOpen={readOnly ? false : undefined}
            isMulti={isMulti}
            menuPlacement={dropUp ? "top" : undefined}
            onFocus={onFocus}
            onBlur={onBlur}
            filterOption={createFilter({ ignoreAccents: false })}
          />
        )}
        {/* Hidden input field to apply HTML custom validation */}
        <input
          ref={myInput}
          tabIndex={-1}
          autoComplete="off"
          onFocus={() => mySelect.current && mySelect.current.focus()}
          style={{
            position: "absolute",
            opacity: 0,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            padding: 0,
            zIndex: -1,
          }}
        />
      </div>
    </label>
  );
};
