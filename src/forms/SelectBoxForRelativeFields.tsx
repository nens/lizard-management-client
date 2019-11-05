import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import ClearInputButton from "./ClearInputButton";
import styles from "./SelectBox.css";
import formStyles from "../styles/Forms.css";

interface MyProps {
    currentSelection: "Before" | "After" | null,
    updateCurrentSelection: Function
}

interface MyState {
    showChoices: boolean
}

type ChoiceT = [string, any];

export default class SelectBoxForRelativeFields extends Component<MyProps, MyState> {
    state: MyState = {
        showChoices: false
    }

    choices: ChoiceT[] = [
        ["Before", <FormattedMessage id="notifications_app.relative_field_before" />],
        ["After", <FormattedMessage id="notifications_app.relative_field_after" />]
    ]

    toggleChoices = (): void => {
        this.setState({
            showChoices: !this.state.showChoices
        });
    }

    handleKeyUp = (e: any): void => {
        if (e.key === "Escape") {
            this.setState({ showChoices: false });
        };
    }

    clearInput = (): void => {
        this.setState({
            showChoices: false
        });
        this.props.updateCurrentSelection(null);
    }

    render() {
        const {
            showChoices
        } = this.state;

        const { choices } = this;

        const {
            currentSelection,
            updateCurrentSelection
        } = this.props;

        return (
            <div className={`${styles.SelectGeneralClass} form-input`}>
                <input
                    style={{ caretColor: "transparent" }}
                    id={`selectbox-${name}`}
                    tabIndex={-1}
                    type="text"
                    autoComplete="false"
                    className={formStyles.FormControl}
                    value={currentSelection !== null ? currentSelection : ""}
                    onClick={() => this.toggleChoices()}
                    onKeyUp={par => this.handleKeyUp(par)}
                    onChange={() => {}}
                />
                {
                    currentSelection !== null ? (
                        <ClearInputButton onClick={() => this.clearInput()} />
                    ) : (
                            <ClearInputButton
                                icon="arrow_drop_down"
                                onClick={() => this.toggleChoices()}
                            />
                        )
                }
                {showChoices ? (
                    <div className={styles.Results}>
                        {choices.map((choice, i) => {
                            const choiceDisplay = choice[0];
                            const choiceDescription = choice[1];
                            const isSelected = choiceDisplay === currentSelection;
                            return (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "start"
                                    }}
                                    tabIndex={i + 1}
                                    key={i}
                                    className={`${styles.ResultRow} ${isSelected
                                        ? styles.Active
                                        : styles.Inactive}`}
                                    onMouseDown={e => {
                                        this.setState({
                                            showChoices: false
                                        });
                                        updateCurrentSelection(choiceDisplay)
                                    }}
                                >
                                    <div style={{ flex: "1" }}>{choiceDisplay}</div>
                                    <div
                                        style={{
                                            flex: "2",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        <i>{choiceDescription}</i>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        )
    };
};