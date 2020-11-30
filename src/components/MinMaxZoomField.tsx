import React from "react";
// import { FormattedMessage } from "react-intl";
// import styles from "./SpatialBoundsField.module.css";
import durationStyles from "../forms/DurationField.module.css";
import formStyles from "../styles/Forms.module.css";
import inputStyles from "../styles/Input.module.css";
// import thresholdsStyles from './ThresholdsSelection.module.css';

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

 const  MinMaxZoomFields =  (props: Props) => {
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
                            value={value.maxZoom}
                            onChange={(e) => valueChanged({minZoom: value.minZoom, maxZoom: e.target.value})}
                        />
                    </div>
                    
                    
                </div>
                
            </div>
        );
}

export default  MinMaxZoomFields;

