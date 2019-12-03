import React, { Component } from "react";
import { getBoundsFromWmsLayer } from "../utils/getBoundsFromGeoServer";
import ClearInputButton from "./ClearInputButton";
import styles from "./DurationField.css";
import formStyles from "../styles/Forms.css";
import inputStyles from "../styles/Input.css";
import thresholdsStyles from './ThresholdsSelection.css';

interface SpatialBoundsProps {
    name: string,
    value: {
        spatialBounds: SpatialBounds | null,
        wmsSlug: string,
        wmsUrl: string,
    },
    placeholder?: string,
    validators?: Function[],
    validated: boolean,
    handleEnter: (e: any) => void,
    valueChanged: Function,
    wizardStyle: boolean,
    readOnly?: boolean,
};

interface SpatialBounds {
    north: string,
    east: string,
    south: string,
    west: string
};

// Validator
export const spatialBoundsValidator = (fieldValue: SpatialBoundsProps['value']) => {
    if (fieldValue.spatialBounds) {
        const {
            north,
            east,
            south,
            west
        } = fieldValue.spatialBounds;

        if (
            // Check if a number is entered into the input field
            Number.isNaN(Number(north)) ||
            Number.isNaN(Number(east)) ||
            Number.isNaN(Number(south)) ||
            Number.isNaN(Number(west))
        ) {
            return "Please enter a number in all fields"
        } else if (north < south) {
            return "North coordinate cannot be smaller than South coordinate"
        } else if (east < west) {
            return "East coordinate cannot be smaller than West coordinate"
        } else {
            return false;
        };
    };
};

export default class SpatialBoundsField extends Component<SpatialBoundsProps, {}> {
    updateSpatialBounds(key: string, value: string) {
        const newSpatialBounds = {
            ...this.props.value.spatialBounds,
            [key]: value
        };
        this.props.valueChanged({
            ...this.props.value,
            spatialBounds: newSpatialBounds
        });
    }
    removeSpatialBounds() {
        this.props.valueChanged({
            ...this.props.value,
            spatialBounds: null
        });
    }
    render() {
        const {
            name,
            placeholder,
            value,
            validated,
            valueChanged,
            readOnly,
            handleEnter,
        } = this.props;

        const {
            spatialBounds,
            wmsSlug,
            wmsUrl,
        } = value;

        let north, east, south, west;

        if (spatialBounds) {
            north = spatialBounds.north ? spatialBounds.north : "";
            east = spatialBounds.east ? spatialBounds.east : "";
            south = spatialBounds.south ? spatialBounds.south : "";
            west = spatialBounds.west ? spatialBounds.west : "";
        } else {
            north = "";
            east = "";
            south = "";
            west = "";
        };

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
                            styles.DurationInputFields +
                            " " +
                            styles.DurationInputFieldDays +
                            " " +
                            styles.TextAlignCenter
                        }
                    >
                        <label>North</label>
                        <input
                            id="north"
                            type="text"
                            className={
                                formStyles.FormControl +
                                " " +
                                styles.TextAlignCenter
                            }
                            value={north}
                            onChange={(e) => this.updateSpatialBounds('north', e.target.value)}
                        />
                    </div>
                    <div
                        className={
                            styles.DurationInputFields +
                            " " +
                            styles.TextAlignCenter
                        }
                    >
                        <label>East</label>
                        <input
                            id="east"
                            type="text"
                            className={
                                formStyles.FormControl +
                                " " +
                                styles.TextAlignCenter
                            }
                            value={east}
                            onChange={(e) => this.updateSpatialBounds('east', e.target.value)}
                        />
                    </div>
                    <div
                        className={
                            styles.DurationInputFields +
                            " " +
                            styles.TextAlignCenter
                        }
                    >
                        <label>South</label>
                        <input
                            id="south"
                            type="text"
                            className={
                                formStyles.FormControl +
                                " " +
                                styles.TextAlignCenter
                            }
                            value={south}
                            onChange={(e) => this.updateSpatialBounds('south', e.target.value)}
                        />
                    </div>
                    <div
                        className={
                            styles.DurationInputFields +
                            " " +
                            styles.DurationInputFieldSeconds +
                            " " +
                            styles.TextAlignCenter
                        }
                    >
                        <label>West</label>
                        <input
                            id="west"
                            type="text"
                            className={
                                formStyles.FormControl +
                                " " +
                                styles.TextAlignCenter
                            }
                            value={west}
                            onChange={(e) => this.updateSpatialBounds('west', e.target.value)}
                        />
                    </div>
                    <ClearInputButton onClick={() => this.removeSpatialBounds()}/>
                </div>
                <button
                    className={thresholdsStyles.AddThresholdButton}
                    style={{
                        display: (wmsUrl && wmsSlug) ? 'block' : 'none'
                    }}
                    onClick={() => getBoundsFromWmsLayer(
                        wmsSlug,
                        wmsUrl,
                        value,
                        valueChanged
                    )}
                >
                    Get from GeoServer
                </button>
            </div>
        );
    }
}
