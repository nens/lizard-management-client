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
import Modal from '../components/Modal';
import { ColormapForm } from '../data_management/colormap/ColormapForm';


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
  value: ColorMapOptions,
  valueChanged: (value: ColorMapOptions) => void,
  colorMaps: choicesT,
  validated: boolean,
  errorMessage?: string | false,
  triedToSubmit?: boolean,
  placeholder?: string,
  validators?: Function[],
  form?: string,
};

export const colorMapValidator = (options: ColorMapOptions | null): validatorResult => {
    const initiatedOptions = options || {
      options: {},
      rescalable: false,
      customColormap: {},
    };
    if (JSON.stringify(initiatedOptions.customColormap) !== "{}") {
      return false;
    }

    const colorMap = colorMapTypeFromOptions(initiatedOptions.options);

    const result = validateStyleObj(colorMap);
    if (result.validated === true) {
      return false;
    } else {
      return result.errorMessage + '';
    };
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

const ColorMapInput: React.FC<ColorMapProps & InjectedIntlProps> = (props) => {
  const {
    title,
    name,
    colorMaps,
    value,
    valueChanged,
    validated,
    errorMessage,
    triedToSubmit,
    intl,
    form,
  } = props;

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

  const [previewColor, setPreviewColor] = useState<LegendResponse | null>(null);
  const [colorMapValue, setColorMapValue] = useState<ColorMapOptions>({
    options: {},
    rescalable: false,
    customColormap: {},
  });
  const [showCustomColormapModal, setShowCustomColormapModal] = useState(false);

  const { options } = colorMapValue;
  const prevStyles = usePrevious(options.styles);

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setColorMapValue(value);
    };
  }, [value]);

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
    } 
    else { //  (field === 'max') {
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
        <FormattedMessage id="color_map.initial_message" />
      </span>
    );
  }

  //Format message for placeholder in the input form for translation
  const placeholderColorMapSelection = intl.formatMessage({ id: "placeholder_color_map_selection" })
  const placeholderMinimumColorRange = intl.formatMessage({ id: "placeholder_minimum_color_range" })
  const placeholderMaximumColorRange = intl.formatMessage({ id: "placeholder_maximum_color_range" })

  console.log('colorMaps', colorMaps)
  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      {showCustomColormapModal? 
        <Modal
          title={'CUSTOM COLORMAP'}
          // closeDialogAction={()=>{
          // setShowDeleteFailedModal(false);
          // setRowToBeDeleted(null);
          // }}
        >
          <ColormapForm
            currentRecord={value.customColormap.data? value.customColormap: undefined}
            cancelAction={()=>{setShowCustomColormapModal(false)}}
            confirmAction={(customColormap:any)=>{
              customColormapChanged(customColormap);
              setShowCustomColormapModal(false);
            }}
          />
          {/* <form
            className={formStyles.Form}
            // onSubmit={handleSubmit}
            // onReset={handleReset}
          >

            <div
              className={formStyles.ButtonContainer}
            >
              <button
                className={buttonStyles.ButtonLink}
              >
                CANCEL
              </button>
              <SubmitButton
                onClick={()=>{}}
              />
            </div>
          </form> */}
        </Modal>
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
          <SelectBox
            title={''}
            choices={[["Custom colormap","Custom colormap","+ Create new colormap for this raster"],...colorMaps]}
            value={JSON.stringify(colorMapValue.customColormap) !=="{}" && JSON.stringify(colorMapValue.options) ==="{}" ? "Custom colormap" : (colorMapType && colorMapType.colorMap) || null}
            name={name + '_colorMapselect'}
            validated={validated}
            errorMessage={errorMessage}
            triedToSubmit={triedToSubmit}
            valueChanged={(colormap)=>{ 
              colorMapChanged(colormap); 
            }}
            placeholder={placeholderColorMapSelection}
            showSearchField={true}
            readOnly={readOnly}
            form={form}
          />
          {
            JSON.stringify(colorMapValue.customColormap) !=="{}" && JSON.stringify(colorMapValue.options) ==="{}"?
            <div style={{position:"absolute", left: "164px", top: "18px"}}>
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
        
  
        <br />
        <span className="text-muted">
          <FormattedMessage id="color_map.minimum_color_range" />
        </span>
        <br />
        <input
          type="number"
          autoComplete="off"
          onChange={e => handleValueChanged('min', toFloat(e.target.value))}
          value={(colorMapType && colorMapType.min) || ""}
          placeholder={placeholderMinimumColorRange}
          className={formStyles.FormControl}
          readOnly={readOnly}
          disabled={readOnly}
          form={form}
        />
        <br />
        <span className="text-muted">
        <FormattedMessage id="color_map.maximum_color_range" />
        </span>
        <input
          type="number"
          autoComplete="off"
          value={(colorMapType && colorMapType.max) || ""}
          onChange={e => handleValueChanged('max', toFloat(e.target.value))}
          placeholder={placeholderMaximumColorRange}
          className={formStyles.FormControl}
          readOnly={readOnly}
          disabled={readOnly}
          form={form}
        />
        <br/>
        <CheckBox
          title={'Rescalable'}
          name={'rescalable'}
          value={colorMapValue.rescalable}
          valueChanged={(bool: boolean) => rescalableChanged(bool)}
          form={form}
        />      
      </div>
    </label>
  );
}

export default injectIntl(ColorMapInput);