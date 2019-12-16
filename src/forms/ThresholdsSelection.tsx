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
    thresholdValue: number | '',
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
        const value = e.target.value ? parseFloat(e.target.value) : '';
        this.setState({
            thresholdValue: value
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
            <table className={styles.ThresholdsTable}>
                <thead>
                    <th
                        colSpan={2}
                        className={styles.Comparision}
                    >
                        <FormattedMessage
                            id="notifications_app.comparison"
                            defaultMessage="Comparison"
                        />
                    </th>
                    <tr>
                        <td>
                            <button
                                className={comparison === ">" ? (
                                    `${styles.SelectedButton}`
                                ) : (
                                    `${styles.SelectedButton} ${styles.UnselectedButton}`
                                )}
                                onClick={() => valueChanged({
                                    comparison: ">",
                                    thresholds: thresholds
                                })}
                            >
                                <FormattedMessage
                                    id="notifications_app.higher_than"
                                    defaultMessage="higher than"
                                />
                                &nbsp;&gt;
                            </button>
                        </td>
                        <td>
                            <button
                                className={comparison === "<" ? (
                                    `${styles.SelectedButton}`
                                ) : (
                                    `${styles.SelectedButton} ${styles.UnselectedButton}`
                                )}
                                onClick={() => valueChanged({
                                    comparison: "<",
                                    thresholds: thresholds
                                })}
                            >
                                <FormattedMessage
                                    id="notifications_app.lower_than"
                                    defaultMessage="lower than"
                                />
                                &nbsp;&lt;
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.ThresholdLabel}>
                            <FormattedMessage
                                id="notifications_app.threshold_value"
                                defaultMessage="Value"
                            />
                        </td>
                        <td className={styles.ThresholdLabel}>
                            <FormattedMessage
                                id="notifications_app.threshold_name"
                                defaultMessage="Name"
                            />
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {thresholds.sort((a, b) =>
                        a.value - b.value
                    ).map((threshold, i) => (
                        <tr key={i}>
                            <td className={styles.ThresholdValue}>
                                {comparison} {threshold.value}
                            </td>
                            <td className={styles.ThresholdName}>
                                <span className={styles.ThresholdNameText}>
                                    {threshold.warning_level}
                                </span>
                                <span
                                    className={styles.ThresholdDelete}
                                    onClick={() => this.handleRemoveThreshold(i)}
                                >
                                    &#10007;
                                </span>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <input
                                type="number"
                                id="value"
                                value={thresholdValue}
                                className={formStyles.FormControlSmall}
                                onChange={this.handleChangeThresholdValue}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                id="warning_label"
                                value={thresholdName}
                                className={formStyles.FormControlSmall}
                                onChange={this.handleChangeThresholdName}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <button
                                className={comparison && thresholdValue !== null && thresholdName ? (
                                    `${styles.AddThresholdButton}`
                                ) : (
                                    `${styles.AddThresholdButton} ${styles.InactiveAddThresholdButton}`
                                )}
                                onClick={() => comparison && thresholdValue !== null && thresholdName ?
                                    this.handleAddThreshold(
                                        thresholdValue, thresholdName
                                    ) : null
                                }
                            >
                                <FormattedMessage
                                    id="notifications_app.add_thresholds"
                                    defaultMessage="Save threshold"
                                />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

export default injectIntl(ThresholdsSelectionInput);