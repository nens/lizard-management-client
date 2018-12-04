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

  if (this.colorMapHasLayers(newOptions)) {
    newOptions.styles[0][0] = styles;
  } else {
    newOptions.styles = styles;
  }
  return colorMap;
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
    return style.split(":")[1];
  } else {
    return "";
  }
}
export function getColorMaxFromStyle(style) {
  if (typeof style === "string") {
    return style.split(":")[2];
  } else {
    return "";
  }
}
export function composeStyleString(color, min, max) {
  let str = "";
  str += color;
  if (min && min != "") {
    str += ":" + min;

    // we can only add max if min is also added
    if (max && max != "") {
      str += ":" + max;
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
//   name: '',
//   min: '',
//   max: '',
// }
// name should always be filled
// if max is filled then min should also be filled
export function validateStyleObj(style) {
  if (style.max && style.max != "") {
    if (style.min === "" || !style.min) {
      return false;
    }
  }

  if (style.name && style.name != "") {
    return true;
  } else {
    return false;
  }
}

// the form will not invalidate:
// 0. -> 0.0
// . -> ""
export function styleMinMaxStrToValidString(str) {
  if (str === ".") {
    return "";
  } else if (str.slice(-1) === ".") {
    return str + "0";
  } else {
    return str;
  }
}
