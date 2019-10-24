import React, { Component } from "react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import styles from './Snoozing.css';
import formStyles from "../styles/Forms.css";

interface MyProps {
    name: string,
    value: {
        snooze_sign_on: number,
        snooze_sign_off: number
    },
    placeholder?: string,
    validators?: Function[],
    validated: boolean,
    handleEnter: (e: any) => void,
    valueChanged: Function,
    wizardStyle: boolean,
    readOnly?: boolean
};

class SnoozingInput extends Component<MyProps & InjectedIntlProps> {
    handleSnoozeSignOn = (e: any) => {
        this.props.valueChanged({
            snooze_sign_on: parseFloat(e.target.value),
            snooze_sign_off: this.props.value.snooze_sign_off
        });
    }
    handleSnoozeSignOff = (e: any) => {
        this.props.valueChanged({
            snooze_sign_on: this.props.value.snooze_sign_on,
            snooze_sign_off: parseFloat(e.target.value)
        });
    }

    componentDidMount() {
        if (!this.props.value) {
            this.props.valueChanged({
                snooze_sign_on: 1,
                snooze_sign_off: 1
            });
        };
    }

    render() {
        if (!this.props.value) return <div/>;

        const {
            snooze_sign_on,
            snooze_sign_off
        } = this.props.value;

        return (
            <div className={styles.Snoozing}>
                <div>
                    <span>Snooze alarm after</span>
                    <input
                        type="number"
                        min="1"
                        id="snooze_sign_on"
                        value={snooze_sign_on}
                        className={formStyles.FormControlSmall}
                        onChange={this.handleSnoozeSignOn}
                    />
                    <span>{snooze_sign_on > 1 ? "times" : "time"}</span>
                </div>
                <div>
                    <span>Snooze "No further impact" after</span>
                    <input
                        type="number"
                        min="1"
                        id="snooze_sign_off"
                        value={snooze_sign_off}
                        className={formStyles.FormControlSmall}
                        onChange={this.handleSnoozeSignOff}
                    />
                    <span>{snooze_sign_off > 1 ? "times" : "time"}</span>
                </div>
            </div>
        )
    }
}

export default injectIntl(SnoozingInput);