// {"styles": "Blues:0.0:2.0"}
// {"styles": "transparent", "HEIGHT": 512, "ZINDEX": 20, "WIDTH": 1024, "effects": "radar:0:0.008", "TRANSPARENT": false}
import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage, } from "react-intl.macro";
import {  useIntl } from 'react-intl';


import { SelectDropdown } from "./SelectDropdown";
import { CheckBox } from "./CheckBox";
import { TextInput } from "./TextInput";
import styles from "./ColorMapInput.module.css";
import formStyles from "../styles/Forms.module.css";
import {
  calculateNewStyleAndOptions,
  optionsHasLayers,
  validateStyleObj,
  colorMapTypeFromOptions
} from "../utils/rasterOptionFunctions";
import ModalBackground from '../components/ModalBackground';
import { ColormapForm } from '../data_management/colormap/ColormapForm';
import { useRecursiveFetch } from "../api/hooks";
import { convertToSelectObject } from "../utils/convertToSelectObject";

export interface ColorMapOptions {
  options: {
    styles?: string
  },
  rescalable: boolean,
  customColormap: any,
}

interface LegendResponse {
  limits: [number, number],
  legend: {color: string}[]
}

interface ColorMapProps {
  title: string | JSX.Element,
  name: string,
  colorMapValue: ColorMapOptions,
  valueChanged: (value: ColorMapOptions) => void,
  validated: boolean,
  errorMessage?: string | false,
  triedToSubmit?: boolean,
  placeholder?: string,
  validators?: Function[],
  form?: string,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
};

const colorMapValidator = (options: ColorMapOptions | null): {
  validated: boolean,
  minValidated: boolean,
  maxValidated: boolean,
  errorMessage?: string,
} => {
    const initiatedOptions = options || {
      options: {},
      rescalable: false,
      customColormap: {},
    };
    if (JSON.stringify(initiatedOptions.customColormap) !== "{}") {
      return {
        validated: true,
        minValidated: true,
        maxValidated: true,
      };
    }

    const colorMap = colorMapTypeFromOptions(initiatedOptions.options);

    return validateStyleObj(colorMap);
};

// Make a custom hook to keep previous value between renders
// The purpose is to deep compare values of colormap options
// (which is an object) so useEffect gets called correctly
const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const ColorMapInput: React.FC<ColorMapProps> = (props) => {
  const {
    title,
    name,
    colorMapValue,
    valueChanged,
    triedToSubmit,
    form,
    onFocus,
    onBlur,
  } = props;

  const intl = useIntl();

  // Fetch list of color maps
  const {
    data: colorMaps,
    isFetching: colorMapsIsFetching
  } = useRecursiveFetch('/api/v4/colormaps/', {
    format: 'json',
    page_size: 100
  });

  // Option to select a custom color map from the color map dropdown
  const customColorMapOption = {
    value: "Custom colormap",
    label: "Custom colormap",
    subLabel: "+ Create new colormap for this raster"
  };

  const [previewColor, setPreviewColor] = useState<LegendResponse | null>(null);
  const [showCustomColormapModal, setShowCustomColormapModal] = useState(false);

  const { options } = colorMapValue;
  const prevStyles = usePrevious(options.styles);

  useEffect(() => {
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

    // fetch legends of colormaps only when options' styles changed
    if (prevStyles !== options.styles) {
      getRGBAGradient(colorMapTypeFromOptions(options));
    };
  }, [previewColor, options, prevStyles]);

  const colorMapChanged = (colorMap: string | null) => {

    if (colorMap === "Custom colormap") {
      setShowCustomColormapModal(true);
      window.setTimeout(()=>{
        // @ts-ignore
        document.activeElement && document.activeElement.blur && document.activeElement.blur();
      },0)
      return;
    }

    if (colorMap === null) {
      colorMap = '';
    }
    const newStyleOptions = calculateNewStyleAndOptions(
      colorMapTypeFromOptions(colorMapValue.options),
      colorMapValue.options,
      {colorMap: colorMap}
    );
    valueChanged({
      options: newStyleOptions.options,
      rescalable: colorMapValue.rescalable,
      customColormap: colorMap !== "Custom colormap"? {} : colorMapValue.customColormap,
    });
  }

  const rescalableChanged = (rescalable: boolean) => {
    valueChanged({
      options: colorMapValue.options,
      rescalable: rescalable,
      customColormap: colorMapValue.customColormap,
    });
  }

  const customColormapChanged = (customColormap: any) => {
    valueChanged({
      options: JSON.stringify(customColormap) ==="{}"? colorMapValue.options : {},
      rescalable: colorMapValue.rescalable,
      customColormap: customColormap

    });
  }

  const handleValueChanged = (field: string, value: number | null) => {
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
        colorMapTypeFromOptions(colorMapValue.options),
        colorMapValue.options,
        {min: newValue}
      );
    } else { //  (field === 'max') {
      newStyleOptions = calculateNewStyleAndOptions(
        colorMapTypeFromOptions(colorMapValue.options),
        colorMapValue.options,
        {max: newValue}
      );
    }

    valueChanged({
      options: newStyleOptions.options,
      rescalable: colorMapValue.rescalable,
      customColormap: colorMapValue.customColormap,
    });
  }

  const toFloat = (value: string): number | null => {
    if (!value) return null;

    const f = parseFloat(value);

    if (Number.isNaN(f)) return null;

    return f;
  };

  const readOnly = optionsHasLayers(colorMapValue.options || {} );
  const colorMapType = colorMapTypeFromOptions(colorMapValue.options || {});

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
        <FormattedMessage id="color_map.initial_message" defaultMessage="No Preview available" />
      </span>
    );
  }

  //Format message for placeholder in the input form for translation
  const placeholderColorMapSelection = intl.formatMessage({ id: "placeholder_color_map_selection" })
  const placeholderMinimumColorRange = intl.formatMessage({ id: "placeholder_minimum_color_range" })
  const placeholderMaximumColorRange = intl.formatMessage({ id: "placeholder_maximum_color_range" })

  return (
    <label
      htmlFor={name+'colormapInput'}
      className={formStyles.Label}
    >
      {showCustomColormapModal? 
        <ModalBackground
          title={'CUSTOM COLORMAP'}
          handleClose={() => setShowCustomColormapModal(false)}
          // previously this value was precisely hardcoded to pixels, because some of the content has a fixed minheight
          // height={'816px'}
          height={'90%'}
          width={'50%'} 
        >
          <div
            style={{padding: "30px", flexGrow: 1, minHeight: 0,}}
          >
            <ColormapForm
              currentRecord={colorMapValue.customColormap.data? colorMapValue.customColormap: undefined}
              cancelAction={()=>{setShowCustomColormapModal(false)}}
              confirmAction={(customColormap:any)=>{
                customColormapChanged(customColormap);
                setShowCustomColormapModal(false);
              }}
            />
          </div>
        </ModalBackground>
      :null}
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div>
        <div className={styles.previewColorContainer}>{colors}</div>
        <div className={styles.MinMaxValues}>
          <span>{minValue}</span>
          <span>{maxValue}</span>
        </div>
        <div style={{position: "relative"}}>
          <SelectDropdown
            title={''}
            name={name}
            options={colorMaps ? [
              customColorMapOption,
              ...colorMaps.map((colorMap: any) => convertToSelectObject(colorMap.name, colorMap.name, colorMap.description))
            ] : [
              customColorMapOption
            ]}
            isLoading={colorMapsIsFetching}
            value={JSON.stringify(colorMapValue.customColormap) !== "{}" && JSON.stringify(colorMapValue.options) === "{}" ? (
              {
                value: "Custom colormap",
                label: "Custom colormap"
              }
            ) : colorMapType.colorMap ? (
              {
                value: colorMapType.colorMap,
                label: colorMapType.colorMap
              }
            ) : null}
            validated={colorMapValidator(colorMapValue).validated}
            errorMessage={colorMapValidator(colorMapValue).errorMessage}
            triedToSubmit={triedToSubmit}
            valueChanged={option => {
              // @ts-ignore
              colorMapChanged(option? option.value : null);
            }}
            placeholder={placeholderColorMapSelection}
            readOnly={readOnly}
            form={form}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {JSON.stringify(colorMapValue.customColormap) !=="{}" && JSON.stringify(colorMapValue.options) ==="{}"?
            <div style={{position:"absolute", left: 164, top: 20}}>
              <button
                onClick={()=>setShowCustomColormapModal(true)}
                className={styles.ColormapEditButton}
              >
                <i className='fa fa-edit' title='Undo' /> 
                {" EDIT"}
              </button>
            </div>
            :
            null
          }
        </div>
        <TextInput
          title={'Minimum of color map range'}
          name={'colormap_minimum'}
          type={'number'}
          placeholder={placeholderMinimumColorRange}
          value={(colorMapType && colorMapType.min) || ""}
          valueChanged={e => handleValueChanged('min', toFloat(e.target.value))}
          validated={colorMapValidator(colorMapValue).minValidated}
          errorMessage={colorMapValidator(colorMapValue).errorMessage}
          triedToSubmit={triedToSubmit}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={readOnly}
          form={form}
        />
        <TextInput
          title={'Maximum of color map range'}
          name={'colormap_maximum'}
          type={'number'}
          placeholder={placeholderMaximumColorRange}
          value={(colorMapType && colorMapType.max) || ""}
          valueChanged={e => handleValueChanged('max', toFloat(e.target.value))}
          validated={colorMapValidator(colorMapValue).maxValidated}
          errorMessage={colorMapValidator(colorMapValue).errorMessage}
          triedToSubmit={triedToSubmit}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={readOnly}
          form={form}
        />
        <CheckBox
          title={'Rescalable'}
          name={name+'_rescalable'}
          value={colorMapValue.rescalable}
          valueChanged={(bool: boolean) => rescalableChanged(bool)}
          form={form}
          onFocus={onFocus}
          onBlur={onBlur}
        />      
      </div>
    </label>
  );
}

export default (ColorMapInput);