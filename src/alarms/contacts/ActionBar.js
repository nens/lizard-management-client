import React, { Component } from "react";
// import Ink from "react-ink";
// import { FormattedMessage } from "react-intl";
import formStyles from "../../styles/Forms.css";
import styles from "./ActionBar.css";

class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { handleFilter } = this.props;
    return (
      <div className={styles.ActionBar}>
        <div className={styles.ActionBarItemsWrapper}>
          <div
            className={styles.ActionBarItem}
            onClick={this.toggleManageContacts}
          >
            <i className="material-icons">keyboard_arrow_down</i>Manage contacts
          </div>
        </div>
        <div className={styles.Search}>
          <input
            onChange={handleFilter}
            className={`${formStyles.FormControlSmall}`}
            type="text"
            placeholder="Type to filter"
          />
        </div>
      </div>
    );
  }
}

export default ActionBar;
