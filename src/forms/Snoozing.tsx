import React, { Component } from "react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import styles from './Snoozing.css';
import formStyles from "../styles/Forms.css";

interface MyState {
    snooze_sign_on: number,
    snooze_sign_off: number,
};

class SnoozingInput extends Component<InjectedIntlProps, MyState> {
    state: MyState = {
        snooze_sign_on: 1,
        snooze_sign_off: 1,
    }
    handleSnoozeSignOn = (e: any) => {
        this.setState({
            snooze_sign_on: parseFloat(e.target.value)
        });
    }
    handleSnoozeSignOff = (e: any) => {
        this.setState({
            snooze_sign_off: parseFloat(e.target.value)
        });
    }

    render() {
        const {
            snooze_sign_on,
            snooze_sign_off
        } = this.state;

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