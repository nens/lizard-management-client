import React, { Component } from "react";
import { getBoundsFromWmsLayer } from "../utils/getBoundsFromGeoServer";
import ClearInputButton from "./ClearInputButton";
import styles from "./SpatialBoundsField.css";
import durationStyles from "./DurationField.css";
import formStyles from "../styles/Forms.css";
import inputStyles from "../styles/Input.css";
import thresholdsStyles from './ThresholdsSelection.css';

interface SpatialBoundsProps {
    value: {
        north: number,
        east: number,
        south: number,
        west: number
    } | null,
    otherValues: {
        wmsLayerName: string,
        wmsLayerSlug: string,
        wmsLayerUrl: string,
    },
    valueChanged: Function,
};

interface MyState {
    getFromGeoserverError: boolean,
}

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
            Number.isNaN(north) ||
            Number.isNaN(east) ||
            Number.isNaN(south) ||
            Number.isNaN(west)
        ) {
            return "Please enter a number in all fields or clear all inputs"
        } else if (north < south) {
            return "North coordinate cannot be smaller than South coordinate"
        } else if (east < west) {
            return "East coordinate cannot be smaller than West coordinate"
        } else {
            return false;
        };
    };
};

export default class SpatialBoundsField extends Component<SpatialBoundsProps, MyState> {
    state={
        getFromGeoserverError: false,
    }
    showErrorMessage = () => {
        this.setState({
            getFromGeoserverError: true
        });
    }
    closeErrorMessage = () => {
        this.setState({
            getFromGeoserverError: false
        });
    }
    updateSpatialBounds(key: string, value: string) {
        this.props.valueChanged({
            ...this.props.value,
            [key]: parseFloat(value)
        });
    }
    removeSpatialBounds() {
        this.props.valueChanged(null);
    }
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
            north = Number.isFinite(value.north) ? value.north : "";
            east = Number.isFinite(value.east) ? value.east : "";
            south = Number.isFinite(value.south) ? value.south : "";
            west = Number.isFinite(value.west) ? value.west : "";
        } else {
            north = "";
            east = "";
            south = "";
            west = "";
        };

        return (
            <div
                onClick={this.closeErrorMessage}
                onMouseLeave={this.closeErrorMessage}
            >
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
                        <label>North (&deg;)</label>
                        <input
                            id="north"
                            type="number"
                            className={
                                formStyles.FormControl +
                                " " +
                                durationStyles.TextAlignCenter
                            }
                            value={north}
                            onChange={(e) => this.updateSpatialBounds('north', e.target.value)}
                        />
                    </div>
                    <div
                        className={
                            durationStyles.DurationInputFields +
                            " " +
                            durationStyles.TextAlignCenter
                        }
                    >
                        <label>East (&deg;)</label>
                        <input
                            id="east"
                            type="number"
                            className={
                                formStyles.FormControl +
                                " " +
                                durationStyles.TextAlignCenter
                            }
                            value={east}
                            onChange={(e) => this.updateSpatialBounds('east', e.target.value)}
                        />
                    </div>
                    <div
                        className={
                            durationStyles.DurationInputFields +
                            " " +
                            durationStyles.TextAlignCenter
                        }
                    >
                        <label>South (&deg;)</label>
                        <input
                            id="south"
                            type="number"
                            className={
                                formStyles.FormControl +
                                " " +
                                durationStyles.TextAlignCenter
                            }
                            value={south}
                            onChange={(e) => this.updateSpatialBounds('south', e.target.value)}
                        />
                    </div>
                    <div
                        className={
                            durationStyles.DurationInputFields +
                            " " +
                            durationStyles.DurationInputFieldSeconds +
                            " " +
                            durationStyles.TextAlignCenter
                        }
                    >
                        <label>West (&deg;)</label>
                        <input
                            id="west"
                            type="number"
                            className={
                                formStyles.FormControl +
                                " " +
                                durationStyles.TextAlignCenter
                            }
                            value={west}
                            onChange={(e) => this.updateSpatialBounds('west', e.target.value)}
                        />
                    </div>
                    <ClearInputButton onClick={() => this.removeSpatialBounds()}/>
                </div>
                <div className={styles.GetFromGeoServer}>
                    <button
                        className={thresholdsStyles.AddThresholdButton}
                        style={{
                            display: (wmsLayerSlug && wmsLayerUrl) ? 'block' : 'none'
                        }}
                        onClick={() => getBoundsFromWmsLayer(
                            wmsLayerSlug,
                            wmsLayerUrl,
                            value,
                            valueChanged,
                            this.showErrorMessage
                        )}
                    >
                        Get from GeoServer
                    </button>
                    &nbsp;
                    <span
                        className={styles.GetFromGeoServerError}
                        style={{
                            display: this.state.getFromGeoserverError ? 'block' : 'none'
                        }}
                    >
                        Failed to get extent from GeoServer
                    </span>
                </div>
            </div>
        );
    }
}
