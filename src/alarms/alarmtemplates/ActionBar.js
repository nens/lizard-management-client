import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import formStyles from "../../styles/Forms.module.css";
import styles from "./ActionBar.module.css";

class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showManageContacts: false,
      showGroupSettings: false
    };
    this.handleCheckboxes = this.handleCheckboxes.bind(this);
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

  handleCheckboxes(e) {
    const checkboxes = [
      ...document.querySelectorAll("input[type=checkbox]:checked")
    ];
    const values = checkboxes.map(cb => cb.value);
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
    const { showManageContacts } = this.state;
    return (
      <div className={styles.ActionBar}>
        <div className={styles.ActionBarItemsWrapper}>
          <div
            className={styles.ActionBarItem}
            onClick={this.toggleManageContacts}
          >
            <i className="material-icons">keyboard_arrow_down</i>
            <FormattedMessage
              id="alarmtemplates_app.manage_templates"
              defaultMessage="Manage templates"
            />

            {showManageContacts ? (
              <div className={styles.DropDown}>
                <div
                  className={styles.DropDownItem}
                  onClick={this.handleSelectAllCheckboxes}
                >
                  <FormattedMessage
                    id="alarmtemplates_app.select_all"
                    defaultMessage="Select all"
                  />
                </div>
                <div
                  className={styles.DropDownItem}
                  onClick={this.handleDeselectAllCheckboxes}
                >
                  <FormattedMessage
                    id="alarmtemplates_app.deselect_all"
                    defaultMessage="Deselect all"
                  />
                </div>
                <div
                  className={styles.DropDownItem}
                  onClick={this.handleDeleteSelected}
                >
                  <FormattedMessage
                    id="alarmtemplates_app.delete_selected"
                    defaultMessage="Delete selected"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.Search}>
          <input
            onChange={this.props.handleFilter}
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
