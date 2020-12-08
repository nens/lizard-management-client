import React, { useEffect, useRef } from "react";
import durationStyles from "../forms/DurationField.module.css";
import formStyles from "../styles/Forms.module.css";
import inputStyles from "../styles/Input.module.css";

export const isValidIntegerZeroOrLarger = (value: any) => {
  if (isNaN(value) || typeof value !== 'number') {
      return {
          valid: false,
          invalidMessage: "Enter a valid number",
      }
  } 
  else if (value < 0 ) {
      return {
          valid: false,
          invalidMessage: "Number needs to be at least 0",
      }
  }
  else if ((value+'').includes(".")) {
      return {
          valid: false,
          invalidMessage: "Only integers allowed",
      }
  }
  else {
      return {
          valid: true,
          invalidMessage: "",
      }
  }
} 

export interface MinMax {
  minZoom: number,
  maxZoom: number
};

interface Props {
  name: string,
  value: MinMax,
  valueChanged: Function,
  triedToSubmit: boolean,
}

const isValidMaxZoom = (min:any, max: any) => {
    const minZoomValidated = isValidIntegerZeroOrLarger(min);
    const maxZoomValidated = isValidIntegerZeroOrLarger(max);
    if (!maxZoomValidated.valid) {
        return maxZoomValidated;
    } else if (minZoomValidated) {
        if (max >= min) {
            return {
                valid: true,
                invalidMessage: "",
            }
        } 
        else {
            return {
                valid: false,
                invalidMessage: "Max must be greater than min",
            }
        }
    } else {
        // if min zoom not validated impossible yet to invalidate maxzoom
        return {
            valid: true,
            invalidMessage: "",
        }
    }

}


 const  MinMaxZoomFields =  (props: Props) => {

    const {value, valueChanged} = props;
    const minZoomInput = useRef<HTMLInputElement>(null);
    const maxZoomInput = useRef<HTMLInputElement>(null);

    const minZoomValidated = isValidIntegerZeroOrLarger(value.minZoom); 
    const maxZoomValidated = isValidMaxZoom(value.minZoom, value.maxZoom);

    useEffect(() => {
        if (minZoomInput && minZoomInput.current) {
            if (minZoomValidated.valid) {
                minZoomInput.current.setCustomValidity('');
            } else {
                minZoomInput.current.setCustomValidity(minZoomValidated.invalidMessage);
            }
        }
        if (maxZoomInput && maxZoomInput.current) {
            if (maxZoomValidated.valid) {
                maxZoomInput.current.setCustomValidity('');
            } else {
                maxZoomInput.current.setCustomValidity(maxZoomValidated.invalidMessage);
            }
        }

    })

    return (
        <div>
            <div
                className={
                    formStyles.FormGroup +
                    " " +
                    inputStyles.PositionRelative
                }
            >
                <div
                    className={
                        durationStyles.DurationInputFields +
                        " " +
                        durationStyles.DurationInputFieldDays +
                        " " +
                        durationStyles.TextAlignCenter
                    }
                >
                    <label>
                        Minimal Zoom
                    </label>
                    <input
                        type="number"
                        className={
                            formStyles.FormControl +
                            " " +
                            durationStyles.TextAlignCenter
                        }
                        value={value.minZoom}
                        onChange={(e) => valueChanged({minZoom: parseFloat(e.target.value), maxZoom: value.maxZoom})}
                        ref={minZoomInput}
                    />
                </div>
                <div
                    className={
                        durationStyles.DurationInputFields +
                        " " +
                        durationStyles.TextAlignCenter
                    }
                >
                    <label>
                        Maximal zoom
                    </label>
                    <input
                        type="number"
                        className={
                            formStyles.FormControl +
                            " " +
                            durationStyles.TextAlignCenter
                        }
                        value={value.maxZoom}
                        onChange={(e) => valueChanged({minZoom: value.minZoom, maxZoom: parseFloat(e.target.value)})}
                        ref={maxZoomInput}
                    />
                </div>


            </div>

        </div>
    );
}

export default  MinMaxZoomFields;