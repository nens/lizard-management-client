import React, { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl.macro";
import { getBoundsFromWmsLayer } from "../utils/getBoundsFromGeoServer";
import { ClearInputButton } from "../form/ClearInputButton";
import styles from "./SpatialBoundsField.module.css";
import formStyles from "../styles/Forms.module.css";
import inputStyles from "../styles/Input.module.css";
import { SpatialBounds } from '../types/mapTypes';


interface SpatialBoundsProps {
    title: string,
    name: string,
    clearInput: (e: any) => void,
    triedToSubmit?: boolean,
    value: SpatialBounds | null,
    otherValues: {
        wmsLayerName: string,
        wmsLayerSlug: string,
        wmsLayerUrl: string,
    },
    valueChanged: Function,
    geoServerError: boolean,
    showGeoServerError: Function,
    onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur?: () => void,
};

// Validator
export const spatialBoundsValidator = (fieldValue: SpatialBoundsProps['value']) => {
    if (fieldValue === null) {
        return true;
    }
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

const SpatialBoundsField  =  (props: SpatialBoundsProps) => {

    const {
        title,
        name,
        value,
        otherValues,
        valueChanged,
        geoServerError,
        showGeoServerError,
        triedToSubmit,
        onFocus,
        onBlur,
    } = props;

    const {
        wmsLayerSlug,
        wmsLayerUrl,
    } = otherValues;

    const northInput = useRef<HTMLInputElement>(null);
    const eastInput = useRef<HTMLInputElement>(null);
    const southInput = useRef<HTMLInputElement>(null);
    const westInput = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
        if (
            northInput && northInput.current &&
            southInput && southInput.current &&
            eastInput && eastInput.current &&
            westInput && westInput.current
        ) {
            if (value===null) {
                northInput.current.setCustomValidity('');
                southInput.current.setCustomValidity('');
                eastInput.current.setCustomValidity('');
                westInput.current.setCustomValidity('');
                return
            }

            if ((isNaN(value.north) || isNaN(value.east) || isNaN(value.south) || isNaN(value.west))) {
                northInput.current.setCustomValidity('Fields must be either all empty or all filled');
                southInput.current.setCustomValidity('');
                eastInput.current.setCustomValidity('');
                westInput.current.setCustomValidity('');
                // return here because otherwise we have to check lateron for each field seperately again i it is NaN
                return;
            } else {
                northInput.current.setCustomValidity('');
            }
            if (value.north < value.south) {
                southInput.current.setCustomValidity('South coordinate must be smaller than North coordinate');
            } else {
                southInput.current.setCustomValidity('');
            }
            if (value.east < value.west) {
                eastInput.current.setCustomValidity('East coordinate must be greater than West coordinate');
            } else {
                eastInput.current.setCustomValidity('');
            }
        }
    });

    const updateSpatialBounds = (key: string, value: string) => {
        let tempValue: SpatialBounds | null;
        if (props.value === null) {
            tempValue = {
                north: NaN,
                east: NaN,
                south: NaN,
                west: NaN,
            }
        } else {
            tempValue = {...props.value}
        }

        tempValue = {
            ...tempValue,
            [key]: parseFloat(value)
        }
        if (
            isNaN(tempValue.north) &&
            isNaN(tempValue.east) &&
            isNaN(tempValue.south) &&
            isNaN(tempValue.west)
        ) {
            props.valueChanged(null);
        } else {
            props.valueChanged(tempValue);
        }
    }

    const removeSpatialBounds = () => {
        props.valueChanged(null);
    }

    return (
        <label
          htmlFor={name}
          className={formStyles.Label}
        >
            <span className={formStyles.LabelTitle}>
                {title}
            </span>
            <div
                className={
                    formStyles.FormGroup +
                    " " +
                    inputStyles.PositionRelative
                }
            >
                <div
                    className={
                        styles.InputFields +
                        " " +
                        styles.TextAlignCenter
                    }
                >
                    <label
                        // we do not use label class below because this wraps text to a newline. Should fix that later.
                        // className={formStyles.Label}
                    >
                        <FormattedMessage id="wms_layer_form.north" defaultMessage="North" />
                        &nbsp;(&deg;)
                    </label>
                    <input
                        id={name}
                        name="north"
                        type="number"
                        className={`${formStyles.FormControl} ${triedToSubmit ? formStyles.FormSubmitted : ''}`}
                        value={north}
                        onChange={(e) => updateSpatialBounds('north', e.target.value)}
                        ref={northInput}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                </div>
                <div
                    className={
                        styles.InputFields +
                        " " +
                        styles.TextAlignCenter
                    }
                >
                    <label>
                        <FormattedMessage id="wms_layer_form.east" defaultMessage="East" />
                        &nbsp;(&deg;)
                    </label>
                    <input
                        id={name}
                        name="east"
                        type="number"
                        className={`${formStyles.FormControl} ${triedToSubmit ? formStyles.FormSubmitted : ''}`}
                        value={east}
                        onChange={(e) => updateSpatialBounds('east', e.target.value)}
                        ref={eastInput}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                </div>
                <div
                    className={
                        styles.InputFields +
                        " " +
                        styles.TextAlignCenter
                    }
                >
                    <label>
                        <FormattedMessage id="wms_layer_form.south" defaultMessage="South" />
                        &nbsp;(&deg;)
                    </label>
                    <input
                        id={name}
                        name="south"
                        type="number"
                        className={`${formStyles.FormControl} ${triedToSubmit ? formStyles.FormSubmitted : ''}`}
                        value={south}
                        onChange={(e) => updateSpatialBounds('south', e.target.value)}
                        ref={southInput}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                </div>
                <div
                    className={
                        styles.InputFields +
                        " " +
                        styles.TextAlignCenter
                    }
                >
                    <label>
                        <FormattedMessage id="wms_layer_form.west" defaultMessage="West" />
                        &nbsp;(&deg;)
                    </label>
                    <input
                        id={name}
                        name="west"
                        type="number"
                        className={`${formStyles.FormControl} ${triedToSubmit ? formStyles.FormSubmitted : ''}`}
                        value={west}
                        onChange={(e) => updateSpatialBounds('west', e.target.value)}
                        ref={westInput}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                </div>
                <ClearInputButton onClick={() => removeSpatialBounds()}/>
            </div>
            <div className={styles.GetFromGeoServer}>
                <button
                    className={styles.AddThresholdButton}
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
                        defaultMessage="Get from source"
                    />
                </button>
                &nbsp;
                <span
                    className={styles.GetFromGeoServerError}
                    style={{
                        display: geoServerError ? 'block' : 'none'
                    }}
                >
                    Failed to get extent from source
                </span>
            </div>
        </label>
    );
}

export default  SpatialBoundsField;
