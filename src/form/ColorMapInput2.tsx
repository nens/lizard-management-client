// {"styles": "Blues:0.0:2.0"}
// {"styles": "transparent", "HEIGHT": 512, "ZINDEX": 20, "WIDTH": 1024, "effects": "radar:0:0.008", "TRANSPARENT": false}
import React, { Component } from "react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";

import { SelectBox, choicesT } from "./SelectBox";

import { validatorResult } from "./validators";

import styles from "./ColorMapInput.module.css";
import formStyles from "../styles/Forms.module.css";
import inputStyles from "../styles/Input.module.css";
import { CheckBox } from "./CheckBox";

import {
  calculateNewStyleAndOptions,
  optionsHasLayers,
  validateStyleObj,
  colorMapTypeFromOptions
} from "../utils/rasterOptionFunctions";

interface ColorMapProps {
  title: string | JSX.Element,
  placeholder?: string,
  name: string,
  value: any,
  colorMaps: choicesT,
  validated: boolean,
  valueChanged: Function,
};

interface LegendResponse {
  limits: [number, number],
  legend: {color: string}[]
}

interface ColorMapState {
  previewColor: null | LegendResponse;
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

class ColorMapInput2 extends Component<ColorMapProps & InjectedIntlProps, ColorMapState> {
  constructor(props: ColorMapProps & InjectedIntlProps) {
    super(props);
    this.state = {
      previewColor: null
    };
    if (this.props.value === undefined || this.props.value === null) {
      props.valueChanged({
        options: {},
        rescalable: false,
      })
    }
  }

  setLocalStateFromProps(props: ColorMapProps) {
    const initiatedValue = props.value || {
      options: {},
      rescalable: false,
    };
    this.getRGBAGradient(colorMapTypeFromOptions(initiatedValue.options));
  }

  componentWillReceiveProps(newProps: ColorMapProps) {
    this.setLocalStateFromProps(newProps);
  }
  componentDidMount() {
    this.setLocalStateFromProps(this.props);
  }

  getRGBAGradient(value: any | null) {
    if (value && value.colorMap) {
      let style = value.colorMap;

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
    
    if (colorMap === null) {
      colorMap = '';
    }
    const initializedOptions = this.props.value || {
      options: {},
      rescalable: false,
    };
    const newStyleOptions = calculateNewStyleAndOptions(
      colorMapTypeFromOptions(initializedOptions.options),
      initializedOptions.options,
      {colorMap: colorMap}
    );
    this.props.valueChanged({
      options: newStyleOptions.options,
      rescalable: this.props.value.rescalable
    });
  }

  rescalableChanged(rescalable: boolean) {
    this.props.valueChanged({
      options: this.props.value.options,
      rescalable: rescalable
    });
  }

  valueChanged(field: string, value: number | null) {
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
        colorMapTypeFromOptions(this.props.value.options),
        this.props.value.options,
        {min: newValue}
      );
    } 
    else { //  (field === 'max') {
      newStyleOptions = calculateNewStyleAndOptions(
        colorMapTypeFromOptions(this.props.value.options),
        this.props.value.options,
        {max: newValue}
      );
    }

    this.props.valueChanged({
      options: newStyleOptions.options,
      rescalable: this.props.value.rescalable
    });
  }

  toFloat(value: string): number | null {
    if (!value) return null;

    const f = parseFloat(value);

    if (Number.isNaN(f)) return null;

    return f;
  }

  render() {
    const {
      title,
      name,
      colorMaps,
      value,
      intl
    } = this.props;

    
    const initiatedValue = value || {
      options: {},
      rescalable: false,
    }; 
    const readonly = optionsHasLayers(initiatedValue.options);
    const colorMapType = colorMapTypeFromOptions(initiatedValue.options);

    let colors = null, minValue = null, maxValue = null;
    if (this.state.previewColor != null) {
      colors = this.state.previewColor.legend.map((obj, i) => {
        return <div style={{ flex: 1, backgroundColor: obj.color }} key={i} />;
      });
      minValue = this.state.previewColor.limits[0];
      maxValue = this.state.previewColor.limits[1];
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
      <label
        htmlFor={name}
        className={formStyles.Label}
      >
        <span className={formStyles.LabelTitle}>
          {title}
        </span>
        <div>
          <div className={styles.previewColorContainer}>{colors}</div>
          <div className={styles.MinMaxValues}>
            <span>{minValue}</span>
            <span>{maxValue}</span>
          </div>
          <SelectBox
            title={''}
            choices={colorMaps}
            // value={value ? value.colorMap : null}
            value={(colorMapType && colorMapType.colorMap) || null}
            name={name + '_colorMapselect'}
            validated={true}
            valueChanged={this.colorMapChanged.bind(this)}
            placeholder={placeholderColorMapSelection}
            showSearchField={true}
            readOnly={readonly}
          />
          <span className="text-muted">
            <FormattedMessage id="color_map.minimum_color_range" />
          </span>
          <input
            type="number"
            autoComplete="off"
            onChange={e => this.valueChanged('min', this.toFloat(e.target.value))}
            value={(colorMapType && colorMapType.min) || ""}
            placeholder={placeholderMinimumColorRange}
            className={`${formStyles.FormControl} ${readonly
              ? inputStyles.ReadOnly
              : null}`}
            readOnly={readonly}
            disabled={readonly}
          />
          <span className="text-muted">
          <FormattedMessage id="color_map.maximum_color_range" />
          </span>
          <input
            type="number"
            autoComplete="off"
            value={(colorMapType && colorMapType.max) || ""}
            onChange={e => this.valueChanged('max', this.toFloat(e.target.value))}
            placeholder={placeholderMaximumColorRange}
            className={`${formStyles.FormControl} ${readonly
              ? inputStyles.ReadOnly
              : null}`}
            readOnly={readonly}
            disabled={readonly}
          />
          <br/>
          <CheckBox
            name="rescalable"
            title={<FormattedMessage id="color_map.rescalable" />}
            readonly={false}
            value= {initiatedValue.rescalable}
            valueChanged={((bool: boolean) => this.rescalableChanged(bool))}
          />
        </div>
      </label>
    );
  }
}

export default injectIntl(ColorMapInput2);