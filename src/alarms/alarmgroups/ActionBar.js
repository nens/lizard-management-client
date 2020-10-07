import React, { Component } from "react";
// import Ink from "react-ink";
// import { FormattedMessage } from "react-intl";
import formStyles from "../../styles/Forms.module.css";
import styles from "./ActionBar.module.css";

class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showManageContacts: false,
      showGroupSettings: false
    };
    this.handleDeleteSelected = this.handleDeleteSelected.bind(this);
    this.handleSelectAllCheckboxes = this.handleSelectAllCheckboxes.bind(this);
    this.handleDeselectAllCheckboxes = this.handleDeselectAllCheckboxes.bind(
      this
    );
    this.toggleManageContacts = this.toggleManageContacts.bind(this);
    this.toggleGroupSettings = this.toggleGroupSettings.bind(this);
  }

  toggleManageContacts() {
    this.setState({
      showManageContacts: !this.state.showManageContacts,
      showGroupSettings: false
    });
  }

  toggleGroupSettings() {
    this.setState({
      showGroupSettings: !this.state.showGroupSettings,
      showManageContacts: false
    });
  }

  handleSelectAllCheckboxes() {
    this.setState(
      {
        showManageContacts: false
      },
      () => {
        document
          .querySelectorAll("input[type=checkbox]")
          .forEach(checkbox => (checkbox.checked = true));
      }
    );
  }

  handleDeselectAllCheckboxes() {
    this.setState(
      {
        showManageContacts: false
      },
      () => {
        document
          .querySelectorAll("input[type=checkbox]")
          .forEach(checkbox => (checkbox.checked = false));
      }
    );
  }

  handleDeleteSelected() {
    const checkboxes = [
      ...document.querySelectorAll("input[type=checkbox]:checked")
    ];
    const values = checkboxes.map(cb => cb.value);

    if (window.confirm("Are you sure?")) {
      this.props.doDeleteContactsById(values);
    }
  }

  render() {
    const { showGroupSettings, showManageContacts } = this.state;
    return (
      <div className={styles.ActionBar}>
        <div className={styles.ActionBarItemsWrapper}>
          <div
            style={{ display: "none" }}
            className={styles.ActionBarItem}
            onClick={this.toggleManageContacts}
          >
            <i className="material-icons">keyboard_arrow_down</i>Manage contacts
            {showManageContacts ? (
              <div className={styles.DropDown}>
                <div
                  className={styles.DropDownItem}
                  onClick={this.handleSelectAllCheckboxes}
                >
                  Select all
                </div>
                <div
                  className={styles.DropDownItem}
                  onClick={this.handleDeselectAllCheckboxes}
                >
                  De-select all
                </div>
                <div
                  className={styles.DropDownItem}
                  onClick={this.handleDeleteSelected}
                >
                  Delete selected
                </div>
              </div>
            ) : null}
          </div>
          <div
            className={styles.ActionBarItem}
            onClick={this.toggleGroupSettings}
          >
            <i className="material-icons">keyboard_arrow_down</i>Group settings
            {showGroupSettings ? (
              <div className={styles.DropDown}>
                <div
                  className={styles.DropDownItem}
                  onClick={() => this.props.showGroupMessageModal()}
                >
                  Send message
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.Search}>
          <input
            style={{ display: "none" }}
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
