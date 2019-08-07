import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import Ink from "react-ink";
import buttonStyles from "../styles/Buttons.css";
import formStyles from "../styles/Forms.css";
import clearInputStyles from "./ClearInputButton.css";

class SearchBox extends Component {

  handleEnter(event) {
    if (event.keyCode === 13) {
      // 13 is keycode 'enter' (works only when current input validates)
      this.props.handleSearchEnter(this.props.searchTerms);
    }
  }

  render() {
    const { searchTerms, handleSearchEnter, handleSearchOnBlur, handleSearchClear, intl } = this.props;

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
            placeholder={searchTerms}
            value={searchTerms}
            className={formStyles.FormControl}
            style={{
              // make sure input field has same height as search button
              padding: "6px",
              paddingLeft: "35px",
              paddingRight: "25px"
              // dit zijn de borders aan de searchbutton. Searchbutton is nu verborgen, maar zetten we later misschien terug of achter boolean
              // right corners will touch button, remove these rounded corners added by FormStyles
              // borderTopRightRadius: "0px",
              // borderBottomRightRadius: "0px"
            }}
            onChange={e => {
              this.props.setSearchTerms(e.target.value);
            }}
            onKeyUp={e => this.handleEnter(e)}
            title={intl.formatMessage({ id: "Search in name and description" })}
            onBlur={e => {
              this.props.handleSearchOnBlur(this.props.searchTerms);
            }}
          />

          <i
            className={`${clearInputStyles.ClearInput} material-icons`}
            style={
              this.props.searchTerms === ""
                ? { right: "6px", display: "none" }
                : { right: "6px" }
            }
            onClick={() => {
              this.props.handleSearchClear("");
            }}
          >
            clear
          </i>
          <i
            className={`${clearInputStyles.ClearInput} material-icons`}
            style={{ left: "6px", fontSize: "30px", pointerEvents: "none" }}
          >
            search
          </i>
        </div>
        {/* button is currenlty not shown, but will later maybe be used again for server-side search */}
        <button
          style={{ display: "none" }}
          type="button"
          className={`${buttonStyles.Button} ${buttonStyles.Success}`}
          onClick={e => handleSearchEnter(searchTerms)}
        >
          <FormattedMessage id="search" defaultMessage="Search" />
          <Ink />
        </button>
      </div>
    );
  }
}

export default injectIntl(SearchBox);
