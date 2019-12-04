import React, { Component } from "react";
import { getBoundsFromWmsLayer } from "../utils/getBoundsFromGeoServer";
import ClearInputButton from "./ClearInputButton";
import styles from "./DurationField.css";
import formStyles from "../styles/Forms.css";
import inputStyles from "../styles/Input.css";
import thresholdsStyles from './ThresholdsSelection.css';

interface SpatialBoundsProps {
    value: {
        north: string,
        east: string,
        south: string,
        west: string
    } | null,
    otherValues: {
        wmsLayerName: string,
        wmsLayerSlug: string,
        wmsLayerUrl: string,
    },
    valueChanged: Function,
};

// Validator
export const spatialBoundsValidator = (fieldValue: SpatialBoundsProps['value']) => {
    if (fieldValue) {
        const {
            north,
            east,
            south,
            west
        } = fieldValue;

        if (
            !north ||
            !east ||
            !south ||
            !west ||
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
        this.props.valueChanged({
            ...this.props.value,
            [key]: value
        });
    }
    removeSpatialBounds() {
        this.props.valueChanged(null);
    }
    // componentWillUpdate(nextProps: SpatialBoundsProps) {
    //     // If all fields are removed then update the spatial bounds value as null
    //     if (nextProps.value) {
    //         const {
    //             north,
    //             east,
    //             south,
    //             west
    //         } = nextProps.value;
    //         if (!north && !east && !south && !west) {
    //             this.props.valueChanged({
    //                 ...nextProps.value,
    //                 spatialBounds: null
    //             });
    //         };
    //     };
    // }
    render() {
        const {
            value,
            otherValues,
            valueChanged,
        } = this.props;

        const {
            wmsLayerSlug,
            wmsLayerUrl,
        } = otherValues;

        let north, east, south, west;

        if (value) {
            north = value.north ? value.north : "";
            east = value.east ? value.east : "";
            south = value.south ? value.south : "";
            west = value.west ? value.west : "";
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
                        <label>North (&deg;)</label>
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
                        <label>East (&deg;)</label>
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
                        <label>South (&deg;)</label>
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
                        <label>West (&deg;)</label>
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
                        display: (wmsLayerSlug && wmsLayerUrl) ? 'block' : 'none'
                    }}
                    onClick={() => getBoundsFromWmsLayer(
                        wmsLayerSlug,
                        wmsLayerUrl,
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
