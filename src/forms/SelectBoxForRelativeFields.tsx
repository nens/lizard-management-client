import React, { Component } from "react";
import Scrollbars from "react-custom-scrollbars";

import ClearInputButton from "./ClearInputButton";

import displayStyles from "../styles/Display.css";
import styles from "./SelectBox.css";
import formStyles from "../styles/Forms.css";
import inputStyles from "../styles/Input.css";

interface MyProps {
    updateDurationSign: Function
}

interface MyState {
    showChoices: boolean,
    value: number | null
}

type ChoiceT = [number, string, string];

export default class SelectBoxForRelativeFields extends Component<MyProps, MyState> {
    state: MyState = {
        showChoices: false,
        value: null
    }

    choices: ChoiceT[] = [
        [0, "Before", "Set the start/end of the simulation period from the past"],
        [1, "After", "Set the start/end of the simulation period from now or future"]
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
        // Clear input and close choices
        this.setState({
            showChoices: false,
            value: null
        });
        this.props.updateDurationSign(null);
    }

    render() {
        const {
            showChoices,
            value
        } = this.state;

        const { choices } = this;

        const { updateDurationSign } = this.props;
        
        return (
            <div className={`${styles.SelectGeneralClass} form-input`}>
                <input
                    style={{ caretColor: "transparent" }}
                    id={`selectbox-${name}`}
                    tabIndex={-1}
                    type="text"
                    autoComplete="false"
                    className={formStyles.FormControl}
                    value={value !== null ? choices[value][1] : ""}
                    onClick={() => this.toggleChoices()}
                    onKeyUp={par => this.handleKeyUp(par)}
                    // onChange={() => {updateDurationSign}}
                    // readOnly={true}
                    // disabled={true}
                />
                {
                    value !== null ? (
                        <ClearInputButton onClick={() => this.clearInput()}/>
                    ) : (
                        <ClearInputButton
                            icon="arrow_drop_down"
                            onClick={() => this.toggleChoices()}
                        />
                    )
                }
                {showChoices ? (
                    <div className={styles.Results}>
                        <Scrollbars autoHeight autoHeightMin={50} autoHeightMax={400}>
                            {choices.map((choice, i) => {
                                const choiceValue = choice[0];
                                const choiceDisplay = choice[1];
                                const choiceDescription = choice[2];
                                const isSelected = choiceValue === value;
                                return (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "start"
                                        }}
                                        tabIndex={i + 1}
                                        key={"" + choiceValue + i}
                                        className={`${styles.ResultRow} ${isSelected
                                            ? styles.Active
                                            : styles.Inactive}`}
                                        onMouseDown={e => {
                                            this.setState({
                                                showChoices: false,
                                                value: choiceValue
                                            });
                                            updateDurationSign(choiceDisplay)
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
                        </Scrollbars>
                    </div>
                ) : null}
            </div>
        )
    };
};