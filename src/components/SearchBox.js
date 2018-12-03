import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import Ink from "react-ink";
import buttonStyles from "../styles/Buttons.css";
import formStyles from "../styles/Forms.css";
import clearInputStyles from "./ClearInputButton.css";

class SearchBox extends Component {
  handleEnter(event) {
    if (event.keyCode === 13) {
      // 13 is keycode 'enter' (works only when current input validates)
      this.props.handleSearch(this.props.searchTerms);
    }
  }

  render() {
    const { searchTerm, handleSearch } = this.props;

    return (
      <div
        style={{
          // align search button on same line as input search field
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start"
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <input
            type="text"
            placeholder={searchTerm}
            value={this.props.searchTerms}
            className={formStyles.FormControl}
            style={{
              // make sure input field has same height as search button
              padding: "6px",
              // right corners will touch button, remove these rounded corners added by FormStyles
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px"
            }}
            onChange={e => {
              this.props.setSearchTerms(e.target.value);
            }}
            onKeyUp={e => this.handleEnter(e)}
          />

          <i
            className={`${clearInputStyles.ClearInput} material-icons`}
            style={{ right: "6px" }}
            onClick={() => {
              this.props.setSearchTerms(this.props.searchTerms);
              this.props.handleSearch("");
            }}
          >
            clear
          </i>
        </div>
        <button
          type="button"
          className={`${buttonStyles.Button} ${buttonStyles.Success}`}
          onClick={e => handleSearch(this.props.searchTerms)}
        >
          <FormattedMessage id="search" defaultMessage="Search" />
          <Ink />
        </button>
      </div>
    );
  }
}

export default SearchBox;
