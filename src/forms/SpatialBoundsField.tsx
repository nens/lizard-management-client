import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { getBoundsFromWmsLayer } from "../utils/getBoundsFromGeoServer";
import ClearInputButton from "./ClearInputButton";
import styles from "./SpatialBoundsField.module.css";
import durationStyles from "./DurationField.module.css";
import formStyles from "../styles/Forms.module.css";
import inputStyles from "../styles/Input.module.css";
import thresholdsStyles from './ThresholdsSelection.module.css';
import {SpatialBounds} from '../types/mapTypes'

interface SpatialBoundsProps {
    value: SpatialBounds | null,
    otherValues: {
        wmsLayerName: string,
        wmsLayerSlug: string,
        wmsLayerUrl: string,
    },
    valueChanged: Function,
    geoServerError: boolean,
    showGeoServerError: Function,
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
            north === undefined || Number.isNaN(north) ||
            east === undefined || Number.isNaN(east) ||
            south === undefined || Number.isNaN(south) ||
            west === undefined || Number.isNaN(west)
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

export default class SpatialBoundsField extends Component<SpatialBoundsProps, {}> {
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
            geoServerError,
            showGeoServerError,
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
                            <FormattedMessage id="wms_layer_form.north" />
                            &nbsp;(&deg;)
                        </label>
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
                        <label>
                            <FormattedMessage id="wms_layer_form.east" />
                            &nbsp;(&deg;)
                        </label>
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
                        <label>
                            <FormattedMessage id="wms_layer_form.south" />
                            &nbsp;(&deg;)
                        </label>
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
                        <label>
                            <FormattedMessage id="wms_layer_form.west" />
                            &nbsp;(&deg;)
                        </label>
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
                            showGeoServerError
                        )}
                        type={"button"}
                    >
                        <FormattedMessage
                            id="wms_layer_form.get_from_geoserver"
                            defaultMessage="Get from GeoServer"
                        />
                    </button>
                    &nbsp;
                    <span
                        className={styles.GetFromGeoServerError}
                        style={{
                            display: geoServerError ? 'block' : 'none'
                        }}
                    >
                        Failed to get extent from GeoServer
                    </span>
                </div>
            </div>
        );
    }
}
