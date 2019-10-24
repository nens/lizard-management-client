import React, { Component } from "react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import SelectBoxSearch from "../components/SelectBoxSearch";
import formStyles from "../styles/Forms.css";
import styles from './ThresholdsSelection.css';

interface Threshold {
    value: number,
    name: string
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

class ThresholdsSelectionInput extends Component<MyProps & InjectedIntlProps, MyState> {
    state: MyState = {
        thresholdValue: 0,
        thresholdName: "",
    }
    handleAddThreshold(value: any, name: string) {
        this.props.valueChanged({
            comparison: this.props.value.comparison,
            thresholds: [
                ...this.props.value.thresholds,
                {
                    value,
                    name
                }
            ]
        })
        this.setState({
            thresholdValue: 0,
            thresholdName: ""
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

    componentDidMount() {
        if (this.props.value === undefined || this.props.value === null) {
            this.props.valueChanged({
                comparison: "",
                thresholds: []
            });
        };
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
                                higher than &gt;
                            </button>
                            <label htmlFor="value">
                                Value
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
                                lower than &lt;
                            </button>
                            <label htmlFor="warning_label">
                                Name
                            </label>
                            <div className={styles.ThresholdNames}>
                                {thresholds.map((threshold, i) => (
                                    <div key={i}>
                                        <span>{threshold.name}</span>
                                        <span
                                            className={styles.ThresholdDelete}
                                            onClick={() => thresholds.splice(i, 1)}
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
                            comparison && thresholdValue && thresholdName ?
                                `${styles.AddThresholdButton}`
                                :
                                `${styles.AddThresholdButton} ${styles.InactiveAddThresholdButton}`
                        }
                        onClick={() => {
                            return comparison && thresholdValue && thresholdName ? this.handleAddThreshold(
                                thresholdValue, thresholdName
                            ) : null
                        }}
                    >
                        {comparison !== "" ? "ADD THRESHOLD" : "NEW THRESHOLD"}
                    </button>
                </div>
            </div>
        )
    }
}

export default injectIntl(ThresholdsSelectionInput);