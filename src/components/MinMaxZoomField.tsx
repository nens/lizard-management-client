import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { getBoundsFromWmsLayer } from "../utils/getBoundsFromGeoServer";
import ClearInputButton from "./ClearInputButton";
import styles from "./SpatialBoundsField.module.css";
import durationStyles from "./DurationField.module.css";
import formStyles from "../styles/Forms.module.css";
import inputStyles from "../styles/Input.module.css";
import thresholdsStyles from './ThresholdsSelection.module.css';

interface MinMax {
  minZoom: number,
  maxZoom: number
};

interface Props {
  value: MinMax,
}

 const  MinMaxZoomFields =  (props:any) => {
  const {value, valueChanged} = props;
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
                            // id="north"
                            type="number"
                            className={
                                formStyles.FormControl +
                                " " +
                                durationStyles.TextAlignCenter
                            }
                            value={value.minZoom}
                            onChange={(e) => valueChanged({minZoom: e.target.value, maxZoom: value.maxZoom})}
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
                            // id="east"
                            type="number"
                            className={
                                formStyles.FormControl +
                                " " +
                                durationStyles.TextAlignCenter
                            }
                            value={value.minZoom}
                            onChange={(e) => valueChanged({minZoom: e.target.value, maxZoom: value.maxZoom})}
                        />
                    </div>
                    
                    
                </div>
                
            </div>
        );
}

export default  MinMaxZoomFields;

