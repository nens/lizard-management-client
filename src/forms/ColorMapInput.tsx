// {"styles": "Blues:0.0:2.0"}
// {"styles": "transparent", "HEIGHT": 512, "ZINDEX": 20, "WIDTH": 1024, "effects": "radar:0:0.008", "TRANSPARENT": false}
import React, { Component } from "react";

import CheckMark from "./CheckMark";
import SelectBox, { choicesT } from "./SelectBox";

import { validatorResult } from "./validators";

import styles from "./ColorMapInput.css";
import formStyles from "../styles/Forms.css";
import buttonStyles from "../styles/Buttons.css";
import inputStyles from "../styles/Input.css";

import {
  calculateNewStyleAndOptions,
  optionsHasLayers,
  getColorMapFromStyle,
  getColorMinFromStyle,
  getColorMaxFromStyle,
  getStyleFromOptions,
  validateStyleObj,
  colorMapTypeFromOptions
} from "../utils/rasterOptionFunctions";

// type ColorMapType = {
//   colorMap: string | null,
//   min?: number,
//   max?: number
// };

interface ColorMapProps {
  placeholder?: string,
  validators?: Function[],
  name: string,
  value: any,
  // value: ColorMapType | null,
  colorMaps: choicesT,
  validated: boolean,
  handleEnter: (e: any) => void,
  valueChanged: Function,
  wizardStyle: boolean
};

interface LegendResponse {
  limits: [number, number],
  legend: {color: string}[]
}

interface ColorMapState {
  previewColor: null | LegendResponse;
};

export const colorMapValidator = (required: boolean) =>
  // (colorMap: ColorMapType | null): validatorResult => {
  (options: any | null): validatorResult => {
    const colorMap = colorMapTypeFromOptions(options);

    console.log('colorMapValidator colorMap', colorMap);

    const result = validateStyleObj(colorMap);
    console.log('result result', result);
    if (result.validated === true) {
      return false;
    } else {
      return result.errorMessage + '';
    }
    // if (!colorMap || !(colorMap.colorMap)) {
    //   if (required) {
    //     return "Please choose a color map.";
    //   } else {
    //     return false;
    //   }
    // }

    // if (typeof colorMap.min === 'number' || typeof colorMap.max === 'number') {
    //   if (typeof colorMap.min !== 'number') {
    //     return "If a maximum is chosen, please also choose a minimum.";
    //   }
    //   if (typeof colorMap.max !== 'number') {
    //     return "If a minimum is chosen, please also choose a maximum.";
    //   }
    //   if (colorMap.min >= colorMap.max) {
    //     return "Minimum must be smaller than maximum.";
    //   }
    //   return false;
    // }

    // return false;
};

class ColorMapInput extends Component<ColorMapProps, ColorMapState> {
  constructor(props: ColorMapProps) {
    super(props);
    this.state = {
      previewColor: null
    };
  }

  setLocalStateFromProps(props: ColorMapProps) {
    this.getRGBAGradient(colorMapTypeFromOptions(props.value));
  }

  componentWillReceiveProps(newProps: ColorMapProps) {
    this.setLocalStateFromProps(newProps);
  }
  componentDidMount() {
    this.setLocalStateFromProps(this.props);
  }

  // getRGBAGradient(value: ColorMapType | null) {
  getRGBAGradient(value: any | null) {
    if (value && value.colorMap) {
      let style = value.colorMap;

      // if (typeof value.min === 'number' && typeof value.max === 'number') {
      if (value.min && value.max) {
        style = `${style}:${value.min}:${value.max}`;
      }

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
        .then(responseData => {
          this.setState({ previewColor: responseData });
        });
    } else if (this.state.previewColor) {
      // If the color map is unselected, also don't show a preview
      this.setState({ previewColor: null });
    }
  }


  colorMapChanged(colorMap: string) {
    // let newValue;

    // if (this.props.value && this.props.value.colorMap === colorMap) {
    //   // No change.
    //   return;
    // }

    // if (this.props.value) {
    //   newValue = {
    //     colorMap: colorMap,
    //     min: this.props.value.min,
    //     max: this.props.value.max
    //   };
    // } else {
    //   newValue = {
    //     colorMap: colorMap
    //   };
    // }

    // this.props.valueChanged(newValue);
    if (colorMap === null) {
      colorMap = '';
    }
    const newStyleOptions = calculateNewStyleAndOptions(
      colorMapTypeFromOptions(this.props.value),
      this.props.value,
      {colorMap: colorMap}
    );
    // const newOptions = createColorMapFromStylePlusOptions();
    console.log('newStyleOptions', newStyleOptions, colorMap)
    this.props.valueChanged(newStyleOptions.options);
  }

  valueChanged(field: string, value: number | null) {
    let newValue;

    if (field !== 'min' && field !== 'max') return;

    // if (this.props.value && this.props.value[field] === value) {
    //   // No change.
    //   return;
    // }

    // if (this.props.value) {
    //   newValue = {
    //     ...this.props.value,
    //     [field]: value
    //   };
    // } else {
    //   newValue = {
    //     colorMap: null,
    //     [field]: value
    //   };
    // }

    // this.props.valueChanged(newValue);
    // this.props.valueChanged(newValue);
    if (value === null) {
      newValue = '';
    } else {
      newValue = value
    }

    let newStyleOptions;
    if (field === 'min') {
      newStyleOptions = calculateNewStyleAndOptions(
        colorMapTypeFromOptions(this.props.value),
        this.props.value,
        {min: newValue}
      );
    } 
    else {
    // if (field === 'max') {
      newStyleOptions = calculateNewStyleAndOptions(
        colorMapTypeFromOptions(this.props.value),
        this.props.value,
        {max: newValue}
      );
    }

    
    // const newOptions = createColorMapFromStylePlusOptions();
    console.log('newStyleOptions', newStyleOptions, field, value)
    this.props.valueChanged(newStyleOptions.options);
  }

  toFloat(value: string): number | null {
    if (!value) return null;

    const f = parseFloat(value);

    if (Number.isNaN(f)) return null;

    return f;
  }

  render() {
    const {
      name,
      colorMaps,
      value,
      valueChanged,
      validated,
      placeholder,
      wizardStyle,
    } = this.props;

    console.log('value' , value);
    const readonly = optionsHasLayers(value);
    
    const colorMapType = colorMapTypeFromOptions(value);

    // console.log('colorMap', colorMap, min, max)

    let colors = null, minValue = null, maxValue = null;
    if (this.state.previewColor != null) {
      colors = this.state.previewColor.legend.map(obj => {
        return <div style={{ flex: 1, backgroundColor: obj.color }} />;
      });
      minValue = this.state.previewColor.limits[0];
      maxValue = this.state.previewColor.limits[1];
    } else {
      colors = (
        <span style={{opacity: 0.5}}>No preview available</span>
      );
    }

    return (
      <div>
        <div className={styles.previewColorContainer}>{colors}</div>
        <div className={styles.MinMaxValues}>
          <span>{minValue}</span>
          <span>{maxValue}</span>
        </div>
        <SelectBox
          choices={colorMaps}
          // value={value ? value.colorMap : null}
          value={(colorMapType && colorMapType.colorMap) || null}
          name={name + '_colorMapselect'}
          validated={true}
          handleEnter={() => {}}
          wizardStyle={false}
          valueChanged={this.colorMapChanged.bind(this)}
          placeholder="Choose a color map"
          showSearchField={true}
          readonly={readonly}
        />

        <br />
        <span className="text-muted">Minimum of color map range</span>
        <br />
        <input
          type="number"
          autoComplete="false"
          onChange={e => this.valueChanged('min', this.toFloat(e.target.value))}
          // value={(value && typeof value.min === "number" ) ? value.min : ""}
          value={(colorMapType && colorMapType.min) || ""}
          placeholder="optional minimum of range"
          className={`${formStyles.FormControl} ${readonly
            ? inputStyles.ReadOnly
            : null}`}
          readOnly={readonly}
          disabled={readonly}
        />
        <br />
        <span className="text-muted">Maximum of color map range</span>
        <input
          type="number"
          autoComplete="false"
          // value={(value && typeof value.max === "number" ) ? value.max : ""}
          value={(colorMapType && colorMapType.max) || ""}
          onChange={e => this.valueChanged('max', this.toFloat(e.target.value))}
          placeholder="optional maximum of range"
          className={`${formStyles.FormControl} ${readonly
            ? inputStyles.ReadOnly
            : null}`}
          readOnly={readonly}
          disabled={readonly}
        />
      </div>
    );
  }
}

export default ColorMapInput;
