import formStyles from "../../styles/Forms.module.css";
import React, { Component } from "react";
import styles from "./ActionBar.module.css";
import { FormattedMessage } from "react-intl";

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
            <i className="material-icons">keyboard_arrow_down</i>
            <FormattedMessage
              id="contacts_app.manage_contacts"
              defaultMessage="Manage contacts"
            />
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
