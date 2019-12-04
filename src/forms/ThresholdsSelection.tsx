import React, { Component } from "react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import formStyles from "../styles/Forms.css";
import styles from './ThresholdsSelection.css';
import { validatorResult } from "./validators";

interface Threshold {
    value: number,
    warning_level: string
};

interface MyProps {
    name: string,
    value: {
        comparison: string,
        thresholds: Threshold[]
    },
    placeholder?: string,
    validators?: Function[],
    validated: boolean,
    handleEnter: (e: any) => void,
    valueChanged: Function,
    wizardStyle: boolean,
    readOnly?: boolean
};

interface MyState {
    thresholdValue: number,
    thresholdName: string,
};

// Validator for this component

 export const thresholdSelection = (value: Threshold[]): validatorResult => {
    if (value.length === 0) {
        return "Please add at least one threshold to the alarm"
    }
    return false;
};

class ThresholdsSelectionInput extends Component<MyProps & InjectedIntlProps, MyState> {
    state: MyState = {
        thresholdValue: 0,
        thresholdName: "",
    }
    handleAddThreshold(value: any, warning_level: string) {
        this.props.valueChanged({
            comparison: this.props.value.comparison,
            thresholds: [
                ...this.props.value.thresholds,
                {
                    value,
                    warning_level
                }
            ]
        })
        this.setState({
            thresholdValue: 0,
            thresholdName: ""
        });
    }
    handleRemoveThreshold = (index: number) => {
        this.props.valueChanged({
            comparison: this.props.value.comparison,
            thresholds: this.props.value.thresholds.filter((threshold, i) => i !== index)
        });
    }
    handleChangeThresholdValue = (e: any) => {
        this.setState({
            thresholdValue: parseFloat(e.target.value)
        });
    }
    handleChangeThresholdName = (e: any) => {
        this.setState({
            thresholdName: e.target.value
        });
    }

    render() {
        const {
            thresholdName,
            thresholdValue
        } = this.state;

        const {
            value,
            valueChanged
        } = this.props;

        if (!value) return <div/>;

        const { comparison, thresholds } = value;

        return (
            <div>
                <div className={styles.AddThreshold}>
                    <label htmlFor="comparison" className={styles.Comparision}>
                        <FormattedMessage
                            id="notifications_app.comparison"
                            defaultMessage="Comparison"
                        />
                    </label>
                    <div className={styles.ThresholdInput}>
                        <div className={styles.ThresholdValueInput}>
                            <button
                                className={
                                    comparison === ">" ?
                                        `${styles.SelectedButton}`
                                        :
                                        `${styles.SelectedButton} ${styles.UnselectedButton}`
                                }
                                onClick={() => valueChanged({
                                        comparison: ">",
                                        thresholds: thresholds
                                    })
                                }
                            >
                                <FormattedMessage
                                    id="notifications_app.higher_than"
                                    defaultMessage="higher than"
                                />
                                &nbsp;&gt;
                            </button>
                            <label htmlFor="value">
                                <FormattedMessage
                                    id="notifications_app.threshold_value"
                                    defaultMessage="Value"
                                />
                            </label>
                            <div className={styles.ThresholdValues}>
                                {thresholds.map((threshold, i) => <div key={i}>{comparison} {threshold.value}</div>)}
                            </div>
                            <input
                                type="number"
                                id="value"
                                value={thresholdValue}
                                className={formStyles.FormControlSmall}
                                onChange={this.handleChangeThresholdValue}
                            />
                        </div>
                        <div className={styles.ThresholdNameInput}>
                            <button
                                className={
                                    comparison === "<" ?
                                        `${styles.SelectedButton}`
                                        :
                                        `${styles.SelectedButton} ${styles.UnselectedButton}`
                                }
                                onClick={() => valueChanged({
                                        comparison: "<",
                                        thresholds: thresholds
                                    })
                                }
                            >
                                <FormattedMessage
                                    id="notifications_app.lower_than"
                                    defaultMessage="lower than"
                                />
                                &nbsp;&lt;
                            </button>
                            <label htmlFor="warning_label">
                                <FormattedMessage
                                    id="notifications_app.threshold_name"
                                    defaultMessage="Name"
                                />
                            </label>
                            <div className={styles.ThresholdNames}>
                                {thresholds.map((threshold, i) => (
                                    <div key={i}>
                                        <span 
                                            className={styles.ThresholdName}
                                            title={threshold.warning_level}
                                        >
                                            {threshold.warning_level}
                                        </span>
                                        <span
                                            className={styles.ThresholdDelete}
                                            onClick={() => this.handleRemoveThreshold(i)}
                                        >
                                            &#10007;
                                      </span>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="text"
                                id="warning_label"
                                value={thresholdName}
                                className={formStyles.FormControlSmall}
                                onChange={this.handleChangeThresholdName}
                            />
                        </div>
                    </div>
                    <button
                        className={
                            comparison && thresholdValue !== null && thresholdName ?
                                `${styles.AddThresholdButton}`
                                :
                                `${styles.AddThresholdButton} ${styles.InactiveAddThresholdButton}`
                        }
                        onClick={() => {
                            return comparison && thresholdValue !== null && thresholdName ? this.handleAddThreshold(
                                thresholdValue, thresholdName
                            ) : null
                        }}
                    >
                        <FormattedMessage
                            id="notifications_app.add_thresholds"
                            defaultMessage="Save threshold"
                        />
                    </button>
                </div>
            </div>
        )
    }
}

export default injectIntl(ThresholdsSelectionInput);