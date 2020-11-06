// {"styles": "Blues:0.0:2.0"}
// {"styles": "transparent", "HEIGHT": 512, "ZINDEX": 20, "WIDTH": 1024, "effects": "radar:0:0.008", "TRANSPARENT": false}
import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import { SelectBox, choicesT } from "./SelectBox";
import { CheckBox } from "./CheckBox";
import { validatorResult } from "./validators";
import styles from "./ColorMapInput.module.css";
import formStyles from "../styles/Forms.module.css";

import {
  calculateNewStyleAndOptions,
  optionsHasLayers,
  validateStyleObj,
  colorMapTypeFromOptions
} from "../utils/rasterOptionFunctions";

interface ColorMapProps {
  title: string | JSX.Element,
  name: string,
  value: any,
  valueChanged: Function,
  colorMaps: choicesT,
  validated: boolean,
  errorMessage?: string | false,
  triedToSubmit?: boolean,
  placeholder?: string,
  validators?: Function[],
};

export const colorMapValidator = (required: boolean) =>
  (options: any | null): validatorResult => {

    const initiatedOptions = options || {
      options: {},
      rescalable: false,
    }
    const colorMap = colorMapTypeFromOptions(initiatedOptions.options);



    const result = validateStyleObj(colorMap);
    if (result.validated === true) {
      return false;
    } else {
      return result.errorMessage + '';
    }
};

const ColorMapInput: React.FC<ColorMapProps & InjectedIntlProps> = (props) => {

  const [previewColor, setPreviewColor] = useState<any>(null);

  useEffect(() => {
    if (props.value === undefined || props.value === null) {
      props.valueChanged({
        options: {},
        rescalable: false
      });
    };
  });

  const setLocalStateFromProps = (props: ColorMapProps) => {
    const initiatedValue = props.value || {
      options: {},
      rescalable: false,
    };
    getRGBAGradient(colorMapTypeFromOptions(initiatedValue.options));
  };

  useEffect(() => {
    setLocalStateFromProps(props);
  });

  const getRGBAGradient = (value: any | null) => {
    if (value && value.colorMap) {
      let style = value.colorMap;

      if (value.min && value.max) {
        style = `${style}:${value.min}:${value.max}`;
      };

      fetch(
        "/wms/?request=getlegend&style=" + style +
        "&steps=100&format=json",
        {
          credentials: "same-origin",
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      )
        .then(response => response.json())
        .then(responseData => setPreviewColor(responseData));
    } else if (previewColor) {
      // If the color map is unselected, also don't show a preview
      setPreviewColor(null);
    };
  };


  const colorMapChanged = (colorMap: string) => {    
    if (colorMap === null) {
      colorMap = '';
    }
    const initializedOptions = props.value || {
      options: {},
      rescalable: false,
    };
    const newStyleOptions = calculateNewStyleAndOptions(
      colorMapTypeFromOptions(initializedOptions.options),
      initializedOptions.options,
      {colorMap: colorMap}
    );
    props.valueChanged({
      options: newStyleOptions.options,
      rescalable: props.value.rescalable
    });
  }

  const rescalableChanged = (rescalable: boolean) => {
    props.valueChanged({
      options: props.value.options,
      rescalable: rescalable
    });
  }

  const valueChanged = (field: string, value: number | null) => {
    let newValue;

    if (field !== 'min' && field !== 'max') return;

    if (value === null) {
      newValue = '';
    } else {
      newValue = value
    }

    let newStyleOptions;
    if (field === 'min') {
      newStyleOptions = calculateNewStyleAndOptions(
        colorMapTypeFromOptions(props.value.options),
        props.value.options,
        {min: newValue}
      );
    } 
    else { //  (field === 'max') {
      newStyleOptions = calculateNewStyleAndOptions(
        colorMapTypeFromOptions(props.value.options),
        props.value.options,
        {max: newValue}
      );
    }

    props.valueChanged({
      options: newStyleOptions.options,
      rescalable: props.value.rescalable
    });
  }

  const toFloat = (value: string): number | null => {
    if (!value) return null;

    const f = parseFloat(value);

    if (Number.isNaN(f)) return null;

    return f;
  };

  const {
    title,
    name,
    colorMaps,
    value,
    validated,
    errorMessage,
    triedToSubmit,
    intl
  } = props;
  console.log(value, 'validated', validated, 'error', errorMessage, triedToSubmit)

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
  })

  
  const initiatedValue = value || {
    options: {},
    rescalable: false,
  };
  const readOnly = optionsHasLayers(initiatedValue.options);
  const colorMapType = colorMapTypeFromOptions(initiatedValue.options);

  let colors = null, minValue = null, maxValue = null;
  if (previewColor !== null) {
    colors = previewColor.legend.map((obj: any, i: number) => {
      return <div style={{ flex: 1, backgroundColor: obj.color }} key={i} />;
    });
    minValue = previewColor.limits[0];
    maxValue = previewColor.limits[1];
  } else {
    colors = (
      <span style={{opacity: 0.5}}>
        <FormattedMessage id="color_map.initial_message" />
      </span>
    );
  }

  //Format message for placeholder in the input form for translation
  const placeholderColorMapSelection = intl.formatMessage({ id: "placeholder_color_map_selection" })
  const placeholderMinimumColorRange = intl.formatMessage({ id: "placeholder_minimum_color_range" })
  const placeholderMaximumColorRange = intl.formatMessage({ id: "placeholder_maximum_color_range" })

  return (
    <label htmlFor={name}>
      <span>{title}</span>
      <div>
        <div className={styles.previewColorContainer}>{colors}</div>
        <div className={styles.MinMaxValues}>
          <span>{minValue}</span>
          <span>{maxValue}</span>
        </div>
        <SelectBox
          title={''}
          choices={colorMaps}
          value={(colorMapType && colorMapType.colorMap) || ''}
          name={name + '_colorMapselect'}
          validated={validated}
          errorMessage={errorMessage}
          triedToSubmit={triedToSubmit}
          valueChanged={colorMapChanged}
          placeholder={placeholderColorMapSelection}
          showSearchField={true}
          readOnly={readOnly}
        />
  
        <br />
        <span className="text-muted">
          <FormattedMessage id="color_map.minimum_color_range" />
        </span>
        <br />
        <input
          type="number"
          autoComplete="false"
          onChange={e => valueChanged('min', toFloat(e.target.value))}
          value={(colorMapType && colorMapType.min) || ""}
          placeholder={placeholderMinimumColorRange}
          className={formStyles.FormControl}
          readOnly={readOnly}
          disabled={readOnly}
        />
        <br />
        <span className="text-muted">
        <FormattedMessage id="color_map.maximum_color_range" />
        </span>
        <input
          type="number"
          autoComplete="false"
          value={(colorMapType && colorMapType.max) || ""}
          onChange={e => valueChanged('max', toFloat(e.target.value))}
          placeholder={placeholderMaximumColorRange}
          className={formStyles.FormControl}
          readOnly={readOnly}
          disabled={readOnly}
        />
        <br/>
        <CheckBox
          title={'Rescalable'}
          name={'rescalable'}
          value={initiatedValue.rescalable}
          valueChanged={(bool: boolean) => rescalableChanged(bool)}
        />      
      </div>
    </label>
  );
}

export default injectIntl(ColorMapInput);