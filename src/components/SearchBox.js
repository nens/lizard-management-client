import React, { Component } from "react";
import styles from "./SearchBox.css";
import { FormattedMessage } from "react-intl";
import Ink from "react-ink";
import buttonStyles from "../styles/Buttons.css";
import formStyles from "../styles/Forms.css";

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localSearchTerms: ""
    };
  }

  render() {
    const { searchTerm, handleSearch } = this.props;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start"
        }}
      >
        {/* <label>SEARCH</label> */}
        <input
          // style={{float: 'left'}}
          type="text"
          placeholder={searchTerm}
          value={this.state.localSearchTerms}
          className={formStyles.FormControl}
          style={{
            padding: "6px",
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            float: "left"
          }}
        />
        <button
          type="button"
          style={{ float: "left" }}
          className={`${buttonStyles.Button} ${buttonStyles.Success}`}
          onClick={e => handleSearch(searchTerm)}
        >
          <FormattedMessage id="search" defaultMessage="Search" />
          <Ink />
        </button>
      </div>
    );
  }
}

export default SearchBox;
