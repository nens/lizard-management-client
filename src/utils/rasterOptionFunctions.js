export function calculateNewStyleAndOptions(
  oldStyle,
  oldOptions,
  newStyleSignal
) {
  const oldColor = oldStyle.colorMap;
  const oldMin = oldStyle.min;
  const oldmax = oldStyle.max;
  let styleString = "";
  let newoptions = {};
  let newStyles = {};

  if (newStyleSignal.colorMap || newStyleSignal.colorMap === "") {
    newStyles = {
      colorMap: newStyleSignal.colorMap,
      min: oldMin,
      max: oldmax
    };
    styleString = composeStyleString(
      newStyleSignal.colorMap,
      styleMinMaxStrToValidString(oldMin),
      styleMinMaxStrToValidString(oldmax)
    );
    newoptions = createColorMapFromStylePlusOptions(styleString, oldOptions);
    return {
      styles: newStyles,
      options: newoptions
    };
  } else if (
    newStyleSignal.min ||
    newStyleSignal.min === "" ||
    newStyleSignal.min === 0
  ) {
    newStyles = {
      colorMap: oldColor,
      min: newStyleSignal.min,
      max: oldmax
    };
    styleString = composeStyleString(
      oldColor,
      styleMinMaxStrToValidString(newStyleSignal.min),
      styleMinMaxStrToValidString(oldmax)
    );
    newoptions = createColorMapFromStylePlusOptions(styleString, oldOptions);
    return {
      styles: newStyles,
      options: newoptions
    };
  } else if (
    newStyleSignal.max ||
    newStyleSignal.max === "" ||
    newStyleSignal.max === 0
  ) {
    newStyles = {
      colorMap: oldColor,
      min: oldMin,
      max: newStyleSignal.max
    };
    console.log('oldMin', oldMin, newStyleSignal.max)
    styleString = composeStyleString(
      oldColor,
      styleMinMaxStrToValidString(oldMin),
      styleMinMaxStrToValidString(newStyleSignal.max)
    );
    newoptions = createColorMapFromStylePlusOptions(styleString, oldOptions);
    return {
      styles: newStyles,
      options: newoptions
    };
  } else {
    return {
      styles: oldStyle,
      options: oldOptions
    };
  }
}

// if options is an object ( not a flat string) then it will have multiple layers
export function optionsHasLayers(options) {
  if (typeof options.styles === "object") {
    return true;
  } else {
    return false;
  }
}

// fill the option object with the new style string
// this depends on if the options obj has multiple layers
export function createColorMapFromStylePlusOptions(styles, options) {
  const newOptions = Object.assign({}, options);

  if (optionsHasLayers(newOptions)) {
    newOptions.styles[0][0] = styles;
  } else {
    newOptions.styles = styles;
  }
  return newOptions;
}

// style has this format:
// stylename:min:max
// stylename:min
// stylename
export function getColorMapFromStyle(style) {
  if (typeof style === "string") {
    return style.split(":")[0];
  } else {
    return "";
  }
}
export function getColorMinFromStyle(style) {
  if (typeof style === "string") {
    return style.split(":")[1] || "";
  } else {
    return "";
  }
}
export function getColorMaxFromStyle(style) {
  if (typeof style === "string") {
    return style.split(":")[2] || "";
  } else {
    return "";
  }
}
export function composeStyleString(color, min, max) {
  let str = "";
  str += color;
  if (min || max) {
    str += ":"
    // this even works if min is 0, because it is a string
    if (min) {
      str += min
    }
    str += ":"
    // this even works if max is 0, because it is a string
    if (max) {
      str += max
    }
  }

  return str;
}

export function getStyleFromOptions(options) {
  if (optionsHasLayers(options)) {
    return options.styles["0"]["0"];
  } else {
    return options.styles;
  }
}

// style = {
//   colorMap: '',
//   min: '',
//   max: '',
// }
// colorMap should always be filled
// if max is filled then min should also be filled
export function validateStyleObj(style) {
  if (style.max && style.max !== "") {
    if (style.min === "" || !style.min) {
      return {
        validated:false,
        errorMessage: "If a maximum is chosen, please also choose a minimum."
      };
    }
  } else if (style.min && style.min !== "") {
    if (style.max === "" || !style.max) {
      return {
        validated:false,
        errorMessage: "If a minimum is chosen, please also choose a maximum."
      };
    }
  }

  if (
    parseFloat(style.min) &&
    parseFloat(style.max) &&
    parseFloat(style.min) > parseFloat(style.max)
  ) {
    return {
      validated:false,
      errorMessage: "Minimum must be smaller than maximum."
    };
  }

  if (style.colorMap && style.colorMap !== "") {
    return {
      validated:true,
    };
  } else {
    return {
      validated:false,
      errorMessage: "Please choose a color map."
    };
  }
}

// the form will not invalidate:
// 0. -> 0.0
// . -> ""
export function styleMinMaxStrToValidString(str) {
  if (str === ".") {
    return "";
  } else if ((str+'').slice(-1) === ".") {
    return str + "0";
  } else {
    return str+'';
  }
}

// type ColorMapType = {
//   colorMap: string | null,
//   min?: number,
//   max?: number
// };

export function colorMapTypeFromOptions (options) {
  return {
    colorMap : getColorMapFromStyle(
      getStyleFromOptions(options)
    ),
    min : getColorMinFromStyle(getStyleFromOptions(options)),
    max : getColorMaxFromStyle(getStyleFromOptions(options)),
  }
}

