// {"styles": "Blues:0.0:2.0"}
// {"styles": "transparent", "HEIGHT": 512, "ZINDEX": 20, "WIDTH": 1024, "effects": "radar:0:0.008", "TRANSPARENT": false}
import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl.macro";
// import { useIntl} from 'react-intl';
// import {formattedMessageToString} from './../utils/translationUtils';
import { SelectDropdown } from "./SelectDropdown";
import { CheckBox } from "./CheckBox";
import { FloatInput } from "./FloatInput";
import styles from "./ColorMapInput.module.css";
import formStyles from "../styles/Forms.module.css";
import {
  calculateNewStyleAndOptions,
  optionsHasLayers,
  validateStyleObj,
  colorMapTypeFromOptions,
} from "../utils/rasterOptionFunctions";
import ModalBackground from "../components/ModalBackground";
import { ColormapForm } from "../data_management/colormap/ColormapForm";
import { useRecursiveFetch } from "../api/hooks";
import { convertToSelectObject } from "../utils/convertToSelectObject";

export interface ColorMapOptions {
  options: {
    styles?: string;
  };
  rescalable: boolean;
  customColormap: any;
}

interface LegendResponse {
  limits: [number, number];
  legend: { color: string }[];
}

interface ColorMapProps {
  title: string | JSX.Element;
  name: string;
  colorMapValue: ColorMapOptions;
  valueChanged: (value: ColorMapOptions) => void;
  validated: boolean;
  errorMessage?: string | false;
  triedToSubmit?: boolean;
  placeholder?: string;
  form?: string;
  validators?: Function[];
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export const colorMapValidator = (
  options: ColorMapOptions | null
): {
  validated: boolean;
  minValidated: boolean;
  maxValidated: boolean;
  errorMessage?: string;
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
  const { title, name, colorMapValue, valueChanged, triedToSubmit, onFocus, onBlur, form } = props;

  // const intl = useIntl();

  // Fetch list of color maps
  const { data: colorMaps, isFetching: colorMapsIsFetching } = useRecursiveFetch(
    "/api/v4/colormaps/",
    {
      format: "json",
      page_size: 100,
    }
  );

  // Option to select a custom color map from the color map dropdown
  const customColorMapOption = {
    value: "Custom colormap",
    label: "Custom colormap",
    subLabel: "+ Create new colormap for this raster",
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
        }

        fetch("/wms/?request=getlegend&style=" + style + "&steps=100&format=json", {
          credentials: "same-origin",
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((responseData) => setPreviewColor(responseData));
      } else if (previewColor) {
        // If the color map is unselected, also don't show a preview
        setPreviewColor(null);
      }
    };

    // fetch legends of colormaps only when options' styles changed
    if (prevStyles !== options.styles) {
      getRGBAGradient(colorMapTypeFromOptions(options));
    }
  }, [previewColor, options, prevStyles]);

  const colorMapChanged = (colorMap: string | null) => {
    if (colorMap === "Custom colormap") {
      setShowCustomColormapModal(true);
      window.setTimeout(() => {
        if (document.activeElement && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        };
      }, 0);
      return;
    }

    if (colorMap === null) {
      colorMap = "";
    }
    const newStyleOptions = calculateNewStyleAndOptions(
      colorMapTypeFromOptions(colorMapValue.options),
      colorMapValue.options,
      { colorMap: colorMap }
    );
    valueChanged({
      options: newStyleOptions.options,
      rescalable: colorMapValue.rescalable,
      customColormap: colorMap !== "Custom colormap" ? {} : colorMapValue.customColormap,
    });
  };

  const rescalableChanged = (rescalable: boolean) => {
    valueChanged({
      options: colorMapValue.options,
      rescalable: rescalable,
      customColormap: colorMapValue.customColormap,
    });
  };

  const customColormapChanged = (customColormap: any) => {
    valueChanged({
      options: JSON.stringify(customColormap) === "{}" ? colorMapValue.options : {},
      rescalable: colorMapValue.rescalable,
      customColormap: customColormap,
    });
  };

  const handleValueChanged = (field: string, value: number) => {
    let newValue;

    if (field !== "min" && field !== "max") return;

    if (isNaN(value)) {
      newValue = "";
    } else {
      newValue = value;
    }

    let newStyleOptions;
    if (field === "min") {
      newStyleOptions = calculateNewStyleAndOptions(
        colorMapTypeFromOptions(colorMapValue.options),
        colorMapValue.options,
        { min: newValue }
      );
    } else {
      //  (field === 'max') {
      newStyleOptions = calculateNewStyleAndOptions(
        colorMapTypeFromOptions(colorMapValue.options),
        colorMapValue.options,
        { max: newValue }
      );
    }

    valueChanged({
      options: newStyleOptions.options,
      rescalable: colorMapValue.rescalable,
      customColormap: colorMapValue.customColormap,
    });
  };

  const readOnly = optionsHasLayers(colorMapValue.options || {});
  const colorMapType = colorMapTypeFromOptions(colorMapValue.options || {});

  let colors = null,
    minValue = null,
    maxValue = null;
  if (previewColor !== null) {
    colors = previewColor.legend.map((obj, i) => {
      return <div style={{ flex: 1, backgroundColor: obj.color }} key={i} />;
    });
    minValue = previewColor.limits[0];
    maxValue = previewColor.limits[1];
  } else {
    colors = (
      <span style={{ opacity: 0.5 }}>
        {0 ? (
          <FormattedMessage id="color_map.initial_message" defaultMessage="No Preview available" />
        ) : null}
        No Preview available
      </span>
    );
  }

  // These translations will later be used
  // const placeholderColorMapSelection = formattedMessageToString(<FormattedMessage id="placeholder_color_map_selection" defaultMessage="Choose a color map" />, intl)
  // const placeholderMinimumColorRange = formattedMessageToString(<FormattedMessage id="placeholder_minimum_color_range" defaultMessage="Optional minimum of range" />, intl)
  // const placeholderMaximumColorRange = formattedMessageToString(<FormattedMessage id="placeholder_maximum_color_range" defaultMessage="Optional maximum of range" />, intl)

  const placeholderColorMapSelection = "Choose a color map";
  const placeholderMinimumColorRange = "Optional minimum of range";
  const placeholderMaximumColorRange = "Optional maximum of range";

  return (
    <label htmlFor={name + "colormapInput"} className={formStyles.Label}>
      {showCustomColormapModal ? (
        <ModalBackground
          title={"CUSTOM COLORMAP"}
          handleClose={() => setShowCustomColormapModal(false)}
          // previously this value was precisely hardcoded to pixels, because some of the content has a fixed minheight
          // height={'816px'}
          style={{
            width: "50%",
            height: "90%",
          }}
        >
          <div style={{ padding: "30px", flexGrow: 1, minHeight: 0 }}>
            <ColormapForm
              currentRecord={
                colorMapValue.customColormap.data ? colorMapValue.customColormap : undefined
              }
              cancelAction={() => {
                setShowCustomColormapModal(false);
              }}
              confirmAction={(customColormap) => {
                customColormapChanged(customColormap);
                setShowCustomColormapModal(false);
              }}
            />
          </div>
        </ModalBackground>
      ) : null}
      <span className={formStyles.LabelTitle}>{title}</span>
      <div>
        <div className={styles.previewColorContainer}>{colors}</div>
        <div className={styles.MinMaxValues}>
          <span>{minValue}</span>
          <span>{maxValue}</span>
        </div>
        <div style={{ position: "relative" }}>
          <SelectDropdown
            title={""}
            name={name}
            options={
              colorMaps
                ? [
                    customColorMapOption,
                    ...colorMaps.map(colorMap => convertToSelectObject(colorMap.name, colorMap.name, colorMap.description))
                  ]
                : [customColorMapOption]
            }
            isLoading={colorMapsIsFetching}
            value={
              JSON.stringify(colorMapValue.customColormap) !== "{}" &&
              JSON.stringify(colorMapValue.options) === "{}"
                ? {
                    value: "Custom colormap",
                    label: "Custom colormap",
                  }
                : colorMapType.colorMap
                ? {
                    value: colorMapType.colorMap,
                    label: colorMapType.colorMap,
                  }
                : null
            }
            validated={colorMapValidator(colorMapValue).validated}
            errorMessage={colorMapValidator(colorMapValue).errorMessage}
            triedToSubmit={triedToSubmit}
            valueChanged={(option) => {
              // @ts-ignore
              colorMapChanged(option ? option.value : null);
            }}
            placeholder={placeholderColorMapSelection}
            readOnly={readOnly}
            form={form}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {JSON.stringify(colorMapValue.customColormap) !== "{}" &&
          JSON.stringify(colorMapValue.options) === "{}" ? (
            <div style={{ position: "absolute", left: 164, top: 20 }}>
              <button
                onClick={() => setShowCustomColormapModal(true)}
                className={styles.ColormapEditButton}
              >
                <i className="fa fa-edit" title="Undo" />
                {" EDIT"}
              </button>
            </div>
          ) : null}
        </div>
        <FloatInput
          title={"Minimum of color map range"}
          name={"colormap_minimum"}
          placeholder={placeholderMinimumColorRange}
          value={colorMapType ? parseFloat(colorMapType.min) : NaN}
          valueChanged={(value) => handleValueChanged("min", value)}
          validated={colorMapValidator(colorMapValue).minValidated}
          errorMessage={colorMapValidator(colorMapValue).errorMessage}
          triedToSubmit={triedToSubmit}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={readOnly}
          form={form}
        />
        <FloatInput
          title={"Maximum of color map range"}
          name={"colormap_maximum"}
          placeholder={placeholderMaximumColorRange}
          value={colorMapType ? parseFloat(colorMapType.max) : NaN}
          valueChanged={(value) => handleValueChanged("max", value)}
          validated={colorMapValidator(colorMapValue).maxValidated}
          errorMessage={colorMapValidator(colorMapValue).errorMessage}
          triedToSubmit={triedToSubmit}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={readOnly}
          form={form}
        />
        <CheckBox
          title={"Rescalable"}
          name={name + "_rescalable"}
          value={colorMapValue.rescalable}
          valueChanged={(bool: boolean) => rescalableChanged(bool)}
          onFocus={onFocus}
          onBlur={onBlur}
          form={form}
        />
      </div>
    </label>
  );
};

export default ColorMapInput;
