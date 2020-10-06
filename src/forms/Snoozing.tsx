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
    readOnly?: boolean,
    initial: {
        snooze_sign_on: number,
        snooze_sign_off: number
    }
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

    render() {
        if (!this.props.value) return <div/>;

        const {
            snooze_sign_on,
            snooze_sign_off
        } = this.props.value;

        return (
            <div className={styles.Snoozing}>
                <div>
                    <span>
                        <FormattedMessage 
                            id="notifications_app.snooze_alarm_after"
                            defaultMessage="Snooze alarm after"
                        />
                    </span>
                    <input
                        type="number"
                        min="1"
                        id="snooze_sign_on"
                        value={snooze_sign_on}
                        className={formStyles.FormControlSmall}
                        onChange={this.handleSnoozeSignOn}
                    />
                    <span>
                        <FormattedMessage
                            id="notifications_app.snoozing_tijd_sign_on"
                            defaultMessage={`{snooze_sign_on, plural, one {time} other {times}}`}
                            values={{
                                snooze_sign_on
                            }}
                        />
                    </span>
                </div>
                <div>
                    <span>
                        <FormattedMessage 
                            id="notifications_app.snooze_no_further_impact"
                            defaultMessage='Snooze "No further impact" after'
                        />
                    </span>
                    <input
                        type="number"
                        min="1"
                        id="snooze_sign_off"
                        value={snooze_sign_off}
                        className={formStyles.FormControlSmall}
                        onChange={this.handleSnoozeSignOff}
                    />
                    <span>
                        <FormattedMessage
                            id="notifications_app.snoozing_tijd_sign_off"
                            defaultMessage={`{snooze_sign_off, plural, one {time} other {times}}`}
                            values={{
                                snooze_sign_off
                            }}
                        />
                    </span>
                </div>
            </div>
        )
    }
}

export default injectIntl(SnoozingInput);